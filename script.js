function speak() {
  const text = document.getElementById('text').value;
  const voiceName = document.getElementById('voiceSelect').value;

  if (!text) {
    alert("من فضلك أدخل نصًا أولاً.");
    return;
  }

  const utterances = splitText(text).map(chunk => {
    const utter = new SpeechSynthesisUtterance(chunk);
    const selectedVoice = speechSynthesis.getVoices().find(v => v.name === voiceName);
    if (selectedVoice) utter.voice = selectedVoice;
    return utter;
  });

  utterances.forEach(utter => speechSynthesis.speak(utter));
}

// تقسيم النص الطويل إلى جُمل قصيرة
function splitText(text) {
  return text.match(/[^.!?،؛\n]+[.!?،؛\n]?/g) || [];
}

// تحميل الأصوات المتوفرة تلقائيًا عند جاهزية المتصفح
window.speechSynthesis.onvoiceschanged = () => {
  const voiceSelect = document.getElementById('voiceSelect');
  const voices = speechSynthesis.getVoices();
  voiceSelect.innerHTML = '';

  voices.slice(0, 10).forEach(voice => {
    const option = document.createElement('option');
    option.value = voice.name;
    option.textContent = `${voice.name} (${voice.lang})`;
    voiceSelect.appendChild(option);
  });
};
