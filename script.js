const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");

const character = {
  x: canvas.width / 2 - 50,
  y: canvas.height - 100,
  width: 100,
  height: 100,
  isDragging: false,
  image: new Image(),
};
character.image.src = "img/speed.png";

const fallingObjects = [];
const goodObjectSize = 50;
const badObjectSize = 70; // Increased size for bad objects
const objectSpeed = 2;
let score = 0;
let gameOver = false;

const images = {
  bad: [new Image(), new Image()],
  good: [new Image(), new Image()],
};

images.bad[0].src = "img/cops1.png";
images.bad[1].src = "img/cops2.png";
images.good[0].src = "img/friedchicken.png";
images.good[1].src = "img/watermealon.png";

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  character.x = canvas.width / 2 - character.width / 2;
  character.y = canvas.height - character.height - 10;
}

function createFallingObject() {
  const x = Math.random() * (canvas.width - goodObjectSize);
  const isBad = Math.random() < 0.3; // 30% chance to be a bad object
  const image = isBad
    ? images.bad[Math.floor(Math.random() * images.bad.length)]
    : images.good[Math.floor(Math.random() * images.good.length)];
  const size = isBad ? badObjectSize : goodObjectSize;
  fallingObjects.push({
    x,
    y: 0,
    width: size,
    height: size,
    image,
    isBad,
  });
}

function update() {
  if (gameOver) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "48px serif";
    ctx.fillStyle = "red";
    ctx.fillText("Go to Jail", canvas.width / 2 - 100, canvas.height / 2);
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw character
  ctx.drawImage(
    character.image,
    character.x,
    character.y,
    character.width,
    character.height
  );

  // Update and draw falling objects
  for (let i = 0; i < fallingObjects.length; i++) {
    const obj = fallingObjects[i];
    obj.y += objectSpeed;

    // Check for collision
    if (
      obj.x < character.x + character.width &&
      obj.x + obj.width > character.x &&
      obj.y < character.y + character.height &&
      obj.y + obj.height > character.y
    ) {
      if (obj.isBad) {
        gameOver = true;
        scoreDisplay.textContent = `Score: ${score}`;
        break;
      } else {
        fallingObjects.splice(i, 1);
        score++;
        scoreDisplay.textContent = `Score: ${score}`;
        character.width += 10; // Increase character width
        character.height += 10; // Increase character height
        character.y = canvas.height - character.height - 10; // Adjust y position to keep character anchored at the bottom
        i--;
        continue;
      }
    }

    // Remove objects that fall off the screen
    if (obj.y > canvas.height) {
      fallingObjects.splice(i, 1);
      i--;
      continue;
    }

    // Draw the object with its original aspect ratio
    const aspectRatio = obj.image.width / obj.image.height;
    const drawWidth = obj.width * aspectRatio;
    const drawHeight = obj.height;
    ctx.drawImage(obj.image, obj.x, obj.y, drawWidth, drawHeight);
  }

  requestAnimationFrame(update);
}

canvas.addEventListener("mousedown", (e) => {
  if (
    e.offsetX > character.x &&
    e.offsetX < character.x + character.width &&
    e.offsetY > character.y &&
    e.offsetY < character.y + character.height
  ) {
    character.isDragging = true;
  }
});

canvas.addEventListener("mousemove", (e) => {
  if (character.isDragging) {
    character.x = e.offsetX - character.width / 2;
  }
});

canvas.addEventListener("mouseup", () => {
  character.isDragging = false;
});

canvas.addEventListener("touchstart", (e) => {
  const touch = e.touches[0];
  if (
    touch.clientX > character.x &&
    touch.clientX < character.x + character.width &&
    touch.clientY > character.y &&
    touch.clientY < character.y + character.height
  ) {
    character.isDragging = true;
  }
});

canvas.addEventListener("touchmove", (e) => {
  const touch = e.touches[0];
  if (character.isDragging) {
    character.x = touch.clientX - character.width / 2;
  }
});

canvas.addEventListener("touchend", () => {
  character.isDragging = false;
});

document.addEventListener(
  "touchmove",
  function (event) {
    event.preventDefault();
  },
  { passive: false }
);

document.addEventListener(
  "mousemove",
  function (event) {
    event.preventDefault();
  },
  { passive: false }
);

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

setInterval(createFallingObject, 1000);
update();
