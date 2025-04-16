const express = require('express');
const bodyParser = require('body-parser');
const { Client } = require('pg');
const app = express();
const port = process.env.PORT || 10000;

// Configuración de la base de datos PostgreSQL
const client = new Client({
    connectionString: 'postgresql://rpdatabase_user:OpMRB5AiNkRE2efkeRtM2C5HKo1K0Qd9@dpg-cvuqvrqdbo4c73f63u90-a.oregon-postgres.render.com/rpdatabase'
});

client.connect();

// Middleware para manejar los datos POST
app.use(bodyParser.urlencoded({ extended: true }));

// Ruta para el registro
app.post('/register', async (req, res) => {
    const { rp_firstname, rp_lastname, age, social_rank, profession, birth_place, birth_year } = req.body;

    try {
        // Inserción en la base de datos
        const query = 'INSERT INTO players(first_name, last_name, age, social_rank, profession, birth_place, birth_year) VALUES($1, $2, $3, $4, $5, $6, $7)';
        const values = [rp_firstname, rp_lastname, age, social_rank, profession, birth_place, birth_year];

        await client.query(query, values);

        res.status(200).send({ success: true, message: "Player registered successfully!" });
    } catch (err) {
        console.error('Error inserting data:', err);
        res.status(500).send({ success: false, error: "Failed to register player." });
    }
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
