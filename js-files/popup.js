function openPopup() {
    const overlay = document.getElementById('popupOverlay');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scroll
    playSound();
}

function closePopup() {
    const overlay = document.getElementById('popupOverlay');
    overlay.classList.remove('active');
    document.body.style.overflow = ''; // Restore scroll
    playSound();
}

function closePopupOnOverlay(event) {
    // Close only if clicking on overlay, not the popup content
    if (event.target.id === 'popupOverlay') {
        closePopup();
    }
    playSound();
}

// Close popup with ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closePopup();
    }
    playSound();
});