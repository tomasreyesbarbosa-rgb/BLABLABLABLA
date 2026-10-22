/* compra/main.js
   Arranque de la página de compra: estado inicial y envío del formulario.
   Se carga al final. */
'use strict';

/* Estado inicial de la página */
// Lee el carrito y decide qué mostrar: el formulario con el resumen, o el aviso de carrito vacío.
function init() {
  items = loadCart();
  const hasItems = items.length > 0;
  ui.grid.hidden = !hasItems;
  ui.empty.hidden = hasItems;
  if (hasItems) renderSummary();
}

init();

// Si el usuario vuelve con el botón "atrás" (página en caché), refrescar el carrito.
window.addEventListener('pageshow', (e) => {
  if (e.persisted && ui.success.hidden) init();   // no lo hace si ya se mostró la confirmación de compra
});

/* Envío del formulario (pago) */
form.addEventListener('submit', async (e) => {
  e.preventDefault();                   // evita que el navegador recargue la página
  if (ui.pay.disabled) return;          // evita doble envío
  ui.payError.textContent = '';
  if (!items.length) return;

  // Valida todo; si hay un campo con error, lo enfoca y detiene el pago.
  const firstInvalid = validateAll();
  if (firstInvalid) {
    firstInvalid.focus();
    return;
  }

  // Los datos de la tarjeta viven solo en esta variable local; no se guardan en ningún lado.
  const card = {
    number: digits(field('tarjetaNumero').value),
    name: field('tarjetaNombre').value.trim(),
    exp: field('vencimiento').value,
    cvv: field('cvv').value,
  };
  const order = buildOrder(card);

  // Procesa el pago: si sale bien muestra la confirmación y limpia todo; si falla, muestra el error.
  setPaying(true);
  try {
    await processPayment(order, card);
    showSuccess(order);
    // Compra hecha: se vacía el carrito guardado para que index.html lo vea en cero.
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* sin acceso a localStorage */ }
    items = [];
    form.reset();
    ui.brand.textContent = '';
    [...form.elements].forEach((el) => el.removeAttribute('aria-invalid'));   // quita las marcas de error de los campos
  } catch (err) {
    ui.payError.textContent = err.message || 'No se pudo procesar el pago. Intenta de nuevo.';
  } finally {
    setPaying(false);   // devuelve el botón Pagar a su estado normal
  }
});