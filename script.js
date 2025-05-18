const synth = window.speechSynthesis;
const languageSelect = document.getElementById("language");
const voiceSelect = document.getElementById("voiceSelect");
const speakBtn = document.getElementById("speakBtn");
const textArea = document.getElementById("text");

let voices = [];

function populateLanguages() {
  const langs = [...new Set(voices.map(v => v.lang))];
  langs.forEach(lang => {
    const option = document.createElement("option");
    option.value = lang;
    option.textContent = lang;
    languageSelect.appendChild(option);
  });
}

function populateVoices(selectedLang) {
  voiceSelect.innerHTML = "";
  const filtered = voices.filter(v => v.lang === selectedLang);
  filtered.forEach(voice => {
    const option = document.createElement("option");
    option.value = voice.name;
    option.textContent = `${voice.name} (${voice.gender || 'صوت'})`;
    voiceSelect.appendChild(option);
  });
}

function loadVoices() {
  voices = synth.getVoices();
  if (voices.length > 0) {
    populateLanguages();
    populateVoices(languageSelect.value);
  }
}

languageSelect.addEventListener("change", () => {
  populateVoices(languageSelect.value);
});

speakBtn.addEventListener("click", () => {
  const text = textArea.value.trim();
  const selectedLang = languageSelect.value;
  const selectedVoiceName = voiceSelect.value;

  if (!text) {
    alert("يرجى إدخال نص.");
    return;
  }

  const voice = voices.find(v => v.name === selectedVoiceName);
  if (!voice) {
    alert("يرجى اختيار صوت مناسب.");
    return;
  }

  synth.cancel(); // إلغاء أي صوت سابق

  // تقسيم النص الطويل إلى مقاطع صغيرة
  const chunks = text.match(/.{1,200}/g);
  chunks.forEach((chunk, index) => {
    const utterance = new SpeechSynthesisUtterance(chunk);
    utterance.voice = voice;
    utterance.lang = selectedLang;
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;
    utterance.delay = index * 500; // تأخير لتفادي التقطيع
    synth.speak(utterance);
  });
});

speechSynthesis.onvoiceschanged = () => {
  loadVoices();
};
