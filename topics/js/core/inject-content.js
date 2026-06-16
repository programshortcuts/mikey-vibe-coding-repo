// inject-content.js
let iAllSideBarLinks = 0
import { allSideBarLinks,lastClickedSideBarLink,updateLastClicked,getHrefFromLink } from "../nav/side-bar-nav.js";
import { mainContainer } from "../ui/toggle-side-bar.js";
import { mainTargetDiv } from "../nav/main-content-nav.js";
import { initStepNavigation } from "../nav/step-nav.js";
import { removeLastStep } from "../nav/step-nav.js";
import { handleSKeySideBarNav } from "./main-script.js";

import { updateImgs } from "../ui/toggle-img-sizes.js";
import { addCopyCode } from "../ui/copy-code.js";
export const nxtBtn = document.querySelector('#endNxtBtn')
export const prevBtn = document.querySelector('#prevBtn')

// Temporary fix, i'm quering step-floats again which i shouldn't
export const lessonBtnsContainer = document.querySelector('.lesson-btns-container')
lessonBtnsContainer.addEventListener('keydown', e => {
    let key = e.key.toLowerCase()   
    const steps = document.querySelectorAll('.step-float')

    if(key === 'a'){
        mainTargetDiv.scrollIntoView({behavior:'smooth', block: 'end',inline:'nearest'})
        steps[steps.length - 1].focus()
    }
});
// nxtBtn.addEventListener('click', e => {})
nxtBtn.addEventListener('keydown', e => {
    const key = e.key.toLowerCase();
    if (key === 'm') mainTargetDiv.focus();
    if (key === 's') handleSKeySideBarNav(e);
    // move forward
    if (key === 'enter') {
        e.preventDefault()
        e.stopPropagation()
        // start from the last clicked link
        iAllSideBarLinks = allSideBarLinks.indexOf(lastClickedSideBarLink);
        iAllSideBarLinks = (iAllSideBarLinks + 1) % allSideBarLinks.length;
        updateLastClicked(allSideBarLinks[iAllSideBarLinks])
        const href = getHrefFromLink(allSideBarLinks[iAllSideBarLinks])
        if (href) {
            handleHighlight()
            injectContent(href);
        }
    }
});
nxtBtn.addEventListener('click', e => {
    e.preventDefault()
    e.stopPropagation()
    iAllSideBarLinks = allSideBarLinks.indexOf(lastClickedSideBarLink);
    iAllSideBarLinks = (iAllSideBarLinks + 1) % allSideBarLinks.length;
    updateLastClicked(allSideBarLinks[iAllSideBarLinks])
    const href = getHrefFromLink(allSideBarLinks[iAllSideBarLinks])
    if (href) {
        handleHighlight()
        injectContent(href);
    }
});
// move backward
prevBtn.addEventListener('keydown', e => {
    const key = e.key.toLowerCase();
    
    if (key === 'm') mainTargetDiv.focus();
    if (key === 's') handleSKeySideBarNav(e);
    if (key === 'enter') {
        iAllSideBarLinks = (iAllSideBarLinks - 1 + allSideBarLinks.length) % allSideBarLinks.length;
        updateLastClicked(allSideBarLinks[iAllSideBarLinks])
        const href = getHrefFromLink(allSideBarLinks[iAllSideBarLinks])
        if (href) {
            handleHighlight()
            injectContent(href);
        }
    }
});
prevBtn.addEventListener('click', e => {
    e.preventDefault()
    e.stopPropagation()
    iAllSideBarLinks = (iAllSideBarLinks - 1 + allSideBarLinks.length) % allSideBarLinks.length;
    updateLastClicked(allSideBarLinks[iAllSideBarLinks])
    const href = getHrefFromLink(allSideBarLinks[iAllSideBarLinks])
    if (href) {
        injectContent(href);
    }
});

function handleHighlight(){
    allSideBarLinks.forEach(el => {
        if (el.classList.contains('highlight')) {
            el.classList.remove('highlight')
        }
    })
    let nxtLessonSideBarLi = allSideBarLinks[iAllSideBarLinks]
    nxtLessonSideBarLi.classList.add('highlight')
    const dropSnips = nxtLessonSideBarLi.closest('.drop-snips')
    if(dropSnips.classList.contains('hide')) dropSnips.classList.remove('hide')
}
function isVisible(el) {
    return !!(el && el.offsetParent);
}
export function injectContent(href) {
    fetch(href)
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return response.text();
        })
        .then(html => {
            // Insert HTML into the main container
            mainTargetDiv.innerHTML = html; 
            scrollTo(0,0)
            initStepNavigation({ mainTargetDiv})
            removeLastStep()
            addCopyCode()
            // Update nav lesson title if available
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            updateImgs()
            
            // Optional callback after injection
            if (typeof callback === "function") callback();
        })
        .catch(err => {console.error('Failed to load content:', err);});
}
