// step-nav.js
import { videoControls, pauseAllVideos, toggleVideoSizeClick} from "../ui/playStepVid.js" 
import { mainTargetDiv } from "./main-content-nav.js"
import { toggleSingleImage,denlargeAllImages } from "../ui/toggle-img-sizes.js"
import { getFocusZone } from "./get-focus-zone.js"
import { changeTutorialLink } from "../ui/change-tutorial-link.js"
import { lastClickedSideBarLink } from "./side-bar-nav.js"
import { handleMKey } from "./m-key-handler.js"
import { mainContainer } from "../ui/toggle-side-bar.js"
let steps = []
let copyCodes = []
let iSteps = 0
let iCopyCodes = 0
export let lastStep
export let lastFocusedMainEl
let allStepImgVids = [];
let allVids = [];
let iImgContainerImages = 0
let stepFocused = false 
let stepClicked = false
export function removeLastStep(){lastStep = null}
function updateCurrentCopyCodes({step}){
    copyCodes = [...step.querySelectorAll('.copy-code')]
}
export function initStepNavigation({ mainTargetDiv}){
    steps = [...mainTargetDiv.querySelectorAll('.step-float')]
    allStepImgVids = Array.from(mainTargetDiv.querySelectorAll(".step-img , .step-vid "));
    allVids = Array.from(mainTargetDiv.querySelectorAll(".step-vid > video"));
    allVids.forEach(vid => {
        vid.addEventListener('click', e => {
            // e.preventDefault()
            // e.stopPropagation()
            if (e.target.tagName === "VIDEO") {
                videoControls({vid,e})
            }
        });
        vid.addEventListener('keydown', e => {
            e.preventDefault()
            e.stopPropagation()
            const key = e.key.toLowerCase()
            if(key === 32){
                e.preventDefault()
            }
            if (e.target.tagName === "VIDEO") {
                const key = e.target.key.toLowerCase()
                videoControls({vid,e,})
            }
        });
    })
    allStepImgVids.forEach(el => {
        el.addEventListener('pointerdown', e => {
            e.preventDefault()
            e.stopPropagation()
            if(el.classList.contains('step-img')){
                
                toggleSingleImage(el)
            }
        });
    })
    steps.forEach((step, index,arr) => {
        if (!step.dataset.listenerAdded) {
            step.setAttribute("tabindex", "0");
            step.addEventListener("focus", (e) => {
                stepClicked = true
                iSteps = index;
                // maybe not iCopyCodes = 0
                iCopyCodes = 0
                iImgContainerImages = 0;
                // iCopyCodes = 0
                denlargeAllImages(allStepImgVids);
                lastStep = step
                stepClicked = false
                
                if(index < arr.length - 1){
                    step.scrollIntoView({ behavior: 'smooth', block: 'center' })
                } else {
                    // last step
                    step.scrollIntoView({ behavior: 'smooth', block: 'center' })
                }
                if(allVids){}
                if (e.target == steps[steps.length - 1] && steps.length > 3) {
                    mainContainer.scrollIntoView({ behavior: 'smooth', block: 'end', container: 'all' })
                }
                pauseAllVideos({allVids})
            });
            step.addEventListener("focusin", () => { iSteps = index;})
            step.addEventListener("focusout", () => { denlargeAllImages(allStepImgVids) })
            step.addEventListener("keydown", e => {
                let key = e.key.toLowerCase();
                const step = e.target
                const stepFloat = e.target.closest('.step-float')
                const stepImgVid = stepFloat.querySelector('.step-img ,.step-vid')                 
                if (key === "enter" ) {
                    changeTutorialLink(e)
                    if (!e.shiftKey){
                        updateCurrentCopyCodes({step: stepFloat})
                        stepClicked = true
                        toggleSingleImage(stepImgVid)
                        const firstCopyCode = e.target.querySelector('.copy-code')
                        if(stepImgVid){
                            if(stepImgVid.classList.contains('enlarge') && stepClicked){
                                if(firstCopyCode){
                                    firstCopyCode.focus()
                                }
                            }
                        } else {
                            if (firstCopyCode) {
                                firstCopyCode.focus()
                            }
                        }
                        lastStep = step
                    } else {
                        step.focus()
                        toggleSingleImage(stepImgVid)
                    }
                }
                if (stepImgVid && stepImgVid.classList.contains('step-vid') ) {
                    let vid = stepImgVid.querySelector('video')
                    if(vid){
                        videoControls({vid,e})
                    }
                    return
                }
            });

            step.addEventListener('click', e => {
                changeTutorialLink(e);
            });

            step.dataset.listenerAdded = "true";
        }
    });
    copyCodes.forEach((el,i) => {
        el.addEventListener('keydown', e => {
            // let key = e.key.toLowerCase()
            // if(key === 'm'){
            //     // e.preventDefault()
            //     console.log('here')
            //     const step = e.target.closest('.step-float')
            //     step.focus()
            // }

        });
        el.addEventListener('focus', e => {
            iCopyCodes = i
            lastFocusedMainEl = e.target
        });
    })
    mainTargetDiv.addEventListener('keydown', e => {
        let key = e.key.toLowerCase()

        if (key === 'm') {
            const step = e.target.closest('.step-float')
            if (step) {
                e.preventDefault()
                stepClicked = false
                step.focus()
                return
            }
        }
        // The intLet and 'E' and 
        if(e.target.classList.contains('.copy-code')) {

            if (e.key === 'Enter') {
                e.preventDefault();
                e.stopPropagation();
                return;
            }
        }
        if (!isNaN(key)) {
            let intLet = parseInt(key)
            numStepNav(intLet)
            
        } 
    });
}
function numStepNav(intLet){
    if (!stepClicked) {
        if (intLet <= steps.length) {
            steps[intLet - 1].focus()
        }
    } else if (stepClicked) {
        if (copyCodes[intLet - 1]) {
            copyCodes[intLet - 1].focus()
        }
    }
}
export function handleStepNav({e, focusZone}){
    if(focusZone != 'mainTargetDiv') return
    let key = e.key
    // if(e.target ==)
    if(!isNaN(key)){
        let intLet = parseInt(key)
        // 
        numStepNav(intLet)
    } 
    if(key === 'enter'){
    }
    stepFocused = !stepFocused
    // 
    /////////////
    //**
    // MAKE FOCUS ZONES for stepFocused and not !stepFocused
    //  */    
    if (key === 'f') {
        if(!stepClicked){
            iSteps = (iSteps + 1) % steps.length
            steps[iSteps]?.focus()
        } else if(stepClicked){
            iCopyCodes = (iCopyCodes + 1) % copyCodes.length
            if(copyCodes[iCopyCodes]){
                copyCodes[iCopyCodes].focus()
            }
        }
    }
    if (key === 'f' && e.target === mainTargetDiv) {
        if (!stepClicked) {  
            iSteps = 0
            steps[0]?.focus()
        }
    }
    if (key === 'a') {
        if (!stepClicked) {  
            iSteps = (iSteps - 1 + steps.length) % steps.length
            steps[iSteps].focus()
        } else if(stepClicked){
            if(copyCodes[iCopyCodes]){

                iCopyCodes = (iCopyCodes - 1 + copyCodes.length) % copyCodes.length
                copyCodes[iCopyCodes].focus()
            }
        }
        else {
            // cycle through set of updated copyCodes
            const step = e.target.closest('.step-float')
            step.focus()
        }
    }
    if (key === 's') {
        stepClicked = false
        if (lastClickedSideBarLink) {
            lastClickedSideBarLink.focus()
            return
        }
    }
    if (key === 't') {

        tutorialLink.focus()
    }
    /////////////
    if(steps[iSteps]){
    } else{
    }
}
document.addEventListener('click', (e) => {
    const step = e.target.closest('.step-float');
    if (!step) return;
    // remove from all
    document.querySelectorAll('.step-float.selected').forEach(el => el.classList.remove('selected'));
    // add to the tapped one
    step.classList.add('selected');
});
