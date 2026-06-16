// toggle-side-bar.js
export const sideBar = document.querySelector('.side-bar')
export const sideBarBtn = document.querySelector('#sideBarBtn')
export const navBarLessonTitle = document.querySelector('.nav-bar-lesson-title')
export const mainContainer = document.querySelector('.main-container')


export function initToggleSidebar({e}) {
    [navBarLessonTitle, sideBarBtn].forEach(el => {
        el.addEventListener('click', e => {
            mainContainer?.classList.toggle('collapsed')
        });
    })
    sideBarBtn.addEventListener('keydown', e => {
        let key = e.key.toLowerCase()
        if (key === 'enter') {
            mainContainer?.classList.toggle('collapsed')
        }
    });
    navBarLessonTitle.addEventListener('keydown', e => {
        let key = e.key.toLowerCase()
        if (key === 'enter') {
            mainContainer?.classList.toggle('collapsed')
        }
    });
    sideBar.addEventListener('click', e => {
        if (e.target == sideBar) {
            mainContainer.classList.toggle('collapsed')
        }
    })
}

