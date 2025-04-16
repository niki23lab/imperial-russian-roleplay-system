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

// Middleware para parsear los cuerpos de las solicitudes como JSON
app.use(express.json());

// Ruta de ejemplo para tu servidor
app.get('/', (req, res) => {
  res.send('Servidor funcionando!');
});

// Ruta para registrar jugadores
app.post('/register', async (req, res) => {
  const { name, surname, age } = req.body; // Asegúrate de que el cliente esté enviando estos datos

  // Verificar que los datos sean válidos
  if (!name || !surname || !age) {
    return res.status(400).json({ success: false, error: 'Faltan datos para el registro.' });
  }

  try {
    // Consulta para insertar los datos del jugador en la base de datos
    const query = 'INSERT INTO players (name, surname, age) VALUES ($1, $2, $3)';
    await client.query(query, [name, surname, age]);

    // Responder con éxito
    res.status(200).json({ success: true, message: 'Jugador registrado correctamente' });
  } catch (error) {
    console.error('Error al insertar datos:', error);
    res.status(500).json({ success: false, error: 'Error al registrar el jugador' });
  }
});

// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
