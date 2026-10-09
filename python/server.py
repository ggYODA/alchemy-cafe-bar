"""
============================================
ALCHEMY CAFE BAR — Reviews Backend Server
Python 3 + Flask + SSE (Server-Sent Events)
============================================

Run:
    python server.py

API Endpoints:
    GET  /api/reviews        — get all reviews + count
    GET  /api/reviews/count  — get only count
    POST /api/reviews        — add new review (JSON: name, rating, text)
    GET  /api/reviews/stream — SSE stream for real-time updates
"""

import json
import os
import time
import threading
from datetime import datetime, timezone
from flask import Flask, request, jsonify, Response, send_from_directory
from flask_cors import CORS

# ---- Configuration ----
PORT = 3000
DATA_FILE = os.path.join(os.path.dirname(__file__), 'data', 'reviews.json')
STATIC_DIR = os.path.join(os.path.dirname(__file__), '..')  # Parent folder with the site

app = Flask(__name__, static_folder=None)
CORS(app)  # Allow CORS for all origins

# ---- SSE clients list (for real-time broadcasting) ----
sse_clients = []
sse_lock = threading.Lock()


# ============================================
# UTILITIES: read/write reviews file
# ============================================

def read_reviews():
    """Read reviews from JSON file. Returns empty list if file not found."""
    try:
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)
            return data.get('reviews', [])
    except (FileNotFoundError, json.JSONDecodeError) as e:
        print(f"⚠ Error reading reviews file: {e}")
        return []


def write_reviews(reviews):
    """Write reviews array back to JSON file."""
    os.makedirs(os.path.dirname(DATA_FILE), exist_ok=True)
    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump({'reviews': reviews}, f, ensure_ascii=False, indent=2)


def broadcast_sse(event, payload):
    """
    Send event to all connected SSE clients.
    event  — event name (e.g., 'new-review')
    payload — data dict to send
    """
    message = f"event: {event}\ndata: {json.dumps(payload, ensure_ascii=False)}\n\n"
    with sse_lock:
        # Remove dead clients and send to others
        dead = []
        for i, q in enumerate(sse_clients):
            try:
                q.append(message)
            except Exception:
                dead.append(i)
        for i in reversed(dead):
            sse_clients.pop(i)


# ============================================
# STATIC FILE SERVING (site from parent folder)
# ============================================

@app.route('/')
def serve_index():
    """Serve the main page (index.html)."""
    return send_from_directory(STATIC_DIR, 'html/index.html')


@app.route('/<path:filename>')
def serve_static(filename):
    """Serve any static file (CSS, JS, images)."""
    return send_from_directory(STATIC_DIR, filename)


# ============================================
# API ROUTES
# ============================================

@app.route('/api/reviews', methods=['GET'])
def get_reviews():
    """GET /api/reviews — Return all reviews + count."""
    reviews = read_reviews()
    # Sort: newest first
    reviews.sort(key=lambda r: r.get('date', ''), reverse=True)
    return jsonify({
        'count': len(reviews),
        'reviews': reviews
    })


@app.route('/api/reviews/count', methods=['GET'])
def get_reviews_count():
    """GET /api/reviews/count — Return only count."""
    reviews = read_reviews()
    return jsonify({'count': len(reviews)})


@app.route('/api/reviews', methods=['POST'])
def add_review():
    """
    POST /api/reviews — Add new review.
    Expects JSON: { name, rating, text }
    After adding — broadcast SSE event to all connected clients.
    """
    data = request.get_json(force=True, silent=True) or {}

    name = (data.get('name') or '').strip()
    text = (data.get('text') or '').strip()
    rating = data.get('rating')

    # Validation
    if not name:
        return jsonify({'error': 'Please provide your name'}), 400
    if not text:
        return jsonify({'error': 'Please write a review'}), 400
    try:
        rating = int(rating)
        if rating < 1 or rating > 5:
            raise ValueError
    except (TypeError, ValueError):
        return jsonify({'error': 'Rating must be between 1 and 5'}), 400

    reviews = read_reviews()

    # Create new review
    new_id = max((r.get('id', 0) for r in reviews), default=0) + 1
    new_review = {
        'id': new_id,
        'name': name,
        'rating': rating,
        'text': text,
        'date': datetime.now(timezone.utc).isoformat()
    }

    reviews.append(new_review)
    write_reviews(reviews)

    print(f"✅ New review from \"{new_review['name']}\" (⭐{new_review['rating']})")

    # Broadcast to all SSE clients
    broadcast_sse('new-review', {
        'review': new_review,
        'count': len(reviews)
    })

    return jsonify({
        'message': 'Review added successfully',
        'review': new_review,
        'count': len(reviews)
    }), 201


@app.route('/api/reviews/stream')
def stream_reviews():
    """
    GET /api/reviews/stream — SSE stream for real-time updates.
    Client keeps connection open and receives events as they happen.
    """
    def generate():
        # Create a queue for this client
        client_queue = []
        with sse_lock:
            sse_clients.append(client_queue)
        
        try:
            # Send initial review count
            reviews = read_reviews()
            yield f"event: init\ndata: {json.dumps({'count': len(reviews)})}\n\n"
            
            # Keep connection alive and send queued messages
            while True:
                if client_queue:
                    with sse_lock:
                        if client_queue:
                            yield client_queue.pop(0)
                else:
                    time.sleep(0.1)  # Small delay to avoid busy-waiting
        except GeneratorExit:
            # Client disconnected
            with sse_lock:
                if client_queue in sse_clients:
                    sse_clients.remove(client_queue)

    return Response(
        generate(),
        mimetype='text/event-stream',
        headers={
            'Cache-Control': 'no-cache',
            'X-Accel-Buffering': 'no',
            'Connection': 'keep-alive'
        }
    )


# ============================================
# GOOGLE MAPS DATA ENDPOINT (for admin updates)
# ============================================

@app.route('/api/google-data', methods=['GET'])
def get_google_data():
    """
    GET /api/google-data — Get Google Maps rating and review count.
    Currently manual (admin updates), can be automated with Google API later.
    """
    google_data_file = os.path.join(os.path.dirname(DATA_FILE), 'google-data.json')
    
    try:
        with open(google_data_file, 'r', encoding='utf-8') as f:
            return jsonify(json.load(f))
    except FileNotFoundError:
        # Default values if file doesn't exist
        return jsonify({
            'rating': 4.3,
            'review_count': 200,
            'last_updated': datetime.now(timezone.utc).isoformat()
        })


@app.route('/api/google-data', methods=['POST'])
def update_google_data():
    """
    POST /api/google-data — Update Google Maps data (admin only).
    Expects JSON: { rating, review_count }
    """
    # TODO: Add authentication in production
    data = request.get_json(force=True, silent=True) or {}
    
    rating = data.get('rating')
    review_count = data.get('review_count')
    
    if rating is None or review_count is None:
        return jsonify({'error': 'Please provide rating and review_count'}), 400
    
    try:
        rating = float(rating)
        review_count = int(review_count)
        
        if rating < 1 or rating > 5:
            raise ValueError("Rating must be between 1 and 5")
        if review_count < 0:
            raise ValueError("Review count cannot be negative")
    except (TypeError, ValueError) as e:
        return jsonify({'error': str(e)}), 400
    
    google_data = {
        'rating': rating,
        'review_count': review_count,
        'last_updated': datetime.now(timezone.utc).isoformat()
    }
    
    # Save to file
    google_data_file = os.path.join(os.path.dirname(DATA_FILE), 'google-data.json')
    os.makedirs(os.path.dirname(google_data_file), exist_ok=True)
    
    with open(google_data_file, 'w', encoding='utf-8') as f:
        json.dump(google_data, f, ensure_ascii=False, indent=2)
    
    print(f"✅ Google data updated: {rating}⭐ ({review_count} reviews)")
    
    # Broadcast update to clients
    broadcast_sse('google-update', google_data)
    
    return jsonify({
        'message': 'Google data updated',
        'data': google_data
    }), 200


# ============================================
# HEALTH CHECK
# ============================================

@app.route('/api/health', methods=['GET'])
def health_check():
    """Simple health check endpoint."""
    reviews = read_reviews()
    return jsonify({
        'status': 'ok',
        'server': 'Alchemy Cafe Bar API',
        'reviews_count': len(reviews),
        'timestamp': datetime.now(timezone.utc).isoformat()
    })


# ============================================
# ERROR HANDLERS
# ============================================

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Not found'}), 404


@app.errorhandler(500)
def server_error(error):
    return jsonify({'error': 'Internal server error'}), 500


# ============================================
# STARTUP
# ============================================

if __name__ == '__main__':
    # Create data directory if it doesn't exist
    os.makedirs(os.path.dirname(DATA_FILE), exist_ok=True)
    
    # Print startup info
    reviews = read_reviews()
    print("=" * 50)
    print("ALCHEMY CAFE BAR - API SERVER")
    print("=" * 50)
    print(f"Flask + SSE (Real-time updates)")
    print(f"Port: {PORT}")
    print(f"Data file: {DATA_FILE}")
    print(f"Reviews in database: {len(reviews)}")
    print("")
    print("API Endpoints available at:")
    print(f"  http://localhost:{PORT}/api/reviews")
    print(f"  http://localhost:{PORT}/api/google-data")
    print("")
    print("Website: http://localhost:8000/html/index.html")
    print("=" * 50)
    print("")
    
    # Run Flask development server
    app.run(
        host='0.0.0.0',
        port=PORT,
        debug=True,
        use_reloader=False  # Disable auto-reloader for SSE stability
    )
