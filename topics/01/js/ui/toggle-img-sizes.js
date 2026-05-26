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
        img.style.zIndex = img.classList.contains("enlarge") ? 100 : 0;
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
        img.style.zIndex = 0;
    });
    // allVids.forEach(vid => {
    //     if (vid.classList.contains('first-vid-enlarge')) vid.classList.remove("first-vid-enlarge");
    // })
}