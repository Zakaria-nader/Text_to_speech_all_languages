let allVoices = [];

function loadVoices() {
  allVoices = speechSynthesis.getVoices();

  const languageSelect = document.getElementById('languageSelect');
  const voiceSelect = document.getElementById('voiceSelect');

  // إزالة التكرار
  const langs = [...new Set(allVoices.map(voice => voice.lang))];
  languageSelect.innerHTML = '<option value="">اختر اللغة</option>';
  langs.forEach(lang => {
    const option = document.createElement('option');
    option.value = lang;
    option.textContent = lang;
    languageSelect.appendChild(option);
  });

  // تحديث قائمة الأصوات حسب اللغة المختارة
  languageSelect.onchange = () => {
    const selectedLang = languageSelect.value;
    const filteredVoices = allVoices.filter(v => v.lang === selectedLang);
    
    voiceSelect.innerHTML = '<option value="">اختر الصوت</option>';
    filteredVoices.forEach(voice => {
      const option = document.createElement('option');
      option.value = voice.name;
      option.textContent = `${voice.name} (${voice.lang}) - ${voice.gender || ''}`;
      voiceSelect.appendChild(option);
    });
  };
}

function speak() {
  const text = document.getElementById('text').value;
  const voiceName = document.getElementById('voiceSelect').value;

  if (!text) {
    alert("من فضلك أدخل نصًا.");
    return;
  }

  const voice = allVoices.find(v => v.name === voiceName);
  const utterances = splitText(text).map(chunk => {
    const utter = new SpeechSynthesisUtterance(chunk);
    if (voice) utter.voice = voice;
    return utter;
  });

  utterances.forEach(utter => speechSynthesis.speak(utter));
}

// تقسيم النص الطويل إلى جمل قصيرة
function splitText(text) {
  return text.match(/[^.!?،؛\n]+[.!?،؛\n]?/g) || [text];
}

// تحميل الأصوات بعد تفاعل المستخدم (إجباري لبعض المتصفحات)
function initSpeech() {
  speechSynthesis.cancel();
  loadVoices();
}

// الاستجابة لتغيّر الأصوات
window.speechSynthesis.onvoiceschanged = loadVoices;

// تأكيد التحميل بعد التفاعل الأول
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    speechSynthesis.getVoices(); // تحفيز تحميل الأصوات
    loadVoices();
  }, 100);
});
