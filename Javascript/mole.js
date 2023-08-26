let currentMoleTile;
let currentEvilTile;
let score = 0;
let gameOver = false;


window.onload = function(){
    setGame();
}
function setGame(){
    //set up the grid for the game board intel
    for(let i = 0; i < 9; i++){ //i goes from 0 to 8, stops at 9
        //<div id="0-8"></div>
        let tile = document.createElement("div");
        tile.id = i.toString();
        tile.addEventListener("click", selectTile);
        document.getElementById("board").appendChild(tile);
    }
    setInterval(setMole, 1000);
    setInterval(setEvil, 1500);
}

function gameEnd(){
    for (i = 0; i < 9; i++){
        document.getElementById(i.toString()).remove();
    }
    let paragraph = document.createElement("p");
    paragraph.id = "paragraph";
    document.getElementById("board").appendChild(paragraph);
    let newText = document.getElementById("paragraph");
    let text = document.createTextNode("I hope this game did not take you too long to beat because you wouuld need half a brain to beat this. However, the signifigance of this game was that it is my first website game. Yippee!! Also the score, if you noticed, is the same as your date of birth. Now it is time for the next game...");
    newText.appendChild(text);
    let nextGame = document.createElement("a");
    nextGame.id = "nextGame";
    nextGame.href = "test_website.html";
    document.getElementById("paragraph").appendChild(nextGame);
    document.getElementById("nextGame").innerText = "Continue";
}




function getRandomTile(){
    let num = Math.floor(Math.random() * 9);
    return num.toString();
}


function setMole(){
    if (gameOver){
        return;
    }
    else if (score == 26){
        gameEnd();
    }
    if (currentMoleTile) {
        currentMoleTile.innerHTML = "";
    } 
    let mole = document.createElement("img");
    mole.src = "/photos/monty-mole.png";

    let num = getRandomTile();
    if(currentEvilTile && currentEvilTile.id == num){
        return;
    }
    currentMoleTile = document.getElementById(num);
    currentMoleTile.appendChild(mole);
}


function setEvil(){
    if (gameOver){
        return; 
    }
    else if (score == 26){
        gameEnd(); 
    }
    if (currentEvilTile) {
        currentEvilTile.innerHTML = "";
    }
    let evil = document.createElement("img");
    evil.src = "/photos/evil_mob.png";

    let num = getRandomTile();
    if (currentMoleTile && currentMoleTile.id == num) {
        return;
    }
    currentEvilTile = document.getElementById(num);
    currentEvilTile.appendChild(evil);
}

function selectTile(){
    if (gameOver){
        return; 
    }
    else if (score == 26){
        gameEnd();
    }
    if (this == currentMoleTile){
        score += 1;
        document.getElementById("score").innerText = score.toString();
    }
    else if (this == currentEvilTile){
        document.getElementById("score").innerText = "Game Over: " + score.toString();
        gameOver = true;
    }
}