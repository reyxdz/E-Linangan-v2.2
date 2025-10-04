let currentSlide = 0;
let activeSlides = [];
const allSlides = document.querySelectorAll('.slide');
const indicatorContainer = document.querySelector('.indicators');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

// Add sounds
const clickSound = new Audio('audios/wtbutton.mp3');
const bgMusic = new Audio('audios/wtbgmusic.mp3');
bgMusic.loop = true;
bgMusic.volume = 0.3;

// Detect screen size and filter slides
function detectScreenSize() {
    const screenType = window.innerWidth <= 768 ? 'small' : 'large';
    
    // Hide all slides first
    allSlides.forEach(slide => {
        slide.style.display = 'none';
        slide.classList.remove('active');
    });
    
    // Show only slides for current screen size
    activeSlides = Array.from(allSlides).filter(slide => 
        slide.getAttribute('data-screen') === screenType
    );
    
    activeSlides.forEach(slide => {
        slide.style.display = 'flex';
    });
    
    // Reset to first slide
    currentSlide = 0;
    
    // Rebuild indicators
    rebuildIndicators();
    updateCarousel();
}

function rebuildIndicators() {
    indicatorContainer.innerHTML = '';
    activeSlides.forEach((_, i) => {
        const indicator = document.createElement('div');
        indicator.className = 'indicator';
        indicator.addEventListener('click', () => {
            playSound();
            currentSlide = i;
            updateCarousel();
        });
        indicator.style.cursor = 'pointer';
        indicatorContainer.appendChild(indicator);
    });
}

function playSound() {
    clickSound.currentTime = 0;
    clickSound.play();
}

function updateCarousel() {
    const indicators = document.querySelectorAll('.indicator');
    
    activeSlides.forEach((slide, i) => {
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
    if (currentSlide < activeSlides.length - 1) {
        currentSlide++;
        updateCarousel();
    } else {
        openPopup();
    }
});

// Background music
window.addEventListener('load', () => {
    bgMusic.play().catch(error => {
        console.log('Autoplay prevented. Music will play after first interaction.');
    });
});

document.addEventListener('click', () => {
    if (bgMusic.paused) {
        bgMusic.play();
    }
}, { once: true });

// Initial setup and resize listener
detectScreenSize();
window.addEventListener('resize', detectScreenSize);