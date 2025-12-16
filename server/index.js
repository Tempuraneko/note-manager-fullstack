// server/index.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const multer = require('multer'); // NEW: For handling file uploads
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// NEW: Serve static files from the "uploads" directory so frontend can see images
app.use('/uploads', express.static('uploads'));

// NEW: Configure Multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = './uploads';
        // Create folder if it doesn't exist
        if (!fs.existsSync(uploadPath)){
            fs.mkdirSync(uploadPath);
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        // Save file as "timestamp-filename.png" to avoid duplicates
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// Database Setup
const db = new sqlite3.Database('./notes.db', (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    // NEW: Add 'image' column to table
    db.run(`CREATE TABLE IF NOT EXISTS notes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            image TEXT
        )`, (err) => {
            // Migration: If table exists but lacks image column, add it (simple fix for dev)
            if (!err) {
                db.run("ALTER TABLE notes ADD COLUMN image TEXT", (err) => {
                    // Ignore error if column already exists
                });
            }
        });
  }
});

// --- API ROUTES ---

// 1. READ ALL
app.get('/api/notes', (req, res) => {
    db.all("SELECT * FROM notes ORDER BY id DESC", [], (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({ "data": rows });
    });
});

// 2. CREATE (Now handles file upload)
app.post('/api/notes', upload.single('image'), (req, res) => {
    const { title, content } = req.body;
    // Get filename if a file was uploaded, else use null
    const image = req.file ? req.file.filename : null;

    const sql = 'INSERT INTO notes (title, content, image) VALUES (?,?,?)';
    db.run(sql, [title, content, image], function (err) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({ "message": "success", "data": { id: this.lastID, title, content, image } });
    });
});

// 3. UPDATE (Now handles file upload)
app.put('/api/notes/:id', upload.single('image'), (req, res) => {
    const { title, content } = req.body;
    const file = req.file;

    // Logic: If new file uploaded, update image column. If not, keep old image.
    let sql, params;
    if (file) {
        sql = `UPDATE notes SET title = ?, content = ?, image = ? WHERE id = ?`;
        params = [title, content, file.filename, req.params.id];
    } else {
        sql = `UPDATE notes SET title = ?, content = ? WHERE id = ?`;
        params = [title, content, req.params.id];
    }

    db.run(sql, params, function (err) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({ message: "success", changes: this.changes });
    });
});

// 4. DELETE
app.delete('/api/notes/:id', (req, res) => {
    const sql = 'DELETE FROM notes WHERE id = ?';
    db.run(sql, req.params.id, function (err) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({ message: "deleted", changes: this.changes });
    });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});