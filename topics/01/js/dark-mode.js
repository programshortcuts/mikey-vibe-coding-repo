const darkModeBtn = document.getElementById('darkModeBtn')
const body = document.querySelector('body')
addEventListener('keydown', e => {
    let letter = e.key.toLowerCase()
    let isShiftPressed = e.shiftKey

    if (isShiftPressed && letter == 'k') {
        darkModeBtn.click()
    }
})

darkModeBtn.addEventListener('click', (e) => { 
    e.preventDefault()
    e.stopPropagation()
    body.classList.toggle('dark-mode') 
})
darkModeBtn.addEventListener('keydown', (e) => {
    let letter = e.key.toLowerCase()
    if (letter == 'enter') {
        e.preventDefault()
        body.classList.toggle('dark-mode')
    }

})

