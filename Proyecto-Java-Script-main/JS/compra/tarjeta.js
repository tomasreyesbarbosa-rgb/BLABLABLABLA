/* compra/tarjeta.js
   Tarjeta de crédito: detección de marca y algoritmo de Luhn. */
'use strict';

// Identifica la marca por los primeros dígitos del número; si no coincide con ninguna, devuelve ''.
function detectBrand(num) {
  if (/^4/.test(num)) return 'Visa';
  if (/^(5[1-5]|222[1-9]|22[3-9]\d|2[3-6]\d\d|27[01]\d|2720)/.test(num)) return 'Mastercard';   // incluye la serie 2221–2720
  if (/^3[47]/.test(num)) return 'Amex';
  if (/^(36|38|30[0-5])/.test(num)) return 'Diners';
  if (/^(6011|65)/.test(num)) return 'Discover';
  return '';
}

// Algoritmo de Luhn: comprueba que el número de tarjeta sea matemáticamente válido (detecta errores de digitación).
// Recorre los dígitos de derecha a izquierda, duplica uno sí y uno no (restando 9 si pasa de 9),
// suma todo y el resultado debe ser múltiplo de 10.
function luhn(num) {
  let sum = 0;
  let alt = false;   // indica si el dígito actual se duplica
  for (let i = num.length - 1; i >= 0; i--) {
    let n = Number(num[i]);
    if (alt) { n *= 2; if (n > 9) n -= 9; }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
}