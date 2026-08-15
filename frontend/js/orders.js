/* =========================================================
   orders.js — Fetches and renders the logged-in user's
   order history.
   ========================================================= */

async function loadOrderHistory() {
  const container = document.getElementById('ordersList');
  if (!container) return;

  container.innerHTML = '<p class="loading-text">Loading your orders...</p>';

  try {
    const orders = await OrderAPI.getAll();
    renderOrders(orders, container);
  } catch (error) {
    container.innerHTML = `<div class="empty-state"><h3>Could not load orders</h3><p>${error.message}</p></div>`;
  }
}

function renderOrders(orders, container) {
  if (!orders || orders.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <h3>No orders yet</h3>
        <p>Your order history will show up here once you place an order.</p>
        <br />
        <a class="btn btn-primary" href="index.html">Start Shopping</a>
      </div>
    `;
    return;
  }

  container.innerHTML = orders
    .map((order) => {
      const date = new Date(order.createdAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });

      const itemsHtml = order.items
        .map(
          (item) => `
          <div class="order-item-row">
            <span>${item.name} × ${item.quantity}</span>
            <span>${formatCurrency(item.price * item.quantity)}</span>
          </div>
        `
        )
        .join('');

      return `
        <div class="order-card">
          <div class="order-card-header">
            <div>
              <div class="order-id">Order #${order._id.slice(-8).toUpperCase()}</div>
              <div class="order-id">${date}</div>
            </div>
            <span class="order-status">${order.status}</span>
          </div>
          ${itemsHtml}
          <div class="order-total">
            <span>Total</span>
            <span>${formatCurrency(order.totalAmount)}</span>
          </div>
        </div>
      `;
    })
    .join('');
}

document.addEventListener('DOMContentLoaded', () => {
  requireAuth();
  loadOrderHistory();
});
