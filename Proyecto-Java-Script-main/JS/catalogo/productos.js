/* catalogo/productos.js
   Dibujo de las tarjetas de producto en la parrilla. */

// Arma la tarjeta de un producto: imagen, categoría, nombre, precio y botón "Agregar".
// El data-add del botón guarda el id del producto; eventos.js lo usa para saber cuál agregar.
function createCard(p) {
  const card = document.createElement('article');
  card.className = 'card';
  card.dataset.productId = String(p.id);

  const view = document.createElement('button');
  view.className = 'card-view';
  view.type = 'button';
  view.dataset.view = String(p.id);
  view.setAttribute('aria-label', `Ver detalles de ${p.title}`);

  const imageWrap = document.createElement('span');
  imageWrap.className = 'card-img';
  const image = document.createElement('img');
  image.src = p.image;
  image.alt = '';
  image.loading = 'lazy';
  imageWrap.append(image);

  const body = document.createElement('span');
  body.className = 'card-body';
  const category = document.createElement('span');
  category.className = 'card-cat';
  category.textContent = p.category;
  const title = document.createElement('span');
  title.className = 'card-title';
  title.title = p.title;
  title.textContent = p.title;
  body.append(category, title);
  view.append(imageWrap, body);

  const footer = document.createElement('div');
  footer.className = 'card-foot';
  const price = document.createElement('span');
  price.className = 'price';
  price.textContent = money(p.price);
  const add = document.createElement('button');
  add.className = 'btn';
  add.type = 'button';
  add.dataset.add = String(p.id);
  add.textContent = 'Agregar';
  footer.append(price, add);

  card.append(view, footer);
  return card;
}

// Redibuja la parrilla con los productos que pasan los filtros y actualiza el mensaje de estado.
function render() {
  const list = getVisibleProducts();
  el.products.replaceChildren(...list.map(createCard));   // reemplaza todo el contenido anterior por las tarjetas nuevas
  setStatus(list.length ? `${list.length} producto(s)` : 'No hay productos que coincidan con tu búsqueda.');
}