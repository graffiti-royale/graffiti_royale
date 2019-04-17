const canvas = document.querySelector('canvas')
context = canvas.getContext('2d')
let paint
let myPath = []
let room = document.URL.split('/')[3]
let drawSocket = new WebSocket(`ws://${window.location.host}/ws/draw/${room}/`)
let colorsArray = ['#070404', '#df4b26', '#040507', '#32ED2C']
color = colorsArray[Math.floor(Math.random() * colorsArray.length)]

let username = document.querySelector('.username').dataset.username

canvas.addEventListener('mousedown', function(event) {
  var mouseX = event.pageX - this.offsetLeft;
  var mouseY = event.pageY - this.offsetTop;
  paint = true
  myPath.push([mouseX, mouseY])
})

canvas.addEventListener('mouseup', function(event) {
  paint = false
  myPath = []
})

canvas.addEventListener('mouseleave', function(event) {
  paint = false
  myPath = []
})

canvas.addEventListener('mousemove', function(event) {
  if (paint) {
    myPath.push([event.pageX - this.offsetLeft, event.pageY - this.offsetTop])
    context.strokeStyle = color;
    context.lineJoin = "round";
    context.lineWidth = 5;
    context.beginPath()
    context.moveTo(myPath[0][0], myPath[0][1])
    context.lineTo(myPath[1][0], myPath[1][1])
    context.stroke()
    myPath.shift()
  }
})

module.exports = {
}
