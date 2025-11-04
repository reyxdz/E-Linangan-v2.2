document.addEventListener('DOMContentLoaded', function() {
    const progressBar = document.querySelector('.scroll-progress-bar');
    
    // Calculate scroll progress
    function updateProgress() {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrolled = window.scrollY;
        
        const progress = (scrolled / documentHeight) * 100;
        progressBar.style.width = progress + '%';
    }

    // Update on scroll
    window.addEventListener('scroll', updateProgress);
    
    // Update on resize
    window.addEventListener('resize', updateProgress);
    
    // Initial update
    updateProgress();
});