const express = require("express");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// ✅ Usa la variable de entorno DATABASE_URL que Render te proporciona
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// ✅ Ruta para registrar jugadores
app.post("/register", async (req, res) => {
  const {
    first_name,
    last_name,
    sex,
    age,
    social_rank,
    profession,
    birth_place,
    birth_year
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO players 
      (first_name, last_name, sex, age, social_rank, profession, birth_place, birth_year) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
      [first_name, last_name, sex, age, social_rank, profession, birth_place, birth_year]
    );

    res.status(200).json({ success: true, id: result.rows[0].id });
  } catch (err) {
    console.error("Error inserting data:", err);
    res.status(500).json({ success: false, error: "Failed to register player." });
  }
});

// ✅ Render maneja el puerto automáticamente
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
