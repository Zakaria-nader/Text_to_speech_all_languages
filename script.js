let allVoices = [];

function populateVoiceList() {
  allVoices = speechSynthesis.getVoices();

  const languageSelect = document.getElementById('languageSelect');
  const voiceSelect = document.getElementById('voiceSelect');

  // إزالة الخيارات الحالية
  languageSelect.innerHTML = '<option value="">اختر اللغة</option>';
  voiceSelect.innerHTML = '<option value="">اختر الصوت</option>';

  // الحصول على اللغات الفريدة
  const languages = [...new Set(allVoices.map(voice => voice.lang))];

  // تعبئة قائمة اللغات
  languages.forEach(lang => {
    const option = document.createElement('option');
    option.value = lang;
    option.textContent = lang;
    languageSelect.appendChild(option);
  });

  // عند تغيير اللغة، تحديث قائمة الأصوات
  languageSelect.addEventListener('change', () => {
    const selectedLang = languageSelect.value;
    const filteredVoices = allVoices.filter(voice => voice.lang === selectedLang);

    // إزالة الخيارات الحالية
    voiceSelect.innerHTML = '<option value="">اختر الصوت</option>';

    // تعبئة قائمة الأصوات
    filteredVoices.forEach(voice => {
      const option = document.createElement('option');
      option.value = voice.name;
      option.textContent = `${voice.name} (${voice.lang})`;
      voiceSelect.appendChild(option);
    });
  });
}

function speak() {
  const text = document.getElementById('text').value;
  const voiceName = document.getElementById('voiceSelect').value;

  if (!text) {
    alert("من فضلك أدخل نصًا.");
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  const selectedVoice = allVoices.find(voice => voice.name === voiceName);
  if (selectedVoice) {
    utterance.voice = selectedVoice;
  }

  speechSynthesis.speak(utterance);
}

// تحميل الأصوات عند توفرها
speechSynthesis.addEventListener('voiceschanged', populateVoiceList);

// التأكد من تحميل الأصوات بعد تفاعل المستخدم
document.getElementById('speakButton').addEventListener('click', () => {
  if (allVoices.length === 0) {
    populateVoiceList();
  }
  speak();
});
