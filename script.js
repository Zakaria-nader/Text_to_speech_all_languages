let voices = [];

function loadVoices() {
  return new Promise((resolve) => {
    const synth = window.speechSynthesis;
    let id;

    id = setInterval(() => {
      voices = synth.getVoices();
      if (voices.length !== 0) {
        clearInterval(id);
        resolve(voices);
      }
    }, 100);
  });
}

function populateLanguages() {
  const languageSelect = document.getElementById("languageSelect");
  const langs = [...new Set(voices.map(v => v.lang))].sort();

  languageSelect.innerHTML = '<option disabled selected>اختر لغة</option>';

  langs.forEach(lang => {
    const opt = document.createElement("option");
    opt.value = lang;
    opt.textContent = lang;
    languageSelect.appendChild(opt);
  });
}

function populateVoices(lang) {
  const voiceSelect = document.getElementById("voiceSelect");
  const filtered = voices.filter(v => v.lang === lang);
  voiceSelect.innerHTML = "";

  if (filtered.length === 0) {
    voiceSelect.innerHTML = '<option disabled>لا توجد أصوات متاحة لهذه اللغة</option>';
    return;
  }

  filtered.forEach(v => {
    const opt = document.createElement("option");
    opt.value = v.name;
    opt.textContent = `${v.name} (${v.lang})`;
    voiceSelect.appendChild(opt);
  });
}

function splitText(text, maxLength = 3000) {
  const parts = [];
  for (let i = 0; i < text.length; i += maxLength) {
    parts.push(text.slice(i, i + maxLength));
  }
  return parts;
}

function speak(text, voiceName) {
  speechSynthesis.cancel(); // أوقف أي تشغيل سابق

  const chunks = splitText(text, 3000);
  let i = 0;

  function speakNext() {
    if (i >= chunks.length) return;
    const utterance = new SpeechSynthesisUtterance(chunks[i]);
    const voice = voices.find(v => v.name === voiceName);
    if (voice) utterance.voice = voice;
    utterance.onend = () => {
      i++;
      speakNext();
    };
    speechSynthesis.speak(utterance);
  }

  speakNext();
}

document.addEventListener("DOMContentLoaded", async () => {
  voices = await loadVoices();
  populateLanguages();

  document.getElementById("languageSelect").addEventListener("change", (e) => {
    populateVoices(e.target.value);
  });

  document.getElementById("speakButton").addEventListener("click", () => {
    const text = document.getElementById("text").value.trim();
    const voiceName = document.getElementById("voiceSelect").value;
    if (!text) return alert("يرجى إدخال نص!");
    if (!voiceName) return alert("يرجى اختيار صوت!");
    speak(text, voiceName);
  });

  document.getElementById("stopButton").addEventListener("click", () => {
    speechSynthesis.cancel();
  });
});
