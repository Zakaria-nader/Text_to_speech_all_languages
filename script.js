let allVoices = [];

function loadVoices() {
  return new Promise((resolve) => {
    let voices = speechSynthesis.getVoices();
    if (voices.length !== 0) {
      resolve(voices);
    } else {
      speechSynthesis.onvoiceschanged = () => {
        voices = speechSynthesis.getVoices();
        resolve(voices);
      };
    }
  });
}

function populateLanguages(voices) {
  const languageSelect = document.getElementById('languageSelect');
  const uniqueLanguages = [...new Set(voices.map(voice => voice.lang))].sort();

  uniqueLanguages.forEach(lang => {
    const option = document.createElement('option');
    option.value = lang;
    option.textContent = `${lang}`;
    languageSelect.appendChild(option);
  });
}

function populateVoices(selectedLang) {
  const voiceSelect = document.getElementById('voiceSelect');
  voiceSelect.innerHTML = "";

  const filteredVoices = allVoices.filter(voice => voice.lang === selectedLang);

  filteredVoices.forEach(voice => {
    const option = document.createElement('option');
    option.value = voice.name;
    option.textContent = `${voice.name} (${voice.lang})`;
    voiceSelect.appendChild(option);
  });
}

async function init() {
  allVoices = await loadVoices();
  populateLanguages(allVoices);

  document.getElementById('languageSelect').addEventListener('change', (e) => {
    populateVoices(e.target.value);
  });

  document.getElementById('speakButton').addEventListener('click', () => {
    const text = document.getElementById('text').value;
    const voiceName = document.getElementById('voiceSelect').value;

    if (!text || !voiceName) {
      alert("يرجى إدخال النص واختيار الصوت");
      return;
    }

    // تقسيم النص الطويل
    const parts = splitText(text, 3000); // 3000 حرف لكل جزء
    let index = 0;

    function speakPart() {
      if (index >= parts.length) return;

      const utterance = new SpeechSynthesisUtterance(parts[index]);
      utterance.voice = allVoices.find(v => v.name === voiceName);
      utterance.onend = () => {
        index++;
        speakPart();
      };
      speechSynthesis.speak(utterance);
    }

    speechSynthesis.cancel(); // إيقاف أي تشغيل سابق
    speakPart();
  });

  document.getElementById('stopButton').addEventListener('click', () => {
    speechSynthesis.cancel();
  });
}

function splitText(text, limit) {
  const parts = [];
  for (let i = 0; i < text.length; i += limit) {
    parts.push(text.substring(i, i + limit));
  }
  return parts;
}

init();
