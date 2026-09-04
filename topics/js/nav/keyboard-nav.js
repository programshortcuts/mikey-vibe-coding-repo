import { letterFocus } from './letter-focus.js';

let letterNavMode = false;
let popupTimer;

export function initKeyboardNav() {
    if (window._keyboardNavInitialized) return;
    window._keyboardNavInitialized = true;

    document.addEventListener('keydown', e => {
        if (
            e.metaKey &&
            e.shiftKey &&
            e.key.toLowerCase() === 'x'
        ) {
            e.preventDefault();
            e.stopImmediatePropagation();
            toggleLetterNavMode();
            return;
        }

        if (!letterNavMode) return;

        if (e.metaKey || e.ctrlKey || e.altKey) return;

        const tag = e.target.tagName;
        if (
            tag === 'INPUT' ||
            tag === 'TEXTAREA' ||
            e.target.isContentEditable
        ) {
            return;
        }

        const key = e.key.toLowerCase();
        if (!/^[a-z0-9]$/.test(key)) return;

        e.preventDefault();
        e.stopImmediatePropagation();

        letterFocus({
            e,
            focusZone: 'letterNav'
        });
    }, true);
}

function toggleLetterNavMode() {
    letterNavMode = !letterNavMode;
    document.body.classList.toggle('letter-nav-mode', letterNavMode);
    showLetterNavPopup();
}

export function isLetterNavMode() {
    return letterNavMode;
}

function showLetterNavPopup() {
    let popup = document.querySelector('#letterNavModePopup');

    if (!popup) {
        popup = document.createElement('div');
        popup.id = 'letterNavModePopup';
        popup.setAttribute('aria-live', 'polite');
        Object.assign(popup.style, {
            position: 'fixed',
            top: '18px',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '10px 18px',
            background: 'rgba(20, 40, 65, 0.94)',
            color: 'white',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 'bold',
            zIndex: '99999',
            pointerEvents: 'none'
        });
        document.body.appendChild(popup);
    }

    popup.textContent = letterNavMode
        ? 'Letter Navigation ON'
        : 'Letter Navigation OFF';
    popup.hidden = false;

    clearTimeout(popupTimer);
    popupTimer = setTimeout(() => {
        popup.hidden = true;
    }, 1400);
}
