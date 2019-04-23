function drawingScript2 () {
    /* Setting up the canvas */
    const canvas = document.querySelector('#drawMap')
    const context = canvas.getContext('2d')
    canvas.width = 600
    canvas.height = 600
    context.shadowBlur = 3
    context.lineCap = "round"
    context.lineWidth = 3
    let paint

    /* Setting up personal info */
    let colorsArray = ['#070404', '#df4b26', '#040507', '#32ED2C', '#13d9f3', '#f313f3', '#f3ef13']
    const myColor = colorsArray[Math.floor(Math.random() * colorsArray.length)]
    let username = document.querySelector('.username').dataset.username

    let userPaths = {}
    let queuedPaths = {}
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
        queuedPaths = data['users']
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

    
    let drawSocket = new WebSocket(`wss://${window.location.host}/ws/draw/${room}/`)    

    drawSocket.onmessage = function(event) {
        let data = JSON.parse(event.data)
        if (data['username'] != username) {
            if (data['new_path']) {
                userPaths[data['username']]['paths'].push(data['point'])
                queuedPaths[data['username']]['paths'].push(data['point'])
            } else {
                userPaths[data['username']]['paths'][userPaths[data['username']]['paths'].length-1].push(data['point'])
                if (queuedPaths[data['username']]['paths'].length === 0) {
                    queuedPaths[data['username']]['paths'].push(data['point'])
                } else {
                    queuedPaths[data['username']]['paths'][userPaths[data['username']]['paths'].length-1].push(data['point'])
                }
            }
        }
    }

    canvas.addEventListener('mousedown', function(event) {
        paint = true
        userPaths[username]['paths'].push([[event.pageX - this.offsetLeft, event.pageY-this.offsetTop]])
        queuedPaths[username]['paths'].push([[event.pageX - this.offsetLeft, event.pageY-this.offsetTop]])
        drawSocket.send(JSON.stringify({
            "username": username,
            "point": [event.pageX - this.offsetLeft, event.pageY - this.offsetTop],
            "new_path": true 
        }))
    })  
    
    canvas.addEventListener('mousemove', function(event) {
        if (paint) {
            userPaths[username]['paths'][userPaths[username]['paths'].length-1].push(
                [event.pageX - this.offsetLeft, event.pageY - this.offsetTop]
            )
            queuedPaths[username]['paths'][userPaths[username]['paths'].length-1].push(
                [event.pageX - this.offsetLeft, event.pageY - this.offsetTop]
            )
            drawSocket.send(JSON.stringify({
                "username": username,
                "point": [event.pageX - this.offsetLeft, event.pageY - this.offsetTop],
                "new_path": false 
            }))
        }
    })

    canvas.addEventListener('mouseup', function() {
        paint = false
        console.log(userPaths)
    })

    canvas.addEventListener('mouseleave', function() {
        paint = false
    })

    /* Redraw function */
    function redraw() {
        for (let user of Object.values(queuedPaths)) {
            let color = user['color']
            let paths = user['paths']
            let username = user['username']
            context.strokeStyle = color
            context.shadowColor = color
            
            for (let path of Object.values(paths)) {
                context.beginPath()
                context.moveTo(path[0][0], path[0][1])
                for (i = 1; i < path.length; i++) {
                    context.moveTo(path[i][0], path[i][1])
                    context.lineTo(path[i-1][0], path[i-1][1])
                }
                context.stroke()
            queuedPaths[username]['paths'] = []
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