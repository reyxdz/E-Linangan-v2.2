// Add hover effects to cards
document.querySelectorAll('.module-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Add staggered animation on load
window.addEventListener('load', function() {
    const cards = document.querySelectorAll('.module-card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 200);
    });
});

// Initialize cards with hidden state
document.querySelectorAll('.module-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(50px)';
    card.style.transition = 'all 0.6s ease';
});





// BACKGROUND MUSIC
window.addEventListener("click", () => {
            const music = document.getElementById("bg-music");
            music.muted = false;
            music.play().catch(err => console.log("Playback failed:", err));
}, { once: true }); // only run once

// YouTube IFrame API integration
function onYouTubeIframeAPIReady() {
    const player = new YT.Player('yt-video', {
        events: {
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerStateChange(event) {
    const music = document.getElementById("bg-music");
    // 1 = playing, 2 = paused
    if (event.data === YT.PlayerState.PLAYING) {
        music.pause();
    } else if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED) {
        music.play();
    }
}

// Load YouTube IFrame API
const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
document.body.appendChild(tag);