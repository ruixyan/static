const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

document.addEventListener("mousemove", (e) => {
  const cursor = document.querySelector(".cursor");
  cursor.style.top = e.pageY + "px";
  cursor.style.left = e.pageX + "px";
});

const button = document.getElementById("enterButton");
const author = document.querySelector(".author");

button.addEventListener('mouseover', () => {
  const cursor = document.querySelector('.cursor');
  cursor.style.transform = 'scale(4)'; // Scale up
});

button.addEventListener('mouseout', () => {
  const cursor = document.querySelector('.cursor');
  cursor.style.transform = 'scale(1)'; // Reset to original size
});
  

let particlesArray = [];
const mouse = { x: null, y: null, radius: 100 }; // Mouse interaction radius
let isMouseClicked = false;

class Particle {
  constructor(x, y, targetX, targetY) {
    this.x = x;
    this.y = y;
    this.size = .95; // Slightly larger particles for better visibility
    this.baseX = x;
    this.baseY = y;
    this.targetX = targetX;
    this.targetY = targetY;
    this.density = (Math.random() * 30) + 1;
    this.vx = (Math.random() - 0.5) * 8; // Faster horizontal velocity
    this.vy = (Math.random() - 0.5) * 8; // Faster vertical velocity
    this.directionChangeCounter = 0; // Counter to track direction changes
  }

  draw() {
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }

  update(mouse) {
    if (!isMouseClicked) {
      // Before click: Random movement
      this.x += this.vx;
      this.y += this.vy;

      // Randomize direction every 5 frames
      this.directionChangeCounter++;
      if (this.directionChangeCounter > 10) {
        this.vx = (Math.random() - 0.5) * 8; // Faster horizontal velocity
        this.vy = (Math.random() - 0.5) * 8; // Faster vertical velocity
        this.directionChangeCounter = 0; // Reset counter
      }

      // Keep particles within the canvas bounds
      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    } else {
      // After click: Move toward target position
      
      const dx = this.targetX - this.x;
      const dy = this.targetY - this.y;
      this.x += dx / 28;
      this.y += dy / 28;
      
      var delayInMilliseconds = 5000; //1 second

      setTimeout(function() {
      author.style.display = 'block';
      enterButton.style.display = 'block'; // Show the button//your code to be executed after 1 second
      }, delayInMilliseconds);
      
      

          // Mouse interaction
      const dxMouse = mouse.x - this.x;
      const dyMouse = mouse.y - this.y;
      const distanceMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
      const maxDistanceMouse = 100; // Radius of mouse influence
      const forceMouse = (maxDistanceMouse - distanceMouse) / maxDistanceMouse;

      // if (distanceMouse < maxDistanceMouse) {
      //   // Move particle away from the mouse
      //   const directionX = dxMouse / distanceMouse;
      //   const directionY = dyMouse / distanceMouse;
      //   this.x -= directionX * forceMouse * 5; // Adjust force strength
      //   this.y -= directionY * forceMouse * 5;
      // }

      // Add jitter after forming the word
      if (Math.abs(dx) < 1 && Math.abs(dy) < 1) {
        this.x += (Math.random() - 0.5) * 6; // change value
        this.y += (Math.random() - 0.5) * 6;
      }
    }

  }
}

function init() {
  particlesArray = [];
  const text = 'static';
  ctx.fillStyle = '#fff';
  ctx.font = 0.2 * window.innerWidth + "px MachinaBold";
  ctx.fillText(text, canvas.width / 2 - ctx.measureText(text).width / 2, canvas.height / 2);

  const textData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let y = 0; y < canvas.height; y += 3) { // Reduced spacing (from 5 to 3)
    for (let x = 0; x < canvas.width; x += 3) { // Reduced spacing (from 5 to 3)
      const alpha = textData[(y * canvas.width + x) * 4 + 3];
      if (alpha > 128) {
        const targetX = x;
        const targetY = y;
        const startX = Math.random() * canvas.width;
        const startY = Math.random() * canvas.height;
        particlesArray.push(new Particle(startX, startY, targetX, targetY));
      }
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particlesArray.forEach(particle => {
    particle.update(mouse);
    particle.draw();
  });
  requestAnimationFrame(animate);
}

window.addEventListener('click', () => {
  isMouseClicked = true;
});

window.addEventListener('mousemove', (e) => {
  mouse.x = e.x;
  mouse.y = e.y;
});

window.addEventListener('mouseout', () => {
  mouse.x = undefined;
  mouse.y = undefined;
});

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  init();
});

init();
animate();
