// main-script.js
// ===== Imports =====
import { letterFocus } from "../nav/letter-focus.js";
import { getFocusZone } from "../nav/get-focus-zone.js";
import { initDropDowns,hideTopicSnips } from "../ui/drop-downs-sidebar-temp.js";
import { handleStepNav, lastStep } from "../nav/step-nav.js";
import { initToggleSidebar, mainContainer, sideBar, sideBarBtn } from "../ui/toggle-side-bar.js";
import { sideBarNav, lastClickedSideBarLink, lastFocusedSideBarLink } from "../nav/side-bar-nav.js";
import { mainContentNav, mainTargetDiv } from "../nav/main-content-nav.js";
export const navBarLessonTitle = document.querySelector('#navBarLessonTitle');

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
    });
}