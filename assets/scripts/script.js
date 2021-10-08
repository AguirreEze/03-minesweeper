const form = document.getElementById('form')
const errorMensage = document.getElementById('error_mensage')
const mineCounter = document.getElementById('mine_counter')
const head = document.getElementById('head')
const timerDisplay = document.getElementById('timer')
const board = document.getElementById('board')

class Timer{
    constructor(){
        this.running = false
        this.counter = 0
    }
    startTimer(){
        this.running = true
        this.count()
        timerDisplay.classList.remove('clock_tick')
        mineCounter.classList.remove('clock_tick')
    }
    stopTimer(){
        this.running = false
        timerDisplay.classList.add('clock_tick')
        mineCounter.classList.add('clock_tick')
    }
    resetTimer(){
        this.stopTimer()
        this.counter = 0
        timerDisplay.textContent = '000'
    }
    count(){
        if(this.counter >= 999) this.stopTimer()
        if(this.running){
            this.counter++
            timerDisplay.textContent = this.counter
            setTimeout(()=>this.count(), 1000)
        }
    }
    
}

class Board{
    constructor(){
        this.bombIndex
        switch(form[0].value){
            case 'begginer':
                this.rows = 8
                this.columns = 8
                this.bombs = 10
            case 'intermediate':
                this.rows = 16
                this.columns = 16
                this.bombs = 40
            case 'expert':
                this.rows = 16
                this.columns = 30
                this.bombs = 99
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
                }else {
                    this.rows = rows
                    this.columns = columns
                    this.bombs = bombs
                }
        }
    }
    buildBoard(){
        try{
            errorMensage.textContent = ''
            let root = document.documentElement
            root.style.setProperty('--board-colums', this.columns)
            root.style.setProperty('--board-rows', this.rows)
            root.style.setProperty('--board-height', (this.rows * 25) + 'px')
            root.style.setProperty('--board-width', (this.columns*25) + 'px')
            mineCounter.textContent = this.bombs
            while(board.firstChild){
                board.removeChild(board.firstChild)
            }
            const fragment = document.createDocumentFragment()
            for(let i = 0; i < this.rows; i++){
                for(let j = 0; j < this.columns; j++){
                    const cell = document.createElement('DIV')
                    cell.setAttribute('class', 'cell')
                    cell.setAttribute('id', `${i} ${j}`)
                    fragment.append(cell)
                }
            }
            board.append(fragment)
            this.setBombs()
            timer.resetTimer()
            head.setAttribute('src', 'assets/images/smile.svg')
            form[4].value = 'Reset Game'
            gameOver = false
        }catch (error){
            errorMensage.textContent = error +'. (Hover over the option to see the valid values)'
        }
    }
    setBombs(){
        let bombPosition = []
        while(bombPosition.length < this.bombs){
            const positionColumn = Math.ceil(Math.random() * this.columns) -1
            const positionRow = Math.ceil(Math.random() * this.rows) -1
            const bomb = `${positionRow} ${positionColumn}`
            if(bombPosition.indexOf(bomb) == -1){
                bombPosition.push(bomb)
            }
        }
        this.bombIndex = bombPosition
    }
    showAllBombs(){
        for(let id of this.bombIndex){
            const cell = document.getElementById(id)
            const fragment = document.createElement('img')
            fragment.setAttribute('src', 'assets/images/bomb.svg')
            fragment.classList.add('bomb')
            cell.append(fragment)
        }
    }
}

let timer = new Timer()
let boardStats = new Board()
let gameOver = false 

addEventListener('load', () => boardStats.buildBoard())
form.addEventListener('change', () =>{
    if(form[1].value == boardStats.rows && form[2].value == boardStats.columns && form[3].value == boardStats.bombs){
        form[4].value = 'Reset Game'
    } else {
        form[4].value = 'Start Game'
    }
})
form[0].addEventListener('change', () => dificultySetting())
form[4].addEventListener('click', () => {
    boardStats = new Board()
    boardStats.buildBoard()
})
head.addEventListener('click',() => {
    boardStats = new Board()
    boardStats.buildBoard()
})
board.addEventListener('mouseup', (e) => {
    if(!gameOver){
        if(!timer.running)timer.startTimer()
        head.setAttribute('src', 'assets/images/smile.svg')
    }
    revealCell(e.target)
})
board.addEventListener('mousedown', (e) => {
    if(!gameOver && e.target.classList[0] == 'cell'){
        head.setAttribute('src', 'assets/images/surprise.svg')
    }
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

const revealCell = (cell) => {
    if(gameOver) return
    if(cell.classList[0]== 'cell'){
        if(isBomb(cell.id)){
        cell.classList.add('bomb_explode', 'no_hover')
        setGameOver()
        return
    }
    const value = calculateCellValue(cell)
    setColor(cell, value)
    cell.classList.replace('cell', 'cell_revealed')
    if(value == 0) {
        let adjacentCells = getAdjacentCells(cell.id)
        for(let id of adjacentCells){
            let newCell = document.getElementById(id)
            if(newCell){
                if(newCell.classList[1] != 'cell_revealed')revealCell(newCell)
            }
        }
    }else{
    cell.textContent = value
    }
}
}

const isBomb = (id) =>{
    return (boardStats.bombIndex.indexOf(id) != -1)
}

const setGameOver = () =>{
    head.setAttribute('src', 'assets/images/dead.svg')
    boardStats.showAllBombs()
    timer.stopTimer()
    gameOver = true
}

const calculateCellValue = (cell) =>{
    let value = 0
    let adjacentCells = getAdjacentCells(cell.id)
    for(let id of adjacentCells) {
        if(isBomb(id)) value++
    }
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

const getAdjacentCells = (id) =>{
    const separationIndex = id.indexOf(' ')
    let yPos = id.slice(separationIndex)
    let xPos = id.slice(0, -(separationIndex))
    return[
        `${parseInt(xPos)-1} ${parseInt(yPos)-1}`,
        `${parseInt(xPos)} ${parseInt(yPos)-1}`,
        `${parseInt(xPos)+1} ${parseInt(yPos)-1}`,
        `${parseInt(xPos)+1} ${parseInt(yPos)}`,
        `${parseInt(xPos)+1} ${parseInt(yPos)+1}`,
        `${parseInt(xPos)} ${parseInt(yPos)+1}`,
        `${parseInt(xPos)-1} ${parseInt(yPos)+1}`,
        `${parseInt(xPos)-1} ${parseInt(yPos)}`,
    ]
}