// ============================================
// Header — Top bar with back + lang toggle
// ============================================

import { getLang, toggleLang, t } from '../modules/i18n.js';
import { navigate, getRouteParts } from '../modules/router.js';

export function renderHeader(title) {
  const el = document.getElementById('app-header');
  const parts = getRouteParts();
  const showBack = parts.length > 0;

  el.innerHTML = `
    <div class="header">
      <button class="header-back ${showBack ? '' : 'hidden'}" id="header-back-btn" aria-label="${t({ ar: 'رجوع', fr: 'Retour' })}">
        ${getLang() === 'ar' ? '→' : '←'}
      </button>
      <div class="header-title">${title || t({ ar: 'نساء متعلمات', fr: 'Femmes Éduquées' })}</div>
      <button class="header-lang" id="header-lang-btn">
        <span class="lang-icon">🌐</span>
        <span>${getLang() === 'ar' ? 'FR' : 'عر'}</span>
      </button>
    </div>
  `;

  document.getElementById('header-lang-btn').addEventListener('click', () => {
    toggleLang();
    // Re-render is handled by main.js listener
  });

  if (showBack) {
    document.getElementById('header-back-btn').addEventListener('click', () => {
      // Go up one level
      parts.pop();
      navigate('/' + parts.join('/'));
    });
  }
}
