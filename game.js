const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Forzar pantalla horizontal
function resizeCanvas() {
  if (window.innerWidth < window.innerHeight) {
    canvas.width = window.innerHeight;
    canvas.height = window.innerWidth;
    canvas.style.transform = "rotate(90deg)";
    canvas.style.transformOrigin = "left top";
    canvas.style.position = "absolute";
    canvas.style.left = `${window.innerWidth}px`;
    canvas.style.top = "0";
  } else {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.transform = "none";
    canvas.style.left = "0";
  }
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Recursos
const resources = [
  "https://raw.githubusercontent.com/giova737/Luffygame/208a64ee51b8d6ec03c192fc70fbe5609c5f059f/15c549d209b94b190480b38d9c45e488.jpg", // Fondo día
  "https://raw.githubusercontent.com/giova737/Luffygame/refs/heads/Luffy-animaci%C3%B3n/luffy_corriendo.png", // Luffy correr
  "https://raw.githubusercontent.com/giova737/Luffygame/refs/heads/Luffy-animaci%C3%B3n/luffy_salto.png" // Luffy salto
];
let loaded = 0;

// Preloader
const preloader = document.getElementById("preloader");
const progressBar = document.getElementById("progress-bar");
const startScreen = document.getElementById("start-screen");
const gameContainer = document.getElementById("game-container");
const startBtn = document.getElementById("start-btn");
const bgMusic = document.getElementById("bg-music");

resources.forEach(src => {
  const img = new Image();
  img.src = src;
  img.onload = () => {
    loaded++;
    progressBar.style.width = `${(loaded / resources.length) * 100}%`;
    if (loaded === resources.length) {
      setTimeout(() => {
        preloader.classList.add("hidden");
        startScreen.classList.remove("hidden");
      }, 500);
    }
  };
});

// Start button
startBtn.addEventListener("click", () => {
  startScreen.classList.add("hidden");
  gameContainer.classList.remove("hidden");
  bgMusic.play();
  gameLoop();
});

// Jugador
const player = {
  x: 100,
  y: canvas.height - 200,
  width: 80,
  height: 80,
  speed: 5,
  dx: 0,
  dy: 0,
  jumping: false
};

// Fondo
const bg = new Image();
bg.src = resources[0];

// Controles táctiles
document.getElementById("btn-left").addEventListener("touchstart", () => player.dx = -player.speed);
document.getElementById("btn-left").addEventListener("touchend", () => player.dx = 0);

document.getElementById("btn-right").addEventListener("touchstart", () => player.dx = player.speed);
document.getElementById("btn-right").addEventListener("touchend", () => player.dx = 0);

document.getElementById("btn-jump").addEventListener("touchstart", () => {
  if (!player.jumping) {
    player.dy = -15;
    player.jumping = true;
  }
});

// Gravedad
function applyGravity() {
  player.dy += 0.8;
  player.y += player.dy;
  if (player.y + player.height >= canvas.height - 50) {
    player.y = canvas.height - 50 - player.height;
    player.dy = 0;
    player.jumping = false;
  }
}

// Dibujar
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "red";
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Actualizar
function update() {
  player.x += player.dx;
  applyGravity();
}

// Loop
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}