const http = require("http");
const { Client } = require("pg");

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  if (req.method === "POST" && req.url === "/register") {
    let body = "";
    req.on("data", chunk => (body += chunk));
    req.on("end", async () => {
      const data = JSON.parse(body);
      const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
      });

      try {
        await client.connect();
        await client.query("INSERT INTO usuarios (nombre) VALUES ($1)", [data.nombre]);
        await client.end();
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ status: "ok", mensaje: "Registrado" }));
      } catch (err) {
        console.error(err);
        res.writeHead(500);
        res.end("Error en servidor");
      }
    });
  } else {
    res.writeHead(404);
    res.end("Ruta no encontrada");
  }
});

server.listen(PORT, () => console.log("Servidor activo en puerto " + PORT));
