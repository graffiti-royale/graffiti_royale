function drawingScript2 () {
    const userPaths = {}
    let colorsArray = ['#070404', '#df4b26', '#040507', '#32ED2C', '#13d9f3', '#f313f3', '#f3ef13']
    const myColor = colorsArray[Math.floor(Math.random() * colorsArray.length)]
    let username = document.querySelector('.username').dataset.username
    userPaths[username] = {'color': myColor, 'paths': []}

    const canvas = document.querySelector('#drawMap')
    const context = canvas.getContext('2d')
    canvas.width = 600
    canvas.height = 600
    context.shadowBlur = 2
    context.lineJoin = "round"
    context.lineWidth = 4
    let paint

    canvas.addEventListener('mousedown', function(event) {
        paint = true
        userPaths[username]['paths'].push([[event.pageX - this.offsetLeft, event.pageY-this.offestTop]])
    })  
    
    canvas.addEventListener('mousemove', function(event) {
        if (paint) {
            userPaths[username]['paths'][userPaths[username]['paths'].length-1].push(
                [event.pageX - this.offsetLeft, event.pageY-this.offestTop]
            )
        }
    })

    canvas.addEventListener('mouseup', function() {
        paint = false
        console.log(userPaths)
    })

    /* Redraw function */
    function redraw() {
        context.clearRect(0, 0, 600, 600)
        for (let user of Object.values(userPaths)) {
            let color = user['color']
            let paths = user['paths']
            context.strokeStyle = color
            context.shadowColor = color
            
            for (let path of Object.values(paths)) {
                context.beginPath()
                context.moveTo(path[0][0], path[0][1])
                for (i = 1; i < path.length; i++) {
                    context.moveTo(path[i][0], path[i][1])
                    context.lineTo(path[i-1][0], path[i][1])
                }
                context.stroke()
            }
        }
    }

    var start = null
    function step(timestamp) {
        if (!start) {start = timestamp}
        var progress = timestamp - start;
        redraw()
        if (progress < 2000) {
            window.requestAnimationFrame(step);
        }
    }
    window.requestAnimationFrame(step);

    module.exports = {}
}

let onPlayPage = document.querySelector('#playPage')

if (onPlayPage) {
  drawingScript2()
}