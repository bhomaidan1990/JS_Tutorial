import genJoke from "./js/genJoke";
import './styles/main.scss'
import free from './assets/img/free.jpg'

const laughImg = document.getElementById('laughImg')
laughImg.src = free

const jokeBtn = document.getElementById("jokeBtn")
jokeBtn.addEventListener('click', genJoke)

genJoke()