// ============================================
// Navbar — Bottom Tab Navigation
// ============================================

import { getLang, t } from '../modules/i18n.js';
import { navigate, getRoute } from '../modules/router.js';

const tabs = [
  { id: 'arabic', icon: '📖', label: { ar: 'عربية', fr: 'Arabe' }, path: '/arabic' },
  { id: 'french', icon: '🇫🇷', label: { ar: 'فرنسية', fr: 'Français' }, path: '/french' },
  { id: 'phone', icon: '📱', label: { ar: 'تيليفون', fr: 'Tél.' }, path: '/phone' },
  { id: 'safety', icon: '🛡️', label: { ar: 'أمان', fr: 'Sécurité' }, path: '/safety' },
  { id: 'civic', icon: '🏛️', label: { ar: 'مدنية', fr: 'Civique' }, path: '/civic' },
  { id: 'life', icon: '🏠', label: { ar: 'حياة', fr: 'Vie' }, path: '/life' },
  { id: 'quiz', icon: '✅', label: { ar: 'كويز', fr: 'Quiz' }, path: '/quiz' },
];

export function renderNavbar() {
  const route = getRoute();
  const el = document.getElementById('app-navbar');

  el.innerHTML = `
    <div class="navbar">
      <button class="nav-tab ${route === '/' || route === '' ? 'active' : ''}" data-nav="/">
        <span class="nav-tab-icon">🌸</span>
        <span class="nav-tab-label">${t({ ar: 'الرئيسية', fr: 'Accueil' })}</span>
      </button>
      ${tabs.map(tab => `
        <button class="nav-tab ${route.startsWith(tab.path) ? 'active' : ''}" data-nav="${tab.path}">
          <span class="nav-tab-icon">${tab.icon}</span>
          <span class="nav-tab-label">${t(tab.label)}</span>
        </button>
      `).join('')}
    </div>
  `;

  el.querySelectorAll('.nav-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      navigate(btn.dataset.nav);
    });
  });
}
