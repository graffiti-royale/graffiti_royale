function drawingScript2 () {
    /* Setting up the canvas */
    const drawMap = document.querySelector('#drawMap')
    const miniMap = document.querySelector('#upcanvas')
    const drawMapCxt = drawMap.getContext('2d')
    miniMapCxt = miniMap.getContext('2d')
    drawMap.width = window.innerWidth
    drawMap.height = window.innerHeight
    miniMap.width = 600
    miniMap.height = 600
    drawMapCxt.shadowBlur = 4
    drawMapCxt.lineCap = "round"
    drawMapCxt.lineWidth = 4

    let paint
    let zoomedOut = true
    const ZOOMFACTOR = 8
    miniMapCxt.scale(1/ZOOMFACTOR, 1/ZOOMFACTOR)
    let zoomCenter = []
    let xOffset = 0
    let yOffset = 0

    /* Setting up personal info */
    let colorsArray = ['#070404', '#df4b26', '#040507', '#32ED2C', '#13d9f3', '#f313f3', '#f3ef13']
    const myColor = colorsArray[Math.floor(Math.random() * colorsArray.length)]
    let username = document.querySelector('.username').dataset.username

    let userPaths = {}
    let room = document.URL.split('/')[3]
    let usersSocket = new WebSocket(`wss://${window.location.host}/ws/${room}/users`)
    usersSocket.onopen = function (event) {
        console.log(username)
        usersSocket.send(JSON.stringify({
            'username': username,
            'enter': true,
            'color': myColor
        }))
    }

    usersSocket.onmessage = function (event) {
        let data = JSON.parse(event.data)
        userPaths = data['users']
        console.log(`Users updated:`)
        console.log(userPaths)
    }

    window.addEventListener('beforeunload', function () {
        console.log('closing!')
        usersSocket.send(JSON.stringify({
            'username': username,
            'enter': false,
            'color': myColor
        }))
        usersSocket.close()
    })

    miniMap.addEventListener('mousemove', function(event) {
        if (zoomedOut) {
            let X = Math.min(
                Math.max(event.pageX - this.offsetLeft, drawMap.width / ZOOMFACTOR / 2), miniMap.width - drawMap.width / ZOOMFACTOR / 2
            )*ZOOMFACTOR
            let Y = Math.min(
                Math.max(event.pageY - this.offsetTop, drawMap.height / ZOOMFACTOR / 2), 
                miniMap.height - drawMap.height / ZOOMFACTOR / 2
            )*ZOOMFACTOR
            zoomCenter = [Math.floor(X), Math.floor(Y)]
        }
    })

    miniMap.addEventListener('dblclick', function(event) {
        zoomedOut = false
        xOffset = zoomCenter[0] - drawMap.width / 2
        yOffset = zoomCenter[1] - drawMap.height / 2
        console.log(xOffset, yOffset)
        drawMap.style.zIndex = 3
        console.log(drawMap.style)
    })

    drawMap.addEventListener('dblclick', function(event) {
        zoomedOut = true
        drawMap.style.zIndex = 1
        drawMapCxt.clearRect(0, 0, drawMap.width, drawMap.height)
    })
    
    let drawSocket = new WebSocket(`wss://${window.location.host}/ws/draw/${room}/`)    

    drawSocket.onmessage = function(event) {
        let data = JSON.parse(event.data)
        if (data['username'] != username) {
            if (data['new_path']) {
                userPaths[data['username']]['paths'].push(data['point'])
            } else {
                userPaths[data['username']]['paths'][userPaths[data['username']]['paths'].length-1].push(data['point'])
            }
        }
    }

    drawMap.addEventListener('mousedown', function(event) {
        paint = true
        userPaths[username]['paths'].push([[
            Math.floor(event.pageX)+xOffset, 
            Math.floor(event.pageY)+yOffset
        ]])
        drawSocket.send(JSON.stringify({
            "username": username,
            "point": [
                Math.floor(event.pageX)+xOffset, 
                Math.floor(event.pageY)+yOffset
            ],
            "new_path": true 
        }))
    })  
    
    drawMap.addEventListener('mousemove', function(event) {
        if (paint) {
            userPaths[username]['paths'][userPaths[username]['paths'].length-1].push([
                Math.floor(event.pageX)+xOffset, 
                Math.floor(event.pageY)+yOffset
            ])
            drawSocket.send(JSON.stringify({
                "username": username,
                "point": [
                    Math.floor(event.pageX)+xOffset, 
                    Math.floor(event.pageY)+yOffset
                ],
                "new_path": false 
            }))
        }
    })

    drawMap.addEventListener('mouseup', function() {
        paint = false
        console.log(userPaths)
    })

    drawMap.addEventListener('mouseleave', function() {
        paint = false
    })

    /* Redraw function */
    function redraw() {
        miniMapCxt.clearRect(0, 0, miniMap.width*ZOOMFACTOR, miniMap.height*ZOOMFACTOR)
        for (let user of Object.values(userPaths)) {
            let color = user['color']
            let paths = user['paths']
            miniMapCxt.strokeStyle = color
            miniMapCxt.shadowColor = color
            miniMapCxt.shadowBlur = 2
            miniMapCxt.lineCap = "round"
            miniMapCxt.lineWidth = 4
            
            for (let path of Object.values(paths)) {
                miniMapCxt.beginPath()
                miniMapCxt.moveTo(path[0][0], path[0][1])
                for (i = 1; i < path.length; i++) {
                    miniMapCxt.moveTo(path[i][0], path[i][1])
                    miniMapCxt.lineTo(path[i-1][0], path[i-1][1])
                }
                miniMapCxt.stroke()
            }
        }
        if (zoomCenter) {
            miniMapCxt.shadowBlur = 0
            miniMapCxt.lineCap = "round"
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
            for (let user of Object.values(userPaths)) {
                let color = user['color']
                let paths = user['paths']
                drawMapCxt.strokeStyle = color
                drawMapCxt.shadowColor = color
                drawMapCxt.shadowBlur = 3
                drawMapCxt.lineCap = "round"
                drawMapCxt.lineWidth = 5
                
                for (let path of Object.values(paths)) {
                    drawMapCxt.beginPath()
                    drawMapCxt.moveTo(
                        (path[0][0]-xOffset), 
                        (path[0][1]-yOffset)
                    )
                    for (i = 2; i < path.length; i++) {
                        drawMapCxt.moveTo(
                            (path[i][0]-xOffset), 
                            (path[i][1]-yOffset)
                        )
                        drawMapCxt.arcTo(
                            (path[i-1][0]-xOffset), 
                            (path[i-1][1]-yOffset),
                            (path[i-2][0]-xOffset), 
                            (path[i-2][1]-yOffset),
                            2
                        )
                    }
                    drawMapCxt.stroke()
                }
            } 
        }
    }

    var start = null
    function step(timestamp) {
        redraw()
        window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);

    module.exports = {}
}

let onPlayPage = document.querySelector('#playPage')

if (onPlayPage) {
  drawingScript2()
}