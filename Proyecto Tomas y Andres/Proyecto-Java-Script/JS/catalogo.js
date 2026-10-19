const API_URL = 'https://fakestoreapi.com/products';
const STORAGE_KEY = 'tienda-cart';

// Estado de la app
let products = [];
let cart = loadCart(); 

const $ = (id) => document.getElementById(id);
const el = {
  products: $('products'), status: $('status'), search: $('search'),
  category: $('category'), sort: $('sort'), cartPanel: $('cart'),
  cartItems: $('cart-items'), cartTotal: $('cart-total'), cartCount: $('cart-count'),
  toggle: $('cart-toggle'), close: $('cart-close'), overlay: $('overlay'), clear: $('cart-clear'),
  main: document.querySelector('main'),
};
const money = (n) => `$${n.toFixed(2)}`;
let cartReturnFocus = null;

/* API */
async function fetchProducts() {
  setStatus('Cargando productos…');
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(`Error ${res.status}`);
    products = await res.json();
    fillCategories();
    render();
  } catch (err) {
    setStatus('No se pudieron cargar los productos. Revisa tu conexión y recarga la página.', true);
    console.error(err);
  }
}

function setStatus(msg, isError = false) {
  el.status.textContent = msg;
  el.status.classList.toggle('error', isError);
}

/* Filtros y orden */
function fillCategories() {
  [...new Set(products.map((p) => p.category))].forEach((c) => {
    const opt = document.createElement('option');
    opt.value = c;
    opt.textContent = c;
    el.category.appendChild(opt);
  });
}

function getVisibleProducts() {
  const q = el.search.value.trim().toLowerCase();
  const cat = el.category.value;
  const list = products.filter((p) =>
    (cat === 'all' || p.category === cat) &&
    (!q || p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)));

  const sorters = {
    'price-asc': (a, b) => a.price - b.price,
    'price-desc': (a, b) => b.price - a.price,
    'name-asc': (a, b) => a.title.localeCompare(b.title),
    'name-desc': (a, b) => b.title.localeCompare(a.title),
  };
  const sorter = sorters[el.sort.value];
  return sorter ? list.sort(sorter) : list;
}

/*Render de productos*/
function createCard(p) {
  const card = document.createElement('article');
  card.className = 'card';
  card.innerHTML = `
    <div class="card-img"><img src="${p.image}" alt="${p.title}" loading="lazy"></div>
    <div class="card-body">
      <p class="card-cat">${p.category}</p>
      <h2 class="card-title" title="${p.title}">${p.title}</h2>
      <div class="card-foot">
        <span class="price">${money(p.price)}</span>
        <button class="btn" data-add="${p.id}">Agregar</button>
      </div>
    </div>`;
  return card;
}

function render() {
  const list = getVisibleProducts();
  el.products.replaceChildren(...list.map(createCard));
  setStatus(list.length ? `${list.length} producto(s)` : 'No hay productos que coincidan con tu búsqueda.');
}

/*Carrito*/
function loadCart() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
  catch { return {}; }
}
function saveCart() { localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)); }

function addToCart(id) {
  const p = products.find((x) => x.id === id);
  if (!p) return;
  if (cart[id]) cart[id].qty += 1;
  else cart[id] = { id: p.id, title: p.title, price: p.price, image: p.image, qty: 1 };
  updateCart();
}
function changeQty(id, delta) {
  if (!cart[id]) return;
  cart[id].qty += delta;
  if (cart[id].qty <= 0) delete cart[id];
  updateCart();
}
function removeFromCart(id) { delete cart[id]; updateCart(); }
function clearCart() { cart = {}; updateCart(); }

function updateCart() {
  saveCart();
  renderCart();
}

function renderCart() {
  const items = Object.values(cart);
  el.cartItems.replaceChildren();
  if (!items.length) {
    const li = document.createElement('li');
    li.className = 'empty';
    li.textContent = 'Tu carrito está vacío. Agrega productos desde el catálogo.';
    el.cartItems.appendChild(li);
  }
  items.forEach((it) => {
    const li = document.createElement('li');
    li.className = 'cart-item';
    li.innerHTML = `
      <img src="${it.image}" alt="">
      <div>
        <h3>${it.title}</h3>
        <div class="qty">
          <button data-dec="${it.id}" aria-label="Quitar una unidad">−</button>
          <span>${it.qty}</span>
          <button data-inc="${it.id}" aria-label="Agregar una unidad">+</button>
        </div>
      </div>
      <div>
        <strong>${money(it.price * it.qty)}</strong><br>
        <button class="remove" data-remove="${it.id}">Eliminar</button>
      </div>`;
    el.cartItems.appendChild(li);
  });
  el.cartTotal.textContent = money(items.reduce((s, it) => s + it.price * it.qty, 0));
  el.cartCount.textContent = items.reduce((s, it) => s + it.qty, 0);
  el.clear.disabled = !items.length;
}

function toggleCart(open) {
  const isOpen = el.cartPanel.classList.contains('open');
  if (open === isOpen) return;

  if (open) cartReturnFocus = document.activeElement;
  el.cartPanel.classList.toggle('open', open);
  el.cartPanel.setAttribute('aria-hidden', String(!open));
  el.toggle.setAttribute('aria-expanded', String(open));
  el.overlay.hidden = !open;
  el.overlay.setAttribute('aria-hidden', String(!open));
  el.cartPanel.inert = !open;
  el.main.inert = open;
  document.body.classList.toggle('cart-open', open);

  if (open) {
    el.close.focus();
  } else if (cartReturnFocus instanceof HTMLElement && cartReturnFocus.isConnected) {
    cartReturnFocus.focus();
    cartReturnFocus = null;
  } else {
    el.toggle.focus();
  }
}

/* Eventos */
el.search.addEventListener('input', render);
el.category.addEventListener('change', render);
el.sort.addEventListener('change', render);

el.products.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-add]');
  if (btn) addToCart(Number(btn.dataset.add));
});
el.cartItems.addEventListener('click', (e) => {
  const t = e.target;
  if (t.dataset.inc) changeQty(Number(t.dataset.inc), 1);
  if (t.dataset.dec) changeQty(Number(t.dataset.dec), -1);
  if (t.dataset.remove) removeFromCart(Number(t.dataset.remove));
});
el.clear.addEventListener('click', clearCart);
el.toggle.addEventListener('click', () => toggleCart(true));
el.close.addEventListener('click', () => toggleCart(false));
el.overlay.addEventListener('click', () => toggleCart(false));
document.addEventListener('keydown', (e) => {
  if (!el.cartPanel.classList.contains('open')) return;

  if (e.key === 'Escape') {
    e.preventDefault();
    toggleCart(false);
    return;
  }

  if (e.key !== 'Tab') return;
  const focusable = [...el.cartPanel.querySelectorAll(
    'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
  )].filter((item) => item.getClientRects().length > 0);
  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (!first || !last) {
    e.preventDefault();
    el.cartPanel.focus();
  } else if (!el.cartPanel.contains(document.activeElement)) {
    e.preventDefault();
    (e.shiftKey ? last : first).focus();
  } else if (e.shiftKey && (document.activeElement === first || document.activeElement === el.cartPanel)) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
});

/* Inicio */
renderCart();
fetchProducts();
