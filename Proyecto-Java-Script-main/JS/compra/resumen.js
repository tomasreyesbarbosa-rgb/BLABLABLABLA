/* compra/resumen.js
   Resumen del pedido (lista de productos y totales) y estado del botón Pagar. */
'use strict';

// Dibuja el resumen: una fila por producto (imagen, nombre, cantidad × precio y subtotal)
// y debajo los totales del pedido.
function renderSummary() {
  ui.items.replaceChildren(
    ...items.map((it) => {
      const li = document.createElement('li');
      li.className = 'summary-item';

      // Imagen del producto; alt vacío porque el nombre ya aparece escrito al lado.
      const img = document.createElement('img');
      img.src = it.image;
      img.alt = '';

      // Nombre y "cantidad × precio unitario"
      const info = document.createElement('div');
      const name = document.createElement('p');
      name.className = 'summary-name';
      name.textContent = it.title;
      const qty = document.createElement('p');
      qty.className = 'summary-qty';
      qty.textContent = `${it.qty} × ${money(it.price)}`;
      info.append(name, qty);

      // Subtotal de la fila (precio × cantidad)
      const sub = document.createElement('strong');
      sub.textContent = money(it.price * it.qty);

      li.append(img, info, sub);
      return li;
    })
  );

  // Totales: el envío muestra "Gratis" cuando vale 0.
  const t = totals(items);
  ui.subtotal.textContent = money(t.subtotal);
  ui.shipping.textContent = t.shipping ? money(t.shipping) : 'Gratis';
  ui.total.textContent = money(t.total);
  setPaying(false);
}

// Cambia el botón Pagar: mientras se procesa queda desactivado con "Procesando pago…";
// en reposo muestra el total a pagar.
function setPaying(on) {
  ui.pay.disabled = on;
  ui.pay.textContent = on ? 'Procesando pago…' : `Pagar ${money(totals(items).total)}`;
}