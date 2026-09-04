// toggle-img-sizes.js
import { updatePlayButton } from "./playStepVid.js";

let allImgs = [];

function syncVideoSize(mediaEl) {
    if (!mediaEl?.classList?.contains('step-vid')) return;

    const vid = mediaEl.querySelector('video');
    if (!vid) return;

    const enlarged =
        mediaEl.classList.contains('enlarge') ||
        mediaEl.classList.contains('first-vid-enlarge');

    if (enlarged) {
        vid.style.width = '100%';
        vid.style.maxWidth = '100%';
        vid.style.height = 'auto';
        vid.style.display = 'block';
    } else {
        vid.style.removeProperty('width');
        vid.style.removeProperty('max-width');
        vid.style.removeProperty('height');
        vid.style.removeProperty('display');
    }
}

export function removeMediaEnlarge(mediaEl) {
    if (!mediaEl) return;

    mediaEl.classList.remove('enlarge', 'first-vid-enlarge');
    syncVideoSize(mediaEl);
}

function addMediaEnlarge(mediaEl) {
    if (!mediaEl) return;

    mediaEl.classList.add('enlarge');
    syncVideoSize(mediaEl);
}

export function updateImgs(root = document) {
    allImgs = [...root.querySelectorAll('.step-img, .step-vid')];
    allImgs.forEach(syncVideoSize);
}

export function denlargeAllImages(mediaItems = allImgs) {
    if (!mediaItems?.forEach) return;
    mediaItems.forEach(removeMediaEnlarge);
}

export function enlargeSingleMedia(mediaEl) {
    if (!mediaEl) return;

    const step = mediaEl.closest('.step-float');
    if (!step) return;

    const media = [...step.querySelectorAll('.step-img, .step-vid')];
    const index = media.indexOf(mediaEl);
    if (index === -1) return;

    denlargeAllImages();
    addMediaEnlarge(mediaEl);
    step.dataset.mediaIndex = index;
}

export function cycleStepMedia(step) {
    if (!step) return null;

    const media = [...step.querySelectorAll('.step-img, .step-vid')];
    if (!media.length) return null;

    let index = Number(step.dataset.mediaIndex ?? -1);
    denlargeAllImages();
    index++;

    if (index >= media.length) {
        step.dataset.mediaIndex = -1;
        return null;
    }

    addMediaEnlarge(media[index]);
    step.dataset.mediaIndex = index;
    return media[index];
}

export function toggleStepMedia(step) {
    if (!step) return null;

    const media = [...step.querySelectorAll('.step-img, .step-vid')];
    if (!media.length) return null;

    const enlarged = step.querySelector(
        '.step-img.enlarge, .step-img.first-vid-enlarge, ' +
        '.step-vid.enlarge, .step-vid.first-vid-enlarge'
    );

    if (enlarged) {
        removeMediaEnlarge(enlarged);
        step.dataset.mediaIndex = -1;
        return null;
    }

    let index = Number(step.dataset.mediaIndex ?? 0);
    if (index < 0 || index >= media.length) index = 0;

    media.forEach(removeMediaEnlarge);
    addMediaEnlarge(media[index]);
    step.dataset.mediaIndex = index;
    return media[index];
}

export function clickToggleEnlarge({ e }) {
    if (!e || e.target.closest('.vid-cntrl-btns')) return null;

    const mediaEl =
        e.target.closest('.step-img') ||
        e.target.closest('.step-vid');

    const step = mediaEl?.closest('.step-float');
    if (!mediaEl || !step) return null;

    const media = [...step.querySelectorAll('.step-img, .step-vid')];
    const index = media.indexOf(mediaEl);
    const wasEnlarged =
        mediaEl.classList.contains('enlarge') ||
        mediaEl.classList.contains('first-vid-enlarge');

    media.forEach(removeMediaEnlarge);

    if (wasEnlarged) {
        step.dataset.mediaIndex = -1;
        return null;
    }

    addMediaEnlarge(mediaEl);
    step.dataset.mediaIndex = index;
    return mediaEl;
}

document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;

    const enlarged = [
        ...document.querySelectorAll(
            '.step-img.enlarge, .step-img.first-vid-enlarge, ' +
            '.step-vid.enlarge, .step-vid.first-vid-enlarge'
        )
    ];

    if (!enlarged.length) return;
    e.preventDefault();

    enlarged.forEach(mediaEl => {
        if (mediaEl.classList.contains('step-vid')) {
            const vid = mediaEl.querySelector('video');
            if (vid) {
                vid.pause();
                updatePlayButton(vid);
            }
        }

        removeMediaEnlarge(mediaEl);

        const step = mediaEl.closest('.step-float');
        if (step) step.dataset.mediaIndex = -1;
    });
});
