// Init
const socket = io();
const chat = document.getElementById('chat');
const nickname = document.getElementById('nickname');
const message = document.getElementById('message');
const messages = document.getElementById('messages');


// Cookie
function getCookie(name) {
  const cookies = decodeURIComponent(document.cookie).split(';');
  for(let i = 0; i < cookies.length; ++i) {
    let cookie = cookies[i].split('=');
    if(cookie[0] == name)
      return cookie[1];
  }
}

function setCookie(name, value, expireMillisecond = 7*24*60*60*1000) {
  const date = new Date();
  date.setTime(date.getTime() + expireMillisecond);
  let expires = "expires="+ date.toUTCString();
  document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

// Nickname
let name = getCookie('nickname');
if(name !== undefined) nickname.value = name;
nickname.addEventListener("change", (event) => {setCookie('nickname', nickname.value)});


// Video player
document.getElementById('video').addEventListener('click', (event) => event.preventDefault() )
if (mpegts.getFeatureList().mseLivePlayback) {
  let player = mpegts.createPlayer({
    type: 'flv',
    isLive: true,
    url: '//hex137.top:8119/live/livestream.flv',
    enableStashBuffer: false,
    liveBufferLatencyChasing: true
  });
  player.attachMediaElement(document.getElementById('video'));
  player.load();
  player.play();
}


// Socket
// Emit chatMessage
chat.addEventListener('submit', (event) => {
  event.preventDefault();
  if (message.value) {
    const timestamp = Date.now();
    const name = nickname.value;
    const content = message.value;
    const messagePayload = {timestamp, name, content};
    socket.emit('chatMessage', messagePayload);
    message.value = '';
  }
});

// On chatMessage
socket.on('chatMessage', (messagePayload) => {
  const item = document.createElement('li');
  const time = new Date(messagePayload.timestamp);
  item.textContent = "[" + time.toTimeString().split(' ')[0] + "] " + messagePayload.name + ": " + messagePayload.content;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});
