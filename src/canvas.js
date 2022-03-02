// .css файл элемента id="canvas".
import "./styles/canvasStyles.css";
// Доступ к холсту.
const htmlCanvas = document.getElementById("canvas");
const canvas = htmlCanvas.getContext("2d");
// Определение ширины и высоты холста равную окну браузера.
htmlCanvas.width = window.innerWidth - 4;
htmlCanvas.height = window.innerHeight - 4;

/*/=========================START=========================/*/
// Используемые цвета: 0:blue, 1:gold, 2:white, 3:brick.
let colors = ["#0000FF", "#ffff00", "#ffffff", "#BC4A3C"];
/*/========================END============================/*/

/*/=========================START=========================/*/
// X координата указателя мыши.
let globalMouseX = htmlCanvas.width / 2;
// Y координата указателя мыши.
let globalMouseY = htmlCanvas.height / 2;
/*/========================END============================/*/

/*/=========================START=========================/*/
// Ширина кирпичика.
const BRICK_W = 70;
// Высотка кирпичика.
const BRICK_H = 20;
// Кол-во строк Кирпичиков.
const BRICK_ROWS = Math.floor(htmlCanvas.height / 2.5 / BRICK_H);
// Кол-во рядов кипричиков.
const BRICK_COLS = Math.floor(htmlCanvas.width / BRICK_W);
// Расстояние между Кирпичиками.
const BRICK_GAP = 5;
// Кол-во Кирпичиков в окне браузера.
let bricksLeft = 0;
// Элементы отображения Кирпичиков(отладка).
/*
let brick0 = true;
let brick1 = true;
let brick2 = true;
let brick3 = true;
*/
// Массив храния Кирпичиков(отладка).
/*
let brickGrid = [true, false, true, true]; */
// Массив храния Кирпичиков.
let brickGrid = new Array(BRICK_COLS * BRICK_ROWS);
/*/========================END============================/*/

/*/=========================START=========================/*/
// Радиус шара.
const RADIUS = 15;
// Изначальная координата Шара по горизонтали.
let ballX = 75;
// Изначальная координата Шара по вертикали.
let ballY = 75;
// Изначальное ускорение Шара по горизонтали.
let ballSpeedX = 5;
// Изначальное ускорение Шара по вертикали.
let ballSpeedY = 5;
/*/========================END============================/*/

/*/=========================START=========================/*/
// Ширина ракетки.
const PADDLE_WIDTH = 100;
// Высота ракетки.
const PADDLE_THICKNESS = 10;
// Расстояние от нижней части холста до Ракетки.
const PADDLE_DIST_FROM_EDGE = 50;
// Изначальная X координата Ракетки.
let paddleX = 400;
/*/========================END============================/*/

/*/=========================START======== =================/*/
// Отслеживание позицию курсора мыши с учетом расстояния и прокрутки от index.html до холста.
htmlCanvas.addEventListener("mousemove", updateMousePos);
/*/========================END============================/*/

/*/=========================START=========================/*/
// Функция обновления всех элементов холста.
function updateAll() {
  // Отрисовка элементов на холсте.
  draw();
  // Обновление элементов на холсте.
  update();
}
// Функция возврата Шара на середину при падении.
function ballReset() {
  ballX = htmlCanvas.width / 2;
  ballY = htmlCanvas.height / 2;
}
// Функция отрисовки элементов на холсте.
function draw() {
  /*/=============START============/*/

  // Покадровая отрисовка Шара на холсте.
  drawArc(ballX, ballY, RADIUS, colors[0]);

  // Покадровая отрисовка Ракетки на холсте.
  drawRect(
    paddleX,
    htmlCanvas.height - PADDLE_DIST_FROM_EDGE,
    PADDLE_WIDTH,
    PADDLE_THICKNESS,
    colors[2]
  );
  // Покадровая отрисовка Кирпичиков.
  drawBricks();
  // Единица измерения X координаты указателя мыши в Кирпичиках.
  let mouseBrickCol = Math.floor(globalMouseX / BRICK_W);
  // Единица измерения Y координаты указателя мыши в Кирпичиках.
  let mouseBrickRaw = Math.floor(globalMouseY / BRICK_H);
  // Единица измерения XY координаты указателя мыши в Кирпичиках.
  let brickIndexUnderMouse = rawColtoArrayIndex(mouseBrickCol, mouseBrickRaw);
  // Покадровая отрисовка текста на холсте.
  drawText(
    "BrickCol: " +
      mouseBrickCol +
      "," +
      "BrickRaw: " +
      mouseBrickRaw +
      ": " +
      brickIndexUnderMouse,
    globalMouseX,
    globalMouseY,
    colors[1]
  );
  // false условие отображения Кирпичика при наведении на него курсора мыши.
  /*
  if (
    brickIndexUnderMouse >= 0 &&
    brickIndexUnderMouse <= BRICK_COLS * BRICK_ROWS
  ) {
    brickGrid[brickIndexUnderMouse] = false;
  }
  */
  /*/=============END============/*/
}
// Функция обновления элементов на холсте.
function update() {
  // Изменение положения Мяча.
  ballMove();
  // Скрытие Кирпичиков при коллизии с Мячом.
  ballBrickHandling();
  // Отскок Мяча от Ракетки.
  ballPaddHandling();
}
// Функция захвата координат курсора мыши.
function updateMousePos(event) {
  // Размер элемента и его позицию относительно viewport(часть страницы, показанная на экране, и которую мы видим).
  let rect = htmlCanvas.getBoundingClientRect();
  // Коренной элемент документа(<html>).
  let rootElement = document.documentElement;
  // Координата X курора мыши(с учетом позиции холста на index.html страницы и процента прокрутки).
  globalMouseX = event.clientX - rect.left - rootElement.scrollLeft;
  // Координата Y курора мыши.
  globalMouseY = event.clientY - rect.top - rootElement.scrollTop;
  // Начальное X положение Ракетки.
  paddleX = globalMouseX - PADDLE_WIDTH / 2;
}
// Функция отрисовки прямоугольника.
function drawRect(topLeftX, topLeftY, rectWith, rectHeight, rectColor) {
  canvas.fillStyle = rectColor;
  canvas.fillRect(topLeftX, topLeftY, rectWith, rectHeight);
}
// Функция отрисовки покружности.
function drawArc(arcX, arcY, arcRadius, arcColor) {
  canvas.fillStyle = arcColor;
  canvas.beginPath();
  canvas.arc(arcX, arcY, arcRadius, 0, Math.PI * 2, false);
  canvas.fill();
  canvas.closePath();
}
// Функция отрисовки текста.
function drawText(text, textPosX, textPosY, textColor) {
  canvas.fillStyle = textColor;
  canvas.font = "14px sans-serif";
  canvas.fillText(text, textPosX, textPosY);
}
// Функция заполнения массива условиями отрисовки Кирпичиков.
function fillBrickArray() {
  // Скрытие первых двух строк кирпичиков.
  let index;
  for (index = 0; index < 3 * BRICK_COLS; index++) {
    brickGrid[index] = false;
  }
  // Отображение остальных строк.
  for (; index < BRICK_COLS * BRICK_ROWS; index++) {
    // Случайное условие отображения элемента из массива Кирпичиков.
    /*
    Math.random() < 0.5 ? (brickGrid[i] = true) : (brickGrid[i] = false);
    */
    //  Заполнение всех условий массива как TRUE.
    brickGrid[index] = true;
    bricksLeft++;
  }
}
// Функция получение индекса массива Кирпичиков.
function rawColtoArrayIndex(col, row) {
  // Кол-во элементов в строке * текущую строку + номер элемента в этой строке.
  return BRICK_COLS * row + col;
}
function drawBricks() {
  // Ручной ввод кол-ва Кирпичиков(отладка).
  /*
  if (brickGrid[0]) {
    drawRect(BRICK_W * 0, 0, BRICK_W - 2, BRICK_H, colors[3]);
  }
  if (brickGrid[1]) {
    drawRect(BRICK_W * 1, 0, BRICK_W - 2, BRICK_H, colors[3]);
  }
  if (brickGrid[2]) {
    drawRect(BRICK_W * 2, 0, BRICK_W - 2, BRICK_H, colors[3]);
  }
  if (brickGrid[3]) {
    drawRect(BRICK_W * 3, 0, BRICK_W - 2, BRICK_H, colors[3]);
  }
  */
  // Отрисовка Кирпичиков по вертикали в зависимости от его условия существования.
  for (let eachRow = 0; eachRow < BRICK_ROWS; eachRow++) {
    // Отрисовка Кирпичиков по горизонтали в зависимости от его условия существования.
    for (let eachCol = 0; eachCol < BRICK_COLS; eachCol++) {
      // Каждый первый элемент в строке + позиция элемента внутри строки.
      let arrayIndex = rawColtoArrayIndex(eachCol, eachRow); // arrayIndex[0,4] = (19 * 0) + 4 = 4; arrayIndex[1,3] = (19 * 1) + 3 = 22;
      // Проход по каждому кирпичику от 0 - brick.length - 1;
      if (brickGrid[arrayIndex]) {
        drawRect(
          // X.
          BRICK_W * eachCol,
          // Y.
          BRICK_H * eachRow,
          BRICK_W - BRICK_GAP,
          BRICK_H - BRICK_GAP,
          colors[3]
        );
      }
    }
    // Проверка работы индексов массива Кирпичиков.
    /*
    // brickGrid[5] = false;
    // brickGrid[22] = false;
    */
  }
  // brickGrid[0] = false;
  // Отрисовка Кирпичиков по вертикали в зависимости от его условия существования.
  /*for (let i = 0; i < BRICK_COUNT; i++) {
    if (brickGrid[i]) {
      drawRect(
        BRICK_W * i,
        BRICK_H,
        BRICK_W - BRICK_GAP,
        BRICK_H - BRICK_GAP,
        colors[3]
      );
    }
  }
  */
}
// Функция перемещения Мяча.
function ballMove() {
  /*/=============START============/*/
  // Изменение координан шара по горизонтали за 1 кадр.
  ballX += ballSpeedX;
  // Изменение координан шара по вертикали за 1 кадр.
  ballY += ballSpeedY;
  /*/=============END============/*/

  /*/=============START============/*/
  // Коллизия шара с верхней частью холста.
  if (ballY - RADIUS <= 0) {
    ballSpeedY *= -1;
  }
  // Коллизия шара с левой частью холста.
  if (ballX - RADIUS <= 0) {
    ballSpeedX *= -1;
  }
  // Коллизия шара с правой частью холста.
  if (ballX + RADIUS >= htmlCanvas.width) {
    ballSpeedX *= -1;
  }
  // Коллизия шара с нижней частью холста.
  if (ballY + RADIUS >= htmlCanvas.height + RADIUS) {
    // Возврат Шара на середину холста через 1 секунду.
    setTimeout(() => {
      ballReset();
      bricksLeft = 0;
      fillBrickArray();
    }, 1000);
  }
  /*/=============END============/*/
}
// Функция скрытия Кирпичиков при коллизии с Мячом.
function ballBrickHandling() {
  /*/=============START============/*/
  // Координата Мяча X в единицах Кирпичиков(Ширина).
  let ballBrickCol = Math.floor(ballX / BRICK_W);
  // Координата Мяча Y в единицах Кирпичиков(Высота).
  let ballBrickRow = Math.floor(ballY / BRICK_H);
  // Индекс Шара под указателем мыши.
  let brickIndexUnderBall = rawColtoArrayIndex(ballBrickCol, ballBrickRow);
  // Условие скрытия Кирпичика при нахождении Мяча в пределах координат массива Кирпичиков по X, Y.
  if (
    ballBrickCol >= 0 &&
    ballBrickCol < BRICK_COLS &&
    ballBrickRow >= 0 &&
    ballBrickRow < BRICK_ROWS
  ) {
    // Отскок шара только от существующих элементов.
    if (brickGrid[brickIndexUnderBall]) {
      // Скрытие Кирпичика.
      brickGrid[brickIndexUnderBall] = false;
      // Кол-во оставшихся кирпичиков.
      bricksLeft--;
      // console.log(bricksLeft);
      /*/=============START============/*/
      // Предыдущее положение Мяча по горизонтали в пикселях.
      let prevBallX = ballX - ballSpeedX;
      // Предыдущее положение Мяча по вертикали в пикселях.
      let prevBallY = ballY - ballSpeedY;
      // Предыдущее положение Мяча по горизонтали в Кирпичиках.
      let prevBrickCol = Math.floor(prevBallX / BRICK_W);
      // Предыдущее положение Мяча по вертикали в Кирпичиках.
      let prevBrickRow = Math.floor(prevBallY / BRICK_H);

      // Отскок от угла, прилешающих друг к другу Кирпичиков.
      let bothTestFailed = true;

      // Первичное сравнение вектора по горизонтали.
      if (prevBrickCol != ballBrickCol) {
        // Получение индекса Кирпичика на предыдущей строке по горизонтали.
        let adjBrickSide = rawColtoArrayIndex(prevBrickCol, ballBrickRow);
        // Изменение условия видимости Кирпичика(Изменение знака boolean).
        if (!brickGrid[adjBrickSide]) {
          // Горизонтальное изменение направления на противоположное.
          ballSpeedX *= -1;
          // Срабатывание теста по горизонтали.
          bothTestFailed = false;
        }
      }
      // Движение внутри Кирпичика по его восоте до начала другого Кирпичика.
      if (prevBrickRow != ballBrickRow) {
        // Получение индекса Кирпичика на предыдущей строке по вертикали.
        let adjBrickTopBottom = rawColtoArrayIndex(ballBrickCol, prevBrickRow);
        // Изменение условия видимости Кирпичика(Изменение знака boolean).
        if (!brickGrid[adjBrickTopBottom]) {
          // Горизонтальное изменение направления на противоположное.
          ballSpeedY *= -1;
          // Срабатывание теста по вертикали.
          bothTestFailed = false;
        }
      }
      /*/=============END============/*/
      // Отскок от угла соединящихся Кипрпичиков.
      if (bothTestFailed) {
        ballSpeedX *= -1;
        ballSpeedY *= -1;
      }
    }
    /*/=============END============/*/
  }
}
// Функция отскока Мяча от Ракетки.
function ballPaddHandling() {
  /*/=============START============/*/
  // Верхняя сторона Ракетки(Отступ от нижнего края холста).
  let paddleTopEdge = htmlCanvas.height - PADDLE_DIST_FROM_EDGE;
  // Нижняя сторона Ракеки(Верхняя сторона + Ширина Ракетки).
  let paddleBottomEdge = paddleTopEdge + PADDLE_THICKNESS;
  // Левая сторона Ракетки(Координата X указателя мыши).
  let paddleLeftEdge = paddleX;
  // Правая сторона Ракетки(Координата X указателя мыши + ширина Ракетки).
  let paddleRightEdge = paddleX + PADDLE_WIDTH;
  // X, Y коллизии Шара и Ракетки.
  if (
    ballY + RADIUS >= paddleTopEdge &&
    ballY <= paddleBottomEdge &&
    ballX >= paddleLeftEdge &&
    ballX <= paddleRightEdge
  ) {
    ballSpeedY *= -1;
    /*/=============START============/*/
    // Центр Ракетки.
    let centerOfPaddleX = paddleX + PADDLE_WIDTH / 2;
    // Расстояние между центром Ракетки и Шаром.
    let ballDistFromPaddleCenterX = ballX - centerOfPaddleX;
    // Измененение направления движения Шара в зависимости от места соприкосновения с Ракеткой.
    ballSpeedX = ballDistFromPaddleCenterX * 0.05;
    /*/=============END============/*/
    if (bricksLeft === 0) {
      fillBrickArray();
    }
  }
  /*/=============END============/*/
}
// Рекурсионная покадровое отображение элементов.
function animate() {
  // Обновление кадров на холсте.
  requestAnimationFrame(animate);
  // Обновление заливки холста.
  drawRect(0, 0, htmlCanvas.width, htmlCanvas.height, "#000000");
  // Обновление элементов на холсте.
  updateAll();
}
/*/========================END============================/*/
// Заполнение массива условиями отрисовки Кирпичиков.
fillBrickArray();
// Установка Шара в центре Холста.
ballReset();
// Первичный вход в рекурсионную функцию отрисовки кадров.
animate();
