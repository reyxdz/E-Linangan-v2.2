// Fullscreen handler for paunangPagsusulit
(function () {
    'use strict';

    const introScreen = document.getElementById('introScreen');
    const quizContent = document.getElementById('quizContent');
    const startQuizBtn = document.getElementById('startQuizBtn');
    const exitModal = document.getElementById('exitFsModal');
    const enterBanner = document.getElementById('enterFsBanner');
    const enterFsBtn = document.getElementById('enterFsBtn');
    const fsConfirmExit = document.getElementById('fsConfirmExit');
    const fsCancelExit = document.getElementById('fsCancelExit');

    let hasEntered = false; // whether we successfully entered fullscreen at least once

    // Helper: cross-browser request fullscreen
    function requestFullscreen(el = document.documentElement) {
        const req = el.requestFullscreen || el.webkitRequestFullscreen || el.mozRequestFullScreen || el.msRequestFullscreen;
        if (!req) return Promise.reject(new Error('Fullscreen API not supported'));
        try {
            return req.call(el);
        } catch (err) {
            return Promise.reject(err);
        }
    }

    function exitFullscreen() {
        const exit = document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen || document.msExitFullscreen;
        if (!exit) return Promise.reject(new Error('Exit fullscreen not supported'));
        try {
            return exit.call(document);
        } catch (err) {
            return Promise.reject(err);
        }
    }

    function isFullscreen() {
        return !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement);
    }

    function showExitModal() {
        if (!exitModal) return;
        exitModal.classList.remove('hidden');
        exitModal.setAttribute('aria-hidden', 'false');
    }

    function hideExitModal() {
        if (!exitModal) return;
        exitModal.classList.add('hidden');
        exitModal.setAttribute('aria-hidden', 'true');
    }

    function showEnterBanner() {
        if (!enterBanner) return;
        enterBanner.classList.remove('hidden');
        enterBanner.setAttribute('aria-hidden', 'false');
    }

    function hideEnterBanner() {
        if (!enterBanner) return;
        enterBanner.classList.add('hidden');
        enterBanner.setAttribute('aria-hidden', 'true');
    }

    // Called on load to try entering fullscreen
    function tryEnterFullscreen() {
        requestFullscreen().then(() => {
            hasEntered = true;
            hideEnterBanner();
            hideExitModal();
        }).catch(() => {
            // Auto-enter blocked (typical on mobile). Show tap banner so user can enter.
            showEnterBanner();
        });
    }

    // Fullscreen change handler
    function onFullChange() {
        const fs = isFullscreen();
        if (fs) {
            // Entered fullscreen
            hasEntered = true;
            hideExitModal();
            hideEnterBanner();
        } else {
            // Exited fullscreen
            // Only prompt if we had previously entered fullscreen
            if (hasEntered) {
                showExitModal();
            }
        }
    }

    // Start the quiz in fullscreen
    function startQuiz() {
        requestFullscreen().then(() => {
            hasEntered = true;
            hideEnterBanner();
            hideExitModal();
            // Hide intro and show quiz
            introScreen.classList.add('hidden');
            quizContent.classList.remove('hidden');
        }).catch(() => {
            // If fullscreen fails, still show quiz but with banner
            introScreen.classList.add('hidden');
            quizContent.classList.remove('hidden');
            showEnterBanner();
        });
    }

    // Wire events
    document.addEventListener('fullscreenchange', onFullChange, false);
    document.addEventListener('webkitfullscreenchange', onFullChange, false);
    document.addEventListener('mozfullscreenchange', onFullChange, false);
    document.addEventListener('MSFullscreenChange', onFullChange, false);

    // Handle browser back/forward navigation
    window.addEventListener('popstate', function(e) {
        if (hasEntered) {
            // Prevent the default navigation
            history.pushState(null, '', window.location.href);
            // Show the exit modal
            showExitModal();
        }
    });

    // Push initial state when quiz starts
    history.pushState(null, '', window.location.href);

    // Buttons
    if (enterFsBtn) {
        enterFsBtn.addEventListener('click', function (e) {
            e.preventDefault();
            tryEnterFullscreen();
        });
    }

    if (fsConfirmExit) {
        fsConfirmExit.addEventListener('click', function () {
            // User confirmed exit: redirect to index
            hideExitModal();
            setTimeout(function () { window.location.href = 'pambungad.html'; }, 150);
        });
    }

    if (fsCancelExit) {
        fsCancelExit.addEventListener('click', function () {
            // Try to re-enter fullscreen
            hideExitModal();
            requestFullscreen().then(() => {
                hasEntered = true;
                hideEnterBanner();
            }).catch(() => {
                // Show banner to allow user to tap
                showEnterBanner();
            });
        });
    }

    // Wire up the start button
    if (startQuizBtn) {
        startQuizBtn.addEventListener('click', startQuiz);
    }

    // Handle ESC key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            if (exitModal && !exitModal.classList.contains('hidden')) {
                window.location.href = 'pambungad.html';
            }
        }
    });
})();
