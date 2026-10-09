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

## ⚠️ Issues Still Needed

### 1. **Slideshow Images**
- The website looks for: `../images/hero-1.jpg` through `hero-5.jpg`
- Currently: Folder is empty, so slideshow background shows as solid color
- **Solution**: Add real cafe photos to the `images/` folder OR use the placeholder photos you provided

### 2. **Translation Keys**
- Some UI labels still missing translations
- Missing keys: social media labels, some button text
- **Status**: Needs i18n.js update with missing keys

### 3. **Menu Section**
- Currently: Basic menu list
- Needed: Armellada-style redesign with:
  - Category columns
  - Info boxes (Hours, Delivery, Payment, Terrace, WiFi, Parking)
  - Better typography
  - Visual hierarchy

### 4. **Page Colors**
- Some sections still have old color references
- Need to systematically update all remaining old color uses

---

## 🚀 Next Steps

1. **Add Your Cafe Photos**
   - Place images in: `C:\Users\game\Documents\vse_kod\projects\Alchemy Cafe Bar\images\`
   - Filename format: `hero-1.jpg`, `hero-2.jpg`, ... `hero-5.jpg`
   - Size: Ideally 1200x600px for best quality
   - Refresh browser after adding images

2. **Test Language Switching**
   - Click 🌐 button in navbar
   - Select different languages
   - Check if all text translates (report any missing translations)

3. **Check Responsive Design**
   - Open website in browser
   - Resize window to test mobile view
   - Should stack vertically on small screens

4. **Add Real Data**
   - Update `python/data/reviews.json` with real customer reviews
   - Update Google Maps rating via API or manually in JSON

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

Made with ❤️ by Copilot | Last updated: 2024
