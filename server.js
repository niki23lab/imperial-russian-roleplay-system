const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
const port = 10000;

app.use(bodyParser.json());

const pool = new Pool({
  connectionString: 'postgresql://rpdatabase_user:OpMRB5AiNkRE2efkeRtM2C5HKo1K0Qd9@dpg-cvuqvrqdbo4c73f63u90-a.oregon-postgres.render.com/rpdatabase'
});

app.post('/registro', async (req, res) => {
  const { nombre, apellido, genero, edad, clase, profesion } = req.body;

  try {
    await pool.query(
      'INSERT INTO jugadores (nombre, apellido, genero, edad, clase, profesion) VALUES ($1, $2, $3, $4, $5, $6)',
      [nombre, apellido, genero, edad, clase, profesion]
    );
    res.status(200).json({ mensaje: 'Registro exitoso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en el servidor', detalle: error.message });
  }
});

app.listen(port, () => {
  console.log(`Servidor activo en puerto ${port}`);
});
