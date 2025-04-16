const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');

const app = express();
const PORT = 10000;

// Conexión real a tu base de datos en Neon
const pool = new Pool({
  connectionString: 'postgresql://rpdatabase_user:OpMRB5AiNkRE2efkeRtM2C5HKo1K0Qd9@dpg-cvuqvrqdbo4c73f63u90-a.oregon-postgres.render.com/rpdatabase'
});

app.use(bodyParser.json());

// ✅ Ruta correcta: /register
app.post('/register', async (req, res) => {
  const { first_name, last_name, gender, age, class: player_class, profession } = req.body;

  try {
    await pool.query(
      'INSERT INTO players (first_name, last_name, gender, age, class, profession) VALUES ($1, $2, $3, $4, $5, $6)',
      [first_name, last_name, gender, age, player_class, profession]
    );

    res.status(200).json({ message: 'Player registered successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error in server', detail: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Servidor activo en puerto ${PORT}`);
});
