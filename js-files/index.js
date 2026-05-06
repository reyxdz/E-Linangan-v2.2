// Slider Logic
let items = document.querySelectorAll('.slider .list .item');

// CONFIG PARAMETER
let countItem = items.length;
let itemActive = 0;

if (countItem > 0) {
    let refreshInterval = setInterval(() => {
        itemActive = (itemActive + 1) % countItem;
        showSlider();
    }, 3000);
}

function showSlider() {
    if (countItem === 0) return;
    // REMOVE OLD ACTIVE ITEM
    items.forEach(item => item.classList.remove('active'));
    // NEW ACTIVE ITEM
    items[itemActive].classList.add('active');
}

// Navigation Menu Toggle
const navMenu = document.getElementById('nav-menu'),
      navToggle = document.getElementById('nav-toggle'),
      navClose = document.getElementById('nav-close');

// Menu Show
if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.add('show-menu');
    });
}

// Menu Hidden
if (navClose) {
    navClose.addEventListener('click', () => {
        navMenu.classList.remove('show-menu');
    });
}





// LOADER
window.addEventListener('load', () => {
    const preloader = document.querySelector('.body');
    if (preloader) {
        preloader.classList.add('fade-out');

        setTimeout(() => {
        window.location.href = "welcome.html";
        }, 1000); // adjust delay based on your fade-out animation
    }
});





// POP-UP BEFORE TAKING THE QUIZZES
function openPopup() {
    document.getElementById('overlay').classList.add('active');
}

function closePopup() {
    document.getElementById('overlay').classList.remove('active');
}

function proceedToQuiz() {
    window.location.href = "paunangPagsusulit.html";
    closePopup(); // if you're hiding a modal or popup
}


// Close popup when pressing Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closePopup();
    }
});





// Dropdown functionality
document.addEventListener('DOMContentLoaded', function() {
    const dropdownToggle = document.getElementById('nilalaman-toggle');
    if (dropdownToggle) {
        const dropdown = dropdownToggle.closest('.dropdown');
        
        dropdownToggle.addEventListener('click', function(e) {
            e.preventDefault();
            dropdown.classList.toggle('active');
            
            // Close dropdown when clicking outside
            document.addEventListener('click', function(event) {
                if (!dropdown.contains(event.target)) {
                    dropdown.classList.remove('active');
                }
            });
        });
    }
});





// 1. Mark current lesson as finished
const currentPage = location.pathname.split("/").pop(); // e.g. aralin1.html
const currentLink = document.querySelector(`a[href='${currentPage}']`);

if (currentLink && currentLink.dataset.lesson) {
localStorage.setItem("lesson" + currentLink.dataset.lesson, "finished");
}

// 2. Highlight finished lessons
document.querySelectorAll("a[data-lesson]").forEach(link => {
const lessonNum = link.dataset.lesson;
if (localStorage.getItem("lesson" + lessonNum) === "finished") {
    link.classList.add("finished");
}
});

// 3. Also highlight the current page differently
if (currentLink) {
currentLink.classList.add("active");
}





//---------- GAMES CONTAINER STARTS ----------//
function scrollGames(direction) {
    const wrapper = document.getElementById('gamesWrapper');
    if (!wrapper) return;
    const scrollAmount = 300;
    
    if (direction === 'left') {
        wrapper.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
        wrapper.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
}

// Hide/show scroll buttons based on scroll position
const wrapper = document.getElementById('gamesWrapper');
if (wrapper) {
    wrapper.addEventListener('scroll', function() {
        const leftButton = document.querySelector('.scroll-left');
        const rightButton = document.querySelector('.scroll-right');
        
        // Hide left button if at the start
        if (leftButton) {
            if (wrapper.scrollLeft <= 0) {
                leftButton.style.opacity = '0.3';
            } else {
                leftButton.style.opacity = '0.7';
            }
        }
        
        // Hide right button if at the end
        if (rightButton) {
            if (wrapper.scrollLeft >= wrapper.scrollWidth - wrapper.clientWidth - 1) {
                rightButton.style.opacity = '0.3';
            } else {
                rightButton.style.opacity = '0.7';
            }
        }
    });

    // Initialize button states
    window.addEventListener('load', function() {
        wrapper.dispatchEvent(new Event('scroll'));
    });

    // Touch/swipe support for mobile
    let isDown = false;
    let startX;
    let scrollLeft;

    wrapper.addEventListener('mousedown', (e) => {
        isDown = true;
        wrapper.style.cursor = 'grabbing';
        startX = e.pageX - wrapper.offsetLeft;
        scrollLeft = wrapper.scrollLeft;
    });

    wrapper.addEventListener('mouseleave', () => {
        isDown = false;
        wrapper.style.cursor = 'grab';
    });

    wrapper.addEventListener('mouseup', () => {
        isDown = false;
        wrapper.style.cursor = 'grab';
    });

    wrapper.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - wrapper.offsetLeft;
        const walk = (x - startX) * 2;
        wrapper.scrollLeft = scrollLeft - walk;
    });
}
//---------- GAMES CONTAINER ENDS -----------//