
//Timer
function startTimer(duration, display) {
    var timer = duration, minutes, seconds;
    setInterval(function () {
        minutes = parseInt(timer / 60, 10)
        seconds = parseInt(timer % 60, 10);
  
        minutes = minutes < 10 ? + minutes : minutes;
        seconds = seconds < 10 ? + seconds : seconds;
  
        display.textContent = seconds;
  
        if (--timer < 0) {
            timer = duration;
        }
    }, 1000);
  }
  
  window.onload = function () {
    var tenSeconds = 10,
        display = document.querySelector('#time');
    startTimer(tenSeconds, display);
  };
  //End Timer

//This is currently not bundling into our bundle.js, so none of it works on the site.
//We will likely need an array of all currently active words, then I can correctly see if one of the words was submitted. I will need to talk to Michael to figure out how to index up our score when correctly submitting a word.

//This currently only works when you hit the submit button, we will need to find a way to submit when you press the enter key. I tried searching for the answer online, but everything I found needed the use of jQuery.

window.onload = function(){
    let wordGuessed = document.querySelector(".wordGuessed");
    let submitWordGuessed = document.querySelector(".submitWordGuessed");

    submitWordGuessed.onclick = function(){console.log(wordGuessed.value)
        if(wordGuessed.value == "This will be our wordlist from Django"){

        }
    }


}


