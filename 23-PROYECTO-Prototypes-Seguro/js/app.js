function Seguro(marca, year, tipo) {

    this.marca = marca;
    this.year = year;
    this.tipo = tipo;
}

Seguro.prototype.cotizarSeguro = function () {

    let cantidad;
    const base = 2000;
    switch (this.marca) {
        case '1':
            cantidad = base * 1.15;
            break;
        case '2':
            cantidad = base * 1.05;
            break;
        case '3':
            cantidad = base * 1.35;
            break;

        default:
            break;
    }

    const diferencia = new Date().getFullYear() - this.year;
    cantidad -= ((diferencia * 3) * cantidad) / 100;

    if (this.tipo === 'basico') {
        cantidad * 1.30;
    } else {
        cantidad * 1.50;
    }

    return cantidad;

}

function UI() { }


UI.prototype.llenarOpciones = () => {
    const max = new Date().getFullYear();
    const min = max - 20;
    const year = document.getElementById('year');

    for (let i = max; i > min; i--) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        year.appendChild(option)

    }
}
UI.prototype.mostrarMensaje = (mensaje, tipo) => {
    const div = document.createElement('div');

    if (tipo === 'error') {
        div.classList.add('error');
    } else {
        div.classList.add('correcto');
    }

    div.classList.add('mensaje', 'mt-10');
    div.textContent = mensaje;


    const formulario = document.getElementById('cotizar-seguro');
    formulario.insertBefore(div, document.getElementById('resultado'))

    setTimeout(() => {
        div.remove();
    }, 3000);
}

UI.prototype.mostrarResultado = (seguro, total) => {

    let textoMarca;

    switch (seguro.marca) {
        case '1':
            textoMarca = "Americano"
            break;
        case '2':
            textoMarca = "Asiatico"

            break;
        case '3':
            textoMarca = "Europeo"

            break;

        default:
            break;
    }

    const div = document.createElement('div');
    div.classList.add('mt-10');

    div.innerHTML = `
    <p class="header">Tu resumen</p>
    <p class="font-bold">Marca: <span class="font-normal">${textoMarca}</span></p>
    <p class="font-bold">Año: <span class="font-normal">${seguro.year}</span></p>
    <p class="font-bold">Tipo: <span class="font-normal">${seguro.tipo}</span></p>
    <p class="font-bold">Total: <span class="font-normal">${total}</span></p>
    `



    const resultado = document.getElementById('resultado');

    const spinner = document.getElementById('cargando');
    spinner.style.display = 'block';

    setTimeout(() => {
        spinner.style.display = 'none';
        resultado.appendChild(div);

    }, 3000);
}



const ui = new UI();

window.addEventListener('DOMContentLoaded', () => {
    ui.llenarOpciones()

})

eventListeners();

function eventListeners() {
    const formulario = document.getElementById('cotizar-seguro');
    formulario.addEventListener('submit', cotizarSeguro)
}

function cotizarSeguro(e) {
    e.preventDefault();

    const marca = document.getElementById('marca').value;
    const year = document.getElementById('year').value;
    const tipo = document.querySelector('input[name="tipo"]:checked').value;

    if (marca === '' || year === "" || tipo === "") {
        ui.mostrarMensaje('Los campos son obligatorios', 'error')
        return;
    }

    ui.mostrarMensaje('Todo correcto', 'correcto')

    const resultados = document.querySelector('#resultado div');

    if (resultados != null) {
        resultados.remove();
    }

    const seguro = new Seguro(marca, year, tipo);

    const total = seguro.cotizarSeguro();
    ui.mostrarResultado(seguro, total)


}