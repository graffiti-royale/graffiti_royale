const { drawingScript2 } = require('./drawing')

console.log(roomData)

if (onPlayPage) {
  document.addEventListener('DOMContentLoaded', function () {
    // Setting up constants
    const username = window.location.href.split('/')[5]
    const room = document.querySelector('#room-data').dataset.roompk
    const rawRoomData = document.querySelector('#room-data').dataset.roomData.replace(/\\/g, '')
    const roomData = JSON.parse(rawRoomData)
    const timer = document.querySelector('#timer')
    const rawStartTime = document.querySelector('#room-data').dataset.starttime
    const startTime = new Date(parseInt(rawStartTime, 10))
    const popup = document.querySelector('#playerspopup')
    const playerList = document.querySelector('#playerlist')
    const score = document.querySelector('.score')
    const onPlayPage = document.querySelector('#playPage')
    const guessInputField = document.querySelector('#wordGuessed')

    htmlSetup(roomData, score, playerList)
    connectDrawSocket()
    connectScoreSocket()
    setTimer()
    drawingScript2()
  })
}

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

function htmlSetup (roomData, score, playerList) {
  document.querySelector('.random-word').innerHTML = `WORD: ${roomData[username]['word'].toUpperCase()}`
  score.style.color = roomData[username]['color']

  for (let user of Object.keys(roomData)) {
    let userDiv = document.createElement('div')
    userDiv.style.color = roomData[user]['color']
    userDiv.id = user
    userDiv.innerHTML = `${user}: 0`
    playerList.appendChild(userDiv)
  }

  popup.addEventListener('click', function (e) {
    if (!playerList.style.display || playerList.style.display === 'none') {
      playerList.style.display = 'flex'
    } else {
      playerList.style.display = 'none'
    }
  })
}

function connectScoreSocket(roomData) {
  const scoreSocket = new WebSocket(`wss://${window.location.host}/ws/${room}/score/`)
  let guessedWords = []

  document.querySelector('.submitguess-button').addEventListener('click', function () {
    let word = guessInputField.value.toLowerCase()
    let result = checkGuess(word, guessedWords)
    console.log(result)
    if (result) {

      guessInputField.style.border = '.2rem solid lightgreen'
      guessedWords.push(word)
      scoreSocket.send(JSON.stringify({
        'user1': result[0],
        'user2': result[1]
      }))
    } else { guessInputField.style.border = '.2rem solid red' }
  })

  scoreSocket.onmessage = function (event) {
    let data = JSON.parse(event.data)
    roomData[data['user1']]['score'] += 1
    roomData[data['user2']]['score'] += 1
    document.querySelector(`#${data['user1']}`).innerHTML = `${data['user1']}: ${roomData[data['user1']]['score']}`
    document.querySelector(`#${data['user2']}`).innerHTML = `${data['user2']}: ${roomData[data['user2']]['score']}`
    score.innerHTML = `${roomData[username]['score']}`
    console.log(score.innerHTML)
  }
}

function setTimer()
  // Update the count down every 1 second
  let x = setInterval(function () {
    // Get todays date and time
    let now = new Date().getTime()

    // Find the distance between now and the count down date
    let distance = startTime - now

    // Time calculations for days, hours, minutes and seconds
    let minutes = Math.floor(((distance % (1000 * 60 * 60)) / (1000 * 60))) - 58
    let seconds = Math.floor(((distance % (1000 * 60)) / 1000))

    // Display the result in the element with id="demo"
    if (seconds > 9) {
      timer.innerHTML = minutes + ':' + seconds
    } else {
      timer.innerHTML = minutes + ':0' + seconds
    }
  }, 1000)
}

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

module.exports = {
  startTimer: startTimer
}
