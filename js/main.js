/* ============================================
   ALCHEMY CAFE BAR — MAIN JAVASCRIPT
   Interactivity, API Integration, Menu & Reviews
   ============================================ */

const API_BASE = 'http://localhost:3000';
const GOOGLE_MAPS_URL = 'https://www.google.com/maps/place/Alchemy+cafe+bar/@38.0916222,23.9819252,17.25z/data=!3m1!5s0x14a18299961503df:0x4e45547bf47be52d!4m6!3m5!1s0x14a18299914c727f:0x698ac04be2ce7e0d!8m2!3d38.0906846!4d23.9820184!16s%2Fg%2F11c6djz59_?entry=ttu&g_ep=EgoyMDI2MTAwNS4wIKXMDSoASAFQAw%3D%3D';
const GOOGLE_MAPS_REVIEW_URL = 'https://search.google.com/local/writereview?placeid=ChIJfyccFJKDzBQR7QzqBeq4ADo';
const IFOOD_DELIVERY_URL = 'https://www.e-food.gr/delivery/nea-makri/alchemy';
const PHONE_NUMBER = '+302294093644';
const reviewTextTranslations = {
    1: {
        el: 'Υπέροχο μέρος! Όμορφη θέα στη θάλασσα, φρέσκος καφές και φιλικό προσωπικό. Το συνιστώ ανεπιφύλακτα!',
        en: 'Absolutely amazing! Beautiful sea view, fresh coffee, and friendly staff. Highly recommended!',
        uk: 'Чудове місце! Гарний вид на море, свіжа кава та привітний персонал. Щиро рекомендую!',
        ru: 'Потрясающее место! Прекрасный вид на море, свежий кофе и приветливый персонал. Очень рекомендую!',
        de: 'Wunderbar! Schöner Meerblick, frischer Kaffee und freundliches Personal. Sehr empfehlenswert!',
        fr: 'Formidable ! Belle vue sur la mer, café frais et personnel accueillant. Je recommande vivement !',
        es: '¡Una experiencia increíble! Hermosas vistas al mar, café fresco y personal amable. ¡Muy recomendable!',
        ro: 'Minunat! Vedere frumoasă la mare, cafea proaspătă și personal prietenos. Recomand cu drag!'
    },
    2: {
        el: 'Εξαιρετικό φαγητό και υπέροχη ατμόσφαιρα. Συνιστώ ανεπιφύλακτα!',
        en: 'Excellent food and a wonderful atmosphere. Highly recommended!',
        uk: 'Чудова їжа та прекрасна атмосфера. Щиро рекомендую!',
        ru: 'Отличная еда и прекрасная атмосфера. Очень рекомендую!',
        de: 'Ausgezeichnetes Essen und eine wunderbare Atmosphäre. Sehr empfehlenswert!',
        fr: 'Excellente cuisine et superbe ambiance. Je recommande vivement !',
        es: 'Excelente comida y un ambiente maravilloso. ¡Muy recomendable!',
        ro: 'Mâncare excelentă și o atmosferă minunată. Recomand cu drag!'
    },
    3: {
        el: 'Εξαιρετικό φαγητό και όμορφη βεράντα. Το χταπόδι στη σχάρα ήταν υπέροχο!',
        en: 'Great food, lovely terrace. The grilled octopus was amazing!',
        uk: 'Смачна їжа та чудова тераса. Восьминіг на грилі був неймовірним!',
        ru: 'Отличная еда и прекрасная терраса. Осьминог на гриле был великолепен!',
        de: 'Tolles Essen und eine schöne Terrasse. Der gegrillte Oktopus war fantastisch!',
        fr: 'Très bonne cuisine et jolie terrasse. Le poulpe grillé était délicieux !',
        es: 'Buena comida y una terraza encantadora. ¡El pulpo a la parrilla estaba delicioso!',
        ro: 'Mâncare excelentă și o terasă frumoasă. Caracatița la grătar a fost minunată!'
    }
};

// Global slideshow variable
let currentSlideIndex = 0;
let currentSlides = [];
let currentReviews = [];

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🍷 Alchemy Cafe Bar — Initializing...');
    
    // Initialize slideshow
    initializeSlideshow();
    initializeGallery();
    
    // Load menu
    loadMenu();
    document.addEventListener('alchemy-language-change', () => {
        renderFullMenu();
        displayReviews(currentReviews);
        loadGoogleData();
    });
    
    // Attach button event listeners
    attachButtonListeners();
    
    // Load reviews from server
    loadReviews();
    loadGoogleData();
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    
    // Setup SSE listener for real-time updates
    setupSSEListener();
    
    console.log('✅ Alchemy Cafe Bar — Ready!');
});

// ============================================
// SLIDESHOW FUNCTIONALITY
// ============================================

function initializeSlideshow() {
    const hero = document.querySelector('.hero');
    const slides = [...document.querySelectorAll('.slide')];
    let pendingImages = 0;

    slides.forEach((slide) => {
        const image = slide.querySelector('img');
        if (!image) return;
        pendingImages += 1;
        let settled = false;
        const markLoaded = () => {
            if (settled) return;
            settled = true;
            image.classList.add('is-loaded');
            slide.dataset.loaded = 'true';
            pendingImages -= 1;
            startLoadedSlides();
        };
        const markFailed = () => {
            if (settled) return;
            settled = true;
            slide.remove();
            pendingImages -= 1;
            startLoadedSlides();
        };
        image.addEventListener('load', markLoaded, { once: true });
        image.addEventListener('error', markFailed, { once: true });
        if (image.complete) {
            image.naturalWidth > 0 ? markLoaded() : markFailed();
        }
    });

    function startLoadedSlides() {
        if (pendingImages > 0) return;
        currentSlides = [...document.querySelectorAll('.slide[data-loaded="true"]')];
        if (!currentSlides.length) {
            hero.classList.remove('has-photos');
            return;
        }
        hero.classList.add('has-photos');
        currentSlideIndex = 0;
        currentSlides.forEach((slide, index) => slide.classList.toggle('active', index === 0));
        if (currentSlides.length > 1) {
            window.setInterval(showNextSlide, 5000);
        }
    }

    if (!pendingImages) startLoadedSlides();
}

function showNextSlide() {
    if (!currentSlides.length) return;
    currentSlides[currentSlideIndex].classList.remove('active');
    currentSlideIndex = (currentSlideIndex + 1) % currentSlides.length;
    currentSlides[currentSlideIndex].classList.add('active');
}

function initializeGallery() {
    const gallerySection = document.querySelector('.gallery-section');
    const galleryItems = [...document.querySelectorAll('.gallery-item')];
    if (!galleryItems.length) return;

    let remaining = galleryItems.length;
    let loaded = 0;
    galleryItems.forEach((item) => {
        const image = item.querySelector('img');
        if (!image) {
            item.remove();
            remaining -= 1;
            return;
        }
        let settled = false;
        const onLoad = () => {
            if (settled) return;
            settled = true;
            loaded += 1;
            remaining -= 1;
            if (!remaining && !loaded) gallerySection.hidden = true;
        };
        const onError = () => {
            if (settled) return;
            settled = true;
            item.remove();
            remaining -= 1;
            if (!remaining && !loaded) gallerySection.hidden = true;
        };
        image.addEventListener('load', onLoad, { once: true });
        image.addEventListener('error', onError, { once: true });
        if (image.complete) {
            image.naturalWidth > 0 ? onLoad() : onError();
        }
    });
}

// ============================================
// MENU LOADING
// ============================================

function loadMenu() {
    renderFullMenu();
}

function renderFullMenu() {
    const menuContainer = document.getElementById('fullMenu');
    if (!menuContainer) return;
    menuContainer.replaceChildren();

    localizedMenuData.forEach((category) => {
        const categorySection = document.createElement('section');
        categorySection.className = 'menu-category';

        const heading = document.createElement('h3');
        heading.textContent = category.title[currentLanguage] || category.title.en;
        categorySection.appendChild(heading);

        const table = document.createElement('table');
        table.className = 'menu-table';
        const body = document.createElement('tbody');

        category.items.forEach((item) => {
            const row = document.createElement('tr');
            const descriptionCell = document.createElement('td');
            const name = document.createElement('span');
            name.className = 'menu-name';
            name.textContent = item.name[currentLanguage] || item.name.en;
            const description = document.createElement('span');
            description.className = 'menu-description';
            description.textContent = item.description[currentLanguage] || item.description.en;
            descriptionCell.append(name, description);

            const price = document.createElement('td');
            price.className = 'menu-price';
            price.textContent = item.price;
            row.append(descriptionCell, price);
            body.appendChild(row);
        });

        table.appendChild(body);
        categorySection.appendChild(table);
        menuContainer.appendChild(categorySection);
    });
    renderFeaturedDish();
}

function renderFeaturedDish() {
    const card = document.getElementById('featuredDish');
    const burgerCategory = localizedMenuData.find((category) => category.id === 'burgers');
    const burger = burgerCategory?.items[0];
    if (!card || !burger) return;
    card.replaceChildren();

    const imageContainer = document.createElement('div');
    imageContainer.className = 'menu-featured-image';
    const image = document.createElement('img');
    image.src = '../images/alchemy-burger.png';
    image.alt = burger.name[currentLanguage] || burger.name.en;
    image.loading = 'lazy';
    imageContainer.appendChild(image);

    const copy = document.createElement('div');
    copy.className = 'menu-featured-copy';
    const label = document.createElement('span');
    label.className = 'menu-featured-label';
    label.textContent = burgerCategory.title[currentLanguage] || burgerCategory.title.en;
    const title = document.createElement('h3');
    title.textContent = burger.name[currentLanguage] || burger.name.en;
    const description = document.createElement('p');
    description.textContent = burger.description[currentLanguage] || burger.description.en;
    const price = document.createElement('span');
    price.className = 'menu-featured-price';
    price.textContent = burger.price;
    copy.append(label, title, description, price);
    card.append(imageContainer, copy);
}

// ============================================
// REVIEWS LOADING
// ============================================

function loadReviews() {
    // Try to load from API server
    fetch(`${API_BASE}/api/reviews`, { method: 'GET' })
        .then(response => response.json())
        .then(data => {
            currentReviews = data.reviews || [];
            displayReviews(currentReviews);
        })
        .catch(error => {
            console.log('⚠️  API server not running. Using demo reviews.');
            currentReviews = getDemoReviews();
            displayReviews(currentReviews);
        });
}

function loadGoogleData() {
    fetch(`${API_BASE}/api/google-data`)
        .then(response => {
            if (!response.ok) throw new Error(`Google data request failed: ${response.status}`);
            return response.json();
        })
        .then(data => {
            const rating = Number(data.rating);
            const count = Number(data.review_count);
            if (!Number.isFinite(rating) || rating < 0 || rating > 5 || !Number.isFinite(count) || count < 0) {
                throw new Error('Google review data has invalid rating or count');
            }
            document.getElementById('googleRating').textContent = rating.toFixed(1);
            document.getElementById('googleReviewCount').textContent = new Intl.NumberFormat(currentLanguage).format(count);
            renderRatingStars(rating);
        })
        .catch(error => {
            console.error('Could not load Google review data:', error);
            document.getElementById('googleRating').textContent = '—';
            document.getElementById('googleReviewCount').textContent = '—';
            renderRatingStars(0);
        });
}

function renderRatingStars(rating) {
    const container = document.getElementById('googleStars');
    if (!container) return;
    container.replaceChildren();
    for (let index = 0; index < 5; index += 1) {
        const star = document.createElement('span');
        const fill = Math.max(0, Math.min(1, rating - index));
        star.className = `rating-star ${fill === 1 ? 'full' : fill > 0 ? 'partial' : 'empty'}`;
        star.textContent = '★';
        if (fill > 0 && fill < 1) star.style.setProperty('--fill', `${fill * 100}%`);
        container.appendChild(star);
    }
}

function displayReviews(reviews) {
    const reviewsList = document.getElementById('reviewsList');
    if (!reviewsList) return;
    reviewsList.replaceChildren();
    
    if (reviews.length === 0) {
        const emptyMessage = document.createElement('p');
        emptyMessage.className = 'reviews-empty';
        emptyMessage.textContent = t('reviews_empty');
        reviewsList.appendChild(emptyMessage);
        return;
    }
    
    reviews.slice(0, 6).forEach((review, index) => {
        const reviewCard = document.createElement('div');
        reviewCard.className = 'review-card';
        reviewCard.style.animation = `slideIn 0.3s ease-out ${index * 0.05}s both`;
        
        const reviewHeader = document.createElement('div');
        reviewHeader.className = 'review-header';
        const author = document.createElement('span');
        author.className = 'review-author';
        author.textContent = review.name;
        const rating = document.createElement('span');
        rating.className = 'review-rating';
        rating.textContent = `${'★'.repeat(Math.max(0, Math.min(5, Number(review.rating) || 0)))}${'☆'.repeat(5 - Math.max(0, Math.min(5, Number(review.rating) || 0)))}`;
        reviewHeader.append(author, rating);

        const text = document.createElement('p');
        text.className = 'review-text';
        text.textContent = reviewTextTranslations[review.id]?.[currentLanguage] || review.text;
        const date = document.createElement('time');
        date.className = 'review-date';
        date.dateTime = review.date;
        date.textContent = new Date(review.date).toLocaleDateString(currentLanguage);
        reviewCard.append(reviewHeader, text, date);
        
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
            showNotification(t('review_new_notification'));
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
        background: linear-gradient(135deg, #6b5b4a 0%, #8b7355 100%);
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        z-index: 9999;
        animation: slideIn 0.3s ease-out;
        border-left: 4px solid #d4a574;
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
