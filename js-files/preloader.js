// Track loading progress
let progress = 0;
const progressBar = document.getElementById('progress');
const loader = document.getElementById('loader');
const content = document.getElementById('loadercontent');

// Simulate progress (for demonstration)
const updateProgress = (value) => {
    progress = value;
    progressBar.style.width = progress + '%';
};

// Get all resources to load
const images = document.querySelectorAll('img');
const totalResources = Math.max(images.length + 1, 2); // Ensure at least 2 resources to load
let loadedResources = 0;

const resourceLoaded = () => {
    loadedResources++;
    updateProgress((loadedResources / totalResources) * 100);
    
    if (loadedResources === totalResources) {
        finishLoading();
    }
};

// Start loading sequence immediately
resourceLoaded();

// Load all images if they exist
if (images.length > 0) {
    images.forEach(img => {
        if (img.complete) {
            resourceLoaded();
        } else {
            img.addEventListener('load', resourceLoaded);
            img.addEventListener('error', resourceLoaded);
        }
    });
}

// Wait for DOM to be fully loaded
if (document.readyState === 'complete') {
    resourceLoaded();
} else {
    window.addEventListener('load', resourceLoaded);
}

function finishLoading() {
    // Add display block before fading out
    content.style.display = 'block'; 
    
    setTimeout(() => {
        loader.classList.add('fade-out');
        content.classList.add('visible');
        
        setTimeout(() => {
            loader.style.display = 'none';
            document.body.style.overflow = 'auto';
            // Remove black background
            document.body.style.backgroundColor = '';
        }, 500);
    }, 300);
}

// Fallback: Force load after 10 seconds
setTimeout(() => {
    if (loader.style.display !== 'none') {
        finishLoading();
    }
}, 10000);