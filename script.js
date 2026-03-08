// ==========================================================
// Cinematic Wedding Album Engine
// ==========================================================

const MAX_IMAGES_TO_CHECK = 50; // Giới hạn số ảnh tối đa để auto-discover
const IMAGE_DURATION_MS = 10000; // Thời gian hiển thị mỗi bức ảnh (10s)
const FADE_DURATION_MS = 3000; // Thời gian chuyển cảnh
const imageList = [
    "images/1.jpg",
    "images/2.jpg",
    "images/3.jpg",
    "images/480242671_3064688477015430_2934833717742444879_n.jpg", "images/480874766_3049726518511626_3874105527874658124_n.jpg", "images/480905094_3048789071938704_5044050983065231869_n.jpg",
    "images/481226228_3053904624760482_5990154567363076570_n.jpg", "images/481669232_3049495601868051_1255855470381881731_n.jpg", "images/482086917_3056251931192418_7935135165464530773_n.jpg",
    "images/484400363_3065752986908979_3112608135335390608_n.jpg", "images/486093289_3074928162658128_6282102039296772253_n.jpg", "images/486378708_3073752596109018_746413029067166642_n.jpg",
    "images/487382932_3079068308910780_1269196281901952409_n.jpg", "images/488507636_3090289951121949_3376463499149264694_n.jpg", "images/488646440_3086352051515739_4303438213954306609_n.jpg",
    "images/489764599_3092353634248914_5902561302735050376_n.jpg", "images/492005705_3110852675732343_96236284532558117_n.jpg", "images/505668232_3173180676166209_4351892920086334312_n.jpg",
    "images/505956930_3172475026236774_1426205419776612057_n.jpg", "images/506391070_3173373689480241_626800231672187668_n.jpg", "images/506757951_3173379852812958_809612722277978837_n.jpg",
    "images/506924922_3173379979479612_2618400586139154859_n.jpg", "images/507091936_3173380152812928_1735211096866064368_n.jpg", "images/507129809_3173868036097473_8160452032656005740_n.jpg",
    "images/co-dau-chu-re-chibi-01.webp", "images/co-dau-chu-re-chibi-03.webp", "images/co-dau-chu-re-chibi-07.webp", "images/co-dau-chu-re-chibi-09.webp",
    "images/co-dau-chu-re-chibi-11.webp", "images/co-dau-chu-re-chibi-12.webp", "images/co-dau-chu-re-chibi-14.webp", "images/co-dau-chu-re-chibi-30.webp",
    "images/download (1).jpeg", "images/download (10).jpeg", "images/download (11).jpeg", "images/download (12).jpeg", "images/download (2).jpeg",
    "images/download (3).jpeg", "images/download (4).jpeg", "images/download (5).jpeg", "images/download (6).jpeg", "images/download (7).jpeg",
    "images/download (8).jpeg", "images/download (9).jpeg", "images/download.jpeg",
    "images/images (1).jpeg", "images/images (2).jpeg", "images/images (3).jpeg", "images/images (4).jpeg", "images/images.jpeg"
];
let currentImageIndex = 0;
let slideInterval;
let isPlaying = false;

// DOM Elements
const introScene = document.getElementById('intro');
const slideshowScene = document.getElementById('slideshow');
const slideContainer = document.getElementById('slide-container');
const captionContainer = document.getElementById('caption-container');
const captionText = document.getElementById('caption-text');
const transitionOverlay = document.getElementById('transition-overlay');
const outroScene = document.getElementById('outro');
const controls = document.getElementById('controls');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');

// ==========================================================
// Subtitles / Captions Data
// ==========================================================
const captions = [
    "Where it all began",
    "Our first adventure",
    "The simple moments",
    "A journey of laughter",
    "The moment everything changed",
    "Building our dreams",
    "The promise of forever",
    "Two hearts, one soul",
    "A beautiful day",
    "Surrounded by love",
    "Just the beginning..."
];

// ==========================================================
// 1. YouTube Audio Player (IFrame API)
// ==========================================================
let player;
// Using a cinematic romantic background music from YoutTube (no copyright/cinematic)
// E.g: "Romantic Cinematic Music"
const YOUTUBE_VIDEO_ID = "t-uuZb5PrUs"; // user provided romantic track

function onYouTubeIframeAPIReady() {
    player = new YT.Player('youtube-player', {
        height: '0',
        width: '0',
        videoId: YOUTUBE_VIDEO_ID, // Use a known romantic film video ID
        playerVars: {
            'autoplay': 0,
            'controls': 0,
            'showinfo': 0,
            'rel': 0,
            'loop': 1,
            'playlist': YOUTUBE_VIDEO_ID // required for loop to work
        },
        events: {
            'onReady': onPlayerReady
        }
    });
}

function onPlayerReady(event) {
    player.setVolume(30); // Low cinematic volume 25-30%
}

function startMusic() {
    if (player && typeof player.playVideo === 'function') {
        player.playVideo();
    }
}

// ==========================================================
// 2. Tải danh sách hình ảnh (Đã tự động lấy vào mảng)
// ==========================================================
// Hàm tải ảnh. Chạy đệ quy để thử tìm các file ảnh từ 1.jpg, 2.jpg...
function discoverImages(index) {
    if (index > MAX_IMAGES_TO_CHECK) return;

    // Các đuôi có thể: jpg, jpeg, png, jpeg. Nhưng để đơn giản, thử jpg. 
    // Nếu user tải dạng khác, họ hãy chuyển đuôi sang .jpg hoặc đổi tên thành dãy số 1.jpg, 2.jpg
    const imgUrl = `images/${index}.jpg`;

    let img = new Image();
    img.onload = function () {
        imageList.push(imgUrl);
        discoverImages(index + 1);
    };
    img.onerror = function () {
        // Có thể kết thúc ở đây hoặc thử tên padding `01.jpg`
        // console.log("Stopped discovering at index: " + index);
    };
    img.src = imgUrl;
}

// Đã load mảng tĩnh vào imageList, không cần discoverImages nữa.

// Gọi hàm khi trang vừa load
window.addEventListener('DOMContentLoaded', () => {
    // Fade in text for intro
    setTimeout(() => document.querySelector('.delay-1').classList.add('show'), 500);
    setTimeout(() => document.querySelector('.delay-2').classList.add('show'), 2000);
    setTimeout(() => document.querySelector('.delay-3').classList.add('show'), 4000);
    setTimeout(() => document.querySelector('.delay-4').classList.add('show'), 6000);

    initCanvasParticles();
});

// ==========================================================
// 3. Slideshow Logic & Cinematic Transitions
// ==========================================================
function startSlideshow() {
    introScene.classList.remove('active');

    // Nếu không có ảnh nào trong mảng (User chưa đặt ảnh vô folder images), tạo ảnh placeholder ảo đỏ đỏ
    if (imageList.length === 0) {
        imageList.push("https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2069&auto=format&fit=crop");
        imageList.push("https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop");
        imageList.push("https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=2070&auto=format&fit=crop");
    }

    slideshowScene.classList.add('active');
    controls.classList.add('show');
    isPlaying = true;
    startMusic();

    showSlide(currentImageIndex);
    slideInterval = setInterval(nextSlide, IMAGE_DURATION_MS); // ~10 seconds
}

function stopSlideshow() {
    clearInterval(slideInterval);
    isPlaying = false;
    if (player && typeof player.pauseVideo === 'function') {
        player.pauseVideo();
    }
}

// Generate random direction for Ken Burns
function getRandomKenBurnsTransform() {
    const scales = [1.1, 1.15, 1.2];
    const scale = scales[Math.floor(Math.random() * scales.length)];

    const translateMax = 5; // 5% max move
    const tx = (Math.random() * translateMax * 2 - translateMax).toFixed(2);
    const ty = (Math.random() * translateMax * 2 - translateMax).toFixed(2);

    return `translate(-50%, -50%) scale(${scale}) translate(${tx}%, ${ty}%)`;
}

function showSlide(index) {
    if (index >= imageList.length) {
        endCinematic();
        return;
    }

    // Effect: Random Flash or Burn (20% chance for burn transition)
    if (currentImageIndex > 0) {
        const effect = Math.random() > 0.8 ? 'burn' : 'flash';
        transitionOverlay.classList.add(effect);
        setTimeout(() => {
            transitionOverlay.classList.remove(effect);
        }, effect === 'burn' ? 300 : 100);
    }

    // Process old active slide
    const currentActive = document.querySelector('.slide-img.active');
    if (currentActive) {
        currentActive.classList.remove('active');
        currentActive.classList.add('fading-out');
        setTimeout(() => {
            if (currentActive.parentNode) {
                currentActive.remove();
            }
        }, FADE_DURATION_MS);
    }

    // Create New img element
    const imgEl = document.createElement('img');
    imgEl.src = imageList[index];
    imgEl.className = 'slide-img';

    // Set starting transition (transform logic)
    // Starting state is scale 1.05 and no translation
    const startTransform = `translate(-50%, -50%) scale(1.05)`;
    const targetTransform = getRandomKenBurnsTransform();

    imgEl.style.transform = startTransform;

    // We append the child before making it active
    slideContainer.appendChild(imgEl);

    // Force reflow
    void imgEl.offsetWidth;

    // Add active to fade it in
    imgEl.classList.add('active');

    // Trigger Ken Burns over IMAGE_DURATION_MS + FADE_DURATION_MS to avoid sudden stop during fade out
    setTimeout(() => {
        imgEl.style.transition = `transform ${IMAGE_DURATION_MS + FADE_DURATION_MS}ms ease-out`;
        imgEl.style.transform = targetTransform;
    }, 50);

    // Update Caption
    const captionSpan = captions[index % captions.length];
    captionText.classList.remove('show');

    setTimeout(() => {
        captionText.innerText = captionSpan;
        captionText.classList.add('show');
    }, 1500); // Wait 1.5s into slide before showing text
}

function nextSlide() {
    currentImageIndex++;
    showSlide(currentImageIndex);
}

// Outro Scene
function endCinematic() {
    clearInterval(slideInterval);
    slideshowScene.classList.remove('active');
    controls.classList.remove('show');
    outroScene.classList.add('active');

    // Fade in text
    setTimeout(() => document.querySelector('.outro-delay-1').classList.add('show'), 1000);
    setTimeout(() => document.querySelector('.outro-delay-2').classList.add('show'), 4000);
}

// ==========================================================
// 4. Input Events & Subtle Parallax
// ==========================================================

// Click Start
startBtn.addEventListener('click', startSlideshow);

// Click Pause
pauseBtn.addEventListener('click', () => {
    if (isPlaying) {
        stopSlideshow();
        pauseBtn.innerText = "▶ Play";
    } else {
        slideInterval = setInterval(nextSlide, IMAGE_DURATION_MS);
        isPlaying = true;
        if (player && typeof player.playVideo === 'function') player.playVideo();
        pauseBtn.innerText = "⏸ Pause";
    }
});

// Sound toggle
document.getElementById('sound-btn').addEventListener('click', (e) => {
    if (!player) return;
    const isMuted = player.isMuted();
    if (isMuted) {
        player.unMute();
        e.target.innerText = "🔊 Sound On";
    } else {
        player.mute();
        e.target.innerText = "🔇 Sound Off";
    }
});

// Mouse subtle parallax effect for cinematic depth
window.addEventListener('mousemove', (e) => {
    if (!isPlaying) return;
    const x = (e.clientX / window.innerWidth - 0.5) * 2; // -1 to 1
    const y = (e.clientY / window.innerHeight - 0.5) * 2;

    // Áp dụng tilt / dịch chuyển cực nhẹ
    slideContainer.style.transform = `translate(${x * -0.5}%, ${y * -0.5}%)`;
});

// ==========================================================
// 5. Canvas Particles (Dust/Petals) Simulation
// ==========================================================
function initCanvasParticles() {
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particlesArray = [];
    const numberOfParticles = 50; // Giảm xuống cho tinh tế (Cinematic)

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            // Kích thước hạt rất nhỏ (buội) và to hơn một chút (đốm sáng nhỏ)
            this.size = Math.random() * 2 + 0.5;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * -0.5 - 0.1; // Bay từ từ lên trên
            this.opacity = Math.random() * 0.5 + 0.1;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Reset hạt khi nó bay ra khỏi màn hình
            if (this.y < 0) {
                this.y = canvas.height;
                this.x = Math.random() * canvas.width;
            }
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
        }
        draw() {
            ctx.fillStyle = `rgba(255, 240, 200, ${this.opacity})`; // Màu vàng lấp lánh nhẹ
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
        }
        requestAnimationFrame(animateParticles);
    }

    animateParticles();

    // Resize window support
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}
