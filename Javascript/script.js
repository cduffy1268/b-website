const circle = document.querySelector('.circle');

function setPosition(position){
    circle.style.setProperty('--random-position', position + 'px')
}
function changePosition(){
    var randPosition = Math.random() * (400 - 100) + 100;;
    setPosition(randPosition);
}

setInterval(changePosition, 5000);