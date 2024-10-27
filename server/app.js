const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const db = new sqlite3.Database('./server/database.db');

app.use(cors());
app.use(express.json()); // Para parsear JSON en las peticiones

// Crear la tabla de calificaciones si no existe
db.run(`CREATE TABLE IF NOT EXISTS calificaciones (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  materia TEXT NOT NULL,
  calificacion INTEGER NOT NULL
)`);

// Obtener todas las calificaciones
app.get('/api/calificaciones', (req, res) => {
  db.all('SELECT * FROM calificaciones', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ data: rows });
  });
});

// Crear una nueva calificación
app.post('/api/calificaciones', (req, res) => {
  const { nombre, materia, calificacion } = req.body;
  db.run('INSERT INTO calificaciones (nombre, materia, calificacion) VALUES (?, ?, ?)',
    [nombre, materia, calificacion],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID });
    }
  );
});

// Actualizar una calificación
app.put('/api/calificaciones/:id', (req, res) => {
  const { nombre, materia, calificacion } = req.body;
  const id = req.params.id;

  db.run('UPDATE calificaciones SET nombre = ?, materia = ?, calificacion = ? WHERE id = ?',
    [nombre, materia, calificacion, id],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ updated: this.changes });
    }
  );
});

// Eliminar una calificación
app.delete('/api/calificaciones/:id', (req, res) => {
  const id = req.params.id;

  db.run('DELETE FROM calificaciones WHERE id = ?', id, function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ deleted: this.changes });
  });
});

// Iniciar el servidor
const port = 3000;
app.listen(port, () => {
  console.log(`Servidor API corriendo en http://localhost:${port}`);
});
