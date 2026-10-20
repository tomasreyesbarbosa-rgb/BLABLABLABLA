/* compra/carrito.js
   Lee el carrito guardado en localStorage y calcula los totales. */
'use strict';

// Lee el carrito que dejó el catálogo y lo convierte en una lista de productos.
// Descarta entradas dañadas (sin precio o cantidad válidos); si algo falla, devuelve una lista vacía.
function loadCart() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    return Object.values(raw).filter(
      (it) => it && Number.isFinite(it.price) && Number.isFinite(it.qty) && it.qty > 0
    );
  } catch {
    return [];
  }
}

// Productos del pedido actual
let items = loadCart();

// Calcula subtotal, envío y total de una lista de productos.
// El envío es gratis si el carrito está vacío o el subtotal llega al mínimo; si no, se cobra la tarifa fija.
function totals(list) {
  const subtotal = list.reduce((s, it) => s + it.price * it.qty, 0);
  const shipping = !subtotal || subtotal >= FREE_SHIPPING_FROM ? 0 : SHIPPING_FLAT;
  return { subtotal, shipping, total: subtotal + shipping };
}