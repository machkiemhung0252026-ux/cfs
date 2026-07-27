// ---------- day/night palette tự động theo giờ ----------
const hour = new Date().getHours();
if(hour >= 6 && hour < 17){
  document.body.classList.add('daytime');
}

// ---------- dark mode toggle ----------
const darkModeBtn = document.getElementById('darkModeBtn');
let isDarkMode = false;
darkModeBtn.addEventListener('click', () => {
  isDarkMode = !isDarkMode;
  document.body.classList.toggle('dark-mode', isDarkMode);
  darkModeBtn.textContent = isDarkMode ? '☀' : '🌙';
});

// ---------- chia sẻ link trang ----------
const shareBtn = document.getElementById('shareBtn');
const copiedBadge = document.getElementById('copiedBadge');
shareBtn.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(window.location.href);
  } catch (err) {
    const temp = document.createElement('input');
    temp.value = window.location.href;
    document.body.appendChild(temp);
    temp.select();
    document.execCommand('copy');
    document.body.removeChild(temp);
  }
  copiedBadge.classList.add('show');
  setTimeout(() => copiedBadge.classList.remove('show'), 2000);
});

// ---------- ambient sky ----------
const sky = document.getElementById('sky');
const MOTE_COUNT = 14;
for(let i=0;i<MOTE_COUNT;i++){
  const m = document.createElement('div');
  m.className = 'mote';
  const size = 6 + Math.random()*16;
  m.style.width = size+'px';
  m.style.height = size+'px';
  m.style.left = (Math.random()*100)+'%';
  m.style.setProperty('--drift', (Math.random()*80-40)+'px');
  m.style.animationDuration = (10 + Math.random()*10)+'s';
  m.style.animationDelay = (Math.random()*14)+'s';
  sky.appendChild(m);
}

const GLINT_COUNT = 16;
for(let i=0;i<GLINT_COUNT;i++){
  const g = document.createElement('div');
  g.className = 'glint';
  const size = 3 + Math.random()*5;
  g.style.width = size+'px';
  g.style.height = size+'px';
  g.style.left = (Math.random()*100)+'%';
  g.style.top = (Math.random()*70)+'%';
  g.style.animationDuration = (2 + Math.random()*3)+'s';
  g.style.animationDelay = (Math.random()*5)+'s';
  sky.appendChild(g);
}

// ---------- tin nhắn khích lệ ----------
const encourageToast = document.getElementById('encourageToast');
const ENCOURAGE_MESSAGES = [
  "Một điều nhỏ bạn giữ trong lòng, có thể là điều ai đó cũng đang mong được nói ra",
  "Không sao nếu chưa sẵn sàng nói với ai — ở đây luôn lắng nghe",
  "Chia sẻ không làm bạn yếu đuối hơn, mà nhẹ lòng hơn",
  "Có những câu chuyện chỉ cần một người đọc thấy là đủ ấm",
  "Hôm nay, hãy để một điều bạn giấu được thấy ánh nắng",
  "Bạn không cần phải mạnh mẽ mọi lúc — cứ viết ra đây",
  "Mỗi lời tâm sự đều xứng đáng được lắng nghe, kể cả của bạn"
];
let encourageIndex = 0;

function showEncourageMessage(){
  encourageToast.textContent = ENCOURAGE_MESSAGES[encourageIndex];
  encourageToast.classList.add('show');
  encourageIndex = (encourageIndex + 1) % ENCOURAGE_MESSAGES.length;

  setTimeout(() => {
    encourageToast.classList.remove('show');
  }, 6500);
}

setTimeout(() => {
  showEncourageMessage();
  setInterval(showEncourageMessage, 22000);
}, 4000);

// ---------- captcha đếm mặt trời ----------
const captchaSuns = document.getElementById('captchaSuns');
const captchaInput = document.getElementById('captchaInput');
const captchaRefresh = document.getElementById('captchaRefresh');
const DECOY_EMOJIS = ['☁','⭐','🌙'];
let sunAnswer = 0;

function generateCaptcha(){
  sunAnswer = 3 + Math.floor(Math.random()*5);
  const totalIcons = sunAnswer + 1 + Math.floor(Math.random()*3);
  let icons = [];
  for(let i=0;i<sunAnswer;i++) icons.push('☀');
  while(icons.length < totalIcons){
    icons.push(DECOY_EMOJIS[Math.floor(Math.random()*DECOY_EMOJIS.length)]);
  }
  for(let i=icons.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [icons[i], icons[j]] = [icons[j], icons[i]];
  }
  captchaSuns.textContent = icons.join(' ');
  captchaInput.value = "";
}
generateCaptcha();
captchaRefresh.addEventListener('click', generateCaptcha);

const websiteHoneypot = document.getElementById('website');

// ---------- banner ảnh trường ----------
const schoolBannerImg = document.getElementById('schoolBannerImg');
const schoolBanner = document.getElementById('schoolBanner');
const SCHOOL_BANNER_URL = "school-banner.jpg";
schoolBannerImg.src = SCHOOL_BANNER_URL;
schoolBannerImg.addEventListener('error', () => {
  schoolBanner.innerHTML = '<div class="banner-placeholder">Thêm ảnh trường bạn vào đây — đổi SCHOOL_BANNER_URL trong script.js</div>';
});

// ---------- DANH SÁCH BÀI HÁT (PLAYLIST 3 BÀI) ----------
const PLAYLIST = [
  {
    title: "Ánh Nắng Lặng Lẽ",
    artist: "Confession Ambient",
    src: "music.mp3",
    cover: ""
  },
  {
    title: "Sóng Biển Rì Rào",
    artist: "Chill Lofi",
    src: "music2.mp3",
    cover: ""
  },
  {
    title: "Gió Thoảng Chiều Nắng",
    artist: "Acoustic Piano",
    src: "music3.mp3",
    cover: ""
  }
];

let currentTrackIndex = 0;
let isPlaying = false;

const bgMusic = document.getElementById('bgMusic');
const musicBtn = document.getElementById('musicBtn');
const playerModal = document.getElementById('playerModal');
const playerClose = document.getElementById('playerClose');
const playPauseBtn = document.getElementById('playPauseBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const progressBar = document.getElementById('progressBar');
const progressFill = document.getElementById('progressFill');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const volumeSlider = document.getElementById('volumeSlider');
const playerTitle = document.getElementById('playerTitle');
const playerArtist = document.getElementById('playerArtist');
const albumArt = document.getElementById('albumArt');

bgMusic.volume = 0.7;

// Hàm nạp bài hát
function loadTrack(index) {
  const track = PLAYLIST[index];
  bgMusic.src = track.src;
  playerTitle.textContent = track.title;
  playerArtist.textContent = track.artist;
  
  if (track.cover) {
    albumArt.innerHTML = `<img src="${track.cover}" alt="Cover" />`;
  } else {
    albumArt.innerHTML = `<span>🎵</span>`;
  }
  
  progressFill.style.width = '0%';
  currentTimeEl.textContent = '0:00';
}

// Khởi tạo bài hát đầu tiên
loadTrack(currentTrackIndex);

// Mở Player Modal
musicBtn.addEventListener('click', () => {
  playerModal.classList.add('open');
});

// Đóng Player khi bấm nút X
playerClose.addEventListener('click', () => {
  playerModal.classList.remove('open');
});

// Đóng Player khi bấm ra ngoài card
playerModal.addEventListener('click', (e) => {
  if(e.target === playerModal){
    playerModal.classList.remove('open');
  }
});

// Đóng Player khi bấm phím ESC
document.addEventListener('keydown', (e) => {
  if(e.key === 'Escape' && playerModal.classList.contains('open')){
    playerModal.classList.remove('open');
  }
});

// Bật / Tạm dừng
playPauseBtn.addEventListener('click', () => {
  if(isPlaying){
    bgMusic.pause();
    playPauseBtn.textContent = "▶";
  } else {
    bgMusic.play().then(() => {
      playPauseBtn.textContent = "⏸";
    }).catch(() => {
      showStatus("Không tìm thấy file nhạc — hãy kiểm tra lại file .mp3 trong thư mục web.", false);
    });
  }
  isPlaying = !isPlaying;
});

// Chuyển bài trước
prevBtn.addEventListener('click', () => {
  currentTrackIndex = (currentTrackIndex - 1 + PLAYLIST.length) % PLAYLIST.length;
  loadTrack(currentTrackIndex);
  if (isPlaying) {
    bgMusic.play();
    playPauseBtn.textContent = "⏸";
  }
});

// Chuyển bài kế tiếp
nextBtn.addEventListener('click', () => {
  currentTrackIndex = (currentTrackIndex + 1) % PLAYLIST.length;
  loadTrack(currentTrackIndex);
  if (isPlaying) {
    bgMusic.play();
    playPauseBtn.textContent = "⏸";
  }
});

// Tự động phát bài tiếp theo khi hết bài
bgMusic.addEventListener('ended', () => {
  currentTrackIndex = (currentTrackIndex + 1) % PLAYLIST.length;
  loadTrack(currentTrackIndex);
  bgMusic.play();
});

// Điều chỉnh âm lượng
volumeSlider.addEventListener('input', (e) => {
  bgMusic.volume = e.target.value / 100;
});

// Cập nhật tiến trình phát nhạc
bgMusic.addEventListener('timeupdate', () => {
  if(bgMusic.duration){
    const percent = (bgMusic.currentTime / bgMusic.duration) * 100;
    progressFill.style.width = percent + '%';
    currentTimeEl.textContent = formatTime(bgMusic.currentTime);
  }
});

bgMusic.addEventListener('loadedmetadata', () => {
  durationEl.textContent = formatTime(bgMusic.duration);
});

progressBar.addEventListener('click', (e) => {
  const rect = progressBar.getBoundingClientRect();
  const percent = (e.clientX - rect.left) / rect.width;
  if (bgMusic.duration) {
    bgMusic.currentTime = percent * bgMusic.duration;
  }
});

function formatTime(seconds){
  if(isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return m + ":" + (s < 10 ? "0" : "") + s;
}

// ---------- FORM LOGIC ----------
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwjLtjfMieZL4LGK5yoWzHACjY3A3KygXaeRqJmH9PZbcXGXEDOX2KzKT0E4D9GeaS9Bw/exec";

const categorySelect = document.getElementById('categorySelect');
const contentEl = document.getElementById('content');
const imageInput = document.getElementById('imageInput');
const preview = document.getElementById('preview');
const polaroid = document.getElementById('polaroid');
const fileLabelText = document.getElementById('fileLabelText');
const submitBtn = document.getElementById('submitBtn');
const submitBtnText = document.getElementById('submitBtnText');
const statusEl = document.getElementById('status');
const card = document.getElementById('card');
const formView = document.getElementById('formView');
const successView = document.getElementById('successView');
const againBtn = document.getElementById('againBtn');
const charCounter = document.getElementById('charCounter');

let imageBase64 = "";
let imageMime = "";
const MAX_CHARS = 3000;

let typingTimeout;
contentEl.addEventListener('input', () => {
  const len = contentEl.value.length;
  charCounter.textContent = len + "/" + MAX_CHARS;
  charCounter.classList.toggle('near-limit', len > MAX_CHARS * 0.9);

  contentEl.classList.add('typing-glow');
  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => {
    contentEl.classList.remove('typing-glow');
  }, 500);
});

imageInput.addEventListener('change', () => {
  const file = imageInput.files[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) {
    showStatus("Ảnh quá lớn (tối đa 5MB).", false);
    imageInput.value = "";
    return;
  }
  imageMime = file.type;
  fileLabelText.textContent = file.name;
  const reader = new FileReader();
  reader.onload = (e) => {
    imageBase64 = e.target.result.split(',')[1];
    preview.src = e.target.result;
    polaroid.style.display = 'block';
  };
  reader.readAsDataURL(file);
});

submitBtn.addEventListener('click', async () => {
  const content = contentEl.value.trim();
  const category = categorySelect.value;

  if (websiteHoneypot.value.trim() !== "") {
    showStatus("Có lỗi xảy ra, vui lòng thử lại.", false);
    return;
  }

  if (!content) {
    showStatus("Bạn chưa viết nội dung confession.", false);
    return;
  }

  const userAnswer = parseInt(captchaInput.value, 10);
  if (isNaN(userAnswer) || userAnswer !== sunAnswer) {
    showStatus("Đếm lại số mặt trời ☀ giúp mình nhé.", false);
    generateCaptcha();
    return;
  }

    if (!SCRIPT_URL || SCRIPT_URL === "" || SCRIPT_URL.includes("YOUR_SCRIPT_URL_HERE")) {
    showStatus("Chưa cấu hình SCRIPT_URL trong file script.js.", false);
    return;
    }

  submitBtn.disabled = true;
  submitBtnText.innerHTML = 'Đang gửi <span class="btn-dots"><span></span><span></span><span></span></span>';
  showStatus("", true);

  try {
    const res = await fetch(SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify({
        category: category,
        content: content,
        imageBase64: imageBase64,
        imageMime: imageMime
      }),
      headers: { "Content-Type": "text/plain;charset=utf-8" }
    });
    const data = await res.json();
    if (data.success) {
      card.classList.add('sending');
      setTimeout(() => {
        formView.style.display = 'none';
        successView.style.display = 'block';
        card.classList.remove('sending');
        card.style.transform = 'none';
        card.style.opacity = '1';
        contentEl.value = "";
        imageInput.value = "";
        imageBase64 = "";
        polaroid.style.display = 'none';
        fileLabelText.textContent = "Đính kèm hình ảnh (không bắt buộc)";
        statusEl.textContent = "";
        charCounter.textContent = "0/" + MAX_CHARS;
        charCounter.classList.remove('near-limit');
        generateCaptcha();
      }, 550);
    } else {
      showStatus("Có lỗi xảy ra: " + (data.error || "không rõ nguyên nhân"), false);
      card.classList.add('shake');
      setTimeout(() => card.classList.remove('shake'), 400);
    }
  } catch (err) {
    showStatus("Không gửi được. Vui lòng thử lại.", false);
    card.classList.add('shake');
    setTimeout(() => card.classList.remove('shake'), 400);
  } finally {
    submitBtn.disabled = false;
    submitBtnText.textContent = "Thả trôi ra biển ⛵";
  }
});

againBtn.addEventListener('click', () => {
  successView.style.display = 'none';
  formView.style.display = 'block';
});

function showStatus(msg, ok) {
  statusEl.textContent = msg;
  statusEl.className = "status " + (ok ? "ok" : "err");
}
