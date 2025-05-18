const synth = window.speechSynthesis;
const languageSelect = document.getElementById("language");
const voiceSelect = document.getElementById("voiceSelect");
const speakBtn = document.getElementById("speakBtn");
const textArea = document.getElementById("text");

let voices = [];

function populateLanguages() {
  const langs = [...new Set(voices.map(v => v.lang))];
  languageSelect.innerHTML = "";
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
    option.textContent = voice.name;
    voiceSelect.appendChild(option);
  });
}

function loadVoices() {
  voices = synth.getVoices();
  if (voices.length > 0) {
    populateLanguages();
    if(languageSelect.options.length > 0){
      populateVoices(languageSelect.value);
    }
  }
}

languageSelect.addEventListener("change", () => {
  populateVoices(languageSelect.value);
});

function speakChunks(chunks, voice, lang, index=0) {
  if(index >= chunks.length) return;

  const utterance = new SpeechSynthesisUtterance(chunks[index]);
  utterance.voice = voice;
  utterance.lang = lang;
  utterance.rate = 1;
  utterance.pitch = 1;
  utterance.volume = 1;

  utterance.onend = () => {
    speakChunks(chunks, voice, lang, index + 1);
  };

  utterance.onerror = (e) => {
    alert("حدث خطأ أثناء تحويل النص إلى صوت: " + e.error);
  };

  synth.speak(utterance);
}

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

  synth.cancel();

  // تقسيم النص إلى قطع صغيرة (200 حرف)
  const chunks = text.match(/.{1,200}/g);
  speakChunks(chunks, voice, selectedLang);
});

speechSynthesis.onvoiceschanged = () => {
  loadVoices();
};
