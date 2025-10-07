const express = require('express');
const router = express.Router();
const db = require('../db');
const jwt = require("jsonwebtoken");

const SECRET_KEY = "mi_secreto_ultra_seguro";

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Endpoints para autenticación de usuarios
 */

/**
 * @swagger
 * /api/usuarios/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               usuario:
 *                 type: string
 *                 example: admin
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Login exitoso
 */

/**
 * @swagger
 * /api/usuarios/registro:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               usuario:
 *                 type: string
 *                 example: nuevo_user
 *               password:
 *                 type: string
 *                 example: pass123
 *     responses:
 *       200:
 *         description: Registro exitoso
 */

router.post("/login", async (req, res) => {
    // Obtenemos datos enviados en JSON
    const { usuario, password } = req.body;

    try {
        // Buscar usuario en la BD (validamos con MD5)
        const [rows] = await db.query("SELECT * FROM usuarios WHERE usuario = ? AND password = MD5(?)", [usuario, password]);

        // Si no existe → error
        if (rows.length === 0) {
            return res.status(401).json({ message: "Usuario o contraseña incorrectos" });
        }

        const user = rows[0]; // Usuario encontrado
        // Generar token JWT (expira en 1 hora)
        const token = jwt.sign(
            { id: user.id, usuario: user.usuario },
            SECRET_KEY, { expiresIn: "1h" }
        );
        // Devolver token al cliente
        res.json({ message: "Login exitoso", token, nombre: user.usuario });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

router.post("/registro", async (req, res) => {
    const { usuario, password } = req.body;

    try {
        // Verificar si el usuario ya existe
        const [existingUser] = await db.query("SELECT idUsuario FROM usuarios WHERE usuario = ?", [usuario]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: "El nombre de usuario ya está en uso" });
        }

        // Insertar el nuevo usuario
        const [result] = await db.query(
            "INSERT INTO usuarios (usuario, password) VALUES (?, MD5(?))",
            [usuario, password]
        );

        if (result.affectedRows === 0) {
            return res.status(400).json({ message: "No se pudo crear el usuario" });
        }

        // Generar token
        const token = jwt.sign(
            { id: result.insertId, usuario: usuario },
            SECRET_KEY,
            { expiresIn: "1h" }
        );

        res.json({ message: "Registro exitoso", token, nombre: usuario });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

module.exports = router;