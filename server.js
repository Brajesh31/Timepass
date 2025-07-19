// voiceWebsiteController.js

let recognition = null;
let isListening = false;
const synth = window.speechSynthesis;

const websites = {
  youtube: 'https://www.youtube.com',
  local: 'http://localhost:5173',
  facebook: 'https://www.facebook.com',
  instagram: 'https://www.instagram.com',
  twitter: 'https://www.twitter.com',
  x: 'https://www.x.com',
  linkedin: 'https://www.linkedin.com',
  snapchat: 'https://www.snapchat.com',
  tiktok: 'https://www.tiktok.com',
  reddit: 'https://www.reddit.com',
  discord: 'https://www.discord.com',
  pinterest: 'https://www.pinterest.com',
  tumblr: 'https://www.tumblr.com',
  google: 'https://www.google.com',
  bing: 'https://www.bing.com',
  yahoo: 'https://www.yahoo.com',
  duckduckgo: 'https://www.duckduckgo.com',
  amazon: 'https://www.amazon.com',
  flipkart: 'https://www.flipkart.com',
  myntra: 'https://www.myntra.com',
  ebay: 'https://www.ebay.com',
  alibaba: 'https://www.alibaba.com',
  walmart: 'https://www.walmart.com',
  netflix: 'https://www.netflix.com',
  hotstar: 'https://www.hotstar.com',
  'prime video': 'https://www.primevideo.com',
  'disney plus': 'https://www.disneyplus.com',
  hulu: 'https://www.hulu.com',
  spotify: 'https://www.spotify.com',
  'apple music': 'https://music.apple.com',
  soundcloud: 'https://www.soundcloud.com',
  twitch: 'https://www.twitch.tv',
  whatsapp: 'https://web.whatsapp.com',
  telegram: 'https://web.telegram.org',
  gmail: 'https://www.gmail.com',
  outlook: 'https://www.outlook.com',
  slack: 'https://www.slack.com',
  zoom: 'https://www.zoom.us',
  teams: 'https://www.microsoft.com/teams',
  skype: 'https://www.skype.com',
  github: 'https://www.github.com',
  gitlab: 'https://www.gitlab.com',
  stackoverflow: 'https://stackoverflow.com',
  codepen: 'https://www.codepen.io',
  replit: 'https://www.replit.com',
  vscode: 'https://vscode.dev',
  jsfiddle: 'https://www.jsfiddle.net',
  bbc: 'https://www.bbc.com',
  cnn: 'https://www.cnn.com',
  'times of india': 'https://www.timesofindia.com',
  ndtv: 'https://www.ndtv.com',
  reuters: 'https://www.reuters.com',
  guardian: 'https://www.theguardian.com',
  'new york times': 'https://www.nytimes.com',
  coursera: 'https://www.coursera.org',
  udemy: 'https://www.udemy.com',
  'khan academy': 'https://www.khanacademy.org',
  wikipedia: 'https://www.wikipedia.org',
  duolingo: 'https://www.duolingo.com',
  edx: 'https://www.edx.org',
  canva: 'https://www.canva.com',
  figma: 'https://www.figma.com',
  notion: 'https://www.notion.so',
  trello: 'https://www.trello.com',
  dropbox: 'https://www.dropbox.com',
  'google drive': 'https://drive.google.com',
  onedrive: 'https://onedrive.live.com',
  paypal: 'https://www.paypal.com',
  stripe: 'https://www.stripe.com',
  coinbase: 'https://www.coinbase.com',
  'uber eats': 'https://www.ubereats.com',
  doordash: 'https://www.doordash.com',
  grubhub: 'https://www.grubhub.com',
  zomato: 'https://www.zomato.com',
  swiggy: 'https://www.swiggy.com',
  booking: 'https://www.booking.com',
  airbnb: 'https://www.airbnb.com',
  expedia: 'https://www.expedia.com',
  uber: 'https://www.uber.com',
  quora: 'https://www.quora.com',
  medium: 'https://www.medium.com',
  pornhub: 'https://www.pornhub.com',
  xvideos: 'https://www.xvideos.com',
};

function speak(text) {
  synth.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.9;
  utterance.pitch = 0.8;
  utterance.volume = 0.8;

  const voices = synth.getVoices();
  utterance.voice =
    voices.find(voice =>
      /Male|David|Mark|Google UK English Male/.test(voice.name)
    ) || voices[0];

  synth.speak(utterance);
}

function checkBrowserSupport() {
  if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
    document.getElementById('output').innerHTML = `
      <div style="color: #ff6b6b;">
        Speech recognition not supported.<br>Please use Chrome or Edge.
      </div>`;
    speak('Speech recognition not supported. Please use Chrome or Edge browser.');
    return false;
  }
  return true;
}

function initializeDNS() {
  if (!checkBrowserSupport()) return false;

  recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'en-US';

  recognition.onstart = () => {
    isListening = true;
    document.getElementById('status').textContent = 'Listening';
    document.getElementById('output').innerHTML = '<div style="color: #00ff00;">Speak a website name</div>';
  };

  recognition.onresult = (event) => {
    let final = '';
    let interim = '';

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      event.results[i].isFinal ? final += transcript : interim += transcript;
    }

    const spoken = final || interim;
    document.getElementById('output').innerHTML = `<div>Heard: "${spoken}"</div>`;

    if (final) processWebsiteCommand(final.toLowerCase().trim());
  };

  recognition.onerror = (event) => {
    speak(`Error: ${event.error}`);
    document.getElementById('output').innerHTML = `<div style="color: red;">Error: ${event.error}</div>`;
    if (isListening) setTimeout(() => recognition.start(), 2000);
  };

  recognition.onend = () => {
    if (isListening) setTimeout(() => recognition.start(), 1000);
  };

  return true;
}

function activateDNS() {
  if (!recognition && !initializeDNS()) return;

  speak('Voice control activated. Speak any website name.');
  try {
    recognition.start();
  } catch (e) {
    console.error(e);
  }
}

function deactivateDNS() {
  if (recognition) recognition.stop();
  isListening = false;
  speak('Voice control deactivated.');
  document.getElementById('status').textContent = 'Standby';
  document.getElementById('output').innerHTML = 'Voice system is off.';
}

function processWebsiteCommand(command) {
  const cleaned = command.replace(/(open|go to|visit|launch|please|can you|would you|show me)/gi, '').trim();

  for (const [key, url] of Object.entries(websites)) {
    if (cleaned === key || cleaned.includes(key)) {
      speak(`Opening ${key}`);
      window.open(url, '_blank');
      document.getElementById('output').innerHTML = `Opening ${key.toUpperCase()}...`;
      return;
    }
  }

  speak("Sorry, I didn't recognize that website.");
  document.getElementById('output').innerHTML = `Website not found: "${command}"`;
}
