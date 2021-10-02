const form = document.getElementById('form')
const errorMensage = document.getElementById('error_mensage')
const mineCounter = document.getElementById('mine_counter')
const head = document.getElementById('head')
const timer = document.getElementById('timer')
const board = document.getElementById('board')

let gameOver = false 
let bombIndex = []
let boardRows
let boardColumns
let counter = 1
let countUp = false

addEventListener('load', () => buildBoard())
form[0].addEventListener('change', () => dificultySetting())
form[4].addEventListener('click', () => buildBoard())
board.addEventListener('mouseup', (e) => {
    if(!gameOver)startTimer()
    revealCell(e.target)
})

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

const buildBoard = async () =>{
    try{
        const [columns, rows, bombs] = await getBoard()
        errorMensage.textContent = ''
        root = document.documentElement
        root.style.setProperty('--board-colums', columns)
        root.style.setProperty('--board-rows', rows)
        root.style.setProperty('--board-height', (columns * 30) + 'px')
        root.style.setProperty('--board-width', (rows*30) + 'px')
        mineCounter.textContent = bombs
        while(board.firstChild){
            board.removeChild(board.firstChild)
        }
        const fragment = document.createDocumentFragment()
        for(let i = 0; i < columns * rows; i++){
            const cell = document.createElement('DIV')
            cell.setAttribute('class', 'cell')
            cell.setAttribute('id', i)
            fragment.append(cell)
        }
        board.append(fragment)
        bombIndex = setBombs(columns, rows, bombs)
        boardColumns = columns
        boardRows = rows
        resetTimer()
        head.setAttribute('src', 'assets/images/smile.svg')
        gameOver = false
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
            const rows = parseInt(form[1].value)
            const columns = parseInt(form[2].value)
            const bombs = parseInt(form[3].value)
            if(columns < 8 || columns > 32) {
                throw new Error('Invalid Columns value')
            }else if(rows < 8 || rows > 24){
                throw new Error('Invalid Rows value')
            }else if(bombs < 1 || bombs > (columns * rows / 3)){
                throw new Error ('Invalid Bombs value')
            }else return ([rows, columns, bombs])
    }
}

setBombs = (columns, rows, bombs) => {
    let cells = columns * rows
    let bombPosition = []
    while(bombPosition.length < bombs){
        const position = Math.ceil(Math.random() * cells) -1
        if(bombPosition.indexOf(position) == -1){
            bombPosition.push(position)
        }
    }
    return bombPosition
}

const gameTimer = setInterval(() => {
    if(!countUp || counter > 999) return 
    timer.textContent = counter
    counter++
    gameTimer
}, 1000);

const startTimer = () => countUp = true
const stopTimer = () => countUp = false
const resetTimer = () =>{
    stopTimer()
    counter = 1
    timer.textContent = '000' 
}

const revealCell = (cell) => {
    if(gameOver) return
    if(isBomb(cell)){
        setGameOver()
        head.setAttribute('src', 'assets/images/dead.svg')
    }
    const value = calculateCellValue(cell)
}

const isBomb = (cell) =>{
    return (bombIndex.indexOf(parseInt(cell.id)) != -1)
}

const setGameOver = () =>{
    stopTimer()
    gameOver = true
}

calculateCellValue = (cell) =>{
    let boardCells = (boardColumns * boardRows)
    if(cell.id == 0){
        console.log('top left')
    }
    if(cell.id == boardRows - 1){
        console.log('top right')
    }
    if(cell.id == boardCells - boardRows){
        console.log('bottom left')
    }
    if(cell.id == boardCells -1){
        console.log('bottom right')
    }
    if(cell.id < boardRows){
        console.log('upper row')
    }
    if(cell.id >= boardCells - boardRows){
        console.log('lower Row')
    }
    if((parseInt(cell.id) + 1) % boardRows == 0){
        console.log('right column')
    }
    if(parseInt(cell.id) % boardRows == 0){
        console.log('left column')
    }
}