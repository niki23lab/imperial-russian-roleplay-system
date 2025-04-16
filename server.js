const express = require('express');
const { Client } = require('pg'); // Importa la librería pg para PostgreSQL
const app = express();
const port = 10001;

// Configura el middleware para analizar los datos JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de conexión a la base de datos PostgreSQL
const client = new Client({
    user: 'rpdatabase_user',          // Reemplaza con tu usuario de PostgreSQL
    host: 'dpg-cvuqvrqdbo4c73f63u90-a.oregon-postgres.render.com',  // Reemplaza con tu host
    database: 'rpdatabase',           // Reemplaza con el nombre de tu base de datos
    password: 'OpMRB5AiNkRE2efkeRtM2C5HKo1K0Qd9',  // Reemplaza con tu contraseña
    port: 5432,
});

// Conexión a la base de datos
client.connect();

// Ruta para el registro de jugadores (POST)
app.post('/register', async (req, res) => {
    const { first_name, last_name, age, sex } = req.body;

    // Valida que los datos estén presentes
    if (!first_name || !last_name || !age || !sex) {
        return res.status(400).send('Error: Missing required fields');
    }

    // Inserción en la base de datos PostgreSQL
    try {
        const query = `
            INSERT INTO players (first_name, last_name, age, sex)
            VALUES ($1, $2, $3, $4)
            RETURNING id;`;

        const values = [first_name, last_name, age, sex];

        const result = await client.query(query, values);

        // Responder con éxito si la inserción fue exitosa
        res.status(200).send(`Registration successful for ID: ${result.rows[0].id}`);
    } catch (err) {
        console.error('Error inserting data into the database:', err);
        res.status(500).send('Error registering player');
    }
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
