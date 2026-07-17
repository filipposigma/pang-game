// Pang Clone

// ---------- Variables ---------- //
var playerImg;
var backgroundImg;

var playerX, playerY, floorPosY;
var isLeft, isRight;
var balls;
var harpoon;

var playerSize = 60;

var gameTime = 90;      // seconds
var startTime;

var explosions = [];

// Floor position (92% of screen height)
const FLOOR_RATIO = 0.92;

// ---------- Preload ---------- //
function preload()
{
    playerImg = loadImage("creeper.png");
    backgroundImg = loadImage("background.jpg");
}

// ---------- Explosion ---------- //
function createExplosion(x, y)
{
    for(let i = 0; i < 20; i++)
    {
        explosions.push({
            x: x,
            y: y,
            vx: random(-4,4),
            vy: random(-4,4),
            size: random(4,8),
            life: 30
        });
    }
}


// ---------- Setup ---------- //
function setup()
{
    createCanvas(windowWidth, windowHeight);

    startTime = millis();

    floorPosY = height * FLOOR_RATIO;

    playerX = width / 2;
    playerY = floorPosY;

    isLeft = false;
    isRight = false;

    balls = [
        {x:300, y:200, size:160, speedX:4, speedY:0, level:3}
    ];

    harpoon =
    {
        x:0,
        tipY:0,
        speed:16,
        isShot:false
    };
}

function drawFloor()
{
    let h = 32;
    let y = height - h;   // Bottom of the screen

    // Main body
    noStroke();
    fill(165, 155, 220);
    rect(0, y, width, h);

    // Top highlight
    fill(245);
    rect(0, y, width, 4);

    // Dark bottom border
    fill(90, 70, 180);
    rect(0, y + h - 4, width, 4);

    // Bricks
    stroke(120, 100, 200);
    strokeWeight(2);

    let brickW = 32;
    let brickH = 14;

    for(let row = 0; row < 2; row++)
    {
        let offset = (row % 2) * (brickW / 2);

        for(let x = -offset; x < width; x += brickW)
        {
            let by = y + 4 + row * brickH;

            noFill();
            rect(x, by, brickW, brickH);
        }
    }
}

// ---------- Draw ---------- //
function draw()
{
    background(0);

    let elapsed = floor((millis() - startTime) / 1000);
    let timeLeft = max(0, gameTime - elapsed);

    imageMode(CORNER);
    image(backgroundImg, 0, 0, width, height);

    drawFloor();

    for(var i=balls.length-1;i>=0;i--)
    {
        var ball = balls[i];

     // Blue outline
    stroke(25, 70, 200);
    strokeWeight(3);
    fill(235, 40, 40);
    ellipse(ball.x, ball.y, ball.size);

    // White shine
    noStroke();
    fill(255,255,255,180);
    ellipse(
    ball.x - ball.size * 0.20,
    ball.y - ball.size * 0.20,
    ball.size * 0.20
);

    // Dark shadow
    fill(170,20,20,80);
    ellipse(
    ball.x + ball.size * 0.12,
    ball.y + ball.size * 0.12,
    ball.size * 0.75
);

        ball.x += ball.speedX;
        ball.y += ball.speedY;
        ball.speedY += 0.20;

        if(ball.x < ball.size/2){ ball.x=ball.size/2; ball.speedX*=-1; }
        if(ball.x > width-ball.size/2){ ball.x=width-ball.size/2; ball.speedX*=-1; }

        if(ball.y > floorPosY-ball.size/2)
        {
            ball.y = floorPosY-ball.size/2;
            ball.speedY *= -0.98;
        }

        if(ball.y < ball.size/2)
        {
            ball.y = ball.size/2;
            ball.speedY *= -1;
        }

        // Harpoon
        if(harpoon.isShot)
        {
            var hitX = abs(harpoon.x - ball.x) < ball.size / 2;

            let bottomY = playerY - playerSize * 0.55;

            var hitY =
            harpoon.tipY < ball.y + ball.size/2 &&
            bottomY > ball.y - ball.size/2;

            if(hitX && hitY)
            {
            createExplosion(ball.x, ball.y);

            splitBall(i);

            harpoon.isShot = false;
}
        }
    }

    if(harpoon.isShot)
    {
      
        // Bottom always attached to player
        let bottomY = playerY - playerSize * 0.55;

        // Move the tip upward
        harpoon.tipY -= harpoon.speed;

        strokeWeight(4);
        stroke(120, 70, 255);
        noFill();

        beginShape();

        let offset = 0;

        for(let y = bottomY; y > harpoon.tipY; y -= 8)
        {
            vertex(harpoon.x + offset, y);
            offset = (offset == 4) ? -4 : 4;
        }

        endShape();

        // Arrow head
        fill(180, 120, 255);
        noStroke();

        triangle(harpoon.x, harpoon.tipY - 12, harpoon.x - 6, harpoon.tipY, harpoon.x + 6, harpoon.tipY);

        if(harpoon.tipY < 0)
            harpoon.isShot = false;

    }

    if(balls.length==0)
    {
        fill(255);
        textSize(48);
        text("YOU WIN!",330,100);
    }

        for(let i = explosions.length-1; i >= 0; i--)
{
    let p = explosions[i];

    noStroke();
    let c = random([
    color(255,255,0),
    color(255,180,0),
    color(255,80,0),
    color(255)
    ]);

    fill(red(c), green(c), blue(c), p.life * 8);
    ellipse(p.x,p.y,p.size);

    p.x += p.vx;
    p.y += p.vy;

    p.vx *= 0.96;
    p.vy *= 0.96;

    p.vy += 0.15;

    p.life--;

    if(p.life <= 0)
    {
        explosions.splice(i,1);
    }

}
    // Player Character
    imageMode(CENTER);

    let ratio = playerImg.height / playerImg.width;

    image(playerImg, playerX, playerY - playerSize / 2, playerSize, playerSize * ratio);

    if(isLeft && playerX>20){ playerX-=6; }
    if(isRight && playerX<width-20){ playerX+=6; }

    textAlign(RIGHT, TOP);
    textSize(42);
    textStyle(BOLD);

    // White text
    fill(255);
    text(
    "TIME:" + nf(timeLeft, 3),
    width - 30,
    14);

}


function splitBall(index)
{
    var ball = balls[index];

    if(ball.level>1)
    {
        var newSize = ball.size*0.65;
        var newLevel = ball.level-1;

        balls.push({x:ball.x-20,y:ball.y,size:newSize,speedX:-4,speedY:-5,level:newLevel});
        balls.push({x:ball.x+20,y:ball.y,size:newSize,speedX:4,speedY:-5,level:newLevel});
    }

    balls.splice(index,1);
}

// ---------- Key Pressed ---------- //
function keyPressed()
{
    if(keyCode==LEFT_ARROW){isLeft=true;}
    if(keyCode==RIGHT_ARROW){isRight=true;}

    if(keyCode==32 && !harpoon.isShot)
    {
        harpoon.x = playerX;
        harpoon.tipY = playerY - playerSize;
        harpoon.isShot=true;
    }
}

// ---------- Key Released ---------- //
function keyReleased()
{
    if(keyCode==LEFT_ARROW){isLeft=false;}
    if(keyCode==RIGHT_ARROW){isRight=false;}
}


function windowResized()
{
    resizeCanvas(windowWidth, windowHeight);

    floorPosY = height * FLOOR_RATIO;
    playerY = floorPosY;
}
