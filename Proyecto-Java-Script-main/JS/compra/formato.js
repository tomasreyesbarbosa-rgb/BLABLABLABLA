/* compra/formato.js
   Formato automático mientras se escribe (tarjeta, vencimiento, CVV, documento)
   y validación en vivo de los campos. */
'use strict';

// Número de tarjeta: deja solo dígitos (máx. 19), los agrupa con espacios (4-6-5 en Amex, de a 4 en el resto)
// y muestra la marca detectada. Amex usa CVV de 4 dígitos; las demás, de 3.
field('tarjetaNumero').addEventListener('input', (e) => {
  const d = digits(e.target.value).slice(0, 19);
  const brand = detectBrand(d);
  e.target.value = brand === 'Amex'
    ? [d.slice(0, 4), d.slice(4, 10), d.slice(10, 15)].filter(Boolean).join(' ')
    : d.replace(/(\d{4})(?=\d)/g, '$1 ');
  ui.brand.textContent = brand;

  // Ajusta el largo del CVV a la marca; si ya tenía algo escrito, lo recorta y lo revalida.
  const cvv = field('cvv');
  cvv.maxLength = brand === 'Amex' ? 4 : 3;
  cvv.value = cvv.value.slice(0, cvv.maxLength);
  if (cvv.value) validateField(cvv);
});

// Vencimiento: solo dígitos, con la barra puesta automáticamente (MM/AA).
field('vencimiento').addEventListener('input', (e) => {
  const d = digits(e.target.value).slice(0, 4);
  e.target.value = d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
});

// CVV: solo dígitos, hasta el máximo que le toque según la tarjeta.
field('cvv').addEventListener('input', (e) => {
  e.target.value = digits(e.target.value).slice(0, e.target.maxLength);
});

// Limpia un nombre: quita todo lo que no sea letra o espacio (incluye tildes y ñ),
// junta espacios repetidos en uno y elimina el espacio inicial.
const sanitizeName = (value) => value
  .replace(/[^\p{L}\s]/gu, '')
  .replace(/\s+/g, ' ')
  .replace(/^ /, '');

// Nombre completo y nombre en la tarjeta: se limpian al escribir y se recortan los espacios al salir del campo.
['nombre', 'tarjetaNombre'].forEach((name) => {
  const input = field(name);
  input.addEventListener('input', () => {
    input.value = sanitizeName(input.value);
  });
  input.addEventListener('blur', () => {
    input.value = input.value.trim();
  });
});

// Teléfono: solo dígitos, máximo 15.
field('telefono').addEventListener('input', (e) => {
  e.target.value = digits(e.target.value).slice(0, 15);
});

// Número de documento: el pasaporte admite letras y números (en mayúscula); los demás tipos, solo dígitos.
field('docNumero').addEventListener('input', (e) => {
  const isPassport = field('docTipo').value === 'PA';
  e.target.value = (isPassport
    ? e.target.value.replace(/[^A-Za-z0-9]/g, '').toUpperCase()
    : digits(e.target.value)).slice(0, 15);
});

// Al cambiar el tipo de documento: ajusta el teclado del móvil (texto o numérico), limpia
// el número ya escrito según el nuevo tipo y lo revalida si tenía contenido o un error.
field('docTipo').addEventListener('change', () => {
  const input = field('docNumero');
  const isPassport = field('docTipo').value === 'PA';
  input.inputMode = isPassport ? 'text' : 'numeric';
  input.value = (isPassport
    ? input.value.replace(/[^A-Za-z0-9]/g, '').toUpperCase()
    : digits(input.value)).slice(0, 15);

  if (input.value || input.getAttribute('aria-invalid') === 'true') {
    validateField(input);
  }
});

// Valida al salir del campo y, una vez mostrado un error, lo actualiza mientras se corrige.
Object.keys(rules).forEach((name) => {
  const input = field(name);
  input.addEventListener('blur', () => validateField(input));
  input.addEventListener('input', () => {
    if (input.getAttribute('aria-invalid') === 'true') validateField(input);
  });
});