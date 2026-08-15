/* =========================================================
   cart.js — Shopping cart stored in localStorage.
   Cart shape: [{ productId, name, price, image, quantity }]
   ========================================================= */

const CART_STORAGE_KEY = 'cart';

/** Reads the cart array from localStorage */
function getCart() {
  const raw = localStorage.getItem(CART_STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

/** Saves the cart array to localStorage and refreshes the nav badge */
function saveCart(cart) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  updateCartCount();
}

/** Adds a product to the cart, or increases quantity if it's already there */
function addToCart(product, quantity = 1) {
  const cart = getCart();
  const existing = cart.find((item) => item.productId === product._id);

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({
      productId: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity
    });
  }

  saveCart(cart);
}

/** Updates the quantity of a specific cart item (removes it if quantity <= 0) */
function updateCartQuantity(productId, quantity) {
  let cart = getCart();

  if (quantity <= 0) {
    cart = cart.filter((item) => item.productId !== productId);
  } else {
    const item = cart.find((i) => i.productId === productId);
    if (item) item.quantity = quantity;
  }

  saveCart(cart);
  return cart;
}

/** Removes an item from the cart entirely */
function removeFromCart(productId) {
  const cart = getCart().filter((item) => item.productId !== productId);
  saveCart(cart);
  return cart;
}

/** Empties the cart completely (used after a successful checkout) */
function clearCart() {
  saveCart([]);
}

/** Returns the total number of items (sum of quantities) in the cart */
function getCartItemCount() {
  return getCart().reduce((sum, item) => sum + item.quantity, 0);
}

/** Returns the subtotal price of all items in the cart */
function getCartSubtotal() {
  return getCart().reduce((sum, item) => sum + item.price * item.quantity, 0);
}

/** Updates the little badge in the navbar showing cart item count */
function updateCartCount() {
  const badge = document.getElementById('navCartCount');
  if (!badge) return;
  const count = getCartItemCount();
  badge.textContent = count;
  badge.style.display = count > 0 ? 'inline-block' : 'none';
}

/** Formats a number as a USD currency string */
function formatCurrency(amount) {
  return `$${Number(amount).toFixed(2)}`;
}

/* ---------- Render the cart page ---------- */
function renderCartPage() {
  const cartItemsEl = document.getElementById('cartItems');
  const cartSummaryEl = document.getElementById('cartSummaryContent');
  if (!cartItemsEl) return;

  const cart = getCart();

  if (cart.length === 0) {
    cartItemsEl.innerHTML = `
      <div class="empty-state">
        <h3>Your cart is empty</h3>
        <p>Browse our products and add something you like.</p>
        <br />
        <a class="btn btn-primary" href="index.html">Continue Shopping</a>
      </div>
    `;
    if (cartSummaryEl) cartSummaryEl.style.display = 'none';
    return;
  }

  if (cartSummaryEl) cartSummaryEl.style.display = 'block';

  cartItemsEl.innerHTML = cart
    .map(
      (item) => `
      <div class="cart-item" data-id="${item.productId}">
        <img src="${item.image}" alt="${item.name}" />
        <div>
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">${formatCurrency(item.price)} each</div>
        </div>
        <div class="cart-item-actions">
          <div class="qty-selector">
            <button type="button" class="qty-decrease" data-id="${item.productId}">−</button>
            <span>${item.quantity}</span>
            <button type="button" class="qty-increase" data-id="${item.productId}">+</button>
          </div>
          <button type="button" class="cart-item-remove" data-id="${item.productId}">Remove</button>
        </div>
      </div>
    `
    )
    .join('');

  renderCartSummary();
  attachCartItemListeners();
}

function renderCartSummary() {
  const subtotalEl = document.getElementById('summarySubtotal');
  const totalEl = document.getElementById('summaryTotal');
  if (!subtotalEl || !totalEl) return;

  const subtotal = getCartSubtotal();
  subtotalEl.textContent = formatCurrency(subtotal);
  totalEl.textContent = formatCurrency(subtotal);
}

function attachCartItemListeners() {
  document.querySelectorAll('.qty-increase').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const cart = getCart();
      const item = cart.find((i) => i.productId === id);
      if (item) updateCartQuantity(id, item.quantity + 1);
      renderCartPage();
    });
  });

  document.querySelectorAll('.qty-decrease').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const cart = getCart();
      const item = cart.find((i) => i.productId === id);
      if (item) updateCartQuantity(id, item.quantity - 1);
      renderCartPage();
    });
  });

  document.querySelectorAll('.cart-item-remove').forEach((btn) => {
    btn.addEventListener('click', () => {
      removeFromCart(btn.dataset.id);
      renderCartPage();
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  renderCartPage();
});
