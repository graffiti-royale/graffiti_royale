
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

