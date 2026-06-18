// side-bar-nav.js
import { homepage } from "../core/main-script.js";
import { handleMKey } from "./m-key-handler.js";
import { changeTutorialLink } from "../ui/change-tutorial-link.js";
import { sideBar, sideBarBtn } from "../ui/toggle-side-bar.js";
import { injectContent } from "../core/inject-content.js";
import { mainTargetDiv } from "./main-content-nav.js";

/* =========================
   STATE
========================= */
export let allSideBarLinks = [...document.querySelectorAll('.side-bar-links a')];
export let parentSideBarLis = [...document.querySelectorAll('.side-bar-links ')];
export let lastClickedSideBarLink = null;
export let lastFocusedSideBarLink = null;

let sideBarFocused = false;
let iSideBarLinks = -1;
let suppressIndexUpdate = false;
export function updateAllSideBarLinks() {
    return document.querySelectorAll('.side-bar-links a')
}
export function updateLastClicked(link) {
    let i = allSideBarLinks.indexOf(link)
    lastClickedSideBarLink = allSideBarLinks[i]
    lastFocusedSideBarLink = allSideBarLinks[i]
}
export function getHrefFromLink(link) {
    let href = lastClickedSideBarLink.href
    return link?.getAttribute('href') || null;
}
/* =========================
   INITIAL LOAD
========================= */
const autoLink = allSideBarLinks.find(el => el.hasAttribute('autofocus'));

if (autoLink) {
    lastClickedSideBarLink = autoLink;
    lastFocusedSideBarLink = autoLink;
    injectContent(autoLink.href);
} else {
    injectContent('homepage.html');
}

/* =========================
   HELPERS
========================= */
function isVisible(el) {
    return el && el.offsetParent !== null;
}

function getVisibleLinks() {
    return allSideBarLinks.filter(isVisible);
}

function isSubLink(el) {
    return !!el.closest('.side-bar-links li ul li a');
}

function getParentTopLink(subLink) {
    const li = subLink.closest('ul')?.closest('li');
    return li?.querySelector(':scope > a');
}

/* =========================
   LINK LISTENERS
========================= */
allSideBarLinks.forEach((el, i) => {
    // CLICK
    el.addEventListener('click', e => {
        e.preventDefault();
        injectContent(el.href);
        console.log('here',e.target)
        changeTutorialLink(e);
        
        lastClickedSideBarLink = el;
        
    });

    // ENTER
    el.addEventListener('keydown', e => {
        const key = e.key.toLowerCase();

        if (key === 'enter') {
            e.preventDefault();
            
            injectContent(el.href);
            changeTutorialLink(e);
            if (e.target == lastClickedSideBarLink) {
                console.log('ehre')
                requestAnimationFrame(() => {
                    const firstStep = mainTargetDiv.querySelector(".step-float");
                    if (firstStep) firstStep.focus();
                    console.log('here')
                    return
                });
            }
            lastClickedSideBarLink = el;
        }

        if (key === 'm') {
            handleMKey({ e, focusZone: mainTargetDiv });
        }
        if (key === 'h') {
            if (!e.target.dataset.id === 'homePageLink') {
                e.preventDefault()
                homepage.focus()
                return
            }

        }
    });

    // FOCUS
    el.addEventListener('focus', () => {
        lastFocusedSideBarLink = el;
        if (!suppressIndexUpdate) {
            iSideBarLinks = i;
        }
    });
});

/* =========================
   SIDEBAR FOCUS TRACKING
========================= */
sideBar.addEventListener('focusin', () => sideBarFocused = true);
sideBar.addEventListener('focusout', () => sideBarFocused = false);

/* =========================
   MAIN KEYBOARD NAV
========================= */
export function sideBarNav({ e, focusZone }) {
    if (focusZone !== 'sideBar') return;
    if(e.target === sideBarBtn){
        return
    }
    if (!e?.key) return;

    const key = e.key.toLowerCase();
    const activeEl = document.activeElement;
    const visibleLinks = getVisibleLinks();

    /* ---- NUMBER KEYS ---- */
    if (!isNaN(key)) {
        const index = parseInt(key) - 1;

        if (isSubLink(activeEl)) {
            const ul = activeEl.closest('ul');
            const subs = [...ul.querySelectorAll('li > a')].filter(isVisible);
            subs[index]?.focus();
        } else {
            visibleLinks[index]?.focus();
        }
        return;
    }

    /* ---- M KEY ---- */
    if (key === 'm') {
        handleMKey({ e, focusZone: mainTargetDiv });
        return;
    }

    /* ---- FORWARD / BACK ---- */
    if (key === 'f' || key === 'a') {
        suppressIndexUpdate = true;

        let current = visibleLinks.indexOf(activeEl);
        if (current === -1) current = 0;

        const delta = key === 'f'
            ? (e.shiftKey ? -1 : 1)
            : -1;

        const next = (current + delta + visibleLinks.length) % visibleLinks.length;
        visibleLinks[next].focus();
        iSideBarLinks = allSideBarLinks.indexOf(visibleLinks[next]);

        suppressIndexUpdate = false;
        return;
    }

    /* ---- S KEY ---- */
    if (key === 's') {
        if (isSubLink(activeEl)) {
            const parent = getParentTopLink(activeEl);
            if (parent) {
                parent.focus();
                iSideBarLinks = allSideBarLinks.indexOf(parent);
                return;
            }
        }
        sideBarBtn.focus();
        return;
    }

    /* ---- T KEY ---- */
    if (key === 't') {
        const tutorialLink = changeTutorialLink(e);
        tutorialLink?.focus();
    }
}

/* =========================
   SIDEBAR BUTTON
========================= */
sideBarBtn.addEventListener('keydown', e => {
    if (e.key.toLowerCase() === 'm') {
        mainTargetDiv.focus();
    }
    if (e.key.toLowerCase() === 'f') {
        e.preventDefault()
        console.log(allSideBarLinks[0])
        iSideBarLinks = 0
        allSideBarLinks[0].focus()
        // mainTargetDiv.focus();
    }
    if(!isNaN(e.key.toLowerCase())){
        const intLet = parseInt(e.key.toLowerCase())
        allSideBarLinks[intLet - 1].focus()
    }
    
});

sideBarBtn.addEventListener('focus', () => {
    // sideBar.scrollIntoView({ behavior: "smooth", block: "start",inline:'start' });
    scrollTo(0,0)
});
