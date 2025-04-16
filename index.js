const express = require('express');
const app = express();

// Ruta principal
app.get('/', (req, res) => {
    res.send('¡Servidor funcionando correctamente!');
});

// Puerto dinámico para Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
