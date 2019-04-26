function waitingRoomJS () {
/* Setting up personal info */
  let full = document.querySelector('.user_data').dataset.full
  let room = document.querySelector('.user_data').dataset.room
  let username = document.querySelector('.user_data').dataset.username
  console.log(username)
  console.log(full)
  let startSocket = new WebSocket(`wss://${window.location.host}/ws/${room}/start/`)
  startSocket.onopen = function (event) {
    if (full === 'True') {
      startSocket.send(JSON.stringify({
        'startgame': true
      }))
    }
  }
  startSocket.onmessage = function () {
    window.location.href = `https://${window.location.host}/play/${room}/${username}/`
  }
}

document.addEventListener('DOMContentLoaded', function () {
  let inWaitingRoom = document.querySelector('#waitingroom')
  if (inWaitingRoom) {
    waitingRoomJS()
  }
})
