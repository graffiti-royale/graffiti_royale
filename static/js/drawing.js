function drawingScript2 () {
  let roomData = document.querySelector('#room-data').dataset.roomData
  roomData = JSON.parse(roomData)
  const drawMap = document.querySelector('#drawMap')
  const miniMap = document.querySelector('#miniMap')
  const drawMapCxt = drawMap.getContext('2d')
  const miniMapCxt = miniMap.getContext('2d')
  const username = window.location.href.split('/')[5]
  drawMap.width = window.innerWidth
  drawMap.height = window.innerHeight
  miniMap.width = 600
  miniMap.height = 600

  let paint
  let zoomedOut = true
  const ZOOMFACTOR = 8
  miniMapCxt.scale(1 / ZOOMFACTOR, 1 / ZOOMFACTOR)
  let zoomCenter = []
  let xOffset = 0
  let yOffset = 0

  /* Setting up visuals */
  const bricks = document.querySelector('#bricks')
  const background = document.querySelector('#background')

  miniMap.addEventListener('mousemove', function (event) {
    if (zoomedOut) {
      let X = Math.min(
        Math.max(event.pageX - this.offsetLeft, drawMap.width / ZOOMFACTOR / 2), miniMap.width - drawMap.width / ZOOMFACTOR / 2
      ) * ZOOMFACTOR
      let Y = Math.min(
        Math.max(event.pageY - this.offsetTop, drawMap.height / ZOOMFACTOR / 2),
        miniMap.height - drawMap.height / ZOOMFACTOR / 2
      ) * ZOOMFACTOR
      zoomCenter = [Math.floor(X), Math.floor(Y)]
    }
  })

  miniMap.addEventListener('dblclick', function (event) {
    zoomedOut = false
    xOffset = zoomCenter[0] - drawMap.width / 2
    yOffset = zoomCenter[1] - drawMap.height / 2
    drawMap.style.zIndex = 4
    miniMap.style.zIndex = 1
    let moveX = -1 * (((zoomCenter[0] / ZOOMFACTOR) - (window.innerWidth / 2)) + miniMap.offsetLeft)
    let moveY = -1 * (((zoomCenter[1] / ZOOMFACTOR) - (window.innerHeight / 2)) + miniMap.offsetTop)
    X = zoomCenter[0] * 100 / miniMap.width / ZOOMFACTOR
    Y = zoomCenter[1] * 100 / miniMap.height / ZOOMFACTOR
    let coord = `${X}% ${Y}%`
    bricks.style.transform = `translate(${moveX}px, ${moveY}px) scale(${ZOOMFACTOR}, ${ZOOMFACTOR})`
    bricks.style.transformOrigin = coord
  })

  drawMap.addEventListener('dblclick', function (event) {
    zoomedOut = true
    drawMap.style.zIndex = 1
    miniMap.style.zIndex = 4
    bricks.style.transform = 'scale(1, 1)'
    drawMapCxt.clearRect(0, 0, drawMap.width, drawMap.height)
  })

  let drawSocket = new WebSocket(`wss://${window.location.host}/ws/${roomData['roompk']}/draw/`)

  drawSocket.onmessage = function (event) {
    let data = JSON.parse(event.data)
    if (data['username'] !== username) {
      if (data['new_path']) {
        roomData[data['username']]['paths'].push(data['point'])
      } else {
        roomData[data['username']]['paths'][roomData[data['username']]['paths'].length - 1].push(data['point'])
      }
    }
  }

  drawMap.addEventListener('mousedown', function (event) {
    paint = true
    roomData[username]['paths'].push([[
      Math.floor(event.pageX) + xOffset,
      Math.floor(event.pageY) + yOffset
    ]])
    drawSocket.send(JSON.stringify({
      'username': username,
      'point': [
        Math.floor(event.pageX) + xOffset,
        Math.floor(event.pageY) + yOffset
      ],
      'new_path': true
    }))
  })

  drawMap.addEventListener('mousemove', function (event) {
    if (paint) {
      roomData[username]['paths'][roomData[username]['paths'].length - 1].push([
        Math.floor(event.pageX) + xOffset,
        Math.floor(event.pageY) + yOffset
      ])
      drawSocket.send(JSON.stringify({
        'username': username,
        'point': [
          Math.floor(event.pageX) + xOffset,
          Math.floor(event.pageY) + yOffset
        ],
        'new_path': false
      }))
    }
  })

  drawMap.addEventListener('mouseup', function () {
    paint = false
  })

  drawMap.addEventListener('mouseleave', function () {
    paint = false
  })

  /* Redraw function */
  function redraw () {
    miniMapCxt.clearRect(0, 0, miniMap.width * ZOOMFACTOR, miniMap.height * ZOOMFACTOR)
    for (let user of Object.values(roomData)) {
      let color = user['color']
      let paths = user['paths']
      miniMapCxt.strokeStyle = color
      miniMapCxt.shadowColor = color
      miniMapCxt.shadowBlur = 2
      miniMapCxt.lineCap = 'round'
      miniMapCxt.lineWidth = 4

      for (let path of paths) {
        miniMapCxt.beginPath()
        miniMapCxt.moveTo(path[0][0], path[0][1])
        for (i = 1; i < path.length; i++) {
          miniMapCxt.moveTo(path[i][0], path[i][1])
          miniMapCxt.lineTo(path[i - 1][0], path[i - 1][1])
        }
        miniMapCxt.stroke()
      }
    }
    if (zoomCenter) {
      miniMapCxt.shadowBlur = 0
      miniMapCxt.lineCap = 'round'
      miniMapCxt.lineWidth = 4
      miniMapCxt.strokeStyle = '#000000'
      miniMapCxt.strokeRect(
        zoomCenter[0] - drawMap.width / 2,
        zoomCenter[1] - drawMap.height / 2,
        drawMap.width,
        drawMap.height
      )
    }

    if (!zoomedOut) {
      drawMapCxt.clearRect(0, 0, drawMap.width, drawMap.height)
      for (let user of Object.values(roomData)) {
        let color = user['color']
        let paths = user['paths']
        drawMapCxt.strokeStyle = color
        drawMapCxt.shadowColor = color
        drawMapCxt.shadowBlur = 4
        drawMapCxt.lineCap = 'round'
        drawMapCxt.lineWidth = 6

        for (let path of paths) {
          drawMapCxt.beginPath()
          drawMapCxt.moveTo(
            (path[0][0] - xOffset),
            (path[0][1] - yOffset)
          )
          for (i = 2; i < path.length; i++) {
            drawMapCxt.moveTo(
              (path[i][0] - xOffset),
              (path[i][1] - yOffset)
            )
            drawMapCxt.arcTo(
              (path[i - 1][0] - xOffset),
              (path[i - 1][1] - yOffset),
              (path[i - 2][0] - xOffset),
              (path[i - 2][1] - yOffset),
              2
            )
          }
          drawMapCxt.stroke()
        }
      }
    }
  }

  popup = document.querySelector('#playerspopup')
  playerList = document.querySelector('#playerlist')
  popup.addEventListener('click', function (e) {
    if (!playerList.style.display || playerList.style.display === 'none') {
      playerList.style.display = 'flex'
    } else {
      playerList.style.display = 'none'
    }
  })

  var start = null
  function step (timestamp) {
    redraw()
    window.requestAnimationFrame(step)
  }
  window.requestAnimationFrame(step)
}

// This is currently not bundling into our bundle.js, so none of it works on the site.
// We will likely need an array of all currently active words, then I can correctly see if one of the words was submitted. I will need to talk to Michael to figure out how to index up our score when correctly submitting a word.

// This currently only works when you hit the submit button, we will need to find a way to submit when you press the enter key. I tried searching for the answer online, but everything I found needed the use of jQuery.

// let wordGuessed = document.querySelector(".wordGuessed");
// let submitWordGuessed = document.querySelector(".submitWordGuessed");

// submitWordGuessed.onclick = function(){console.log(wordGuessed.value)
//     if(wordGuessed.value == "This will be our wordlist from Django"){
//     }
// }

let onPlayPage = document.querySelector('#playPage')

if (onPlayPage) {
  document.addEventListener('DOMContentLoaded', function () {
    drawingScript2()
  })
}

module.exports = { drawingScript2: drawingScript2 }
