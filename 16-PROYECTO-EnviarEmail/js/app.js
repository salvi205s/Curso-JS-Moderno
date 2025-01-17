document.addEventListener('DOMContentLoaded', function () { // Esperar a que el contenido del DOM esté cargado

    const email = {
        email: '',
        asunto: '',
        mensaje: ''
    } // Objeto para almacenar los datos del formulario

    // Seleccionar los elementos de la interfaz
    const inputEmail = document.querySelector('#email'); // Input para el correo electrónico
    const inputAsunto = document.querySelector('#asunto'); // Input para el asunto
    const inputMensaje = document.querySelector('#mensaje'); // Input para el mensaje
    const formulario = document.querySelector('#formulario'); // Elemento del formulario
    const btnSubmit = document.querySelector('#formulario button[type="submit"]'); // Botón de enviar
    const btnReset = document.querySelector('#formulario button[type="reset"]'); // Botón de resetear
    const spinner = document.querySelector('#spinner'); // Elemento para mostrar spinner

    // Asignar eventos
    inputEmail.addEventListener('input', validar); // Validar el input del correo electrónico
    inputAsunto.addEventListener('input', validar); // Validar el input del asunto
    inputMensaje.addEventListener('input', validar); // Validar el input del mensaje

    formulario.addEventListener('submit', enviarEmail); // Enviar el formulario

    btnReset.addEventListener('click', function (e) { // Evento al hacer clic en el botón de reset
        e.preventDefault(); // Prevenir el comportamiento por defecto
        resetFormulario(); // Llamar a la función para resetear el formulario
    })

    function enviarEmail(e) { // Función para enviar el formulario
        e.preventDefault(); // Prevenir el comportamiento por defecto

        spinner.classList.add('flex'); // Mostrar el spinner
        spinner.classList.remove('hidden'); // Hacer visible el spinner

        setTimeout(() => { // Esperar 3 segundos
            spinner.classList.remove('flex'); // Ocultar el spinner
            spinner.classList.add('hidden'); // Hacer invisible el spinner

            resetFormulario(); // Resetear el formulario

            // Crear una alerta de éxito
            const alertaExito = document.createElement('P'); // Crear un párrafo
            alertaExito.classList.add('bg-green-500', 'text-white', 'p-2', 'text-center', 'rounded-lg', 'mt-10', 'font-bold', 'text-sm', 'uppercase'); // Estilos para la alerta
            alertaExito.textContent = 'Mensaje enviado correctamente'; // Texto de la alerta

            formulario.appendChild(alertaExito); // Añadir la alerta al formulario

            setTimeout(() => { // Esperar 3 segundos
                alertaExito.remove(); // Eliminar la alerta
            }, 3000);
        }, 3000);
    }

    function validar(e) { // Función para validar los inputs
        if (e.target.value.trim() === '') { // Si el valor del input está vacío
            mostrarAlerta(`El Campo ${e.target.id} es obligatorio`, e.target.parentElement); // Mostrar alerta
            email[e.target.name] = ''; // Limpiar el valor en el objeto email
            comprobarEmail(); // Comprobar el estado del formulario
            return; // Salir de la función
        }

        if (e.target.id === 'email' && !validarEmail(e.target.value)) { // Si el input es el correo electrónico y no es válido
            mostrarAlerta('El email no es válido', e.target.parentElement); // Mostrar alerta
            email[e.target.name] = ''; // Limpiar el valor en el objeto email
            comprobarEmail(); // Comprobar el estado del formulario
            return; // Salir de la función
        }

        limpiarAlerta(e.target.parentElement); // Limpiar cualquier alerta previa

        // Asignar los valores al objeto email
        email[e.target.name] = e.target.value.trim().toLowerCase();

        // Comprobar el objeto de email
        comprobarEmail();
    }

    function mostrarAlerta(mensaje, referencia) { // Función para mostrar una alerta
        limpiarAlerta(referencia); // Limpiar cualquier alerta previa

        // Generar alerta en HTML
        const error = document.createElement('P'); // Crear un párrafo
        error.textContent = mensaje; // Asignar el mensaje a la alerta
        error.classList.add('bg-red-600', 'text-white', 'p-2', 'text-center'); // Estilos para la alerta

        // Inyectar el error al formulario
        referencia.appendChild(error); // Añadir la alerta al formulario
    }

    function limpiarAlerta(referencia) { // Función para limpiar una alerta
        // Comprueba si ya existe una alerta
        const alerta = referencia.querySelector('.bg-red-600'); // Buscar una alerta existente
        if (alerta) { // Si existe
            alerta.remove(); // Eliminar la alerta
        }
    }

    function validarEmail(email) { // Función para validar el formato del correo electrónico
        const regex = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/; // Expresión regular para validar el correo electrónico
        const resultado = regex.test(email); // Probar el correo electrónico contra la expresión regular
        return resultado; // Devolver el
    }
    
    function comprobarEmail() {
        if (Object.values(email).includes('')) {
            btnSubmit.classList.add('opacity-50');
            btnSubmit.disabled = true;
            return
        }
        btnSubmit.classList.remove('opacity-50');
        btnSubmit.disabled = false;
    }

    function resetFormulario() {
        // reiniciar el objeto
        email.email = '';
        email.asunto = '';
        email.mensaje = '';

        formulario.reset();
        comprobarEmail();
    }
});