function tutorialJavaScript () {
  let tutorial_button = document.querySelector('.tutorial-button')
  let modal = document.getElementById('myModal')
  let close = document.getElementsByClassName('close')[0]
  let nextButton = document.querySelector('.next')
  let headerTitle = document.querySelector('#headerTitle')
  let firstP = document.querySelector('#firstP')
  let secondP = document.querySelector('#secondP')

  let headerArray = ['SO YOU WANNA PLAY<br>GRAFFiTi ROYALE?', "LET'S KEEP iT FUN, FOLKS", 'SOME NiFTY HiNTS']

  let firstPArray = ['In GRAFFiTi ROYALE, your goal is to gain as many points as possible by drawing a word and guessing the illustrated words of your opponents to ensure victory. In classic Royale style gameplay, only one player will claim Victory Royale.', 'Yep, in GRAFFiTi ROYALE, you can draw on and over other players’ drawings, but there are still a few rules to ensure a fun experience for all:', 'If you really want to be a GRAFFiTi ROYALE master, here are some nifty hints to keep in mind...']

  let secondPArray = ['1 point can be earned by guessing what other players have drawn. 1 point is also awarded to you when other players guess your drawing, so try to illustrate your word as clear as possible. Beware, because all players share the same canvas, other players may try to ruin your masterpiece!', '<center><li>Do not simply write out your word, it must be drawn. <br> <br> <li>Do not draw obscene or offensive images. <br> <br> <li>Score as many points as you can and have fun!</center>', '<li>Draw the word displayed at the top left of your screen <br> <li>Double-click to zoom in/out <br> <li>You must be zoomed in to draw <br> <li>+1 point for guessing a drawing correctly <br> <li>+1 point if your drawing is guessed <br> <li>Draw or guess at any time <br> <li>View the scoreboard by clicking<div id="playerspopuptutorial"><p><i class="fas fa-caret-down"></i>&nbsp<i class="fas fa-users"></i></p></div> <br> <li>Highest score after time is up, wins GRAFFiTi ROYALE']
  let arrayIterator = 0

  function setInnerHTML () {
    headerTitle.innerHTML = headerArray[arrayIterator]
    firstP.innerHTML = firstPArray[arrayIterator]
    secondP.innerHTML = secondPArray[arrayIterator]
  }

  tutorial_button.onclick = function () {
    setInnerHTML()
    modal.style.display = 'block'
    return arrayIterator++
  }

  close.onclick = function () {
    modal.style.display = 'none'
    return arrayIterator = 0
  }

  nextButton.onclick = function () {
    setInnerHTML()

    if (arrayIterator < headerArray.length - 1) {
      arrayIterator++
    }
  }

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = 'none'
      return arrayIterator = 0
    }
  }
}

let onHomePage = document.querySelector('#homePage')

if (onHomePage) {
  tutorialJavaScript()
}
