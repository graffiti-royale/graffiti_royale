function waitingRoomJS () {
/* Setting up personal info */
  let full = document.querySelector('.user_data').dataset.full
  let room = document.querySelector('.user_data').dataset.room
  let username = document.querySelector('.user_data').dataset.username
  console.log(username)
  console.log(full)

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
      window.location.href = `https://${window.location.host}/play/${room}/${username}/`
    } else if (data['type'] === 'ping') {
      startSocket.send(JSON.stringify({
        'messageType': 'pong',
        'ponger': username,
        'pinger': data['pinger']
      }))
    } else if (data['type'] === 'pong') {
      // add the pong name to the list of names for the specific pinger
    }
  }
}

document.addEventListener('DOMContentLoaded', function () {
  let inWaitingRoom = document.querySelector('#waitingroom')
  if (inWaitingRoom) {
    waitingRoomJS()
  }
})
