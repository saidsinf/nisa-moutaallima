// ============================================
// i18n — Language Management
// ============================================

const LANG_KEY = 'nisa_lang';
let currentLang = localStorage.getItem(LANG_KEY) || 'ar';
let listeners = [];

export function getLang() {
  return currentLang;
}

export function setLang(lang) {
  currentLang = lang;
  localStorage.setItem(LANG_KEY, lang);
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  listeners.forEach(fn => fn(lang));
}

export function toggleLang() {
  setLang(currentLang === 'ar' ? 'fr' : 'ar');
}

export function onLangChange(fn) {
  listeners.push(fn);
  return () => { listeners = listeners.filter(f => f !== fn); };
}

// Translate bilingual object { ar: "...", fr: "..." }
export function t(obj) {
  if (!obj) return '';
  if (typeof obj === 'string') return obj;
  return obj[currentLang] || obj.ar || obj.fr || '';
}

// Initialize direction
export function initLang() {
  document.documentElement.lang = currentLang;
  document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
}
