import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Configuración de la base de datos
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '12345',
  database: process.env.DB_NAME || 'events_db',
});

// Conectar a la base de datos
db.connect(err => {
  if (err) {
    console.error('Error de conexión a la BD:', err);
  } else {
    console.log('Conectado a la base de datos MySQL');
  }
});

// 🔹 Crear un nuevo evento
app.post('/events', (req, res) => {
    const { name, date, time, location, description } = req.body;
    console.log('Datos recibidos:', { name, date, time, location, description }); // Verifica aquí
    const sql = 'INSERT INTO events (name, date, time, location, description) VALUES (?, ?, ?, ?, ?)';
  
    db.query(sql, [name, date, time, location, description], (err, result) => {
      if (err) {
        console.error('Error al crear el evento:', err);
        res.status(500).json({ error: 'Error al crear el evento' });
      } else {
        res.status(201).json({ id: result.insertId, name, date, time, location, description });
      }
    });
  });
  

// 🔹 Obtener todos los eventos
app.get('/events', (req, res) => {
  const sql = 'SELECT * FROM events';

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error al obtener los eventos:', err);
      res.status(500).json({ error: 'Error al obtener eventos' });
    } else {
      res.json(results);
    }
  });
});

// 🔹 Obtener un evento por ID
app.get('/events/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM events WHERE id = ?';

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error al obtener el evento:', err);
      res.status(500).json({ error: 'Error al obtener el evento' });
    } else if (result.length === 0) {
      res.status(404).json({ message: 'Evento no encontrado' });
    } else {
      res.json(result[0]);
    }
  });
});

// 🔹 Actualizar un evento
app.put('/events/:id', (req, res) => {
  const { id } = req.params;
  const { name, date, time, location, description } = req.body;
  const sql = 'UPDATE events SET name = ?, date = ?, time = ?, location = ?, description = ? WHERE id = ?';

  db.query(sql, [name, date, time, location, description, id], (err, result) => {
    if (err) {
      console.error('Error al actualizar el evento:', err);
      res.status(500).json({ error: 'Error al actualizar el evento' });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ message: 'Evento no encontrado' });
    } else {
      res.json({ message: 'Evento actualizado correctamente' });
    }
  });
});

// 🔹 Eliminar un evento
app.delete('/events/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM events WHERE id = ?';

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error al eliminar el evento:', err);
      res.status(500).json({ error: 'Error al eliminar el evento' });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ message: 'Evento no encontrado' });
    } else {
      res.json({ message: 'Evento eliminado correctamente' });
    }
  });
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
