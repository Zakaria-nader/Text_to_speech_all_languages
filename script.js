const synth = window.speechSynthesis;
const text = document.getElementById('text').value.trim();
if(!text){
  alert("يرجى إدخال نص");
} else {
  synth.cancel(); // إلغاء أي كلام سابق
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ar-SA"; // تأكد من اللغة
  // اختار صوت عربي من الأصوات المتاحة
  const voices = synth.getVoices();
  const arabicVoice = voices.find(v => v.lang.startsWith('ar'));
  if(arabicVoice){
    utterance.voice = arabicVoice;
  }
  synth.speak(utterance);
}
