export function addCopyCode() {
    const copyCodes = document.querySelectorAll('.copy-code')
    copyCodes.forEach(el => {
        el.addEventListener('keydown', e => {
            if (e.key == 'c' && e.metaKey) {
                console.log('yes')
                if (e.target.value) {
                    copyTextToClipboard(e.target.value)
                }
                if (e.target.innerText) {
                    copyTextToClipboard(e.target.innerText)

                }
                // copyTextToClipboard(e.target.innerText)
                animate(el)
                el
            }
        })
        el.addEventListener('click', e => {
            e.preventDefault()
            e.stopPropagation()
            handleCopy(e)
            animate(el)
            const step = e.target.closest('.step-float')
            step.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
        })
    })
    function handleCopy(e) {
        // Always copy the text from mainScript regardless of source
        const textToCopy = e.target.innerText
        copyTextToClipboard(textToCopy);
        // console.log(animateCode)

    }

    function setupCopyShortcut(element) {
        element.addEventListener('keydown', e => {
            // Check Command (metaKey) + C (case-insensitive)
            if (e.metaKey && (e.key === 'c' || e.key === 'C')) {
                e.preventDefault(); // prevent default copy just to be safe
                handleCopy(e.target);
            }
        });

        // Optional: animate on click for code elements as you had
        element.addEventListener('click', e => {
            e.preventDefault()
            const stepFloat = e.target.closest('.step-float')
            stepFloat.scrollIntoView({behavior:'instant', inline: 'nearest', block: 'center'})
            // handleCopy(e.taget, true);

        });
    }

    // Setup for mainScript and both buttons

}
function copyTextToClipboard(text) {
    return navigator.clipboard.writeText(text).catch(err => {
        console.error("Unable to copy text to clipboard:", err);
    });
}
function animate(element) {
    element.classList.remove('decopied', 'copied'); // reset classes fast
    element.classList.add('copied');
    setTimeout(() => {
        element.classList.remove('copied');
        element.classList.add('decopied');
    }, 250);
}