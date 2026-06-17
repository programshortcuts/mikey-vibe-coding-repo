// change-tutorial-link.js
import { tutorialLink } from "../core/main-script.js";
export function initTutorialLink() {
    tutorialLink.addEventListener('click', e => {
        // e.preventDefault()
        changeTutorialLink(e)

    })

}
export function changeTutorialLink(e) {
    
    if (!tutorialLink) return null;

    const source = e.target.closest('[data-video], [data-timestamp], [data-tinestamp]')
        || e.currentTarget?.closest('[data-video], [data-timestamp], [data-tinestamp]');

    if (!source) return tutorialLink;

    const vidBase = source.getAttribute('data-video');
    const ts = source.getAttribute('data-timestamp') || source.getAttribute('data-tinestamp');
    if (!vidBase) return tutorialLink;

    let vidHref = vidBase;
    if (ts) {
        vidHref += (vidBase.includes('?') ? '&' : '?') + `t=${ts}s`;
    }

    tutorialLink.setAttribute('href', vidHref);
    return tutorialLink;
}