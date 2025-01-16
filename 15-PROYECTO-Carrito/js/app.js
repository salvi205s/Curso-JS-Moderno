// Obtiene el elemento del carrito
const carrito = document.getElementById('carrito');
// Obtiene el contenedor del carrito en el tbody de la lista
const contenedorCarrito = document.querySelector('#lista-carrito > tbody');
// Obtiene el botón de vaciar carrito
const vaciarCarritoBtn = document.getElementById('vaciar-carrito');
// Obtiene la lista de cursos
const listaCursos = document.getElementById('lista-cursos');
// Inicializa un array vacío para los artículos del carrito
let articulosCarrito = [];

// Carga todos los event listeners
cargarEventListeners();

function cargarEventListeners() {
  // Listener para agregar curso al carrito
  listaCursos.addEventListener('click', agregarCarrito);
  
  // Listener para eliminar curso del carrito
  carrito.addEventListener('click', eliminarCurso);
  
  // Listener para vaciar el carrito
  vaciarCarritoBtn.addEventListener('click', () => {
    // Vacía el array de artículos del carrito
    articulosCarrito = [];
    // Limpia el HTML del carrito
    limpiarHTML();
  });
}

function agregarCarrito(e) {
  e.preventDefault();
  if (e.target.classList.contains('agregar-carrito')) {
    // Obtiene el curso seleccionado
    const cursoSeleccionado = e.target.parentElement.parentElement;
    // Lee los datos del curso seleccionado
    leerCurso(cursoSeleccionado);
  }
}

function eliminarCurso(e) {
  if (e.target.classList.contains('borrar-curso')) {
    // Obtiene el id del curso a eliminar
    const idCurso = e.target.getAttribute('data-id');
    // Filtra los artículos del carrito para eliminar el curso con el id especificado
    articulosCarrito = articulosCarrito.filter((curso) => curso.id !== idCurso);
    console.log(articulosCarrito);
    // Actualiza el HTML del carrito
    carritoHTML();
  }
}

function leerCurso(curso) {
  // Crea un objeto con la información del curso
  const infoCurso = {
    imagen: curso.querySelector('img').src,
    precio: curso.querySelector('.precio').textContent,
    titulo: curso.querySelector('h4').textContent,
    id: curso.querySelector('a').getAttribute('data-id'),
    cantidad: 1,
    nombre: curso.querySelector('p').textContent
  };

  // Verifica si el curso ya está en el carrito
  const existe = articulosCarrito.some((curso) => curso.id === infoCurso.id);

  if (existe) {
    // Actualiza la cantidad del curso existente
    const cursos = articulosCarrito.map((curso) => {
      if (curso.id === infoCurso.id) {
        curso.cantidad++;
        return curso;
      } else {
        return curso;
      }
    });
    articulosCarrito = [...cursos];
  } else {
    // Agrega el nuevo curso al carrito
    articulosCarrito = [...articulosCarrito, infoCurso];
  }

  console.log(articulosCarrito);
  // Actualiza el HTML del carrito
  carritoHTML();
}

function carritoHTML() {
  // Limpia el HTML previo del carrito
  limpiarHTML();
  // Recorre cada curso del carrito para generar su HTML
  articulosCarrito.forEach((curso) => {
    const { imagen, titulo, precio, cantidad, id } = curso;
    const row = document.createElement('tr');
    // Genera el HTML de cada curso en una fila de la tabla
    row.innerHTML = `
      <td><img src="${imagen}" width="100" alt="imagen" /></td>
      <td>${titulo}</td>
      <td>${precio}</td>
      <td>${cantidad}</td>
      <td>
        <a href="#" class="borrar-curso" data-id="${id}" > X </a>
      </td>
    `;
    // Agrega la fila al contenedor del carrito
    contenedorCarrito.appendChild(row);
  });
}

function limpiarHTML() {
  // Elimina el contenido del carrito iterativamente
  while (contenedorCarrito.firstChild) {
    contenedorCarrito.removeChild(contenedorCarrito.firstChild);
  }
}
