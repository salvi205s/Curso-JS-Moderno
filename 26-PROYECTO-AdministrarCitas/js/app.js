// Obtener referencias a los elementos del formulario por sus IDs
const pacienteInput = document.getElementById('mascota');
const propietarioInput = document.getElementById('propietario');
const telefonoInput = document.getElementById('telefono');
const fechaInput = document.getElementById('fecha');
const horaInput = document.getElementById('hora');
const sintomasInput = document.getElementById('sintomas');
const formulario = document.getElementById('nueva-cita');
const formularioInput = document.querySelector('#nueva-cita > div:nth-child(8) > button');

// Contenedor donde se mostrarán las citas
const contenedorCitas = document.getElementById('citas');

// Bandera para controlar si estamos editando una cita
let editando = false;

// Asignar event listeners a los inputs para actualizar el objeto cita
pacienteInput.addEventListener('change', datosCita)
propietarioInput.addEventListener('change', datosCita)
telefonoInput.addEventListener('change', datosCita)
fechaInput.addEventListener('change', datosCita)
horaInput.addEventListener('change', datosCita)
sintomasInput.addEventListener('change', datosCita)

// Event listener para el submit del formulario
formulario.addEventListener('submit', submitCita)

// Objeto que almacena los datos de la cita actual
const citaObj = {
    id: generarId(),  // Generar ID único
    mascota: '',
    propietario: '',
    telefono: '',
    fecha: '',
    hora: '',
    sintomas: '',
}

// ---------------------------------------------------
// Clase para manejar las notificaciones/alertas
class Notificacion {
    constructor({ texto, tipo }) {
        this.texto = texto;  // Texto a mostrar
        this.tipo = tipo;    // Tipo de alerta (error/éxito)
    }

    mostrar() {
        // Eliminar alertas previas si existen
        const alertaPrevia = document.querySelector('.alert');
        if (alertaPrevia) {
            alertaPrevia?.remove();
        }

        // Crear elemento div para la alerta
        const alerta = document.createElement('div');
        // Añadir clases de estilo (Tailwind CSS)
        alerta.classList.add('text-center', 'w-full', 'p-3', 'text-white', 'my-5', 'alert', 'uppercase', 'font-bold', 'text-sm');

        // Determinar color según el tipo de alerta
        this.tipo === 'error'
            ? alerta.classList.add('alert-danger')  // Clase para error (rojo)
            : alerta.classList.add('alert-success'); // Clase para éxito (verde)

        // Establecer texto de la alerta
        alerta.textContent = this.texto;

        // Insertar la alerta antes del formulario
        formulario.parentElement.prepend(alerta);

        // Eliminar automáticamente la alerta después de 3 segundos
        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }
}

// ---------------------------------------------------
// Clase para administrar las citas
class AdminCitas {
    constructor() {
        this.citas = [];  // Almacenamiento de todas las citas
    }

    // Método para agregar nueva cita
    agregar(cita) {
        this.citas = [...this.citas, cita];  // Inmutabilidad: crear nuevo array
        this.mostrar()  // Actualizar la vista
    }

    // Método para editar cita existente
    editar(citaActualizada) {
        this.citas = this.citas.map((cita) => 
            cita.id === citaActualizada.id ? citaActualizada : cita
        )
        this.mostrar();
    }

    // Método para eliminar cita por ID
    eliminar(id) {
        this.citas = this.citas.filter((cita) => cita.id !== id);
        this.mostrar();
    }

    // Método para mostrar citas en la interfaz
    mostrar() {
        // Limpiar contenido previo del contenedor
        while (contenedorCitas.firstChild) {
            contenedorCitas.removeChild(contenedorCitas.firstChild);
        }

        // Mostrar mensaje si no hay citas
        if (this.citas.length === 0) {
            contenedorCitas.innerHTML = "<p>No hay pacientes</p>"
            return;
        }

        // Añadir clases de estilo al contenedor (Bootstrap)
        contenedorCitas.classList.add('container', 'mt-4', 'p-3');

        // Generar elementos para cada cita
        this.citas.forEach((cita) => {
            // Crear elemento de lista con clases de estilo
            const li = document.createElement('li');
            li.classList.add('list-group-item', 'list-group-item-action', 'd-flex', 
                'justify-content-between', 'align-items-center', 'bg-light', 
                'border', 'rounded', 'mb-2', 'shadow-sm', 'p-3');

            // Plantilla HTML para los datos de la cita
            li.innerHTML = `
                <div>
                    <h5 class="mb-1 text-primary">🐶 ${cita.mascota}</h5>
                    <p class="mb-1"><strong>Propietario:</strong> ${cita.propietario}</p>
                    <p class="mb-1"><strong>Teléfono:</strong> ${cita.telefono}</p>
                    <p class="mb-1"><strong>Fecha:</strong> ${cita.fecha} | <strong>Hora:</strong> ${cita.hora}</p>
                    <p class="mb-0"><strong>Síntomas:</strong> ${cita.sintomas}</p>
                </div>
            `;

            // Botón Editar
            const btnEditar = document.createElement('button');
            btnEditar.classList.add('py-2', 'px-10', 'bg-warning', 'hover:bg-indigo-700', 
                'text-white', 'font-bold', 'uppercase', 'rounded-lg', 'flex', 
                'items-center', 'gap-2', 'btn-editar');
                btnEditar.innerHTML = '<svg fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>'

            // Clonar cita para evitar referencia directa
            const clonCita = { ...cita }
            btnEditar.onclick = () => cargarEdicion(clonCita);

            // Botón Eliminar
            const btnEliminar = document.createElement('button');
            btnEliminar.classList.add('py-2', 'px-10', 'bg-danger', 'hover:bg-red-700', 
                'text-white', 'font-bold', 'uppercase', 'rounded-lg', 'flex', 
                'items-center', 'gap-2');
                btnEliminar.innerHTML = '<svg fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'
                btnEliminar.onclick = () => this.eliminar(cita.id);

            // Contenedor para botones
            const contenedorBotones = document.createElement('div')
            contenedorBotones.classList.add('flex', 'justify-content-between', 'mt-10')
            contenedorBotones.appendChild(btnEditar);
            contenedorBotones.appendChild(btnEliminar);

            // Ensamblar elementos
            li.appendChild(contenedorBotones)
            contenedorCitas.appendChild(li)
        });
    }
}

// ---------------------------------------------------
// Función para actualizar el objeto cita con los valores de los inputs
function datosCita(e) {
    citaObj[e.target.name] = e.target.value;
}

// Instancia del administrador de citas
const citas = new AdminCitas();

// Manejar el envío del formulario
function submitCita(e) {
    e.preventDefault()

    // Validar campos vacíos
    if (Object.values(citaObj).some(valor => valor.trim() === '')) {
        new Notificacion({
            texto: "Todos los campos son obligatorios",
            tipo: 'error'
        }).mostrar();
        return;
    }

    // Determinar si es edición o nueva cita
    if (editando) {
        citas.editar({ ...citaObj })  // Copiar objeto para evitar mutación
        new Notificacion({ texto: "Paciente Editado", tipo: 'exito' }).mostrar();
    } else {
        citas.agregar({ ...citaObj })
        new Notificacion({ texto: "Paciente guardado", tipo: 'exito' }).mostrar();
    }

    // Resetear formulario y estado
    formulario.reset();
    reiniciarObjetoCita();
    editando = false;
    formularioInput.textContent = "Crear Cita";
}

// Reiniciar el objeto cita preservando el ID
function reiniciarObjetoCita() {
    Object.assign(citaObj, {
        id: generarId(),  // Nuevo ID para próxima cita
        mascota: '',
        propietario: '',
        telefono: '',
        fecha: '',
        hora: '',
        sintomas: '',
    })
}

// Generar ID único combinando random y timestamp
function generarId() {
    return Math.random().toString(36).substring(2) + Date.now();
}

// Cargar datos de cita en el formulario para edición
function cargarEdicion(cita) {
    Object.assign(citaObj, cita)  // Copiar propiedades al objeto cita

    // Convertir hora de 12h a 24h
    const hora12 = cita.hora.split(' ');
    const [hora, minutos] = hora12[0].split(':');
    const horaFormateada = hora12[1] === 'PM'
        ? `${String(parseInt(hora) + 12).padStart(2, '0')}:${minutos}`
        : `${hora.padStart(2, '0')}:${minutos}`;

    // Establecer valores en los inputs
    pacienteInput.value = cita.mascota;
    propietarioInput.value = cita.propietario;
    telefonoInput.value = cita.telefono;
    fechaInput.value = cita.fecha;
    horaInput.value = horaFormateada;
    sintomasInput.value = cita.sintomas;

    // Cambiar a modo edición
    editando = true;
    formularioInput.textContent = "Guardar Cambios";
}