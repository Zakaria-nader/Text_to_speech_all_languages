function speak() {
  const text = document.getElementById('text').value;
  const lang = document.getElementById('language').value;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;

  speechSynthesis.speak(utterance);
}