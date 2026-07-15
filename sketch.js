// Pang Clone - Part 3

var playerX, playerY, floorPosY;
var isLeft, isRight;
var balls;
var harpoon;

function setup()
{
    createCanvas(1024,576);

    floorPosY = height*3/4;

    playerX = width/2;
    playerY = floorPosY;

    isLeft = false;
    isRight = false;

    balls = [
        {x:300,y:200,size:80,speedX:4,speedY:0,level:3}
    ];

    harpoon =
    {
        x:0,
        y:0,
        width:4,
        height:160,
        speed:12,
        isShot:false
    };
}

function draw()
{
    background(120,200,255);

    noStroke();
    fill(80,180,80);
    rect(0,floorPosY,width,height-floorPosY);

    for(var i=balls.length-1;i>=0;i--)
    {
        var ball = balls[i];

        fill(255,0,0);
        ellipse(ball.x,ball.y,ball.size);

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

        if(harpoon.isShot)
        {
            var hitX = harpoon.x > ball.x-ball.size/2 &&
                       harpoon.x < ball.x+ball.size/2;

            var hitY = harpoon.y < ball.y+ball.size/2 &&
                       harpoon.y+harpoon.height > ball.y-ball.size/2;

            if(hitX && hitY)
            {
                splitBall(i);
                harpoon.isShot = false;
            }
        }
    }

    fill(255);
    ellipse(playerX,playerY-25,35);

    fill(0,0,255);
    rect(playerX-10,playerY-25,20,25);

    if(isLeft && playerX>20){ playerX-=6; }
    if(isRight && playerX<width-20){ playerX+=6; }

    if(harpoon.isShot)
    {
        fill(255);
        rect(harpoon.x,harpoon.y,harpoon.width,harpoon.height);
        harpoon.y -= harpoon.speed;

        if(harpoon.y+harpoon.height<0)
        {
            harpoon.isShot=false;
        }
    }

    if(balls.length==0)
    {
        fill(255);
        textSize(48);
        text("YOU WIN!",330,100);
    }
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

function keyPressed()
{
    if(keyCode==LEFT_ARROW){isLeft=true;}
    if(keyCode==RIGHT_ARROW){isRight=true;}

    if(keyCode==32 && !harpoon.isShot)
    {
        harpoon.x = playerX-harpoon.width/2;
        harpoon.y = playerY-25;
        harpoon.isShot=true;
    }
}

function keyReleased()
{
    if(keyCode==LEFT_ARROW){isLeft=false;}
    if(keyCode==RIGHT_ARROW){isRight=false;}
}
