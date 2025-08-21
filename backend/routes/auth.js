const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const log4js = require('log4js');
const { Kafka } = require('kafkajs');

const logger = log4js.getLogger();

const kafka = new Kafka({ clientId: 'login-service', brokers: ['kafka:9092'] });
const producer = kafka.producer();

const dbConfig = { host: 'tidb', user: 'root', password: '', database: 'todo', port: 4000 };

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const conn = await mysql.createConnection(dbConfig);
    const [rows] = await conn.execute('SELECT * FROM users WHERE username=?', [username]);
    if (!rows.length) return res.status(401).json({ error: 'User not found' });

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Wrong password' });

    const token = jwt.sign({ id: user.id }, 'SECRET_KEY', { expiresIn: '1h' });
    await conn.execute('UPDATE users SET token=? WHERE id=?', [token, user.id]);

    logger.info({ timestamp: new Date(), userId: user.id, action: 'login', ip: req.ip });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
