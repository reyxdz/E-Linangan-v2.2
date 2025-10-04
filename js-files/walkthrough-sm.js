let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const indicatorContainer = document.querySelector('.indicators');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const totalSlides = slides.length;

// Add click sound effect (optional - replace with your sound file)
const clickSound = new Audio('audios/wtbutton.mp3');

// Background music (optional - replace with your music file)
const bgMusic = new Audio('audios/wtbgmusic.mp3');
bgMusic.loop = true;
bgMusic.volume = 0.3;

function playSound() {
    clickSound.currentTime = 0;
    clickSound.play().catch(e => console.log('Sound not loaded'));
}

function createIndicators() {
    for (let i = 0; i < totalSlides; i++) {
        const indicator = document.createElement('div');
        indicator.className = 'indicator';
        if (i === 0) indicator.classList.add('active');
        indicator.addEventListener('click', () => {
            playSound();
            currentSlide = i;
            updateCarousel();
        });
        indicatorContainer.appendChild(indicator);
    }
}

function updateCarousel() {
    const indicators = document.querySelectorAll('.indicator');
    
    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === currentSlide);
    });

    indicators.forEach((indicator, i) => {
        indicator.classList.toggle('active', i === currentSlide);
    });

    prevBtn.disabled = currentSlide === 0;
}

prevBtn.addEventListener('click', () => {
    if (currentSlide > 0) {
        playSound();
        currentSlide--;
        updateCarousel();
    }
});

nextBtn.addEventListener('click', () => {
    playSound();
    if (currentSlide < totalSlides - 1) {
        currentSlide++;
        updateCarousel();
    } else {
        // Link to next page
        openPopup();
    }
});

// Background music (optional)
window.addEventListener('load', () => {
    bgMusic.play().catch(error => {
        console.log('Autoplay prevented.');
    });
});

document.addEventListener('click', () => {
    if (bgMusic.paused) {
        bgMusic.play().catch(e => console.log('Music not loaded'));
    }
}, { once: true });

// Initialize
createIndicators();
updateCarousel();