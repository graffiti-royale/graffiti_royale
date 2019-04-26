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

  var countDownDate = new Date(document.querySelector('.user_data').dataset.starttime).getTime()
  console.log(document.querySelector('.user_data').dataset.starttime)
  console.log(countDownDate)

  // Update the count down every 1 second
  var x = setInterval(function () {
    // Get todays date and time
    var now = new Date().getTime()

    // Find the distance between now and the count down date
    var distance = countDownDate - now
    console.log(distance)

    // Time calculations for days, hours, minutes and seconds
    var minutes = Math.floor(((distance % (1000 * 60 * 60)) / (1000 * 60)) + 2)
    var seconds = Math.floor(((distance % (1000 * 60)) / 1000) + 60)

    // Display the result in the element with id="demo"
    document.getElementById('time').innerHTML = minutes + ':' + seconds

    // If the count down is finished, write some text
    if (distance < 0) {
      clearInterval(x)
      document.getElementById('time').innerHTML = 'EXPIRED'
    }
  }, 1000)
}

document.addEventListener('DOMContentLoaded', function () {
  let inWaitingRoom = document.querySelector('#waitingroom')
  if (inWaitingRoom) {
    waitingRoomJS()
  }
})
