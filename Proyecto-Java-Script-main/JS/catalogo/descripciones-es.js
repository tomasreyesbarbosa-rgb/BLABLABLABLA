/* catalogo/descripciones-es.js
   Traducciones locales de las descripciones de Fake Store API, asociadas por ID. */

const descriptionsEs = {
  1: 'La mochila perfecta para el día a día y para paseos por el bosque. Guarda tu laptop de hasta 15 pulgadas en el compartimento acolchado.',
  2: 'Camiseta de corte ajustado, manga larga raglán en contraste y cuello henley con tres botones. Su tejido ligero y suave ofrece comodidad y frescura. La confección con costuras resistentes brinda un buen ajuste para un estilo casual.',
  3: 'Chaqueta ideal para primavera, otoño e invierno, adecuada para trabajar, hacer senderismo, acampar, escalar o montar en bicicleta. También es una buena opción de regalo para familiares.',
  4: 'El color puede verse ligeramente distinto en pantalla. Como las medidas corporales varían según cada persona, revisa la información detallada de tallas en la descripción del producto.',
  5: 'De nuestra colección Legends, la pulsera Naga está inspirada en el dragón mítico del agua que protege la perla del océano. Llévala hacia dentro para atraer amor y abundancia, o hacia fuera como símbolo de protección.',
  6: 'Satisfacción garantizada: puedes devolver o cambiar cualquier pedido dentro de los 30 días. Diseñado y vendido por Hafeez Center, en Estados Unidos.',
  7: 'Anillo solitario clásico con diamante creado, ideal como promesa o compromiso. Un regalo especial para celebrar un compromiso, una boda, un aniversario o San Valentín.',
  8: 'Pendientes tipo túnel de doble apertura, chapados en oro rosa y fabricados en acero inoxidable 316L.',
  9: 'Disco duro externo portátil WD Elements de 2 TB con compatibilidad USB 3.0 y USB 2.0, transferencias rápidas y gran capacidad. Está formateado en NTFS para Windows 10, 8.1 y 7; otros sistemas operativos podrían requerir reformatearlo. La compatibilidad depende del equipo y del sistema operativo.',
  10: 'Actualiza tu equipo para acelerar el arranque, el apagado y la carga de aplicaciones. Mejora el rendimiento de escritura en ráfaga y ofrece un equilibrio entre rendimiento y fiabilidad. Velocidades de lectura y escritura de hasta 535 MB/s y 450 MB/s. El rendimiento puede variar según la capacidad, el equipo y el sistema operativo.',
  11: 'La memoria flash 3D NAND ofrece altas velocidades de transferencia para acelerar el arranque y mejorar el rendimiento general. La tecnología SLC Cache mejora el rendimiento y prolonga la vida útil. Su diseño delgado de 7 mm es adecuado para ultrabooks y portátiles ultradelgados. Compatible con TRIM, recolección de basura, RAID y ECC para optimizar el rendimiento y la fiabilidad.',
  12: 'Amplía tu experiencia de juego en PS4 y juega donde quieras. Configuración rápida y sencilla, diseño elegante, gran capacidad y garantía limitada del fabricante de 3 años.',
  13: 'Pantalla panorámica IPS Full HD de 21,5 pulgadas con tecnología Radeon FreeSync. No es compatible con soportes VESA. Ofrece una frecuencia de actualización de 75 Hz mediante HDMI, diseño sin marco y ultradelgado, respuesta de 4 ms y relación de aspecto 16:9. Admite 16,7 millones de colores, brillo de 250 nits, inclinación de -5° a 15° y ángulos de visión horizontal y vertical de 178°.',
  14: 'Monitor curvo QLED para juegos de 49 pulgadas y formato superultraancho 32:9, equivalente a dos pantallas de 27 pulgadas lado a lado. La tecnología Quantum Dot y la compatibilidad con HDR ofrecen colores y contrastes realistas. Su frecuencia de actualización de 144 Hz y tiempo de respuesta de 1 ms ayudan a reducir el desenfoque, las imágenes fantasma y el retraso de entrada.',
  15: 'Nota: las tallas siguen el estándar de Estados Unidos; elige tu talla habitual. Chaqueta de poliéster con forro polar cálido, desmontable, ligero y cómodo para la piel. Tiene cuello alto, bolsillos con cremallera para las manos y el pecho, y un bolsillo interior oculto. La capucha y los puños son ajustables para ayudar a proteger del viento y el agua. Su diseño desmontable 3 en 1 permite separar las capas o llevarlas juntas y adaptarse a distintas estaciones y climas.',
  16: 'Chaqueta estilo motociclista de cuero sintético: exterior 100 % poliuretano, forro 100 % poliéster y paneles de suéter de 75 % poliéster y 25 % algodón. Incluye dos bolsillos delanteros, capucha desmontable estilo mezclilla, botones en la cintura y costuras laterales decorativas. Lavar a mano. No usar blanqueador, secadora ni plancha.',
  17: 'Chaqueta cortavientos ligera, ideal para viajes o uso casual. Tiene mangas largas, capucha, cintura ajustable con cordón y cierre frontal con botones y cremallera. El forro es completamente a rayas; incluye dos bolsillos laterales amplios y cubre la cadera. La capucha forrada de algodón cuenta con cordones ajustables.',
  18: '95 % rayón y 5 % elastano. Fabricada en Estados Unidos o importada. No usar blanqueador. Tejido ligero y elástico para mayor comodidad, con canalé en las mangas y el escote, y doble costura en el dobladillo.',
  19: '100 % poliéster. Lavable a máquina y preencogida para un mejor ajuste. Su tejido ligero, amplio y transpirable ayuda a evacuar la humedad. Tiene cuello en V cómodo y un corte más entallado para una silueta estilizada.',
  20: 'Camiseta casual de algodón de manga corta, con estampado de letras, cuello en V y tejido suave con elasticidad. Adecuada para uso casual, oficina, playa, escuela, casa o calle, en cualquier estación del año.',
};

function translateProductDescriptions(list) {
  return list.map((product) => ({
    ...product,
    description: descriptionsEs[product.id] || product.description,
  }));
}
