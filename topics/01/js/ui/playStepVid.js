// playStepVid.js
let playing = false; 
export function pauseAllVideos({ allVids }) {
    if (!allVids || !allVids.forEach) return;
    allVids.forEach(vid => {
        vid.classList.remove("enlarge");
        vid.classList.remove("first-vid-enlarge");
        vid.style.border = "none";
        if (!vid.paused) {
            vid.pause();
        }
    });
}
export function videoControls({ vid, e }) {
    if (!vid) return
    let key = e.keyCode;
    if (e.type == 'keydown') {
        console.log('keydown')
        vidKeyCntrl({ vid, e, key })
    }
    if (e.type == 'click') {
        toggleVideoSizeClick({ vid, e })
    }
}
function vidKeyCntrl({ vid, e, key }) {
    if (!vid) return
    if (e.type == 'click') {
        
    } else {

        switch (key) {
            case 13: // Enter
                if (e.target.classList.contains('enlarge')) {
                    playing = true;
                }
                break;
            case 32: // Space
                e.preventDefault();
                if (vid.currentTime === vid.duration) {
                    vid.currentTime = 0;
                    playing = false;
                } else {
                    playing = !playing;
                }
                break;
            case 37: // Left arrow
                vid.currentTime -= 0.5;
                playing = true;
                break;
            case 39: // Right arrow
                vid.currentTime += 0.5;
                playing = true;
                break;
        }
    }
    playPauseVideo({ vid, playing });
}
export function toggleVideoSizeClick({ vid, e }) {
    const stepVid = vid.parentElement
    stepVid.classList.toggle('enlarge')
    if (!vid) return
    if(stepVid.classList.contains('enlarge') && !playing){
        playing = true
    } else {
        playing = false
    }
    vidKeyCntrl({vid,e})
}
function playPauseVideo({ vid, playing }) {
    if (!vid) return
    if (vid) {
        if (playing) {
            vid.play();
        } else {
            vid.pause();
        }
    }
}