var gamePrepared = false;

function prepareGame() {
    document.getElementById("startScreen").style.display = "none";
    document.getElementById("boy").style.display = "block";
    gamePrepared = true;
}

function startGame() {
    if (runWorker === 0) {
        run();
        runSound.play();
        updateScore();
        backgroundMove();
        flameMarginLeft.forEach(createFlame);
    }
}

function controller(event) {
    if (gamePrepared && event.key === "Enter") {
        startGame();
    }
    if (event.key === " ") {
        if (jumpWorker === 0) {
            if (runWorker !== 0) {
                clearInterval(runWorker);
                runSound.pause();
                jump();
                jumpSound.play();
            }
        }
    }
}

var runImage = 1;
var runWorker = 0;
var runSound = new Audio("run.mp3");
runSound.loop = true;

function run() {
    runWorker = setInterval(() => {
        runImage += 1;
        if (runImage === 9) {
            runImage = 1;
        }
        document.getElementById("boy").src = "run" + runImage + ".png";
    }, 150);
}

var jumpImage = 1;
var jumpWorker = 0;
var jumpMarginTop = 430;
var jumpSound = new Audio("jump.mp3");

function jump() {
    jumpWorker = setInterval(() => {
        jumpImage += 1;
        if (jumpImage < 8) {
            jumpMarginTop -= 10;
            document.getElementById("boy").style.marginTop = jumpMarginTop + "px";
        } else {
            jumpMarginTop += 10;
            document.getElementById("boy").style.marginTop = jumpMarginTop + "px";
        }
        if (jumpImage === 13) {
            jumpImage = 1;
            clearInterval(jumpWorker);
            run();
            runSound.play();
            jumpWorker = 0;
        }
        document.getElementById("boy").src = "jump" + jumpImage + ".png";
    }, 100);
}

var score = 0;
var scoreWorker = 0;

function updateScore() {
    scoreWorker = setInterval(() => {
        score += 10;
        if (score === 3400) {
            clearInterval(runWorker);
            clearInterval(scoreWorker);
            clearInterval(backgroundWorker);
            clearInterval(flameWorker);

            runSound.pause();
 
            win();
        }
        document.getElementById("score").innerHTML = score;
    }, 150);
}

var backgroundX = 0;
var backgroundWorker = 0;

function backgroundMove() {
    backgroundWorker = setInterval(() => {
        backgroundX -= 10;
        document.getElementById("background").style.backgroundPositionX = backgroundX + "px";
    }, 100);
}

var deadImage = 1;
var deadSound = new Audio("dead.mp3");

function dead() {
    if (!deadSound.playing) {
        runSound.pause();
        deadSound.play();
        deadSound.playing = true;

        let deadAnimation = setInterval(() => {
            deadImage += 1;
            if (deadImage === 11) {
                clearInterval(deadAnimation);
                document.getElementById("gameOverScreen").style.display = "flex";
                document.getElementById("finalScore").innerText = score;
                return;
            }
            document.getElementById("boy").src = "dead" + deadImage + ".png";
        }, 150);

        clearInterval(runWorker);
        clearInterval(scoreWorker);
        clearInterval(backgroundWorker);
        clearInterval(flameWorker);
    }
}

var flameMarginLeft = [500, 1000, 1500, 1800, 2100, 2600, 3000, 3500, 3700, 4500, 4900, 5000];
var flameWorker = 0;

function createFlame(x) {
    var f = document.createElement("img");
    f.src = "flame.gif";
    f.className = "flame";
    f.style.marginLeft = x + "px";
    document.getElementById("background").appendChild(f);

    flameWorker = setInterval(() => {
        if (flameWorker !== 0) {
            x -= 10;
            f.style.marginLeft = x + "px";
        }
        if (x === 140) {
            if (jumpWorker === 0) {
                clearInterval(runWorker);
                clearInterval(scoreWorker);
                clearInterval(backgroundWorker);
                clearInterval(flameWorker);
                flameWorker = 0;

                runSound.pause();
                dead();
            }
        }
    }, 100);
}

function win() {
       document.getElementById("winScreen").style.display = "flex";
    document.getElementById("winScore").innerText = score;
}

function restartGame() {
    document.getElementById("gameOverScreen").style.display = "none";
    document.getElementById("winScreen").style.display = "none";
    window.location.reload();
}
