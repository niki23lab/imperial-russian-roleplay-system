const http = require("http");
const { Client } = require("pg");

// Puerto donde el servidor estará escuchando
const PORT = process.env.PORT || 10000;

// Crea el servidor HTTP
const server = http.createServer((req, res) => {
  if (req.method === "POST" && req.url === "/register") {
    let body = "";

    // Recibe los datos del cuerpo de la solicitud
    req.on("data", chunk => (body += chunk));
    req.on("end", async () => {
      try {
        const data = JSON.parse(body);

        // Crea la conexión con la base de datos utilizando la variable de entorno
        const client = new Client({
          connectionString: process.env.DATABASE_URL, // La URL de conexión está en las variables de entorno de Render
          ssl: { rejectUnauthorized: false }
        });

        await client.connect();

        // Verifica si el nombre de usuario ya está registrado
        const result = await client.query('SELECT * FROM players WHERE second_life_username = $1', [data.second_life_username]);
        
        if (result.rows.length > 0) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "El usuario ya está registrado." }));
        } else {
          // Inserta los datos del nuevo jugador en la tabla players
          await client.query(`
            INSERT INTO players (
              second_life_username,
              name,
              gender,
              age,
              roleplay_class,
              health,
              wealth,
              reputation,
              family_id,
              created_at,
              last_active,
              status,
              faith_points,
              trustworthiness,
              loyalty
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW(), 'activo', 100, 100, 100)
          `, [
            data.second_life_username,
            data.name,
            data.gender,
            data.age,
            data.roleplay_class,
            100,  // Valor predeterminado de salud
            100,  // Valor predeterminado de riqueza
            100,  // Valor predeterminado de reputación
            1      // Familia predeterminada, puedes ajustar este valor
          ]);

          await client.end();

          // Responde al cliente indicando que el registro fue exitoso
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ status: "ok", mensaje: "Jugador registrado exitosamente." }));
        }
      } catch (err) {
        console.error(err);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Error en el servidor", detalle: err.message }));
      }
    });
  } else {
    res.writeHead(404);
    res.end("Ruta no encontrada");
  }
});

// Inicia el servidor en el puerto configurado
server.listen(PORT, () => {
  console.log(`Servidor activo en puerto ${PORT}`);
});
