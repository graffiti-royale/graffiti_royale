function tutorialJavaScript () {
  let tutorial_button = document.querySelector('.tutorial-button')
  let modal = document.getElementById('myModal')
  let close = document.getElementsByClassName('close')[0]
  let nextButton = document.querySelector('.next')
  let headerTitle = document.querySelector('#headerTitle')
  let firstP = document.querySelector('#firstP')
  let secondP = document.querySelector('#secondP')

  let headerArray = ['WELCOME!', 'WELCOME!', 'WELCOME!']

  let firstPArray = ['In GRAFFiTi ROYALE, your goal is to gain as many points as possible by drawing a word and guessing the illustrated words of your opponents to ensure victory. In classic Royale style gameplay, only one player will claim Victory Royale.', "That's right! In GRAFFiTi ROYALE, you can draw on and over other players’ drawings, but there are still a few rules to ensure a fun experience for all:", 'While staying true to the nature of word guessing games, GRAFFiTi ROYALE works a bit differently to accomodate for a much larger player pool.']

  let secondPArray = ['1 point can be earned by guessing what other players have drawn. 1 point is also awarded to you when other players guess your drawing, so try to illustrate your word as clear as possible. Beware, because all players share the same canvas, other players may try to ruin your masterpiece!', '<li>Do not simply write out your word, it must be drawn. <br> <br> <li>Do not draw obscene or offensive images. <br> <br> <li>Score as many points as you can and have fun!', 'During each game, players may draw or enter guesses at any time.  While drawing, you have the opportunity to illustrate your assigned word and also attempt to sabotage the work of other players by drawing over them. While guessing, observe all of the drawings and enter your best guess by typing in an answer at the bottom of the screen. Try to guess as many drawings as possible for maximum points. The last player standing is declared the winner.']
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
