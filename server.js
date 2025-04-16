const express = require('express');
const { Client } = require('pg'); // Importa el cliente de PostgreSQL
const app = express();
const port = process.env.PORT || 10000;

// Configura la conexión a la base de datos PostgreSQL con SSL
const client = new Client({
  connectionString: 'postgresql://rpdatabase_user:OpMRB5AiNkRE2efkeRtM2C5HKo1K0Qd9@dpg-cvuqvrqdbo4c73f63u90-a.oregon-postgres.render.com/rpdatabase',
  ssl: {
    rejectUnauthorized: false // Esto permite la conexión SSL sin verificar el certificado (útil en entornos de desarrollo)
  }
});

// Conectar a la base de datos
client.connect()
  .then(() => {
    console.log('Conectado a la base de datos!');
  })
  .catch(err => {
    console.error('Error al conectar a la base de datos:', err);
  });

// Ruta de ejemplo para tu servidor
app.get('/', (req, res) => {
  res.send('Servidor funcionando!');
});

// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
