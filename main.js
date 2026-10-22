/**
 * Brew & Bites — Main System JavaScript (main.js)
 * Global utilities, navigation, toast notifications, home page featured section,
 * and menu filtering/search controls.
 */

// Global Currency Formatter for Philippine Peso (₱)
function formatPHP(amount) {
    const num = Number(amount) || 0;
    return '₱' + num.toLocaleString('en-PH', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

/**
 * Universal Toast Notification Engine
 * @param {string} title 
 * @param {string} message 
 * @param {'success'|'error'|'info'} type 
 */
function showToast(title, message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let iconClass = 'fa-info-circle';
    if (type === 'success') iconClass = 'fa-check-circle';
    if (type === 'error') iconClass = 'fa-exclamation-circle';

    toast.innerHTML = `
        <div class="toast-icon">
            <i class="fas ${iconClass}"></i>
        </div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
    `;

    container.appendChild(toast);

    // Auto dismiss after 3.5 seconds
    setTimeout(() => {
        toast.classList.add('hide');
        setTimeout(() => toast.remove(), 350);
    }, 3500);
}

/**
 * Copy promo code to clipboard helper
 * @param {string} code 
 */
function copyPromoCode(code) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(code).then(() => {
            showToast('Code Copied!', `Promo code "${code}" copied to clipboard.`, 'success');
        }).catch(() => {
            fallbackCopy(code);
        });
    } else {
        fallbackCopy(code);
    }
}

function fallbackCopy(text) {
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    showToast('Code Copied!', `Promo code "${text}" copied.`, 'success');
}

/**
 * Render standard product card HTML
 * @param {Object} product 
 * @returns {string} HTML string
 */
function createProductCardHTML(product) {
    return `
        <article class="product-card" data-category="${product.category}" data-id="${product.id}">
            <div class="product-thumb-wrap">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                ${product.badge ? `<span class="badge badge-caramel product-badge-pos">${product.badge}</span>` : ''}
                <span class="product-dietary-pos">${product.dietary}</span>
            </div>
            <div class="product-body">
                <div class="product-meta">
                    <span class="product-category-tag">${product.categoryName}</span>
                    <div class="product-rating">
                        <i class="fas fa-star"></i>
                        <span>${product.rating.toFixed(1)}</span>
                        <span class="count">(${product.reviewsCount})</span>
                    </div>
                </div>
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-footer">
                    <div class="product-price">
                        <span class="price-label">Price</span>
                        <span class="amount">${formatPHP(product.price)}</span>
                    </div>
                    <button type="button" class="add-to-cart-btn" onclick="addToCart('${product.id}', 1)" aria-label="Add ${product.name} to cart">
                        <i class="fas fa-plus"></i> Add
                    </button>
                </div>
            </div>
        </article>
    `;
}

/* ==========================================================================
   Home Page Logic
   ========================================================================== */
function initHomePage() {
    const featuredContainer = document.getElementById('featured-products-grid');
    if (!featuredContainer || typeof PRODUCTS === 'undefined') return;

    // Pick top 4-6 popular items
    const featuredList = PRODUCTS.filter(p => p.popular).slice(0, 6);
    featuredContainer.innerHTML = featuredList.map(createProductCardHTML).join('');
}

/* ==========================================================================
   Menu Page Logic
   ========================================================================== */
let activeMenuCategory = 'all';
let currentSearchQuery = '';
let currentSortOrder = 'featured';

function renderMenuGrid() {
    const gridContainer = document.getElementById('menu-products-grid');
    const emptyState = document.getElementById('menu-empty-state');
    const countLabel = document.getElementById('menu-items-count');

    if (!gridContainer || typeof PRODUCTS === 'undefined') return;

    // Filter items
    let filtered = filterProducts(activeMenuCategory, currentSearchQuery);

    // Apply sorting
    if (currentSortOrder === 'price-low') {
        filtered.sort((a, b) => a.price - b.price);
    } else if (currentSortOrder === 'price-high') {
        filtered.sort((a, b) => b.price - a.price);
    } else if (currentSortOrder === 'rating') {
        filtered.sort((a, b) => b.rating - a.rating);
    } else if (currentSortOrder === 'name') {
        filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    // Update count display
    if (countLabel) {
        countLabel.textContent = `Showing ${filtered.length} of ${PRODUCTS.length} items`;
    }

    if (filtered.length === 0) {
        gridContainer.innerHTML = '';
        if (emptyState) emptyState.style.display = 'block';
    } else {
        if (emptyState) emptyState.style.display = 'none';
        gridContainer.innerHTML = filtered.map(createProductCardHTML).join('');
    }
}

function initMenuPage() {
    const searchInput = document.getElementById('menu-search-input');
    const sortSelect = document.getElementById('menu-sort-select');
    const filterButtons = document.querySelectorAll('.filter-btn');

    // Search input handler
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentSearchQuery = e.target.value.trim();
            renderMenuGrid();
        });
    }

    // Sort select handler
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            currentSortOrder = e.target.value;
            renderMenuGrid();
        });
    }

    // Category button handlers
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeMenuCategory = btn.getAttribute('data-category') || 'all';
            renderMenuGrid();
        });
    });

    // Check if category is passed via URL query (e.g., menu.html?category=coffee)
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    if (categoryParam) {
        const targetBtn = document.querySelector(`.filter-btn[data-category="${categoryParam}"]`);
        if (targetBtn) {
            filterButtons.forEach(b => b.classList.remove('active'));
            targetBtn.classList.add('active');
            activeMenuCategory = categoryParam;
        }
    }

    renderMenuGrid();
}

/* ==========================================================================
   Global Initialization (Navbar, Mobile Menu, Header Scroll)
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Drawer Toggle
    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileNav = document.getElementById('mobile-nav');

    if (mobileToggle && mobileNav) {
        mobileToggle.addEventListener('click', () => {
            const isOpen = mobileNav.classList.toggle('open');
            mobileToggle.classList.toggle('active');
            mobileToggle.setAttribute('aria-expanded', isOpen);
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileToggle.contains(e.target) && !mobileNav.contains(e.target)) {
                mobileNav.classList.remove('open');
                mobileToggle.classList.remove('active');
                mobileToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // 2. Header shadow on scroll
    const header = document.querySelector('.site-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 25) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // 3. Page specific inits
    if (document.getElementById('featured-products-grid')) {
        initHomePage();
    }

    if (document.getElementById('menu-products-grid')) {
        initMenuPage();
    }
});
