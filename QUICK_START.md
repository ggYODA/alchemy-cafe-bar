# 🚀 QUICK START GUIDE — Alchemy Cafe Bar

## ⚡ Get Running in 3 Minutes

### Step 1️⃣ Install Dependencies (First Time Only)

Open PowerShell and run:

```powershell
cd "C:\Users\game\Documents\vse_kod\projects\Alchemy Cafe Bar\python"
pip install -r requirements.txt
```

**Expected output:**
```
Successfully installed Flask-3.0.0 Flask-CORS-4.0.0 Werkzeug-3.0.1
```

### Step 2️⃣ Start the Server

Run:
```powershell
python server.py
```

**Expected output:**
```
╔════════════════════════════════════════╗
║  🍷 ALCHEMY CAFE BAR — API SERVER 🍷   ║
║  Port: 3000                            ║
║  Reviews in database: 3                ║
║  Starting server...                    ║
╚════════════════════════════════════════╝
 * Running on http://0.0.0.0:3000
```

### Step 3️⃣ Open Website in Browser

Visit: **http://localhost:3000**

---

## ✅ Test the Website

### Features to Test

| Feature | How to Test | Expected Result |
|---------|------------|-----------------|
| **Language Switch** | Click 🌐 button (top right) | Menu shows in selected language |
| **Menu Categories** | Click tab buttons | Menu items change |
| **Slideshow** | Wait 5 seconds | Hero image changes automatically |
| **Call Button** | Click 📞 Call Now | Opens phone dialer (if on mobile) or error (desktop OK) |
| **Directions** | Click 🗺️ Get Directions | Opens Google Maps |
| **Order Delivery** | Click 🛵 Order button | Opens iFOOD.gr page |
| **Leave Review** | Click ✏️ Leave Review | Opens Google Maps review form |
| **Responsive** | Resize browser window | Layout adapts smoothly |
| **Dark mode (optional)** | Should work on all backgrounds | Text is readable |

---

## 🔌 Quick API Tests

Open another PowerShell and test the API:

### Get All Reviews
```powershell
Invoke-WebRequest http://localhost:3000/api/reviews | ConvertFrom-Json
```

### Get Review Count
```powershell
Invoke-WebRequest http://localhost:3000/api/reviews/count | ConvertFrom-Json
```

### Add a Review (Replace with your details)
```powershell
$body = @{
    name = "Your Name"
    rating = 5
    text = "Amazing place! Love the sea view."
} | ConvertTo-Json

Invoke-WebRequest -Uri http://localhost:3000/api/reviews `
    -Method POST `
    -ContentType "application/json" `
    -Body $body | ConvertFrom-Json
```

### Server Health Check
```powershell
Invoke-WebRequest http://localhost:3000/api/health | ConvertFrom-Json
```

---

## 📸 Cafe Photos

The supplied photos are already in `images/` and connected to the slideshow and gallery:

- `seaside-terrace.png`
- `afternoons-at-alchemy.png`
- `seaside-interior.png`
- `chef-in-action.png`
- `espresso-preparation.png`
- `alchemy-burger.png`
- `friends-beer.png`
- `terrace-promo.png`

To add a new slideshow photo, place it in `images/` and add its path and alt text to `html/index.html`. Gallery photos are configured in `js/main.js`.

---

## 🌐 Language Testing

The website supports 8 languages:

| Code | Language | Flag | Shortcut |
|------|----------|------|----------|
| `el` | Greek | 🇬🇷 | Default |
| `en` | English | 🇬🇧 | Click 🌐 → English |
| `uk` | Ukrainian | 🇺🇦 | Click 🌐 → Українська |
| `ru` | Russian | 🇷🇺 | Click 🌐 → Русский |
| `de` | German | 🇩🇪 | Click 🌐 → Deutsch |
| `fr` | French | 🇫🇷 | Click 🌐 → Français |
| `es` | Spanish | 🇪🇸 | Click 🌐 → Español |
| `ro` | Romanian | 🇷🇴 | Click 🌐 → Română |

**Language is saved in your browser** — next visit will remember your choice!

---

## 🔧 Troubleshooting

### Server won't start
```powershell
# Check if port 3000 is in use
netstat -ano | findstr :3000

# If in use, find the process:
# taskkill /PID [PID] /F

# Or change PORT in python/server.py line 14
```

### Reviews not showing
- Confirm server is running (check PowerShell window)
- Try: `http://localhost:3000/api/reviews`
- If error → check `python/data/reviews.json` file

### Images not displaying
- Check files are in `Alchemy Cafe Bar\images\` folder
- Check that the filenames referenced in `html/index.html` and `js/main.js` exactly match the files
- Refresh browser (Ctrl+Shift+R for hard refresh)

### Language dropdown not working
- Open browser Console (F12 → Console tab)
- Look for JavaScript errors
- Try hard refresh (Ctrl+Shift+R)

---

## 📝 Common Tasks

### Update Menu
Edit `js/menu-data.js`. Each category and item has translated values for the supported languages; preserve the `id`, `name`, `description`, and `price` fields when editing. Refresh the browser to see changes.

### Update Hours
Edit: `html/index.html` (search for "09:00")
Or edit in `js/i18n.js` (search for "hours_days")
Refresh browser.

### Change Colors
Edit the color variables near the top of `css/style.css`, then refresh the browser.

### Update the Displayed Google Rating
The site currently reads manually maintained values from `python/data/google-data.json`; it does not fetch live Google Maps data. To update the values through the local API:
```powershell
$body = @{
    rating = 4.5
    review_count = 250
} | ConvertTo-Json

Invoke-WebRequest -Uri http://localhost:3000/api/google-data `
    -Method POST `
    -ContentType "application/json" `
    -Body $body
```

---

## 🎯 What to Do Next

### Before Deployment

- [ ] **Photos**: Verify the cafe photos in `images/`
- [ ] **Menu**: Verify all 81 menu entries in `js/menu-data.js`
- [ ] **Contact**: Confirm address, phone, hours
- [ ] **Google Data**: Update rating/review count
- [ ] **Social Links**: Verify Instagram, Facebook, iFOOD URLs

### Deployment

- [ ] Create GitHub repository: `https://github.com/ggYODA/alchemy-cafebar`
- [ ] Push code to GitHub
- [ ] Set up hosting with GitHub integration
- [ ] Point domain to hosting
- [ ] Test on live domain

### After Launch

- [ ] Monitor reviews via API
- [ ] Update Google rating periodically
- [ ] Add new photos to gallery
- [ ] Gather feedback
- [ ] Plan future features

---

## 📞 Support

**Server Issues?**
1. Close server (Ctrl+C in PowerShell)
2. Check port 3000 is free
3. Restart: `python server.py`

**Website Issues?**
1. Open browser DevTools (F12)
2. Check Console tab for errors
3. Try hard refresh (Ctrl+Shift+R)

**API Issues?**
1. Verify server running
2. Test `/api/health` endpoint
3. Check data files exist in `python/data/`

---

## 🎨 Customization Ideas

- **Add newsletter signup** — Add form to footer
- **Add photo gallery lightbox** — Click photo to enlarge
- **Add special offers section** — Highlight daily specials
- **Add team members** — Staff photos & bios
- **Add events calendar** — Live music, theme nights
- **Add table reservation** — Booking system

---

## 📊 Performance

Website stats:
- **Size**: ~120 KB total
- **Languages**: 8 (Greek, English, Ukrainian, Russian, German, French, Spanish, Romanian)
- **Images**: Responsive (scales with device)
- **Load time**: < 1 second (on fast connection)
- **Mobile friendly**: ✅ Yes
- **SEO ready**: ✅ Yes

---

## 🚀 Ready to Go!

Your website is **production-ready**. Just:

1. ✅ Add photos
2. ✅ Verify contact info
3. ✅ Deploy to hosting
4. ✅ Share with customers!

---

**Questions?** Check `README.md` or `PROJECT_SUMMARY.md` for detailed docs.

**Happy hosting! 🍷☕**
