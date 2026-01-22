const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const headImg = new Image();
headImg.src = "face.png";

let box, cols, rows;
let snake, dir, food;
let gameOver = false;

// анимация рта
let mouthOpen = false;
let mouthTimer = 0;

function resize() {
  canvas.width = window.innerWidth - 10;
  canvas.height = window.innerHeight - 120;
  box = Math.floor(Math.min(canvas.width, canvas.height) / 20);
  cols = Math.floor(canvas.width / box);
  rows = Math.floor(canvas.height / box);
}
resize();

function init() {
  snake = [{ x: Math.floor(cols / 2), y: Math.floor(rows / 2) }];
  dir = "RIGHT";
  food = spawnFood();
  gameOver = false;
  mouthOpen = false;
}
init();

function spawnFood() {
  return {
    x: Math.floor(Math.random() * cols),
    y: Math.floor(Math.random() * rows)
  };
}

function update() {
  if (gameOver) return;

  const head = { ...snake[0] };

  if (dir === "RIGHT") head.x++;
  if (dir === "LEFT") head.x--;
  if (dir === "UP") head.y--;
  if (dir === "DOWN") head.y++;

  // столкновение со стеной
  if (head.x < 0 || head.y < 0 || head.x >= cols || head.y >= rows) {
    gameOver = true;
    return;
  }

  // столкновение с собой
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      gameOver = true;
      return;
    }
  }

  snake.unshift(head);

  // еда
  if (head.x === food.x && head.y === food.y) {
    food = spawnFood();
    mouthOpen = true;
    mouthTimer = 8; // длительность укуса
  } else {
    snake.pop();
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // границы
  ctx.strokeStyle = "white";
  ctx.lineWidth = 3;
  ctx.strokeRect(0, 0, cols * box, rows * box);

  // еда
  ctx.fillStyle = "red";
  ctx.fillRect(food.x * box, food.y * box, box, box);

  // тело змеи
  ctx.strokeStyle = "lime";
  ctx.lineWidth = box * 0.8;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(
    snake[0].x * box + box / 2,
    snake[0].y * box + box / 2
  );
  for (let i = 1; i < snake.length; i++) {
    ctx.lineTo(
      snake[i].x * box + box / 2,
      snake[i].y * box + box / 2
    );
  }
  ctx.stroke();

  // голова (увеличенная)
  const hs = box * 2.2;
  const hx = snake[0].x * box + box / 2;
  const hy = snake[0].y * box + box / 2;

  ctx.save();
  ctx.beginPath();
  ctx.arc(hx, hy, hs / 2, 0, Math.PI * 2);
  ctx.clip();
  ctx.drawImage(
    headImg,
    hx - hs / 2,
    hy - hs / 2,
    hs,
    hs
  );
  ctx.restore();

  // рот — ТОЛЬКО при еде
  if (mouthOpen) {
    ctx.fillStyle = "rgba(0,0,0,0.8)";
    ctx.beginPath();
    ctx.arc(hx, hy + box * 0.6, box * 0.4, 0, Math.PI);
    ctx.fill();

    // язык (подкол)
    ctx.strokeStyle = "red";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(hx, hy + box * 0.9);
    ctx.lineTo(hx, hy + box * 1.2);
    ctx.stroke();

    mouthTimer--;
    if (mouthTimer <= 0) mouthOpen = false;
  }

  // мигающие глаза (редко)
  if (Math.random() < 0.03) {
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(hx - box * 0.3, hy - box * 0.3, box * 0.1, 0, Math.PI * 2);
    ctx.arc(hx + box * 0.3, hy - box * 0.3, box * 0.1, 0, Math.PI * 2);
    ctx.fill();
  }

  // game over текст
  if (gameOver) {
    ctx.fillStyle = "white";
    ctx.font = `${box * 1.2}px Arial`;
    ctx.fillText("Проиграл 😈", canvas.width / 2 - box * 3, canvas.height / 2);
  }
}

function loop() {
  update();
  draw();
}
setInterval(loop, 140);

// клавиатура
document.addEventListener("keydown", e => {
  if (e.key === "ArrowUp" && dir !== "DOWN") dir = "UP";
  if (e.key === "ArrowDown" && dir !== "UP") dir = "DOWN";
  if (e.key === "ArrowLeft" && dir !== "RIGHT") dir = "LEFT";
  if (e.key === "ArrowRight" && dir !== "LEFT") dir = "RIGHT";
});

// свайпы (мобилка)
let sx, sy;
canvas.addEventListener("touchstart", e => {
  sx = e.touches[0].clientX;
  sy = e.touches[0].clientY;
});
canvas.addEventListener("touchend", e => {
  const dx = e.changedTouches[0].clientX - sx;
  const dy = e.changedTouches[0].clientY - sy;
  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 0 && dir !== "LEFT") dir = "RIGHT";
    if (dx < 0 && dir !== "RIGHT") dir = "LEFT";
  } else {
    if (dy > 0 && dir !== "UP") dir = "DOWN";
    if (dy < 0 && dir !== "DOWN") dir = "UP";
  }
});

// кнопка рестарта
restartBtn.onclick = () => {
  resize();
  init();
};

window.onresize = resize;
