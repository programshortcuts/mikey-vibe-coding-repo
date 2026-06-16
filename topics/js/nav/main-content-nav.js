// main-content-nav.js
import { handleMKey } from "./m-key-handler.js";
import { mainContainer,navBarLessonTitle } from "../ui/toggle-side-bar.js";
export const mainTargetDiv = document.querySelector('#mainTargetDiv')
import { lastClickedSideBarLink,lastFocusedSideBarLink } from "./side-bar-nav.js"
import { sideBarBtn,sideBar } from "../ui/toggle-side-bar.js";
import { handleStepNav,lastStep } from "./step-nav.js";
import { letterFocus } from "./letter-focus.js";
import { nxtBtn,prevBtn } from "../core/inject-content.js";
export function mainContentNav({ e, focusZone }){
    let key = e.key.toLowerCase()
    console.log(e.target)
    if (key === 'm') {
        handleMKey({e,focusZone})
        return;
    }
    if(key === 'e'){
        nxtBtn.focus()
        mainContainer.scrollIntoView({behavior: 'smooth', block: 'end', container: 'all'})
    }
    if(key === 'p'){
        prevBtn.focus()
    }
    // Only block propagation for global nav keys
    if(key === 'n'){
        navBarLessonTitle.focus()
        return
    }
    if(key === 's'){
        if(!mainContainer.classList.contains('collapsed')) {
            if(lastClickedSideBarLink){
                lastClickedSideBarLink.focus()
            } else {
                sideBarBtn.focus()
            }
            return
        }
        if (mainContainer.classList.contains('collapsed')){
            sideBarBtn.focus()
        }
        return
    }
    // THE PROBLEM IS IN handleStepNav.js
    handleStepNav({ e, focusZone })
}

