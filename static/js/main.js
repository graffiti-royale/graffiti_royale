function playPageJavaScript(){
  const canvas = document.querySelector('canvas')
  context = canvas.getContext('2d')
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  let paint
  let myPath = []
  let room = document.URL.split('/')[3]
  let drawSocket = new WebSocket(`ws://${window.location.host}/ws/draw/${room}/`)
  let usersSocket = new WebSocket(`ws://${window.location.host}/ws/${room}/users`)
  let zoomedOut = true
  let xOffset
  let yOffset

  let colorsArray = ['#070404', '#df4b26', '#040507', '#32ED2C', '#13d9f3', '#f313f3', '#f3ef13']
  const color = colorsArray[Math.floor(Math.random() * colorsArray.length)]

  let username = document.querySelector('.username').dataset.username
  let users

  usersSocket.onopen = function(event) {
    console.log(username)
    usersSocket.send(JSON.stringify({
      'username': username,
      'enter': true
    }))
  }

  usersSocket.onmessage = function(event) {
    let data = JSON.parse(event.data)
    users = data['users']
    console.log(`Users updated:`)
    console.log(users)
  }

  window.addEventListener('beforeunload', function(){
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
      if (zoomedOut) {context.scale(.25, .25)}
      context.strokeStyle = data['color']
      context.shadowBlur = 4
      context.shadowColor = data['color']
      context.lineJoin = "round"
      context.lineWidth = 10

      users[data['username']][1].push([[data['path'][0][0], data['path'][0][1]],[data['path'][1][0], data['path'][1][1]]])
      console.log(users[data['username']])
      context.beginPath()
      context.moveTo(data['path'][0][0], data['path'][0][1])
      context.lineTo(data['path'][1][0], data['path'][1][1])
      context.stroke()
      if (zoomedOut) {context.scale(4, 4)}
    }
  }

  canvas.addEventListener('click', function(event) {
    if (zoomedOut) {
      let X = event.pageX 
      let Y = event.pageY
      xOffset = event.pageX * 2.75 
      yOffset = event.pageY * 2.75
      let moveX = -1*(Math.max(X, canvas.width/4)-(canvas.width/2))
      let moveY = -1*(Math.max(Y, canvas.height/4)-(canvas.height/2))
      X = X*100/canvas.width
      Y = Y*100/canvas.height
      let coord = `${X}% ${Y}%`
      canvas.style.transform = `translate(${moveX}px, ${moveY}px)` + 'scale(4, 4)'
      canvas.style.transformOrigin = coord
      zoomedOut = false
      context.scale(.25, .25)
    } else {
      canvas.style.transform = 'scale(1, 1)'
      zoomedOut = true
      context.scale(4, 4)
    }
  })

  canvas.addEventListener('mousedown', function(event) {
    if (!zoomedOut) {
      var mouseX = event.pageX + xOffset;
      var mouseY = event.pageY + yOffset;
      paint = true
      myPath.push([mouseX, mouseY])
    }
  })

  canvas.addEventListener('mouseup', function(event) {
    if (!zoomedOut) {
      paint = false
      myPath = [] 
    }
  })

  canvas.addEventListener('mouseleave', function(event) {
    if (!zoomedOut) {
      paint = false
      myPath = [] 
    }
  })

  canvas.addEventListener('mousemove', function(event) {
    if (paint && !zoomedOut) {
      myPath.push([event.pageX + xOffset, event.pageY + yOffset])
      drawSocket.send(JSON.stringify({
        'path': myPath,
        'color': color,
        'username': username
      }))
      context.strokeStyle = color
      context.shadowBlur = 4
      context.shadowColor = color
      context.lineCap = "round"
      context.lineWidth = 10
      context.beginPath()
      context.moveTo(myPath[0][0], myPath[0][1])
      context.lineTo(myPath[1][0], myPath[1][1])
      context.stroke()
      myPath.shift()
    }
  })

  module.exports = {
  }
}

let onPlayPage = document.querySelector("#playPage");

if (onPlayPage){
  playPageJavaScript();
}
