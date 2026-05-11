// ============================================
// Quiz Section
// ============================================
import { t, getLang } from '../modules/i18n.js';
import { navigate } from '../modules/router.js';
import { loadContent } from '../modules/state.js';
import { saveQuizScore, getQuizScore } from '../modules/progress.js';

let data = null;
async function getData() {
  if (!data) data = await loadContent('07-quiz-content.json');
  return data;
}

export async function renderQuiz(container, sub) {
  const d = await getData();
  if (!d) return;
  if (!sub) return renderQuizHome(container, d);
  return renderQuizPlay(container, d, sub);
}

function renderQuizHome(container, d) {
  const quizzes = [
    { id:'arabic', icon:'📖', title: d.quiz_arabic_literacy.title, count: d.quiz_arabic_literacy.questions.length, color:'arabic' },
    { id:'french', icon:'🇫🇷', title: d.quiz_french_literacy.title, count: d.quiz_french_literacy.questions.length, color:'french' },
    { id:'phone', icon:'📱', title: d.quiz_phone_skills.title, count: d.quiz_phone_skills.questions.length, color:'phone' },
    { id:'safety', icon:'🛡️', title: d.quiz_internet_safety.title, count: d.quiz_internet_safety.questions.length, color:'safety' },
    { id:'civic', icon:'🏛️', title: d.quiz_civic_knowledge.title, count: d.quiz_civic_knowledge.questions.length, color:'civic' },
    { id:'life', icon:'🏠', title: d.quiz_life_skills.title, count: d.quiz_life_skills.questions.length, color:'life' },
  ];

  container.innerHTML = `<div class="section-page fade-in">
    <div class="section-hero" style="background:linear-gradient(135deg, var(--success-light), #A5D6A7)">
      <div class="section-hero-icon">✅</div>
      <h1 class="section-hero-title">${t(d.title)}</h1>
      <p class="section-hero-desc">${t(d.description)}</p>
    </div>
    <div class="info-card info" style="margin-bottom:var(--space-lg)">${t(d.instructions)}</div>
    <div class="modules-grid">
      ${quizzes.map(q => {
        const prev = getQuizScore('quiz_' + q.id);
        return `<div class="module-card border-${q.color}" data-mod="${q.id}">
          <div class="module-card-icon color-${q.color}">${q.icon}</div>
          <div class="module-card-info">
            <div class="module-card-title">${t(q.title)}</div>
            <div class="module-card-fr">${q.count} ${t({ar:'أسئلة',fr:'questions'})}${prev ? ` — ${prev.score}/${prev.total} ⭐` : ''}</div>
          </div>
          <div class="module-card-arrow">${getLang()==='ar'?'←':'→'}</div>
        </div>`;
      }).join('')}
    </div></div>`;

  container.querySelectorAll('.module-card').forEach(c => {
    c.addEventListener('click', () => navigate('/quiz/' + c.dataset.mod));
  });
}

function renderQuizPlay(container, d, quizId) {
  const quizMap = {
    arabic: d.quiz_arabic_literacy,
    french: d.quiz_french_literacy,
    phone: d.quiz_phone_skills,
    safety: d.quiz_internet_safety,
    civic: d.quiz_civic_knowledge,
    life: d.quiz_life_skills,
  };
  const quiz = quizMap[quizId];
  if (!quiz) { container.innerHTML = '<p>Quiz not found</p>'; return; }

  const questions = quiz.questions.filter(q => q.type === 'multiple_choice' || q.type === 'true_false' || q.type === 'image_choice');
  let current = 0;
  let score = 0;
  let answered = false;

  function showQuestion() {
    if (current >= questions.length) return showResult();
    const q = questions[current];
    answered = false;

    let optionsHtml = '';
    if (q.type === 'true_false') {
      optionsHtml = `
        <div class="quiz-options" style="grid-template-columns:1fr 1fr">
          <button class="quiz-option" data-val="true"><span class="quiz-option-letter" style="background:var(--success-light);color:var(--success)">✅</span>${t({ar:'نعم',fr:'Oui'})}</button>
          <button class="quiz-option" data-val="false"><span class="quiz-option-letter" style="background:var(--error-light);color:var(--error)">❌</span>${t({ar:'لا',fr:'Non'})}</button>
        </div>`;
    } else {
      const letters = ['A','B','C','D'];
      optionsHtml = `<div class="quiz-options">
        ${q.options.map((opt, i) => `
          <button class="quiz-option" data-val="${i}">
            <span class="quiz-option-letter">${letters[i]}</span>
            ${t(opt)}
          </button>`).join('')}
      </div>`;
    }

    container.innerHTML = `<div class="quiz-container fade-in">
      <div class="quiz-question-card">
        <div class="quiz-progress-text">${current + 1} / ${questions.length}</div>
        <div class="progress-bar" style="margin-bottom:var(--space-lg)">
          <div class="progress-bar-fill" style="width:${(current/questions.length)*100}%"></div>
        </div>
        <div class="quiz-question-text">${t(q.question)}</div>
        ${optionsHtml}
        <div id="quiz-feedback"></div>
      </div>
    </div>`;

    container.querySelectorAll('.quiz-option').forEach(btn => {
      btn.addEventListener('click', () => {
        if (answered) return;
        answered = true;
        const val = btn.dataset.val;
        let isCorrect = false;

        if (q.type === 'true_false') {
          isCorrect = (val === 'true') === q.correct;
        } else {
          isCorrect = parseInt(val) === q.correct;
        }

        if (isCorrect) {
          score++;
          btn.classList.add('correct');
        } else {
          btn.classList.add('incorrect');
          // Highlight correct
          if (q.type !== 'true_false') {
            container.querySelectorAll('.quiz-option')[q.correct]?.classList.add('correct');
          } else {
            const correctVal = q.correct ? 'true' : 'false';
            container.querySelector(`.quiz-option[data-val="${correctVal}"]`)?.classList.add('correct');
          }
        }

        const fb = document.getElementById('quiz-feedback');
        fb.innerHTML = `<div class="quiz-explanation">${t(q.explanation)}</div>
          <div class="quiz-nav-buttons">
            <button class="btn btn-primary" id="quiz-next">${current < questions.length - 1 ? t({ar:'التالي ▶',fr:'Suivant ▶'}) : t({ar:'النتيجة',fr:'Résultat'})}</button>
          </div>`;
        document.getElementById('quiz-next').addEventListener('click', () => {
          current++;
          showQuestion();
        });
      });
    });
  }

  function showResult() {
    saveQuizScore('quiz_' + quizId, score, questions.length);
    const pct = Math.round((score / questions.length) * 100);
    const passed = pct >= 60;
    const stars = pct >= 90 ? '⭐⭐⭐' : pct >= 70 ? '⭐⭐☆' : pct >= 60 ? '⭐☆☆' : '☆☆☆';

    container.innerHTML = `<div class="quiz-container"><div class="quiz-result">
      <div class="quiz-result-emoji">${passed ? '🎉' : '💪'}</div>
      <div class="quiz-stars">${stars}</div>
      <div class="quiz-result-score">${score}/${questions.length}</div>
      <div class="quiz-result-text">${passed ? t(d.quiz_settings.celebration_message) : t(d.quiz_settings.encouragement_message)}</div>
      <div class="quiz-nav-buttons" style="margin-top:var(--space-xl)">
        <button class="btn btn-outline" id="quiz-retry">${t({ar:'أعيدي',fr:'Réessayer'})}</button>
        <button class="btn btn-primary" id="quiz-back">${t({ar:'رجوع',fr:'Retour'})}</button>
      </div>
    </div></div>`;

    document.getElementById('quiz-retry').addEventListener('click', () => {
      current = 0; score = 0; showQuestion();
    });
    document.getElementById('quiz-back').addEventListener('click', () => navigate('/quiz'));
  }

  showQuestion();
}
