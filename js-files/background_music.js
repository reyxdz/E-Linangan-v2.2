// Make audio elements globally accessible
window.clickSound = new Audio('audios/wtbutton.mp3');
window.bgMusic = new Audio('audios/wtbgmusic.mp3');
bgMusic.loop = true;
bgMusic.volume = 0.3;

window.playSound = function() {
    clickSound.currentTime = 0;
    clickSound.play().catch(e => console.log('Sound not loaded'));
}

// Background music autoplay
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


// ===== YouTube Multiple Videos Control =====
// Load YouTube API only once
if (!window.YT) {
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
}

let players = [];

// YouTube API ready callback
window.onYouTubeIframeAPIReady = function() {
    // Find all YouTube iframes
    const iframes = document.querySelectorAll('iframe[src*="youtube.com"]');
    
    iframes.forEach((iframe, index) => {
        // Give ID if it doesn't have one
        if (!iframe.id) {
            iframe.id = 'youtube-player-' + index;
        }
        
        // Add enablejsapi if missing
        const src = iframe.src;
        if (!src.includes('enablejsapi=1')) {
            iframe.src = src + (src.includes('?') ? '&' : '?') + 'enablejsapi=1';
        }

        // Create player for each iframe
        const player = new YT.Player(iframe.id, {
            events: {
                'onStateChange': handlePlayerStateChange
            }
        });
        
        players.push(player);
    });
};

function handlePlayerStateChange(event) {
    // Check if any video is currently playing
    let anyVideoPlaying = false;
    
    players.forEach(player => {
        try {
            if (player.getPlayerState && player.getPlayerState() === 1) {
                anyVideoPlaying = true;
            }
        } catch(e) {
            // Ignore errors
        }
    });

    // Control background music based on video state
    if (anyVideoPlaying) {
        bgMusic.pause();
        console.log('Video playing - music paused');
    } else {
        bgMusic.play();
        console.log('No video playing - music resumed');
    }
}