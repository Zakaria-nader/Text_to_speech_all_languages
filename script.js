const apiKey = "516a925086094d7bb2f263deab708cbb";
const convertBtn = document.getElementById("convertBtn");
const audioPlayer = document.getElementById("audioPlayer");
const downloadLink = document.getElementById("downloadLink");
const languageSelect = document.getElementById("language");

const languages = {
  "ar-sa": "العربية (السعودية)",
  "en-us": "الإنجليزية (أمريكا)",
  "en-gb": "الإنجليزية (بريطانيا)",
  "fr-fr": "الفرنسية (فرنسا)",
  "de-de": "الألمانية (ألمانيا)",
  "it-it": "الإيطالية (إيطاليا)",
  "es-es": "الإسبانية (إسبانيا)",
  "ru-ru": "الروسية (روسيا)",
  "zh-cn": "الصينية (الصين)",
  "ja-jp": "اليابانية (اليابان)",
  "tr-tr": "التركية (تركيا)"
};

// تعبئة قائمة اللغات
for (const [code, name] of Object.entries(languages)) {
  const option = document.createElement("option");
  option.value = code;
  option.textContent = name;
  languageSelect.appendChild(option);
}

convertBtn.addEventListener("click", () => {
  const text = document.getElementById("text").value.trim();
  const language = languageSelect.value;

  if (!text) {
    alert("يرجى إدخال نص.");
    return;
  }

  const url = `https://api.voicerss.org/?key=${apiKey}&hl=${language}&src=${encodeURIComponent(text)}&c=MP3&f=48khz_16bit_stereo&r=0`;

  fetch(url)
    .then(response => response.blob())
    .then(blob => {
      const audioURL = URL.createObjectURL(blob);
      audioPlayer.src = audioURL;
      audioPlayer.style.display = "block";
      downloadLink.href = audioURL;
      downloadLink.style.display = "inline-block";
    })
    .catch(err => {
      console.error(err);
      alert("حدث خطأ أثناء تحويل النص إلى صوت.");
    });
});
