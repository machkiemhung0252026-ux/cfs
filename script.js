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

// ---------- xử lý pop-up & nhạc nền ----------
const bgMusic = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');
const musicPopup = document.getElementById('musicPopup');
const btnPlayMusic = document.getElementById('btnPlayMusic');
const btnMuteMusic = document.getElementById('btnMuteMusic');
const MUSIC_URL = "music.mp3";
bgMusic.src = MUSIC_URL;
let isPlaying = false;

// Kích hoạt popup sau khi tải trang 1s
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
    musicToggle.textContent = "⏸";
    musicToggle.classList.add('playing');
  }).catch((e) => {
    console.warn("Trình duyệt chặn autoplay hoặc URL nhạc lỗi:", e);
  });
}

btnPlayMusic.addEventListener('click', () => {
  startMusic();
  hideMusicPopup();
});

btnMuteMusic.addEventListener('click', hideMusicPopup);

musicToggle.addEventListener('click', () => {
  if (isPlaying) {
    bgMusic.pause();
    musicToggle.textContent = "🎵";
    musicToggle.classList.remove('playing');
  } else {
    startMusic();
  }
  isPlaying = !isPlaying;
});

// ---------- form logic ----------
// Link Web App Google Apps Script CỦA BẠN
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzD9C4NmTjGMarPy8BiFltw26OXIAW84pnvKuhd_6qWLDvy2OPU-KeliwUPSg6mrgFOvA/exec";

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
  showStatus("Đang gửi...", true);

  try {
    const res = await fetch(SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify({
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
        generateCaptcha();
      }, 550);
    } else {
      showStatus("Có lỗi xảy ra: " + (data.error || "không rõ nguyên nhân"), false);
    }
  } catch (err) {
    showStatus("Không gửi được. Vui lòng thử lại.", false);
  } finally {
    submitBtn.disabled = false;
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
