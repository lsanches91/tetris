document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid')
  const scoreDisplay = document.querySelector('#score')
  const startButton = document.querySelector('#startButton')  
  const width = 10
  let squares = Array.from(document.querySelectorAll('.grid div'))
  let nextRandom = 0
  let score = 0
  let timerID

  const iShape = [
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3],
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3]
  ]
  const lShape = [
    [1, width+1, width*2+1, 2],
    [width, width+1, width+2, width*2+2],
    [1, width+1, width*2+1, width*2],
    [width, width*2, width*2+1, width*2+2]
  ]
  const oShape = [
    [0, 1, width, width+1],
    [0, 1, width, width+1],
    [0, 1, width, width+1],
    [0, 1, width, width+1]
  ]  
  const tShape = [
    [1,width,width+1,width+2],
    [1,width+1,width+2,width*2+1],
    [width,width+1,width+2,width*2+1],
    [1,width,width+1,width*2+1]
  ]
  const zShape = [
    [0,width,width+1,width*2+1],
    [width+1, width+2,width*2,width*2+1],
    [0,width,width+1,width*2+1],
    [width+1, width+2,width*2,width*2+1]
  ]  

  const allShapes = [iShape, lShape, oShape, tShape, zShape]

  let currentPosition = 4
  let shapeRotation = 0

  let random = Math.floor(Math.random() * allShapes.length)
  let currentShape = allShapes[random][shapeRotation]

  function drawShape() {
    currentShape.forEach(index => {
      squares[currentPosition + index].classList.add('shapes')
      squares[currentPosition + index].style.backgroundColor = 'coral'
    })
  }

  function removeShape() {
    currentShape.forEach(index => {
      squares[currentPosition + index].classList.remove('shapes')
      squares[currentPosition + index].style.backgroundColor = ''
    })
  }    

  function moveDown() {
    removeShape()
    currentPosition += width
    drawShape()
    stop()
  }

  function stop() {
    if(currentShape.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
      currentShape.forEach(index => squares[currentPosition + index].classList.add('taken'))
      //Nova peça começa a cair
      random = nextRandom
      nextRandom = Math.floor(Math.random() * allShapes.length)
      currentShape = allShapes[random][shapeRotation]
      currentPosition = 4
      drawShape()
      displayNextShape()
      addScore()
      gameOver()
    }
  }

  function controlMovement(e) {
    if(e.keyCode === 37) {
      moveLeft()
    }
    else if (e.keyCode === 38) {
      rotate()
    }
    else if (e.keyCode === 39) {
      moveRight()
    }
    else if (e.keyCode === 40) {
      moveDown()
    }
  }

  document.addEventListener('keydown', controlMovement)

  function moveLeft() {
    removeShape()
    
    const isAtLeftSide = currentShape.some(index => (currentPosition + index) % width === 0)

    if(!isAtLeftSide) {
      currentPosition -= 1
    }
    
    if(currentShape.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition += 1
    }    

    drawShape()
  }

  function moveRight() {
    removeShape()
    const isAtRightSide = currentShape.some(index => (currentPosition +index) % width === width -1)

    if(!isAtRightSide) currentPosition += 1    

    if(currentShape.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition -= 1
    }

    drawShape()
  }

  function isAtRight() {
    return currentShape.some(index => (currentPosition + index + 1) % width === 0)
  }

  function isAtLeft() {
    return currentShape.some(index => (currentPosition + index) % width === 0)
  }

  function rotatePosition(pos) {
    pos = pos || currentPosition //Pega a posição atual, verifica se está no lado esquerdo primeiro
    if((pos + 1) % width < 4) {  //Adiciona 1 porque o index pode ser 1 a menos da onde realmente está
      if(isAtRight()) {          //Verificamos se a peça quando girado foi para o lado direito
        currentPosition += 1     //Se sim, adiciona +1 na posição atual para impedir que vá para o lado direto
        rotatePosition(pos)      //Caso a peça seja grande, realizamos a operação novamente com a nova posição
      }
    }
    else if (pos % width > 5) {
      if(isAtLeft()) {
        currentPosition -= 1
        rotatePosition(pos)
      }
    }
  }

  function rotate() {
    removeShape()
    shapeRotation ++
    if(shapeRotation === currentShape.length) {
      shapeRotation = 0
    }
    currentShape = allShapes[random][shapeRotation]
    rotatePosition()
    drawShape()
  }  

  const displaySquare = document.querySelectorAll('.mini-grid div')
  const nextWidth = 4
  let nextIndex = 0

  const nextShape = [
    [1, nextWidth+1, nextWidth*2+1, nextWidth*3+1], //iShape
    [1, nextWidth+1, nextWidth*2+1, 2], //lShape
    [0, 1, nextWidth, nextWidth+1], //oShape
    [1, nextWidth, nextWidth+1, nextWidth+2], //tShape
    [0, nextWidth, nextWidth+1, nextWidth*2+1], //zShape    
  ]

  function displayNextShape() {
    displaySquare.forEach(square => {
      square.classList.remove('shapes')
    })
    nextShape[nextRandom].forEach( index => {
      displaySquare[nextIndex + index].classList.add('shapes')
    })
  }

  startButton.addEventListener('click', () => {
    if(timerID) {
      clearInterval(timerID)
      timerID = null
    }
    else {
      drawShape()
      timerID = setInterval(moveDown, 1000)
      nextRandom = Math.floor(Math.random() * allShapes.length)
      displayNextShape()
    }
  })

  function addScore() {
    for (let i = 0; i < 199; i +=width) {
      const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

      if(row.every(index => squares[index].classList.contains('taken'))) {
        score +=10
        scoreDisplay.innerHTML = score
        row.forEach(index => {
          squares[index].classList.remove('taken')
          squares[index].classList.remove('shapes')
          squares[index].style.backgroundColor = ''
        })
        const squaresRemoved = squares.splice(i, width)
        squares = squaresRemoved.concat(squares)
        squares.forEach(cell => grid.appendChild(cell))
      }
    }
  }

  function gameOver() {
    if (currentShape.some(index => squares[currentShape + index].classList.contains('taken'))) {
      scoreDisplay.innerHTML = 'Game Over'
      clearInterval(timerID)
    }
  }

})