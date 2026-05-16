const Database = require('better-sqlite3'); // подключаем библиотеку для работы с SQLite
const db = new Database('salon.db'); // создаём файл базы данных salon.db (появится в папке проекта)

// db.exec выполняет SQL-команды — создаём таблицы если их ещё нет
db.exec(`

  -- ТАБЛИЦА МАСТЕРОВ
  CREATE TABLE IF NOT EXISTS masters (
    id INTEGER PRIMARY KEY AUTOINCREMENT, -- уникальный номер мастера, считается автоматически
    name TEXT NOT NULL,                   -- имя мастера, обязательное поле
    role TEXT NOT NULL,                   -- должность, например "Топ-стилист"
    specialization TEXT NOT NULL,         -- специализация: nails / hair / both
    experience INTEGER,                   -- опыт работы в годах
    rating REAL DEFAULT 5.0,              -- рейтинг, по умолчанию 5.0
    photo TEXT,                           -- ссылка на фото (необязательно)
    phone TEXT DEFAULT ''                            -- телефон мастера
  );

  -- ТАБЛИЦА УСЛУГ
  CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY AUTOINCREMENT, -- уникальный номер услуги
    name TEXT NOT NULL,                   -- название услуги
    category TEXT NOT NULL,               -- категория: nails или hair
    description TEXT,                     -- описание услуги
    price INTEGER NOT NULL,               -- цена в рублях
    duration INTEGER NOT NULL,            -- длительность в минутах
    is_complex INTEGER DEFAULT 0          -- сложная услуга? 1 = да, 0 = нет
  );

  -- ТАБЛИЦА ЗАПИСЕЙ КЛИЕНТОВ
  CREATE TABLE IF NOT EXISTS appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT, -- уникальный номер записи
    client_name TEXT NOT NULL,            -- имя клиента
    client_phone TEXT NOT NULL,           -- телефон клиента
    master_id INTEGER NOT NULL,           -- к какому мастеру (ссылка на таблицу masters)
    service_id INTEGER NOT NULL,          -- какая услуга (ссылка на таблицу services)
    date TEXT NOT NULL,                   -- дата записи, например "2026-05-10"
    time TEXT NOT NULL,                   -- время записи, например "14:00"
    status TEXT DEFAULT 'active',         -- статус: active / cancelled / done
    notes TEXT,                           -- пожелания клиента (необязательно)
    created_at TEXT DEFAULT (datetime('now')), -- дата создания записи, ставится автоматически
    FOREIGN KEY (master_id) REFERENCES masters(id),  -- связь с таблицей мастеров
    FOREIGN KEY (service_id) REFERENCES services(id) -- связь с таблицей услуг
  );
`);

// проверяем сколько мастеров уже есть в базе
const mastersCount = db.prepare('SELECT COUNT(*) as c FROM masters').get().c;

if (mastersCount === 0) { // если мастеров нет — добавляем начальные данные
  // готовим шаблон запроса для добавления мастера
  const insertMaster = db.prepare(
    'INSERT INTO masters (name, role, specialization, experience, rating) VALUES (?, ?, ?, ?, ?)'
  );
  // добавляем каждого мастера — порядок данных соответствует (?, ?, ?, ?, ?)
  insertMaster.run('Алёна Морозова', 'Мастер ногтевого сервиса', 'nails', 8, 5.0);
  insertMaster.run('Вера Соколова', 'Мастер маникюра', 'nails', 5, 4.8);
  insertMaster.run('Мария Белова', 'Топ-стилист', 'hair', 12, 5.0);
  insertMaster.run('Ирина Козлова', 'Колорист-стилист', 'hair', 7, 4.9);
  insertMaster.run('Дарья Новикова', 'Универсальный мастер', 'both', 4, 4.7);
}

// проверяем сколько услуг уже есть в базе
const servicesCount = db.prepare('SELECT COUNT(*) as c FROM services').get().c;

if (servicesCount === 0) { // если услуг нет — добавляем начальные данные
  // готовим шаблон запроса для добавления услуги
  const insertService = db.prepare(
    'INSERT INTO services (name, category, description, price, duration, is_complex) VALUES (?, ?, ?, ?, ?, ?)'
  );
  // НОГТИ
  insertService.run('Маникюр классический', 'nails', 'Обработка кутикулы, форма, покрытие', 1200, 60, 0);
  insertService.run('Маникюр с гель-лаком', 'nails', 'Долговременное покрытие, 200+ оттенков', 1800, 90, 0);
  insertService.run('Nail-art авторский',   'nails', 'Ручная роспись, фольга, стемпинг', 2800, 120, 1);
  insertService.run('Наращивание ногтей',   'nails', 'Акрил или гель, полное наращивание', 3500, 180, 1);
  insertService.run('Педикюр + SPA',        'nails', 'Аппаратная обработка, пилинг, маска', 2200, 120, 0);
  insertService.run('3D-дизайн ногтей',     'nails', 'Объёмный декор, стразы, эффекты', 4000, 150, 1);
  // ПРИЧЁСКИ
  insertService.run('Стрижка и укладка',       'hair', 'Мытьё, стрижка, финиш укладка', 2000, 75, 0);
  insertService.run('Окрашивание однотонное',   'hair', 'Профессиональная краска', 3500, 120, 0);
  insertService.run('Балаяж / Омбре',           'hair', 'Техника перехода тона, ручное нанесение', 6000, 210, 1);
  insertService.run('Мелирование сложное',      'hair', 'Многоуровневое, разные оттенки', 5500, 180, 1);
  insertService.run('Свадебная причёска',       'hair', 'Пробная + финальная работа', 7000, 180, 1);
  insertService.run('Кератиновое выпрямление',  'hair', 'Эффект до 5 месяцев', 8000, 240, 1);
}

module.exports = db; // экспортируем базу данных — чтобы server.js мог её использовать