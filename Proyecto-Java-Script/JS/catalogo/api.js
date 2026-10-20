/* catalogo/api.js
   Descarga de productos desde la API y mensaje de estado. */

// Pide los productos a la API y, si todo sale bien, llena las categorías y dibuja el catálogo.
// Si algo falla (sin conexión o error del servidor), avisa al usuario en pantalla.
async function fetchProducts() {
  setStatus('Cargando productos…');
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(`Error ${res.status}`);   // trata una respuesta con error como fallo
    products = await res.json();
    fillCategories();
    render();
    renderCart();
  } catch (err) {
    setStatus('No se pudieron cargar los productos. Revisa tu conexión y recarga la página.', true);
    console.error(err);   // deja el detalle técnico en la consola para depurar
  }
}

// Muestra un mensaje bajo los filtros; con isError en true se pinta con el estilo de error.
function setStatus(msg, isError = false) {
  el.status.textContent = msg;
  el.status.classList.toggle('error', isError);
}