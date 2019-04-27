function waitingRoomJS () {
/* Setting up personal info */
  let full = document.querySelector('.user_data').dataset.full
  let room = document.querySelector('.user_data').dataset.room
  let username = document.querySelector('.user_data').dataset.username
  let roomData = document.querySelector('#room_data').dataset.json.replace(/\\/g, '')
  roomData = `{${roomData}}`
  roomData = JSON.parse(roomData)
  let currentPlayers = document.querySelector('#current_players')
  console.log(username)
  console.log(full)
  let usersAtPing = {}

  let startSocket = new WebSocket(`wss://${window.location.host}/ws/${room}/start/`)

  startSocket.onopen = function (event) {
    console.log('connected')
    let messageType
    if (full === 'True') {
      messageType = 'startgame'
    } else {
      messageType = 'ping'
    }
    startSocket.send(JSON.stringify({
      'messageType': messageType,
      'roomData': roomData,
      'username': username
    }))
  }

  startSocket.onmessage = function (event) {
    let data = JSON.parse(event.data)
    console.log('message')

    if (data['type'] === 'start') {
      // start the match!!!!
      window.location.href = `https://${window.location.host}/play/${room}/${username}/`
    } else if (data['type'] === 'ping') {
      console.log('ping')
      roomData = data['roomData']
      console.log(roomData)
      // respond to a ping by updating the users in the room directly (using the html room_data)
      currentPlayers.innerHTML = ''
      for (let player of Object.keys(roomData)) {
        let playerDiv = document.createElement('div')
        playerDiv.innerText = player
        currentPlayers.appendChild(playerDiv)
      }

      // // respond to a ping message with a pong message that includes both usernames
      // startSocket.send(JSON.stringify({
      //   'messageType': 'pong',
      //   'ponger': username,
      //   'pinger': data['pinger']
      // }))
    } else if (data['type'] === 'pong') {
      // add the ponger name to the list of names for the specific pinger
      if (usersAtPing[data['pinger']]) {
        usersAtPing[data['pinger']].push(data['ponger'])
      } else {
        usersAtPing[data['pinger']] = [data['ponger']]
      }
    }
  }

  let roomTime = document.querySelector('.user_data').dataset.starttime
  let countDownDate = new Date(parseInt(roomTime, 10))

  // Update the count down every 1 second
  let x = setInterval(function () {
    // Get todays date and time
    let now = new Date().getTime()

    // Find the distance between now and the count down date
    let distance = countDownDate - now

    // Time calculations for days, hours, minutes and seconds
    let minutes = Math.floor(((distance % (1000 * 60 * 60)) / (1000 * 60)) - 58)
    let seconds = Math.floor(((distance % (1000 * 60)) / 1000))

    // Display the result in the element with id="demo"
    if (seconds > 9) {
      document.getElementById('time').innerHTML = minutes + ':' + seconds
    } else {
      document.getElementById('time').innerHTML = minutes + ':0' + seconds
    }

    // If the count down is finished, write some text
    if (minutes + seconds <= 0) {
      startSocket.send(JSON.stringify({
        'messageType': 'startgame'
      }))
    }
  }, 1000)
}

document.addEventListener('DOMContentLoaded', function () {
  let inWaitingRoom = document.querySelector('#waitingroom')
  if (inWaitingRoom) {
    waitingRoomJS()
  }
})
