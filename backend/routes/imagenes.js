const express = require('express');
const router = express.Router();
const db = require('../db');
const verifyToken = require('../middleware/verifyToken');

// Obtener imágenes de un producto
router.get('/:producto_id', async (req, res) => {
    const { producto_id } = req.params;
    try {
        const [rows] = await db.query('SELECT * FROM imagenes_productos WHERE producto_id = ?',[producto_id]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Obtener todas las imágenes de todos los productos y con su producto
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query("SELECT i.id, i.url, i.producto_id, p.nombre FROM imagenes_productos i INNER JOIN productos p ON p.id = i.producto_id");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Agregar imagen a un producto
router.post('/', verifyToken, async (req, res) => {
    const { url, producto_id } = req.body;
    try {
        const [result] = await db.query('INSERT INTO imagenes_productos (url, producto_id) VALUES (?, ?)',[url, producto_id]);
        res.json({ id: result.insertId, url, producto_id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//Actualizar imagen de producto
router.put('/:producto_id', verifyToken, async (req, res) => {
    const { producto_id } = req.params;
    const { url } = req.body;
    try {
        await db.query("UPDATE imagenes_productos SET url = ? WHERE id = ?", [url, producto_id]);
        res.json({ producto_id, url });
    } catch (err) {
        res.status(500).json({error: err.message})
    }
})

// Eliminar imagen
router.delete('/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM imagenes_productos WHERE id = ?', [id]);
        res.json({ mensaje: 'Imagen eliminada' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;