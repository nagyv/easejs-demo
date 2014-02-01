/**
 * Created by viktornagy on 2014.01.31..
 */

var goals_left = goals_right = 0;

var stage = new createjs.Stage("game");
var wall_left = new createjs.Shape();
wall_left.graphics.beginFill("#ff0000").drawRect(100, 0, 50, 100);

var wall_right = new createjs.Shape();
wall_right.graphics.beginFill("#ffff00").drawRect(850, 0, 50, 100);

var goal_left = new createjs.Shape();
goal_left.graphics.beginFill("#ccc").drawRect(0,0,100,500);
var goal_right = new createjs.Shape();
goal_right.graphics.beginFill("#ccc").drawRect(900,0,100,500);

stage.addChild(wall_left, wall_right, goal_left, goal_right);
stage.update();

document.addEventListener('keypress', keyHandler);
function keyHandler(ev) {
    /* Handles keyboard events
    *
    * q = 113
    * a = 97
    * l = 108
    * p = 112
    */
    switch (ev.which) {
        case 113:
            move(wall_left, -1);
            break;
        case 97:
            move(wall_left, 1);
            break
        case 108:
            move(wall_right, 1);
            break;
        case 112:
            move(wall_right, -1);
    }
    stage.update();
}
function move(wall, step) {
    if(wall.y <= 0 && step<0) {
        return;
    } else if (wall.y >= 400 && step > 0) {
        return
    } else {
        wall.y += step * 20;
    }
}

createjs.Ticker.addEventListener("tick", handleBall);

var ball;
var lastFired = 'right';
var direction = -1;
var moveBy = 5;
function otherSide(side) {
    if (side === 'left') {
        return "right";
    } else {
        return "left";
    }
}
function handleBall() {
    if (!ball) {
        ball = createBall(otherSide(lastFired));
        lastFired = otherSide(lastFired);
        direction = -1 * direction;
    }
    ball.x += direction * moveBy;
    stage.update();
}

function createBall(side) {
    var ball = new createjs.Shape()
    ball.graphics.beginFill("#9999ff").drawCircle(0, 0, 10);
    ball.x = side=='left' ? 160 : 840;
    ball.y =  Math.random()*490;
    stage.addChild(ball);
    stage.update();
    return ball;
}

createjs.Ticker.addEventListener("tick", handleGoals);

function handleGoals() {
    if (!ball) {
        return;
    }
    if(lastFired == 'right' && goal_left.hitTest(ball.x-10, ball.y)) {
        goal('left');
    }
    else if (lastFired == 'left' && goal_right.hitTest(ball.x+10, ball.y)) {
        goal('right');
    }
}
function goal(side) {
    stage.removeChild(ball);
    stage.update();
    ball = null;
    moveBy += 5;
    if (moveBy > 120) {
        createjs.Ticker.removeAllEventListeners();
        console.log("Game ended. Refresh for restart.");
        alert("Game ended. Refresh for restart.");
    }
    if(side=='left') {
        goals_right++;
    } else {
        goals_left++;
    }
    writeGoals();
}
function writeGoals() {
    document.getElementById('left').innerHTML = goals_left;
    document.getElementById('right').innerHTML = goals_right;
}

createjs.Ticker.addEventListener("tick", handleWall);
function handleWall() {
    var ball_in_wall_pos;
    if (!ball) {
        return;
    }
    if(direction == -1) {
      /*
      The ball is somewhere on the stage.
      ball.localToGlobal(10, 5) gives us the points in the global (stage's) coordinate system
      that are 10 pixels to the right and 5 pixels below the ball

      ball.localToLocal(10, 5, wall) converts the points into the wall
      s coordinate system
       */
      ball_in_wall_pos = ball.localToLocal(-10, 0, wall_left);
      if (wall_left.hitTest(ball_in_wall_pos.x, ball_in_wall_pos.y)) {
        direction = direction * -1;
       }
    } else {
      ball_in_wall_pos = ball.localToLocal(10,0, wall_right);
      if (wall_right.hitTest(ball_in_wall_pos.x, ball_in_wall_pos.y)) {
        direction = direction * -1;
      }
    }
}