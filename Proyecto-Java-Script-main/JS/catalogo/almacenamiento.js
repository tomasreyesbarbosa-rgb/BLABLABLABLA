/* catalogo/almacenamiento.js
   Lectura y escritura del carrito en localStorage. */

// Trae el carrito guardado; si no hay nada o está dañado, devuelve uno vacío.
function loadCart() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
  catch { return {}; }
}

// Guarda el carrito actual (variable global `cart`, definida en estado.js) para que no se pierda al recargar.
function saveCart() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}