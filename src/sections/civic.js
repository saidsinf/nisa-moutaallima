// ============================================
// Civic Knowledge Section
// ============================================

import { t, getLang } from '../modules/i18n.js';
import { navigate } from '../modules/router.js';
import { loadContent } from '../modules/state.js';

let data = null;
async function getData() {
  if (!data) data = await loadContent('05-civic-knowledge.json');
  return data;
}

export async function renderCivic(container, sub) {
  const d = await getData();
  if (!d) return;
  if (!sub) return renderCivicHome(container, d);
  if (sub === 'morocco') return renderMorocco(container, d);
  if (sub === 'government') return renderGov(container, d);
  if (sub === 'documents') return renderDocs(container, d);
  if (sub === 'admin') return renderAdmin(container, d);
  if (sub === 'rights') return renderRights(container, d);
  if (sub === 'elections') return renderElections(container, d);
}

function renderCivicHome(container, d) {
  const modules = [
    { id: 'morocco', icon: '🇲🇦', title: d.module_1_morocco_basics.title },
    { id: 'government', icon: '🏛️', title: d.module_2_government.title },
    { id: 'documents', icon: '📄', title: d.module_3_documents.title },
    { id: 'admin', icon: '🏢', title: d.module_4_administrations_guide.title },
    { id: 'rights', icon: '⚖️', title: d.module_5_womens_rights.title },
    { id: 'elections', icon: '🗳️', title: d.module_6_elections.title },
  ];
  container.innerHTML = `
    <div class="section-page fade-in">
      <div class="section-hero" style="background:linear-gradient(135deg, var(--accent-gold-light), #FFE082)">
        <div class="section-hero-icon">🏛️</div>
        <h1 class="section-hero-title">${t(d.title)}</h1>
        <p class="section-hero-desc">${t(d.description)}</p>
      </div>
      <div class="modules-grid">
        ${modules.map(m => `
          <div class="module-card border-civic" data-mod="${m.id}">
            <div class="module-card-icon color-civic">${m.icon}</div>
            <div class="module-card-info"><div class="module-card-title">${t(m.title)}</div></div>
            <div class="module-card-arrow">${getLang() === 'ar' ? '←' : '→'}</div>
          </div>
        `).join('')}
      </div>
    </div>`;
  container.querySelectorAll('.module-card').forEach(c => {
    c.addEventListener('click', () => navigate('/civic/' + c.dataset.mod));
  });
}

function renderMorocco(container, d) {
  const facts = d.module_1_morocco_basics.facts;
  const cities = d.module_1_morocco_basics.regions_major_cities;
  container.innerHTML = `<div class="section-page fade-in">
    <h2 style="font-size:var(--font-size-xl);margin-bottom:var(--space-lg)">${t(d.module_1_morocco_basics.title)}</h2>
    ${facts.map(f => `<div class="card" style="margin-bottom:var(--space-sm);display:flex;gap:var(--space-md)">
      <strong style="color:var(--primary);min-width:100px">${t(f.label)}</strong><span>${t(f.value)}</span>
    </div>`).join('')}
    <h3 style="margin:var(--space-xl) 0 var(--space-md)">🏙️ ${t({ar:'المدن الكبرى',fr:'Grandes villes'})}</h3>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-sm)">
      ${cities.map(c => `<div class="card" style="text-align:center;padding:var(--space-md)">
        <div style="font-weight:700;font-size:var(--font-size-lg)">${t(c.city)}</div>
        <div style="font-size:var(--font-size-sm);color:var(--text-medium)">${t(c.known_for)}</div>
      </div>`).join('')}
    </div></div>`;
}

function renderGov(container, d) {
  container.innerHTML = `<div class="section-page fade-in">
    <h2 style="font-size:var(--font-size-xl);margin-bottom:var(--space-lg)">${t(d.module_2_government.title)}</h2>
    ${d.module_2_government.structure.map(s => `<div class="card" style="margin-bottom:var(--space-md)">
      <div style="font-size:var(--font-size-lg);font-weight:700;margin-bottom:var(--space-xs)">${t(s.institution)}</div>
      <div style="color:var(--text-medium)">${t(s.role)}</div>
    </div>`).join('')}</div>`;
}

function renderDocs(container, d) {
  container.innerHTML = `<div class="section-page fade-in">
    <h2 style="font-size:var(--font-size-xl);margin-bottom:var(--space-lg)">${t(d.module_3_documents.title)}</h2>
    ${d.module_3_documents.documents.map(doc => `<div class="doc-card">
      <div class="doc-name">${t(doc.name)}</div>
      ${doc.darija ? `<div class="doc-darija">🇲🇦 ${doc.darija}</div>` : ''}
      ${doc.importance ? `<div class="doc-importance">${t(doc.importance)}</div>` : ''}
      ${doc.where_to_get ? `<div style="margin-bottom:var(--space-sm)"><strong>${t({ar:'أين؟',fr:'Où ?'})}</strong> ${t(doc.where_to_get)}</div>` : ''}
      ${doc.required_docs ? `<div class="doc-requirements"><div class="doc-req-title">${t({ar:'الوثائق المطلوبة',fr:'Documents requis'})}</div>
        ${doc.required_docs.map(rd => `<div class="doc-req-item">${t(rd)}</div>`).join('')}</div>` : ''}
      ${doc.note ? `<div class="info-card info" style="margin-top:var(--space-sm);padding:var(--space-sm)">${t(doc.note)}</div>` : ''}
    </div>`).join('')}</div>`;
}

function renderAdmin(container, d) {
  container.innerHTML = `<div class="section-page fade-in">
    <h2 style="font-size:var(--font-size-xl);margin-bottom:var(--space-lg)">${t(d.module_4_administrations_guide.title)}</h2>
    ${d.module_4_administrations_guide.guide.map(g => `<div class="card" style="margin-bottom:var(--space-md)">
      <div style="font-weight:700;color:var(--primary);margin-bottom:var(--space-xs)">${t(g.need)}</div>
      <div>➡️ ${t(g.go_to)}</div>
      ${g.darija ? `<div style="font-size:var(--font-size-sm);color:var(--accent-purple);margin-top:4px">🇲🇦 ${g.darija}</div>` : ''}
    </div>`).join('')}</div>`;
}

function renderRights(container, d) {
  const mod = d.module_5_womens_rights;
  container.innerHTML = `<div class="section-page fade-in">
    <h2 style="font-size:var(--font-size-xl);margin-bottom:var(--space-sm)">${t(mod.title)}</h2>
    <p style="margin-bottom:var(--space-lg);color:var(--text-medium)">${t(mod.intro)}</p>
    ${mod.rights.map(cat => `<div class="rights-category">
      <div class="rights-category-title">${t(cat.category)}</div>
      <div class="rights-list">${cat.rights_list.map(r => `<div class="right-item">${t(r)}</div>`).join('')}</div>
    </div>`).join('')}
    <h3 style="margin:var(--space-lg) 0 var(--space-md)">📞 ${t({ar:'أرقام المساعدة',fr:"Numéros d'aide"})}</h3>
    <div class="emergency-grid">
      ${mod.help_resources.filter(r=>r.contact).map(r => `<div class="emergency-card">
        <div class="emergency-name">${t(r.name)}</div>
        <div class="emergency-number" style="font-size:var(--font-size-lg)">${r.contact}</div>
      </div>`).join('')}
    </div></div>`;
}

function renderElections(container, d) {
  container.innerHTML = `<div class="section-page fade-in">
    <h2 style="font-size:var(--font-size-xl);margin-bottom:var(--space-lg)">${t(d.module_6_elections.title)}</h2>
    ${d.module_6_elections.info.map(q => `<div class="card" style="margin-bottom:var(--space-md)">
      <div style="font-size:var(--font-size-lg);font-weight:700;color:var(--primary);margin-bottom:var(--space-sm)">${t(q.question)}</div>
      <div>${t(q.answer)}</div>
    </div>`).join('')}</div>`;
}
