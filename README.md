# 🍷 Alchemy Cafe Bar — Website & API

A modern, responsive website for **Alchemy Cafe Bar** (Nea Makri, Greece) with multilingual support (8 languages), real-time review system, and Mediterranean design.

---

## 📁 Project Structure

```
Alchemy Cafe Bar/
├── html/
│   └── index.html              # Main page (structure & markup)
├── css/
│   └── style.css               # Styling (Mediterranean design)
├── js/
│   ├── i18n.js                 # Internationalization (8 languages)
│   ├── menu-data.js            # Full menu data and translations
│   └── main.js                 # Interactivity & API integration
├── python/
│   ├── server.py               # Flask API backend
│   ├── requirements.txt         # Python dependencies
│   └── data/
│       ├── reviews.json        # Site-specific reviews storage
│       └── google-data.json    # Google Maps data (rating, count)
├── images/                     # Cafe photos (hero, gallery)
└── README.md                   # This file
```

---

## 🚀 Quick Start

### Step 1: Install Python Dependencies

```bash
cd C:\Users\game\Documents\vse_kod\projects\Alchemy Cafe Bar\python
pip install -r requirements.txt
```

### Step 2: Start the Backend Server

```bash
python server.py
```

You should see:
```
╔════════════════════════════════════════╗
║  🍷 ALCHEMY CAFE BAR — API SERVER 🍷   ║
║  Port: 3000                            ║
║  Reviews in database: 3                ║
╚════════════════════════════════════════╝
```

### Step 3: Open the Website

The site is served at: **http://localhost:3000**

---

## 🌐 Supported Languages

The website supports **8 languages**:

| Code | Language | Flag |
|------|----------|------|
| `el` | Greek | 🇬🇷 |
| `en` | English | 🇬🇧 |
| `uk` | Ukrainian | 🇺🇦 |
| `ru` | Russian | 🇷🇺 |
| `de` | German | 🇩🇪 |
| `fr` | French | 🇫🇷 |
| `es` | Spanish | 🇪🇸 |
| `ro` | Romanian | 🇷🇴 |

Click the globe button in the top-right corner to change language. Selection is saved in browser localStorage. Menu names and descriptions and the included sample reviews are localized too; names of reviewers are never translated.

---

## 🔌 API Endpoints

### Reviews API

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/reviews` | Get all reviews + count |
| `GET` | `/api/reviews/count` | Get only review count |
| `POST` | `/api/reviews` | Add new review |
| `GET` | `/api/reviews/stream` | SSE stream (real-time updates) |

### Google Maps Data API

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/google-data` | Get Google rating & review count |
| `POST` | `/api/google-data` | Update Google rating & count |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Server status & stats |

---

## 📝 Adding Reviews

### Via Website (Frontend)

Click the **✏️ Leave a Review** button → Opens Google Maps review form.

### Via Website (Site-Specific - Future)

Currently, reviews are added via Google Maps. Site-specific reviews can be stored locally.

### Via API (Backend/Admin)

```bash
curl -X POST http://localhost:3000/api/reviews \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "rating": 5,
    "text": "Great place for coffee and cocktails!"
  }'
```

Response:
```json
{
  "message": "Review added successfully",
  "review": {
    "id": 4,
    "name": "John Doe",
    "rating": 5,
    "text": "Great place for coffee and cocktails!",
    "date": "2024-12-20T15:30:00.000Z"
  },
  "count": 4
}
```

---

## 🔄 Real-Time Updates (SSE)

The website listens for real-time review updates via Server-Sent Events (SSE).

**Endpoint**: `/api/reviews/stream`

When a new review is added:
1. Server broadcasts event to all connected clients
2. Clients receive `new-review` event
3. Review list updates automatically (no page refresh needed)

---

## 📊 Google Maps Data

This file stores the rating and review count shown on the site:

```json
{
  "rating": 4.3,
  "review_count": 200,
  "last_updated": "2024-12-20T12:00:00.000Z"
}
```

These values are maintained manually; the site does not currently fetch live Google Maps data. Check `last_updated` before treating the values as current.

**Update via API**:
```bash
curl -X POST http://localhost:3000/api/google-data \
  -H "Content-Type: application/json" \
  -d '{
    "rating": 4.5,
    "review_count": 220
  }'
```

---

## 🎨 Design Features

### Mediterranean Theme
- **Colors**: Warm cream, brown, and muted gold
- **Typography**: Playfair Display (headers), Poppins (body)
- **Hero Section**: Full-width slideshow (auto-rotates every 5 seconds when photos are present; uses a warm fallback without them)
- **Social links**: Inline SVG icons beside the globe language selector
- **Responsive**: Mobile-first design, works on all devices

### Key Sections
1. **Hero** — Slideshow with call-to-action buttons
2. **About** — Cafe description, hours, highlights
3. **Menu** — 10 categorized tables containing 81 menu items, with available names and descriptions translated into all 8 supported languages
4. **Gallery** — Grid of cafe photos
5. **Reviews** — Google rating and count from `google-data.json` + localized sample review text (reviewer names remain unchanged)
6. **Contact** — Address, phone, social links, embedded Google Map
7. **Footer** — Copyright & quick info

### Accessibility
- Semantic HTML5
- Proper ARIA labels
- Keyboard navigation support
- Smooth scroll behavior
- High contrast text

---

## 📱 Menu Categories

Current menu (Greek):
- **Breakfast** — Eggs, bagels, toast
- **Coffee** — Greek coffee, espresso, cappuccino, latte, americano
- **Food** — Fish, octopus, risotto, salads, appetizers
- **Desserts** — Loukoumades, profiteroles, chocolate soufflé, ice cream
- **Drinks** — Ouzo, retsina, beer, cocktails, wine

---

## 🔒 Security Notes

- CORS enabled for all origins (can restrict in production)
- No authentication on API (add in production for admin endpoints)
- Review moderation not implemented (add if needed)
- SQL injection not applicable (using JSON files, not SQL database)

---

## 🐛 Troubleshooting

### Server won't start
```bash
# Check if port 3000 is already in use
netstat -ano | findstr :3000

# If in use, kill the process or change PORT in server.py
```

### Reviews not loading
- Check server is running: `http://localhost:3000/api/health`
- Check CORS is enabled
- Check browser console for errors
- Check `reviews.json` file exists and is valid JSON

### Language selector not working
- Check localStorage is enabled in browser
- Check `i18n.js` is loaded
- Check console for JavaScript errors

### Images not displaying
- Place cafe photos in the project `images/` folder
- Current supplied files: `seaside-terrace.png`, `afternoons-at-alchemy.png`, `seaside-interior.png`, `chef-in-action.png`, `espresso-preparation.png`, `alchemy-burger.png`, `friends-beer.png`, `terrace-promo.png`
- Seven photos are used in the slideshow; all eight appear in the gallery. The burger photo is also used on the featured menu card.
- Use high-quality images (minimum 1200px width)
- Missing files are hidden instead of showing broken-image icons; the slideshow uses a warm fallback until the photos are added.

---

## 🚀 Deployment

### Local Testing
```bash
python server.py
# Visit: http://localhost:3000
```

### Production Deployment

1. **Set up on hosting** (GitHub + Hosting service)
   ```bash
   git add .
   git commit -m "Initial Alchemy Cafe Bar website"
   git push origin main
   ```

2. **Configure hosting** to:
   - Pull code from GitHub repository
   - Install Python dependencies: `pip install -r requirements.txt`
   - Start server: `python python/server.py`
   - Set domain to point to port 3000

3. **Environment variables** (create `.env` file):
   ```
   FLASK_ENV=production
   PORT=3000
   ```

---

## 📚 Technology Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| Frontend | HTML5 + CSS3 + JavaScript (Vanilla) | ES6+ |
| Backend | Python Flask | 3.0.0 |
| CORS | Flask-CORS | 4.0.0 |
| Real-time | Server-Sent Events (SSE) | HTML5 |
| Data Storage | JSON files | UTF-8 |
| Fonts | Google Fonts (Playfair Display, Poppins) | Latest |
| Browser Support | All modern browsers | Chrome 90+, Firefox 88+, Safari 14+ |

---

## 🔄 Development Workflow

### 1. Make changes
Edit HTML, CSS, JS, or Python files.

### 2. Test locally
```bash
# Terminal 1: Start Python backend
cd python
python server.py

# Terminal 2: Open browser
# http://localhost:3000
```

### 3. Commit changes
```bash
git add .
git commit -m "Description of changes"
```

### 4. Push to GitHub
```bash
git push origin main
```

### 5. Hosting auto-updates
Hosting service automatically pulls new code and deploys.

---

## 📞 Contact & Hours

- **Name**: Alchemy Cafe Bar
- **Address**: Leof. Posidonos 36, Nea Makri 190 05, Greece
- **Phone**: +30 2294 093644
- **Hours**: 09:00–00:00 Daily
- **Instagram**: @alchemy_cafebar
- **Facebook**: facebook.com/alchemycafebar
- **Delivery**: e-food.gr/delivery/nea-makri/alchemy

---

## 🎯 Future Enhancements

- [ ] Google Maps API integration (auto-fetch rating)
- [ ] Admin panel for adding reviews directly
- [ ] Photo gallery with lightbox
- [ ] Online table reservation system
- [ ] Email notifications for new reviews
- [ ] Blog section
- [ ] Newsletter signup
- [ ] Multi-currency pricing
- [ ] Special offers / promotions
- [ ] Analytics dashboard

---

## 📄 License

Created for Alchemy Cafe Bar, Nea Makri, Greece.

---

## 💬 Support

For questions or issues:
1. Check the Troubleshooting section
2. Review the API documentation
3. Check browser console for errors
4. Ensure server is running and accessible

---

**Made with 🍷 and ☕ for Alchemy Cafe Bar**
