// ============================================
// Audio Button Component
// ============================================

import { speak, stop, isSpeaking } from '../modules/tts.js';
import { getLang, t } from '../modules/i18n.js';

export function audioButton(text, customLabel) {
  const label = customLabel || t({ ar: 'اسمعي', fr: 'Écoutez' });
  const lang = getLang();
  const textToSpeak = typeof text === 'object' ? t(text) : text;

  return `
    <button class="audio-btn" data-speak="${encodeURIComponent(textToSpeak)}" data-speak-lang="${lang}">
      <span class="audio-btn-icon">🔊</span>
      <span>${label}</span>
    </button>
  `;
}

export function initAudioButtons(container) {
  container.querySelectorAll('[data-speak]').forEach(btn => {
    btn.addEventListener('click', () => {
      const text = decodeURIComponent(btn.dataset.speak);
      const lang = btn.dataset.speakLang || 'ar';

      if (isSpeaking()) {
        stop();
        btn.classList.remove('playing');
      } else {
        speak(text, lang);
        btn.classList.add('playing');
        setTimeout(() => btn.classList.remove('playing'), 3000);
      }
    });
  });
}
