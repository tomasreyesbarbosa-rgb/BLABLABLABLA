/* comun/utils.js
   Utilidades y configuración compartidas por index.html y compras.html.
   Debe cargarse PRIMERO en ambas páginas. */

// Clave de localStorage donde se guarda el carrito (la usan catálogo y compra).
const STORAGE_KEY = 'tienda-cart';

// Atajo para document.getElementById.
const $ = (id) => document.getElementById(id);

// Formato de dinero: 12.5 -> "$12.50"
const money = (n) => `$${n.toFixed(2)}`;
