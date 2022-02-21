import "./styles/canvasStyles.css";
// Доступ к холсту.
const htmlCanvas = document.getElementById("canvas");
const canvas = htmlCanvas.getContext("2d");
// Определение ширины и высоты холста равную окну браузера.
htmlCanvas.width = window.innerWidth - 4;
htmlCanvas.height = window.innerHeight - 4;
// Координаты курсора мыши.
let mouseX;
let mouseY;
// Параметры игрового прямоугольника.
const PADDLE_WIDTH = 150;
const PADDLE_THICKNESS = 10;
const PADDLE_DIST_FROM_EDGE = 50;
let paddleX = 400;
// Параметры игровых блоков.
const BLOCK_W = 100;
const BLOCK_H = 20;
// Расстояние между блоками.
const BLOCK_GAP = 2;
// Кол-во блоков.
const BLOCK_COUNT = 8;
// Массив игровых блоков.
let blockGrid = new Array(BLOCK_COUNT);
// Радиус окружности.
let arcRadius = 15;
// Позиция и скорость центра окружности  по горизонтали.
let ballPositionX = htmlCanvas.width / 2;
let ballSpeedX = 5;
// Позиция и скорость центра окружности  по вертикали.
let ballPositionY = htmlCanvas.height / 2;
let ballSpeedY = 5;

// Координаты мыши с учетом отступа и прокрутки слева-сверху относительного index.html.
htmlCanvas.addEventListener("mousemove", updateMousePos);
function updateMousePos(event) {
  // Получение свойст(параметров) холста.
  let rect = htmlCanvas.getBoundingClientRect();
  // Получение свойст(параметров) index.html документа.
  let rootElement = document.documentElement;
  // X позиция курсора с учетом левого отступа и прокрутки холста влево относительно index.html документа.
  mouseX = event.clientX - rect.left - rootElement.scrollLeft;
  // X позиция курсора с учетом врехнего отступа и прокрутки холста вниз относительно index.html документа.
  mouseY = event.clientY - rect.top - rootElement.scrollTop;
  // Координата X указателя мыши.
  paddleX = mouseX - PADDLE_WIDTH / 2;
}
// Функция отрисовки кадров.
function updateAll() {
  moveAll();
  drawAll();
}
// Отрисовка элементов.
function drawAll() {
  // Заливка фона холста.
  colorRect(0, 0, htmlCanvas.width, htmlCanvas.height, "rgba(0, 0, 0, 1)");
  // Отрисовка игрового прямоугольника.
  colorRect(
    // X координата игрового прямоугольника.
    paddleX,
    // Y координата игрового прямоугольника с учетом его высоты.
    htmlCanvas.height - PADDLE_DIST_FROM_EDGE,
    // Ширина игрового прямоугольника.
    PADDLE_WIDTH,
    // Высота игрового прямоугольника.
    PADDLE_THICKNESS,
    // Цвет прямоугольника.
    "#FFFFFF"
  );
  // Создание окружности.
  colorCircle(ballPositionX, ballPositionY, arcRadius, "#0000FF");
  // Отрисовка игровых блоков.
  drawBlocks();

  // Отображение координатов ширины и высоты блоков.
  let mouseBlockCol = mouseX / BLOCK_W;
  let mouseBlockRaw = mouseY / BLOCK_H;
  if (mouseX <= 0 && mouseY <= 0) {
    colorText("BlockXCol: " + mouseBlockCol + " BlockYRaw: " + mouseBlockRaw, mouseX, mouseY + 20, "#ffff00");
  } else if (mouseY - 4 <= 0 && mouseX >= htmlCanvas.width - 4) {
    colorText(
      "BlockXCol: " + mouseBlockCol + " BlockYRaw: " + mouseBlockRaw,
      mouseX - 250,
      mouseY + 15,
      "#ffff00"
    );
  } else if (mouseY <= 15) {
    colorText(
      "BlockXCol: " + mouseBlockCol + " BlockYRaw: " + mouseBlockRaw,
      mouseX - 250,
      mouseY + 30,
      "#ffff00"
    );
  } else if (mouseX + 250 > htmlCanvas.width) {
    colorText(
      "BlockXCol: " + mouseBlockCol + " BlockYRaw: " + mouseBlockRaw,
      mouseX - 250,
      mouseY,
      "#ffff00"
    );
  } else {
    colorText(
      "BlockXCol: " + mouseBlockCol+ " BlockYRaw: " + mouseBlockRaw,
      mouseX,
      mouseY,
      "#ffff00"
    );
  }
}
// Функция инициализации и обновления игровых блоков.
function blockReset() {
  for (let i = 0; i < BLOCK_COUNT; i++) {
    blockGrid[i] = true;
  }
}
// Функция отрисовки игровых блоков.
function drawBlocks() {
  for (let i = 0; i < BLOCK_COUNT; i++) {
    if (blockGrid[i]) {
      colorRect(BLOCK_W * i, 0, BLOCK_W - BLOCK_GAP, BLOCK_H, "#BC4A3C");
    }
  }
}
// Функция обновления элементов.
function moveAll() {
  // Верхняя сторона игрового прямоугольнка.
  let paddleTopEdgeY = htmlCanvas.height - PADDLE_DIST_FROM_EDGE;
  // Нижняя сторона игрового прямоугольнка.
  let paddleBottomEdgeY = paddleTopEdgeY + PADDLE_THICKNESS;
  // Левая сторона игрового прямоугольнка.
  let paddleLeftEdgeX = paddleX;
  // Правая сторона игрового прямоугольнка.
  let paddleRightEdgeX = paddleLeftEdgeX + PADDLE_WIDTH;
  // Условие отскока шара от игрового прямоугольнка по координате Y.
  if (
    ballPositionY + arcRadius > paddleTopEdgeY &&
    ballPositionY + arcRadius < paddleBottomEdgeY &&
    // Условие отскока шара от игрового прямоугольнка по координате X.
    ballPositionX > paddleLeftEdgeX &&
    ballPositionX < paddleRightEdgeX
  ) {
    // Изменение направления движения шара на противоположное.
    ballSpeedY *= -1;
    // Центр игрового прямоугольника.
    let centreOfPaddleX = paddleX + PADDLE_WIDTH / 2;
    // Расстояние от шара до центра игрового прямоугольника.
    let ballDistFromPaddleCenterX = ballPositionX - centreOfPaddleX;
    // Изменение ускорения шара по горизонтали в завимимости от положения на игровом прямоугольнке.
    ballSpeedX = ballDistFromPaddleCenterX * 0.1;
  }
  // Коллизии шара по горизонтали.
  if (
    ballPositionX >= htmlCanvas.width - arcRadius ||
    ballPositionX - arcRadius <= 0
  ) {
    // Изменение направления движения окружности на противоположное.
    ballSpeedX *= -1;
  }
  // Создание коллизий краев холста по вертикали.
  if (ballPositionY - arcRadius <= 0) {
    // Изменение направления движения окружности на противоположное.
    ballSpeedY *= -1;
  }
  // Обновление координат шара при выходе за пределы холста.
  if (ballPositionY >= htmlCanvas.height + arcRadius) {
    setTimeout(() => {
      ballSpeedX = 5;
      ballSpeedY = 5;
      ballPositionX = htmlCanvas.width / 2;
      ballPositionY = htmlCanvas.height / 2;
    }, 1000);
  }
  // Коллизии игрового прямоугольника по горизонтали.
  if (paddleX + PADDLE_WIDTH >= htmlCanvas.width) {
    paddleX = htmlCanvas.width - PADDLE_WIDTH;
  } else if (paddleX - paddleX / 2 <= 0) {
    paddleX = 0;
  }
  // Изменение позиции центра окружности на ballSpeedX пикселей вправо.
  ballPositionX += ballSpeedX;
  // Изменение позиции центра окружности на ballSpeedY пикселей вниз.
  ballPositionY += ballSpeedY;
  // Создание коллизий краев холста по горизонтали.
}
// Функция заливки фона холста.
function colorRect(topLeftX, topLeftY, boxWidth, boxHeight, fillColor) {
  canvas.fillStyle = fillColor;
  canvas.fillRect(topLeftX, topLeftY, boxWidth, boxHeight);
}
// Функция создания окружности.
function colorCircle(arcX, arcY, arcRadius, fillColor) {
  // Создание окружности.
  canvas.beginPath();
  canvas.fillStyle = fillColor;
  canvas.arc(arcX, arcY, arcRadius, 0, Math.PI * 2, false);
  canvas.fill();
  canvas.closePath();
}
// Функция вывода координат курсора мыши.
function colorText(text, textX, textY, fillColor) {
  canvas.fillStyle = fillColor;
  canvas.fillText(text, textX, textY);
  canvas.font = "15px sans-serif";
}
// Рекурсионная покадровое отображение элементов.
function animate() {
  requestAnimationFrame(animate);
  updateAll();
}
blockReset();
animate();
