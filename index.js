const express = require('express');
const app = express();

// Ruta principal
app.get('/', (req, res) => {
    res.send('¡Servidor funcionando correctamente!');
});

// Puerto dinámico para Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
// Ruta para recibir datos desde Second Life
app.post('/secondlife', (req, res) => {
  const { avatar, region, message } = req.body; // Datos enviados desde Second Life
  console.log(`Mensaje recibido de ${avatar} en la región ${region}: ${message}`);

  // Responde a Second Life
  res.send('¡Datos recibidos correctamente desde Second Life!');
});
