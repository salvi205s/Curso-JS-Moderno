// Seleccionar los elementos del DOM
const marca = document.querySelector('#marca'); // Selector para la marca
const year = document.querySelector('#year'); // Selector para el año
const minimo = document.querySelector('#minimo'); // Selector para el precio mínimo
const maximo = document.querySelector('#maximo'); // Selector para el precio máximo
const puertas = document.querySelector('#puertas'); // Selector para el número de puertas
const transmision = document.querySelector('#transmision'); // Selector para la transmisión
const color = document.querySelector('#color'); // Selector para el color
const resultado = document.querySelector('#resultado'); // Selector para el área de resultados

// Definir los años máximo y mínimo
const max = new Date().getFullYear(); // Año actual
const min = max - 10; // Hace 10 años desde el año actual

// Crear un objeto con los datos de la búsqueda
const datosBusqueda = {
  marca: '', // Marca del auto
  year: '', // Año del auto
  minimo: '', // Precio mínimo
  maximo: '', // Precio máximo
  puertas: '', // Número de puertas
  transmision: '', // Tipo de transmisión
  color: '' // Color del auto
}

// Añadir un evento que se dispara cuando el contenido del DOM está cargado
document.addEventListener('DOMContentLoaded', () => {
  mostrarAutos(autos); // Mostrar todos los autos al cargar

  // Llenar las opciones de años en el select
  llenarSelect(); 
});

// Añadir eventos para capturar cambios en los selectores y actualizar el objeto datosBusqueda
marca.addEventListener('change', e => {
  datosBusqueda.marca = e.target.value; // Actualizar la marca en datosBusqueda
  filtrarAuto(); // Filtrar los autos basado en los nuevos criterios
});

year.addEventListener('change', e => {
  datosBusqueda.year = parseInt(e.target.value); // Actualizar el año en datosBusqueda
  filtrarAuto(); // Filtrar los autos basado en los nuevos criterios
});

minimo.addEventListener('change', e => {
  datosBusqueda.minimo = e.target.value; // Actualizar el precio mínimo en datosBusqueda
  filtrarAuto(); // Filtrar los autos basado en los nuevos criterios
});

maximo.addEventListener('change', e => {
  datosBusqueda.maximo = e.target.value; // Actualizar el precio máximo en datosBusqueda
  filtrarAuto(); // Filtrar los autos basado en los nuevos criterios
});

puertas.addEventListener('change', e => {
  datosBusqueda.puertas = parseInt(e.target.value); // Actualizar el número de puertas en datosBusqueda
  filtrarAuto(); // Filtrar los autos basado en los nuevos criterios
});

transmision.addEventListener('change', e => {
  datosBusqueda.transmision = e.target.value; // Actualizar la transmisión en datosBusqueda
  filtrarAuto(); // Filtrar los autos basado en los nuevos criterios
});

color.addEventListener('change', e => {
  datosBusqueda.color = e.target.value; // Actualizar el color en datosBusqueda
  filtrarAuto(); // Filtrar los autos basado en los nuevos criterios
});

// Función para mostrar los autos en el HTML
function mostrarAutos(autos) {
  limpiarHTML(); // Limpiar el contenido previo
  const autoHTMLtable = document.createElement('table'); // Crear una tabla HTML
  const resultado = document.querySelector('#resultado'); // Seleccionar el contenedor donde se mostrarán los resultados
  resultado.appendChild(autoHTMLtable); // Añadir la tabla al contenedor

  autos.forEach(auto => {
    const { marca, modelo, year, precio, puertas, color, transmision } = auto; // Desestructurar el objeto auto
    const autoHTMLtr = document.createElement('tr'); // Crear una fila para cada auto
    autoHTMLtr.innerHTML = `
      <td>${marca} ${modelo}</td>
      <td>${year}</td>
      <td>${puertas} Puertas</td>
      <td>Transmisión: ${transmision}</td>
      <td>Precio: ${precio}</td>
      <td>Color: ${color}</td>
    `; // Añadir los datos del auto en la fila
    autoHTMLtable.appendChild(autoHTMLtr); // Añadir la fila a la tabla
  });
}

// Función para limpiar el contenido del HTML
function limpiarHTML() {
  while (resultado.firstChild) {
    resultado.removeChild(resultado.firstChild); // Eliminar cada nodo hijo de resultado
  }
}

// Función para llenar el select de años
function llenarSelect() {
  for (let i = max; i >= min; i--) { // Desde el año máximo al mínimo
    const opcion = document.createElement('option'); // Crear una opción
    opcion.value = i; // Establecer el valor de la opción
    opcion.textContent = i; // Establecer el texto de la opción
    year.appendChild(opcion); // Añadir la opción al select de año
  }
}

// Función para filtrar los autos basados en los criterios de búsqueda
function filtrarAuto() {
  const resultado = autos
    .filter(filtrarMarca) // Filtrar por marca
    .filter(filtrarYear) // Filtrar por año
    .filter(filtrarMinimo) // Filtrar por precio mínimo
    .filter(filtrarMaximo) // Filtrar por precio máximo
    .filter(filtrarPuertas) // Filtrar por número de puertas
    .filter(filtrarTransmision) // Filtrar por transmisión
    .filter(filtrarColor); // Filtrar por color

  if (resultado.length) {
    mostrarAutos(resultado); // Mostrar autos filtrados
  } else {
    noResultado(); // Mostrar mensaje de "no resultado"
  }
}

// Función para mostrar mensaje de "no resultado"
function noResultado() {
  limpiarHTML(); // Limpiar el contenido previo
  const noResultado = document.createElement('div'); // Crear un div
  noResultado.classList.add('alerta', 'error'); // Añadir clases al div
  noResultado.textContent = 'No hay resultados, intenta con otros términos de búsqueda'; // Establecer el texto del div
  resultado.appendChild(noResultado); // Añadir el div al contenedor de resultados
}

// Funciones de filtrado por cada criterio
function filtrarMarca(auto) {
  if (datosBusqueda.marca) { // Si hay marca en los datos de búsqueda
    return auto.marca === datosBusqueda.marca; // Devolver el auto si coincide la marca
  }
  return auto; // Si no hay marca, devolver el auto sin filtrar
}

function filtrarYear(auto) {
  if (datosBusqueda.year) { // Si hay año en los datos de búsqueda
    return auto.year === parseInt(datosBusqueda.year); // Devolver el auto si coincide el año
  }
  return auto; // Si no hay año, devolver el auto sin filtrar
}

function filtrarMinimo(auto) {
  if (datosBusqueda.minimo) { // Si hay precio mínimo en los datos de búsqueda
    return auto.precio >= datosBusqueda.minimo; // Devolver el auto si su precio es mayor o igual al mínimo
  }
  return auto; // Si no hay precio mínimo, devolver el auto sin filtrar
}

function filtrarMaximo(auto) {
  if (datosBusqueda.maximo) { // Si hay precio máximo en los datos de búsqueda
    return auto.precio <= datosBusqueda.maximo; // Devolver el auto si su precio es menor o igual al máximo
  }
  return auto; // Si no hay precio máximo, devolver el auto sin filtrar
}

function filtrarPuertas(auto) {
  if (datosBusqueda.puertas) { // Si hay número de puertas en los datos de búsqueda
    return auto.puertas === parseInt(datosBusqueda.puertas); // Devolver el auto si coincide el número de puertas
  }
  return auto; // Si no hay número de puertas, devolver el auto sin filtrar
}

function filtrarTransmision(auto) {
  if (datosBusqueda.transmision) { // Si hay transmisión en los datos de búsqueda
    return auto.transmision === datosBusqueda.transmision; // Devolver el auto si coincide la transmisión
  }
  return auto; // Si no hay transmisión, devolver el auto sin filtrar
}

function filtrarColor(auto) {
  if (datosBusqueda.color) { // Si hay color en los datos de búsqueda
    return auto.color === datosBusqueda.color; // Devolver el auto si coincide el color
  }
  return auto; // Si no hay color, devolver el auto sin filtrar
}
