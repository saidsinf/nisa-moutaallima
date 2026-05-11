// ============================================
// Internet Safety Section
// ============================================

import { t, getLang } from '../modules/i18n.js';
import { navigate } from '../modules/router.js';
import { loadContent } from '../modules/state.js';
import { speak } from '../modules/tts.js';

let data = null;
async function getData() {
  if (!data) data = await loadContent('04-internet-safety.json');
  return data;
}

export async function renderSafety(container, sub) {
  const d = await getData();
  if (!d) return;
  if (!sub) return renderSafetyHome(container, d);
  if (sub === 'scams') return renderScams(container, d);
  if (sub === 'privacy') return renderPrivacy(container, d);
  if (sub === 'passwords') return renderPasswords(container, d);
  if (sub === 'children') return renderChildren(container, d);
  if (sub === 'fakenews') return renderFakeNews(container, d);
}

function renderSafetyHome(container, d) {
  const modules = [
    { id: 'scams', icon: '🎭', title: d.module_1_scams.title },
    { id: 'privacy', icon: '🔒', title: d.module_2_privacy.title },
    { id: 'passwords', icon: '🔑', title: d.module_3_passwords.title },
    { id: 'children', icon: '👶', title: d.module_4_children_safety.title },
    { id: 'fakenews', icon: '📰', title: d.module_5_fake_news.title },
  ];

  container.innerHTML = `
    <div class="section-page fade-in">
      <div class="section-hero" style="background:linear-gradient(135deg, var(--secondary-surface), #FFCDD2)">
        <div class="section-hero-icon">🛡️</div>
        <h1 class="section-hero-title">${t(d.title)}</h1>
        <p class="section-hero-desc">${t(d.description)}</p>
      </div>

      <div class="golden-rules" style="margin-bottom:var(--space-lg)">
        ${d.module_1_scams.golden_rules.slice(0, 3).map(r => `
          <div class="golden-rule">${t(r)}</div>
        `).join('')}
      </div>

      <div class="modules-grid">
        ${modules.map(m => `
          <div class="module-card border-safety" data-mod="${m.id}">
            <div class="module-card-icon color-safety">${m.icon}</div>
            <div class="module-card-info">
              <div class="module-card-title">${t(m.title)}</div>
            </div>
            <div class="module-card-arrow">${getLang() === 'ar' ? '←' : '→'}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  container.querySelectorAll('.module-card').forEach(c => {
    c.addEventListener('click', () => navigate('/safety/' + c.dataset.mod));
  });
}

function renderScams(container, d) {
  const scams = d.module_1_scams.scam_types;
  const rules = d.module_1_scams.golden_rules;

  container.innerHTML = `
    <div class="section-page fade-in">
      <h2 style="font-size:var(--font-size-xl);margin-bottom:var(--space-sm)">${t(d.module_1_scams.title)}</h2>
      <p style="margin-bottom:var(--space-lg);color:var(--text-medium)">${t(d.module_1_scams.intro)}</p>

      ${scams.map(s => `
        <div class="scam-card">
          <div class="scam-title">${t(s.name)}</div>
          <p style="color:var(--text-medium);margin-bottom:var(--space-sm)">${t(s.description)}</p>
          ${s.example_message ? `<div class="scam-example">${s.example_message}</div>` : ''}
          <div class="scam-flags">
            ${s.red_flags.map(f => `<div class="scam-flag-item">${t(f)}</div>`).join('')}
          </div>
          <div class="scam-action">${t(s.what_to_do)}</div>
        </div>
      `).join('')}

      <h3 style="font-size:var(--font-size-lg);margin:var(--space-lg) 0 var(--space-md)">${t({ ar: 'القواعد الذهبية', fr: 'Règles d\'or' })}</h3>
      <div class="golden-rules">
        ${rules.map(r => `<div class="golden-rule">${t(r)}</div>`).join('')}
      </div>
    </div>
  `;
}

function renderPrivacy(container, d) {
  const lessons = d.module_2_privacy.lessons;
  const sharing = lessons.find(l => l.id === 'what_to_share');
  const photos = lessons.find(l => l.id === 'photo_privacy');

  container.innerHTML = `
    <div class="section-page fade-in">
      <h2 style="font-size:var(--font-size-xl);margin-bottom:var(--space-lg)">${t(d.module_2_privacy.title)}</h2>

      ${sharing ? `
        <h3 style="font-size:var(--font-size-lg);margin-bottom:var(--space-md)">${t(sharing.title)}</h3>
        <div class="info-card danger" style="margin-bottom:var(--space-md)">
          <strong>❌ ${t({ ar: 'لا تشاركي أبدا', fr: 'Ne partagez JAMAIS' })}</strong>
        </div>
        ${sharing.never_share.map(item => `
          <div class="card" style="margin-bottom:var(--space-sm);border-right:4px solid var(--error)">
            <div style="font-weight:600">${t(item.item)}</div>
            <div style="font-size:var(--font-size-sm);color:var(--text-medium);margin-top:2px">${t(item.reason)}</div>
          </div>
        `).join('')}

        <div class="info-card success" style="margin:var(--space-lg) 0 var(--space-md)">
          <strong>✅ ${t({ ar: 'يمكنك مشاركة', fr: 'Vous pouvez partager' })}</strong>
        </div>
        ${sharing.ok_to_share.map(item => `
          <div class="card" style="margin-bottom:var(--space-sm);border-right:4px solid var(--success)">
            <div style="font-weight:600">${t(item.item)}</div>
          </div>
        `).join('')}
      ` : ''}

      ${photos ? `
        <h3 style="font-size:var(--font-size-lg);margin:var(--space-xl) 0 var(--space-md)">${t(photos.title)}</h3>
        <div class="golden-rules">
          ${photos.rules.map(r => `<div class="golden-rule">${t(r)}</div>`).join('')}
        </div>
      ` : ''}
    </div>
  `;
}

function renderPasswords(container, d) {
  const lessons = d.module_3_passwords.lessons;
  const goodPw = lessons.find(l => l.id === 'good_password');
  const phoneLock = lessons.find(l => l.id === 'phone_lock');

  container.innerHTML = `
    <div class="section-page fade-in">
      <h2 style="font-size:var(--font-size-xl);margin-bottom:var(--space-lg)">${t(d.module_3_passwords.title)}</h2>

      ${goodPw ? `
        <h3 style="font-size:var(--font-size-lg);margin-bottom:var(--space-md)">${t(goodPw.title)}</h3>
        <div class="info-card danger" style="margin-bottom:var(--space-md)">❌ ${t({ ar: 'كلمات سر ضعيفة', fr: 'Mots de passe faibles' })}</div>
        ${goodPw.bad_passwords.map(bp => `
          <div class="card" style="margin-bottom:var(--space-sm)">
            <code style="font-size:var(--font-size-lg);color:var(--error)">${bp.password}</code>
            <div style="font-size:var(--font-size-sm);color:var(--text-medium);margin-top:4px">${t(bp.reason)}</div>
          </div>
        `).join('')}

        <div class="info-card success" style="margin:var(--space-lg) 0 var(--space-md)">✅ ${t({ ar: 'نصائح لكلمة سر قوية', fr: 'Conseils pour un mot de passe fort' })}</div>
        <div class="golden-rules">
          ${goodPw.good_password_tips.map(tip => `<div class="golden-rule">${t(tip)}</div>`).join('')}
        </div>
      ` : ''}

      ${phoneLock ? `
        <h3 style="font-size:var(--font-size-lg);margin:var(--space-xl) 0 var(--space-md)">${t(phoneLock.title)}</h3>
        ${phoneLock.options.map(opt => `
          <div class="card" style="margin-bottom:var(--space-sm);border-right:4px solid ${opt.recommended ? 'var(--success)' : 'var(--warning)'}">
            <div style="font-weight:600">${t(opt.type)} ${opt.recommended ? '⭐' : ''}</div>
            <div style="font-size:var(--font-size-sm);color:var(--text-medium);margin-top:4px">
              ${t({ ar: 'الأمان', fr: 'Sécurité' })}: ${'🔒'.repeat(opt.security_level)}
            </div>
            ${opt.warning ? `<div class="info-card warning" style="margin-top:var(--space-sm);padding:var(--space-sm)">${t(opt.warning)}</div>` : ''}
          </div>
        `).join('')}
      ` : ''}
    </div>
  `;
}

function renderChildren(container, d) {
  const mod = d.module_4_children_safety;
  container.innerHTML = `
    <div class="section-page fade-in">
      <h2 style="font-size:var(--font-size-xl);margin-bottom:var(--space-sm)">${t(mod.title)}</h2>
      <p style="margin-bottom:var(--space-lg);color:var(--text-medium)">${t(mod.intro)}</p>

      ${mod.dangers.map(d => `
        <div class="card" style="margin-bottom:var(--space-md)">
          <div class="info-card danger" style="margin-bottom:var(--space-sm);padding:var(--space-sm)">⚠️ ${t(d.danger)}</div>
          <div class="info-card success" style="padding:var(--space-sm)">✅ ${t(d.solution)}</div>
        </div>
      `).join('')}

      <h3 style="font-size:var(--font-size-lg);margin:var(--space-lg) 0 var(--space-md)">${t({ ar: 'ماذا تقولين لأطفالك', fr: 'Que dire à vos enfants' })}</h3>
      <div class="sentence-list">
        ${mod.conversation_starters.map(cs => `
          <div class="sentence-item">
            <div class="sentence-audio-icon">💬</div>
            <div class="sentence-text">
              <div class="sentence-ar">${t(cs)}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderFakeNews(container, d) {
  const mod = d.module_5_fake_news;
  container.innerHTML = `
    <div class="section-page fade-in">
      <h2 style="font-size:var(--font-size-xl);margin-bottom:var(--space-sm)">${t(mod.title)}</h2>
      <p style="margin-bottom:var(--space-lg);color:var(--text-medium)">${t(mod.intro)}</p>

      <h3 style="font-size:var(--font-size-lg);margin-bottom:var(--space-md)">${t({ ar: 'كيف تعرفي الخبر الكاذب؟', fr: 'Comment reconnaître une fausse nouvelle ?' })}</h3>
      ${mod.how_to_spot.map(s => `
        <div class="card" style="margin-bottom:var(--space-sm)">
          <div style="display:flex;align-items:flex-start;gap:var(--space-sm)">
            <span>🚩</span>
            <span>${t(s.sign)}</span>
          </div>
        </div>
      `).join('')}

      <h3 style="font-size:var(--font-size-lg);margin:var(--space-lg) 0 var(--space-md)">${t({ ar: 'ماذا تفعلين؟', fr: 'Que faire ?' })}</h3>
      <div class="golden-rules">
        ${mod.what_to_do.map(w => `<div class="golden-rule">${t(w)}</div>`).join('')}
      </div>
    </div>
  `;
}
