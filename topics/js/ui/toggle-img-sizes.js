// toggle-img-sizes.js
let allImgs 
export function updateImgs(){
    allImgs = document.querySelectorAll('.step-img, .step-vid ')
}
// --- Image handling ---
export function toggleSingleImage(img) {
    // denlargeAllImages()
    if(img){
        img.classList.toggle("enlarge");
    }
}
if(allImgs){
    allImgs.forEach(el => {
        el.addEventListener('click', e => {
            e.preventDefault()
            e.stopPropagation()
            // toggleSingleImage(e.target)
        });
    })
}

// --- Utility ---
export function denlargeAllImages() {
    allImgs.forEach(img => {
        if (img.classList.contains('enlarge')) img.classList.remove("enlarge");
    });
    // allVids.forEach(vid => {
    //     if (vid.classList.contains('first-vid-enlarge')) vid.classList.remove("first-vid-enlarge");
    // })
}