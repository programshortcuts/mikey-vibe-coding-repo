const darkmodeBtn = document.getElementById('darkmodeBtn')
const body = document.querySelector('body')
addEventListener('keydown', e => {
    let letter = e.key.toLowerCase()
    let isShiftPressed = e.shiftKey

    if (isShiftPressed && letter == 'k') {
        body.classList.toggle('dark-mode')
    }
})

darkmodeBtn.addEventListener('click', (e) => { 
    e.preventDefault()
    body.classList.toggle('dark-mode') 
})
darkmodeBtn.addEventListener('keydown', (e) => {
    let letter = e.key.toLowerCase()
    if (letter == 'enter') {
        e.preventDefault()
        body.classList.toggle('dark-mode')
    }

})

