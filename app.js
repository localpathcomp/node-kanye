const express = require('express');
const request = require('request');
const app = express();
const port = 3000;
let responseArr = [];
app.get('/kanye', (req, res) => callAPI(res));

function callAPI(res) {
    let nasa, kanye;

    const options = {
        kanye: {
            url: 'https://api.kanye.rest/',
            headers: {
                'Content-type': 'application/json'
            }
        },
        nasa: {
            url: 'https://api.nasa.gov/planetary/apod?api_key=pe4Bj0LWgoL3NBmtV13UW4ZQjIfsYZ8ks7U49zG5',
            headers: {
                'Content-type': 'application/json'
            }
        }
    };
    request(options.kanye, (error, response, body) => {
        (error || !response) ? console.log(error): null;
        kanye = JSON.parse(body);
        request(options.nasa, (error, response, body) => {
            (error || !response) ? console.log(error): null;
            nasa = JSON.parse(body);
            res.send(`<style>body{background:#000;overflow-x:hidden;overflow-y:hidden;}div.bg {background: url('${nasa.url}') no-repeat fixed center; height: 100vh; width: 100vw; text-align: center; display: flex; align-items: center; justify-content: center;}h1.quote {color: #fff; font-size: 2rem;}</style><div class="bg"><h1 class="quote">${kanye.quote}</h1>
            </div>
            `);
        });
    });

}

app.listen(port, () => console.log(`Listening on Port: ${port}`));