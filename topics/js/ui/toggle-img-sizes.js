// toggle-img-sizes.js
// toggle-img-sizes.js

let allImgs;

export function updateImgs(root = document) {
    allImgs = root.querySelectorAll('.step-img, .step-vid');
}

export function denlargeAllImages() {
    if (!allImgs) return;

    allImgs.forEach(img => {
        img.classList.remove('enlarge');
    });
}

export function enlargeSingleMedia(mediaEl) {
    if (!mediaEl) return;

    const step = mediaEl.closest('.step-float');

    if (!step) return;

    const media = [
        ...step.querySelectorAll('.step-img, .step-vid')
    ];

    const index = media.indexOf(mediaEl);

    denlargeAllImages();

    mediaEl.classList.add('enlarge');

    step.dataset.mediaIndex = index;
}

export function cycleStepMedia(step) {
    if (!step) return;

    const media = [
        ...step.querySelectorAll('.step-img, .step-vid')
    ];

    if (!media.length) return;

    const currentIndex = media.findIndex(el =>
        el.classList.contains('enlarge')
    );

    denlargeAllImages();

    const nextIndex = currentIndex + 1;

    if (nextIndex >= media.length) {
        step.dataset.mediaIndex = -1;
        return;
    }

    media[nextIndex].classList.add('enlarge');
    step.dataset.mediaIndex = nextIndex;
}