// ============================================
// TTS — Text-to-Speech
// ============================================

let speaking = false;
let currentUtterance = null;

export function speak(text, lang = 'ar') {
  if (!('speechSynthesis' in window)) return;

  stop();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang === 'ar' ? 'ar-SA' : 'fr-FR';
  utterance.rate = 0.9;
  utterance.pitch = 1;

  // Try to find a matching voice
  const voices = speechSynthesis.getVoices();
  const targetLang = lang === 'ar' ? 'ar' : 'fr';
  const voice = voices.find(v => v.lang.startsWith(targetLang));
  if (voice) utterance.voice = voice;

  utterance.onstart = () => { speaking = true; };
  utterance.onend = () => { speaking = false; currentUtterance = null; };
  utterance.onerror = () => { speaking = false; currentUtterance = null; };

  currentUtterance = utterance;
  speechSynthesis.speak(utterance);
}

export function stop() {
  if (speechSynthesis.speaking) {
    speechSynthesis.cancel();
  }
  speaking = false;
  currentUtterance = null;
}

export function isSpeaking() {
  return speaking;
}

// Preload voices
if ('speechSynthesis' in window) {
  speechSynthesis.getVoices();
  speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices();
}
