// ============================================
// Progress — localStorage tracking
// ============================================

const PROGRESS_KEY = 'nisa_progress';

function getProgress() {
  try {
    return JSON.parse(localStorage.getItem(PROGRESS_KEY)) || createDefault();
  } catch {
    return createDefault();
  }
}

function createDefault() {
  return {
    sections: {},
    badges: [],
    streak: 0,
    lastVisit: null,
    totalTime: 0,
  };
}

function saveProgress(data) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(data));
}

export function markLessonComplete(sectionId, moduleId, lessonId) {
  const p = getProgress();
  if (!p.sections[sectionId]) p.sections[sectionId] = {};
  if (!p.sections[sectionId][moduleId]) p.sections[sectionId][moduleId] = [];
  if (!p.sections[sectionId][moduleId].includes(lessonId)) {
    p.sections[sectionId][moduleId].push(lessonId);
  }
  saveProgress(p);
}

export function getSectionProgress(sectionId) {
  const p = getProgress();
  return p.sections[sectionId] || {};
}

export function saveQuizScore(quizId, score, total) {
  const p = getProgress();
  if (!p.quizScores) p.quizScores = {};
  p.quizScores[quizId] = { score, total, date: Date.now() };
  saveProgress(p);
}

export function getQuizScore(quizId) {
  const p = getProgress();
  return p.quizScores?.[quizId] || null;
}

export function updateStreak() {
  const p = getProgress();
  const today = new Date().toDateString();
  if (p.lastVisit !== today) {
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    p.streak = (p.lastVisit === yesterday) ? p.streak + 1 : 1;
    p.lastVisit = today;
    saveProgress(p);
  }
  return p.streak;
}

export function getStreak() {
  const p = getProgress();
  return p.streak || 0;
}
