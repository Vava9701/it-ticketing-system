const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Koneksi MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Ganti dengan user MySQL Anda
  password: '', // Ganti dengan password MySQL Anda
  database: 'it_ticketing_db'
});

db.connect(err => {
  if (err) throw err;
  console.log('Terhubung ke MySQL!');
});

// Buat tabel (jika belum ada)
db.query(`
  CREATE TABLE IF NOT EXISTS tickets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status ENUM('open', 'pending', 'resolved') DEFAULT 'open',
    priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`);

// API: Buat tiket baru
app.post('/api/tickets', (req, res) => {
  const { title, description, priority } = req.body;
  const query = 'INSERT INTO tickets (title, description, priority) VALUES (?, ?, ?)';
  db.query(query, [title, description, priority], (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(201).send({ id: result.insertId });
  });
});

// API: Ambil semua tiket
app.get('/api/tickets', (req, res) => {
  db.query('SELECT * FROM tickets', (err, results) => {
    if (err) return res.status(500).send(err);
    res.send(results);
  });
});

// Jalankan server
const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${5000}`);
});
	console.log(')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Buat tabel users
db.query(`
  CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'technician', 'user') DEFAULT 'user'
  )
`);

// Register
app.post('/api/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  
  db.query(
    'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
    [name, email, hashedPassword, role],
    (err) => {
      if (err) return res.status(400).send('Email sudah terdaftar!');
      res.send('Registrasi berhasil!');
    }
  );
});

// Login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  
  db.query(
    'SELECT * FROM users WHERE email = ?',
    [email],
    async (err, results) => {
      if (err || results.length === 0) return res.status(401).send('Email/password salah!');
      
      const user = results[0];
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).send('Email/password salah!');
      
      const token = jwt.sign(
        { id: user.id, role: user.role },
        'rahasia', // Ganti dengan secret key yang kuat
        { expiresIn: '1h' }
      );
      res.send({ token, role: user.role });
    }
  );
});

// Middleware verifikasi token
function authenticateToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.sendStatus(401);
  
  jwt.verify(token, 'rahasia', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Proteksi route dengan middleware
app.get('/api/protected', authenticateToken, (req, res) => {
  res.send(`Halo, Anda adalah ${req.user.role}!`);
});

// Update status tiket (hanya admin/teknisi)
app.put('/api/tickets/:id/status', authenticateToken, (req, res) => {
  if (req.user.role === 'user') return res.sendStatus(403);
  
  const { status } = req.body;
  db.query(
    'UPDATE tickets SET status = ? WHERE id = ?',
    [status, req.params.id],
    (err) => {
      if (err) return res.status(500).send(err);
      res.send('Status updated!');
    }
  );
});