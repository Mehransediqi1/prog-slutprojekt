var myGamePiece;
var myObstacles = [];
var myScore;
var stoppat = false;

function startGame() {
    stoppat = false;
    document.getElementById("restartBtn").style.display = "none";
    myObstacles = [];
    myGamePiece = new component(30, 30, "red", 10, 120);
    myGamePiece.gravity = 0.05;
    myScore = new component("30px", "Consolas", "black", 280, 40, "text");
    myGameArea.start();
}

function restartGame() {
    clearInterval(myGameArea.interval);
    myGameArea.clear();
    startGame();
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 1255;
        this.canvas.height = 450;
        this.context = this.canvas.getContext("2d");
        if (!this.canvasAppended) {
            document.body.insertBefore(this.canvas, document.body.childNodes[0]);
            this.canvasAppended = true;
        }
        this.frameNo = 0;
        this.keys = [];
        this.interval = setInterval(updateGameArea, 20);
        window.addEventListener('keydown', function (e) {
            myGameArea.keys[e.key] = true;
        })
        window.addEventListener('keyup', function (e) {
            myGameArea.keys[e.key] = false;
        })
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function component(width, height, color, x, y, type) {
    this.type = type;
    this.score = 0;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;    
    this.x = x;
    this.y = y;
    this.gravity = 0;
    this.gravitySpeed = 0;
    this.update = function() {
        ctx = myGameArea.context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.newPos = function() {
        this.gravitySpeed += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;
        this.hitBottom();
    }
    this.hitBottom = function() {
        var rockbottom = myGameArea.canvas.height - this.height;
        if (this.y > rockbottom) {
            this.y = rockbottom;
            this.gravitySpeed = 0;
        }
    }
    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}

function updateGameArea() {
    var x, height, gap, minHeight, maxHeight, minGap, maxGap;

    myGamePiece.speedX = 0;
    myGamePiece.speedY = 0;
    if (myGameArea.keys) {
        if (myGameArea.keys["ArrowUp"]) { myGamePiece.speedY = -8; }
        if (myGameArea.keys["ArrowDown"]) { myGamePiece.speedY = 2; }
        if (myGameArea.keys["ArrowLeft"]) { myGamePiece.speedX = -2; }
        if (myGameArea.keys["ArrowRight"]) { myGamePiece.speedX = 2; }
    }

    for (i = 0; i < myObstacles.length; i += 1) {
        if (myGamePiece.crashWith(myObstacles[i])) {
            stopGame();  // Visa restart-knapp och stoppa spelet
            return;
        } 
    }

    myGameArea.clear();
    myGameArea.frameNo += 1;
    if (myGameArea.frameNo == 1 || everyinterval(150)) {
        x = myGameArea.canvas.width;
        minHeight = 20;
        maxHeight = 200;
        height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
        minGap = 50;
        maxGap = 200;
        gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
        myObstacles.push(new component(10, height, "green", x, 0));
        myObstacles.push(new component(10, x - height - gap, "green", x, height + gap));
    }

    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].x += -1;
        myObstacles[i].update();
    }

    myScore.text="SCORE: " + myGameArea.frameNo;
    myScore.update();
    myGamePiece.newPos();
    myGamePiece.update();
}

function stopGame() {
    clearInterval(myGameArea.interval);
    stoppat = true;
    document.getElementById("restartBtn").style.display = "inline-block";
}

function everyinterval(n) {
    return (myGameArea.frameNo / n) % 1 === 0;
}
