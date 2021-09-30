const form = document.getElementById('form')
const errorMensage = document.getElementById('error_mensage')
const mineCounter = document.getElementById('mine_counter')
const head = document.getElementById('head')
const timer = document.getElementById('timer')
const board = document.getElementById('board')


form[0].addEventListener('change', () =>dificultySetting())

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
            form[1].value = '8'
            form[2].value = '8'
            form[3].value = '1'
            break;
        }
    }


form[4].addEventListener('click', () => buildBoard())

const buildBoard = async (board) =>{
    try{
        const board = await getBoard()
        errorMensage.textContent = ''
        console.log(board)
    }catch (error){
        errorMensage.textContent = error +'. (Hover over the option to see the valid values)'
    }
}

getBoard = async () => {
    switch(form[0].value){
        case 'begginer':
            return ([8, 8, 10])
        case 'intermediate':
            return([16, 16, 40])
        case 'expert':
            return([16, 30, 99])
        case 'custom':
            const columns = parseInt(form[1].value)
            const rows = parseInt(form[2].value)
            const bombs = parseInt(form[3].value)
            if(columns < 8 || columns > 32) {
                throw new Error('Invalid Columns value')
            }else if(rows < 8 || rows > 24){
                throw new Error('Invalid Rows value')
            }else if(bombs < 1 || bombs > (columns * rows / 3)){
                throw new Error ('Invalid Bombs value')
            }else return ([columns, rows, bombs])
    }
}

