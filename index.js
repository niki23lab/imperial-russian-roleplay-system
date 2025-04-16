const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

// Inicia la aplicación Express
const app = express();
app.use(bodyParser.json()); // Permite manejar datos JSON

// Configura la conexión a PostgreSQL con la URL externa
const pool = new Pool({
    connectionString: 'postgresql://rpdatabase_user:OpMRB5AiNkRE2efkeRtM2C5HKo1K0Qd9@dpg-cvuqvrqdbo4c73f63u90-a.oregon-postgres.render.com/rpdatabase',
    ssl: {
        rejectUnauthorized: false // Importante para conexiones seguras en Render
    }
});

// Verifica la conexión a la base de datos
pool.connect(err => {
    if (err) {
        console.error('Error conectando a PostgreSQL:', err);
    } else {
        console.log('Conexión exitosa a PostgreSQL');
    }
});

// Ruta principal
app.get('/', (req, res) => {
    res.send('¡Servidor funcionando correctamente!');
});

// Ruta para recibir datos desde Second Life
app.post('/secondlife', async (req, res) => {
    const { avatar, region, message } = req.body;

    // Valida que los datos estén completos
    if (!avatar || !region || !message) {
        res.status(400).send('Faltan datos necesarios');
        return;
    }

    try {
        // Inserta los datos en la tabla 'registros'
        const query = 'INSERT INTO registros (avatar, region, mensaje) VALUES ($1, $2, $3)';
        const values = [avatar, region, message];

        await pool.query(query, values);
        console.log('Datos guardados correctamente en PostgreSQL');
        res.send('¡Datos recibidos y almacenados correctamente!');
    } catch (err) {
        console.error('Error al guardar los datos:', err);
        res.status(500).send('Error al guardar los datos en la base de datos');
    }
});

// Puerto dinámico para Render o Glitch
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
