const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const app = express();
const port = process.env.PORT || 10000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const pool = new Pool({
  connectionString: 'postgresql://rpdatabase_user:OpMRB5AiNkRE2efkeRtM2C5HKo1K0Qd9@dpg-cvuqvrqdbo4c73f63u90-a.oregon-postgres.render.com/rpdatabase'
});

app.post('/register', async (req, res) => {
  const {
    rp_firstname,
    rp_lastname,
    age,
    social_rank,
    profession,
    birth_place,
    birth_year
  } = req.body;

  try {
    await pool.query(
      `INSERT INTO players (rp_firstname, rp_lastname, age, social_rank, profession, birth_place, birth_year)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [rp_firstname, rp_lastname, age, social_rank, profession, birth_place, birth_year]
    );

    res.status(200).json({ success: true, message: "Player registered." });
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).json({ success: false, error: "Failed to register player." });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
