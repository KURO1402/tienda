const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { swaggerUi, swaggerDocs } = require('./config/swagger');

const app = express();
const PORT = 3000;

const allowedOrigin = "https://tienda-seven-ruby.vercel.app"

// 🟢 Middlewares
app.use(cors({
  origin: allowedOrigin
}));
app.use(bodyParser.json());

// ➡️ Middleware para filtrar IPs
const allowedIPs = ['45.232.149.130', '45.232.149.146', '45.232.149.145'];

app.use((req, res, next) => {
  let clientIP = req.headers['x-forwarded-for'] || req.ip || req.connection.remoteAddress;
  
  if (clientIP && clientIP.includes(',')) {
    clientIP = clientIP.split(',')[0].trim();
  }

  // Normalizar formato IPv6
  clientIP = clientIP.replace('::ffff:', '');

  console.log("IP del cliente:", clientIP);

  if (allowedIPs.includes(clientIP)) {
    next();
  } else {
    res.status(403).json({ message: 'Acceso denegado: IP no permitida' });
  }
});

// 🟡 Rutas de documentación Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// 🧱 Importar rutas
const categoriasRoutes = require('./routes/categorias');
const productosRoutes = require('./routes/productos');
const imagenesRoutes = require('./routes/imagenes');
const usuariosRoutes = require('./routes/usuarios');

// 🧩 Registrar rutas con prefijos
app.use('/api/categorias', categoriasRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/imagenes', imagenesRoutes);
app.use('/api/usuarios', usuariosRoutes);

// 🚀 Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`Documentación Swagger disponible en http://localhost:${PORT}/api-docs`);
});
