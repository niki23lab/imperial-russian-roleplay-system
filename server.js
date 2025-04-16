const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

// Initialize Express app
const app = express();
const port = 10000; // Change if necessary

// Database connection setup (replace with your actual database credentials)
const pool = new Pool({
  connectionString: "postgresql://rpdatabase_user:OpMRB5AiNkRE2efkeRtM2C5HKo1K0Qd9@dpg-cvuqvrqdbo4c73f63u90-a.oregon-postgres.render.com/rpdatabase"
});

// Middleware to parse incoming JSON requests
app.use(bodyParser.json());

// Endpoint for registration
app.get('/register', async (req, res) => {
    const { first_name, last_name, gender, age, role, profession } = req.query;

    // Validate that age is an integer
    if (!Number.isInteger(parseInt(age))) {
        return res.status(400).json({ error: 'Age must be an integer' });
    }

    // Insert the data into the database
    try {
        const result = await pool.query(
            'INSERT INTO players (first_name, last_name, gender, age, role, profession) VALUES ($1, $2, $3, $4, $5, $6)',
            [first_name, last_name, gender, age, role, profession]
        );
        res.json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Failed to register user' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
