// ============================================
// French Literacy Section
// ============================================

import { t, getLang } from '../modules/i18n.js';
import { navigate } from '../modules/router.js';
import { loadContent } from '../modules/state.js';
import { speak } from '../modules/tts.js';

let data = null;
async function getData() {
  if (!data) data = await loadContent('02-french-literacy.json');
  return data;
}

export async function renderFrench(container, sub) {
  const d = await getData();
  if (!d) { container.innerHTML = '<p>Erreur de chargement</p>'; return; }
  if (!sub) return renderFrenchHome(container, d);
  if (sub === 'alphabet') return renderFrAlphabet(container, d);
  if (sub === 'sounds') return renderFrSounds(container, d);
  if (sub === 'vocabulary') return renderFrVocab(container, d);
  if (sub === 'phrases') return renderFrPhrases(container, d);
}

function renderFrenchHome(container, d) {
  const modules = [
    { id: 'alphabet', icon: '🔤', title: d.module_1_alphabet.title, desc: { ar: '26 حرف + رموز خاصة', fr: '26 lettres + caractères spéciaux' } },
    { id: 'sounds', icon: '🗣️', title: d.module_2_sounds.title, desc: { ar: '14 صوت خاص', fr: '14 sons spéciaux' } },
    { id: 'vocabulary', icon: '📚', title: d.module_3_vocabulary.title, desc: { ar: '5 فئات', fr: '5 catégories' } },
    { id: 'phrases', icon: '💬', title: d.module_4_phrases.title, desc: { ar: 'جمل عملية', fr: 'Phrases pratiques' } },
  ];

  container.innerHTML = `
    <div class="section-page fade-in">
      <div class="section-hero" style="background:linear-gradient(135deg, var(--accent-blue-light), #BBDEFB)">
        <div class="section-hero-icon">🇫🇷</div>
        <h1 class="section-hero-title">${t(d.title)}</h1>
      </div>
      <div class="modules-grid">
        ${modules.map(m => `
          <div class="module-card border-french" data-mod="${m.id}">
            <div class="module-card-icon color-french">${m.icon}</div>
            <div class="module-card-info">
              <div class="module-card-title">${t(m.title)}</div>
              <div class="module-card-fr">${t(m.desc)}</div>
            </div>
            <div class="module-card-arrow">${getLang() === 'ar' ? '←' : '→'}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  container.querySelectorAll('.module-card').forEach(c => {
    c.addEventListener('click', () => navigate('/french/' + c.dataset.mod));
  });
}

function renderFrAlphabet(container, d) {
  const letters = d.module_1_alphabet.letters;
  const specials = d.module_1_alphabet.special_characters;

  container.innerHTML = `
    <div class="section-page fade-in">
      <h2 style="font-size:var(--font-size-xl);margin-bottom:var(--space-lg)">${t(d.module_1_alphabet.title)}</h2>
      <div class="letter-grid" style="grid-template-columns:repeat(4,1fr)">
        ${letters.map(l => `
          <div class="letter-card" data-speak="${encodeURIComponent(l.letter + '. ' + l.sound + '. ' + l.example)}" data-speak-lang="fr">
            <div class="letter-card-ar" style="font-size:24px;font-family:var(--font-french)">${l.letter}</div>
            <div class="letter-card-name" style="font-size:10px">${l.phonetic_ar}</div>
          </div>
        `).join('')}
      </div>

      <h3 style="font-size:var(--font-size-lg);margin:var(--space-xl) 0 var(--space-md)">${t({ ar: 'الحروف الخاصة', fr: 'Caractères spéciaux' })}</h3>
      <div class="sentence-list">
        ${specials.map(s => `
          <div class="sentence-item" data-speak="${encodeURIComponent(s.char + '. ' + s.example)}" data-speak-lang="fr">
            <div class="sentence-audio-icon" style="font-size:24px;font-family:var(--font-french);background:var(--accent-blue-light);color:var(--accent-blue)">${s.char}</div>
            <div class="sentence-text">
              <div class="sentence-ar" style="font-size:var(--font-size-md)">${s.name}</div>
              <div class="sentence-fr">${s.sound}</div>
              <div class="sentence-darija" style="color:var(--accent-blue)">${s.example}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  container.querySelectorAll('[data-speak]').forEach(el => {
    el.addEventListener('click', () => speak(decodeURIComponent(el.dataset.speak), el.dataset.speakLang));
  });
}

function renderFrSounds(container, d) {
  const sounds = d.module_2_sounds.sounds;
  container.innerHTML = `
    <div class="section-page fade-in">
      <h2 style="font-size:var(--font-size-xl);margin-bottom:var(--space-sm)">${t(d.module_2_sounds.title)}</h2>
      <p style="margin-bottom:var(--space-lg);color:var(--text-medium)">${t(d.module_2_sounds.description)}</p>
      <div class="sentence-list">
        ${sounds.map(s => `
          <div class="sentence-item" data-speak="${encodeURIComponent(s.audio_text)}" data-speak-lang="fr">
            <div class="sentence-audio-icon" style="font-family:var(--font-french);font-weight:700;font-size:16px;background:var(--accent-blue-light);color:var(--accent-blue)">${s.combo}</div>
            <div class="sentence-text">
              <div class="sentence-ar">${s.sound_ar} → <strong style="font-family:var(--font-french)">${s.combo}</strong></div>
              <div class="sentence-fr" style="font-size:var(--font-size-sm)">${s.example}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  container.querySelectorAll('[data-speak]').forEach(el => {
    el.addEventListener('click', () => speak(decodeURIComponent(el.dataset.speak), 'fr'));
  });
}

function renderFrVocab(container, d) {
  const categories = d.module_3_vocabulary.categories;
  container.innerHTML = `
    <div class="section-page fade-in">
      <h2 style="font-size:var(--font-size-xl);margin-bottom:var(--space-lg)">${t(d.module_3_vocabulary.title)}</h2>
      <div class="vocab-categories">
        ${categories.map((cat, ci) => `
          <button class="vocab-category-btn" data-cat="${ci}">${t(cat.name)}</button>
        `).join('')}
      </div>
      <div id="fr-vocab-words"></div>
    </div>
  `;
  container.querySelectorAll('.vocab-category-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = categories[parseInt(btn.dataset.cat)];
      const el = document.getElementById('fr-vocab-words');
      el.innerHTML = `
        <h3 style="font-size:var(--font-size-lg);margin:var(--space-lg) 0 var(--space-md)">${t(cat.name)}</h3>
        <div class="vocab-words-grid">
          ${cat.words.map(w => `
            <div class="vocab-word-card" data-speak="${encodeURIComponent(w.fr)}" data-speak-lang="fr">
              <div class="vocab-word-ar" style="font-family:var(--font-french);font-size:var(--font-size-lg)">${w.fr}</div>
              <div class="vocab-word-fr">${w.ar}</div>
              ${w.phonetic_ar ? `<div class="vocab-word-darija">${w.phonetic_ar}</div>` : ''}
            </div>
          `).join('')}
        </div>
      `;
      el.querySelectorAll('.vocab-word-card').forEach(c => {
        c.addEventListener('click', () => speak(decodeURIComponent(c.dataset.speak), 'fr'));
      });
      el.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

function renderFrPhrases(container, d) {
  const contexts = d.module_4_phrases.contexts;
  container.innerHTML = `
    <div class="section-page fade-in">
      <h2 style="font-size:var(--font-size-xl);margin-bottom:var(--space-md)">${t(d.module_4_phrases.title)}</h2>
      <div class="pill-nav" style="margin-bottom:var(--space-lg)">
        ${contexts.map((ctx, i) => `
          <button class="pill-btn ${i === 0 ? 'active' : ''}" data-ctx="${i}">${t(ctx.name)}</button>
        `).join('')}
      </div>
      <div id="fr-phrases-list"></div>
    </div>
  `;

  function showCtx(ctx) {
    const el = document.getElementById('fr-phrases-list');
    el.innerHTML = `<div class="sentence-list">
      ${ctx.phrases.map(p => `
        <div class="sentence-item" data-speak="${encodeURIComponent(p.fr)}" data-speak-lang="fr">
          <div class="sentence-audio-icon">🔊</div>
          <div class="sentence-text">
            <div class="sentence-ar" style="font-family:var(--font-french)">${p.fr}</div>
            <div class="sentence-fr">${p.ar}</div>
            <div class="sentence-darija" style="color:var(--accent-blue)">${p.phonetic_ar}</div>
          </div>
        </div>
      `).join('')}
    </div>`;
    el.querySelectorAll('.sentence-item').forEach(item => {
      item.addEventListener('click', () => speak(decodeURIComponent(item.dataset.speak), 'fr'));
    });
  }

  showCtx(contexts[0]);
  container.querySelectorAll('.pill-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      showCtx(contexts[parseInt(btn.dataset.ctx)]);
    });
  });
}
