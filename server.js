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
      let data;
      try {
        data = JSON.parse(body);
      } catch (error) {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: "JSON inválido" }));
      }

      const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
      });

      try {
        await client.connect();

        // Asegúrate de que esta tabla exista en tu base de datos:
        await client.query(
          "INSERT INTO usuarios (nombre) VALUES ($1)",
          [data.nombre]
        );

        await client.end();

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ status: "ok", mensaje: "Registrado correctamente" }));

      } catch (err) {
        console.error("❌ Error en la conexión a la base de datos:", err);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Error en el servidor" }));
      }
    });
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Ruta no encontrada");
  }
});

server.listen(PORT, () => console.log("🚀 Servidor activo en puerto " + PORT));
