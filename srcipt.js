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

// ---------- captcha đếm mặt trời ----------
const captchaSuns = document.getElementById('captchaSuns');
const captchaInput = document.getElementById('captchaInput');
const captchaRefresh = document.getElementById('captchaRefresh');
const DECOY_EMOJIS = ['☁','⭐','🌙'];
let sunAnswer = 0;

function generateCaptcha(){
  sunAnswer = 3 + Math.floor(Math.random()*5); // 3-7
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

// ---------- xử lý pop-up nhạc & trình phát nhạc mới ----------
const bgMusic = document.getElementById('bgMusic');
const musicWidget = document.getElementById('musicWidget');
const musicControlBanner = document.getElementById('musicControlBanner');
const bannerPlayPauseBtn = document.getElementById('bannerPlayPauseBtn');
const bannerSongTitle = document.getElementById('bannerSongTitle');
const bannerSongStatus = document.getElementById('bannerSongStatus');
const widgetThumb = document.getElementById('widgetThumb');
const bannerThumb = document.getElementById('bannerThumb');
const volumeRange = document.getElementById('volumeRange');

const musicPopup = document.getElementById('musicPopup');
const btnPlayMusic = document.getElementById('btnPlayMusic');
const btnMuteMusic = document.getElementById('btnMuteMusic');

// Cấu hình tên bài hát, nguồn nhạc và ảnh thumbnail bài hát tại đây
const MUSIC_URL = "music.mp3";
const THUMB_URL = "music-thumb.jpg"; // Bạn có thể thay đổi tên file ảnh bài hát của bạn
const SONG_TITLE = "Giai điệu thanh xuân";

bgMusic.src = MUSIC_URL;
widgetThumb.src = THUMB_URL;
bannerThumb.src = THUMB_URL;
bannerSongTitle.textContent = SONG_TITLE;

let isPlaying = false;

window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    musicPopup.classList.add('show');
  }, 1000);
});

function hideMusicPopup() {
  musicPopup.classList.remove('show');
}

function startMusic() {
  bgMusic.play().then(() => {
    isPlaying = true;
    musicWidget.classList.add('playing');
    bannerPlayPauseBtn.textContent = "⏸";
    bannerSongStatus.textContent = "Đang phát";
  }).catch((e) => {
    console.warn("Trình duyệt chặn autoplay hoặc URL nhạc lỗi:", e);
  });
}

function pauseMusic() {
  bgMusic.pause();
  isPlaying = false;
  musicWidget.classList.remove('playing');
  bannerPlayPauseBtn.textContent = "▶";
  bannerSongStatus.textContent = "Đã tạm dừng";
}

btnPlayMusic.addEventListener('click', () => {
  startMusic();
  hideMusicPopup();
});

btnMuteMusic.addEventListener('click', hideMusicPopup);

// Bấm vào widget góc phải để ẩn/hiện banner pop-up điều khiển
musicWidget.addEventListener('click', (e) => {
  e.stopPropagation();
  musicControlBanner.classList.toggle('show');
});

// Click ra ngoài thì ẩn banner pop-up
document.addEventListener('click', (e) => {
  if (!musicControlBanner.contains(e.target) && !musicWidget.contains(e.target)) {
    musicControlBanner.classList.remove('show');
  }
});

// Nút Phát / Tạm dừng trên banner
bannerPlayPauseBtn.addEventListener('click', () => {
  if (isPlaying) {
    pauseMusic();
  } else {
    startMusic();
  }
});

// Thanh trượt âm lượng
volumeRange.addEventListener('input', (e) => {
  bgMusic.volume = e.target.value;
});

// ---------- form logic ----------
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzD9C4NmTjGMarPy8BiFltw26OXIAW84pnvKuhd_6qWLDvy2OPU-KeliwUPSg6mrgFOvA/exec";

const categoryEl = document.getElementById('category'); 
const contentEl = document.getElementById('content');
const imageInput = document.getElementById('imageInput');
const preview = document.getElementById('preview');
const polaroid = document.getElementById('polaroid');
const fileLabelText = document.getElementById('fileLabelText');
const submitBtn = document.getElementById('submitBtn');
const statusEl = document.getElementById('status');
const card = document.getElementById('card');
const formView = document.getElementById('formView');
const successView = document.getElementById('successView');
const againBtn = document.getElementById('againBtn');

let imageBase64 = "";
let imageMime = "";

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
  const category = categoryEl.value;

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

  submitBtn.disabled = true;
  submitBtn.classList.add('is-loading'); 
  showStatus("Đang thả thư trôi dạt...", true);

  const finalContent = category + " / " + content;

  try {
    const res = await fetch(SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify({
        content: finalContent,
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
        categoryEl.selectedIndex = 0;
        imageInput.value = "";
        imageBase64 = "";
        polaroid.style.display = 'none';
        fileLabelText.textContent = "Đính kèm hình ảnh (không bắt buộc)";
        statusEl.textContent = "";
        generateCaptcha();
      }, 550);
    } else {
      showStatus("Có lỗi xảy ra: " + (data.error || "không rõ nguyên nhân"), false);
    }
  } catch (err) {
    showStatus("Không gửi được. Vui lòng thử lại.", false);
  } finally {
    submitBtn.disabled = false;
    submitBtn.classList.remove('is-loading');
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
