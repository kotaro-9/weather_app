const express = require('express');
const http = require('http');
const path = require('path');
require('dotenv').config();

const apiKey = process.env.API_KEY;

const app = express();

// Serve static files from 'public' directory
app.use(express.static(__dirname + '/public'));

// Parse form data POST request and assign to req.body.city
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/weather', (req, res) => {
    const city = req.body.city || 'Osaka';

    const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    http.get(url, (response) => {
        let weatherData = '';

        response.on('data', (chunk) => {
            weatherData += chunk;
        });

        response.on('end', () => {
            try {
                const weatherObject = JSON.parse(weatherData);
                res.json(weatherObject);
            } catch (error) {
                console.error('Error parsing weather data:', error);
                res.status(500).send('Error retrieving weather data');
            }
        });
    }).on('error', (error) => {
        console.error('Error fetching weather data:', error);
        res.status(500).send('Error retrieving weather data');
    });
});

module.exports = app;