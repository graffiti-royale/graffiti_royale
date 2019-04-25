function waitingRoomJS () {
/* Setting up personal info */
  let colorsArray = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6',
    '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
    '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A',
    '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
    '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC',
    '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
    '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680',
    '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
    '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3',
    '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF']
  const myColor = colorsArray[Math.floor(Math.random() * colorsArray.length)]
  let randomWord = document.querySelector('.user_data').dataset.word
  let username = document.querySelector('.user_data').dataset.username
  let room = document.querySelector('.user_data').dataset.room

  let roomData = {}
  let usersSocket = new WebSocket(`wss://${window.location.host}/ws/${room}/users/`)
  usersSocket.onopen = function (event) {
    console.log(username)
    usersSocket.send(JSON.stringify({
      'username': username,
      'enter': true,
      'color': myColor,
      'random_word': randomWord
    }))
  }

  usersSocket.onmessage = function (event) {
    let data = JSON.parse(event.data)
    roomData = data['users']
    console.log(`Users updated:`)
    console.log(roomData)
    console.log(data['full'])
  }

  window.addEventListener('beforeunload', function () {
    console.log('closing!')
    usersSocket.send(JSON.stringify({
      'username': username,
      'enter': false,
      'color': myColor,
      'random_word': randomWord
    }))
    usersSocket.close()
  })
}

document.addEventListener('DOMContentLoaded', function () {
  let inWaitingRoom = document.querySelector('#waitingroom')
  if (inWaitingRoom) {
    waitingRoomJS()
  }
})
