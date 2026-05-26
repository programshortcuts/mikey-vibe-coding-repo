// side-bar-nav.js
import { handleMKey } from "./m-key-handler.js";
import { changeTutorialLink } from "../ui/change-tutorial-link.js";
import { lastStep } from "./step-nav.js";
import { sideBar, sideBarBtn,navBarLessonTitle } from "../ui/toggle-side-bar.js";
import { injectContent } from "../core/inject-content.js";
import { mainTargetDiv } from "./main-content-nav.js";
let sideBarLinks = [...document.querySelectorAll('.side-bar-links > li > a')];
export let allSideBarLinks = [...document.querySelectorAll('.side-bar-links a')]; // all links including nested
let subSideBarLinks = [...document.querySelectorAll('.side-bar-links > li > ul > li > a')]; // all links including nested
let sideBarFocused = true;
let iSideBarLinks = -1;
let suppressIndexUpdate = false;
export let lastClickedSideBarLink = null
export let lastFocusedSideBarLink = null
export let clickedSubSideLink = null
// ===== Initial content load (NO focus) =====
const autoLink = allSideBarLinks.find(el => el.hasAttribute('autofocus'));

if (autoLink) {
    lastFocusedSideBarLink = autoLink;
    lastClickedSideBarLink = autoLink;
    injectContent(autoLink.href);
} else {
    injectContent('homepage.html');
}

// sub side bar link handling, (( the link that drop down ))
export function updateLastClicked(link){
    let i = allSideBarLinks.indexOf(link)
    lastClickedSideBarLink = allSideBarLinks[i]
    lastFocusedSideBarLink = allSideBarLinks[i]
}
export function getHrefFromLink(link) {
    let href = lastClickedSideBarLink.href
    return link?.getAttribute('href') || null;
}
// I think 
// ** I need to add event listener for when document first i loaded what element has focus, if 
// sidebar link that link is lastClickedSideBarLink*/
subSideBarLinks.forEach(el => {
    el.addEventListener('focus', e => {
        clickedSubSideLink = null
    });
    el.addEventListener('keydown', e => {
        let key = e.key.toLowerCase()
        if(key === 'enter'){
            lastClickedSideBarLink = e.target
            if(el == clickedSubSideLink){
                mainTargetDiv.focus()
            }
            clickedSubSideLink = el
        }        
    });
})
// Track focus
sideBar.addEventListener('focusin', () => sideBarFocused = true);
sideBar.addEventListener('focusout', () => sideBarFocused = false);
// Determine if an element is a subLink (nested inside li > ul > li)
function isSubLink(el) {
    return el.closest('.side-bar-links > li > ul > li a');
}
// I DO NOT Know IF THIS IS Doing anything, I think i have to initialize this somewhere
// Track index updates
allSideBarLinks.forEach((el, i) => {
    // Dropdown toggle
    if (el.classList.contains('drop-down')) {
        el.addEventListener('click', (e) => {
            e.preventDefault()
            const nextOl = el.nextElementSibling;
            if (nextOl && nextOl.tagName === 'OL') {
                nextOl.classList.toggle('show');
            }
        });
        el.addEventListener('keydown', (e) => {
            let key = e.key.toLowerCase()
            if(key === 'enter'){
                e.preventDefault()
                scrollTo(0,0)
                lastClickedSideBarLink = e.target
                injectContent(e.target.href)
            }
            if(key === 'm'){
                // handleMKey({e,focusZone:mainTargetDiv});
                return;
            }
        });
    } else {
        el.addEventListener('click', e => {
            e.preventDefault()
            // e.stopPropagation()
        })
        el.addEventListener('keydown', e => {
            let key = e.key.toLowerCase()
            if (key === 'm') {
                // handleMKey({e,focusZone:mainTargetDiv})
                return;
            }
        }) 
    }
    el.addEventListener('keydown', e => {
        let key = e.key.toLowerCase()
        if (key === 'm') {
            handleMKey({e,focusZone:mainTargetDiv})
            return;
        }
        if(key === 'enter'){
            changeTutorialLink(e)
        }
    })  
    el.addEventListener('focus', (e) => {
        lastFocusedSideBarLink = e.target
        if (!suppressIndexUpdate) {
            iSideBarLinks = i;
        }
    });
    el.addEventListener('click', (e) => {
        e.preventDefault()
        injectContent(e.target.href)
        changeTutorialLink(e)
        lastClickedSideBarLink = e.target
    });
    //  DO NOT NEED 'keydown' with 'click' 
});
// Main keyboard nav
export function sideBarNav({ e , focusZone}) {
    // if (!sideBarFocused) return;
    if(focusZone != 'sideBar') return 
    if(!e || !e.key) return 
    const key = e.key.toLowerCase();
    // Number keys
    if (!isNaN(key)) {
        const intLet = parseInt(key);

        const activeEl = document.activeElement;

        // Sublist logic
        if (isSubLink(activeEl)) {
            const currentSubList = activeEl.closest('ul'); // the current ol
            const subLinks = [...currentSubList.querySelectorAll('li > a')].filter(a => a.offsetParent !== null);
            subLinks[intLet - 1]?.focus();
        } else {
            // Top-level links
            sideBarLinks[intLet - 1]?.focus();
        }
        return;
    }
    const visibleLinks = allSideBarLinks.filter(link => link.offsetParent !== null);
    if(key === 'm'){
          handleMKey({e,focusZone:mainTargetDiv})
        return;
    }
    // 'f' key moves forward
    if (key === 'f') {
        const visibleLinks = allSideBarLinks.filter(link => link.offsetParent !== null);
        const activeEl = document.activeElement;

        // Find current position *within* visibleLinks
        let currentVisibleIndex = visibleLinks.indexOf(activeEl);

        // Move forward (wrap around if needed)
        
        if(!e.shiftKey){

            suppressIndexUpdate = true;

            // Refresh visibleLinks
            const nextIndex = (currentVisibleIndex + 1) % visibleLinks.length;
            // Focus the next visible link
            visibleLinks[nextIndex].focus();
            // Update global index to match new focus
            iSideBarLinks = allSideBarLinks.indexOf(visibleLinks[nextIndex]);
            suppressIndexUpdate = false;
        } else {

            suppressIndexUpdate = true;

            // Refresh visibleLinks
            const prevIndex = (currentVisibleIndex - 1 + visibleLinks.length) % visibleLinks.length;
            // Focus the next visible link
            visibleLinks[prevIndex].focus();
            // Update global index to match new focus
            iSideBarLinks = allSideBarLinks.indexOf(visibleLinks[prevIndex]);
            suppressIndexUpdate = false;

        }
    }
    // 'a' key moves backward
    if (key === 'a') {
        suppressIndexUpdate = true;

        const visibleLinks = allSideBarLinks.filter(link => link.offsetParent !== null);
        const activeEl = document.activeElement;

        let currentVisibleIndex = visibleLinks.indexOf(activeEl);
        const prevIndex = (currentVisibleIndex - 1 + visibleLinks.length) % visibleLinks.length;

        visibleLinks[prevIndex].focus();

        iSideBarLinks = allSideBarLinks.indexOf(visibleLinks[prevIndex]);

        suppressIndexUpdate = false;
    }
    // 's' key: move from sublink back to parent top-level link
    if (key === 's') {
        const activeEl = document.activeElement;
        // If sublink, go to its parent top-level link
        if (isSubLink(activeEl)) {
            const ul = activeEl.closest('ul.drop-snips') || activeEl.closest('ul');
            const parentLi = ul?.closest('.side-bar-links > li') || ul?.closest('li');
            const parentLink = parentLi?.querySelector(':scope > a.drop-down') || parentLi?.querySelector(':scope > a');
            if (parentLink) {
                e.preventDefault()
                // suppressIndexUpdate = true;
                parentLink.focus();
                // update index to parent's index explicitly so visible f/a navigation continues correctly
                iSideBarLinks = allSideBarLinks.indexOf(parentLink);
                // suppressIndexUpdate = false;
                return;
            }
        } else {
            sideBarBtn.focus()
            return
        }

        // If a drop-down link itself has focus, pressing 's' again moves to sidebar button
        if (activeEl && activeEl.classList && activeEl.classList.contains('drop-down')) {
            suppressIndexUpdate = true;
            sideBarBtn.focus();
            scrollTo(0,0)
            // set index to -1 or 0 depending on how you want f navigation to behave
            iSideBarLinks = -1;
            suppressIndexUpdate = false;
            return;
        }

        // Fallback: if not in sublink or drop-down, reset index
        iSideBarLinks = 0;
    }
    if (key === 't') {
        const tutorialLink = changeTutorialLink(e)
        tutorialLink.focus()
    }
}
sideBarBtn.addEventListener('keydown', e => {
    let key = e.key.toLowerCase()
    if(key === 'm'){
        mainTargetDiv.focus()
    }
});
sideBarBtn.addEventListener('focus', e => {
    // sideBar.scrollIntoView({behavior: 'smooth', block: 'end', inline: 'nearest'})
    sideBar.scrollIntoView({ behavior: "smooth", block: "start" });
    console.log('here',sideBar)

});