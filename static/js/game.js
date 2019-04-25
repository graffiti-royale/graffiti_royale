const { drawingScript2 } = require('./drawing')

// Timer
function startTimer (duration, display) {
  var timer = duration; var minutes; var seconds
  setInterval(function () {
    minutes = parseInt(timer / 60, 10)
    seconds = parseInt(timer % 60, 10)

    minutes = minutes < 10 ? +minutes : minutes
    seconds = seconds < 10 ? +seconds : seconds

    display.textContent = seconds

    if (--timer < 0) {
      timer = duration
    }
  }, 1000)
}

let onPlayPage = document.querySelector('#playPage')

if (onPlayPage) {
  // var tenSeconds = 10

  // var display = document.querySelector('#time')
  // startTimer(tenSeconds, display)
  /* Setting up the canvas */

  drawingScript2()
}

module.exports = {
  startTimer: startTimer
}
