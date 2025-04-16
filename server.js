const http = require("http");
const { Client } = require("pg");

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  if (req.method === "POST" && req.url === "/register") {
    let body = "";

    req.on("data", chunk => {
      body += chunk;
    });

    req.on("end", async () => {
      try {
        console.log("📦 Body recibido:", body); // <-- Log para depurar

        const data = JSON.parse(body); // Puede fallar si el JSON está mal

        const client = new Client({
          connectionString: process.env.DATABASE_URL,  // Aquí debe estar la URL de Render
          ssl: { rejectUnauthorized: false }
        });

        await client.connect();

        // Asegúrate de que los nombres de columnas sean los correctos de tu tabla `players`
        const query = `
          INSERT INTO players 
          (second_life_username, name, gender, age, roleplay_class, health, wealth, reputation, created_at, status) 
          VALUES ($1, $2, $3, $4, $5, 100, 100, 0, NOW(), 'active')
        `;
        const values = [
          data.second_life_username,
          data.name,
          data.gender,
          data.age,
          data.roleplay_class
        ];

        await client.query(query, values);
        await client.end();

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ status: "ok", mensaje: "Registrado correctamente" }));
      } catch (err) {
        console.error("❌ Error en el servidor:", err.message || err);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Error en el servidor", detalle: err.message || "Sin mensaje" }));
      }
    });
  } else {
    res.writeHead(404);
    res.end("Ruta no encontrada");
  }
});

server.listen(PORT, () => console.log("🌐 Servidor activo en puerto " + PORT));
