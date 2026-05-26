addEventListener('keydown', e => {
    // Normalize key
    let letter = '';
    if (/^Key[A-Z]$/.test(e.code)) {
        letter = e.code.replace('Key', '').toLowerCase();
    } else if (/^Digit[0-9]$/.test(e.code)) {
        letter = e.code.replace('Digit', '');
    } else {
        return;
    }

    const allEls = [...document.querySelectorAll('a, [id]')].filter(el => {
        const rect = el.getBoundingClientRect();
        return el.offsetParent != null && rect.width > 0 && rect.height > 0;
    });

    if(letter == 'm' || letter == 't'){
        scrollTo(0,0)
    }
    // ????????????????????????????????????????????????????????????????????
    // Old version
    // const text = el.textContent.trim().toLowerCase();
    // const letteredEls = allEls.filter(el => {
    //     // Special rule for #mainContainer
    //     if (el.id === 'mainContainer') {
    //         return letter === 'm';
    //     }

    //     const text = el.textContent.trim().toLowerCase();
    //     console.log(text)
    //     const words = text.split(/\s+/);

    //     return words.some(word => {
    //         const cleaned = word.replace(/^[^a-z0-9]+/i, '');
    //         if (!cleaned) return false;

    //         if (/^\d+$/.test(cleaned) && /^[0]+[1-9]/.test(cleaned)) {
    //             return cleaned[0] === letter || cleaned.match(/[1-9]/)?.[0] === letter;
    //         }

    //         return cleaned[0] === letter;
    //     });
    // });
    // \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
    //  I have no idea how cloneNode is working but this did the job
    function getCleanText(el) {
        // Clone the element without <sup> tags
        const clone = el.cloneNode(true);
        clone.querySelectorAll('sup').forEach(node => node.remove());
        return clone.textContent.trim().toLowerCase();
    }

    const letteredEls = allEls.filter(el => {
        if (el.id === 'mainContainer') {
            return letter === 'm';
        }
        const text = getCleanText(el);
        const words = text.split(/\s+/);

        return words.some(word => {
            const cleaned = word.replace(/^[^a-z0-9]+/i, '');
            if (!cleaned) return false;

            if (/^\d+$/.test(cleaned) && /^[0]+[1-9]/.test(cleaned)) {
                return cleaned[0] === letter
                    || cleaned.match(/[1-9]/)?.[0] === letter;
            }
            return cleaned[0] === letter;
        });
    });
    // ///////
    // ????????????????????????????????????????????????????????????????????

    if (letteredEls.length === 0) return;

    const activeEl = document.activeElement;
    const iActive = allEls.indexOf(activeEl);
    const iCurrent = letteredEls.indexOf(activeEl);

    const keySignature = `${e.shiftKey ? 'shift+' : ''}${letter}`;
    let iNext;

    if (keySignature !== window.lastKeySignature) {
        if (e.shiftKey) {
            const prev = [...letteredEls].reverse().find(el => allEls.indexOf(el) < iActive);
            iNext = letteredEls.indexOf(prev);
            if (iNext === -1) iNext = letteredEls.length - 1;
        } else {
            const next = letteredEls.find(el => allEls.indexOf(el) > iActive);
            iNext = letteredEls.indexOf(next);
            if (iNext === -1) iNext = 0;
        }
    } else {
        iNext = e.shiftKey
            ? (iCurrent - 1 + letteredEls.length) % letteredEls.length
            : (iCurrent + 1) % letteredEls.length;
    }

    letteredEls[iNext]?.focus();
    window.lastKeySignature = keySignature;
});
