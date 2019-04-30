document.addEventListener('DOMContentLoaded', function () {

const { drawingScript2 } = require('./drawing')
const onPlayPage = document.querySelector('#playPage')

if (onPlayPage) {
  const rounds = document.querySelector('#room-data').dataset.rounds
  const zoomFactor = (rounds * 2) + 3
  const remainingTime = document.querySelector('#room-data').dataset.remainingTime
  const timeTillStart = parseInt(remainingTime, 10)
  const rawRoomData = document.querySelector('#room-data').dataset.roomData.replace(/\\/g, '')
  const roomData = JSON.parse(rawRoomData)
  const username = window.location.href.split('/')[5]
  const phaseLengths = []
  phaseLengths.push(timeTillStart)
  phaseLengths.push(1000 * 120)
  const pointMultiplier = 1.66
  for (let i = 1; i < rounds; i++) {
    phaseLengths.push(10000)
    phaseLengths.push(1000 * 120)
  }
  let score = document.querySelector('.score')
  let currentRound = 0

  console.log(roomData)

  htmlSetup(roomData, score, username)
  connectScoreSocket(roomData, score, username)
  switchPhase(startTimer, phaseLengths)
  drawingScript2(zoomFactor)
  console.log(rounds)

  function checkScores (roomData, username) {
    let names = []
    let index
    for (let user of Object.keys(roomData)) {
      names.push([user, roomData[user]['score'], roomData[user]['color']])
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
      return [false, orderedNames]
    }
    return [true, orderedNames]
  }

  function htmlSetup (roomData, score, username) {
    const playerList = document.querySelector('#playerlist')
    const popup = document.querySelector('#playerspopup')
    const scoresModal = document.querySelector('#player-scores')
    let wordsArray = roomData[username]['words'].split('/')
    let currentWord = wordsArray[currentRound]

    document.querySelector('.random-word').innerHTML = `WORD: ${currentWord.toUpperCase()}`
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

  function recreateScoreModal (orderedNames) {
    const scoresModal = document.querySelector('#player-scores')
    scoresModal.innerHTML = ''
    for (let user of orderedNames) {
      let username = user[0]
      let score = user[1]
      let color = user[2]
      let userModalDiv = document.createElement('div')
      userModalDiv.style.color = color
      userModalDiv.id = `${username}-modal`
      userModalDiv.innerHTML = `${username}: ${score}`
      scoresModal.appendChild(userModalDiv)
    }
  }

  function connectScoreSocket (roomData, score, username) {
    const room = document.querySelector('#room-data').dataset.roompk
    const scoreSocket = new WebSocket(`wss://${window.location.host}/ws/${room}/score/`)
    const guessInputField = document.querySelector('#wordGuessed')

    let guessedWords = []

    guessInputField.focus()

    // When the submit button is pressed, checks what is in the field.
    document.querySelector('.submitguess-button').addEventListener('click', function () {
      let word = guessInputField.value.toLowerCase()
      let result = checkGuess(word, guessedWords, roomData, username)
      console.log(result)
      if (result) {
        guessInputField.style.border = '.2rem solid lightgreen'
        guessInputField.focus()
        guessedWords.push(word)
        scoreSocket.send(JSON.stringify({
          'user1': result[0],
          'user2': result[1]
        }))
        guessInputField.value=''
        setTimeout(function(){ 
        guessInputField.style.border = '.2rem solid black'
        guessInputField.style.backgroundColor = ""
        ; }, 500)
      } else { 
        guessInputField.style.border = '.2rem solid red' 
        guessInputField.focus()
        guessInputField.value=''
        setTimeout(function(){ 
        guessInputField.style.border = '.2rem solid black'
        guessInputField.style.backgroundColor = ""
        ; }, 500)
      }
    })

    // When enter is pressed, checks what is in the field.
    guessInputField.addEventListener('keydown', function(event){
      if(event.key === "Enter"){
      let word = guessInputField.value.toLowerCase()
      let result = checkGuess(word, guessedWords, roomData, username)
      console.log(result)
      if (result) {
        guessInputField.style.border = '.2rem solid lightgreen'
        guessInputField.style.backgroundColor = "#C8FED5"
        guessInputField.focus()
        guessedWords.push(word)
        scoreSocket.send(JSON.stringify({
          'user1': result[0],
          'user2': result[1]
        }))
        guessInputField.value=''
        setTimeout(function(){ 
        guessInputField.style.border = '.2rem solid black'
        guessInputField.style.backgroundColor = ""
        ; }, 200)
      } else { 
        guessInputField.style.border = '.2rem solid red' 
        guessInputField.style.backgroundColor = "#FEC8C8"
        guessInputField.focus()
        guessInputField.value=''
        setTimeout(function(){ 
        guessInputField.style.border = '.2rem solid black'
        guessInputField.style.backgroundColor = ""
        ; }, 200)
      }
      }
    })

    scoreSocket.onmessage = function (event) {
      let data = JSON.parse(event.data)
      roomData[data['user1']]['score'] += Math.ceil(Math.pow(pointMultiplier, currentRound - 1))
      roomData[data['user2']]['score'] += Math.ceil(Math.pow(pointMultiplier, currentRound - 1))
      document.querySelector(`#${data['user1']}`).innerHTML = `${data['user1']}: ${roomData[data['user1']]['score']}`
      document.querySelector(`#${data['user2']}`).innerHTML = `${data['user2']}: ${roomData[data['user2']]['score']}`
      document.querySelector(`#${data['user1']}-modal`).innerHTML = `${data['user1']}: ${roomData[data['user1']]['score']}`
      document.querySelector(`#${data['user2']}-modal`).innerHTML = `${data['user2']}: ${roomData[data['user2']]['score']}`
      score.innerHTML = `${roomData[username]['score']}`
      console.log(checkScores(roomData, username))
    }
  }

  function startTimer (length, currentRound, phaseLengths) {
    let startCountDown = document.querySelector('#start-count-down')
    let countDownHolder = document.querySelector('#count-down-holder')
    startCountDown.style.display = 'block'
    countDownHolder.style.display = 'block'
    // startCountDown.style.height = window.innerHeight
    let x = setInterval(function () {
      // Time calculations for days, hours, minutes and seconds
      let seconds = Math.floor(((length % (1000 * 60)) / 1000))

      length -= 1000

      // Display the result in the element with id="demo"
      if (seconds === 0) {
        startCountDown.innerHTML = 'DRAW!'
      } else if (seconds === -1) {
        startCountDown.style.display = 'none'
        startCountDown.innerHTML = ''
        countDownHolder.style.display = 'none'
        switchPhase(roundTimer, phaseLengths)
        clearInterval(x)
      } else { startCountDown.innerHTML = seconds }
    }, 1000)
  }

  function roundTimer (length, currentRound, phaseLengths) {
    const timerDiv = document.querySelector('#timer')
    timerDiv.innerHTML = ''
    timerDiv.style.display = 'block'

    // Update the count down every 1 second
    let x = setInterval(function () {
      // Time calculations for days, hours, minutes and seconds
      let minutes = Math.floor(((length % (1000 * 60 * 60)) / (1000 * 60)))
      let seconds = Math.floor(((length % (1000 * 60)) / 1000))

      length -= 1000

      if (minutes === -1) {
        timerDiv.style.display = 'none'
        switchPhase(startTimer, phaseLengths)
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

  function switchPhase (timer, phaseLengths) {
    const scoresModal = document.querySelector('#scores-after-round')
    const rounds = document.querySelector('#room-data').dataset.rounds

    if (timer === startTimer) {
      currentRound++
      document.querySelector('#round-trigger').innerHTML++
      let passRoundArray = checkScores(roomData, username)
      let passRound = passRoundArray[0]
      let orderedNames = passRoundArray[1]
      recreateScoreModal(orderedNames)
      scoresModal.style.display = 'block'
      if (currentRound !== 1 && (!passRound || (currentRound > rounds))) {
        endGame()
      } else {
        let index = (currentRound - 1) * 2
        startTimer(phaseLengths[index], currentRound, phaseLengths)
      }
    } else {
      let wordsArray = roomData[username]['words'].split('/')
      let currentWord = wordsArray[currentRound - 1]

      document.querySelector('.random-word').innerHTML = `WORD: ${currentWord.toUpperCase()}`
      scoresModal.style.display = 'none'
      let index = ((currentRound - 1) * 2) + 1
      roundTimer(phaseLengths[index], currentRound, phaseLengths)
    }
  }

  function checkGuess (guess, guessedWords, roomData, username) {
    if (!guessedWords.includes(guess)) {
      for (let user of Object.keys(roomData)) {
        let wordsArray = roomData[user]['words'].split('/')
        let currentWord = wordsArray[currentRound - 1]
        if (guess === currentWord && username !== user) {
          return [username, user]
        }
      }
    }
    return false
  }

  function endGame (roomData, username) {
  // Go to homepage after 5 seconds:
    setTimeout(function () {
      window.location.href = `https://${window.location.host}`
    }, 5000)
  }
}

module.exports = {}

})