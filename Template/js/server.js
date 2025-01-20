const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Создание или подключение к базе данных SQLite
const db = new sqlite3.Database('./pokemon_users.db', (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

// Создание таблицы пользователей, если она еще не существует
db.run(
  `CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  )`
);

// Регистрация пользователя
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `INSERT INTO users (username, password) VALUES (?, ?)`;
    db.run(query, [username, hashedPassword], (err) => {
      if (err) {
        if (err.message.includes('UNIQUE')) {
          res.status(400).json({ error: 'Пользователь с таким именем уже существует' });
        } else {
          res.status(500).json({ error: 'Ошибка при регистрации' });
        }
      } else {
        res.status(201).json({ message: 'Пользователь успешно зарегистрирован!' });
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Авторизация пользователя
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const query = `SELECT * FROM users WHERE username = ?`;
  db.get(query, [username], async (err, user) => {
    if (err) {
      res.status(500).json({ error: 'Ошибка сервера' });
    } else if (!user) {
      res.status(400).json({ error: 'Пользователь не найден' });
    } else {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        res.status(400).json({ error: 'Неверный пароль' });
      } else {
        res.json({ message: 'Вход успешен!' });
      }
    }
  });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
