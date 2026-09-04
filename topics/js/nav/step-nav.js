// step-nav.js
import {
    clickToggleEnlarge,
    cycleStepMedia,
    denlargeAllImages,
    enlargeSingleMedia,
    updateImgs,
    removeMediaEnlarge,
    toggleStepMedia
} from "../ui/toggle-img-sizes.js"
import { changeTutorialLink } from "../ui/change-tutorial-link.js"
import { tutorialLink } from "../core/main-script.js"
import {
    videoControls,
    pauseAllVideos,
    toggleVideoSizeClick,
    resetVideoToPoster
} from "../ui/playStepVid.js" 
import { mainTargetDiv } from "./main-content-nav.js"
import { getFocusZone } from "./get-focus-zone.js"
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
let documentMediaListenerAdded = false
let mainTargetListenerAdded = false
let preserveMediaOnChildFocus = false

export function removeLastStep(){lastStep = null}

function updateCurrentCopyCodes({step}){
    copyCodes = [...step.querySelectorAll('.copy-code')]
}

function getStepFocusableItems(step) {
    return [...step.querySelectorAll('.copy-code, a[href]')]
}
export function initStepNavigation({ mainTargetDiv}){
    if (!mainTargetDiv) return

    // Lesson HTML is replaced during sidebar/next/previous navigation,
    // so refresh every cache from the newly injected Mikey content.
    steps = [...mainTargetDiv.querySelectorAll('.step-float')]
    allStepImgVids = [...mainTargetDiv.querySelectorAll('.step-img, .step-vid')]
    allVids = [...mainTargetDiv.querySelectorAll('.step-vid > video')]
    updateImgs(mainTargetDiv)

    // document and mainTargetDiv survive lesson injection.
    // Their listeners must only be registered once.
    if (!documentMediaListenerAdded) {
        document.addEventListener('pointerdown', e => {
            if (e.target.closest('.step-img, .step-vid')) return
            denlargeAllImages()
        })
        documentMediaListenerAdded = true
    }

    // Videos and their buttons are new nodes after every injection.
    allVids.forEach(vid => {
        if (vid.dataset.stepVideoListenerAdded === 'true') return

        const stepVid = vid.closest('.step-vid')
        if (!stepVid) return

        vid.addEventListener('click', e => {
            e.preventDefault()
            e.stopPropagation()
            videoControls({ vid, e })
        })

        vid.addEventListener('keydown', e => {
            if (e.key === 'Enter' && e.shiftKey && !vid.paused) {
                e.preventDefault()
                e.stopPropagation()
                resetVideoToPoster(vid)
                return
            }

            if (
                e.key === 'Enter' ||
                e.key === ' ' ||
                e.key === 'ArrowLeft' ||
                e.key === 'ArrowRight'
            ) {
                e.stopPropagation()
            }

            videoControls({ vid, e })
        })

        stepVid.querySelectorAll('.vid-cntrl-btns button').forEach(button => {
            button.addEventListener('click', e => {
                e.preventDefault()
                e.stopPropagation()
                videoControls({ vid, e })
            })
        })

        vid.dataset.stepVideoListenerAdded = 'true'
    })

    // Image/video wrappers are also replaced during injection.
    allStepImgVids.forEach(media => {
        if (media.dataset.mediaClickListenerAdded === 'true') return

        media.addEventListener('click', e => {
            if (e.target.closest('.vid-cntrl-btns')) return

            e.preventDefault()
            e.stopPropagation()
            clickToggleEnlarge({ e })
        })

        media.dataset.mediaClickListenerAdded = 'true'
    })

    steps.forEach((step, index) => {
        step.setAttribute('tabindex', '0')

        if (step.hasAttribute('data-auto-focus')) {
            step.focus()
        }

        if (step.dataset.listenerAdded === 'true') return

        step.addEventListener('focus', e => {
            stepClicked = false
            iSteps = index
            iCopyCodes = 0
            denlargeAllImages(allStepImgVids)
            step.dataset.mediaIndex = -1
            preserveMediaOnChildFocus = false
            lastStep = step

            step.scrollIntoView({ behavior: 'smooth', block: 'center' })

            if (
                e.target === steps[steps.length - 1] &&
                steps.length > 3
            ) {
                mainContainer.scrollIntoView({
                    behavior: 'smooth',
                    block: 'end',
                    container: 'all'
                })
            }

            pauseAllVideos({ allVids })
        })

        step.addEventListener('focusin', e => {
            iSteps = index

            if (e.target === step) return

            // Video controls stay visible and never resize their wrapper.
            if (e.target.closest('.vid-cntrl-btns')) return

            stepClicked = true

            if (e.target.classList?.contains('copy-code')) {
                updateCurrentCopyCodes({ step })

                const copyIndex = copyCodes.indexOf(e.target)
                if (copyIndex !== -1) iCopyCodes = copyIndex

                lastFocusedMainEl = e.target
            }

            // Enter can enlarge media and then move focus to lesson content.
            // Preserve that newly enlarged item for this one focus transition.
            if (preserveMediaOnChildFocus) {
                preserveMediaOnChildFocus = false
                return
            }

            step.querySelectorAll(
                '.step-img.enlarge, .step-img.first-vid-enlarge, ' +
                '.step-vid.enlarge, .step-vid.first-vid-enlarge'
            ).forEach(removeMediaEnlarge)
        })

        step.addEventListener('focusout', e => {
            if (step.contains(e.relatedTarget)) return

            preserveMediaOnChildFocus = false
            denlargeAllImages(allStepImgVids)
        })

        step.addEventListener('keydown', e => {
            const key = e.key
            const stepFloat = e.target.closest('.step-float')
            if (!stepFloat) return

// Shift+Enter cycles through all media in this step.
if (key === 'Enter' && e.shiftKey) {
    e.preventDefault()
    e.stopPropagation()

    const playingVid = [
        ...stepFloat.querySelectorAll('.step-vid video')
    ].find(vid => !vid.paused)

    // Stop/reset the video we're leaving,
    // but DO NOT return because we still want to advance.
    if (playingVid) {
        resetVideoToPoster(playingVid)
    }

    // Advance to the next image/video.
    const enlargedMedia =
        cycleStepMedia(stepFloat)

    // If the newly selected media is a video,
    // restart it from the beginning and play it.
    if (
        enlargedMedia?.classList.contains('step-vid')
    ) {
        const vid =
            enlargedMedia.querySelector('video')

        if (vid) {
            try {
                vid.currentTime = 0
            } catch {
                // metadata may not be ready yet
            }

            videoControls({
                vid,
                e
            })
        }
    }

    lastStep = stepFloat

    return
}

if (key === 'Enter') {
    // Buttons and copy-code descendants keep their own behavior.
    if (
        e.target.closest('.vid-cntrl-btns') ||
        e.target.classList?.contains('copy-code')
    ) {
        return
    }

    /*
     * NORMAL ENTER ON LINKS
     *
     * Let anchors keep their native browser behavior.
     *
     * Shift+Enter is handled above and still toggles
     * the step's media.
     */
    if (
        !e.shiftKey &&
        e.target.closest('a[href]')
    ) {
        return
    }

    changeTutorialLink(e)

    if (!e.shiftKey) {
                    const firstFocusable =
                        getStepFocusableItems(stepFloat)[0]

                    if (
                        e.target === stepFloat &&
                        firstFocusable?.matches('a[href]')
                    ) {
                        e.preventDefault()
                        stepClicked = true
                        firstFocusable.focus()
                        lastStep = stepFloat
                        return
                    }

                    updateCurrentCopyCodes({ step: stepFloat })
                    stepClicked = true

                    const enlargedMedia = cycleStepMedia(stepFloat)

                    if (enlargedMedia?.classList.contains('step-vid')) {
                        const vid = enlargedMedia.querySelector('video')
                        if (vid) videoControls({ vid, e })
                    }

                    const firstCopyCode = stepFloat.querySelector('.copy-code')
                    const firstLink = stepFloat.querySelector('a[href]')
                    const firstChild = firstCopyCode || firstLink

                    if (
                        firstChild &&
                        document.activeElement !== firstChild
                    ) {
                        preserveMediaOnChildFocus = true
                        firstChild.focus()
                    }

                    lastStep = stepFloat
                } else {
                    stepFloat.focus()

                    const enlargedMedia = cycleStepMedia(stepFloat)

                    if (enlargedMedia?.classList.contains('step-vid')) {
                        const vid = enlargedMedia.querySelector('video')

                        if (vid) {
                            vid.currentTime = 0
                            videoControls({ vid, e })
                        }
                    }
                }

                return
            }

            if (
                key === ' ' ||
                key === 'ArrowLeft' ||
                key === 'ArrowRight'
            ) {
                const stepVid =
                    stepFloat.querySelector('.step-vid.enlarge') ||
                    stepFloat.querySelector('.step-vid.first-vid-enlarge') ||
                    stepFloat.querySelector('.step-vid')

                const vid = stepVid?.querySelector('video')
                if (vid) videoControls({ vid, e })
            }
        })

        step.addEventListener('click', e => {
            changeTutorialLink(e)

            const clickedInteractiveElement = e.target.closest(
                'a[href], button, input, select, textarea, ' +
                '[contenteditable="true"], .copy-code, .step-img, .step-vid'
            )
            const firstFocusable = getStepFocusableItems(step)[0]

            if (
                !clickedInteractiveElement &&
                firstFocusable?.matches('a[href]')
            ) {
                stepClicked = true
                firstFocusable.focus()
                lastStep = step
                return
            }
        })

        step.dataset.listenerAdded = 'true'
    })

    if (!mainTargetListenerAdded) {
        mainTargetDiv.addEventListener('keydown', e => {
            const key = e.key.toLowerCase()

            // From any descendant, M returns to its own step.
            // From the step itself, let the existing global handler return
            // to mainTargetDiv.
            if (key === 'm') {
                const step = e.target.closest('.step-float')

                if (step && e.target !== step) {
                    e.preventDefault()
                    e.stopPropagation()
                    stepClicked = false
                    step.focus()
                    return
                }
            }

            // Do not turn Enter on non-link copy-code into step navigation.
            if (
                e.target.classList.contains('copy-code') &&
                e.target.tagName !== 'A' &&
                e.key === 'Enter'
            ) {
                e.preventDefault()
                e.stopPropagation()
                return
            }

            if (/^[1-9]$/.test(key)) {
                e.preventDefault()
                numStepNav(Number(key), e.target)
            }
        })

        mainTargetListenerAdded = true
    }
}
function numStepNav(intLet, target = document.activeElement){
    if (!steps.length) return

    const currentStep = target?.closest?.('.step-float')

    // Inside a step, number keys select copy-code items in that step.
    if (currentStep && target !== currentStep) {
        updateCurrentCopyCodes({ step: currentStep })

        const copyCode = copyCodes[intLet - 1]
        if (copyCode) {
            iCopyCodes = intLet - 1
            copyCode.focus()
        }

        return
    }

    // Outside a step or on the step itself, number keys select steps.
    if (intLet > 0 && intLet <= steps.length) {
        iSteps = intLet - 1
        stepClicked = false
        steps[iSteps]?.focus()
    }
}

export function handleStepNav({e, focusZone}){
    if (focusZone !== 'mainTargetDiv') return

    const key = e.key.toLowerCase()

    if (/^[1-9]$/.test(key)) {
        e.preventDefault()
        numStepNav(Number(key), e.target)
        return
    }

    stepFocused = !stepFocused

    if (key === 'f') {
        const currentStep = e.target.closest?.('.step-float')
        const insideStep = currentStep && e.target !== currentStep

        if (insideStep) {
            const focusableItems = getStepFocusableItems(currentStep)
            if (!focusableItems.length) return

            const currentIndex = focusableItems.indexOf(document.activeElement)
            const nextIndex =
                currentIndex === -1
                    ? 0
                    : (currentIndex + 1) % focusableItems.length

            focusableItems[nextIndex]?.focus()
            return
        }

        if (!steps.length) return

        iSteps =
            e.target === mainTargetDiv
                ? 0
                : (iSteps + 1) % steps.length

        stepClicked = false
        steps[iSteps]?.focus()
        return
    }

    if (key === 'a') {
        const currentStep = e.target.closest?.('.step-float')
        const insideStep = currentStep && e.target !== currentStep

        if (insideStep) {
            const focusableItems = getStepFocusableItems(currentStep)
            if (!focusableItems.length) return

            const currentIndex = focusableItems.indexOf(document.activeElement)
            const previousIndex =
                currentIndex === -1
                    ? focusableItems.length - 1
                    : (currentIndex - 1 + focusableItems.length) %
                        focusableItems.length

            focusableItems[previousIndex]?.focus()
            return
        }

        if (!steps.length) return

        iSteps = (iSteps - 1 + steps.length) % steps.length
        stepClicked = false
        steps[iSteps]?.focus()
        return
    }

    if (key === 's') {
        stepClicked = false
        lastClickedSideBarLink?.focus()
        return
    }

    if (key === 't') {
        tutorialLink?.focus()
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
