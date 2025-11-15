
// ----------------- Toast system (unchanged) -----------------
document.addEventListener("DOMContentLoaded", function () {
  const storage = document.getElementById("storage_container");

  if (storage) {
    const toastEl = document.getElementById("chatToast");
    const toastBody = document.getElementById("toastMessage");
    if (toastEl && toastBody) {
      toastBody.innerText = "Chat is cleared!";
      const toast = new bootstrap.Toast(toastEl, { delay: 3000 }); 
      toast.show();
    }

    let scrolled = false;

    try {
      storage.scrollIntoView({ behavior: "smooth" });
      scrolled = true;
    } catch (e) {
      scrolled = false;
    }
  }
});



//   / // / /  / / / / / / / / / / / / / / /


const sendBtn = document.getElementById("send-btn");
const micBtn = document.getElementById("mic-btn");
const ttsToggle = document.getElementById("tts-toggle");
const input = document.getElementById("user-input");
const chatBox = document.getElementById("chat-box");
const languageSelect = document.getElementById("language");
const toastEl = document.getElementById("chatToast");
const toastBody = document.getElementById("toastMessage");
const voiceInfo = document.getElementById("voice-info");

let recognizing = false;
let recognition;
let speechEnabled = true;
let voices = [];

// ----------------- Toast helper -----------------
function showToast(msg) {
  if (!toastEl || !toastBody) return;
  toastBody.innerText = msg;
  const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
  toast.show();
}

// ----------------- Load and manage voices -----------------
function loadVoices() {
  voices = speechSynthesis.getVoices() || [];
  updateVoiceInfo();
}
if (typeof speechSynthesis !== "undefined") {
  // browsers may fire voiceschanged asynchronously
  speechSynthesis.onvoiceschanged = loadVoices;
  loadVoices();
}

// prefer voice matching language code; returns a voice or null
function findVoiceForLang(lang) {
  if (!voices || voices.length === 0) return null;

  const target = lang.toLowerCase(); // e.g., "mr-in"
  // exact / prefix match first
  let v = voices.find(vv => vv.lang && vv.lang.toLowerCase().startsWith(target));
  if (v) return v;

  // match by primary code (mr, hi, en)
  const primary = target.split("-")[0];
  v = voices.find(vv => vv.lang && vv.lang.toLowerCase().startsWith(primary));
  if (v) return v;

  // try by name containing language name (e.g., "Marathi")
  v = voices.find(vv => /marathi/i.test(vv.name) && primary === "mr");
  if (v) return v;

  // no direct match
  return null;
}

// Update voice info label
function updateVoiceInfo() {
  const lang = languageSelect.value;
  let v = findVoiceForLang(lang);
  if (v) {
    voiceInfo.textContent = `Voice: ${v.name} (${v.lang})`;
  } else {
    voiceInfo.textContent = `Voice: not available for ${lang}. will fallback`;
  }
}

// ----------------- TTS speak with fallback logic -----------------
function speak(text) {
  if (!speechEnabled) return;

  if (typeof speechSynthesis === "undefined") {
    // no TTS support
    return;
  }

  const requestedLang = languageSelect.value;
  let voice = findVoiceForLang(requestedLang);
  let usedFallback = false;
  let fallbackName = null;

  if (!voice) {
    const fallbackOrder = ["hi-IN", "en-IN", "en-US", "en-GB"];
    for (let fb of fallbackOrder) {
      voice = findVoiceForLang(fb);
      if (voice) { usedFallback = true; fallbackName = voice.name; break; }
    }
    if (!voice && voices.length > 0) {
      voice = voices[0];
      usedFallback = true;
      fallbackName = voice.name;
    }
  }

  const utter = new SpeechSynthesisUtterance(text);
  if (voice) utter.voice = voice;
  utter.lang = (voice && voice.lang) ? voice.lang : requestedLang;

  speechSynthesis.speak(utter);

  if (usedFallback && fallbackName) {
    showToast(`Selected language voice not found. Using fallback voice: ${fallbackName}`);
    updateVoiceInfo();
  }
}

// ----------------- Append messages to chat box -----------------
function appendMessage(type, text) {
  const div = document.createElement("div");
  div.className = `message ${type === "user" ? "user-message" : "bot-message"}`;
  div.textContent = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;

  if (type === "bot") {
    speak(text);
  }
}

// ----------------- Send message to server -----------------



function sendMessage() {
  const message = input.value.trim();
  if (!message) return;
  appendMessage("user", message);
  input.value = "";

  const chatWrapper = document.querySelector(".chat-wrapper");
  const userId = chatWrapper.dataset.userId;

  fetch("/get_response", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    
    body: JSON.stringify({
      message: message,
      lang: languageSelect.value,
      user_id: userId, 
    }),
  })
    .then((res) => res.json())
    .then((data) => appendMessage("bot", data.reply))
    .catch(() => appendMessage("bot", "⚠️ Error connecting to server."));
}
//  -------------------------------------------------------

sendBtn.addEventListener("click", sendMessage);
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

// ----------------- Voice input (SpeechRecognition) -----------------
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onstart = () => {
    recognizing = true;
    micBtn.textContent = "🔴";
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    input.value = transcript;
    // auto-send
    sendMessage();
  };

  recognition.onerror = (e) => {
    console.error("Speech recognition error:", e);
    showToast("Speech recognition error. Try again.");
  };

  recognition.onend = () => {
    recognizing = false;
    micBtn.textContent = "🎙️";
  };

  micBtn.addEventListener("click", () => {
    try {
      if (!recognizing) {
        recognition.lang = languageSelect.value;
        recognition.start();
      } else {
        recognition.stop();
      }
    } catch (err) {
      console.error(err);
      showToast("Voice recognition not available.");
    }
  });
} else {
  
  micBtn.disabled = true;
  micBtn.title = "Speech recognition not supported in this browser.";
}

// ----------------- TTS toggle / stop -----------------
ttsToggle.addEventListener("click", () => {
  speechEnabled = !speechEnabled;
  if (!speechEnabled) {
    ttsToggle.textContent = "🔈 Off";
    if (typeof speechSynthesis !== "undefined") speechSynthesis.cancel();
    showToast("TTS turned off");
  } else {
    ttsToggle.textContent = "🔊 On";
    showToast("TTS turned on");
  }
});

// update voice info when language changes
languageSelect.addEventListener("change", () => {
  updateVoiceInfo();
});

// init voice info on load
document.addEventListener("DOMContentLoaded", () => {
  // existing toast logic from your old code (show cleared chat)
  const storage = document.getElementById("storage_container");
  if (storage) {
    if (toastEl && toastBody) {
      toastBody.innerText = "Chat is cleared!";
      const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
      toast.show();
    }
    try {
      storage.scrollIntoView({ behavior: "smooth" });
    } catch (e) { /* ignore */ }
  }

  
  setTimeout(loadVoices, 200);
  updateVoiceInfo();
});
