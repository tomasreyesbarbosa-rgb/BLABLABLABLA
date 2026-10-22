/* catalogo/visor-productos.js
   Visor modal de productos con navegación circular y soporte táctil. */

let viewerProducts = [];
let viewerIndex = 0;
let viewerReturnFocus = null;
let viewerPointerStart = null;

function openProductViewer(id) {
  viewerProducts = getVisibleProducts();
  viewerIndex = viewerProducts.findIndex((product) => product.id === id);
  if (viewerIndex < 0) return;

  viewerReturnFocus = document.activeElement;
  renderViewerProduct();
  el.viewer.showModal();
  el.viewerClose.focus();
}

function renderViewerProduct(direction = 1) {
  const product = viewerProducts[viewerIndex];
  if (!product) return;

  el.viewerCategory.textContent = product.category;
  el.viewerTitle.textContent = product.title;
  el.viewerImage.src = product.image;
  el.viewerImage.alt = product.title;
  el.viewerDescription.textContent = product.description;
  el.viewerPrice.textContent = money(product.price);
  el.viewerAdd.dataset.add = String(product.id);
  el.viewerPosition.textContent = `${viewerIndex + 1} de ${viewerProducts.length}`;

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.viewerContent.animate(
      [
        { opacity: 0, transform: `translateX(${direction * 20}px)` },
        { opacity: 1, transform: 'translateX(0)' },
      ],
      { duration: 220, easing: 'ease-out' }
    );
  }
}

function moveProductViewer(direction) {
  if (!viewerProducts.length) return;
  viewerIndex = (viewerIndex + direction + viewerProducts.length) % viewerProducts.length;
  renderViewerProduct(direction);
}

function closeProductViewer() {
  if (el.viewer.open) el.viewer.close();
}

el.viewerClose.addEventListener('click', closeProductViewer);
el.viewerPrevious.addEventListener('click', () => moveProductViewer(-1));
el.viewerNext.addEventListener('click', () => moveProductViewer(1));
el.viewerAdd.addEventListener('click', () => addToCart(Number(el.viewerAdd.dataset.add)));

el.viewer.addEventListener('click', (event) => {
  if (event.target === el.viewer) closeProductViewer();
});

el.viewer.addEventListener('close', () => {
  if (viewerReturnFocus instanceof HTMLElement && viewerReturnFocus.isConnected) {
    viewerReturnFocus.focus();
  }
  viewerReturnFocus = null;
  viewerPointerStart = null;
});

document.addEventListener('keydown', (event) => {
  if (!el.viewer.open) return;

  if (event.key === 'Escape') {
    event.preventDefault();
    closeProductViewer();
  } else if (event.key === 'ArrowLeft') {
    event.preventDefault();
    moveProductViewer(-1);
  } else if (event.key === 'ArrowRight') {
    event.preventDefault();
    moveProductViewer(1);
  }
});

el.viewerContent.addEventListener('pointerdown', (event) => {
  if (event.pointerType === 'touch') {
    viewerPointerStart = { x: event.clientX, y: event.clientY };
  }
});

el.viewerContent.addEventListener('pointerup', (event) => {
  if (!viewerPointerStart || event.pointerType !== 'touch') return;

  const deltaX = event.clientX - viewerPointerStart.x;
  const deltaY = event.clientY - viewerPointerStart.y;
  viewerPointerStart = null;

  if (Math.abs(deltaX) >= 50 && Math.abs(deltaX) > Math.abs(deltaY)) {
    moveProductViewer(deltaX < 0 ? 1 : -1);
  }
});

el.viewerContent.addEventListener('pointercancel', () => {
  viewerPointerStart = null;
});
