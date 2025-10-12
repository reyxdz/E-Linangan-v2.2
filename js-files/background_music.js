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
// Make sure YouTube API is loaded
if (!window.YT) {
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

let players = [];

// Update the YouTube API ready callback
window.onYouTubeIframeAPIReady = function() {
    // Find all YouTube iframes
    const iframes = document.querySelectorAll('iframe[src*="youtube.com"]');
    
    iframes.forEach((iframe, index) => {
        // Ensure iframe has an ID
        if (!iframe.id) {
            iframe.id = 'youtube-player-' + index;
        }
        
        // Create player for each iframe
        const player = new YT.Player(iframe.id, {
            events: {
                'onStateChange': handlePlayerStateChange,
                'onReady': onPlayerReady
            }
        });
        
        players.push(player);
    });
};

function onPlayerReady(event) {
    console.log('Player ready');
}

function handlePlayerStateChange(event) {
    // 1 = playing, 2 = paused, 0 = ended
    if (event.data === YT.PlayerState.PLAYING) {
        bgMusic.pause();
        console.log('Video playing - music paused');
    } else if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED) {
        bgMusic.play();
        console.log('Video paused/ended - music resumed');
    }
}