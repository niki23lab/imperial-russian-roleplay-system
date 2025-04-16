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

// Configura Express para parsear el cuerpo de las solicitudes
app.use(express.json()); // Para manejar los datos en formato JSON
app.use(express.urlencoded({ extended: true })); // Para manejar los formularios con URL codificada

// Ruta para el registro de jugadores
app.post('/register', async (req, res) => {
  const { name, surname, age } = req.body; // Se asume que estos campos se envían en el cuerpo de la solicitud

  if (!name || !surname || !age) {
    return res.status(400).json({ success: false, error: 'Faltan datos para el registro' });
  }

  try {
    // Inserta los datos del jugador en la base de datos
    const query = 'INSERT INTO players (name, surname, age) VALUES ($1, $2, $3)';
    await client.query(query, [name, surname, age]);

    // Responde indicando que el registro fue exitoso
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error en la base de datos:', error);
    res.status(500).json({ success: false, error: 'Error al registrar el jugador' });
  }
});

// Ruta de ejemplo para probar el servidor
app.get('/', (req, res) => {
  res.send('Servidor funcionando!');
});

// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
