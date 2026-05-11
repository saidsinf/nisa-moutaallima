// ============================================
// Life Skills Section
// ============================================
import { t, getLang } from '../modules/i18n.js';
import { navigate } from '../modules/router.js';
import { loadContent } from '../modules/state.js';

let data = null;
async function getData() {
  if (!data) data = await loadContent('06-life-skills.json');
  return data;
}

export async function renderLife(container, sub) {
  const d = await getData();
  if (!d) return;
  if (!sub) return renderLifeHome(container, d);
  if (sub === 'budget') return renderBudget(container, d);
  if (sub === 'nutrition') return renderNutrition(container, d);
  if (sub === 'health') return renderHealth(container, d);
  if (sub === 'math') return renderMath(container, d);
  if (sub === 'parenting') return renderParenting(container, d);
  if (sub === 'home') return renderHomeOrg(container, d);
}

function renderLifeHome(container, d) {
  const modules = [
    { id:'budget', icon:'💰', title: d.module_1_budget.title },
    { id:'nutrition', icon:'🍎', title: d.module_2_nutrition.title },
    { id:'health', icon:'❤️', title: d.module_3_health.title },
    { id:'math', icon:'🔢', title: d.module_4_basic_math.title },
    { id:'parenting', icon:'👨‍👩‍👧', title: d.module_5_parenting.title },
    { id:'home', icon:'🧹', title: d.module_6_home_organization.title },
  ];
  container.innerHTML = `<div class="section-page fade-in">
    <div class="section-hero" style="background:linear-gradient(135deg, var(--accent-orange-light), #FFCC80)">
      <div class="section-hero-icon">🏠</div>
      <h1 class="section-hero-title">${t(d.title)}</h1>
      <p class="section-hero-desc">${t(d.description)}</p>
    </div>
    <div class="modules-grid">
      ${modules.map(m => `<div class="module-card border-life" data-mod="${m.id}">
        <div class="module-card-icon color-life">${m.icon}</div>
        <div class="module-card-info"><div class="module-card-title">${t(m.title)}</div></div>
        <div class="module-card-arrow">${getLang()==='ar'?'←':'→'}</div>
      </div>`).join('')}
    </div></div>`;
  container.querySelectorAll('.module-card').forEach(c => {
    c.addEventListener('click', () => navigate('/life/' + c.dataset.mod));
  });
}

function renderBudget(container, d) {
  const mod = d.module_1_budget;
  const env = mod.envelope_method;
  container.innerHTML = `<div class="section-page fade-in">
    <h2 style="font-size:var(--font-size-xl);margin-bottom:var(--space-sm)">${t(mod.title)}</h2>
    <p style="margin-bottom:var(--space-lg);color:var(--text-medium)">${t(mod.intro)}</p>
    <h3 style="margin-bottom:var(--space-md)">${t(env.title)}</h3>
    <p style="margin-bottom:var(--space-md);color:var(--text-medium)">${t(env.description)}</p>
    <div class="envelopes-grid">
      ${env.envelopes.map(e => `<div class="envelope-card" style="background:${e.color}">
        <div class="envelope-percent">${e.percentage}%</div>
        <div class="envelope-info">
          <div class="envelope-name">${t(e.name)}</div>
          <div class="envelope-tip">${t(e.tips)}</div>
        </div>
      </div>`).join('')}
    </div>
    <h3 style="margin:var(--space-xl) 0 var(--space-md)">${t({ar:'نصائح التوفير',fr:'Conseils d\'épargne'})}</h3>
    ${mod.saving_tips.map(st => `<div class="card" style="margin-bottom:var(--space-sm)">
      <div style="font-weight:600">${t(st.tip)}</div>
      <div style="font-size:var(--font-size-sm);color:var(--success);margin-top:4px">💰 ${t(st.saving)}</div>
    </div>`).join('')}
  </div>`;
}

function renderNutrition(container, d) {
  const mod = d.module_2_nutrition;
  const days = mod.weekly_meal_plan.days;
  container.innerHTML = `<div class="section-page fade-in">
    <h2 style="font-size:var(--font-size-xl);margin-bottom:var(--space-sm)">${t(mod.title)}</h2>
    <p style="margin-bottom:var(--space-lg);color:var(--text-medium)">${t(mod.intro)}</p>
    <h3 style="margin-bottom:var(--space-md)">${t({ar:'المجموعات الغذائية',fr:'Groupes alimentaires'})}</h3>
    ${mod.food_groups.map(fg => `<div class="card" style="margin-bottom:var(--space-md);border-right:4px solid ${fg.color}">
      <div style="font-weight:700;color:${fg.color}">${t(fg.group)}</div>
      <div style="font-size:var(--font-size-sm);color:var(--text-medium);margin:4px 0">${t(fg.daily_amount)}</div>
      <div style="font-size:var(--font-size-sm)">${t(fg.tip)}</div>
    </div>`).join('')}
    <h3 style="margin:var(--space-xl) 0 var(--space-md)">${t(mod.weekly_meal_plan.title)}</h3>
    <div class="meal-plan">
      ${days.map(day => `<div class="meal-day">
        <div class="meal-day-name">${t(day.day)}</div>
        <div class="meal-items">
          <div><span class="meal-label">🍽️</span> ${t(day.lunch)}</div>
          <div><span class="meal-label">🌙</span> ${t(day.dinner)}</div>
        </div>
      </div>`).join('')}
    </div></div>`;
}

function renderHealth(container, d) {
  const mod = d.module_3_health;
  container.innerHTML = `<div class="section-page fade-in">
    <h2 style="font-size:var(--font-size-xl);margin-bottom:var(--space-sm)">${t(mod.title)}</h2>
    <p style="margin-bottom:var(--space-lg);color:var(--text-medium)">${t(mod.intro)}</p>
    <h3 style="margin-bottom:var(--space-md)">${t(mod.preventive_health.title)}</h3>
    ${mod.preventive_health.checkups.map(c => `<div class="card" style="margin-bottom:var(--space-sm)">
      <div style="font-weight:700">${t(c.what)}</div>
      <div style="font-size:var(--font-size-sm);color:var(--text-medium)">⏰ ${t(c.when)}</div>
      <div style="font-size:var(--font-size-sm);color:var(--success)">📍 ${t(c.where)}</div>
    </div>`).join('')}
    <h3 style="margin:var(--space-xl) 0 var(--space-md)">${t(mod.vaccination_children.title)}</h3>
    <div class="info-card info" style="margin-bottom:var(--space-md)">${t(mod.vaccination_children.description)}</div>
    ${mod.vaccination_children.schedule.map(s => `<div class="card" style="margin-bottom:var(--space-sm);display:flex;gap:var(--space-md)">
      <strong style="min-width:80px;color:var(--primary)">${t(s.age)}</strong>
      <span style="font-size:var(--font-size-sm)">${s.vaccines.join(', ')}</span>
    </div>`).join('')}
    <h3 style="margin:var(--space-xl) 0 var(--space-md)">${t(mod.first_aid_basics.title)}</h3>
    ${mod.first_aid_basics.situations.map(s => `<div class="card" style="margin-bottom:var(--space-md)">
      <div style="font-weight:700;margin-bottom:var(--space-sm)">🩹 ${t(s.situation)}</div>
      <div class="info-card success" style="padding:var(--space-sm);margin-bottom:var(--space-xs)">✅ ${t(s.do)}</div>
      <div class="info-card danger" style="padding:var(--space-sm)">❌ ${t(s.dont)}</div>
    </div>`).join('')}
  </div>`;
}

function renderMath(container, d) {
  const mod = d.module_4_basic_math;
  const levels = mod.numbers_recognition.levels;
  container.innerHTML = `<div class="section-page fade-in">
    <h2 style="font-size:var(--font-size-xl);margin-bottom:var(--space-sm)">${t(mod.title)}</h2>
    <p style="margin-bottom:var(--space-lg);color:var(--text-medium)">${t(mod.intro)}</p>
    ${levels.map(lv => `<div style="margin-bottom:var(--space-lg)">
      <h3 style="margin-bottom:var(--space-md)">${t(lv.title)}</h3>
      <div class="number-grid">
        ${lv.items.map(n => `<div class="number-card">
          <div class="number-digit">${n.number}</div>
          <div class="number-name">${t({ar:n.ar,fr:n.fr})}</div>
        </div>`).join('')}
      </div>
    </div>`).join('')}
    <h3 style="margin:var(--space-lg) 0 var(--space-md)">${t(mod.practical_math.title)}</h3>
    ${mod.practical_math.exercises.map(ex => `<div class="card" style="margin-bottom:var(--space-md)">
      <div style="font-weight:700;color:var(--accent-orange);margin-bottom:var(--space-sm)">📍 ${t(ex.context)}</div>
      ${ex.problems.map(p => `<div style="margin-bottom:var(--space-sm)">
        <div style="font-weight:500">${t(p.question)}</div>
        <div style="font-size:var(--font-size-sm);color:var(--accent-blue);margin-top:4px">💡 ${t(p.hint)}</div>
        <div style="font-size:var(--font-size-sm);color:var(--success);margin-top:2px">✅ ${p.answer} ${typeof p.unit==='string'?p.unit:t(p.unit)}</div>
      </div>`).join('')}
    </div>`).join('')}
  </div>`;
}

function renderParenting(container, d) {
  const mod = d.module_5_parenting;
  container.innerHTML = `<div class="section-page fade-in">
    <h2 style="font-size:var(--font-size-xl);margin-bottom:var(--space-sm)">${t(mod.title)}</h2>
    <p style="margin-bottom:var(--space-lg);color:var(--text-medium)">${t(mod.intro)}</p>
    ${mod.principles.map(p => `<div class="card" style="margin-bottom:var(--space-md)">
      <div style="font-weight:700;margin-bottom:var(--space-sm)">${t(p.principle)}</div>
      ${p.instead_of?`<div class="info-card danger" style="padding:var(--space-sm);margin-bottom:var(--space-xs)">❌ ${t(p.instead_of)}</div>`:''}
      ${p.say_this?`<div class="info-card success" style="padding:var(--space-sm)">✅ ${t(p.say_this)}</div>`:''}
      ${p.example?`<div style="margin-top:var(--space-sm);color:var(--text-medium);font-size:var(--font-size-sm)">${t(p.example)}</div>`:''}
      ${p.how?`<div style="margin-top:var(--space-sm);color:var(--accent-blue);font-size:var(--font-size-sm)">${t(p.how)}</div>`:''}
    </div>`).join('')}
    <h3 style="margin:var(--space-xl) 0 var(--space-md)">${t(mod.homework_help.title)}</h3>
    <div class="golden-rules">
      ${mod.homework_help.tips.map(tip => `<div class="golden-rule">${t(tip)}</div>`).join('')}
    </div></div>`;
}

function renderHomeOrg(container, d) {
  const mod = d.module_6_home_organization;
  container.innerHTML = `<div class="section-page fade-in">
    <h2 style="font-size:var(--font-size-xl);margin-bottom:var(--space-lg)">${t(mod.title)}</h2>
    <h3 style="margin-bottom:var(--space-md)">${t(mod.weekly_schedule.title)}</h3>
    ${mod.weekly_schedule.days.map(d => `<div class="card" style="margin-bottom:var(--space-sm);display:flex;gap:var(--space-md)">
      <strong style="min-width:70px;color:var(--primary)">${t(d.day)}</strong>
      <span>${t(d.task)}</span>
    </div>`).join('')}
    <h3 style="margin:var(--space-xl) 0 var(--space-md)">${t({ar:'نصائح التنظيف',fr:'Astuces ménage'})}</h3>
    ${mod.cleaning_tips.map(ct => `<div class="card" style="margin-bottom:var(--space-md)">
      <div style="font-weight:600;margin-bottom:var(--space-sm)">${t(ct.tip)}</div>
      <div style="display:flex;flex-wrap:wrap;gap:var(--space-xs)">
        ${t(ct.uses).map(u => `<span class="badge badge-primary">${u}</span>`).join('')}
      </div>
    </div>`).join('')}
  </div>`;
}
