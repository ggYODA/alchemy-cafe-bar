# Alchemy Cafe Bar - Local Development Server

## ✅ What's Running

Two servers are currently running on your local machine:

### 1. **Flask API Server** (Port 3000)
- **URL**: http://localhost:3000
- **Purpose**: Backend API for reviews, Google Maps data, real-time updates
- **Endpoints**:
  - GET `/api/reviews` — Get all reviews
  - POST `/api/reviews` — Add new review
  - GET `/api/reviews/stream` — Real-time SSE updates
  - GET `/api/google-data` — Get Google Maps rating
  - POST `/api/google-data` — Update Google rating

### 2. **HTTP Server** (Port 8000)
- **URL**: http://localhost:8000/html/index.html
- **Purpose**: Serves the website HTML/CSS/JS files
- **Opens in Browser**: Click the link above to view website

---

## 🎨 Design Changes Made

### Colors Updated (Warm Mediterranean Theme)
- **Primary**: Warm brown (#6b5b4a) - replaces old dark blue
- **Secondary**: Light brown (#8b7355)
- **Accent**: Warm gold (#d4a574) - replaces old bright gold
- **Background**: Cream (#f5f1e8) - replaces white
- **Text**: Dark brown (#3a3a3a)

### Navbar Improvements
✅ Added social media icons (Instagram, Facebook, Delivery) in top-right
✅ Icons positioned inline with language selector
✅ Color updated to warm palette
✅ Hover effects improved

### Buttons Redesigned
✅ Reduced padding (0.6rem 1.2rem instead of 1rem 2rem)
✅ Made more rounded (25px border-radius)
✅ Smaller font size (0.9rem)
✅ Warm brown gradient colors
✅ Better hover animations

### Server Startup Fixed
✅ Fixed Unicode encoding error in startup banner
✅ Server now runs cleanly without character encoding issues

---

## ✅ Current Website Status

- The hero slideshow uses seven supplied photos; the gallery uses eight.
- The full menu contains 81 entries across 10 categories. Menu names and any supplied descriptions are translated into all 8 supported languages.
- The language selector uses a globe icon and offers Greek, English, Ukrainian, Russian, German, French, Spanish, and Romanian.
- The footer year updates automatically.
- The review button opens the venue's Google Maps review page. The three sample reviews displayed on the site have localized text; reviewer names remain unchanged.
- The rating and review count are read from `python/data/google-data.json`. They are not fetched live from Google Maps and must be updated manually.

## 🧪 Local Checks

Open `http://localhost:8000/html/index.html` for the website. The Flask API runs at `http://localhost:3000`; check `/api/reviews` and `/api/google-data` if the backend is running.

The current photo files are in `images/`. Slideshow image paths are listed in `html/index.html`; gallery images are configured in `js/main.js`. The full translated menu is in `js/menu-data.js`.

---

## 📋 File Locations

- **Website**: `C:\Users\game\Documents\vse_kod\projects\Alchemy Cafe Bar\html\index.html`
- **Styling**: `C:\Users\game\Documents\vse_kod\projects\Alchemy Cafe Bar\css\style.css`
- **JavaScript**: `C:\Users\game\Documents\vse_kod\projects\Alchemy Cafe Bar\js\main.js`
- **Translations**: `C:\Users\game\Documents\vse_kod\projects\Alchemy Cafe Bar\js\i18n.js`
- **Backend**: `C:\Users\game\Documents\vse_kod\projects\Alchemy Cafe Bar\python\server.py`
- **Images**: `C:\Users\game\Documents\vse_kod\projects\Alchemy Cafe Bar\images\`
- **Reviews Data**: `C:\Users\game\Documents\vse_kod\projects\Alchemy Cafe Bar\python\data\reviews.json`

---

## 🔧 To Stop Servers

In PowerShell, run:
```powershell
# Stop Flask server
Stop-Process -Id [PID_of_server.py]

# Stop HTTP server  
Stop-Process -Id [PID_of_http_server]
```

Or press **Ctrl+C** in each terminal running the servers.

---

## 💡 Command to Restart Servers

### Start Flask Server
```powershell
cd 'C:\Users\game\Documents\vse_kod\projects\Alchemy Cafe Bar\python'
python server.py
```

### Start HTTP Server
```powershell
cd 'C:\Users\game\Documents\vse_kod\projects\Alchemy Cafe Bar'
python -m http.server 8000
```

Then open: **http://localhost:8000/html/index.html**

---

Local development notes for Alchemy Cafe Bar.
