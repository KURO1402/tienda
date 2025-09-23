const jwt = require("jsonwebtoken");
const SECRET_KEY = "mi_secreto_ultra_seguro";

function verifyToken(req, res, next) {
    const token = req.headers["authorization"]; // Leemos el token de la cabecera

    if (!token) return res.status(403).json({ message: "Token requerido" });

    // Verificamos el token (quitamos "Bearer " si lo trae)
    jwt.verify(token.replace("Bearer ", ""), SECRET_KEY, (err, decoded) => {
        if (err) return res.status(401).json({ message: "Token inválido o expirado" });

        req.user = decoded; // Guardamos info del usuario en la request
        next(); // Pasamos al siguiente middleware/ruta
    });
}

module.exports = verifyToken;