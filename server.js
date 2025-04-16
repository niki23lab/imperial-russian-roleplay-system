const http = require("http");
const { Client } = require("pg");

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  if (req.method === "POST" && req.url === "/register") {
    let body = "";

    req.on("data", chunk => (body += chunk));
    req.on("end", async () => {
      try {
        const data = JSON.parse(body);

        const client = new Client({
          connectionString: process.env.DATABASE_URL,
          ssl: { rejectUnauthorized: false }
        });

        await client.connect();

        await client.query(
          `INSERT INTO players (sl_uuid, name, gender, age, roleplay_class)
           VALUES ($1, $2, $3, $4, $5)`,
          [data.sl_uuid, data.name, data.gender, data.age, data.roleplay_class]
        );

        await client.end();
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ status: "ok", message: "Registered successfully" }));
      } catch (err) {
  console.error("❌ Error en el registro:", err);
  res.writeHead(500, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Error en el servidor", detalle: err.message }));
}
    });
  } else {
    res.writeHead(404);
    res.end("Ruta no encontrada");
  }
});

server.listen(PORT, () => console.log("🌐 Servidor activo en puerto " + PORT));
