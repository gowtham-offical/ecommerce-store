/* =========================================================
   checkout.js — Renders the checkout summary and submits
   the order to the backend.
   ========================================================= */

function renderCheckoutSummary() {
  const container = document.getElementById('checkoutItems');
  const subtotalEl = document.getElementById('checkoutSubtotal');
  const totalEl = document.getElementById('checkoutTotal');
  const placeOrderBtn = document.getElementById('placeOrderBtn');
  if (!container) return;

  const cart = getCart();

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <h3>Your cart is empty</h3>
        <p>Add some products before checking out.</p>
        <br />
        <a class="btn btn-primary" href="index.html">Browse Products</a>
      </div>
    `;
    if (placeOrderBtn) placeOrderBtn.disabled = true;
    return;
  }

  container.innerHTML = cart
    .map(
      (item) => `
      <div class="checkout-item-row">
        <span>${item.name} × ${item.quantity}</span>
        <span>${formatCurrency(item.price * item.quantity)}</span>
      </div>
    `
    )
    .join('');

  const subtotal = getCartSubtotal();
  if (subtotalEl) subtotalEl.textContent = formatCurrency(subtotal);
  if (totalEl) totalEl.textContent = formatCurrency(subtotal);
}

function initCheckoutForm() {
  const form = document.getElementById('checkoutForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const cart = getCart();
    if (cart.length === 0) return;

    const placeOrderBtn = document.getElementById('placeOrderBtn');
    placeOrderBtn.disabled = true;
    placeOrderBtn.textContent = 'Placing order...';

    const items = cart.map((item) => ({
      productId: item.productId,
      quantity: item.quantity
    }));

    try {
      const order = await OrderAPI.create(items);
      clearCart();
      localStorage.setItem('lastOrderId', order._id);
      window.location.href = 'checkout.html?confirmed=true';
    } catch (error) {
      showFormMessage(error.message);
      placeOrderBtn.disabled = false;
      placeOrderBtn.textContent = 'Place Order';
    }
  });
}

function checkOrderConfirmation() {
  const params = new URLSearchParams(window.location.search);
  const checkoutForm = document.getElementById('checkoutForm');
  const confirmationBox = document.getElementById('confirmationBox');
  if (!confirmationBox) return;

  if (params.get('confirmed') === 'true') {
    if (checkoutForm) checkoutForm.style.display = 'none';
    const summaryCard = document.getElementById('checkoutSummaryCard');
    if (summaryCard) summaryCard.style.display = 'none';
    confirmationBox.style.display = 'block';
  } else {
    confirmationBox.style.display = 'none';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  requireAuth();
  checkOrderConfirmation();
  renderCheckoutSummary();
  initCheckoutForm();
});
