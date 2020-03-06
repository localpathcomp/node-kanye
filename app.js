const express = require('express');
const request = require('request');
const mysql = require('mysql');
const app = express();
const port = 3000;
var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'kanye'
});
app.use(express.json());

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
            res.send(`<link rel="stylesheet" href="/css/style.css"><style>div.bg {
                background: url('${nasa.url}') no-repeat fixed center;
                height: 100vh;
                width: 100vw;
                text-align: center;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;
            }</style><div class="bg"><h1 class="quote">${kanye.quote}</h1><br><button class="btn save-quote">Save Quote</button><br><button class="btn new-quote">New Quote</button>
            </div><script src="/js/app.js"></script>
            `);
        });
    });
}
app.get('/js/app.js', (req, res) => res.sendFile(__dirname + '/js/app.js'));
app.get('/css/style.css', (req, res) => res.sendFile(__dirname + '/css/style.css'));
app.post('/best', (req, res) => kanyeSQL(req, res));

function kanyeSQL(req, res) {
    conn.connect(function(err) {
        if (err) {
            res.send('error connecting: ' + err.stack)
            return;
        }
        conn.query(`INSERT INTO quotes (quote,created_at) VALUES ('${req.body.quote}', now())`, function(error, results, fields) {
            if (error) {
                res.send(`${JSON.stringify(error)}.`)
                return;
            }
            if (results) {
                res.send(`connected as id ${conn.threadId}. Results: ${results[0]}`)
            }
            // fields will contain information about the returned results fields (if any)
        });

    });

}

app.listen(port, () => console.log(`Listening on Port: ${port}`));