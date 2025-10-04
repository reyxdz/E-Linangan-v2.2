// Detect screen size and redirect
function redirectBasedOnScreenSize() {
    const screenWidth = window.innerWidth;
    const currentPage = window.location.pathname;
    
    if (screenWidth <= 900) {
        // Mobile screen
        if (!currentPage.includes('walkthrough-sm.html')) {
            window.location.href = 'walkthrough-sm.html';
        }
    } else {
        // Desktop screen
        if (!currentPage.includes('walkthrough-lg.html')) {
            window.location.href = 'walkthrough-lg.html';
        }
    }
}

// Run on page load
redirectBasedOnScreenSize();

// Run on window resize
window.addEventListener('resize', redirectBasedOnScreenSize);
