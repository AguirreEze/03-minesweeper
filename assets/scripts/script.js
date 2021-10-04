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
head.addEventListener('click',() => buildBoard())
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
        for(let i = 0; i < columns; i++){
            for(let j = 0; j < rows; j++){
                const cell = document.createElement('DIV')
                cell.setAttribute('class', 'cell')
                cell.setAttribute('id', `${i}${j}`)
                fragment.append(cell)
            }
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
    let bombPosition = []
    while(bombPosition.length < bombs){
        const positionColumn = Math.ceil(Math.random() * columns) -1
        const positionRow = Math.ceil(Math.random() * rows) -1
        const bomb = `${positionColumn}${positionRow}`
        if(bombPosition.indexOf(bomb) == -1){
            bombPosition.push(bomb)
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
    if(isBomb(cell.id)){
        setGameOver()
        head.setAttribute('src', 'assets/images/dead.svg')
        cell.classList.add('bomb_explode')
        showAllBombs()
        return
    }
    const value = calculateCellValue(cell)
    if(value != 0) cell.textContent = value
    setColor(cell, value)
    cell.classList.add('cell_revealed')
}

const isBomb = (id) =>{
    return (bombIndex.indexOf(id) != -1)
}

const setGameOver = () =>{
    stopTimer()
    gameOver = true
}

const calculateCellValue = (cell) =>{
    let value = 0
    let yPos = cell.id.slice(1)
    let xPos = cell.id.slice(0, -1)
    if(isBomb(`${parseInt(xPos)-1}${parseInt(yPos)-1}`)) value++
    if(isBomb(`${xPos}${parseInt(yPos)-1}`)) value++
    if(isBomb(`${parseInt(xPos)+1}${parseInt(yPos-1)}`)) value++
    if(isBomb(`${parseInt(xPos)+1}${yPos}`)) value++
    if(isBomb(`${parseInt(xPos)+1}${parseInt(yPos)+1}`)) value++
    if(isBomb(`${xPos}${parseInt(yPos)+1}`)) value++
    if(isBomb(`${parseInt(xPos)-1}${parseInt(yPos)+1}`)) value++
    if(isBomb(`${parseInt(xPos)-1}${yPos}`)) value++
    return value
}

const setColor = (cell, value) => {
    switch(value){
        case 1:
            cell.classList.add('one')
            break;
        case 2:
            cell.classList.add('two')
            break;
        case 3:
            cell.classList.add('three')
            break;
        case 4:
            cell.classList.add('four')
            break;
        case 5:
            cell.classList.add('five')
            break;
        case 6:
            cell.classList.add('six')
            break;
        case 7:
            cell.classList.add('seven')
            break;
        case 8:
            cell.classList.add('eight')
            break;          
    }
}

const showAllBombs = () =>{
    for(id of bombIndex){
        const cell = document.getElementById(id)
        const fragment = document.createElement('img')
        fragment.setAttribute('src', 'assets/images/bomb.svg')
        fragment.classList.add('bomb')
        cell.append(fragment)
    }
}