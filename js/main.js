/* ============================================
   ALCHEMY CAFE BAR — MAIN JAVASCRIPT
   Interactivity, API Integration, Menu & Reviews
   ============================================ */

// ============================================
// MENU DATA — Greek (Original)
// ============================================

const menuData = {
    breakfast: [
        { name: 'Αυγά', price: '€5,50', desc: 'Φρέσκα αυγά με ψωμί' },
        { name: 'Φρέσκο μπάγέλ', price: '€4,80', desc: 'Ζεστό με τυρί ή τζάμ' },
        { name: 'Τοστ με τυρί', price: '€4,00', desc: 'Κλασικό ελληνικό τοστ' }
    ],
    coffee: [
        { name: 'Ελληνικός καφές', price: '€2,50', desc: 'Παραδοσιακός με ζάχαρη' },
        { name: 'Espresso', price: '€2,00', desc: 'Κλασικό double shot' },
        { name: 'Cappuccino', price: '€3,50', desc: 'Αφρόγαλα και espresso' },
        { name: 'Latte', price: '€3,50', desc: 'Μαλακό και σμιλευτό' },
        { name: 'Americano', price: '€2,50', desc: 'Espresso με νερό' }
    ],
    food: [
        { name: 'Ψάρι ξυδάτο', price: '€9,20', desc: 'Χειροποίητο ψάρι' },
        { name: 'Χταποδι ξυδάτο', price: '€10,20', desc: 'Νόστιμο και μαλακό' },
        { name: 'Κριθαροτό Μανιτάρι', price: '€11,50', desc: 'Ρύζι με σάλτσα' },
        { name: 'Χορτα εποχης', price: '€6,50', desc: 'Ξεψυχισμένα χόρτα' },
        { name: 'Τζατζίκι', price: '€5,20', desc: 'Χειροποίητο, κλασικό' },
        { name: 'Σαγανάκι τυρί', price: '€7,20', desc: 'Τηγανητό τυρί' }
    ],
    desserts: [
        { name: 'Λουκουμάδες', price: '€6,00', desc: 'Με μέλι ή σοκολάτα' },
        { name: 'Προφιτερόλ', price: '€7,80', desc: 'Για 2 άτομα' },
        { name: 'Σουφλέ Σοκολάτας', price: '€6,00', desc: 'Ζεστό και γευστικό' },
        { name: 'Παγωτό', price: '€2,80–€3,00', desc: 'Κρέμα, σοκολάτα, φράουλα' }
    ],
    drinks: [
        { name: 'Ούζο', price: '€4,00', desc: 'Παραδοσιακό ποτό' },
        { name: 'Ρετσίνα', price: '€5,00', desc: 'Ελληνικό κρασί' },
        { name: 'Μπίρα', price: '€3,50–€4,00', desc: 'Ψυχρή μπίρα' },
        { name: 'Κοκτέιλ', price: '€7,00–€9,00', desc: 'Διάφοροι συνδυασμοί' },
        { name: 'Μοχίτο', price: '€8,00', desc: 'Φρέσκο με μέντα' },
        { name: 'Κρασί', price: '€5,00–€12,00', desc: 'Κόκκινο ή άσπρο' }
    ]
};

// API endpoint (will be updated when server starts)
const API_BASE = 'http://localhost:3000';
const GOOGLE_MAPS_URL = 'https://www.google.com/maps/place/Alchemy+cafe+bar/@38.0916222,23.9819252,17.25z/data=!3m1!5s0x14a18299961503df:0x4e45547bf47be52d!4m6!3m5!1s0x14a18299914c727f:0x698ac04be2ce7e0d!8m2!3d38.0906846!4d23.9820184!16s%2Fg%2F11c6djz59_?entry=ttu&g_ep=EgoyMDI2MTAwNS4wIKXMDSoASAFQAw%3D%3D';
const GOOGLE_MAPS_REVIEW_URL = 'https://search.google.com/local/writereview?placeid=ChIJfyccFJKDzBQR7QzqBeq4ADo';
const IFOOD_DELIVERY_URL = 'https://www.e-food.gr/delivery/nea-makri/alchemy';
const PHONE_NUMBER = '+302294093644';

// Global slideshow variable
let currentSlideIndex = 0;

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🍷 Alchemy Cafe Bar — Initializing...');
    
    // Initialize slideshow
    initializeSlideshow();
    
    // Load menu
    loadMenu();
    
    // Attach button event listeners
    attachButtonListeners();
    
    // Load reviews from server
    loadReviews();
    
    // Setup SSE listener for real-time updates
    setupSSEListener();
    
    console.log('✅ Alchemy Cafe Bar — Ready!');
});

// ============================================
// SLIDESHOW FUNCTIONALITY
// ============================================

function initializeSlideshow() {
    const slides = document.querySelectorAll('.slide');
    
    // Set all slides to initially not display
    slides.forEach(slide => slide.classList.remove('active'));
    
    // Show first slide
    if (slides[0]) {
        slides[0].classList.add('active');
    }
    
    // Rotate slides every 5 seconds
    setInterval(() => {
        showNextSlide();
    }, 5000);
}

function showNextSlide() {
    const slides = document.querySelectorAll('.slide');
    
    // Remove active class from current slide
    slides[currentSlideIndex].classList.remove('active');
    
    // Move to next slide (loop around)
    currentSlideIndex = (currentSlideIndex + 1) % slides.length;
    
    // Add active class to new slide
    slides[currentSlideIndex].classList.add('active');
}

// ============================================
// MENU LOADING
// ============================================

function loadMenu() {
    // Load initial menu (breakfast)
    displayMenuItems('breakfast');
    
    // Attach tab click listeners
    const menuTabs = document.querySelectorAll('.menu-tab');
    menuTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Update active tab
            menuTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Display items
            displayMenuItems(category);
        });
    });
}

function displayMenuItems(category) {
    const menuItemsContainer = document.getElementById('menuItems');
    const items = menuData[category] || [];
    
    menuItemsContainer.innerHTML = '';
    
    items.forEach((item, index) => {
        const itemEl = document.createElement('div');
        itemEl.className = 'menu-item';
        itemEl.style.animation = `slideIn 0.3s ease-out ${index * 0.05}s both`;
        
        itemEl.innerHTML = `
            <div class="menu-item-name">${item.name}</div>
            <div class="menu-item-price">${item.price}</div>
            <div class="menu-item-description">${item.desc}</div>
        `;
        
        menuItemsContainer.appendChild(itemEl);
    });
}

// ============================================
// REVIEWS LOADING
// ============================================

function loadReviews() {
    // Try to load from API server
    fetch(`${API_BASE}/api/reviews`, { method: 'GET' })
        .then(response => response.json())
        .then(data => {
            displayReviews(data.reviews || []);
        })
        .catch(error => {
            console.log('⚠️  API server not running. Using demo reviews.');
            // Use demo reviews
            displayReviews(getDemoReviews());
        });
}

function displayReviews(reviews) {
    const reviewsList = document.getElementById('reviewsList');
    reviewsList.innerHTML = '';
    
    if (reviews.length === 0) {
        reviewsList.innerHTML = '<p style="text-align: center; color: #999;">No reviews yet. Be the first!</p>';
        return;
    }
    
    reviews.slice(0, 6).forEach((review, index) => {
        const reviewCard = document.createElement('div');
        reviewCard.className = 'review-card';
        reviewCard.style.animation = `slideIn 0.3s ease-out ${index * 0.05}s both`;
        
        const ratingStars = '⭐'.repeat(review.rating);
        const reviewDate = new Date(review.date).toLocaleDateString();
        
        reviewCard.innerHTML = `
            <div class="review-header">
                <span class="review-author">${review.name}</span>
                <span class="review-rating">${ratingStars}</span>
            </div>
            <div class="review-text">${review.text}</div>
            <div class="review-date">${reviewDate}</div>
        `;
        
        reviewsList.appendChild(reviewCard);
    });
}

function getDemoReviews() {
    return [
        {
            id: 1,
            name: 'Maria',
            rating: 5,
            text: 'Absolutely amazing! Beautiful sea view, fresh coffee, and friendly staff. Highly recommended!',
            date: '2024-12-20T18:30:00.000Z'
        },
        {
            id: 2,
            name: 'Dimitris',
            rating: 5,
            text: 'Εξαιρετικό φαγητό και υπέροχη ατμόσφαιρα. Συνιστώ ανεπιφύλακτα!',
            date: '2024-12-18T19:15:00.000Z'
        },
        {
            id: 3,
            name: 'Anna K.',
            rating: 4,
            text: 'Great food, lovely terrace. The grilled octopus was amazing!',
            date: '2024-12-15T20:00:00.000Z'
        }
    ];
}

// ============================================
// SSE (Server-Sent Events) LISTENER
// ============================================

function setupSSEListener() {
    try {
        const eventSource = new EventSource(`${API_BASE}/api/reviews/stream`);
        
        eventSource.addEventListener('new-review', function(e) {
            const data = JSON.parse(e.data);
            console.log('✅ New review received:', data.review);
            
            // Reload reviews
            loadReviews();
            
            // Show notification
            showNotification('New review added!');
        });
        
        eventSource.addEventListener('error', function() {
            console.log('⚠️  SSE connection not available (server may not be running)');
            eventSource.close();
        });
    } catch (error) {
        console.log('⚠️  SSE not supported in this browser');
    }
}

// ============================================
// BUTTON INTERACTIONS
// ============================================

function attachButtonListeners() {
    // Call button
    const callBtn = document.getElementById('callBtn');
    if (callBtn) {
        callBtn.addEventListener('click', function() {
            window.location.href = `tel:${PHONE_NUMBER}`;
        });
    }
    
    // Directions button
    const directionsBtn = document.getElementById('directionsBtn');
    if (directionsBtn) {
        directionsBtn.addEventListener('click', function() {
            window.open(GOOGLE_MAPS_URL, '_blank');
        });
    }
    
    // Menu button (scroll to menu)
    const menuBtn = document.getElementById('menuBtn');
    if (menuBtn) {
        menuBtn.addEventListener('click', function() {
            document.getElementById('menu').scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    // Order button (delivery)
    const orderBtn = document.getElementById('orderBtn');
    if (orderBtn) {
        orderBtn.addEventListener('click', function() {
            window.open(IFOOD_DELIVERY_URL, '_blank');
        });
    }
    
    // Leave review button
    const leaveReviewBtn = document.getElementById('leaveReviewBtn');
    if (leaveReviewBtn) {
        leaveReviewBtn.addEventListener('click', function() {
            window.open(GOOGLE_MAPS_REVIEW_URL, '_blank');
        });
    }
    
    // Phone link
    const phoneLink = document.getElementById('phoneLink');
    if (phoneLink) {
        phoneLink.href = `tel:${PHONE_NUMBER}`;
    }
}

// ============================================
// NOTIFICATIONS
// ============================================

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: linear-gradient(135deg, #1a3a52 0%, #2d5a7f 100%);
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        z-index: 9999;
        animation: slideIn 0.3s ease-out;
        border-left: 4px solid #d4af37;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease-out forwards';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ============================================
// SMOOTH SCROLL BEHAVIOR
// ============================================

document.addEventListener('click', function(e) {
    const link = e.target.closest('a[href^="#"]');
    if (link) {
        const targetId = link.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            e.preventDefault();
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
    }
});

// ============================================
// CONSOLE MESSAGE
// ============================================

console.log(`
╔════════════════════════════════════════╗
║  🍷 ALCHEMY CAFE BAR — NEAD MAKRI 🍷   ║
║                                        ║
║  Seaside Cafe Bar in Greece            ║
║  Hours: 09:00–00:00 Daily              ║
║                                        ║
║  📞 +30 2294 093644                    ║
║  📍 Leof. Posidonos 36, Nea Makri      ║
║  🌐 8 Languages Supported              ║
║  🏠 Modern Mediterranean Design        ║
║                                        ║
╚════════════════════════════════════════╝
`);
