/* catalogo/eventos.js
   Conecta los elementos de la página con sus funciones. */

// Filtros: cada vez que se escribe o se cambia una opción, se vuelve a dibujar el catálogo.
el.search.addEventListener('input', render);
el.category.addEventListener('change', render);
el.sort.addEventListener('change', render);

// Agregar producto desde la parrilla: un solo listener en el contenedor detecta
// el clic en cualquier botón "Agregar" y toma el id del producto de su data-add.
el.products.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-add]');
  if (btn) {
    addToCart(Number(btn.dataset.add));
    return;
  }

  const viewButton = e.target.closest('[data-view]');
  const card = e.target.closest('.card');
  if (viewButton) {
    openProductViewer(Number(viewButton.dataset.view));
  } else if (card) {
    openProductViewer(Number(card.dataset.productId));
  }
});

// Botones dentro del carrito (+, −, eliminar): mismo truco, según el data-* del botón pulsado.
el.cartItems.addEventListener('click', (e) => {
  const t = e.target;
  if (t.dataset.inc) changeQty(Number(t.dataset.inc), 1);
  if (t.dataset.dec) changeQty(Number(t.dataset.dec), -1);
  if (t.dataset.remove) removeFromCart(Number(t.dataset.remove));
});

// Panel del carrito: vaciar, abrir, cerrar (con la ✕ o tocando la capa oscura) y control por teclado.
el.clear.addEventListener('click', clearCart);
el.toggle.addEventListener('click', () => toggleCart(true));
el.close.addEventListener('click', () => toggleCart(false));
el.overlay.addEventListener('click', () => toggleCart(false));
document.addEventListener('keydown', handleCartKeydown);