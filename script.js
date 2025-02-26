// 1. Get DOM elements
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const pauseButton = document.getElementById('pause');

// 2. Game settings
const gridSize = 20;
const tileCount = canvas.width / gridSize;
let snake = [{ x: 10, y: 10 }];
let food = { x: 15, y: 15 };
let dx = 0;
let dy = 0;
let score = 0;
let baseSpeed = 100; // Initial speed in ms (10 FPS)
let speed = baseSpeed;
let gameLoop;
let isPaused = false;

// 3. Function to draw the game
function drawGame() {
  if (isPaused) return;

  // Move snake
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  snake.unshift(head);
  
  // Check if snake ate food
  if (head.x === food.x && head.y === food.y) {
    score += 10;
    scoreDisplay.textContent = `Score: ${score}`;
    generateFood();
    increaseSpeed(); // Speed up after eating
  } else {
    snake.pop();
  }
  
  // Clear canvas
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw snake
  ctx.fillStyle = '#4caf50';
  snake.forEach(segment => {
    ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
  });
  
  // Draw food
  ctx.fillStyle = '#f44336';
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
  
  // Check collision
  if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount || snake.slice(1).some(s => s.x === head.x && s.y === head.y)) {
    clearInterval(gameLoop);
    gameLoop = null;
    alert(`Game Over! Score: ${score}`);
    return;
  }
  
  gameLoop = setTimeout(drawGame, speed);
}

// 4. Function to generate food
function generateFood() {
  food.x = Math.floor(Math.random() * tileCount);
  food.y = Math.floor(Math.random() * tileCount);
  while (snake.some(s => s.x === food.x && s.y === food.y)) {
    food.x = Math.floor(Math.random() * tileCount);
    food.y = Math.floor(Math.random() * tileCount);
  }
}

// 5. Function to increase speed
function increaseSpeed() {
  speed = Math.max(baseSpeed * 0.9, 50); // Decrease delay (increase speed), min 50ms
}

// 6. Function to start the game
function startGame() {
  if (!gameLoop) {
    snake = [{ x: 10, y: 10 }];
    dx = 0;
    dy = 0;
    score = 0;
    speed = baseSpeed; // Reset speed
    scoreDisplay.textContent = `Score: ${score}`;
    generateFood();
    isPaused = false;
    pauseButton.textContent = 'Pause';
    clearInterval(gameLoop);
    drawGame();
  }
}

// 7. Function to toggle pause
function togglePause() {
  if (!gameLoop) return; // Do nothing if game isn’t running
  isPaused = !isPaused;
  pauseButton.textContent = isPaused ? 'Resume' : 'Pause';
  if (!isPaused) drawGame();
}

// 8. Handle keyboard input
document.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowUp': if (dy !== 1) { dx = 0; dy = -1; } break;
    case 'ArrowDown': if (dy !== -1) { dx = 0; dy = 1; } break;
    case 'ArrowLeft': if (dx !== 1) { dx = -1; dy = 0; } break;
    case 'ArrowRight': if (dx !== -1) { dx = 1; dy = 0; } break;
    case 'Enter': startGame(); break;
  }
});