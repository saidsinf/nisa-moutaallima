// ============================================
// Home Page
// ============================================

import { t, getLang } from '../modules/i18n.js';
import { navigate } from '../modules/router.js';
import { updateStreak, getStreak } from '../modules/progress.js';

const sections = [
  { id: 'arabic', icon: '📖', title: { ar: 'القراءة بالعربية', fr: 'Lire en arabe' }, fr: 'Arabic Literacy', color: 'arabic', path: '/arabic' },
  { id: 'french', icon: '🇫🇷', title: { ar: 'القراءة بالفرنسية', fr: 'Lire en français' }, fr: 'French Literacy', color: 'french', path: '/french' },
  { id: 'phone', icon: '📱', title: { ar: 'مهارات الهاتف', fr: 'Compétences tél.' }, fr: 'Phone Skills', color: 'phone', path: '/phone' },
  { id: 'safety', icon: '🛡️', title: { ar: 'السلامة الرقمية', fr: 'Sécurité Internet' }, fr: 'Internet Safety', color: 'safety', path: '/safety' },
  { id: 'civic', icon: '🏛️', title: { ar: 'المعرفة المدنية', fr: 'Connaissances civiques' }, fr: 'Civic Knowledge', color: 'civic', path: '/civic' },
  { id: 'life', icon: '🏠', title: { ar: 'مهارات الحياة', fr: 'Compétences de vie' }, fr: 'Life Skills', color: 'life', path: '/life' },
  { id: 'quiz', icon: '✅', title: { ar: 'اختبري معلوماتك', fr: 'Testez-vous' }, fr: 'Quiz', color: 'quiz', path: '/quiz' },
];

export function renderHome(container) {
  const streak = updateStreak();
  const lang = getLang();
  const greeting = t({
    ar: 'مرحبا بك! 🌸 ابدائي التعلّم',
    fr: 'Bienvenue ! 🌸 Commencez à apprendre'
  });

  container.innerHTML = `
    <div class="home-page fade-in">
      <div class="home-banner">
        <div class="home-banner-flower">🌸</div>
        <h1 class="home-banner-title">${t({ ar: 'نساء متعلمات', fr: 'Femmes Éduquées' })}</h1>
        <p class="home-banner-subtitle">${t({
          ar: 'من الحروف إلى الحقوق — تعلّمي كل يوم شي حاجة جديدة',
          fr: 'Des lettres aux droits — apprenez chaque jour quelque chose de nouveau'
        })}</p>
        ${streak > 1 ? `<div style="margin-top:12px;font-size:14px;opacity:0.9">🔥 ${streak} ${t({ ar: 'أيام متتالية', fr: 'jours consécutifs' })}</div>` : ''}
      </div>

      <h2 class="home-greeting">${greeting}</h2>

      <div class="home-sections-grid">
        ${sections.map(s => `
          <div class="home-section-card border-${s.color}" data-path="${s.path}">
            <div class="home-section-icon color-${s.color}">${s.icon}</div>
            <div class="home-section-title">${t(s.title)}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  container.querySelectorAll('.home-section-card').forEach(card => {
    card.addEventListener('click', () => {
      navigate(card.dataset.path);
    });
  });
}
