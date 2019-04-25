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
  const username = window.location.href.split('/')[5]
  const room = document.querySelector('#room-data').dataset.roompk
  const roomData = JSON.parse(document.querySelector('#room-data').dataset.roomData)

  const scoreSocket = new WebSocket(`wss://${window.location.host}/ws/${room}/score/`)
  let guess = document.querySelector('#wordGuessed')
  let guessedWords = []

  function checkGuess (guess, guessedWords) {
    if (!guessedWords.includes(guess)) {
      for (let user of Object.keys(roomData)) {
        if (guess === roomData[user]['word'] && username !== user) {
          return [username, user]
        }
      }
    }
    return false
  }

  document.querySelector('.submitguess-button').addEventListener('click', function () {
    let word = guess.value.toLowerCase()
    let result = checkGuess(word, guessedWords)
    console.log(result)
    if (result) {
      guessedWords.push(word)
      scoreSocket.send(JSON.stringify({
        'user1': result[0],
        'user2': result[1]
      }))
    }
  })

  scoreSocket.onmessage = function (event) {
    let data = JSON.parse(event.data)
    roomData[data['user1']]['score'] += 1
    roomData[data['user2']]['score'] += 1
    console.log(roomData)
  }
  // var display = document.querySelector('#time')
  // startTimer(tenSeconds, display)
  /* Setting up the canvas */

  drawingScript2()
}

module.exports = {
  startTimer: startTimer
}
