const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { swaggerUi, swaggerDocs } = require('./config/swagger');

const app = express();
const PORT = 3000;

// 🟢 Middlewares
const allowedOrigin = 'http://45.232.149.146'; // IP que quieres permitir (usa protocolo http/https si aplica)

app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, false); // bloquear si no hay origin
    if(origin === allowedOrigin){
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));;
app.use(bodyParser.json());

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
