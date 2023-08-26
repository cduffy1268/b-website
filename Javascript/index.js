const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

const scoreEl = document.getElementById("scoreEl");
const startGameBtn = document.getElementById("startGameBtn");
const modalEl = document.querySelector("#modalEl");
const bigScore = document.querySelector("#bigScore");
const highScoreEl = document.querySelector("#highScoreEl");
const clearBoard = document.getElementById("clearBoard")
const slowedEnemy = document.getElementById("slowedEnemy")
const bigShot = document.getElementById("bigShot")

class Player{
    constructor(x, y, radius, color){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocityX = 0;
        this.velocityY = 0; 
    }

    draw(){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
    updateVelocity(mouseX, mouseY) {
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        this.velocityX = (dx / distance) * 4;
        this.velocityY = (dy / distance) * 4;
    }
    update(){
        this.draw(); 
        this.x = this.x + this.velocityX;
        this.y = this.y + this.velocityY;

    }
}

class Projectile{
    constructor(x, y, radius, color, velocity){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }

    draw(){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
    
    update(){
        this.draw();
        this.x = this.x + this.velocity.x * 5;
        this.y = this.y + this.velocity.y * 5;
    }
}
class Power{
    constructor(x, y, color, radius, velocity){
        this.x = x;
        this.y = y;
        this.color = color; 
        this.radius = radius
        this.velocity = velocity;
    }
    draw(){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
    update(){
        this.draw();
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
    }

}

class Enemy{
    constructor(x, y, radius, color, velocity){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }

    draw(){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
    update(){
        this.draw(); 
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
    }
    chase(targetX, targetY) {
        const dx = targetX - this.x;
        const dy = targetY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        this.x += (dx / distance);
        this.y += (dy / distance);
    }
}

const friction = 0.98;
class Particles{
    constructor(x, y, radius, color, velocity){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.alpha = 1;
    }

    draw(){
        ctx.save();
        ctx.globalAlpha = this.alpha; 
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    }
    
    update(){
        this.draw();
        this.velocity.x *= friction;
        this.velocity.y *= friction;
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
        this.alpha -= .01
    }
}

let x = canvas.width/2;
let y = canvas.height/2;
let velocity = 0;

let player = new Player(x, y, 30, 'white', velocity);
let projectiles = [];
let enemies = []
let particles = []
let powers = []

function init(){
    player = new Player(x, y, 30, 'white', velocity);
    projectiles = []
    enemies = []
    particles = []
    powers = []
    score = 0;
    scoreEl.innerHTML = score;
    bigScore.innerHTML = score;  
}

function update(event){
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    player.updateVelocity(mouseX, mouseY)
}


function spawnEnemies(){
    setInterval(() =>{
        const radius = Math.random() * (50 - 5) + 5;
        
        let x;
        let y;

        if(Math.random() < .5){
            x = Math.random() < .5 ? 0 - radius : canvas.width + radius;
            y = Math.random() * canvas.height;
        }
        else{
            x = Math.random() * canvas.width;
            y = Math.random() < .5 ? 0 - radius : canvas.height + radius;
        }

        
        const color = `hsl(${Math.random() * 360}, 50%, 50%)`;
        const angle = Math.atan2(player.y - y, player.x - x);
        //ratio to go towards center 
        const velocity = {x: Math.cos(angle), y: Math.sin(angle)}
        enemies.push(new Enemy(x, y, radius, color, velocity))
    }, 1500)
}
function spawnPowers(){
    setInterval( ()=> {
        const radius = Math.random() * (20 - 5) + 5
        let x;
        let y;
        if(Math.random() < .5){
            x = Math.random() < .5 ? 0 - radius : canvas.width + radius;
            y = Math.random() * canvas.height;
        }
        else{
            x = Math.random() * canvas.width;
            y = Math.random() < .5 ? 0 - radius : canvas.height + radius;
        }
        const color = "white";
        const angle = Math.atan2(canvas.height/2 - y, canvas.width/2 - x)
        const velocity = {x: Math.cos(angle), y: Math.sin(angle)}

        powers.push(new Power(x, y, radius, color, velocity))
        console.log(powers)
        }, 10000)
}

let animationId 
let score = 0;
function animate(){
    animationId = requestAnimationFrame(animate);
    ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    player.update();
    particles.forEach((particle, index) =>{
        if(particle.alpha <= 0){
            particles.splice(index, 1);
        }
        else{
            particle.update();
        }
    })
    powers.forEach((power, index) => {
        power.update()
        //remove from screen
        if(power.x == canvas.innerWidth/2 || power.y == canvas.innerHeight/2){
            powers.splice(index, 1)
        }
        //contact of power and projectile
        projectiles.forEach((projectile, projectileIndex) =>{
            const dist = Math.hypot(projectile.x - power.x, projectile.y - power.y);
            if(dist - power.radius - projectile.radius){
                if(power.radius <= 9){
                    enemies = []
                    setTimeout(()=>{
                        //clearBoard.innerText = "Board Cleared!"
                    }, 3000)
                    clearBoard.innerText = ""
                }else if (power.radius <= 14) {
                    setTimeout(()=>{
                        enemies.forEach((enemy)=>{
                            enemy.velocity *=.5
                        })
                        //slowedEnemy.innerText = "Enemies Slowed"
                    }, 5000)
                    slowedEnemy.innerText = ""
                }else if(power.radius <= 20){
                    setTimeout(() =>{
                        projectile.radius *= 5
                        enemies.forEach((enemy,enemyIndex) =>{
                            dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y)
                            if(dist - projectile.radius - enemy.radius){
                                enemies.splice(enemyIndex, 1)
                            }
                        })
                        //bigShot.innerText = "BazOOOka"
                    }, 10000)
                }
                powers.splice(index,1)
                projectiles.splice(projectileIndex, 1)
            }
        })
    })
    projectiles.forEach((projectile, index) =>{
        projectile.update();
        //remove from screen 
        if(projectile.x + projectile.radius < 0 || 
            projectile.x - projectile.radius > canvas.width || 
            projectile.y + projectile.radius < 0 || 
            projectile.y - projectile.radius > canvas.height){
            projectiles.splice(index, 1);
        }
    })
    
    enemies.forEach((enemy, index) =>{
        typeOfEnemy = Math.random() * 3
        enemy.update();
        enemy.chase(player.x, player.y);
        //enemy and player touch
        const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);
        if(dist - enemy.radius - player.radius < 1){
            cancelAnimationFrame(animationId);
            modalEl.style.display = 'flex';
            bigScore.innerHTML = score.toString();
        }
        //Enemies and rojectiles touch
        projectiles.forEach((projectile, projectileIndex) => {
            const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);
            if(dist - enemy.radius - projectile.radius < 1) {
                //create explosions
                for (let i = 0; i < enemy.radius; i++){
                    particles.push(new Particles(projectile.x, projectile.y, Math.random() * 2, enemy.color, {x: Math.random() - 0.5 * (Math.random() * 5), y: Math.random() - 0.5 * (Math.random() * 5)}))
                }
                if(enemy.radius - 10 > 10){
                    //increase score (damaging enemy)
                    score += 10;
                    scoreEl.innerText = score.toString();

                    gsap.to(enemy, {
                        radius: enemy.radius - 10
                    })
                    setTimeout(() =>{
                        projectiles.splice(projectileIndex, 1);
                    }, 0)
                }else{
                    //increase score (destroying enemy)
                    score += 100;
                    scoreEl.innerText = score.toString();
                    setTimeout(() =>{
                        enemies.splice(index, 1);
                        projectiles.splice(projectileIndex, 1);
                    }, 0)
                }
            }
        })
    })
}

//sjoot projectile
addEventListener("click", (event) => {
    const angle = Math.atan2(event.clientY - player.y, event.clientX - player.x);
    const velocity = {
        x: Math.cos(angle) * 4, y: Math.sin(angle) * 4
    }
    projectiles.push(new Projectile(player.x, player.y, 5, "white", velocity));
    console.log("go");
})

addEventListener("mousemove", update);

startGameBtn.addEventListener("click", () =>{
    init();
    animate();
    spawnEnemies();
    spawnPowers();
    modalEl.style.display = 'none';
})


