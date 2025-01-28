// Variables
const formulario = document.getElementById('formulario');
const listaTweets = document.getElementById('lista-tweets')
let tweets = []

// Event listeners
eventListeners();

function eventListeners() {
    formulario.addEventListener('submit', agregarTweet)

    document.addEventListener('DOMContentLoaded', () => {
        tweets = JSON.parse(localStorage.getItem('tweets')) || []

        console.log(tweets);
        crearHTML();
    })
}


// Funciones
function agregarTweet(e) {
    e.preventDefault();

    const tweet = document.getElementById('tweet').value;

    if (tweet === '') {
        mostrarError('El campo es obligatorio', tweet);
        return;
    }

    tweetObj = {
        id: Date.now(),
        tweet: tweet
    }

    tweets = [...tweets, tweetObj]

    crearHTML();

    formulario.reset()

}

function mostrarError(error) {
    console.log(error);

    const errorMensage = document.createElement('P');
    errorMensage.textContent = error
    errorMensage.classList.add('error')

    const contenido = document.getElementById('contenido')
    contenido.appendChild(errorMensage)

    setTimeout(() => {
        errorMensage.remove();
    }, 3000);

}

function crearHTML() {
    limpiarHTML();
    if (tweets.length > 0) {
        tweets.forEach((tweet) => {
            const btnEliminar = document.createElement('a');
            btnEliminar.classList.add('borrar-tweet')
            btnEliminar.innerHTML = 'X'

            btnEliminar.onclick = () => {
                borrarTweet(tweet.id);
            }



            const li = document.createElement('LI');
            li.innerHTML = tweet.tweet

            li.appendChild(btnEliminar)
            listaTweets.appendChild(li)
        })

    }

    sincronizarStorage();
}

function sincronizarStorage() {
    localStorage.setItem('tweets', JSON.stringify(tweets))

    
}

function borrarTweet(id) {
    tweets = tweets.filter(tweet => tweet.id !== id);
    crearHTML();
}

function limpiarHTML() {
    while (listaTweets.firstChild) {
        listaTweets.removeChild(listaTweets.firstChild)
    }
}