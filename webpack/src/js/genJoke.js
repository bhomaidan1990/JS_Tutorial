import axios from "axios";

function genJoke() { 
    const config = {
        headers: {
            Accept: 'application/json'
        }
    }
    axios.get('https://icanhazdadjoke.com', config).then(res => {
        document.getElementById('joke').innerHTML = res.data.joke
        console.log(res.data)
    })
    // return "Joke Generated";
}

export default genJoke;