const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

app.use(express.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Подключение к базе данных SQLite
const db = new sqlite3.Database('waste_management.db', (err) => {
    if (err) console.error(err.message);
    console.log('Connected to SQLite database.');
});

// Инициализация базы данных
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        user_id INTEGER PRIMARY KEY,
        username TEXT,
        eco_points INTEGER DEFAULT 0
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS waste_types (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE,
        points_per_kg REAL
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS recycling_points (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        address TEXT,
        UNIQUE(name, address)
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS reports (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        waste_type_id INTEGER,
        weight REAL,
        recycling_point_id INTEGER,
        timestamp TEXT,
        FOREIGN KEY(user_id) REFERENCES users(user_id),
        FOREIGN KEY(waste_type_id) REFERENCES waste_types(id),
        FOREIGN KEY(recycling_point_id) REFERENCES recycling_points(id)
    )`);

    // Начальные данные
    db.get("SELECT COUNT(*) as count FROM waste_types", (err, row) => {
        if (row.count === 0) {
            db.run("INSERT OR IGNORE INTO waste_types (name, points_per_kg) VALUES (?, ?)", ["Пластик", 10]);
            db.run("INSERT OR IGNORE INTO waste_types (name, points_per_kg) VALUES (?, ?)", ["Бумага", 5]);
            db.run("INSERT OR IGNORE INTO waste_types (name, points_per_kg) VALUES (?, ?)", ["Стекло", 8]);
        }
    });
    db.get("SELECT COUNT(*) as count FROM recycling_points", (err, row) => {
        if (row.count === 0) {
            db.run("INSERT OR IGNORE INTO recycling_points (name, address) VALUES (?, ?)", ["Пункт №1", "ул. Ленина, 10"]);
            db.run("INSERT OR IGNORE INTO recycling_points (name, address) VALUES (?, ?)", ["Пункт №2", "ул. Мира, 5"]);
        }
    });
});

// Регистрация пользователя
app.post('/api/users', (req, res) => {
    const { user_id, username } = req.body;
    db.run("INSERT OR IGNORE INTO users (user_id, username) VALUES (?, ?)", [user_id, username], (err) => {
        if (err) return res.status(500).json({ message: 'Server Error' });
        res.status(201).json({ message: 'User registered' });
    });
});

// Получить все пункты приема
app.get('/api/recycling_points', (req, res) => {
    db.all("SELECT * FROM recycling_points", [], (err, rows) => {
        if (err) return res.status(500).json({ message: 'Server Error' });
        res.status(200).json(rows);
    });
});

// Добавить пункт приема
app.post('/api/recycling_points', (req, res) => {
    const { name, address } = req.body;
    db.run("INSERT INTO recycling_points (name, address) VALUES (?, ?)", [name, address], (err) => {
        if (err) return res.status(500).json({ message: 'Server Error' });
        res.status(201).json({ name, address });
    });
});

// Получить статистику пользователя
app.get('/api/users/:user_id/stats', (req, res) => {
    const user_id = req.params.user_id;
    db.get("SELECT eco_points FROM users WHERE user_id = ?", [user_id], (err, user) => {
        if (err || !user) return res.status(500).json({ message: 'Server Error' });
        db.all("SELECT wt.name, SUM(r.weight) as weight FROM reports r JOIN waste_types wt ON r.waste_type_id = wt.id WHERE r.user_id = ? GROUP BY wt.name", [user_id], (err, stats) => {
            if (err) return res.status(500).json({ message: 'Server Error' });
            res.status(200).json({ eco_points: user.eco_points, waste: stats });
        });
    });
});

// Добавить отчет
app.post('/api/reports', (req, res) => {
    const { user_id, waste_type_id, weight, recycling_point_id } = req.body;
    const timestamp = new Date().toISOString();
    db.run("INSERT INTO reports (user_id, waste_type_id, weight, recycling_point_id, timestamp) VALUES (?, ?, ?, ?, ?)",
        [user_id, waste_type_id, weight, recycling_point_id, timestamp], (err) => {
            if (err) return res.status(500).json({ message: 'Server Error' });
            db.get("SELECT points_per_kg FROM waste_types WHERE id = ?", [waste_type_id], (err, row) => {
                if (err) return res.status(500).json({ message: 'Server Error' });
                const eco_points = Math.round(weight * row.points_per_kg);
                db.run("UPDATE users SET eco_points = eco_points + ? WHERE user_id = ?", [eco_points, user_id], (err) => {
                    if (err) return res.status(500).json({ message: 'Server Error' });
                    res.status(201).json({ eco_points });
                });
            });
        });
});

// Получить достижения
app.get('/api/users/:user_id/achievements', (req, res) => {
    const user_id = req.params.user_id;
    db.get("SELECT eco_points FROM users WHERE user_id = ?", [user_id], (err, row) => {
        if (err || !row) return res.status(500).json({ message: 'Server Error' });
        const points = row.eco_points;
        let achievement = '';
        if (points >= 100) achievement = "Эко-Герой";
        else if (points >= 50) achievement = "Эко-Активист";
        else if (points >= 10) achievement = "Эко-Новичок";
        res.status(200).json({ achievement });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});