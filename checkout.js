/**
 * Brew & Bites — Checkout Management (checkout.js)
 * Manages customer order forms, Pickup vs Delivery toggles, input validation,
 * live order summary sidebar, and demo order generation.
 */

let currentOrderType = 'delivery'; // Default

/**
 * Validate customer input fields
 * @returns {boolean} True if all valid
 */
function validateCheckoutForm() {
    let isValid = true;

    // Helper to set error state
    function setError(inputId, errorMsg) {
        const input = document.getElementById(inputId);
        const errText = document.getElementById(`${inputId}-error`);
        if (input) input.classList.add('error');
        if (errText) {
            errText.textContent = errorMsg;
            errText.classList.add('visible');
        }
        isValid = false;
    }

    // Helper to clear error state
    function clearError(inputId) {
        const input = document.getElementById(inputId);
        const errText = document.getElementById(`${inputId}-error`);
        if (input) input.classList.remove('error');
        if (errText) {
            errText.textContent = '';
            errText.classList.remove('visible');
        }
    }

    // 1. Full Name
    const nameInput = document.getElementById('cust-name');
    if (!nameInput || nameInput.value.trim().length < 2) {
        setError('cust-name', 'Please provide your full name (at least 2 characters).');
    } else {
        clearError('cust-name');
    }

    // 2. Phone Number (Philippine format: 09XXXXXXXXX or +639XXXXXXXXX)
    const phoneInput = document.getElementById('cust-phone');
    const cleanPhone = phoneInput ? phoneInput.value.replace(/[\s-]/g, '') : '';
    const phoneRegex = /^(09|\+639)\d{9}$/;
    if (!cleanPhone || !phoneRegex.test(cleanPhone)) {
        setError('cust-phone', 'Please enter a valid Philippine mobile number (e.g. 09171234567).');
    } else {
        clearError('cust-phone');
    }

    // 3. Email
    const emailInput = document.getElementById('cust-email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput || !emailRegex.test(emailInput.value.trim())) {
        setError('cust-email', 'Please enter a valid email address for your demo receipt.');
    } else {
        clearError('cust-email');
    }

    // 4. Delivery specific validation
    if (currentOrderType === 'delivery') {
        const addressInput = document.getElementById('cust-address');
        const cityInput = document.getElementById('cust-city');

        if (!addressInput || addressInput.value.trim().length < 5) {
            setError('cust-address', 'Please provide your complete street address.');
        } else {
            clearError('cust-address');
        }

        if (!cityInput || cityInput.value.trim().length < 2) {
            setError('cust-city', 'Please provide your Barangay and City.');
        } else {
            clearError('cust-city');
        }
    } else {
        clearError('cust-address');
        clearError('cust-city');
    }

    return isValid;
}

/**
 * Update the live summary sidebar on the Checkout page
 */
function renderCheckoutSummary() {
    const summaryItemsContainer = document.getElementById('checkout-items-list');
    const subtotalEl = document.getElementById('checkout-subtotal');
    const discountRow = document.getElementById('checkout-discount-row');
    const discountEl = document.getElementById('checkout-discount');
    const deliveryEl = document.getElementById('checkout-delivery');
    const totalEl = document.getElementById('checkout-total');

    const cart = getCart();

    if (summaryItemsContainer) {
        summaryItemsContainer.innerHTML = cart.map(item => `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.8rem; font-size: 0.92rem;">
                <div>
                    <span style="font-weight: 700; color: var(--color-coffee-800);">${item.quantity}x</span> 
                    <span style="color: var(--color-coffee-900);">${item.name}</span>
                </div>
                <div style="font-weight: 600; color: var(--color-coffee-900);">
                    ${formatPHP(item.price * item.quantity)}
                </div>
            </div>
        `).join('');
    }

    const totals = calculateTotals(currentOrderType);

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
        if (currentOrderType === 'pickup') {
            deliveryEl.innerHTML = '<span style="color: var(--color-text-muted); font-weight: 600;">Store Pickup</span>';
        } else if (totals.deliveryFee === 0) {
            deliveryEl.innerHTML = '<span style="color: var(--color-success); font-weight: 700;">FREE</span>';
        } else {
            deliveryEl.textContent = formatPHP(totals.deliveryFee);
        }
    }

    if (totalEl) totalEl.textContent = formatPHP(totals.grandTotal);
}

/**
 * Handle Order Type Toggle (Pickup vs Delivery)
 * @param {'delivery'|'pickup'} type 
 */
function setOrderType(type) {
    currentOrderType = type;

    const deliveryTab = document.getElementById('tab-delivery');
    const pickupTab = document.getElementById('tab-pickup');
    const deliveryFields = document.getElementById('delivery-fields-group');
    const pickupFields = document.getElementById('pickup-fields-group');

    if (type === 'delivery') {
        if (deliveryTab) deliveryTab.classList.add('active');
        if (pickupTab) pickupTab.classList.remove('active');
        if (deliveryFields) deliveryFields.style.display = 'block';
        if (pickupFields) pickupFields.style.display = 'none';
    } else {
        if (pickupTab) pickupTab.classList.add('active');
        if (deliveryTab) deliveryTab.classList.remove('active');
        if (deliveryFields) deliveryFields.style.display = 'none';
        if (pickupFields) pickupFields.style.display = 'block';
    }

    renderCheckoutSummary();
}

/**
 * Process order submission
 */
function handleOrderSubmit(e) {
    e.preventDefault();

    const cart = getCart();
    if (cart.length === 0) {
        alert('Your shopping cart is currently empty! Please select some items first.');
        window.location.href = 'menu.html';
        return;
    }

    if (!validateCheckoutForm()) {
        const firstError = document.querySelector('.form-input.error, .form-select.error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstError.focus();
        }
        if (typeof showToast === 'function') {
            showToast('Incomplete Form', 'Please complete all required fields.', 'error');
        }
        return;
    }

    const submitBtn = document.getElementById('place-order-btn');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Placing Demo Order...';
    }

    // Capture customer information
    const fullName = document.getElementById('cust-name').value.trim();
    const phone = document.getElementById('cust-phone').value.trim();
    const email = document.getElementById('cust-email').value.trim();
    
    let deliveryInfo = null;
    let pickupInfo = null;

    if (currentOrderType === 'delivery') {
        deliveryInfo = {
            address: document.getElementById('cust-address').value.trim(),
            city: document.getElementById('cust-city').value.trim(),
            notes: (document.getElementById('cust-notes') ? document.getElementById('cust-notes').value.trim() : '')
        };
    } else {
        pickupInfo = {
            branch: document.getElementById('pickup-branch') ? document.getElementById('pickup-branch').value : 'Makati Central Branch',
            time: document.getElementById('pickup-time') ? document.getElementById('pickup-time').value : 'As soon as possible (15-20 mins)'
        };
    }

    // Selected payment demo method
    const selectedPaymentEl = document.querySelector('input[name="payment_method"]:checked');
    const paymentMethod = selectedPaymentEl ? selectedPaymentEl.value : 'Cash on Delivery';

    // Generate unique demo order number
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const orderId = `BNB-2026-${randomSuffix}`;

    const totals = calculateTotals(currentOrderType);

    const completeOrder = {
        orderId: orderId,
        createdAt: new Date().toISOString(),
        customer: {
            name: fullName,
            phone: phone,
            email: email
        },
        orderType: currentOrderType,
        deliveryInfo: deliveryInfo,
        pickupInfo: pickupInfo,
        paymentMethod: paymentMethod,
        items: [...cart],
        totals: totals,
        status: 'Order Placed'
    };

    // Simulate short network delay for realistic experience
    setTimeout(() => {
        try {
            // Save order to localStorage
            localStorage.setItem('bnb_last_order', JSON.stringify(completeOrder));

            // Save to historical orders list
            const pastOrders = JSON.parse(localStorage.getItem('bnb_orders_history') || '[]');
            pastOrders.unshift(completeOrder);
            localStorage.setItem('bnb_orders_history', JSON.stringify(pastOrders.slice(0, 10)));

            // Clear active cart & active coupon
            localStorage.removeItem('bnb_cart');
            localStorage.removeItem('bnb_applied_coupon');
            updateNavCartBadge();

            // Redirect to confirmation page
            window.location.href = `confirmation.html?orderId=${orderId}`;
        } catch (err) {
            console.error('Failed to save order to localStorage', err);
            alert('An error occurred while creating your demo order. Please try again.');
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-check-circle"></i> Place Demo Order';
            }
        }
    }, 600);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    const checkoutForm = document.getElementById('checkout-form');
    if (!checkoutForm) return;

    // Verify cart is not empty
    const cart = getCart();
    if (cart.length === 0) {
        alert('Your shopping cart is empty! Redirecting you to our menu.');
        window.location.href = 'menu.html';
        return;
    }

    // Render initial checkout summary
    renderCheckoutSummary();

    // Order type tabs listeners
    const tabDelivery = document.getElementById('tab-delivery');
    const tabPickup = document.getElementById('tab-pickup');

    if (tabDelivery) {
        tabDelivery.addEventListener('click', () => setOrderType('delivery'));
    }
    if (tabPickup) {
        tabPickup.addEventListener('click', () => setOrderType('pickup'));
    }

    // Payment method visual selection
    const paymentRadios = document.querySelectorAll('input[name="payment_method"]');
    paymentRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            document.querySelectorAll('.payment-method-label').forEach(label => label.classList.remove('selected'));
            radio.closest('.payment-method-label').classList.add('selected');
        });
    });

    // Form submission
    checkoutForm.addEventListener('submit', handleOrderSubmit);
});
