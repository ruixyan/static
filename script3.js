document.addEventListener("mousemove", (e) => {
    const cursor = document.querySelector(".spotlight");
    cursor.style.top = e.pageY + "px";
    cursor.style.left = e.pageX + "px";
  });
  
  const button = document.getElementById("enterButton");
  
  button.addEventListener('mouseover', () => {
    const cursor = document.querySelector('.cursor');
    cursor.style.transform = 'scale(4)'; // Scale up
  });
  
  button.addEventListener('mouseout', () => {
    const cursor = document.querySelector('.spotlight');
    cursor.style.transform = 'scale(1)'; // Reset to original size
  });

const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray = [];
const mouse = { x: null, y: null, radius: 100 }; // Mouse interaction radius
let isMouseClicked = false;

// Define multiple lines of text
const textLines = [
  { text: 'a candle melts and ', font: 'bold 50px MachinaRegular' },
  { text: 'fingers of the lake slowly abound.', font: 'bold 50px MachinaRegular' },
  { text: 'i need that request of light', font: 'bold 50px MachinaRegular' },
  { text: 'About me always, for stalking', font: 'bold 50px MachinaRegular' },
  { text: 'Myself blindly as a stranger in the night.', font: 'bold 50px MachinaRegular' },
];

class Particle {
  constructor(x, y, targetX, targetY) {
    this.x = x;
    this.y = y;
    this.size = 0.65; // particle size
    this.baseX = x;
    this.baseY = y;
    this.targetX = targetX;
    this.targetY = targetY;
    this.density = (Math.random() * 5) + 1;
    this.vx = (Math.random() - 0.5) * 10; // Faster horizontal velocity
    this.vy = (Math.random() - 0.5) * 10; // Faster vertical velocity
    this.directionChangeCounter = 0; // Counter to track direction changes
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }

  update(mouse) {
    if (!!isMouseClicked) {
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

      // Add jitter after forming the word
      if (Math.abs(dx) < 1 && Math.abs(dy) < 1) {
        this.x += (Math.random() - 0.5) * 1.5; // Change value for jitter
        this.y += (Math.random() - 0.5) * 1.5;
      }
    }
  }
}

function init() {
  particlesArray = [];
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Vertical spacing between lines
  const lineHeight = 75; // Adjust based on font size
  let verticalOffset = (canvas.height - (textLines.length * lineHeight)) / 2; // Center text vertically

  textLines.forEach((line, index) => {
    ctx.fillStyle = '#100e0e';
    ctx.font = line.font;
    const textWidth = ctx.measureText(line.text).width;
    const x = canvas.width / 2 - textWidth / 2; // Center text horizontally
    const y = verticalOffset + index * lineHeight;

    // Draw text to canvas to extract pixel data
    ctx.fillText(line.text, x, y);

    // Extract pixel data for the current line
    const textData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

    for (let yPos = 0; yPos < canvas.height; yPos += 3) { // Reduced spacing (from 5 to 3)
      for (let xPos = 0; xPos < canvas.width; xPos += 3) { // Reduced spacing (from 5 to 3)
        const alpha = textData[(yPos * canvas.width + xPos) * 4 + 3];
        if (alpha > 128) {
          const targetX = xPos;
          const targetY = yPos;
          const startX = Math.random() * canvas.width;
          const startY = Math.random() * canvas.height;
          particlesArray.push(new Particle(startX, startY, targetX, targetY));
        }
      }
    }
  });

  // Clear the canvas after extracting pixel data
  ctx.clearRect(0, 0, canvas.width, canvas.height);
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