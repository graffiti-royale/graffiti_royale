function playPageJavaScript () {
  const canvas = document.querySelector('#drawMap')
  const upCanvas = document.querySelector('#upcanvas')
  context = canvas.getContext('2d')
  upContext = upCanvas.getContext('2d')
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  upCanvas.width = window.innerWidth
  upCanvas.height = window.innerHeight

  const ZOOMFACTOR = 4
  let paint
  let myPath = []
  let pointerCache = []
  let room = document.URL.split('/')[3]
  let drawSocket = new WebSocket(`wss://${window.location.host}/ws/draw/${room}/`)
  let usersSocket = new WebSocket(`wss://${window.location.host}/ws/${room}/users`)
  let zoomedOut = true
  let xOffset
  let yOffset

  let colorsArray = ['#070404', '#df4b26', '#040507', '#32ED2C', '#13d9f3', '#f313f3', '#f3ef13']
  const color = colorsArray[Math.floor(Math.random() * colorsArray.length)]

  let username = document.querySelector('.username').dataset.username
  let users

  usersSocket.onopen = function (event) {
    console.log(username)
    usersSocket.send(JSON.stringify({
      'username': username,
      'enter': true
    }))
  }

  usersSocket.onmessage = function (event) {
    let data = JSON.parse(event.data)
    users = data['users']
    console.log(`Users updated:`)
    console.log(users)
  }

  window.addEventListener('beforeunload', function () {
    console.log('closing!')
    usersSocket.send(JSON.stringify({
      'username': username,
      'enter': false,
      'guest': users[username][0]
    }))
    usersSocket.close()
  })

  drawSocket.onmessage = function (event) {
    let data = JSON.parse(event.data)
    if (username != data['username']) {
      if (zoomedOut) { context.scale(1 / ZOOMFACTOR, 1 / ZOOMFACTOR) }
      context.strokeStyle = data['color']
      context.shadowBlur = 2
      context.shadowColor = data['color']
      context.lineJoin = "round"
      context.lineWidth = 4

      users[data['username']][1].push([[data['path'][0][0], data['path'][0][1]],[data['path'][1][0], data['path'][1][1]]])
      context.beginPath()
      context.moveTo(data['path'][0][0], data['path'][0][1])
      context.lineTo(data['path'][1][0], data['path'][1][1])
      context.stroke()
      if (zoomedOut) { context.scale(ZOOMFACTOR, ZOOMFACTOR) }
    }
  }

  upCanvas.addEventListener('dblclick', function (event) {
    upContext.clearRect(0, 0, canvas.width, canvas.height)
    if (zoomedOut) {
      let X = Math.min(Math.max(event.pageX, canvas.width / ZOOMFACTOR / 2), canvas.width - canvas.width / ZOOMFACTOR / 2)
      let Y = Math.min(Math.max(event.pageY, canvas.height / ZOOMFACTOR / 2), canvas.height - canvas.height / ZOOMFACTOR / 2)
      xOffset = (X * ZOOMFACTOR) - canvas.width / 2
      yOffset = (Y * ZOOMFACTOR) - canvas.height / 2
      let moveX = -1 * (Math.max(X, canvas.width / ZOOMFACTOR / 2) - (canvas.width / 2))
      let moveY = -1 * (Math.max(Y, canvas.height / ZOOMFACTOR / 2) - (canvas.height / 2))
      X = X * 100 / canvas.width
      Y = Y * 100 / canvas.height
      console.log(xOffset)
      let coord = `${X}% ${Y}%`
      canvas.style.transform = `translate(${moveX}px, ${moveY}px) scale(${ZOOMFACTOR}, ${ZOOMFACTOR})`
      canvas.style.transformOrigin = coord
      zoomedOut = false
      context.scale(1 / ZOOMFACTOR, 1 / ZOOMFACTOR)
    } else {
      canvas.style.transform = 'scale(1, 1)'
      zoomedOut = true
      context.scale(ZOOMFACTOR, ZOOMFACTOR)
    }
  })

  upCanvas.addEventListener('mousedown', function (event) {
    if (!zoomedOut) {
      var mouseX = event.pageX + xOffset
      var mouseY = event.pageY + yOffset
      paint = true
      myPath.push([mouseX, mouseY])
    }
  })

  upCanvas.addEventListener('touchstart', function(event) {
    if (!zoomedOut) {
      var mouseX = event.touches[0].pageX+xOffset;
      var mouseY = event.touches[0].pageY+yOffset;
      paint = true
      myPath.push([mouseX, mouseY])
    }
  })

  upCanvas.addEventListener('mouseup', function(event) {
    if (!zoomedOut) {
      paint = false
      myPath = []
    }
  })

  upCanvas.addEventListener('touchend', function(event) {
    if (!zoomedOut) {
      paint = false
      myPath = [] 
    }
  })

  upCanvas.addEventListener('mouseleave', function(event) {
    if (!zoomedOut) {
      paint = false
      myPath = []
    }
  })

  upCanvas.addEventListener('mousemove', function (event) {
    if (paint && !zoomedOut) {
      myPath.push([event.pageX + xOffset, event.pageY + yOffset])
      drawSocket.send(JSON.stringify({
        'path': myPath,
        'color': color,
        'username': username
      }))
      context.strokeStyle = color
      context.shadowBlur = 2
      context.shadowColor = color
      context.lineCap = "round"
      context.lineWidth = 4
      context.beginPath()
      context.moveTo(myPath[0][0], myPath[0][1])
      context.lineTo(myPath[1][0], myPath[1][1])
      context.stroke()
      myPath.shift()
    } else if (zoomedOut) {
      let X = Math.min(Math.max(event.pageX, upCanvas.width / ZOOMFACTOR / 2), upCanvas.width - upCanvas.width / ZOOMFACTOR / 2)
      let Y = Math.min(Math.max(event.pageY, upCanvas.height / ZOOMFACTOR / 2), upCanvas.height - upCanvas.height / ZOOMFACTOR / 2)
      upContext.clearRect(0, 0, upCanvas.width, upCanvas.height)
      upContext.strokeRect(X - upCanvas.width / ZOOMFACTOR / 2, Y - upCanvas.height / ZOOMFACTOR / 2, upCanvas.width / ZOOMFACTOR, upCanvas.height / ZOOMFACTOR)
    }
  })

  upCanvas.addEventListener('touchmove', function(event) {
    event.preventDefault()
    if (paint && !zoomedOut) {
      myPath.push([event.touches[0].pageX+xOffset, event.touches[0].pageY+yOffset])
      drawSocket.send(JSON.stringify({
        'path': myPath,
        'color': color,
        'username': username
      }))
      context.strokeStyle = color
      context.shadowBlur = 2
      context.shadowColor = color
      context.lineCap = "round"
      context.lineWidth = 4
      context.beginPath()
      context.moveTo(myPath[0][0], myPath[0][1])
      context.lineTo(myPath[1][0], myPath[1][1])
      context.stroke()
      myPath.shift()
    } else if (zoomedOut) {
      let X = Math.min(Math.max(event.touches[0].pageX, upCanvas.width/ZOOMFACTOR/2), upCanvas.width-upCanvas.width/ZOOMFACTOR/2) 
      let Y = Math.min(Math.max(event.touches[0].pageY, upCanvas.height/ZOOMFACTOR/2), upCanvas.height-upCanvas.height/ZOOMFACTOR/2)
      upContext.clearRect(0, 0, upCanvas.width, upCanvas.height) 
      upContext.strokeRect(X-upCanvas.width/ZOOMFACTOR/2, Y-upCanvas.height/ZOOMFACTOR/2, upCanvas.width/ZOOMFACTOR, upCanvas.height/ZOOMFACTOR)
    }
  })

  window.addEventListener('scroll', function(event) {
    window.scrollTo(0, 0)
  })

  module.exports = {
  }
}

let onPlayPage = document.querySelector('#playPage')

if (onPlayPage) {
  playPageJavaScript()
}
