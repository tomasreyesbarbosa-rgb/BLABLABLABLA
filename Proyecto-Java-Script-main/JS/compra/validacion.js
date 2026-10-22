/* compra/validacion.js
   Reglas de validación (una por campo, según su "name") y funciones para
   mostrar errores y validar campo por campo o todo el formulario. */
'use strict';

// Crea una regla simple: el campo no puede estar vacío; si lo está, devuelve el mensaje de error.
const required = (msg) => (v) => (v.trim() ? '' : msg);

// Cada regla recibe el valor del campo y devuelve '' si está bien o el mensaje de error si no.
const rules = {
  // Contacto
  // Nombre: solo letras (con tildes y ñ) y al menos dos palabras, o sea nombre y apellido.
  nombre: (v) =>
    /^[\p{L}]+(?: [\p{L}]+)+$/u.test(v.trim().replace(/\s+/g, ' '))
      ? '' : 'Ingresa tu nombre y apellido.',
  // Teléfono: solo dígitos, entre 7 y 15.
  telefono: (v) =>
    /^\d{7,15}$/.test(v) ? '' : 'Ingresa un teléfono válido de 7 a 15 dígitos, sin espacios ni símbolos.',
  docTipo: required('Selecciona el tipo de documento.'),
  // Documento: el pasaporte (PA) admite letras mayúsculas y números; los demás tipos, solo dígitos. De 5 a 15 caracteres.
  docNumero: (v) => {
    const pattern = field('docTipo').value === 'PA' ? /^[A-Z0-9]{5,15}$/ : /^\d{5,15}$/;
    return pattern.test(v)
      ? '' : 'Ingresa un documento válido (5 a 15 caracteres, sin espacios ni símbolos).';
  },

  // Pago
  // Nombre en la tarjeta: mínimo 3 caracteres y solo letras y espacios.
  tarjetaNombre: (v) =>
    v.trim().length >= 3 && /^[\p{L}]+(?: [\p{L}]+)*$/u.test(v.trim().replace(/\s+/g, ' '))
      ? '' : 'Ingresa el nombre tal como aparece en la tarjeta.',
  // Número de tarjeta: largo correcto (15 en Amex, 13 a 19 en el resto) y que pase el algoritmo de Luhn.
  tarjetaNumero: (v) => {
    const d = digits(v);
    if (!d) return 'Ingresa el número de tarjeta.';
    const okLen = detectBrand(d) === 'Amex' ? d.length === 15 : d.length >= 13 && d.length <= 19;
    return okLen && luhn(d) ? '' : 'El número de tarjeta no es válido.';
  },
  // Vencimiento: formato MM/AA y que la fecha no haya pasado.
  vencimiento: (v) => {
    const m = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(v.trim());
    if (!m) return 'Usa el formato MM/AA.';
    // La tarjeta vale hasta el final del mes: comparamos con el día 1 del mes siguiente.
    const expires = new Date(2000 + Number(m[2]), Number(m[1]), 1);
    return expires > new Date() ? '' : 'La tarjeta está vencida.';
  },
  // CVV: 4 dígitos para Amex y 3 para las demás marcas.
  cvv: (v) => {
    const need = detectBrand(digits(field('tarjetaNumero').value)) === 'Amex' ? 4 : 3;
    return new RegExp(`^\\d{${need}}$`).test(v.trim())
      ? '' : `Ingresa los ${need} dígitos del código de seguridad.`;
  },
};

/* Mostrar/validar */
// Escribe el mensaje bajo el campo (o lo borra si está bien) y marca el campo como inválido o válido.
function showError(input, msg) {
  const out = $(`err-${input.name}`);
  if (out) out.textContent = msg;
  input.setAttribute('aria-invalid', String(Boolean(msg)));
}

// Valida un solo campo con su regla; devuelve true si es válido.
function validateField(input) {
  const msg = rules[input.name](input.value);
  showError(input, msg);
  return !msg;
}

// Valida todo el formulario y devuelve el primer campo inválido (o null).
function validateAll() {
  let firstInvalid = null;
  [...form.elements]
    .filter((el) => rules[el.name])   // solo los campos que tienen regla
    .forEach((el) => {
      if (!validateField(el) && !firstInvalid) firstInvalid = el;
    });
  return firstInvalid;
}