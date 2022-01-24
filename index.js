const express = require('express');
const Datastore = require('nedb');
const fetch = require('node-fetch');
require('dotenv').config();


const app = express();
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Starting server at ${port}`);
});
app.use(express.static('public'));
app.use(express.json({ limit: '1mb' }));

const database = new Datastore('database.db');
database.loadDatabase();

app.get('/api', (request, response) => {
    database.find({}, (err, data) => {
        if (err) {
            response.end();
            return;
        }
        response.json(data);
    })
})

app.post('/api', (request, response) => {
    const data = request.body;
    const timestamp = Date.now();
    data.timestamp = timestamp;
    database.insert(data);
    response.json(data);
})

app.get('/weather/:latlon', async (request, response) => {
    const latlon = request.params.latlon.split(',');

    const lat = latlon[0];
    const lon = latlon[1];
    const api_key = process.env.API_KEY;
    const weather_url = `http://api.weatherapi.com/v1/current.json?key=${api_key}&q=${lat},${lon}`
    const weather_response = await fetch(weather_url);
    const weather_data = await weather_response.json()

    const aq_url = `https://api.openaq.org/v2/latest?coordinates=${lat},${lon}`
    const aq_response = await fetch(aq_url);
    const aq_data = await aq_response.json()

    const data = {
        weather: weather_data,
        air_quality: aq_data
    };
    response.json(data);
})

/*
app.get('/crypto', async (request, response) => {
    //const api_url = `https://api.tomorrow.io/v4/timelines?location=${lat},${lon}&fields=temperature&timesteps=1h&units=metric&apikey=XKrJHrR3hdRd0663P44dALsOCb5BioBR`
    const api_url = `https://api.etherscan.io/`
    const fetch_response = await fetch(api_url);
    const json = await fetch_response.json()
    response.json(json);
})
*/
