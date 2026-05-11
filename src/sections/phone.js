// ============================================
// Phone Skills Section
// ============================================

import { t, getLang } from '../modules/i18n.js';
import { navigate } from '../modules/router.js';
import { loadContent } from '../modules/state.js';
import { speak } from '../modules/tts.js';

let data = null;
async function getData() {
  if (!data) data = await loadContent('03-phone-skills.json');
  return data;
}

export async function renderPhone(container, sub) {
  const d = await getData();
  if (!d) return;
  if (!sub) return renderPhoneHome(container, d);
  if (sub === 'basics') return renderModule(container, d.module_1_basics, 'basics');
  if (sub === 'calls') return renderModule(container, d.module_2_calls_contacts, 'calls');
  if (sub === 'whatsapp') return renderModule(container, d.module_3_whatsapp, 'whatsapp');
  if (sub === 'youtube') return renderModule(container, d.module_4_youtube, 'youtube');
  if (sub === 'maps') return renderModule(container, d.module_5_google_maps, 'maps');
  if (sub === 'apps') return renderApps(container, d);
  if (sub === 'wifi') return renderModule(container, d.module_7_wifi_internet, 'wifi');
}

function renderPhoneHome(container, d) {
  const modules = [
    { id: 'basics', icon: '📱', title: { ar: 'أساسيات الهاتف', fr: 'Les bases' } },
    { id: 'calls', icon: '📞', title: { ar: 'المكالمات', fr: 'Appels' } },
    { id: 'whatsapp', icon: '💬', title: { ar: 'واتساب', fr: 'WhatsApp' } },
    { id: 'youtube', icon: '▶️', title: { ar: 'يوتيوب', fr: 'YouTube' } },
    { id: 'maps', icon: '🗺️', title: { ar: 'خرائط جوجل', fr: 'Google Maps' } },
    { id: 'apps', icon: '📲', title: { ar: 'تطبيقات مفيدة', fr: 'Apps utiles' } },
    { id: 'wifi', icon: '📡', title: { ar: 'الواي فاي', fr: 'Wi-Fi' } },
  ];

  container.innerHTML = `
    <div class="section-page fade-in">
      <div class="section-hero" style="background:linear-gradient(135deg, var(--accent-purple-light), #E1BEE7)">
        <div class="section-hero-icon">📱</div>
        <h1 class="section-hero-title">${t(d.title)}</h1>
        <p class="section-hero-desc">${t(d.description)}</p>
      </div>
      <div class="modules-grid">
        ${modules.map(m => `
          <div class="module-card border-phone" data-mod="${m.id}">
            <div class="module-card-icon color-phone">${m.icon}</div>
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
    c.addEventListener('click', () => navigate('/phone/' + c.dataset.mod));
  });
}

function renderModule(container, mod, id) {
  const lessons = mod.lessons || [];

  container.innerHTML = `
    <div class="section-page fade-in">
      <h2 style="font-size:var(--font-size-xl);margin-bottom:var(--space-sm)">${t(mod.title)}</h2>
      ${mod.intro ? `<p style="margin-bottom:var(--space-lg);color:var(--text-medium)">${t(mod.intro)}</p>` : ''}

      ${lessons.map(lesson => {
        const steps = lesson.steps || [];
        const numbers = lesson.numbers || [];
        const gestures = lesson.gestures || [];
        const controls = lesson.controls || [];
        const info = lesson.info || [];
        const searches = lesson.searches || [];

        let content = '';

        if (steps.length) {
          content = `<div class="steps-list">
            ${steps.map((s, i) => `
              <div class="step-item">
                <div class="step-number" style="background:var(--accent-purple)">${s.step || i + 1}</div>
                <div class="step-content">
                  <div class="step-instruction">${t(s.instruction)}</div>
                  ${s.tip ? `<div class="step-tip">${t(s.tip)}</div>` : ''}
                </div>
              </div>
            `).join('')}
          </div>`;
        }

        if (gestures.length) {
          content = gestures.map(g => `
            <div class="card" style="margin-bottom:var(--space-md)">
              <div class="card-header"><span style="font-size:28px">👆</span><strong>${t(g.name)}</strong></div>
              <div class="card-body">${t(g.description)}</div>
            </div>
          `).join('');
        }

        if (controls.length) {
          content = controls.map(c => `
            <div class="card" style="margin-bottom:var(--space-md)">
              <div class="card-header"><strong>${t(c.control)}</strong></div>
              <div class="card-body">${t(c.instruction)}</div>
            </div>
          `).join('');
        }

        if (numbers.length) {
          content = `<div class="emergency-grid">
            ${numbers.map(n => `
              <div class="emergency-card">
                <div class="emergency-name">${t(n.name)}</div>
                <div class="emergency-number">${n.number}</div>
              </div>
            `).join('')}
          </div>`;
        }

        if (searches.length) {
          content = `<div class="vocab-words-grid">
            ${searches.map(s => `
              <div class="vocab-word-card" data-speak="${encodeURIComponent(s.query || t(s))}" data-speak-lang="ar">
                <div class="vocab-word-ar">${s.ar || t(s)}</div>
                ${s.fr ? `<div class="vocab-word-fr">${s.fr}</div>` : ''}
              </div>
            `).join('')}
          </div>`;
        }

        if (Array.isArray(info) && info.length) {
          content = info.map(item => {
            if (item.tips) {
              return item.tips.map(tip => `
                <div class="info-card info">${t(tip)}</div>
              `).join('');
            }
            return `<div class="card" style="margin-bottom:var(--space-md)">
              <div class="card-header"><strong>${t(item.topic)}</strong></div>
              <div class="card-body">${t(item.instruction)}</div>
            </div>`;
          }).join('');
        }

        return `
          <div class="card" style="margin-bottom:var(--space-lg)">
            <h3 style="font-size:var(--font-size-lg);font-weight:700;margin-bottom:var(--space-md)">${t(lesson.title)}</h3>
            ${lesson.tip ? `<div class="info-card info" style="margin-bottom:var(--space-md)">${t(lesson.tip)}</div>` : ''}
            ${content}
          </div>
        `;
      }).join('')}

      ${mod.comparison ? `
        <div style="display:grid;gap:var(--space-md);grid-template-columns:1fr 1fr">
          ${mod.comparison.map(c => `
            <div class="card" style="text-align:center">
              <h4 style="font-weight:700;margin-bottom:var(--space-sm)">${typeof c.type === 'string' ? c.type : t(c.type)}</h4>
              <p style="font-size:var(--font-size-sm);color:var(--text-medium)">${t(c.description)}</p>
              <p style="font-size:var(--font-size-xs);color:var(--accent-blue);margin-top:var(--space-xs)">${t(c.when_to_use)}</p>
            </div>
          `).join('')}
        </div>
      ` : ''}

      ${mod.tips ? `
        ${mod.tips.map(tip => `<div class="info-card warning">${t(tip)}</div>`).join('')}
      ` : ''}
    </div>
  `;

  container.querySelectorAll('[data-speak]').forEach(el => {
    el.addEventListener('click', () => speak(decodeURIComponent(el.dataset.speak), el.dataset.speakLang || 'ar'));
  });
}

function renderApps(container, d) {
  const apps = d.module_6_moroccan_apps.apps;
  const iconColors = ['#4CAF50','#2196F3','#FF9800','#F44336','#9C27B0','#00BCD4'];

  container.innerHTML = `
    <div class="section-page fade-in">
      <h2 style="font-size:var(--font-size-xl);margin-bottom:var(--space-lg)">${t(d.module_6_moroccan_apps.title)}</h2>
      ${apps.map((app, i) => `
        <div class="app-card">
          <div class="app-icon" style="background:${iconColors[i % iconColors.length]}20;color:${iconColors[i % iconColors.length]}">📲</div>
          <div class="app-info">
            <div class="app-name">${app.name}</div>
            <div class="app-category">${t(app.category)}</div>
            <div class="app-desc">${t(app.description)}</div>
            ${app.warning ? `<div class="info-card warning" style="margin-top:var(--space-sm);padding:var(--space-sm)">${t(app.warning)}</div>` : ''}
          </div>
        </div>
      `).join('')}
    </div>
  `;
}
