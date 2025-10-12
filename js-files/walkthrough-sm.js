let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const indicatorContainer = document.querySelector('.indicators');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const totalSlides = slides.length;

function createIndicators() {
    indicatorContainer.innerHTML = '';
    const maxVisible = 5;
    const startIndex = Math.max(0, Math.min(currentSlide - 2, totalSlides - maxVisible));
    const endIndex = Math.min(startIndex + maxVisible, totalSlides);
    
    for (let i = startIndex; i < endIndex; i++) {
        const indicator = document.createElement('div');
        indicator.className = 'indicator';
        indicator.dataset.index = i;
        if (i === currentSlide) indicator.classList.add('active');
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

    // Recreate indicators to show current range
    createIndicators();

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

// Initialize
createIndicators();
updateCarousel();