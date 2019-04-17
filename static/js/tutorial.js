function tutorialJavaScript(){  
    let tutorial_button = document.querySelector(".tutorial-button");
    let modal = document.getElementById('myModal');
    let close = document.getElementsByClassName("close")[0];
    let nextButton = document.querySelector(".next")
    let headerTitle = document.querySelector("#headerTitle");
    let firstP = document.querySelector("#firstP");
    let secondP = document.querySelector("#secondP");

    let headerArray = ["Welcome!", "Welcome!", "Welcome!"];

    let firstPArray = ["In Graffiti Royale, your goal is to gain as many points as possible to ensure you aren’t eliminated! In classic Royale style gameplay, those who do not survive will be removed from the match over time until there is only one player remaining.", "In Graffiti Royale, you can draw on and over other players’ drawings, but there are still rules to ensure a pleasant experience for users:", "While staying true to the nature of word guessing games, Graffiti Royale works a bit differently to accomodate for a much larger player pool."];

    let secondPArray = ["You can earn points by guessing what other players have drawn. You also receive points when other players guess your drawing, so try to make your word as clear as possible. Because all players share the same canvas, other players may try to draw on or over your drawing!", "Do not simply write out your word, it must be drawn. <br> <br> Do not draw obscene or offensive images. <br> <br> Survive as long as possible!", "Each round will having a drawing phase and a guessing phase. During the drawing phase, you have the opportunity to draw out your assigned word and also attempt to sabotage the work of other players by drawing over them. After the drafting phase, try to guess as many drawing as possible for maximum points! Rob is stupid."];
    let arrayIterator = 0;


    function setInnerHTML(){
        headerTitle.innerHTML = headerArray[arrayIterator];
        firstP.innerHTML = firstPArray[arrayIterator];
        secondP.innerHTML = secondPArray[arrayIterator];
    }

    tutorial_button.onclick = function(){
        setInnerHTML();
        modal.style.display = "block";
        return arrayIterator++;
    }

    close.onclick = function(){
        modal.style.display = "none";
        return arrayIterator = 0;
    }

    nextButton.onclick = function(){
        setInnerHTML()

        if (arrayIterator < headerArray.length - 1){
            arrayIterator++;
        }
        
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
        return arrayIterator = 0;
    }
    }
}

let onHomePage = document.querySelector("#homePage")

if (onHomePage){
    tutorialJavaScript();
}