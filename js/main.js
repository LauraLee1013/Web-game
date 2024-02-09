var brickRow = 5, brickColumn = 8;  // 磚塊列數, 磚塊行數
var lives = 3, score = 0;           // 生命, 分數

// 取得畫布
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
// 紀錄球, 滑桿, 按鍵, 磚塊資訊
var x, y, r, dx, dy;	// 球位置x, 球位置y, 球半徑, 球速度dx, 球速度dy
var paddleX, paddleY, paddleWidth, paddleHeight;	// 滑桿位置x, 滑桿位置y, 滑桿寬, 滑桿高
var leftPressed, rightPressed, spacePressed;			// 左鍵, 右鍵, 空白鍵
var brickWidth, brickHeight, brickPadding, brickOffset;		// 磚塊寬, 磚塊高, 磚塊間隔, 磚塊偏移

// 磚塊顯示陣列(0:不顯示, 1:顯示), 磚塊型態陣列(0:加寬, 1:縮短, -1:普通)
var brick = [], brickType = [];
for (var i = 0; i < brickRow; ++i) {
  brick[i] = [];
  brickType[i] = [];

  for (var j = 0; j < brickColumn; ++j) {
    brick[i][j] = 1;
    brickType[i][j] = -1;
  }
}

function initBall() {
  // 重設畫布大小
  if (window.innerHeight < window.innerWidth) {
    canvas.width = (window.innerHeight * 0.9) / 3 * 4;
    canvas.height = window.innerHeight * 0.9;
  } else {
    canvas.width = window.innerWidth * 0.9;
    canvas.height = (window.innerHeight * 0.9) / 4 * 3;
  }

  // 滑桿寬, 高, 位置
  paddleWidth = 105;
  paddleHeight = 15;
  paddleX = canvas.width / 2 - paddleWidth / 2;
  paddleY = canvas.height - paddleHeight;

  // 球位置, 速度, 半徑
  x = paddleX + paddleWidth / 2;
  y = paddleY - r;
  dx = 5;
  dy = -5;
  r = 10;

  // 按鍵狀態
  leftPressed = false;
  rightPressed = false;
  spacePressed = false;

  // 磚塊偏移量, 間隔, 高度, 寬度
  brickOffset = 35;
  brickPadding = 10;
  brickHeight = 20;
  brickWidth = (canvas.width - 2 * brickOffset - (brickColumn - 1) * brickPadding) / brickColumn;
}

// 建立觸發事件
document.addEventListener("keydown", keyDownHandler); // 按下按鍵
document.addEventListener("keyup", keyUpHandler); // 鬆開按鍵
document.addEventListener("mousemove", mouseMoveHandler); // 移動滑鼠
document.addEventListener("click", mouseClickHandler); // 點擊滑鼠
window.addEventListener("resize", resizeCanvasHandler); // 調整視窗大小

// 按下按鍵時
function keyDownHandler(e) {
  if (e.key == "ArrowRight") rightPressed = true;
  else if (e.key == "ArrowLeft") leftPressed = true;
  else if (e.key == " ") spacePressed = true;
}
// 鬆開按鍵時
function keyUpHandler(e) {
  if (e.key == "ArrowRight") rightPressed = false;
  else if (e.key == "ArrowLeft") leftPressed = false;
}
// 移動滑鼠時
function mouseMoveHandler(e) {
  // 滑鼠相對畫布的x = 滑鼠真正的x - 畫布左側偏移量
  var relativeX = e.clientX - canvas.offsetLeft;
  paddleX = relativeX - paddleWidth / 2;

  if (paddleX > canvas.width - paddleWidth) paddleX = Math.min(paddleX + 7, canvas.width - paddleWidth);
  else if (paddleX < 0) paddleX = 0;
}
// 點擊滑鼠時
function mouseClickHandler() {
  spacePressed = true;
}
// 調整視窗大小時
function resizeCanvasHandler() {
  if (window.innerHeight < window.innerWidth) {
    canvas.width = (window.innerHeight * 0.9) / 3 * 4;
    canvas.height = window.innerHeight * 0.9;
  } else {
    canvas.width = window.innerWidth * 0.9;
    canvas.height = (window.innerHeight * 0.9) / 4 * 3;
  }
  paddleX = canvas.width / 2 - paddleWidth / 2;
  paddleY = canvas.height - paddleHeight;
  brickWidth = (canvas.width - 2 * brickOffset - (brickColumn - 1) * brickPadding) / brickColumn;
}

/* ------------------ 畫圖 ------------------ */
// 畫球
function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2); // arc(圓心x, 圓心y, 半徑, 起始角度, 結束角度)
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}
// 畫滑桿
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, paddleY, paddleWidth, paddleHeight); // rect(左上角x, 左上角y, 寬, 高)
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}
// 畫磚塊
function drawBricks() {
  ctx.beginPath();
  for (var i = 0; i < brickRow; ++i)
    for (var j = 0; j < brickColumn; ++j)
      if (brick[i][j] == 1) {
        var brickX = j * (brickWidth + brickPadding) + brickOffset;
        var brickY = i * (brickHeight + brickPadding) + brickOffset;
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
      }
  ctx.closePath();
}
// 顯示分數
function drawScore() {
  ctx.font = "25px Consolas";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Score: " + score, 8, 25);
}
// 顯示生命
function drawLives() {
  ctx.font = "25px Consolas";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Lives: " + lives, canvas.width - 120, 25);
}
// 顯示失敗
function showLose() {
  document.location.reload();
  alert("GAME OVER");
}
// 顯示獲勝
function showWin() {
  document.location.reload();
  alert("YOU WIN, CONGRATS!");
}

/* ------------------ 更新畫布 ------------------ */
function draw() {
  // 偵測是否碰撞
  collision_by_wall(x, y, r, canvas.width, canvas.height, paddleX, paddleY, paddleWidth, paddleHeight);

  collision_by_brick(x, y, r, brick, brickType, brickRow, brickColumn, brickWidth, brickHeight, brickPadding, brickOffset);

  // 偵測是否獲勝或失敗
  var brickNum = 0;
  for (var i = 0; i < brickRow && brickNum == 0; ++i)
    for (var j = 0; brickColumn && brickNum == 0; ++j)
      if (brick[i][j] == 1)
        ++brickNum;
  if (brickNum == 0)
    showWin();

  if (y + r > canvas.height) {
    --lives;
    initBall();
  }
  if (lives == 0)
    showLose();

  // 更新滑桿位置
  if (rightPressed)
    paddleX = Math.min(paddleX + 7, canvas.width - paddleWidth);
  else if (leftPressed)
    paddleX = Math.max(paddleX - 7, 0);

  // 更新球的位置
  if (spacePressed) {
    x += dx;
    y += dy;
  } else {
    x = paddleX + paddleWidth / 2;
    y = paddleY - r;
  }

  // 清空畫布
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 繪製畫布
  drawBall();
  drawPaddle();
  drawBricks();
  drawScore();
  drawLives();

  // 利用 HTML5 內建的動畫優化函式
  requestAnimationFrame(draw);
}

initBall();
draw();
console.log(brickType);
var brickRow = 5, brickColumn = 8;  // 磚塊列數, 磚塊行數
var lives = 3, score = 0;           // 生命, 分數

// 取得畫布
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
// 紀錄球, 滑桿, 按鍵, 磚塊資訊
var x, y, r, dx, dy;	// 球位置x, 球位置y, 球半徑, 球速度dx, 球速度dy
var paddleX, paddleY, paddleWidth, paddleHeight;	// 滑桿位置x, 滑桿位置y, 滑桿寬, 滑桿高
var leftPressed, rightPressed, spacePressed;			// 左鍵, 右鍵, 空白鍵
var brickWidth, brickHeight, brickPadding, brickOffset;		// 磚塊寬, 磚塊高, 磚塊間隔, 磚塊偏移

// 磚塊顯示陣列(0:不顯示, 1:顯示), 磚塊型態陣列(0:加寬, 1:縮短, -1:普通)
var brick = [], brickType = [];
for (var i = 0; i < brickRow; ++i) {
  brick[i] = [];
  brickType[i] = [];

  for (var j = 0; j < brickColumn; ++j) {
    brick[i][j] = 1;
    brickType[i][j] = -1;
  }
}

function initBall() {
  // 重設畫布大小
  if (window.innerHeight < window.innerWidth) {
    canvas.width = (window.innerHeight * 0.9) / 3 * 4;
    canvas.height = window.innerHeight * 0.9;
  } else {
    canvas.width = window.innerWidth * 0.9;
    canvas.height = (window.innerHeight * 0.9) / 4 * 3;
  }

  // 滑桿寬, 高, 位置
  paddleWidth = 105;
  paddleHeight = 15;
  paddleX = canvas.width / 2 - paddleWidth / 2;
  paddleY = canvas.height - paddleHeight;

  // 球位置, 速度, 半徑
  x = paddleX + paddleWidth / 2;
  y = paddleY - r;
  dx = 5;
  dy = -5;
  r = 10;

  // 按鍵狀態
  leftPressed = false;
  rightPressed = false;
  spacePressed = false;

  // 磚塊偏移量, 間隔, 高度, 寬度
  brickOffset = 35;
  brickPadding = 10;
  brickHeight = 20;
  brickWidth = (canvas.width - 2 * brickOffset - (brickColumn - 1) * brickPadding) / brickColumn;
}

// 建立觸發事件
document.addEventListener("keydown", keyDownHandler); // 按下按鍵
document.addEventListener("keyup", keyUpHandler); // 鬆開按鍵
document.addEventListener("mousemove", mouseMoveHandler); // 移動滑鼠
document.addEventListener("click", mouseClickHandler); // 點擊滑鼠
window.addEventListener("resize", resizeCanvasHandler); // 調整視窗大小

// 按下按鍵時
function keyDownHandler(e) {
  if (e.key == "ArrowRight") rightPressed = true;
  else if (e.key == "ArrowLeft") leftPressed = true;
  else if (e.key == " ") spacePressed = true;
}
// 鬆開按鍵時
function keyUpHandler(e) {
  if (e.key == "ArrowRight") rightPressed = false;
  else if (e.key == "ArrowLeft") leftPressed = false;
}
// 移動滑鼠時
function mouseMoveHandler(e) {
  // 滑鼠相對畫布的x = 滑鼠真正的x - 畫布左側偏移量
  var relativeX = e.clientX - canvas.offsetLeft;
  paddleX = relativeX - paddleWidth / 2;

  if (paddleX > canvas.width - paddleWidth) paddleX = Math.min(paddleX + 7, canvas.width - paddleWidth);
  else if (paddleX < 0) paddleX = 0;
}
// 點擊滑鼠時
function mouseClickHandler() {
  spacePressed = true;
}
// 調整視窗大小時
function resizeCanvasHandler() {
  if (window.innerHeight < window.innerWidth) {
    canvas.width = (window.innerHeight * 0.9) / 3 * 4;
    canvas.height = window.innerHeight * 0.9;
  } else {
    canvas.width = window.innerWidth * 0.9;
    canvas.height = (window.innerHeight * 0.9) / 4 * 3;
  }
  paddleX = canvas.width / 2 - paddleWidth / 2;
  paddleY = canvas.height - paddleHeight;
  brickWidth = (canvas.width - 2 * brickOffset - (brickColumn - 1) * brickPadding) / brickColumn;
}

/* ------------------ 畫圖 ------------------ */
// 畫球
function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2); // arc(圓心x, 圓心y, 半徑, 起始角度, 結束角度)
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}
// 畫滑桿
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, paddleY, paddleWidth, paddleHeight); // rect(左上角x, 左上角y, 寬, 高)
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}
// 畫磚塊
function drawBricks() {
  ctx.beginPath();
  for (var i = 0; i < brickRow; ++i)
    for (var j = 0; j < brickColumn; ++j)
      if (brick[i][j] == 1) {
        var brickX = j * (brickWidth + brickPadding) + brickOffset;
        var brickY = i * (brickHeight + brickPadding) + brickOffset;
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
      }
  ctx.closePath();
}
// 顯示分數
function drawScore() {
  ctx.font = "25px Consolas";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Score: " + score, 8, 25);
}
// 顯示生命
function drawLives() {
  ctx.font = "25px Consolas";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Lives: " + lives, canvas.width - 120, 25);
}
// 顯示失敗
function showLose() {
  document.location.reload();
  alert("GAME OVER");
}
// 顯示獲勝
function showWin() {
  document.location.reload();
  alert("YOU WIN, CONGRATS!");
}
function collision_by_brick(x, y, r, brick, brickType, brickRow, brickColumn, brickWidth, brickHeight, brickPadding, brickOffset) {
  for (var i = 0; i < brickRow; ++i) {
    for (var j = 0; j < brickColumn; ++j) {
      var x1 = brickOffset + j * (brickWidth + brickPadding);
      var x2 = x1 + brickWidth;

      var y1 = brickOffset + i * (brickHeight + brickPadding);
      var y2 = y1 + brickHeight;

      if (brick[i][j] == 1 && (x1 < x && x < x2) && (y1 < y && y < y2)) {
        dy = -dy;
        brick[i][j] = 0;
        ++score;
        if (brickType[i][j] != -1)
          item.push({ type: brickType[i][j], x: x1, y: y1, dx: 0, dy: 3, w: 80, h: 80 });
      }
    }
  }
}

function collision_by_wall(x, y, r, canvasW, canvasH, paddleX, paddleY, paddleW, paddleH) {
  if (x + r > canvasW || x - r < 0) {
    dx = -dx;
  } else if (y < 0) {
    dy = -dy;
  }

  if ((paddleX < x && x < paddleX + paddleW) && (paddleY < y && y < paddleH + paddleY)) {
    dy = -dy;
  }
}

/* ------------------ 更新畫布 ------------------ */
function draw() {
  // 偵測是否碰撞
  // 偵測球是否和牆或滑桿碰撞
  collision_by_wall(x, y, r, canvas.width, canvas.height, paddleX, paddleY, paddleWidth, paddleHeight);
  

  collision_by_brick(x, y, r, brick, brickType, brickRow, brickColumn, brickWidth, brickHeight, brickPadding, brickOffset);

  // 偵測是否獲勝或失敗
  var brickNum = 0;
  for (var i = 0; i < brickRow && brickNum == 0; ++i)
    for (var j = 0; brickColumn && brickNum == 0; ++j)
      if (brick[i][j] == 1)
        ++brickNum;
  if (brickNum == 0)
    showWin();

  if (y + r > canvas.height) {
    --lives;
    initBall();
  }
  if (lives == 0)
    showLose();

  // 更新滑桿位置
  if (rightPressed)
    paddleX = Math.min(paddleX + 7, canvas.width - paddleWidth);
  else if (leftPressed)
    paddleX = Math.max(paddleX - 7, 0);

  // 更新球的位置
  if (spacePressed) {
    x += dx;
    y += dy;
  } else {
    x = paddleX + paddleWidth / 2;
    y = paddleY - r;
  }

  // 清空畫布
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 繪製畫布
  drawBall();
  drawPaddle();
  drawBricks();
  drawScore();
  drawLives();

  // 利用 HTML5 內建的動畫優化函式
  requestAnimationFrame(draw);
}

initBall();
draw();
console.log(brickType);
