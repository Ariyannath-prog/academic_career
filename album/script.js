
const images = document.querySelectorAll(".gallery img");
const viewer = document.getElementById("viewer");
const viewerImg = document.getElementById("viewerImg");
const viewerTitle = document.getElementById("viewerTitle");
const viewerDesc = document.getElementById("viewerDesc");
const viewerInfo = document.getElementById("viewerInfo");
let currentIndex = 0;
let zoomLevel = 1;
let isFullscreen = false;
let isSlideshowActive = false;
let slideshowInterval;
let slideshowTimeout;
let timerInterval;
const SLIDESHOW_INTERVAL = 5000; // 5 seconds

// Fullscreen functionality
const fullscreenBtn = document.getElementById('fullscreenBtn');
fullscreenBtn.addEventListener('click', toggleFullscreen);

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        if (viewer.requestFullscreen) {
            viewer.requestFullscreen();
        } else if (viewer.webkitRequestFullscreen) {
            viewer.webkitRequestFullscreen();
        } else if (viewer.msRequestFullscreen) {
            viewer.msRequestFullscreen();
        }
        viewer.classList.add('fullscreen');
        isFullscreen = true;
        fullscreenBtn.classList.remove('fa-expand');
        fullscreenBtn.classList.add('fa-compress');
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
        viewer.classList.remove('fullscreen');
        isFullscreen = false;
        fullscreenBtn.classList.remove('fa-compress');
        fullscreenBtn.classList.add('fa-expand');
    }
}

// Exit fullscreen when ESC is pressed
document.addEventListener('fullscreenchange', exitHandler);
document.addEventListener('webkitfullscreenchange', exitHandler);
document.addEventListener('mozfullscreenchange', exitHandler);
document.addEventListener('MSFullscreenChange', exitHandler);

function exitHandler() {
    if (!document.fullscreenElement && !document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement) {
        viewer.classList.remove('fullscreen');
        isFullscreen = false;
        fullscreenBtn.classList.remove('fa-compress');
        fullscreenBtn.classList.add('fa-expand');
    }
}

// Slideshow functionality
const slideshowBtn = document.getElementById('slideshowBtn');
const slideshowControls = document.getElementById('slideshowControls');
const pauseSlideshowBtn = document.getElementById('pauseSlideshow');
const stopSlideshowBtn = document.getElementById('stopSlideshow');
const slideshowTimer = document.getElementById('slideshowTimer');
const timerCount = document.getElementById('timerCount');

slideshowBtn.addEventListener('click', toggleSlideshow);
pauseSlideshowBtn.addEventListener('click', toggleSlideshowPause);
stopSlideshowBtn.addEventListener('click', stopSlideshow);

function toggleSlideshow() {
    if (!isSlideshowActive) {
        startSlideshow();
        slideshowBtn.classList.remove('fa-play');
        slideshowBtn.classList.add('fa-pause');
        slideshowBtn.title = 'Pause Slideshow';
    } else {
        pauseSlideshow();
        slideshowBtn.classList.remove('fa-pause');
        slideshowBtn.classList.add('fa-play');
        slideshowBtn.title = 'Resume Slideshow';
    }
}

function startSlideshow() {
    isSlideshowActive = true;
    slideshowControls.style.display = 'flex';
    slideshowTimer.classList.add('active');
    startTimer();
    
    slideshowInterval = setInterval(() => {
        currentIndex = (currentIndex + 1) % images.length;
        openViewer(currentIndex);
        startTimer();
    }, SLIDESHOW_INTERVAL);
}

function pauseSlideshow() {
    isSlideshowActive = false;
    clearInterval(slideshowInterval);
    clearInterval(timerInterval);
    slideshowBtn.classList.remove('fa-pause');
    slideshowBtn.classList.add('fa-play');
    slideshowBtn.title = 'Resume Slideshow';
}

function toggleSlideshowPause() {
    if (isSlideshowActive) {
        pauseSlideshow();
        slideshowControls.innerHTML = `
            <button id="resumeSlideshow">
                <i class="fas fa-play"></i> Resume
            </button>
            <button id="stopSlideshow">
                <i class="fas fa-stop"></i> Stop
            </button>
        `;
        document.getElementById('resumeSlideshow').addEventListener('click', resumeSlideshow);
        document.getElementById('stopSlideshow').addEventListener('click', stopSlideshow);
    }
}

function resumeSlideshow() {
    startSlideshow();
    slideshowControls.innerHTML = `
        <button id="pauseSlideshow">
            <i class="fas fa-pause"></i> Pause
        </button>
        <button id="stopSlideshow">
            <i class="fas fa-stop"></i> Stop
        </button>
    `;
    pauseSlideshowBtn.addEventListener('click', toggleSlideshowPause);
    stopSlideshowBtn.addEventListener('click', stopSlideshow);
}

function stopSlideshow() {
    isSlideshowActive = false;
    clearInterval(slideshowInterval);
    clearInterval(timerInterval);
    slideshowControls.style.display = 'none';
    slideshowTimer.classList.remove('active');
    slideshowBtn.classList.remove('fa-pause');
    slideshowBtn.classList.add('fa-play');
    slideshowBtn.title = 'Start Slideshow';
}

function startTimer() {
    let seconds = SLIDESHOW_INTERVAL / 1000;
    timerCount.textContent = seconds;
    
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        seconds--;
        timerCount.textContent = seconds;
        if (seconds <= 0) {
            clearInterval(timerInterval);
        }
    }, 1000);
}

// Info toggle functionality
const infoBtn = document.getElementById('infoBtn');
infoBtn.addEventListener('click', toggleInfo);

function toggleInfo() {
    viewerInfo.classList.toggle('hidden');
    infoBtn.classList.toggle('active');
    if (viewerInfo.classList.contains('hidden')) {
        infoBtn.title = 'Show Info';
    } else {
        infoBtn.title = 'Hide Info';
    }
}

// Share functionality
const shareBtn = document.getElementById('shareBtn');
const shareModal = document.getElementById('shareModal');
const overlay = document.getElementById('overlay');
const shareLink = document.getElementById('shareLink');

shareBtn.addEventListener('click', openShareModal);

function openShareModal() {
    const currentImage = images[currentIndex];
    const imageUrl = currentImage.src;
    const title = currentImage.dataset.title;
    
    shareLink.value = imageUrl;
    shareModal.classList.add('active');
    overlay.classList.add('active');
}

function closeShareModal() {
    shareModal.classList.remove('active');
    overlay.classList.remove('active');
}

function shareTo(platform) {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(viewerTitle.textContent);
    const imageUrl = encodeURIComponent(viewerImg.src);
    
    let shareUrl = '';
    
    switch(platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}&hashtags=photography`;
            break;
        case 'pinterest':
            shareUrl = `https://pinterest.com/pin/create/button/?url=${url}&media=${imageUrl}&description=${title}`;
            break;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
}

function copyToClipboard() {
    shareLink.select();
    shareLink.setSelectionRange(0, 99999);
    document.execCommand('copy');
    
    const originalText = shareLink.nextElementSibling.textContent;
    shareLink.nextElementSibling.textContent = 'Copied!';
    shareLink.nextElementSibling.style.background = '#4CAF50';
    
    setTimeout(() => {
        shareLink.nextElementSibling.textContent = originalText;
        shareLink.nextElementSibling.style.background = '#4a6ee0';
    }, 2000);
}

// Close modal when clicking overlay
overlay.addEventListener('click', closeShareModal);

// Zoom functionality
const zoomInBtn = document.getElementById('zoomIn');
const zoomOutBtn = document.getElementById('zoomOut');
const resetZoomBtn = document.getElementById('resetZoom');

zoomInBtn.addEventListener('click', () => zoomImage(1.2));
zoomOutBtn.addEventListener('click', () => zoomImage(0.8));
resetZoomBtn.addEventListener('click', resetZoom);

function zoomImage(factor) {
    zoomLevel *= factor;
    viewerImg.style.transform = `scale(${zoomLevel})`;
    viewerImg.style.transition = 'transform 0.3s ease';
}

function resetZoom() {
    zoomLevel = 1;
    viewerImg.style.transform = 'scale(1)';
}

// Mouse wheel zoom
viewerImg.addEventListener('wheel', (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    zoomImage(delta);
});

// Original viewer functions
function openViewer(index) {
    const img = images[index];
    viewerImg.src = img.src;
    viewerTitle.textContent = img.dataset.title;
    viewerDesc.textContent = img.dataset.desc;
    viewer.classList.add("active");
    currentIndex = index;
    zoomLevel = 1;
    viewerImg.style.transform = 'scale(1)';
    
    // Reset slideshow timer if active
    if (isSlideshowActive) {
        startTimer();
    }
}

images.forEach((img, index) => {
    img.addEventListener("click", () => openViewer(index));
});

document.getElementById("close").onclick = () => {
    viewer.classList.remove("active");
    stopSlideshow();
    closeShareModal();
};

document.getElementById("next").onclick = () => {
    currentIndex = (currentIndex + 1) % images.length;
    openViewer(currentIndex);
};

document.getElementById("prev").onclick = () => {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    openViewer(currentIndex);
};

// Keyboard controls
document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
        viewer.classList.remove("active");
        closeShareModal();
        stopSlideshow();
    }
    if (e.key === "ArrowRight") {
        currentIndex = (currentIndex + 1) % images.length;
        openViewer(currentIndex);
    }
    if (e.key === "ArrowLeft") {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        openViewer(currentIndex);
    }
    if (e.key === " ") {
        e.preventDefault();
        toggleSlideshow();
    }
    if (e.key === "f" || e.key === "F") {
        toggleFullscreen();
    }
    if (e.key === "i" || e.key === "I") {
        toggleInfo();
    }
    if (e.key === "+" || e.key === "=") {
        zoomImage(1.2);
    }
    if (e.key === "-" || e.key === "_") {
        zoomImage(0.8);
    }
    if (e.key === "0") {
        resetZoom();
    }
});