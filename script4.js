const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

document.addEventListener("mousemove", (e) => {
  const cursor = document.querySelector(".cursor");
  cursor.style.top = e.pageY + "px";
  cursor.style.left = e.pageX + "px";
});

const button = document.getElementById("enterButton");

button.addEventListener('mouseover', () => {
  const cursor = document.querySelector('.cursor');
  cursor.style.transform = 'scale(4)'; // Scale up
});

button.addEventListener('mouseout', () => {
  const cursor = document.querySelector('.cursor');
  cursor.style.transform = 'scale(1)'; // Reset to original size
});
  

const text = "when language fails, as pretense,            do we refuse this arc forward, again, and        who needs us to determine  the haste?         i think about the future. we quarrel.         gaiety settles in the wards, and cruelty         the fingers of the lake, slowly abound.";
const words = text.split(' '); // Split text into words
const particles = [];
let isAssembled = false; // Track if the text is assembled

class WordParticle {
  constructor(word, targetX, targetY) {
    this.word = word;
    this.targetX = targetX; // Target x position for assembling
    this.targetY = targetY; // Target y position for assembling
    this.x = Math.random() * canvas.width; // Random initial x
    this.y = Math.random() * canvas.height; // Random initial y
    this.velocity = {
      x: (Math.random() - 0.5) * 40, // Random horizontal speed
      y: (Math.random() - 0.5) * 40, // Random vertical speed
    };
    this.color = '#fff';
  }

  draw() {
    ctx.font = 0.015 * window.innerWidth + "px MachinaRegular";
    ctx.fillStyle = this.color;
    ctx.fillText(this.word, this.x, this.y);
  }

  update() {
    if (!isAssembled) {
      // Random movement
      this.x += this.velocity.x;
      this.y += this.velocity.y;

      // Bounce off edges
      if (this.x < 0 || this.x > canvas.width) this.velocity.x *= -1;
      if (this.y < 0 || this.y > canvas.height) this.velocity.y *= -1;
    } else {
      // Move toward target position
      const dx = this.targetX - this.x;
      const dy = this.targetY - this.y;
      this.x += dx * 0.05; // Adjust speed of assembly
      this.y += dy * 0.05;


      // Add jitter after forming the word
      if (Math.abs(dx) < 1 && Math.abs(dy) < 1) {
        this.x += (Math.random() - 0.5) * 10; // Small random jitter
        this.y += (Math.random() - 0.5) * 10;
      }
    }
  }
}

function init() {
  particles.length = 0; // Clear existing particles

  const lineHeight = 0.04 * window.innerWidth; // Space between lines
  const wordSpacing = 0.05 * window.innerWidth; // Space between words
  let x = 0;
  let y = 0;

  // Calculate total width and height of the text block
  let maxLineWidth = 0;
  let totalHeight = 0;
  let currentLineWidth = 0;
  let currentLineHeight = lineHeight;

  words.forEach(word => {
    const wordWidth = ctx.measureText(word).width;

    // Wrap text to next line if it exceeds canvas width
    if (currentLineWidth + wordWidth > canvas.width - wordSpacing - 500) {
      maxLineWidth = Math.max(maxLineWidth, currentLineWidth);
      currentLineWidth = 0;
      totalHeight += currentLineHeight;
    }

    currentLineWidth += wordWidth + wordSpacing;
  });

  // Final adjustments for the last line
  maxLineWidth = Math.max(maxLineWidth, currentLineWidth);
  totalHeight += currentLineHeight;

  // Calculate starting position for centered text
  const startX = (canvas.width - maxLineWidth) / 4; // Center horizontally
  const startY = (canvas.height - totalHeight) / 4; // Center vertically

  x = startX;
  y = startY;

  // Create particles and calculate target positions
  words.forEach(word => {
    const wordWidth = ctx.measureText(word).width;

    // Wrap text to next line if it exceeds canvas width
    if (x + wordWidth > canvas.width - wordSpacing) {
      x = startX;
      y += lineHeight;
    }

    particles.push(new WordParticle(word, x, y));
    x += wordWidth + wordSpacing; // Add space between words
  });
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw and update all particles
  particles.forEach(particle => {
    particle.draw();
    particle.update();
  });

  requestAnimationFrame(animate);
}

init();
animate();

// Handle click to assemble text
canvas.addEventListener('click', () => {
  isAssembled = true;
});

// Handle window resize
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  init();
});