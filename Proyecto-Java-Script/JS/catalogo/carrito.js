/* catalogo/carrito.js
   Operaciones del carrito y dibujo de su contenido. */

function renderCart() {
  const items = Object.values(cart);
  const count = items.reduce((total, item) => total + item.qty, 0);
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  el.cartCount.textContent = String(count);
  el.cartTotal.textContent = money(total);

  if (!items.length) {
    const empty = document.createElement('li');
    empty.className = 'empty';
    empty.textContent = 'Tu carrito está vacío.';
    el.cartItems.replaceChildren(empty);
    return;
  }

  el.cartItems.replaceChildren(...items.map((item) => {
    const li = document.createElement('li');
    li.className = 'cart-item';

    const img = document.createElement('img');
    img.src = item.image;
    img.alt = '';

    const info = document.createElement('div');
    const title = document.createElement('h3');
    title.textContent = item.title;
    const price = document.createElement('strong');
    price.textContent = money(item.price * item.qty);
    info.append(title, price);

    const actions = document.createElement('div');
    actions.className = 'cart-item-actions';
    const qtyLabel = document.createElement('span');
    qtyLabel.className = 'qty-label';
    qtyLabel.textContent = 'Cant.';
    const qty = document.createElement('div');
    qty.className = 'qty';

    const dec = document.createElement('button');
    dec.type = 'button';
    dec.dataset.dec = String(item.id);
    dec.setAttribute('aria-label', `Quitar una unidad de ${item.title}`);
    dec.textContent = '−';

    const quantity = document.createElement('span');
    quantity.textContent = String(item.qty);

    const inc = document.createElement('button');
    inc.type = 'button';
    inc.dataset.inc = String(item.id);
    inc.setAttribute('aria-label', `Agregar una unidad de ${item.title}`);
    inc.textContent = '+';

    qty.append(dec, quantity, inc);
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'remove';
    remove.dataset.remove = String(item.id);
    remove.setAttribute('aria-label', `Eliminar ${item.title} del carrito`);
    remove.textContent = 'Eliminar';
    actions.append(qtyLabel, qty, remove);

    li.append(img, info, actions);
    return li;
  }));
}

function updateCart() {
  saveCart();
  renderCart();
}

function addToCart(id) {
  const product = products.find((item) => item.id === id);
  if (!product) return;

  const current = cart[id];
  cart[id] = { ...product, qty: current ? current.qty + 1 : 1 };
  updateCart();
}

function changeQty(id, amount) {
  const item = cart[id];
  if (!item) return;

  item.qty += amount;
  if (item.qty <= 0) {
    delete cart[id];
  }
  updateCart();
}

function removeFromCart(id) {
  if (!cart[id]) return;
  delete cart[id];
  updateCart();
}

function clearCart() {
  cart = {};
  updateCart();
}
