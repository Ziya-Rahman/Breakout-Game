// Get the canvas element using its ID
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// Set the canvas width and height to match the screen size
let canvasWidth = window.innerWidth;
let canvasHeight = window.innerHeight;
canvas.width = canvasWidth;
canvas.height = canvasHeight;

// Ball and paddle variables
const ballRadius = canvasWidth / 75;
let x = canvasWidth / 40;
let y = canvasHeight - 40;
let dx = canvasWidth / 150;
let dy = -canvasWidth / 150;

let paddleHeight, paddleWidth, rowCount, columnCount,
    leftOffset = canvasWidth * 0.05;
if(canvasHeight>canvasWidth){
    //mobile
    paddleHeight = canvasHeight / (canvasWidth * 0.3);
    paddleWidth = canvasWidth / 4;
    rowCount = Math.floor(canvasHeight / (canvasHeight * 0.04));
    columnCount = Math.floor(canvasWidth / ((canvasWidth) * 0.25));
}else{
    paddleHeight = canvasWidth / (canvasHeight * 0.1);
    paddleWidth = canvasHeight / 10;
    rowCount = Math.floor(canvasHeight - (canvasWidth * 2));
    columnCount = Math.floor(canvasHeight / canvasWidth);
}


// Paddle start position
let paddleX = (canvasWidth - paddleWidth) / 2;


let brickWidth = paddleWidth * .75;
let brickHeight = paddleHeight * 1.2
let brickPadding = paddleWidth / paddleHeight;
let topOffset = paddleHeight * 6;

let score = 0;

// Bricks array
let bricks = [];
for (let c = 0; c < columnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < rowCount; r++) {
        // Set position of bricks
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

// Event listener for both desktop and mobile
function movePaddle(event) {
    let relativeX;
    if (event.type === 'mousemove') {
        relativeX = event.clientX;
    } else if (event.type === 'touchmove') {
        relativeX = event.touches[0].clientX;
    }

    if (relativeX > 0 && relativeX < canvasWidth) {
        paddleX = relativeX - paddleWidth / 2;
    }
}

// Add event listeners for both desktop and mobile
document.addEventListener('mousemove', movePaddle, false);
document.addEventListener('touchmove', movePaddle, false);

// Draw paddle
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvasHeight - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.closePath();
}

// Draw ball
function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.closePath();
}

// Draw Bricks
function drawBricks() {
    for (let c = 0; c < columnCount; c++) {
        for (let r = 0; r < rowCount; r++) {
            if (bricks[c][r].status === 1) {
                let brickX = (c * (brickWidth + brickPadding)) + leftOffset;
                let brickY = (r * (brickHeight + brickPadding)) + topOffset;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = '#ffffff';
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

// Track score
function trackScore() {
    ctx.font = 'bold 16px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Score : ' + score, 8, 24);
}

// Check ball hit bricks
function hitDetection() {
    for (let c = 0; c < columnCount; c++) {
        for (let r = 0; r < rowCount; r++) {
            let b = bricks[c][r];
            if (b.status === 1) {
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    // Check win
                    if (score === rowCount * columnCount) {
                        alert('You Win!');
                        document.location.reload();
                    }
                }
            }
        }
    }
}

// Main function
function init() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    trackScore();
    drawBricks();
    drawBall();
    drawPaddle();
    hitDetection();

    // Detect left and right walls
    if (x + dx > canvasWidth - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }

    // Detect top wall
    if (y + dy < ballRadius) {
        dy = -dy;
    } else if (y + dy > canvasHeight - ballRadius) {
        // Detect paddle hits
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        } else {
            // If ball don't hit paddle
            alert('Game Over!');
            document.location.reload();
        }
    }

    // Bottom wall
    if (y + dy > canvasHeight - ballRadius || y + dy < ballRadius) {
        dy = -dy;
    }

    // Move Ball
    x += dx;
    y += dy;
}

// Listen for window resize events to adjust canvas size
window.addEventListener('resize', function () {
    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    paddleWidth = canvasWidth / 12;
    paddleX = (canvasWidth - paddleWidth) / 2;
    paddleHeight = canvasHeight / 20;
    ballRadius = canvasWidth / 75;
    
    rowCount = Math.floor(canvasWidth / 100); // Adjust the value to fit your preference
    columnCount = Math.floor(canvasWidth / 75); // Adjust the value to fit your preference
    brickWidth = (canvasWidth - (columnCount + 1) * canvasWidth / 75) / columnCount;
    brickHeight = canvasHeight / 30;
    brickPadding = canvasWidth / 75;
    topOffset = canvasHeight / 15;
    leftOffset = (canvasWidth - (brickWidth + brickPadding) * columnCount) / 2;
});

// Start the game loop
setInterval(init, 10);