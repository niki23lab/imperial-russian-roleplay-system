const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const app = express();
const port = process.env.PORT || 10000;

app.use(bodyParser.json());

const pool = new Pool({
  connectionString: 'postgresql://rpdatabase_user:OpMRB5AiNkRE2efkeRtM2C5HKo1K0Qd9@dpg-cvuqvrqdbo4c73f63u90-a.oregon-postgres.render.com/rpdatabase',
  ssl: {
    rejectUnauthorized: false
  }
});

app.post('/registro', async (req, res) => {
  try {
    const { nombre, apellido, genero, edad, clase, profesion } = req.body;

    const puntos_vida = 100;
    const xp = 0;
    const fe = 10;
    const influencia = 10;
    const encanto = 10;
    const popularidad = 10;
    const fortuna = 0;
    const rublos = 100;
    const amor = 0;

    await pool.query(`
      INSERT INTO jugadores 
        (nombre, apellido, genero, edad, clase, profesion, puntos_vida, xp, fe, influencia, encanto, popularidad, fortuna, rublos, amor) 
      VALUES 
        ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
    `, [nombre, apellido, genero, edad, clase, profesion, puntos_vida, xp, fe, influencia, encanto, popularidad, fortuna, rublos, amor]);

    res.status(200).json({ mensaje: 'Jugador registrado correctamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error en el servidor', detalle: err.message });
  }
});

app.listen(port, () => {
  console.log(`✅ Servidor activo en puerto ${port}`);
});
