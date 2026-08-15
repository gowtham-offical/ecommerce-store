/* =========================================================
   products.js — Product listing (index.html) and
   product details (product.html) logic.
   ========================================================= */

/* ---------- Product Listing Page ---------- */
async function loadProductListing() {
  const grid = document.getElementById('productGrid');
  if (!grid) return;

  const searchInput = document.getElementById('searchInput');
  const categorySelect = document.getElementById('categoryFilter');

  async function fetchAndRender() {
    const params = new URLSearchParams();
    if (searchInput && searchInput.value.trim()) {
      params.set('search', searchInput.value.trim());
    }
    if (categorySelect && categorySelect.value) {
      params.set('category', categorySelect.value);
    }

    const query = params.toString() ? `?${params.toString()}` : '';

    grid.innerHTML = '<p class="loading-text">Loading products...</p>';

    try {
      const products = await ProductAPI.getAll(query);
      renderProductGrid(products, grid);
      if (categorySelect && categorySelect.dataset.populated !== 'true') {
        populateCategoryFilter(products, categorySelect);
      }
    } catch (error) {
      grid.innerHTML = `<div class="empty-state"><h3>Could not load products</h3><p>${error.message}</p></div>`;
    }
  }

  if (searchInput) {
    let debounceTimer;
    searchInput.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(fetchAndRender, 350);
    });
  }

  if (categorySelect) {
    categorySelect.addEventListener('change', fetchAndRender);
  }

  fetchAndRender();
}

function renderProductGrid(products, grid) {
  if (!products || products.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <h3>No products found</h3>
        <p>Try a different search term or category.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = products
    .map(
      (product) => `
      <div class="product-card">
        <span class="product-card-tag">${product.category}</span>
        <a href="product.html?id=${product._id}">
          <img class="product-card-image" src="${product.image}" alt="${product.name}" />
        </a>
        <div class="product-card-body">
          <a href="product.html?id=${product._id}"><h3>${product.name}</h3></a>
          <span class="product-card-stock ${product.stock === 0 ? 'out' : ''}">
            ${product.stock === 0 ? 'Out of stock' : `${product.stock} in stock`}
          </span>
          <span class="product-card-price">${formatCurrency(product.price)}</span>
          <button
            class="btn btn-primary btn-block add-to-cart-btn"
            data-id="${product._id}"
            ${product.stock === 0 ? 'disabled' : ''}
          >
            ${product.stock === 0 ? 'Unavailable' : 'Add to Cart'}
          </button>
        </div>
      </div>
    `
    )
    .join('');

  document.querySelectorAll('.add-to-cart-btn').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id;
      const product = products.find((p) => p._id === id);
      if (!product) return;

      addToCart(product, 1);

      const originalText = btn.textContent;
      btn.textContent = 'Added ✓';
      setTimeout(() => {
        btn.textContent = originalText;
      }, 1000);
    });
  });
}

function populateCategoryFilter(products, select) {
  const categories = [...new Set(products.map((p) => p.category))];
  categories.forEach((cat) => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    select.appendChild(option);
  });
  select.dataset.populated = 'true';
}

/* ---------- Product Detail Page ---------- */
async function loadProductDetail() {
  const container = document.getElementById('productDetailContainer');
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const productId = params.get('id');

  if (!productId) {
    container.innerHTML = '<div class="empty-state"><h3>Product not found</h3></div>';
    return;
  }

  try {
    const product = await ProductAPI.getById(productId);
    renderProductDetail(product, container);
  } catch (error) {
    container.innerHTML = `<div class="empty-state"><h3>Could not load product</h3><p>${error.message}</p></div>`;
  }
}

function renderProductDetail(product, container) {
  container.innerHTML = `
    <div class="product-detail">
      <div class="product-detail-image">
        <img src="${product.image}" alt="${product.name}" />
      </div>
      <div class="product-detail-info">
        <span class="category-label">${product.category}</span>
        <h1>${product.name}</h1>
        <div class="price">${formatCurrency(product.price)}</div>
        <p class="description">${product.description}</p>
        <span class="product-card-stock ${product.stock === 0 ? 'out' : ''}">
          ${product.stock === 0 ? 'Out of stock' : `${product.stock} in stock`}
        </span>
        <br /><br />
        <div class="qty-selector" id="detailQtySelector">
          <button type="button" id="qtyDecrease">−</button>
          <span id="qtyValue">1</span>
          <button type="button" id="qtyIncrease">+</button>
        </div>
        <button
          class="btn btn-primary"
          id="detailAddToCartBtn"
          ${product.stock === 0 ? 'disabled' : ''}
        >
          ${product.stock === 0 ? 'Unavailable' : 'Add to Cart'}
        </button>
      </div>
    </div>
  `;

  let quantity = 1;
  const qtyValueEl = document.getElementById('qtyValue');

  document.getElementById('qtyIncrease').addEventListener('click', () => {
    if (quantity < product.stock) {
      quantity++;
      qtyValueEl.textContent = quantity;
    }
  });

  document.getElementById('qtyDecrease').addEventListener('click', () => {
    if (quantity > 1) {
      quantity--;
      qtyValueEl.textContent = quantity;
    }
  });

  document.getElementById('detailAddToCartBtn').addEventListener('click', (e) => {
    addToCart(product, quantity);
    const btn = e.target;
    const original = btn.textContent;
    btn.textContent = 'Added to Cart ✓';
    setTimeout(() => {
      btn.textContent = original;
    }, 1200);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  loadProductListing();
  loadProductDetail();
});
