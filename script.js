const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Game settings
const gridSize = 20; // Size of each grid square
const tileCount = canvas.width / gridSize; // Number of tiles in a row/column

// Snake and food
let snake = [{ x: 10, y: 10 }]; // Initial snake position
let food = { x: 5, y: 5 }; // Initial food position
let direction = { x: 0, y: 0 }; // Initial direction
let score = 0;
let gameStarted = false; // Track if the game has started

// Game loop
function gameLoop() {
  update();
  draw();
  setTimeout(gameLoop, 100); // Adjust speed here
}

// Update game state
function update() {
  // Only move the snake if the game has started
  if (!gameStarted) return;

  // Move the snake
  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

  // Check for wall collision
  if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
    resetGame();
    return;
  }

  // Check for collision with itself
  if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
    resetGame();
    return;
  }

  // Add new head to the snake
  snake.unshift(head);

  // Check if snake eats food
  if (head.x === food.x && head.y === food.y) {
    score++;
    placeFood();
  } else {
    // Remove the tail if no food is eaten
    snake.pop();
  }
}

// Draw everything on the canvas
function draw() {
  // Clear the canvas
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw the snake
  ctx.fillStyle = "lime";
  snake.forEach(segment => {
    ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
  });

  // Draw the food
  ctx.fillStyle = "red";
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);

  // Draw the score
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText(`Score: ${score}`, 10, 30);

  // Display start message if the game hasn't started
  if (!gameStarted) {
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Press an arrow key to start", 50, canvas.height / 2);
  }
}

// Place food at a random position
function placeFood() {
  food = {
    x: Math.floor(Math.random() * tileCount),
    y: Math.floor(Math.random() * tileCount),
  };

  // Ensure food doesn't spawn on the snake
  if (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
    placeFood();
  }
}

// Reset the game
function resetGame() {
  alert(`Game Over! Your score: ${score}`); // Show game over message
  snake = [{ x: 10, y: 10 }];
  direction = { x: 0, y: 0 };
  score = 0;
  gameStarted = false; // Reset game state
  placeFood();
}

// Handle keyboard input
window.addEventListener("keydown", e => {
  if (!gameStarted) {
    gameStarted = true; // Start the game on first key press
  }

  switch (e.key) {
    case "ArrowUp":
      if (direction.y === 0) direction = { x: 0, y: -1 };
      break;
    case "ArrowDown":
      if (direction.y === 0) direction = { x: 0, y: 1 };
      break;
    case "ArrowLeft":
      if (direction.x === 0) direction = { x: -1, y: 0 };
      break;
    case "ArrowRight":
      if (direction.x === 0) direction = { x: 1, y: 0 };
      break;
  }
});

// Start the game
placeFood();
gameLoop();
