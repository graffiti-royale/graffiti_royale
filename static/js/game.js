const { drawingScript2 } = require('./drawing')

function checkScores (roomData, username) {
  let names = []
  let index
  for (let user of Object.keys(roomData)) {
    names.push([user, roomData[user]['score']])
  }
  let orderedNames = names.sort(function (a, b) {
    return b[1] - a[1]
  })
  for (let i = 0; i < orderedNames.length; i++) {
    if (orderedNames[i][0] === username) {
      index = i
      console.log('username', username)
      console.log('name at index', orderedNames[i])
      console.log('index', index)
    }
  }
  console.log('ordered users', orderedNames)
  if (index >= Math.floor(orderedNames.length / 2)) {
    return false
  }
  return true
}

// Timer
const onPlayPage = document.querySelector('#playPage')

if (onPlayPage) {
  document.addEventListener('DOMContentLoaded', function () {
    // Setting up constants
    const username = window.location.href.split('/')[5]
    const rawRoomData = document.querySelector('#room-data').dataset.roomData.replace(/\\/g, '')
    const roomData = JSON.parse(rawRoomData)
    const rounds = document.querySelector('#room-data').dataset.rounds
    const rawStartTime = document.querySelector('#room-data').dataset.starttime
    const startTime = parseInt(rawStartTime, 10)
    const targetTimes = []
    for (let i = 0; i < rounds; i++) {
      targetTimes.push(startTime + (((1000 * 120) + 10000) * i) + 10000)
      targetTimes.push(startTime + (((1000 * 120) + 10000) * i) + ((1000 * 120) + 10000))
    }
    let score = document.querySelector('.score')
    let currentRound = 0

    console.log(roomData)

    htmlSetup(roomData, score, username)
    connectScoreSocket(roomData, score, username)
    switchPhase(startTimer, currentRound, targetTimes)
    drawingScript2()
    console.log(rounds)
  })
}

function htmlSetup (roomData, score, username) {
  const playerList = document.querySelector('#playerlist')
  const popup = document.querySelector('#playerspopup')
  const scoresModal = document.querySelector('#player-scores')

  document.querySelector('.random-word').innerHTML = `WORD: ${roomData[username]['word'].toUpperCase()}`
  score.style.color = roomData[username]['color']

  for (let user of Object.keys(roomData)) {
    // Create divs for scores tab
    let userDiv = document.createElement('div')
    userDiv.style.color = roomData[user]['color']
    userDiv.id = user
    userDiv.innerHTML = `${user}: 0`
    playerList.appendChild(userDiv)

    // Create divs for score modal
    let userModalDiv = document.createElement('div')
    userModalDiv.style.color = roomData[user]['color']
    userModalDiv.id = `${user}-modal`
    userModalDiv.innerHTML = `${user}: 0`
    scoresModal.appendChild(userModalDiv)
  }

  popup.addEventListener('click', function (e) {
    if (!playerList.style.display || playerList.style.display === 'none') {
      playerList.style.display = 'flex'
    } else {
      playerList.style.display = 'none'
    }
  })
}

function connectScoreSocket (roomData, score, username) {
  const room = document.querySelector('#room-data').dataset.roompk
  const scoreSocket = new WebSocket(`wss://${window.location.host}/ws/${room}/score/`)
  const guessInputField = document.querySelector('#wordGuessed')

  let guessedWords = []

  document.querySelector('.submitguess-button').addEventListener('click', function () {
    let word = guessInputField.value.toLowerCase()
    let result = checkGuess(word, guessedWords, roomData, username)
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
    document.querySelector(`#${data['user1']}-modal`).innerHTML = `${data['user1']}: ${roomData[data['user1']]['score']}`
    document.querySelector(`#${data['user2']}-modal`).innerHTML = `${data['user2']}: ${roomData[data['user2']]['score']}`
    score.innerHTML = `${roomData[username]['score']}`
    console.log(checkScores(roomData, username))
  }
}

function startTimer (targetTime, currentRound, targetTimes) {
  let startCountDown = document.querySelector('#start-count-down')
  let countDownHolder = document.querySelector('#count-down-holder')
  startCountDown.style.display = 'block'
  countDownHolder.style.display = 'block'
  // startCountDown.style.height = window.innerHeight
  let x = setInterval(function () {
    // Get todays date and time
    let now = new Date().getTime()

    // Find the distance between now and the count down date
    let distance = (targetTime - now)

    // Time calculations for days, hours, minutes and seconds
    let seconds = Math.floor(((distance % (1000 * 60)) / 1000))
    console.log(seconds)

    // Display the result in the element with id="demo"
    startCountDown.innerHTML = seconds
    if (startCountDown.innerHTML === '0') {
      startCountDown.innerHTML = 'DRAW!'
    } else if (startCountDown.innerHTML === '59') {
      startCountDown.style.display = 'none'
      startCountDown.innerHTML = ''
      countDownHolder.style.display = 'none'
      switchPhase(roundTimer, currentRound, targetTimes)
      clearInterval(x)
    }
  }, 1000)
}

function roundTimer (targetTime, currentRound, targetTimes) {
  const timerDiv = document.querySelector('#timer')
  timerDiv.style.display = 'block'

  // Update the count down every 1 second
  let x = setInterval(function () {
    // Get todays date and time
    let now = new Date().getTime()

    // Find the distance between now and the count down date
    let distance = (targetTime - now)

    // Time calculations for days, hours, minutes and seconds
    let minutes = Math.floor(((distance % (1000 * 60 * 60)) / (1000 * 60)))
    let seconds = Math.floor(((distance % (1000 * 60)) / 1000))

    if (minutes === 59) {
      timerDiv.style.display = 'none'
      timerDiv.innerHTML = ''
      switchPhase(startTimer, currentRound, targetTimes)
      document.querySelector('#round-trigger').innerHTML++
      clearInterval(x)
    }

    // Display the result in the element with id="demo"
    if (seconds > 9) {
      timerDiv.innerHTML = minutes + ':' + seconds
    } else {
      timerDiv.innerHTML = minutes + ':0' + seconds
    }
  }, 1000)
}

function switchPhase (timer, currentRound, targetTimes) {
  let scoresModal = document.querySelector('#scores-after-round')
  if (timer === startTimer) {
    currentRound++
    scoresModal.style.display = 'block'
    let index = (currentRound - 1) * 2
    startTimer(targetTimes[index], currentRound, targetTimes)
  } else {
    scoresModal.style.display = 'none'
    let index = ((currentRound - 1) * 2) + 1
    roundTimer(targetTimes[index], currentRound, targetTimes)
  }
}

function checkGuess (guess, guessedWords, roomData, username) {
  if (!guessedWords.includes(guess)) {
    for (let user of Object.keys(roomData)) {
      if (guess === roomData[user]['word'] && username !== user) {
        return [username, user]
      }
    }
  }
  return false
}

function endRound (roomData, username) {
  if (checkScores(roomData, username)) {
    // If you made it to the next round:

  } else {
    // If your score didn't qualify you for the next round:
    endGame(roomData, username)
  }
}

function endGame (roomData, username) {
  console.log(`Game Over.  Standings: ${roomData}.`)
  // Go to homepage after 10 seconds:
  setTimeout(function () {
    window.location.href = `https://${window.location.host}`
  }, 10000)
}

module.exports = {}
