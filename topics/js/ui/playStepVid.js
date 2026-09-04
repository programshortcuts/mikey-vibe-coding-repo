// playStepVid.js
let playing = false;

const endedResetVideos = new WeakSet();
const CONTROL_FLASH_TIME = 180;

function getStepVid(vid) {
    return vid?.closest('.step-vid');
}

function getVideoContainer(vid) {
    return vid?.closest('.step-vid, .img-container');
}

function getControls(vid) {
    const container = getVideoContainer(vid);
    const buttons = [
        ...(container?.querySelectorAll('.vid-cntrl-btns button') || [])
    ];

    return {
        playBtn: container?.querySelector('.playbtn') || null,
        rewindBtn:
            buttons.find(button =>
                button.textContent.replace(/\s/g, '').includes('<<')
            ) || container?.querySelector('.fwdBtn') || null,
        forwardBtn:
            buttons.find(button =>
                button.textContent.replace(/\s/g, '').includes('>>')
            ) || container?.querySelector('.rwdBtn') || null
    };
}

function syncVideoSize(vid) {
    const stepVid = getStepVid(vid);
    if (!vid || !stepVid) return;

    const enlarged =
        stepVid.classList.contains('enlarge') ||
        stepVid.classList.contains('first-vid-enlarge');

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

function flashButton(button) {
    if (!button) return;

    button.classList.add('control-active');
    window.setTimeout(() => {
        button.classList.remove('control-active');
    }, CONTROL_FLASH_TIME);
}

export function updatePlayButton(vid) {
    const { playBtn } = getControls(vid);
    if (!vid || !playBtn) return;

    if (!playBtn.dataset.playText) {
        playBtn.dataset.playText = playBtn.textContent.trim() || '>';
    }

    if (vid.paused) {
        playBtn.textContent = playBtn.dataset.playText;
        playBtn.classList.remove('is-playing');
        playBtn.setAttribute('aria-label', 'Play video');
    } else {
        playBtn.textContent = '❚❚';
        playBtn.classList.add('is-playing');
        playBtn.setAttribute('aria-label', 'Pause video');
    }
}

export function resetVideoToPoster(vid) {
    if (!vid) return;

    playing = false;
    vid.pause();

    try {
        vid.currentTime = 0;
    } catch {
        // Metadata may not be available yet.
    }

    vid.load();
    syncVideoSize(vid);
    updatePlayButton(vid);
}

function ensureVideoEndedReset(vid) {
    if (!vid || endedResetVideos.has(vid)) return;

    vid.addEventListener('ended', () => {
        playing = false;
        vid.pause();
        vid.autoplay = false;
        vid.loop = false;
        vid.removeAttribute('autoplay');
        vid.removeAttribute('loop');
        vid.load();

        const finishReset = () => {
            vid.removeEventListener('loadedmetadata', finishReset);
            playing = false;

            try {
                vid.currentTime = 0;
            } catch {
                // Metadata may still be unavailable.
            }

            vid.pause();
            syncVideoSize(vid);
            updatePlayButton(vid);
        };

        vid.addEventListener('loadedmetadata', finishReset);

        if (
            typeof HTMLMediaElement !== 'undefined' &&
            vid.readyState >= HTMLMediaElement.HAVE_METADATA
        ) {
            finishReset();
        }
    });

    endedResetVideos.add(vid);
}

function playVideo(vid) {
    if (!vid) return;

    ensureVideoEndedReset(vid);
    playing = true;
    syncVideoSize(vid);

    const playPromise = vid.play();

    if (playPromise?.then) {
        playPromise
            .then(() => {
                playing = true;
                syncVideoSize(vid);
                updatePlayButton(vid);
            })
            .catch(() => {
                playing = false;
                updatePlayButton(vid);
            });
    } else {
        updatePlayButton(vid);
    }
}

function pauseVideo(vid) {
    if (!vid) return;

    playing = false;
    vid.pause();
    syncVideoSize(vid);
    updatePlayButton(vid);
}

function togglePlayPause(vid) {
    const { playBtn } = getControls(vid);
    flashButton(playBtn);

    if (vid.paused) {
        if (
            Number.isFinite(vid.duration) &&
            vid.currentTime >= vid.duration
        ) {
            vid.currentTime = 0;
        }
        playVideo(vid);
    } else {
        pauseVideo(vid);
    }
}

function rewindVideo(vid) {
    if (!vid) return;

    const { rewindBtn } = getControls(vid);
    flashButton(rewindBtn);

    const nextTime = vid.currentTime - 0.5;

    if (nextTime <= 0) {
        resetVideoToPoster(vid);
        return;
    }

    vid.currentTime = nextTime;
}

function forwardVideo(vid) {
    if (!vid) return;

    const { forwardBtn } = getControls(vid);
    flashButton(forwardBtn);

    const nextTime = vid.currentTime + 0.5;

    if (
        Number.isFinite(vid.duration) &&
        nextTime >= vid.duration
    ) {
        resetVideoToPoster(vid);
        return;
    }

    vid.currentTime = nextTime;
}

export function pauseAllVideos({ allVids }) {
    if (!allVids?.forEach) return;

    allVids.forEach(vid => {
        const stepVid = getStepVid(vid);

        if (stepVid) {
            stepVid.classList.remove('enlarge', 'first-vid-enlarge');
        }

        syncVideoSize(vid);

        if (!vid.paused) {
            vid.pause();
        }

        updatePlayButton(vid);
    });

    playing = false;
}

export function toggleVideoSizeClick({ vid }) {
    if (!vid) return;

    const stepVid = getStepVid(vid);

    if (stepVid) {
        const willEnlarge = !stepVid.classList.contains('enlarge');

        stepVid.classList.toggle('enlarge');
        stepVid.classList.remove('first-vid-enlarge');
        syncVideoSize(vid);

        if (willEnlarge) {
            playVideo(vid);
        } else {
            pauseVideo(vid);
        }

        return;
    }

    if (vid.closest('.img-container')) {
        togglePlayPause(vid);
    }
}

function videoKeyControl({ vid, e }) {
    switch (e.key) {
        case 'Enter': {
            const stepVid = getStepVid(vid);

            if (stepVid) {
                syncVideoSize(vid);

                if (
                    stepVid.classList.contains('enlarge') ||
                    stepVid.classList.contains('first-vid-enlarge')
                ) {
                    playVideo(vid);
                } else {
                    pauseVideo(vid);
                }
            } else if (vid.closest('.img-container')) {
                togglePlayPause(vid);
            }
            break;
        }

        case ' ':
            e.preventDefault();
            togglePlayPause(vid);
            break;

        case 'ArrowLeft':
            e.preventDefault();
            rewindVideo(vid);
            break;

        case 'ArrowRight':
            e.preventDefault();
            forwardVideo(vid);
            break;
    }
}

function controlButtonClick({ vid, e }) {
    const button = e.target.closest('.vid-cntrl-btns button');
    if (!button) return false;

    e.preventDefault();
    e.stopPropagation();

    if (button.classList.contains('playbtn')) {
        togglePlayPause(vid);
        return true;
    }

    const label = button.textContent.replace(/\s/g, '');

    if (
        label.includes('<<') ||
        (!label.includes('>>') && button.classList.contains('fwdBtn'))
    ) {
        rewindVideo(vid);
        return true;
    }

    if (
        label.includes('>>') ||
        button.classList.contains('rwdBtn')
    ) {
        forwardVideo(vid);
        return true;
    }

    return false;
}

export function videoControls({ vid, e }) {
    if (!vid || !e) return;

    if (e.type === 'keydown') {
        videoKeyControl({ vid, e });
        return;
    }

    if (e.type === 'click') {
        if (controlButtonClick({ vid, e })) return;

        if (e.target === vid) {
            toggleVideoSizeClick({ vid });
        }
    }
}
