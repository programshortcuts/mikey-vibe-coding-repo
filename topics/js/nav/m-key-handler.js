// m-key-handler.js
import { lastStep,lastFocusedMainEl } from "./step-nav.js";
import { mainTargetDiv } from "./main-content-nav.js";
export function handleMKey({e,focusZone}) {
    if (!e) return;

    e.preventDefault();
    e.stopPropagation();

    // M from any focusable descendant returns to its own step.
    const currentStep = e.target.closest?.('.step-float');

    if (currentStep && e.target !== currentStep) {
        currentStep.focus();
        return;
    }

    // M from a step returns to the main lesson container.
    if (currentStep && e.target === currentStep) {
        mainTargetDiv?.focus();
        mainTargetDiv?.scrollIntoView({behavior:'instant',block:'start'});
        return;
    }

    // M from the lesson container returns to the last focused step.
    if (e.target === mainTargetDiv) {
        lastStep?.focus();
        return;
    }

    // Preserve Mikey's existing outside-main fallback.
    if (focusZone !== 'mainTargetDiv') {
        if (lastStep) {
            lastStep.focus();
        } else if (mainTargetDiv && document.contains(mainTargetDiv)) {
            mainTargetDiv.focus();
        }
    }
}
