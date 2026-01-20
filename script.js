
// script.js - universal pentru întregul site
document.addEventListener('DOMContentLoaded', function () {
    // --- Re-enable selection, copy, and context menu site-wide ---
    (function enableCopyAndSelection() {
        try {
            const body = document.body;
            if (body) {
                ['oncontextmenu','onselectstart','ondragstart','oncut','oncopy','onpaste'].forEach(function(attr){
                    try { body[attr] = null; } catch (_) {}
                });
                // Ensure CSS allows selection
                body.style.userSelect = 'text';
                body.style.webkitUserSelect = 'text';
                body.style.msUserSelect = 'text';
            }
            // Clear any document-level handlers if present
            document.oncontextmenu = null;
            document.onselectstart = null;
            document.ondragstart = null;
            document.oncut = null;
            document.oncopy = null;
            document.onpaste = null;
        } catch (_) { /* no-op */ }
    })();
    // --- Parolă pentru paginile de testare inițială ---
    (function passwordProtection() {
        const parole = {
            'clasa a V-a': 'istorie5',
            'clasa a VI-a': 'istorie6',
            'clasa a VII-a': 'istorie7',
            'clasa a VII-a': 'geografie7',
            'clasa a VIII-a': 'istorie8'
        };
        const overlay = document.getElementById('passwordOverlay');
        const form = document.getElementById('passwordForm');
        const input = document.getElementById('passwordInput');
        const error = document.getElementById('passwordError');
        const protectedContent = document.getElementById('protectedContent');
        if (overlay && form && input && protectedContent) {
            error.style.display = 'none';
            form.addEventListener('submit', function (e) {
                e.preventDefault();
                let clasa = 'clasa a V-a';
                if (input.placeholder.includes('VI')) clasa = 'clasa a VI-a';
                if (input.placeholder.includes('VII')) clasa = 'clasa a VII-a';
                if (input.placeholder.includes('VIII')) clasa = 'clasa a VIII-a';
                if (input.value === parole[clasa]) {
                    overlay.style.display = 'none';
                    protectedContent.style.display = '';
                    error.style.display = 'none';
                    input.value = '';
                } else {
                    error.style.display = 'block';
                    input.value = '';
                }
            });
        }
    })();

    // --- Scroll smooth pentru toate linkurile interne ---
    (function smoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
            anchor.addEventListener('click', function (e) {
                const targetId = this.getAttribute('href').slice(1);
                const target = document.getElementById(targetId);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    })();

    // --- Efect de highlight pe carduri la hover (pentru desktop) ---
    (function cardHoverEffect() {
        const cards = document.querySelectorAll('.class-card, .lesson-card, .quiz-card');
        cards.forEach(function(card) {
            card.addEventListener('mouseenter', function() {
                card.classList.add('active-card');
            });
            card.addEventListener('mouseleave', function() {
                card.classList.remove('active-card');
            });
        });
    })();

    // --- Închidere overlay chat dacă există (pentru viitor) ---
    (function closeChatOverlay() {
        const closeBtn = document.querySelector('.close-chat');
        const chatOverlay = document.querySelector('.chat-overlay');
        if (closeBtn && chatOverlay) {
            closeBtn.addEventListener('click', function() {
                chatOverlay.style.display = 'none';
            });
        }
    })();

    // --- Fallback: ascunde protected-content dacă nu există parolă/overlay ---
    (function fallbackProtectedContent() {
        const overlay = document.getElementById('passwordOverlay');
        const protectedContent = document.getElementById('protectedContent');
        if (!overlay && protectedContent) {
            protectedContent.style.display = '';
        }
    })();

    // --- Alte funcții de UI pot fi adăugate aici ---
});
