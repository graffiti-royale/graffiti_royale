function waitingRoomJS () {
/* Setting up personal info */
  let full = document.querySelector('.user_data').dataset.full
  let room = document.querySelector('.user_data').dataset.room
  let username = document.querySelector('.user_data').dataset.username
  let roomData = document.querySelector('#room-data').dataset.roomData.replace(/\\/g, '')
  let currentPlayers = document.querySelector('#current_players')
  console.log(username)
  console.log(full)
  let usersAtPing = {}

  let startSocket = new WebSocket(`wss://${window.location.host}/ws/${room}/start/`)

  startSocket.onopen = function (event) {
    let messageType
    if (full === 'True') {
      messageType = 'startgame'
    } else {
      messageType = 'ping'
    }
    startSocket.send(JSON.stringify({
      'messageType': messageType,
      'username': username
    }))
  }

  startSocket.onmessage = function (event) {
    let data = JSON.parse(event.data)

    if (data['type'] === 'start') {
      // start the match!!!!
      window.location.href = `https://${window.location.host}/play/${room}/${username}/`
    } else if (data['type'] === 'ping') {
      // respond to a ping by updating the users in the room directly (using the html room_data)
      currentPlayers.innerHTML = ''
      for (let player in Object.keys(roomData)) {
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
}

document.addEventListener('DOMContentLoaded', function () {
  let inWaitingRoom = document.querySelector('#waitingroom')
  if (inWaitingRoom) {
    waitingRoomJS()
  }
})
