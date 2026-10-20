/* catalogo/productos.js
   Dibujo de las tarjetas de producto en la parrilla. */

// Arma la tarjeta de un producto: imagen, categoría, nombre, precio y botón "Agregar".
// El data-add del botón guarda el id del producto; eventos.js lo usa para saber cuál agregar.
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

// Redibuja la parrilla con los productos que pasan los filtros y actualiza el mensaje de estado.
function render() {
  const list = getVisibleProducts();
  el.products.replaceChildren(...list.map(createCard));   // reemplaza todo el contenido anterior por las tarjetas nuevas
  setStatus(list.length ? `${list.length} producto(s)` : 'No hay productos que coincidan con tu búsqueda.');
}