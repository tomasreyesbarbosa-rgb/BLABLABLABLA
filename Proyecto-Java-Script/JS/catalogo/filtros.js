/* catalogo/filtros.js
   Filtros del catálogo: búsqueda por texto, categoría y orden. */

// Llena el desplegable de categorías con las que traen los productos.
// El Set elimina las repetidas, así cada categoría aparece una sola vez.
function fillCategories() {
  [...new Set(products.map((p) => p.category))].forEach((c) => {
    const opt = document.createElement('option');
    opt.value = c;
    opt.textContent = c;
    el.category.appendChild(opt);
  });
}

// Devuelve los productos que se deben mostrar según lo que el usuario escribió, la categoría elegida y el orden.
function getVisibleProducts() {
  const q = el.search.value.trim().toLowerCase();
  const cat = el.category.value;

  // Filtra: pasa la categoría elegida ('all' deja todas) y el texto aparece en el nombre o la descripción.
  const list = products.filter((p) =>
    (cat === 'all' || p.category === cat) &&
    (!q || p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)));

  // Una función de comparación por cada opción de orden; "Destacados" no tiene y deja el orden original.
  const sorters = {
    'price-asc': (a, b) => a.price - b.price,
    'price-desc': (a, b) => b.price - a.price,
    'name-asc': (a, b) => a.title.localeCompare(b.title),
    'name-desc': (a, b) => b.title.localeCompare(a.title),
  };
  const sorter = sorters[el.sort.value];
  return sorter ? list.sort(sorter) : list;
}