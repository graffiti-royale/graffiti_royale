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

// Adding players and their color
let inWaitingRoom = document.querySelector('#waitingroom')

if (inWaitingRoom) {
  const username = window.location.href.split('/')[5]
  const room = document.querySelector('#room-data').dataset.roompk
  let roomData = document.querySelector('#room-data').dataset.roomData.replace(/\\/g, '')
  roomData = JSON.parse(roomData)
  console.log(roomData)
  document.querySelector('.random-word').innerHTML = `WORD: ${roomData[username]['word'].toUpperCase()}`

  let popup = document.querySelector('#playerspopup')
  let playerList = document.querySelector('#playerlist')

  for (let user of Object.keys(roomData)) {
    let userDiv = document.createElement('div')
    userDiv.style.color = roomData[user]['color']
    userDiv.id = user
    userDiv.innerHTML = `${user}: 0`
    playerList.appendChild(userDiv)
  }
