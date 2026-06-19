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
    console.log(
        'before',
        step.dataset.mediaIndex,
        [...media].map((el, i) => ({
            i,
            enlarge: el.classList.contains('enlarge')
        }))
    );
    let index = Number(step.dataset.mediaIndex ?? -1);

    denlargeAllImages();

    index++;

    if (index >= media.length) {
        step.dataset.mediaIndex = -1;
        return;
    }

    media[index].classList.add('enlarge');

    step.dataset.mediaIndex = index;
}
export function clickToggleEnlarge({e}){
    const parent = e.target.closest('.step-img') ? e.target.closest('.step-img') : e.target.closest('.step-vid')
    console.log('ehre')
    parent.classList.toggle('enlarge')
}