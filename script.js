// JavaScript: Game logic
const grid = document.getElementById('game-grid');
const message = document.getElementById('message');

const gridSize = 10;
const player = { x: 0, y: 0, direction: { dx: 0, dy: 1 } };
const cereal = { x: Math.floor(Math.random() * gridSize), y: Math.floor(Math.random() * gridSize), direction: randomDirection() };
const radish = { x: Math.floor(Math.random() * gridSize), y: Math.floor(Math.random() * gridSize), direction: randomDirection() };
let cinnamonBlocks = [];

function randomDirection() {
  const directions = [
    { dx: 1, dy: 0 }, { dx: -1, dy: 0 }, { dx: 0, dy: 1 }, { dx: 0, dy: -1 }
  ];
  return directions[Math.floor(Math.random() * directions.length)];
}

function createGrid() {
  grid.innerHTML = '';
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      if (x === player.x && y === player.y) {
        const img = document.createElement('img');
        img.src = 'player.png';
        cell.appendChild(img);
      }
      if (x === cereal.x && y === cereal.y) {
        const img = document.createElement('img');
        img.src = 'cereal.png';
        cell.appendChild(img);
      }
      if (x === radish.x && y === radish.y) {
        const img = document.createElement('img');
        img.src = 'radish.png';
        cell.appendChild(img);
      }
      if (cinnamonBlocks.some(block => block.x === x && block.y === y)) {
        const img = document.createElement('img');
        img.src = 'cinnamon.png';
        cell.appendChild(img);
      }
      grid.appendChild(cell);
    }
  }
}

function moveObject(obj) {
  const newX = obj.x + obj.direction.dx;
  const newY = obj.y + obj.direction.dy;
  if (newX >= 0 && newX < gridSize && newY >= 0 && newY < gridSize && !cinnamonBlocks.some(block => block.x === newX && block.y === newY)) {
    obj.x = newX;
    obj.y = newY;
  } else {
    obj.direction = randomDirection();
  }
}

function checkCollision() {
  if (player.x === cereal.x && player.y === cereal.y) cereal.x = cereal.y = -1;
  if (player.x === radish.x && player.y === radish.y) radish.x = radish.y = -1;
  if (cereal.x === -1 && radish.x === -1) {
    message.textContent = 'You win! Radish cereal is complete!';
    clearInterval(gameInterval);
    clearInterval(cinnamonInterval);
  }
}

function addCinnamon() {
  if (cinnamonBlocks.length >= gridSize * gridSize - 3) {
    message.textContent = 'You have successfully made radish cereal!';
    clearInterval(gameInterval);
    clearInterval(cinnamonInterval);
    return;
  }
  let newBlock;
  do {
    newBlock = { x: Math.floor(Math.random() * gridSize), y: Math.floor(Math.random() * gridSize) };
  } while ((newBlock.x === player.x && newBlock.y === player.y) ||
           (newBlock.x === cereal.x && newBlock.y === cereal.y) ||
           (newBlock.x === radish.x && newBlock.y === radish.y) ||
           cinnamonBlocks.some(block => block.x === newBlock.x && block.y === newBlock.y));
  cinnamonBlocks.push(newBlock);
  createGrid();
}

function handleSwipe(event) {
  const touch = event.changedTouches[0];
  const swipeDirection = { dx: 0, dy: 0 };
  const xDiff = touch.clientX - touch.startX;
  const yDiff = touch.clientY - touch.startY;

  if (Math.abs(xDiff) > Math.abs(yDiff)) {
    swipeDirection.dx = xDiff > 0 ? 1 : -1;
  } else {
    swipeDirection.dy = yDiff > 0 ? 1 : -1;
  }

  if (swipeDirection.dx || swipeDirection.dy) {
    player.direction = swipeDirection;
  }
}

function setupSwipeHandlers() {
  let touchStartX = 0;
  let touchStartY = 0;

  document.addEventListener('touchstart', (event) => {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
  });

  document.addEventListener('touchend', (event) => {
    const touch = event.changedTouches[0];
    const xDiff = touch.clientX - touchStartX;
    const yDiff = touch.clientY - touchStartY;

    if (Math.abs(xDiff) > Math.abs(yDiff)) {
      player.direction = { dx: xDiff > 0 ? 1 : -1, dy: 0 };
    } else {
      player.direction = { dx: 0, dy: yDiff > 0 ? 1 : -1 };
    }
  });
}

setupSwipeHandlers();

let gameInterval = setInterval(() => {
    moveObject(player);
  moveObject(cereal);
  moveObject(radish);
  checkCollision();
  createGrid();
}, 500);

let cinnamonInterval = setInterval(addCinnamon, 1000);

createGrid();