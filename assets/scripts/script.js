const form = document.getElementById('form')
const mineCounter = document.getElementById('mine_counter')
const head = document.getElementById('head')
const timer = document.getElementById('timer')
const board = document.getElementById('board')

console.log(form[0].value)
const dificultySetting = () =>{
    if(form[0].value == 'custom'){
        form[1].removeAttribute('disabled')
        form[2].removeAttribute('disabled')
        form[3].removeAttribute('disabled')
    }else {
        form[1].setAttribute('disabled', true)
        form[2].setAttribute('disabled', true)
        form[3].setAttribute('disabled', true)
    }
    switch (form[0].value){
        case 'begginer':
            form[1].value = '8'
            form[2].value = '8'
            form[3].value = '10'
            break;
        case 'intermediate':
            form[1].value = '16'
            form[2].value = '16'
            form[3].value = '40'
            break;
        case 'expert':
            form[1].value = '16'
            form[2].value = '30'
            form[3].value = '99'
            break;
        case 'custom':
            form[1].value = ''
            form[2].value = ''
            form[3].value = ''
            break;
    }
}
form[0].addEventListener('change', () =>{
    dificultySetting()
})

const buildBoard = (form) =>{
}
