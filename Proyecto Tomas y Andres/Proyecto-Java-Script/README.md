# Tienda Fake · Catálogo y Carrito de Compras

Una aplicación web de comercio electrónico (E-commerce) responsive, accesible y ligera, desarrollada en HTML5, CSS3 y JavaScript vanilla (ES6+). Consume productos en tiempo real a través de la API pública Fake Store API y gestiona la persistencia del carrito de compras mediante localStorage.

📸 Wireframes y UI/UX

El diseño fue conceptualizado mediante bocetos e iteraciones previas orientadas a la experiencia de usuario (UX):

Catálogo Principal y Filtros: wireframes/boceto_catalogo.jpg

Panel Desplegable del Carrito: wireframes/boceto_carrito.jpg

🚀 Características Principales

🛒 Catálogo e Interacción

Consumo de API Externa: Carga dinámica de productos desde https://fakestoreapi.com/products.

Filtros y Búsqueda:

Búsqueda en tiempo real por palabra clave (título o descripción).

Filtrado dinámico generado a partir de las categorías de los productos.

Ordenamiento:

Por destacados.

Por precio (ascendente / descendente).

Por orden alfabético (A–Z / Z–A).

Gestión de Estado: El estado del carrito se sincroniza dinámicamente entre páginas utilizando localStorage.

💳 Proceso de Checkout y Pago (compras.html)

Validación Formulario en Tiempo Real: Validación accesible mediante atributos aria-invalid y mensajes de error asociados dinámicamente.

Formateo y Detección de Tarjetas:

Reconocimiento automático de franquicia (Visa, Mastercard, Amex, Diners, Discover) según el número.

Mascarado y espaciado dinámico del número de tarjeta.

Validación del algoritmo de Luhn y fecha de vencimiento posterior a la actual.

Cálculo de Envío:

Costo fijo ($5.00 USD).

Envío gratuito automático para compras superiores a $100.00 USD.

Simulación de Pago: Procesamiento asíncrono simulado mediante Promises.

♿ Accesibilidad y UX

Navegación y trampa de foco (focus trap) accesible dentro del panel del carrito y menús modales.

Soporte para teclas de navegación rápida (Escape para cerrar paneles).

Indicadores de estado accesibles con regiones aria-live.

Estilos adaptativos con soporte para prefers-reduced-motion.

📁 Estructura del Proyecto

├── CSS/
│   ├── style.css         # Estilos globales, variables CSS, catálogo y panel del carrito
│   └── checkout.css      # Estilos del formulario de pago y resumen de orden
├── JS/
│   ├── catalogo.js       # Consumo de API, filtros, ordenamiento y control del carrito
│   └── compra.js         # Lógica de validación del checkout, detección de tarjeta y simulación
├── wireframes/
│   ├── boceto_catalogo.jpg
│   └── boceto_carrito.jpg
├── index.html            # Página principal / Catálogo de productos
├── compras.html          # Página de finalización de compra (Checkout)
├── analisis.md           # Documentación de diseño y bocetos UI/UX
└── README.md             # Documentación general del proyecto


🛠️ Tecnologías Utilizadas

HTML5: Marcado semántico y atributos ARIA de accesibilidad.

CSS3: Variables CSS (:root), CSS Grid, Flexbox y diseño completamente responsive (clamp, media queries).

JavaScript (Vanilla - ES6+): Programación asíncrona (async/await), manipulación del DOM, eventos e integración con localStorage.

Tipografía: Bricolage Grotesque vía Google Fonts.

💻 Instalación y Uso Local

Clona o descarga el repositorio:

git clone <URL-DEL-REPOSITORIO>


Abre el proyecto:
No se requiere instalación de paquetes (npm) ni servidores NodeJS. Puedes abrir directamente el archivo index.html en cualquier navegador web moderno o usar extensiones como Live Server en VS Code.

Demostración de pago (Tarjeta de prueba):

Número de tarjeta: 4242 4242 4242 4242

Fecha de vencimiento: Cualquier fecha futura (ej. 12/30).

CVV: Cualquier código de 3 dígitos (o 4 si se usa Amex).

Nota: Para probar una transacción rechazada por el banco, usa un número que termine en 0002.

📌 Licencia

Este proyecto es con fines educativos e ilustrativos.
