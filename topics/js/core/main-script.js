// main-script.js
// ===== Imports =====
import { injectContent } from "./inject-content.js";
import { updateAllSideBarLinks } from "../nav/side-bar-nav.js";
// import { allSideBarLinks } from "../nav/side-bar-nav.js";
import { nxtBtn,prevBtn } from "./inject-content.js";
import { initTutorialLink } from "../ui/change-tutorial-link.js";
import { letterFocus } from "../nav/letter-focus.js";
import { getFocusZone } from "../nav/get-focus-zone.js";
import { initDropDowns,hideTopicSnips } from "../ui/drop-downs-sidebar-temp.js";
import { handleStepNav, lastStep } from "../nav/step-nav.js";
import { initToggleSidebar, mainContainer, sideBar, sideBarBtn } from "../ui/toggle-side-bar.js";
import { sideBarNav, lastClickedSideBarLink, lastFocusedSideBarLink } from "../nav/side-bar-nav.js";
import { mainContentNav, mainTargetDiv } from "../nav/main-content-nav.js";
export const navBarLessonTitle = document.querySelector('#navBarLessonTitle');
export const tutorialLink = document.querySelector('#tutorialLink')
export const homepage = document.querySelector('#homePageLink')
export const homepageSideBar = document.querySelector('#homepageSidebar')
// This is event listener is sloppy, fix in colorCode template
navBarLessonTitle.addEventListener('keydown', e => {
    let key = e.key.toLowerCase()
    if (key === 's') {
        console.log('ehre')
        sideBarBtn.focus()
        scrollTo(0, 0)
        return
    }
});
// ===== Initialization =====
document.addEventListener('DOMContentLoaded', initMain);
function initMain(e) {
    // Prevent re-initialization if script runs twice (e.g. reinjected content)
    if (window._mainScriptInitialized) return;
    initTutorialLink()
    window._mainScriptInitialized = true;
    // Initialize UI elements
    initDropDowns({ e });
    initToggleSidebar({ e });
    // Detect and handle initial focus zone
    const initialZone = getFocusZone({ el: document.activeElement });
    // const initialZone = 'sideBar'
    if (initialZone === 'sideBar') sideBarNav({ e, focusZone: initialZone });
    // letterFocus({ e, focusZone: initialZone });
    // Initialize event listeners
    setupSidebarShortcuts();
    setupGlobalKeyListener();
}
// ===== Sidebar “S” Key Shortcut =====
function setupSidebarShortcuts() {
    if (!sideBarBtn || !navBarLessonTitle) return;
    sideBarBtn.addEventListener('keydown', handleSKeySideBarNav);
    navBarLessonTitle.addEventListener('keydown', handleSKeySideBarNav);
}
export function handleSKeySideBarNav(e) {
    const key = e.key.toLowerCase();
    if(key === 's'){
        e.preventDefault();
        e.stopPropagation();
        if(mainContainer.classList.contains('collapsed')){
            mainContainer.classList.remove('collapsed')
        }
        // Ensure references exist before using them
        if (!lastClickedSideBarLink && !lastFocusedSideBarLink) return;
        const dropSnips = lastClickedSideBarLink?.closest?.('ul');
        if (!mainContainer.classList.contains('collapsed')){

            if (lastClickedSideBarLink && dropSnips && !dropSnips.classList.contains('hide')) {
                lastClickedSideBarLink.focus();
            } else if(lastFocusedSideBarLink ) {
                lastFocusedSideBarLink?.focus();
            }
        } else {
            return 
        }
    }
}
// ===== Global Key Listener =====
function setupGlobalKeyListener() {
    addEventListener('keydown', (e) => {
        if (!e || !e.key) return;
        const key = e.key.toLowerCase();
        let focusZone = getFocusZone({ e });
        if (e.key.toLowerCase() === 't') {
            tutorialLink.focus()
            return
        }
        
        
        // /////////////////       I DID IT !!!!!!!!!         /////////////////
        const allowedKeys = ['b','c','d','e','h','p','n']
        if(allowedKeys.includes(key)) {
            focusZone = 'header'
        }
        if(e.target === mainTargetDiv){
            focusZone = 'mainTargetDiv'
            if(key === 'enter'){
                const firstStep = mainTargetDiv.querySelector('.step-float')
                firstStep.focus()
            }
        }
        /** The ABOVE 4 LINES !!! fixes it ALLL!!, I sandboxed in when to be each focusZone with THIS !!!!
         * Took since pretty much March 25', but this page particulary since August, it's now November 22,2025
         */
        // Always allow letterFocus everywhere (header, outside zones, etc.)
        // --- normal per-zone behavior ---        
        switch (focusZone) {
            case 'sideBar':
                sideBarNav({ e, focusZone });
                break;
            case 'mainTargetDiv':
                mainContentNav({ e, focusZone });
                break;
            case 'header':
                // header links will respond naturally to letterFocus
                letterFocus({e, focusZone})
                break;
            default:
                // Nothing now
                break;
        }

        // Remove this once you implement best letterfocus / keyboard nav
        if (e.key.toLowerCase() === 'h') {
            if (e.target.id === 'homepageSidebar'){
                
                homepage.focus()
            } else
            if (e.target.dataset.id === 'homePageLink'){
                homepageSideBar.focus()
            }
        }
    });
    nxtBtn.addEventListener('click', (e) => {
        e.preventDefault();

        const allLinks = [...updateAllSideBarLinks()];

        const currentIndex = allLinks.indexOf(lastClickedSideBarLink);

        const startIndex = currentIndex === -1 ? 0 : currentIndex;

        const nextLink = allLinks[startIndex + 1];

        if (!nextLink) return;

        // THIS is the important fix:
        nextLink.focus();

        nextLink.click();
    });
    function setHighlight(el) {
        document.querySelectorAll('.side-bar-links a.highlight')
            .forEach(a => a.classList.remove('highlight'));

        el?.classList.add('highlight');
    }
    prevBtn?.addEventListener('click', () => {
        const links = [...updateAllSideBarLinks()];
        const current = links.indexOf(lastClickedSideBarLink);

        const prevIndex = current - 1;

        if (prevIndex < 0) return;

        const prevLink = links[prevIndex];

        lastClickedSideBarLink = prevLink;

        setHighlight(prevLink);
        injectContent(prevLink.href);
    });

    prevBtn?.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === 'enter') {
            prevBtn.click();
        }
    });
}
