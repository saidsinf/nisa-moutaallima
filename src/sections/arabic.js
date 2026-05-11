// ============================================
// Arabic Literacy Section
// ============================================

import { t, getLang } from '../modules/i18n.js';
import { navigate } from '../modules/router.js';
import { loadContent } from '../modules/state.js';
import { speak, stop } from '../modules/tts.js';
import { audioButton, initAudioButtons } from '../components/audio-btn.js';

let data = null;

async function getData() {
  if (!data) data = await loadContent('01-arabic-literacy.json');
  return data;
}

export async function renderArabic(container, sub) {
  const d = await getData();
  if (!d) { container.innerHTML = '<p>خطأ في التحميل</p>'; return; }

  if (!sub) return renderArabicHome(container, d);
  if (sub === 'alphabet') return renderAlphabet(container, d);
  if (sub === 'vowels') return renderVowels(container, d);
  if (sub === 'syllables') return renderSyllables(container, d);
  if (sub === 'vocabulary') return renderVocabulary(container, d);
  if (sub === 'sentences') return renderSentences(container, d);
  if (sub === 'documents') return renderDocuments(container, d);
}

function renderArabicHome(container, d) {
  const modules = [
    { id: 'alphabet', icon: '🔤', title: d.module_1_alphabet.title, desc: { ar: '28 حرف', fr: '28 lettres' } },
    { id: 'vowels', icon: '◌َ', title: d.module_2_vowels.title, desc: { ar: '8 حركات', fr: '8 voyelles' } },
    { id: 'syllables', icon: '🧩', title: d.module_3_syllables.title, desc: { ar: 'تكوين المقاطع', fr: 'Former des syllabes' } },
    { id: 'vocabulary', icon: '📚', title: d.module_4_vocabulary.title, desc: { ar: '7 فئات', fr: '7 catégories' } },
    { id: 'sentences', icon: '💬', title: d.module_5_sentences.title, desc: { ar: 'جمل مفيدة', fr: 'Phrases utiles' } },
    { id: 'documents', icon: '📄', title: d.module_6_reading_real_documents.title, desc: { ar: 'وثائق حقيقية', fr: 'Documents réels' } },
  ];

  container.innerHTML = `
    <div class="section-page fade-in">
      <div class="section-hero" style="background: linear-gradient(135deg, var(--primary-surface), #C8E6C9)">
        <div class="section-hero-icon">📖</div>
        <h1 class="section-hero-title">${t(d.title)}</h1>
        <p class="section-hero-desc">${t(d.description)}</p>
      </div>
      <div class="modules-grid">
        ${modules.map(m => `
          <div class="module-card border-arabic" data-mod="${m.id}">
            <div class="module-card-icon color-arabic">${m.icon}</div>
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

  container.querySelectorAll('.module-card').forEach(card => {
    card.addEventListener('click', () => navigate('/arabic/' + card.dataset.mod));
  });
}

function renderAlphabet(container, d) {
  const letters = d.module_1_alphabet.letters;
  container.innerHTML = `
    <div class="section-page fade-in">
      ${audioButton(d.module_1_alphabet.instruction)}
      <p style="margin: var(--space-md) 0; font-size: var(--font-size-md); color: var(--text-medium);">${t(d.module_1_alphabet.instruction)}</p>
      <div id="letter-detail"></div>
      <div class="letter-grid">
        ${letters.map((l, i) => `
          <div class="letter-card" data-idx="${i}">
            <div class="letter-card-ar">${l.letter}</div>
            <div class="letter-card-name">${t(l.name)}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  initAudioButtons(container);

  container.querySelectorAll('.letter-card').forEach(card => {
    card.addEventListener('click', () => {
      const idx = parseInt(card.dataset.idx);
      const letter = letters[idx];
      showLetterDetail(letter);
      container.querySelectorAll('.letter-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      speak(letter.audio_text_ar || t(letter.name), 'ar');
    });
  });
}

function showLetterDetail(l) {
  const panel = document.getElementById('letter-detail');
  const formLabels = getLang() === 'ar'
    ? ['مفردة', 'أول', 'وسط', 'آخر']
    : ['Isolée', 'Initiale', 'Médiane', 'Finale'];

  panel.innerHTML = `
    <div class="detail-panel">
      <div class="detail-letter">${l.letter}</div>
      <div class="detail-name">${t(l.name)} — ${l.sound}</div>
      <div class="detail-forms">
        ${['isolated', 'initial', 'medial', 'final'].map((f, i) => `
          <div class="detail-form-item">
            <div class="detail-form-char">${l.forms[f]}</div>
            <div class="detail-form-label">${formLabels[i]}</div>
          </div>
        `).join('')}
      </div>
      <div class="detail-example">
        <div>
          <div class="detail-example-word">${t(l.example_word)}</div>
          <div class="detail-example-meaning">${getLang() === 'ar' ? l.example_word.fr : l.example_word.ar}</div>
        </div>
      </div>
      <div class="detail-mnemonic">${t(l.mnemonic)}</div>
    </div>
  `;
  panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function renderVowels(container, d) {
  const vowels = d.module_2_vowels.vowels;
  container.innerHTML = `
    <div class="section-page fade-in">
      <h2 style="font-size:var(--font-size-xl);margin-bottom:var(--space-sm)">${t(d.module_2_vowels.title)}</h2>
      <p style="margin-bottom:var(--space-lg);color:var(--text-medium)">${t(d.module_2_vowels.instruction)}</p>
      <div class="vowels-grid">
        ${vowels.map(v => `
          <div class="vowel-card" data-speak="${encodeURIComponent(t(v.name) + ' — ' + (typeof v.sound === 'string' ? v.sound : t(v.sound)))}" data-speak-lang="${getLang()}">
            <div class="vowel-symbol">بـ${v.symbol}</div>
            <div class="vowel-name">${t(v.name)}</div>
            <div class="vowel-sound">${typeof v.sound === 'string' ? v.sound : t(v.sound)}</div>
            <div class="vowel-example">${t(v.example)}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  container.querySelectorAll('.vowel-card').forEach(card => {
    card.addEventListener('click', () => {
      const txt = decodeURIComponent(card.dataset.speak);
      speak(txt, card.dataset.speakLang);
    });
  });
}

function renderSyllables(container, d) {
  const groups = d.module_3_syllables.syllable_groups;
  const exercises = d.module_3_syllables.word_building_exercises;

  container.innerHTML = `
    <div class="section-page fade-in">
      <h2 style="font-size:var(--font-size-xl);margin-bottom:var(--space-sm)">${t(d.module_3_syllables.title)}</h2>
      <p style="margin-bottom:var(--space-lg);color:var(--text-medium)">${t(d.module_3_syllables.instruction)}</p>

      ${groups.map(g => `
        <div class="card" style="margin-bottom:var(--space-md)">
          <div style="font-size:32px;font-weight:700;color:var(--primary);margin-bottom:var(--space-sm)">${g.letter}</div>
          <div style="display:flex;flex-wrap:wrap;gap:var(--space-sm)">
            ${g.syllables.map((s, i) => `
              <button class="pill-btn" data-speak="${encodeURIComponent(s)}" data-speak-lang="ar" style="font-size:var(--font-size-lg)">
                ${s} <span style="font-size:var(--font-size-xs);color:var(--text-light);margin-right:4px">${g.pronunciation[i]}</span>
              </button>
            `).join('')}
          </div>
        </div>
      `).join('')}

      <h3 style="font-size:var(--font-size-lg);margin:var(--space-lg) 0 var(--space-md)">${t({ ar: 'تمارين تكوين الكلمات', fr: 'Exercices de formation de mots' })}</h3>
      <div class="sentence-list">
        ${exercises.map(ex => `
          <div class="sentence-item" data-speak="${encodeURIComponent(ex.word)}" data-speak-lang="ar">
            <div class="sentence-audio-icon">🔊</div>
            <div class="sentence-text">
              <div class="sentence-ar">${ex.syllables.join(' + ')} = <strong>${ex.word}</strong></div>
              <div class="sentence-fr">${t(ex.meaning)}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  container.querySelectorAll('[data-speak]').forEach(el => {
    el.addEventListener('click', () => {
      speak(decodeURIComponent(el.dataset.speak), el.dataset.speakLang || 'ar');
    });
  });
}

function renderVocabulary(container, d) {
  const categories = d.module_4_vocabulary.categories;

  container.innerHTML = `
    <div class="section-page fade-in">
      <h2 style="font-size:var(--font-size-xl);margin-bottom:var(--space-lg)">${t(d.module_4_vocabulary.title)}</h2>
      <div class="vocab-categories">
        ${categories.map((cat, ci) => `
          <button class="vocab-category-btn" data-cat="${ci}">
            ${t(cat.name)}
          </button>
        `).join('')}
      </div>
      <div id="vocab-words"></div>
    </div>
  `;

  container.querySelectorAll('.vocab-category-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = categories[parseInt(btn.dataset.cat)];
      showVocabCategory(cat);
    });
  });
}

function showVocabCategory(cat) {
  const el = document.getElementById('vocab-words');
  el.innerHTML = `
    <h3 style="font-size:var(--font-size-lg);margin:var(--space-lg) 0 var(--space-md)">${t(cat.name)}</h3>
    <div class="vocab-words-grid">
      ${cat.words.map(w => `
        <div class="vocab-word-card" data-speak="${encodeURIComponent(w.ar)}" data-speak-lang="ar">
          <div class="vocab-word-ar">${w.ar}</div>
          <div class="vocab-word-fr">${w.fr}</div>
          ${w.darija ? `<div class="vocab-word-darija">${w.darija}</div>` : ''}
        </div>
      `).join('')}
    </div>
  `;

  el.querySelectorAll('.vocab-word-card').forEach(card => {
    card.addEventListener('click', () => {
      speak(decodeURIComponent(card.dataset.speak), 'ar');
    });
  });

  el.scrollIntoView({ behavior: 'smooth' });
}

function renderSentences(container, d) {
  const contexts = d.module_5_sentences.contexts;

  container.innerHTML = `
    <div class="section-page fade-in">
      <h2 style="font-size:var(--font-size-xl);margin-bottom:var(--space-md)">${t(d.module_5_sentences.title)}</h2>
      <div class="pill-nav" style="margin-bottom:var(--space-lg)">
        ${contexts.map((ctx, i) => `
          <button class="pill-btn ${i === 0 ? 'active' : ''}" data-ctx="${i}">${t(ctx.name)}</button>
        `).join('')}
      </div>
      <div id="sentences-list"></div>
    </div>
  `;

  showSentenceContext(contexts[0]);

  container.querySelectorAll('.pill-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      showSentenceContext(contexts[parseInt(btn.dataset.ctx)]);
    });
  });
}

function showSentenceContext(ctx) {
  const el = document.getElementById('sentences-list');
  const sentences = ctx.sentences || ctx.phrases || [];

  el.innerHTML = `
    <div class="sentence-list">
      ${sentences.map(s => `
        <div class="sentence-item" data-speak="${encodeURIComponent(s.ar)}" data-speak-lang="ar">
          <div class="sentence-audio-icon">🔊</div>
          <div class="sentence-text">
            <div class="sentence-ar">${s.ar}</div>
            <div class="sentence-fr">${s.fr}</div>
            ${s.darija ? `<div class="sentence-darija">🇲🇦 ${s.darija}</div>` : ''}
          </div>
        </div>
      `).join('')}
    </div>
  `;

  el.querySelectorAll('.sentence-item').forEach(item => {
    item.addEventListener('click', () => {
      speak(decodeURIComponent(item.dataset.speak), 'ar');
    });
  });
}

function renderDocuments(container, d) {
  const docs = d.module_6_reading_real_documents.documents;

  container.innerHTML = `
    <div class="section-page fade-in">
      <h2 style="font-size:var(--font-size-xl);margin-bottom:var(--space-lg)">${t(d.module_6_reading_real_documents.title)}</h2>
      ${docs.map(doc => `
        <div class="doc-card">
          <div class="doc-name">${t(doc.type)}</div>
          <div class="doc-requirements">
            <div class="doc-req-title">${t({ ar: 'الكلمات المهمة', fr: 'Mots importants' })}</div>
            ${doc.key_words.map(kw => `
              <div class="doc-req-item" data-speak="${encodeURIComponent(kw.word)}" data-speak-lang="ar" style="cursor:pointer">
                <strong>${kw.word}</strong> — ${t(kw.meaning)}
              </div>
            `).join('')}
          </div>
        </div>
      `).join('')}
    </div>
  `;

  container.querySelectorAll('[data-speak]').forEach(el => {
    el.addEventListener('click', () => {
      speak(decodeURIComponent(el.dataset.speak), 'ar');
    });
  });
}
