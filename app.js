const express = require('express');
const fetch = require('node-fetch').default;

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/api/weather/:city', async (req, res) => {
  try {
    const { city } = req.params;
    const apiKey = '2695c709d0302eb5d84c7bb26f05777c'; 
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`);
    const data = await response.json();
    
    if (data.cod !== 200) {
      throw new Error(data.message);
    }

    const weatherInfo = {
      temperature: data.main.temp,
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      wind: data.wind.speed
    };

    res.json(weatherInfo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/weather', (req, res) => {
  res.send(`
    <form action="/weather" method="post">
      <input type="text" name="city" placeholder="Ingrese el nombre de la ciudad" required>
      <button type="submit">Consultar Clima</button>
    </form>
  `);
});

app.post('/weather', async (req, res) => {
  try {
    const { city } = req.body;
    const apiKey = '2695c709d0302eb5d84c7bb26f05777c';
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`);
    const data = await response.json();

    if (data.cod !== 200) {
      throw new Error(data.message);
    }

    const weatherInfo = {
      temperature: data.main.temp,
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      wind: data.wind.speed
    };

    res.send(`
      <h2>Clima en ${city}</h2>
      <p>Temperatura: ${weatherInfo.temperature}°C</p>
      <p>Humedad: ${weatherInfo.humidity}%</p>
      <p>Presión Atmosferica: ${weatherInfo.pressure} hPa</p>
      <p>Viento: ${weatherInfo.wind} m/s</p>
    `);
  } catch (error) {
    res.status(500).send(`<h2>Error: ${error.message}</h2>`);
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});


