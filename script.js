// ---------- day/night palette tự động theo giờ ----------
const hour = new Date().getHours();
if(hour >= 6 && hour < 17){
  document.body.classList.add('daytime');
}

// ---------- dark mode toggle ----------
const darkModeBtn = document.getElementById('darkModeBtn');
let isDarkMode = false;

const MOON_ICON = `<svg viewBox="0 0 24 24" width="19" height="19" fill="none"><path d="M20 14.2A8.2 8.2 0 1 1 9.8 4 6.6 6.6 0 0 0 20 14.2Z" fill="currentColor"/></svg>`;
const SUN_ICON = `<svg viewBox="0 0 24 24" width="19" height="19" fill="none"><circle cx="12" cy="12" r="4.6" fill="currentColor"/><g stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="12" y1="1.5" x2="12" y2="4.2"/><line x1="12" y1="19.8" x2="12" y2="22.5"/><line x1="1.5" y1="12" x2="4.2" y2="12"/><line x1="19.8" y1="12" x2="22.5" y2="12"/><line x1="4.4" y1="4.4" x2="6.3" y2="6.3"/><line x1="17.7" y1="17.7" x2="19.6" y2="19.6"/><line x1="19.6" y1="4.4" x2="17.7" y2="6.3"/><line x1="6.3" y1="17.7" x2="4.4" y2="19.6"/></g></svg>`;

darkModeBtn.addEventListener('click', () => {
  isDarkMode = !isDarkMode;
  document.body.classList.toggle('dark-mode', isDarkMode);
  darkModeBtn.innerHTML = isDarkMode ? SUN_ICON : MOON_ICON;
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
// Giảm số lượng phần tử hiệu ứng trên di động / khi người dùng bật "giảm hiệu ứng động"
// để tránh giật lag, đặc biệt trên máy yếu.
const isMobileScreen = window.innerWidth < 640;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const sky = document.getElementById('sky');
const MOTE_COUNT = prefersReducedMotion ? 0 : (isMobileScreen ? 6 : 10);
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

const GLINT_COUNT = prefersReducedMotion ? 0 : (isMobileScreen ? 8 : 12);
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

// ---------- lấp lánh ánh nắng phản chiếu trên biển ----------
const reflectionEl = document.querySelector('.reflection');
if (reflectionEl && !prefersReducedMotion) {
  const CONTAINER_WIDTH = 150; // khớp với width của .reflection trong CSS
  const WATER_GLINT_COUNT = isMobileScreen ? 6 : 9;
  for (let i = 0; i < WATER_GLINT_COUNT; i++) {
    const wg = document.createElement('div');
    wg.className = 'water-glint';
    const topPercent = Math.random() * 100;
    // trapezoid hẹp trên (gần mặt trời) - rộng dần xuống dưới
    const maxWidth = 16 + (topPercent / 100) * 55;
    const width = 8 + Math.random() * maxWidth;
    const jitter = Math.random() * 16 - 8;
    wg.style.width = width + 'px';
    wg.style.top = topPercent + '%';
    wg.style.left = (CONTAINER_WIDTH / 2 - width / 2 + jitter) + 'px';
    wg.style.animationDuration = (1.4 + Math.random() * 2.2) + 's';
    wg.style.animationDelay = (Math.random() * 3) + 's';
    reflectionEl.appendChild(wg);
  }
}

// ---------- tạm dừng hiệu ứng động khi tab bị ẩn (tiết kiệm CPU/pin) ----------
document.addEventListener('visibilitychange', () => {
  document.body.classList.toggle('anim-paused', document.hidden);
});

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
  for(let i=0;i<sunAnswer;i++) icons.push('☀️');
  while(icons.length < totalIcons){
    icons.push(DECOY_EMOJIS[Math.floor(Math.random()*DECOY_EMOJIS.length)]);
  }
  for(let i=icons.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [icons[i], icons[j]] = [icons[j], icons[i]];
  }
  captchaSuns.textContent = icons.join('?');
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

// ---------- DANH SÁCH BÀI HÁT (PLAYLIST 10 BÀI) ----------
// Mỗi bài cần 1 file .mp3 (src) và có thể có 1 ảnh bìa (cover) — để cùng thư mục với index.html.
// Nếu không có ảnh bìa, cứ để cover: "" — trình phát sẽ tự hiện icon 🎵 thay thế.
const PLAYLIST = [
  { title: "Ánh Nắng Lặng Lẽ",     artist: "", src: "music1.mp3",  cover: "anhnhac1.jpg" },
  { title: "Sóng Biển Rì Rào",     artist: "",         src: "music2.mp3",  cover: "anhnhac2.jpg" },
  { title: "Gió Thoảng Chiều Nắng", artist: "",     src: "music3.mp3",  cover: "anhnhac3.jpg" },
  { title: "Hoàng Hôn Trên Biển",  artist: "",         src: "music4.mp3",  cover: "anhnhac4.jpg" },
  { title: "Mưa Rơi Nhẹ Nhàng",    artist: "", src: "music5.mp3",  cover: "anhnhac5.jpg" },
  { title: "Đêm Sao Yên Bình",     artist: "",      src: "music6.mp3",  cover: "anhnhac6.jpg" },
  { title: "Nắng Sớm Mai",         artist: "",    src: "music7.mp3",  cover: "anhnhac7.jpg" },
  { title: "Thì Thầm Cùng Gió",    artist: "",         src: "music8.mp3",  cover: "anhnhac8.jpg" },
  { title: "Khoảnh Khắc Lặng Yên", artist: "",        src: "music9.mp3",  cover: "anhnhac9.jpg" },
  { title: "Trôi Theo Dòng Nắng",  artist: "",      src: "music10.mp3", cover: "anhnhac10.jpg" }
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
    albumArt.innerHTML = `<img src="${track.cover}" alt="Cover" onerror="this.parentElement.innerHTML='<span>🎵</span>'" />`;
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

// ---------- popup gợi ý bật nhạc khi vừa vào trang ----------
const musicSuggestOverlay = document.getElementById('musicSuggestOverlay');
const musicSuggestYes = document.getElementById('musicSuggestYes');
const musicSuggestNo = document.getElementById('musicSuggestNo');

if (!sessionStorage.getItem('musicPromptSeen')) {
  setTimeout(() => {
    musicSuggestOverlay.classList.add('open');
  }, 1500);
}

function closeMusicSuggest(){
  musicSuggestOverlay.classList.remove('open');
  sessionStorage.setItem('musicPromptSeen', '1');
}

musicSuggestYes.addEventListener('click', () => {
  if (!isPlaying) {
    playPauseBtn.click();
  }
  closeMusicSuggest();
});

musicSuggestNo.addEventListener('click', () => {
  closeMusicSuggest();
});

musicSuggestOverlay.addEventListener('click', (e) => {
  if (e.target === musicSuggestOverlay) {
    closeMusicSuggest();
  }
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
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzjUs5CxzQ08ja8g845-kn2jiY8kCyv9luVKlFyKWJNVbYLLPN3DqVRtVM7REgnDn2w/exec";

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

let selectedFile = null;
let previewObjectUrl = null;
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

// ---------- popup lưu ý nhỏ khi bắt đầu nhập nội dung ----------
const contentNotice = document.getElementById('contentNotice');
const contentNoticeClose = document.getElementById('contentNoticeClose');
let contentNoticeTimer;

contentEl.addEventListener('focus', () => {
  if (!sessionStorage.getItem('contentNoticeSeen')) {
    contentNotice.classList.add('show');
    sessionStorage.setItem('contentNoticeSeen', '1');
    clearTimeout(contentNoticeTimer);
    contentNoticeTimer = setTimeout(() => {
      contentNotice.classList.remove('show');
    }, 6000);
  }
}, { once: true });

contentNoticeClose.addEventListener('click', () => {
  clearTimeout(contentNoticeTimer);
  contentNotice.classList.remove('show');
});

const previewVideo = document.getElementById('previewVideo');
const fileSizeWarning = document.getElementById('fileSizeWarning');
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
const LARGE_FILE_THRESHOLD = 5 * 1024 * 1024; // cảnh báo nếu > 5MB

imageInput.addEventListener('change', () => {
  const file = imageInput.files[0];
  if (!file) return;

  const isVideo = file.type.startsWith('video/');
  const isImage = file.type.startsWith('image/');

  if (!isVideo && !isImage) {
    showStatus("Chỉ nhận file ảnh hoặc video thôi nhé.", false);
    imageInput.value = "";
    return;
  }

  if (file.size > MAX_FILE_SIZE) {
    showStatus("Tệp quá lớn (tối đa 20MB).", false);
    imageInput.value = "";
    return;
  }

  fileSizeWarning.style.display = file.size > LARGE_FILE_THRESHOLD ? 'block' : 'none';

  fileLabelText.textContent = file.name;
  selectedFile = file;

  // Dùng object URL thay vì đọc base64 ngay — nhẹ, hiển thị preview tức thì,
  // không tốn RAM hay làm treo máy khi chọn file video/ảnh nặng.
  if (previewObjectUrl) URL.revokeObjectURL(previewObjectUrl);
  previewObjectUrl = URL.createObjectURL(file);

  if (isVideo) {
    previewVideo.src = previewObjectUrl;
    previewVideo.style.display = 'block';
    preview.style.display = 'none';
    preview.src = "";
  } else {
    preview.src = previewObjectUrl;
    preview.style.display = 'block';
    previewVideo.style.display = 'none';
    previewVideo.src = "";
  }
  polaroid.style.display = 'block';
});

const removeImageBtn = document.getElementById('removeImageBtn');
removeImageBtn.addEventListener('click', () => {
  imageInput.value = "";
  selectedFile = null;
  if (previewObjectUrl) {
    URL.revokeObjectURL(previewObjectUrl);
    previewObjectUrl = null;
  }
  preview.src = "";
  preview.style.display = 'block';
  previewVideo.src = "";
  previewVideo.style.display = 'none';
  polaroid.style.display = 'none';
  fileSizeWarning.style.display = 'none';
  fileLabelText.textContent = "Đính kèm ảnh hoặc video (không bắt buộc, tối đa 20MB)";
});

// Đọc file thành base64 — chỉ thực hiện lúc cần gửi, tránh giữ chuỗi base64 nặng
// trong bộ nhớ suốt lúc người dùng đang gõ nội dung.
function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result.split(',')[1]);
    reader.onerror = () => reject(new Error("read-failed"));
    reader.readAsDataURL(file);
  });
}

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

  try {
    let mediaBase64 = "";
    let mediaMime = "";

    if (selectedFile) {
      submitBtnText.innerHTML = 'Đang xử lý tệp <span class="btn-dots"><span></span><span></span><span></span></span>';
      showStatus("", true);
      mediaBase64 = await readFileAsBase64(selectedFile);
      mediaMime = selectedFile.type;
    }

    submitBtnText.innerHTML = 'Đang gửi <span class="btn-dots"><span></span><span></span><span></span></span>';
    showStatus("", true);

    const res = await fetch(SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify({
        category: category,
        content: content + " / Đánh giá: " + selectedRating + "★",
        imageBase64: mediaBase64,
        imageMime: mediaMime
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
        selectedFile = null;
        if (previewObjectUrl) {
          URL.revokeObjectURL(previewObjectUrl);
          previewObjectUrl = null;
        }
        preview.src = "";
        preview.style.display = 'block';
        previewVideo.src = "";
        previewVideo.style.display = 'none';
        polaroid.style.display = 'none';
        fileSizeWarning.style.display = 'none';
        fileLabelText.textContent = "Đính kèm ảnh hoặc video (không bắt buộc, tối đa 20MB)";
        statusEl.textContent = "";
        charCounter.textContent = "0/" + MAX_CHARS;
        charCounter.classList.remove('near-limit');
        spawnFlowers();
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
  selectedRating = 5;
  updateStars(selectedRating);
});

const flowerBurst = document.getElementById('flowerBurst');
const FLOWER_EMOJIS = ['🌸', '🌼', '🌺', '🌷', '🌻'];

function spawnFlowers(){
  const count = 3 + Math.floor(Math.random() * 2); // 3-4 bông
  const positions = [-70, -35, 0, 35, 70]; // % lệch trái/phải so với tâm
  const shuffled = positions.sort(() => Math.random() - 0.5).slice(0, count);

  shuffled.forEach((offset, i) => {
    const f = document.createElement('span');
    f.className = 'flower';
    f.textContent = FLOWER_EMOJIS[Math.floor(Math.random() * FLOWER_EMOJIS.length)];
    f.style.left = `calc(50% + ${offset}px)`;
    f.style.top = '10px';
    f.style.animationDelay = (i * 0.12) + 's';
    flowerBurst.appendChild(f);

    setTimeout(() => f.remove(), 2800);
  });
}

function showStatus(msg, ok) {
  statusEl.textContent = msg;
  statusEl.className = "status " + (ok ? "ok" : "err");
}
// ---------- LOGIC ĐÁNH GIÁ SAO ----------
let selectedRating = 5; // Mặc định là 5 sao
const stars = document.querySelectorAll('#starRating .star');

function updateStars(rating) {
  stars.forEach(star => {
    const val = parseInt(star.getAttribute('data-value'), 10);
    if (val <= rating) {
      star.classList.add('active');
    } else {
      star.classList.remove('active');
    }
  });
}

stars.forEach(star => {
  // Hiệu ứng rê chuột
  star.addEventListener('mouseover', () => {
    const hoverVal = parseInt(star.getAttribute('data-value'), 10);
    stars.forEach(s => {
      const v = parseInt(s.getAttribute('data-value'), 10);
      if (v <= hoverVal) s.classList.add('hover');
      else s.classList.remove('hover');
    });
  });

  star.addEventListener('mouseout', () => {
    stars.forEach(s => s.classList.remove('hover'));
  });

  // Chọn số sao khi click
  star.addEventListener('click', () => {
    selectedRating = parseInt(star.getAttribute('data-value'), 10);
    updateStars(selectedRating);
  });
});
