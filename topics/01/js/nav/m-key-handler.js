// m-key-handler.js
import { lastStep,lastFocusedMainEl } from "./step-nav.js";
import { mainTargetDiv } from "./main-content-nav.js";
export function handleMKey({e,focusZone}) {
    e.preventDefault();
    e.stopPropagation();
    let key = e.key.toLowerCase()
    // 1. If there is a lastStep → ALWAYS go there
    // console.log(lastFocusedMainEl)
    // console.log('handle m key')
    if(focusZone != 'mainTargetDiv'){
        if(lastStep){
            lastStep.focus()
        } else if(document.contains(mainTargetDiv)){
            mainTargetDiv.focus()
        }
    }
    // 2. Otherwise ALWAYS go to mainTargetDiv
    if (focusZone === 'mainTargetDiv'){
        if (e.target === lastStep){
            mainTargetDiv.focus()
            mainTargetDiv.scrollIntoView({behavior:'instant',block:'start'});
            return
        } else
        if(e.target === mainTargetDiv){
            if(lastStep){
                lastStep.focus()
                return
            } 
        }
        // console.log(focusZone)
        
    }
}
