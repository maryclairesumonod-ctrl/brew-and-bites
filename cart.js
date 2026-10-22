/**
 * Brew & Bites — Shopping Cart Management (cart.js)
 * Handles cart persistence via localStorage, item updates, quantity controls,
 * coupon codes, and live UI synchronization across all pages.
 */

const CART_STORAGE_KEY = 'bnb_cart';
const COUPON_STORAGE_KEY = 'bnb_applied_coupon';

// Available Demo Discount Codes
const PROMO_CODES = {
    'BREW10': { type: 'percent', value: 0.10, desc: '10% Discount on Items' },
    'WELCOME50': { type: 'fixed', value: 50, minOrder: 250, desc: '₱50 Off (Orders ₱250+)' },
    'FREESHIP': { type: 'free_delivery', desc: 'Free Delivery' }
};

/**
 * Retrieve the current cart array from localStorage
 * @returns {Array} List of cart item objects
 */
function getCart() {
    try {
        const cartData = localStorage.getItem(CART_STORAGE_KEY);
        return cartData ? JSON.parse(cartData) : [];
    } catch (e) {
        console.error('Error reading cart from localStorage', e);
        return [];
    }
}

/**
 * Save cart array to localStorage and update badge
 * @param {Array} cart 
 */
function saveCart(cart) {
    try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
        updateNavCartBadge();
    } catch (e) {
        console.error('Error saving cart to localStorage', e);
    }
}

/**
 * Get total number of individual items in cart
 * @returns {number}
 */
function getCartItemCount() {
    const cart = getCart();
    return cart.reduce((total, item) => total + (item.quantity || 1), 0);
}

/**
 * Update the cart badge count in the navigation bar
 */
function updateNavCartBadge() {
    const badges = document.querySelectorAll('.cart-badge');
    const count = getCartItemCount();
    
    badges.forEach(badge => {
        badge.textContent = count;
        // Visual bump animation
        badge.classList.remove('bump');
        void badge.offsetWidth; // Trigger reflow
        badge.classList.add('bump');
    });
}

/**
 * Add a product to the cart
 * @param {string} productId 
 * @param {number} quantity 
 */
function addToCart(productId, quantity = 1) {
    // Ensure quantity is positive integer
    const qtyToAdd = Math.max(1, parseInt(quantity, 10) || 1);
    const product = typeof getProductById === 'function' ? getProductById(productId) : null;
    
    if (!product) {
        console.error('Product not found:', productId);
        return false;
    }

    const cart = getCart();
    const existingIndex = cart.findIndex(item => item.id === productId);

    if (existingIndex > -1) {
        cart[existingIndex].quantity = (cart[existingIndex].quantity || 1) + qtyToAdd;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            category: product.category,
            categoryName: product.categoryName,
            quantity: qtyToAdd
        });
    }

    saveCart(cart);

    if (typeof showToast === 'function') {
        showToast(
            'Added to Cart!', 
            `${qtyToAdd}x ${product.name} added to your tray.`, 
            'success'
        );
    }

    return true;
}

/**
 * Update item quantity in the cart
 * @param {string} productId 
 * @param {number} newQuantity 
 */
function updateCartQuantity(productId, newQuantity) {
    const parsedQty = parseInt(newQuantity, 10);
    const cart = getCart();
    const itemIndex = cart.findIndex(item => item.id === productId);

    if (itemIndex === -1) return;

    if (parsedQty <= 0) {
        // Confirm removal if quantity reduced to 0
        removeCartItem(productId);
        return;
    }

    // Set updated quantity (cap at 99)
    cart[itemIndex].quantity = Math.min(99, parsedQty);
    saveCart(cart);

    // If on the cart page, re-render
    if (document.getElementById('cart-items-container')) {
        renderCartPage();
    }
}

/**
 * Remove an item completely from the cart
 * @param {string} productId 
 */
function removeCartItem(productId) {
    let cart = getCart();
    const itemToRemove = cart.find(item => item.id === productId);
    
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);

    if (typeof showToast === 'function' && itemToRemove) {
        showToast('Item Removed', `${itemToRemove.name} was removed from your cart.`, 'info');
    }

    // If on the cart page, re-render
    if (document.getElementById('cart-items-container')) {
        renderCartPage();
    }
}

/**
 * Clear the entire cart
 * @param {boolean} promptUser 
 */
function clearCart(promptUser = true) {
    if (promptUser && !confirm('Are you sure you want to empty your shopping cart?')) {
        return;
    }

    localStorage.removeItem(CART_STORAGE_KEY);
    localStorage.removeItem(COUPON_STORAGE_KEY);
    updateNavCartBadge();

    if (typeof showToast === 'function') {
        showToast('Cart Cleared', 'All items have been removed.', 'info');
    }

    // If on the cart page, re-render
    if (document.getElementById('cart-items-container')) {
        renderCartPage();
    }
}

/**
 * Get active coupon code
 */
function getActiveCoupon() {
    try {
        const stored = localStorage.getItem(COUPON_STORAGE_KEY);
        return stored ? JSON.parse(stored) : null;
    } catch (e) {
        return null;
    }
}

/**
 * Apply coupon code
 * @param {string} rawCode 
 */
function applyCoupon(rawCode) {
    const code = (rawCode || '').trim().toUpperCase();
    const msgEl = document.getElementById('coupon-message');

    if (!code) {
        if (msgEl) {
            msgEl.className = 'coupon-applied-msg error';
            msgEl.textContent = 'Please enter a coupon code.';
        }
        return false;
    }

    const coupon = PROMO_CODES[code];
    if (!coupon) {
        if (msgEl) {
            msgEl.className = 'coupon-applied-msg error';
            msgEl.textContent = 'Invalid promo code. Try "BREW10" or "WELCOME50"';
        }
        return false;
    }

    const cart = getCart();
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    if (coupon.minOrder && subtotal < coupon.minOrder) {
        if (msgEl) {
            msgEl.className = 'coupon-applied-msg error';
            msgEl.textContent = `Order must be at least ₱${coupon.minOrder} to use this code.`;
        }
        return false;
    }

    localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify({ code, ...coupon }));

    if (msgEl) {
        msgEl.className = 'coupon-applied-msg success';
        msgEl.textContent = `Promo "${code}" applied! ${coupon.desc}`;
    }

    if (typeof showToast === 'function') {
        showToast('Coupon Applied', `Code ${code} activated successfully!`, 'success');
    }

    if (document.getElementById('cart-items-container')) {
        renderCartPage();
    }

    return true;
}

/**
 * Remove active coupon
 */
function removeCoupon() {
    localStorage.removeItem(COUPON_STORAGE_KEY);
    if (document.getElementById('cart-items-container')) {
        renderCartPage();
    }
}

/**
 * Calculate totals for cart / checkout
 * @param {string} orderType 'delivery' or 'pickup'
 * @returns {Object} { subtotal, discount, deliveryFee, tax, grandTotal }
 */
function calculateTotals(orderType = 'delivery') {
    const cart = getCart();
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const coupon = getActiveCoupon();

    let discount = 0;
    let isFreeDeliveryCoupon = false;

    if (coupon && subtotal > 0) {
        if (coupon.type === 'percent') {
            discount = subtotal * coupon.value;
        } else if (coupon.type === 'fixed') {
            discount = coupon.value;
        } else if (coupon.type === 'free_delivery') {
            isFreeDeliveryCoupon = true;
        }
    }

    // Delivery fee logic: ₱59 standard, free if order >= ₱600 or pickup
    let deliveryFee = 0;
    if (orderType === 'delivery') {
        if (subtotal >= 600 || isFreeDeliveryCoupon || subtotal === 0) {
            deliveryFee = 0;
        } else {
            deliveryFee = 59;
        }
    }

    // Ensure discount doesn't exceed subtotal
    discount = Math.min(discount, subtotal);
    const taxableAmount = Math.max(0, subtotal - discount);
    // 5% front-end simulated service/VAT buffer included or calculated
    const grandTotal = Math.max(0, taxableAmount + deliveryFee);

    return {
        subtotal,
        discount,
        deliveryFee,
        grandTotal,
        appliedCoupon: coupon
    };
}

/**
 * Render the Cart Page UI
 */
function renderCartPage() {
    const itemsContainer = document.getElementById('cart-items-container');
    const emptyState = document.getElementById('cart-empty-state');
    const layoutWrapper = document.getElementById('cart-layout-wrapper');

    if (!itemsContainer) return;

    const cart = getCart();

    if (cart.length === 0) {
        if (emptyState) emptyState.style.display = 'block';
        if (layoutWrapper) layoutWrapper.style.display = 'none';
        return;
    }

    if (emptyState) emptyState.style.display = 'none';
    if (layoutWrapper) layoutWrapper.style.display = 'grid';

    // Render items list
    itemsContainer.innerHTML = cart.map(item => {
        const itemTotal = item.price * item.quantity;
        return `
            <div class="cart-item-row" data-id="${item.id}">
                <div class="cart-item-img">
                    <img src="${item.image}" alt="${item.name}" loading="lazy">
                </div>
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p class="cart-item-unit-price">${typeof formatPHP === 'function' ? formatPHP(item.price) : '₱' + item.price.toFixed(2)} each</p>
                </div>
                <div class="quantity-control" aria-label="Quantity for ${item.name}">
                    <button type="button" class="qty-btn" onclick="updateCartQuantity('${item.id}', ${item.quantity - 1})" title="Decrease quantity">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span class="qty-value">${item.quantity}</span>
                    <button type="button" class="qty-btn" onclick="updateCartQuantity('${item.id}', ${item.quantity + 1})" title="Increase quantity">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                <div class="cart-item-subtotal">
                    ${typeof formatPHP === 'function' ? formatPHP(itemTotal) : '₱' + itemTotal.toFixed(2)}
                </div>
                <button type="button" class="cart-item-remove-btn" onclick="removeCartItem('${item.id}')" title="Remove ${item.name}">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        `;
    }).join('');

    // Update order summary card
    const totals = calculateTotals('delivery');
    
    const subtotalEl = document.getElementById('summary-subtotal');
    const discountRow = document.getElementById('summary-discount-row');
    const discountEl = document.getElementById('summary-discount');
    const deliveryEl = document.getElementById('summary-delivery');
    const totalEl = document.getElementById('summary-total');

    if (subtotalEl) subtotalEl.textContent = formatPHP(totals.subtotal);

    if (discountRow && discountEl) {
        if (totals.discount > 0) {
            discountRow.style.display = 'flex';
            discountEl.textContent = `-${formatPHP(totals.discount)}`;
        } else {
            discountRow.style.display = 'none';
        }
    }

    if (deliveryEl) {
        if (totals.deliveryFee === 0) {
            deliveryEl.innerHTML = '<span style="color: var(--color-success); font-weight: 700;">FREE</span>';
        } else {
            deliveryEl.textContent = formatPHP(totals.deliveryFee);
        }
    }

    if (totalEl) totalEl.textContent = formatPHP(totals.grandTotal);
}

// Global initialization for cart badge
document.addEventListener('DOMContentLoaded', () => {
    updateNavCartBadge();
    if (document.getElementById('cart-items-container')) {
        renderCartPage();

        // Setup coupon form submission
        const couponForm = document.getElementById('coupon-form');
        if (couponForm) {
            couponForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const codeInput = document.getElementById('coupon-input');
                if (codeInput) {
                    applyCoupon(codeInput.value);
                }
            });
        }
    }
});
