import "./styles/canvasStyles.css";
// Доступ к холсту.
const htmlCanvas = document.getElementById("canvas");
const canvas = htmlCanvas.getContext("2d");

// Определение ширины и высоты холста равную окну браузера.
htmlCanvas.width = window.innerWidth - 4;
htmlCanvas.height = window.innerHeight - 4;

// Параметры игрового прямоугольника.
const PADDLE_WIDTH = 150;
const PADDLE_THICKNESS = 10;
const PADDLE_DIST_FROM_EDGE = 50;
let paddleX = 400;

// Кол-во кадров в секунду.
let framesPerSecond = 30;
// Радиус окружности.
let arcRadius = 15;

// Позиция и скорость центра окружности  по горизонтали.
let ballPositionX = htmlCanvas.width / 2;
let ballSpeedX = 10;
// Позиция и скорость центра окружности  по вертикали.
let ballPositionY = htmlCanvas.height / 2;
let ballSpeedY = 15;

// Координаты мыши с учетом отступа и прокрутки слева-сверху относительного index.html.
htmlCanvas.addEventListener("mousemove", updateMousePos);
function updateMousePos(event) {
  // Получение свойст(параметров) холста.
  let rect = htmlCanvas.getBoundingClientRect();
  // Получение свойст(параметров) index.html документа.
  let rootElement = document.documentElement;
  // X позиция курсора с учетом левого отступа и прокрутки холста влево относительно index.html документа.
  let mouseX =
    event.clientX - PADDLE_WIDTH / 2 - rect.left - rootElement.scrollLeft;
  // X позиция курсора с учетом врехнего отступа и прокрутки холста вниз относительно index.html документа.
  // let mouseY= event.clientY - rect.top - rootElement.scrollTop;
  // Координата X указателя мыши.
  paddleX = mouseX;
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
  }
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
  if (ballPositionY >= htmlCanvas.height + arcRadius) {
   setTimeout(() => {
    ballPositionX = htmlCanvas.width / 2;
    ballPositionY = htmlCanvas.height / 2;
   }, 250);
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

// Отрисовка 30 кадров за секунду.
setInterval(() => {
  updateAll();
}, 1000 / framesPerSecond);
