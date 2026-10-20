/* catalogo/panel-carrito.js
   Abrir/cerrar el panel lateral del carrito y accesibilidad (foco, Escape, Tab). */

// Abre (true) o cierra (false) el panel del carrito.
function toggleCart(open) {
  const isOpen = el.cartPanel.classList.contains('open');
  if (open === isOpen) return;   // si ya está en ese estado, no hace nada

  // Al abrir, recuerda qué elemento tenía el foco para devolvérselo al cerrar.
  if (open) cartReturnFocus = document.activeElement;

  // Muestra u oculta el panel y la capa oscura, y avisa a los lectores de pantalla del estado.
  el.cartPanel.classList.toggle('open', open);
  el.cartPanel.setAttribute('aria-hidden', String(!open));
  el.toggle.setAttribute('aria-expanded', String(open));
  el.overlay.hidden = !open;
  el.overlay.setAttribute('aria-hidden', String(!open));

  // inert bloquea clics y teclado: el panel solo responde abierto y la página de fondo, cerrado.
  el.cartPanel.inert = !open;
  el.main.inert = open;
  document.body.classList.toggle('cart-open', open);   // bloquea el scroll del fondo (ver CSS)

  // Foco: al abrir va al botón de cerrar; al cerrar vuelve a donde estaba (o al botón del carrito).
  if (open) {
    el.close.focus();
  } else if (cartReturnFocus instanceof HTMLElement && cartReturnFocus.isConnected) {
    cartReturnFocus.focus();
    cartReturnFocus = null;
  } else {
    el.toggle.focus();
  }
}

// Teclado: Escape cierra el panel y Tab queda atrapado dentro mientras está abierto.
function handleCartKeydown(e) {
  if (!el.cartPanel.classList.contains('open')) return;   // solo actúa con el carrito abierto

  if (e.key === 'Escape') {
    e.preventDefault();
    toggleCart(false);
    return;
  }

  if (e.key !== 'Tab') return;

  // Lista los elementos del panel a los que se puede llegar con Tab (y que estén visibles).
  const focusable = [...el.cartPanel.querySelectorAll(
    'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
  )].filter((item) => item.getClientRects().length > 0);
  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (!first || !last) {
    // No hay nada enfocable: el foco se queda en el panel.
    e.preventDefault();
    el.cartPanel.focus();
  } else if (!el.cartPanel.contains(document.activeElement)) {
    // El foco se salió del panel: lo regresa al primero (o al último con Shift+Tab).
    e.preventDefault();
    (e.shiftKey ? last : first).focus();
  } else if (e.shiftKey && (document.activeElement === first || document.activeElement === el.cartPanel)) {
    // Shift+Tab en el primer elemento: salta al último.
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    // Tab en el último elemento: vuelve al primero.
    e.preventDefault();
    first.focus();
  }
}