/* compra/config.js
   Configuración del negocio y referencias al DOM de compras.html. */
'use strict';

/* Configuración (ajusta a tu negocio) */
const SHIPPING_FLAT = 5;          // costo de envío fijo (USD)
const FREE_SHIPPING_FROM = 100;   // envío gratis desde este subtotal

/* Referencias al DOM: se buscan una vez aquí y el resto de archivos las reutilizan con `ui` y `form`. */
const form = $('checkout-form');
const ui = {
  grid: $('checkout-grid'),         // contenedor del formulario y el resumen
  empty: $('checkout-empty'),       // mensaje de carrito vacío
  title: $('checkout-title'),
  items: $('summary-items'),        // lista de productos del resumen
  subtotal: $('sum-subtotal'),
  shipping: $('sum-shipping'),
  total: $('sum-total'),
  pay: $('pay-btn'),
  payError: $('pay-error'),         // error del pago (ej. tarjeta rechazada)
  brand: $('card-brand'),           // marca de la tarjeta detectada (Visa, Mastercard…)
  success: $('checkout-success'),   // pantalla de compra realizada
  orderId: $('order-id'),
  orderTotal: $('order-total'),
  orderCard: $('order-card'),
};

// Acceso rápido a un campo del formulario por su "name".
const field = (name) => form.elements[name];

// Deja solo los dígitos de un texto.
const digits = (s) => s.replace(/\D/g, '');