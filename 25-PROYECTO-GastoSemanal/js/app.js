// Selección de elementos del DOM
const formulario = document.getElementById('agregar-gasto'); // Formulario para agregar gastos
const gastoListado = document.querySelector('#gastos ul');   // Lista donde se mostrarán los gastos

let presupuesto; // Instancia de la clase Presupuesto que almacenará toda la información

// Inicialización de event listeners
eventListenrs();

// Configuración de event listeners
function eventListenrs() {
    // Cargar presupuesto cuando el documento esté listo
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto)

    // Evento para agregar gastos al enviar el formulario
    formulario.addEventListener('submit', agregarGasto)
}

// ---------------------------------------------------------------
// Clase Presupuesto: Maneja la lógica del presupuesto y gastos
// ---------------------------------------------------------------
class Presupuesto {
    constructor(presupuesto) {
        this.presupuesto = Number(presupuesto); // Presupuesto total
        this.restante = Number(presupuesto);    // Presupuesto restante
        this.gastos = [];                       // Array de gastos
    }

    // Agrega un nuevo gasto al array
    nuevoGasto(gasto) {
        this.gastos = [...this.gastos, gasto]
        this.calcularRestante(); // Actualiza el restante
    }

    // Calcula el presupuesto restante
    calcularRestante() {
        const gastado = this.gastos.reduce((total, gasto) => total + gasto.cantidad, 0)
        this.restante = this.presupuesto - gastado
    }

    // Elimina un gasto por su ID
    eliminarGasto(id) {
        this.gastos = this.gastos.filter(gasto => gasto.id !== id);
        this.calcularRestante(); // Recalcula el restante
    }
}

// ---------------------------------------------------------------
// Clase UI: Maneja la interfaz de usuario y actualizaciones del DOM
// ---------------------------------------------------------------
class UI {
    // Muestra el presupuesto y restante en el DOM
    insertarPresupuesto(cantidad) {
        const { presupuesto, restante } = cantidad
        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;
    }

    // Muestra alertas visuales al usuario
    imprimirAlerta(mensaje, tipo) {
        const div = document.createElement('div');
        div.classList.add('text-center', 'alert');

        // Configura colores según el tipo de alerta
        tipo === 'error' 
            ? div.classList.add('alert-danger')
            : div.classList.add('alert-success');

        div.textContent = mensaje;
        
        // Inserta la alerta antes del primer elemento del formulario
        formulario.insertBefore(div, formulario.firstChild)

        // Elimina la alerta después de 3 segundos
        setTimeout(() => div.remove(), 3000);
    }

    // Actualiza la lista de gastos en el DOM
    agregarGastoListado(gastos) {
        this.limpiarHTML(); // Limpia la lista actual
        
        gastos.forEach(gasto => {
            const { nombre, cantidad, id } = gasto

            // Crea elemento li para cada gasto
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center';
            li.dataset.id = id; // Almacena ID en dataset
            li.innerHTML = `${nombre} <span class="badge badge-primary badge-pill">$ ${cantidad}</span>`

            // Crea botón para eliminar gasto
            const btnBorrar = document.createElement('button');
            btnBorrar.className = 'btn btn-danger borrar-gasto';
            btnBorrar.innerHTML = "Borrar &times;"
            btnBorrar.onclick = () => eliminarGasto(id);

            li.appendChild(btnBorrar)
            gastoListado.appendChild(li)
        })
    }

    // Elimina todos los gastos de la lista
    limpiarHTML() {
        while (gastoListado.firstChild) {
            gastoListado.removeChild(gastoListado.firstChild)
        }
    }

    // Actualiza la cantidad restante en el DOM
    actualizarRestante(restante) {
        document.getElementById('restante').textContent = restante
    }

    // Cambia colores según el estado del presupuesto
    comprobarPresupuesto(presupuestoObj) {
        const { presupuesto, restante } = presupuestoObj
        const restanteDiv = document.querySelector('.restante')

        // Lógica para cambiar clases de alerta
        if ((presupuesto / 4) > restante) {
            restanteDiv.classList.replace('alert-success', 'alert-danger')
        } else if ((presupuesto / 2) > restante) {
            restanteDiv.classList.replace('alert-success', 'alert-warning')
        } else {
            restanteDiv.className = 'restante alert alert-success'
        }

        // Bloquea el formulario si se agota el presupuesto
        if (restante <= 0) {
            ui.imprimirAlerta('El presupuesto se ha agotado', 'error');
            formulario.querySelector('button[type="submit"]').disabled = true;
        }
    }
}

// ---------------------------------------------------------------
// Instancia global de UI para manipulación del DOM
const ui = new UI();

// ---------------------------------------------------------------
// Funciones principales
// ---------------------------------------------------------------

// Solicita el presupuesto inicial al usuario
function preguntarPresupuesto() {
    const presupuestoUsuario = prompt('¿Cuál es tu presupuesto?');

    // Validación del presupuesto
    if (!presupuestoUsuario || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0) {
        window.location.reload(); // Recarga si es inválido
        return;
    }
    
    // Inicializa el presupuesto y actualiza UI
    presupuesto = new Presupuesto(presupuestoUsuario);
    ui.insertarPresupuesto(presupuesto)
}

// Procesa el formulario para agregar gastos
function agregarGasto(e) {
    e.preventDefault();

    // Obtiene valores del formulario
    const nombre = document.getElementById('gasto').value
    const cantidad = Number(document.getElementById('cantidad').value);

    // Validaciones de campos
    if (!nombre || !cantidad) {
        ui.imprimirAlerta('Los campos son obligatorios', 'error');
        return;
    }
    
    if (cantidad <= 0 || isNaN(cantidad)) {
        ui.imprimirAlerta('Cantidad no válida', 'error');
        return;
    }

    // Crea objeto gasto y actualiza presupuesto
    const gasto = { nombre, cantidad, id: Date.now() }
    presupuesto.nuevoGasto(gasto)

    // Actualiza la interfaz
    ui.imprimirAlerta('Gasto agregado correctamente');
    ui.agregarGastoListado(presupuesto.gastos);
    ui.actualizarRestante(presupuesto.restante);
    ui.comprobarPresupuesto(presupuesto);

    formulario.reset(); // Limpia el formulario
}

// Elimina un gasto específico
function eliminarGasto(id) {
    presupuesto.eliminarGasto(id)
    
    // Actualiza la interfaz después de eliminar
    ui.agregarGastoListado(presupuesto.gastos);
    ui.actualizarRestante(presupuesto.restante);
    ui.comprobarPresupuesto(presupuesto);
}