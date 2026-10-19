(() => {
  'use strict';
 
  /* Configuración (ajusta a tu negocio) */
  const STORAGE_KEY = 'tienda-cart';  // misma clave que usa catalogo.js
  const SHIPPING_FLAT = 5;            // costo de envío fijo (USD)
  const FREE_SHIPPING_FROM = 100;     // envío gratis desde este subtotal
 
  /*Referencias al DOM */
  const $ = (id) => document.getElementById(id);
  const form = $('checkout-form');
  const ui = {
    grid: $('checkout-grid'),
    empty: $('checkout-empty'),
    title: $('checkout-title'),
    items: $('summary-items'),
    subtotal: $('sum-subtotal'),
    shipping: $('sum-shipping'),
    total: $('sum-total'),
    pay: $('pay-btn'),
    payError: $('pay-error'),
    brand: $('card-brand'),
    success: $('checkout-success'),
    orderId: $('order-id'),
    orderEmail: $('order-email'),
    orderTotal: $('order-total'),
    orderCard: $('order-card'),
  };
 
  const field = (name) => form.elements[name];
  const fmt = (n) => `$${n.toFixed(2)}`;
  const digits = (s) => s.replace(/\D/g, '');
 
  /*Carrito (desde localStorage)*/
  function loadCart() {
    try {
      const raw = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
      return Object.values(raw).filter(
        (it) => it && Number.isFinite(it.price) && Number.isFinite(it.qty) && it.qty > 0
      );
    } catch {
      return [];
    }
  }
 
  let items = loadCart();
 
  /*Totales*/
  function totals(list) {
    const subtotal = list.reduce((s, it) => s + it.price * it.qty, 0);
    const shipping = !subtotal || subtotal >= FREE_SHIPPING_FROM ? 0 : SHIPPING_FLAT;
    return { subtotal, shipping, total: subtotal + shipping };
  }
 
  /*Tarjeta: marca y algoritmo de Luhn*/
  function detectBrand(num) {
    if (/^4/.test(num)) return 'Visa';
    if (/^(5[1-5]|222[1-9]|22[3-9]\d|2[3-6]\d\d|27[01]\d|2720)/.test(num)) return 'Mastercard';
    if (/^3[47]/.test(num)) return 'Amex';
    if (/^(36|38|30[0-5])/.test(num)) return 'Diners';
    if (/^(6011|65)/.test(num)) return 'Discover';
    return '';
  }
 
  function luhn(num) {
    let sum = 0;
    let alt = false;
    for (let i = num.length - 1; i >= 0; i--) {
      let n = Number(num[i]);
      if (alt) { n *= 2; if (n > 9) n -= 9; }
      sum += n;
      alt = !alt;
    }
    return sum % 10 === 0;
  }
 
  /*Reglas de validación (una por campo, según su "name")*/
  const required = (msg) => (v) => (v.trim() ? '' : msg);
 
  const rules = {
    // Contacto
    nombre: (v) =>
      v.trim().length >= 5 && /^\S+(\s+\S+)+$/.test(v.trim())
        ? '' : 'Ingresa tu nombre y apellido.',
    email: (v) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())
        ? '' : 'Ingresa un correo válido, por ejemplo nombre@correo.com.',
    telefono: (v) => {
      const d = digits(v);
      return /^\+?[\d\s()-]+$/.test(v.trim()) && d.length >= 7 && d.length <= 15
        ? '' : 'Ingresa un teléfono válido (entre 7 y 15 dígitos).';
    },
    docTipo: required('Selecciona el tipo de documento.'),
    docNumero: (v) =>
      /^[A-Za-z0-9]{5,15}$/.test(v.trim())
        ? '' : 'Ingresa un documento válido (5 a 15 caracteres, sin puntos ni espacios).',
 
    // Envío
    pais: required('Selecciona el país.'),
    departamento: (v) => (v.trim().length >= 2 ? '' : 'Ingresa el departamento o estado.'),
    ciudad: (v) => (v.trim().length >= 2 ? '' : 'Ingresa la ciudad.'),
    direccion: (v) => (v.trim().length >= 6 ? '' : 'Ingresa la dirección completa de entrega.'),
    complemento: () => '', // opcional
    postal: (v) =>
      !v.trim() || /^[A-Za-z0-9 -]{4,10}$/.test(v.trim())
        ? '' : 'El código postal debe tener entre 4 y 10 caracteres.', // opcional
 
    // Pago
    tarjetaNombre: (v) =>
      /^[\p{L}][\p{L} .'-]{2,}$/u.test(v.trim())
        ? '' : 'Ingresa el nombre tal como aparece en la tarjeta.',
    tarjetaNumero: (v) => {
      const d = digits(v);
      if (!d) return 'Ingresa el número de tarjeta.';
      const okLen = detectBrand(d) === 'Amex' ? d.length === 15 : d.length >= 13 && d.length <= 19;
      return okLen && luhn(d) ? '' : 'El número de tarjeta no es válido.';
    },
    vencimiento: (v) => {
      const m = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(v.trim());
      if (!m) return 'Usa el formato MM/AA.';
      // La tarjeta vale hasta el final del mes: comparamos con el día 1 del mes siguiente.
      const expires = new Date(2000 + Number(m[2]), Number(m[1]), 1);
      return expires > new Date() ? '' : 'La tarjeta está vencida.';
    },
    cvv: (v) => {
      const need = detectBrand(digits(field('tarjetaNumero').value)) === 'Amex' ? 4 : 3;
      return new RegExp(`^\\d{${need}}$`).test(v.trim())
        ? '' : `Ingresa los ${need} dígitos del código de seguridad.`;
    },
 
    // Confirmación
    terminos: (v) => (v ? '' : 'Debes aceptar los términos y condiciones para continuar.'),
  };
 
  /*Mostrar/validar*/
  const valueOf = (input) =>
    input.type === 'checkbox' ? (input.checked ? '1' : '') : input.value;
 
  function showError(input, msg) {
    const out = $(`err-${input.name}`);
    if (out) out.textContent = msg;
    input.setAttribute('aria-invalid', String(Boolean(msg)));
  }
 
  function validateField(input) {
    const msg = rules[input.name](valueOf(input));
    showError(input, msg);
    return !msg;
  }
 
  // Valida todo el formulario y devuelve el primer campo inválido (o null).
  function validateAll() {
    let firstInvalid = null;
    [...form.elements]
      .filter((el) => rules[el.name])
      .forEach((el) => {
        if (!validateField(el) && !firstInvalid) firstInvalid = el;
      });
    return firstInvalid;
  }
 
  /*Formato automático mientras se escribe*/
  field('tarjetaNumero').addEventListener('input', (e) => {
    const d = digits(e.target.value).slice(0, 19);
    const brand = detectBrand(d);
    e.target.value = brand === 'Amex'
      ? [d.slice(0, 4), d.slice(4, 10), d.slice(10, 15)].filter(Boolean).join(' ')
      : d.replace(/(\d{4})(?=\d)/g, '$1 ');
    ui.brand.textContent = brand;
    field('cvv').maxLength = brand === 'Amex' ? 4 : 3;
  });
 
  field('vencimiento').addEventListener('input', (e) => {
    const d = digits(e.target.value).slice(0, 4);
    e.target.value = d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
  });
 
  field('cvv').addEventListener('input', (e) => {
    e.target.value = digits(e.target.value).slice(0, 4);
  });
 
  field('docNumero').addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/[^A-Za-z0-9]/g, '').slice(0, 15);
  });
 
  // Validar al salir de un campo; si ya tenía error, revalidar mientras se corrige.
  form.addEventListener('focusout', (e) => {
    if (rules[e.target.name]) validateField(e.target);
  });
  form.addEventListener('input', (e) => {
    if (rules[e.target.name] && e.target.getAttribute('aria-invalid') === 'true') {
      validateField(e.target);
    }
  });
  form.addEventListener('change', (e) => {
    if (e.target.type === 'checkbox' && rules[e.target.name]) validateField(e.target);
  });
 
  /*Resumen del pedido*/
  function renderSummary() {
    ui.items.replaceChildren(
      ...items.map((it) => {
        const li = document.createElement('li');
        li.className = 'summary-item';
 
        const img = document.createElement('img');
        img.src = it.image;
        img.alt = '';
 
        const info = document.createElement('div');
        const name = document.createElement('p');
        name.className = 'summary-name';
        name.textContent = it.title;
        const qty = document.createElement('p');
        qty.className = 'summary-qty';
        qty.textContent = `${it.qty} × ${fmt(it.price)}`;
        info.append(name, qty);
 
        const sub = document.createElement('strong');
        sub.textContent = fmt(it.price * it.qty);
 
        li.append(img, info, sub);
        return li;
      })
    );
 
    const t = totals(items);
    ui.subtotal.textContent = fmt(t.subtotal);
    ui.shipping.textContent = t.shipping ? fmt(t.shipping) : 'Gratis';
    ui.total.textContent = fmt(t.total);
    setPaying(false);
  }
 
  function setPaying(on) {
    ui.pay.disabled = on;
    ui.pay.textContent = on ? 'Procesando pago…' : `Pagar ${fmt(totals(items).total)}`;
  }
 
  /*Estado inicial de la página*/
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
    if (e.persisted && ui.success.hidden) init();
  });
 
  /*Pedido y pago*/
  function buildOrder(card) {
    const list = items.map((it) => ({ ...it }));
    return {
      id: `PED-${Date.now().toString(36).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      items: list,
      totals: totals(list),
      customer: {
        nombre: field('nombre').value.trim(),
        email: field('email').value.trim(),
        telefono: field('telefono').value.trim(),
        documento: `${field('docTipo').value} ${field('docNumero').value.trim()}`,
      },
      shipping: {
        pais: field('pais').value,
        departamento: field('departamento').value.trim(),
        ciudad: field('ciudad').value.trim(),
        direccion: field('direccion').value.trim(),
        complemento: field('complemento').value.trim(),
        postal: field('postal').value.trim(),
        indicaciones: field('indicaciones').value.trim(),
      },
      // Del pago SOLO se conserva la marca y los últimos 4 dígitos.
      payment: { brand: detectBrand(card.number) || 'Tarjeta', last4: card.number.slice(-4) },
    };
  }

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
 
  function showSuccess(order) {
    ui.orderId.textContent = order.id;
    ui.orderEmail.textContent = order.customer.email;
    ui.orderTotal.textContent = fmt(order.totals.total);
    ui.orderCard.textContent = `${order.payment.brand} terminada en ${order.payment.last4}`;
    ui.grid.hidden = true;
    ui.success.hidden = false;
    window.scrollTo(0, 0);
    ui.success.focus();
  }
 
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (ui.pay.disabled) return;          // evita doble envío
    ui.payError.textContent = '';
    if (!items.length) return;
 
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
 
    setPaying(true);
    try {
      await processPayment(order, card);
      showSuccess(order);
      // Compra hecha: se vacía el carrito guardado para que index.html lo vea en cero.
      try { localStorage.removeItem(STORAGE_KEY); } catch { /* sin acceso a localStorage */ }
      items = [];
      form.reset();
      ui.brand.textContent = '';
      [...form.elements].forEach((el) => el.removeAttribute('aria-invalid'));
    } catch (err) {
      ui.payError.textContent = err.message || 'No se pudo procesar el pago. Intenta de nuevo.';
    } finally {
      setPaying(false);
    }
  });
})();