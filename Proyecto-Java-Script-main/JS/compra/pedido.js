/* compra/pedido.js
   Armado del pedido, simulación del pago y pantalla de confirmación. */
'use strict';

// Arma el pedido con una copia de los productos, los totales, los datos del cliente
// y un identificador único generado a partir de la hora actual.
function buildOrder(card) {
  const list = items.map((it) => ({ ...it }));   // copia cada producto para que el pedido no cambie si el carrito se modifica
  return {
    id: `PED-${Date.now().toString(36).toUpperCase()}`,
    createdAt: new Date().toISOString(),
    items: list,
    totals: totals(list),
    customer: {
      nombre: field('nombre').value.trim(),
      telefono: field('telefono').value.trim(),
      documento: `${field('docTipo').value} ${field('docNumero').value.trim()}`,
    },
    // Del pago SOLO se conserva la marca y los últimos 4 dígitos.
    payment: { brand: detectBrand(card.number) || 'Tarjeta', last4: card.number.slice(-4) },
  };
}

// Simulación: las tarjetas que terminan en 0002 son rechazadas.
// Espera 1.5 segundos para imitar el tiempo que tardaría un banco real en responder.
function processPayment(order, card) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (card.number.endsWith('0002')) {
        reject(new Error('Tu banco rechazó la tarjeta. Prueba con otra tarjeta o medio de pago.'));
      } else {
        resolve({ ok: true, transactionId: `TX-${Date.now()}` });
      }
    }, 1500);
  });
}

// Oculta el formulario y muestra la confirmación con el número de pedido, el total y la tarjeta usada.
function showSuccess(order) {
  ui.orderId.textContent = order.id;
  ui.orderTotal.textContent = money(order.totals.total);
  ui.orderCard.textContent = `${order.payment.brand} terminada en ${order.payment.last4}`;
  ui.grid.hidden = true;
  ui.success.hidden = false;
  window.scrollTo(0, 0);   // sube al inicio de la página
  ui.success.focus();      // lleva el foco a la confirmación para que los lectores de pantalla la anuncien
}