function hintsJavaScript () {
  let hintsButton = document.querySelector('#hints-button')
  console.log(hintsButton)
  let modal = document.getElementById('myModal')
  let close = document.getElementsByClassName('close')[0]
  let headerTitle = document.querySelector('#headerTitle')
  let firstP = document.querySelector('#firstP')
  let secondP = document.querySelector('#secondP')

  function setInnerHTML () {
    headerTitle.innerHTML = 'NiFTY HiNTS'
    firstP.innerHTML = `<li>Draw the word displayed at the top left<br>
    <li>Double-click to zoom in/out<br>
    <li>You must be zoomed in to draw<br>
    <li>+1 point for guessing a drawing correctly<br>
    <li>+1 point if your drawing is guessed
    <li>Draw or guess at any time<br>
    <li>View scoreboard by clicking<div id="playerspopuptutorial"><p><i class="fas fa-caret-down"></i>&nbsp<i class="fas fa-users"></i></p></div><br>
    <li>Highest score after time is up, wins`
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
