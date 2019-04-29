function hintsJavaScript () {
  let hintsButton = document.querySelector('#hints-button')
  console.log(hintsButton)
  let modal = document.getElementById('myModal')
  let close = document.getElementsByClassName('close')[0]
  let headerTitle = document.querySelector('#headerTitle')
  let firstP = document.querySelector('#firstP')
  let secondP = document.querySelector('#secondP')

  function setInnerHTML () {
    headerTitle.innerHTML = 'HiNTS'
    firstP.innerHTML = `Draw the word displayed at the top left<br>
                        Doubletap to zoom in/out<br>
                        You must be zoomed in to draw<br>
                        +1 point for guessing a drawing correctly<br>
                        +1 point if your drawing is guessed<br>`
    secondP.innerHTML = `Draw or guess at any time<br>
                        View scoreboard by tapping&nbsp<i class='fas fa-caret-down scoreboard-icon' />&nbsp<i class='fas fa-users scoreboard-icon' /><br>
                        Highest score after time is up, wins`
  }

  hintsButton.onclick = function () {
    setInnerHTML()
    console.log('ModalDisplay', hintsButton)
    modal.style.display = 'block'
  }

  close.onclick = function () {
    modal.style.display = 'none'
  }

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    if (event.target === modal) {
      modal.style.display = 'none'
    }
  }
}

let inWaitingRoom = document.querySelector('#waitingroom')

if (inWaitingRoom) {
  hintsJavaScript()
}
