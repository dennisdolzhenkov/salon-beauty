const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// GET /api/masters — все мастера
app.get('/api/masters', (req, res) => {
  const masters = db.prepare('SELECT * FROM masters').all();
  res.json(masters);
});

// GET /api/masters/:id — один мастер по id
app.get('/api/masters/:id', (req, res) => {
  const master = db.prepare('SELECT * FROM masters WHERE id = ?').get(req.params.id);
  if (!master) return res.status(404).json({ error: 'Мастер не найден' });
  res.json(master);
});

// GET /api/services — все услуги (с фильтром по категории)
app.get('/api/services', (req, res) => {
  const { category } = req.query;
  let services;
  if (category) {
    services = db.prepare('SELECT * FROM services WHERE category = ?').all(category);
  } else {
    services = db.prepare('SELECT * FROM services').all();
  }
  res.json(services);
});

// GET /api/appointments — все записи с именами мастеров и услуг
app.get('/api/appointments', (req, res) => {
  const appointments = db.prepare(`
    SELECT
      a.*,
      m.name AS master_name,
      s.name AS service_name,
      s.price AS service_price
    FROM appointments a
    JOIN masters m ON a.master_id = m.id
    JOIN services s ON a.service_id = s.id
    ORDER BY a.date, a.time
  `).all();
  res.json(appointments);
});

// POST /api/appointments — создать новую запись
app.post('/api/appointments', (req, res) => {
  try {
    // читаем данные из тела запроса
    const { client_name, client_phone, master_id, service_id, date, time, notes } = req.body;

    // проверяем что все обязательные поля заполнены
    if (!client_name || !client_phone || !master_id || !service_id || !date || !time) {
      return res.status(400).json({ error: 'Заполните все обязательные поля' });
    }

    // проверяем нет ли уже записи к этому мастеру в это время
    const conflict = db.prepare(
      'SELECT id FROM appointments WHERE master_id = ? AND date = ? AND time = ? AND status = ?'
    ).get(Number(master_id), date, time, 'active');

    if (conflict) {
      return res.status(409).json({ error: 'Это время уже занято у данного мастера' });
    }

    // добавляем запись в базу данных
    const result = db.prepare(
      'INSERT INTO appointments (client_name, client_phone, master_id, service_id, date, time, notes) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).run(client_name, client_phone, Number(master_id), Number(service_id), date, time, notes || '');

    // возвращаем успешный ответ
    res.status(201).json({
      success: true,
      id: result.lastInsertRowid,
      message: 'Запись успешно создана!'
    });

  } catch (err) {
    console.error('Ошибка при записи:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/appointments/:id — отменить запись
app.delete('/api/appointments/:id', (req, res) => {
  db.prepare('UPDATE appointments SET status = ? WHERE id = ?')
    .run('cancelled', req.params.id);
  res.json({ success: true, message: 'Запись отменена' });
});

// GET /api/busy-slots — занятые слоты у мастера на дату
app.get('/api/busy-slots', (req, res) => {
  try {
    const { master_id, date } = req.query;
    if (!master_id || !date) {
      return res.json([]);
    }
    const slots = db.prepare(
      'SELECT time FROM appointments WHERE master_id = ? AND date = ? AND status = ?'
    ).all(master_id, date, 'active');
    res.json(slots.map(s => s.time));
  } catch (err) {
    console.error('Ошибка busy-slots:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// запуск сервера на порту 3000
app.listen(PORT, () => {
  console.log(`Сервер запущен: http://localhost:${PORT}`);
});