const API = window.location.origin + '/api';

const ALL_TIMES = ['09:00','09:30','10:00','10:30','11:00','11:30',
                   '12:00','13:00','14:00','15:00','15:30','16:00','17:00','18:00'];

const MASTER_PHOTOS = [
  'https://p1.zoon.ru/e/b/610e9daa56313d599963bd20_623b486d7e981.jpg',
  'https://p1.zoon.ru/1/e/5d11a7049850a22e876debf9_5f1ffac663c27.jpg',
  'https://academy-expert.ru/wp-content/uploads/2023/12/%D0%BF%D1%80%D0%BE%D0%B4%D0%B2.-%D0%B1%D1%8C%D1%8E%D1%82%D0%B8-768x628.jpg',
  'https://avatars.mds.yandex.net/i?id=8d417a316168724069312f679bd74c48_l-5869219-images-thumbs&n=13',
  'https://avatars.mds.yandex.net/i?id=da82418dd8c3562e8b7c598146f2acc2_l-5404323-images-thumbs&n=13',
];

let selectedTime = null;

// ───── КАСТОМНЫЙ КУРСОР ─────
const cursor = document.createElement('div');
cursor.className = 'custom-cursor';
document.body.appendChild(cursor);

const cursorDot = document.createElement('div');
cursorDot.className = 'custom-cursor-dot';
document.body.appendChild(cursorDot);

document.addEventListener('mousemove', e => {
  cursor.style.left    = e.clientX + 'px';
  cursor.style.top     = e.clientY + 'px';
  cursorDot.style.left = e.clientX + 'px';
  cursorDot.style.top  = e.clientY + 'px';
});

document.addEventListener('mouseover', e => {
  if (e.target.matches('a,button,.service-card,.master-card,.gallery-item,.time-slot,.action-btn,.call-btn')) {
    cursor.classList.add('cursor--hover');
  }
});

document.addEventListener('mouseout', e => {
  if (e.target.matches('a,button,.service-card,.master-card,.gallery-item,.time-slot,.action-btn,.call-btn')) {
    cursor.classList.remove('cursor--hover');
  }
});

// ───── GSAP АНИМАЦИИ ─────
window.addEventListener('load', () => {
  if (typeof gsap === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  // hero
  gsap.from('.hero__title', {
    duration: 1.2, y: 80, opacity: 0, ease: 'power3.out'
  });
  gsap.from('.hero__tag', {
    duration: 0.8, y: 30, opacity: 0, delay: 0.3, ease: 'power2.out'
  });
  gsap.from('.hero__sub, .hero__btns, .hero__counters', {
    duration: 0.8, y: 40, opacity: 0, delay: 0.6, stagger: 0.15, ease: 'power2.out'
  });
  gsap.from('.hero__right', {
    duration: 1.2, x: 80, opacity: 0, delay: 0.2, ease: 'power3.out'
  });

  // заголовки секций
  gsap.utils.toArray('.section__title').forEach(title => {
    gsap.from(title, {
      scrollTrigger: { trigger: title, start: 'top 85%' },
      duration: 0.8, x: -60, opacity: 0, ease: 'power3.out'
    });
  });

  // карточки услуг
  gsap.utils.toArray('.service-card').forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: { trigger: card, start: 'top 85%' },
      duration: 0.6, y: 50, opacity: 0, delay: i * 0.05, ease: 'power2.out'
    });
  });

  // карточки мастеров
  gsap.utils.toArray('.master-card').forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: { trigger: card, start: 'top 85%' },
      duration: 0.5, y: 40, opacity: 0, delay: i * 0.08, ease: 'power2.out'
    });
  });

  // карточки отзывов
  gsap.utils.toArray('.review-card').forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: { trigger: card, start: 'top 85%' },
      duration: 0.6, y: 40, opacity: 0, delay: i * 0.12, ease: 'power2.out'
    });
  });

  // кнопки действий
  gsap.utils.toArray('.action-btn').forEach((btn, i) => {
    gsap.from(btn, {
      scrollTrigger: { trigger: btn, start: 'top 85%' },
      duration: 0.5, y: 30, opacity: 0, delay: i * 0.1, ease: 'power2.out'
    });
  });

  // параллакс на баннере
  gsap.to('.banner__img', {
    scrollTrigger: {
      trigger: '.banner', start: 'top bottom', end: 'bottom top', scrub: true,
    },
    y: 80, ease: 'none'
  });

  // бегущая строка — пауза при наведении
  const ticker = document.querySelector('.ticker__inner');
  if (ticker) {
    ticker.addEventListener('mouseenter', () => ticker.style.animationPlayState = 'paused');
    ticker.addEventListener('mouseleave', () => ticker.style.animationPlayState = 'running');
  }
});

// ───── GLIGHTBOX ─────
window.addEventListener('load', () => {
  if (typeof GLightbox === 'undefined') return;
  GLightbox({ selector: '.gallery-item', touchNavigation: true, loop: true });
});

// ───── IMASK — МАСКА ТЕЛЕФОНА ─────
window.addEventListener('load', () => {
  const phoneInput = document.getElementById('inp-phone');
  if (phoneInput && typeof IMask !== 'undefined') {
    IMask(phoneInput, { mask: '+{7} (000) 000-00-00' });
  }
});

// ───── TOASTIFY ─────
function showToast(message, type = 'success') {
  if (typeof Toastify === 'undefined') { alert(message); return; }
  Toastify({
    text: message,
    duration: 4000,
    gravity: 'top',
    position: 'right',
    style: {
      background: type === 'success' ? '#1a2a1a' : '#2a1a1a',
      color:      type === 'success' ? '#4caf50' : '#ff2d78',
      border:     `1px solid ${type === 'success' ? '#4caf50' : '#ff2d78'}`,
      borderRadius: '0',
      fontFamily: 'Unbounded, sans-serif',
      fontSize:   '11px',
      letterSpacing: '0.05em',
    },
    stopOnFocus: true,
  }).showToast();
}

// ───── ЗАГРУЗКА УСЛУГ ─────
async function loadServices(category = 'all') {
  const url = category === 'all'
    ? `${API}/services`
    : `${API}/services?category=${category}`;

  const res  = await fetch(url);
  const data = await res.json();
  const grid = document.getElementById('services-grid');
  grid.innerHTML = '';

  data.forEach(s => {
    const card = document.createElement('div');
    card.className = 'service-card';
    card.innerHTML = `
      ${s.is_complex ? '<span class="service-card__badge">★ Сложная</span>' : ''}
      <div class="service-card__name">${s.name}</div>
      <div class="service-card__desc">${s.description}</div>
      <div class="service-card__meta">
        <span class="service-card__price">${s.price.toLocaleString('ru')} ₽</span>
        <span class="service-card__time">${s.duration} мин</span>
      </div>
    `;
    grid.appendChild(card);
  });

  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
}

// ───── ЗАГРУЗКА МАСТЕРОВ ─────
async function loadMasters() {
  const res  = await fetch(`${API}/masters`);
  const data = await res.json();
  const grid = document.getElementById('masters-grid');
  grid.innerHTML = '';

  data.forEach((m, index) => {
    const card = document.createElement('div');
    card.className = 'master-card';
    const stars = '★'.repeat(Math.floor(m.rating));
    const photo = MASTER_PHOTOS[index % MASTER_PHOTOS.length];

    card.innerHTML = `
      <div class="master-card__photo-wrap">
        <img class="master-card__photo" src="${photo}" alt="${m.name}" loading="lazy"/>
        <div class="master-card__photo-overlay"></div>
      </div>
      <div class="master-card__body">
        <div class="master-card__rating">${stars} ${m.rating.toFixed(1)}</div>
        <div class="master-card__name">${m.name}</div>
        <div class="master-card__role">${m.role}</div>
        <div class="master-card__exp">Опыт: ${m.experience} лет</div>
      </div>
    `;
    grid.appendChild(card);
  });
}

// ───── ФИЛЬТР-ТАБЫ ─────
document.querySelectorAll('.filter-tab').forEach(btn => {
  btn.addEventListener('click', function () {
    document.querySelectorAll('.filter-tab').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    loadServices(this.dataset.cat);
  });
});

// ───── ЗАПУСК ─────
document.addEventListener('DOMContentLoaded', () => {
  loadServices();
  loadMasters();
});

const dbPath = process.env.NODE_ENV === 'production' 
  ? '/app/data/my-database.sqlite' 
  : './my-database.sqlite';
