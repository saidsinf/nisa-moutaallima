// ============================================
// Main Entry Point — App Shell & Router
// ============================================

import { initLang, onLangChange, t } from './modules/i18n.js';
import { initRouter, getRouteParts } from './modules/router.js';
import { stop } from './modules/tts.js';
import { renderNavbar } from './components/navbar.js';
import { renderHeader } from './components/header.js';
import { renderHome } from './sections/home.js';
import { renderArabic } from './sections/arabic.js';
import { renderFrench } from './sections/french.js';
import { renderPhone } from './sections/phone.js';
import { renderSafety } from './sections/safety.js';
import { renderCivic } from './sections/civic.js';
import { renderLife } from './sections/life.js';
import { renderQuiz } from './sections/quiz.js';

// Initialize language
initLang();

// Section title map
const sectionTitles = {
  arabic: { ar: 'القراءة بالعربية', fr: 'Lire en arabe' },
  french: { ar: 'القراءة بالفرنسية', fr: 'Lire en français' },
  phone: { ar: 'مهارات الهاتف', fr: 'Compétences tél.' },
  safety: { ar: 'السلامة الرقمية', fr: 'Sécurité Internet' },
  civic: { ar: 'المعرفة المدنية', fr: 'Civique' },
  life: { ar: 'مهارات الحياة', fr: 'Compétences de vie' },
  quiz: { ar: 'اختبري معلوماتك', fr: 'Quiz' },
};

// Route handler
async function handleRoute(route) {
  const container = document.getElementById('app-content');
  const parts = getRouteParts();
  const section = parts[0] || '';
  const sub = parts[1] || '';

  // Stop any TTS
  stop();

  // Scroll to top
  container.scrollTop = 0;

  // Render header
  const title = sectionTitles[section] ? t(sectionTitles[section]) : t({ ar: 'نساء متعلمات', fr: 'Femmes Éduquées' });
  renderHeader(title);

  // Render navbar
  renderNavbar();

  // Render content
  try {
    switch (section) {
      case '':
        renderHome(container);
        break;
      case 'arabic':
        await renderArabic(container, sub);
        break;
      case 'french':
        await renderFrench(container, sub);
        break;
      case 'phone':
        await renderPhone(container, sub);
        break;
      case 'safety':
        await renderSafety(container, sub);
        break;
      case 'civic':
        await renderCivic(container, sub);
        break;
      case 'life':
        await renderLife(container, sub);
        break;
      case 'quiz':
        await renderQuiz(container, sub);
        break;
      default:
        renderHome(container);
    }
  } catch (err) {
    console.error('Route error:', err);
    container.innerHTML = `<div class="section-page text-center" style="padding:var(--space-xxl)">
      <div style="font-size:48px;margin-bottom:var(--space-md)">😔</div>
      <p>${t({ ar: 'حدث خطأ. جربي من جديد', fr: 'Une erreur est survenue. Réessayez' })}</p>
    </div>`;
  }
}

// Language change → re-render
onLangChange(() => {
  handleRoute();
});

// Initialize router
initRouter(handleRoute);
