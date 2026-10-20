/* catalogo/estado.js
   Configuración, estado global de la app y referencias al DOM. */

// Dirección de la API de donde salen los productos.
const API_URL = 'https://fakestoreapi.com/products';

// Estado de la app
let products = [];            // lista de productos descargados de la API
let cart = loadCart();        // carrito, recuperado de localStorage al abrir la página
let cartReturnFocus = null;   // elemento al que vuelve el foco cuando se cierra el carrito

// Referencias al DOM: se buscan una sola vez aquí y el resto de archivos las reutilizan con `el`.
const el = {
  products: $('products'), status: $('status'), search: $('search'),
  category: $('category'), sort: $('sort'), cartPanel: $('cart'),
  cartItems: $('cart-items'), cartTotal: $('cart-total'), cartCount: $('cart-count'),
  toggle: $('cart-toggle'), close: $('cart-close'), overlay: $('overlay'), clear: $('cart-clear'),
  main: document.querySelector('main'),
};