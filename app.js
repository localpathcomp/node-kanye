const express = require('express');
const request = require('request');
const mysql = require('mysql');
const app = express();
const port = 3000;
var conn = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: 'kanye'
});
conn.connect(function(err) {
    if (err) {
        res.status(400).send(JSON.stringify({
            'Status': 'Error',
            'Reason': 'Error connecting to database: ' + err.stack
        }))
        return;
    }
});
app.use(express.json());
//routes
app.get('/kanye', (req, res) => callAPI(res));
app.get('/js/app.js', (req, res) => res.sendFile(__dirname + '/js/app.js'));
app.get('/js/saved.js', (req, res) => res.sendFile(__dirname + '/js/saved.js'));
app.get('/css/style.css', (req, res) => res.sendFile(__dirname + '/css/style.css'));
app.post('/v1/create', (req, res) => createSQL(req, res));
app.get('/saved', (req, res) => res.sendFile(__dirname + '/views/saved.html'));
app.get('/v1/read', (req, res) => readSQL(req, res));

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
            url: `https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_API_KEY}`,
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


function createSQL(req, res) {
    if (req.headers.csrftoken !== 'noforgeryallowed') {
        res.status(401).send(JSON.stringify({
            'Status': 'Error',
            'Reason': 'No valid token present!',
            'Headers': req.headers
        }))
        return;
    }

    conn.query(`INSERT INTO quotes (quote,created_at) VALUES ("${req.body.quote}", now())`, function(error, results, fields) {
        if (error) {
            res.status(400).send(`${JSON.stringify(error)}.`)
            return;
        }
        if (results) {
            res.setHeader('Content-Type', 'application/json');
            res.send(`{"connected": true,"id": ${conn.threadId}}`);
        }
    });
}

function readSQL(req, res) {

    conn.query("SELECT quote AS quote, created_at AS date FROM quotes ORDER BY created_at LIMIT 5", function(error, results, fields) {
        if (error) {
            res.status(400).send(`${JSON.stringify(error)}.`)
            return;
        }
        if (results) {
            res.setHeader('Content-Type', 'application/json');
            res.send(results);
        }
    });
}

app.listen(port, () => console.log(`Listening on Port: ${port}`));