document.addEventListener("DOMContentLoaded", () => {
  // Main Canvas Setup
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Cursor Setup
  document.addEventListener("mousemove", (e) => {
    const cursor = document.querySelector(".cursor");
    cursor.style.top = e.pageY + "px";
    cursor.style.left = e.pageX + "px";
  });

  const button = document.getElementById("particleButton");

  button.addEventListener('mouseover', () => {
    const cursor = document.querySelector('.cursor');
    cursor.style.transform = 'scale(4)'; // Scale up
  });

  button.addEventListener('mouseout', () => {
    const cursor = document.querySelector('.cursor');
    cursor.style.transform = 'scale(1)'; // Reset to original size
  });

// Main Canvas Setup

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Cursor Setup
const cursor = { x: null, y: null, radius: 40 }; // Cursor interaction radius
document.addEventListener("mousemove", (e) => {
cursor.x = e.x;
cursor.y = e.y;
});

// Text and Particles Setup
const text = "when language fails, as pretense,            do we refuse this arc forward, again, and        who needs us to determine  the haste?         i think about the future. we quarrel.         gaiety settles in the wards, and cruelty         the fingers of the lake, slowly abound.";
const words = text.split(' '); // Split text into words
const particles = [];
let isAssembled = true; // Start with the text assembled

class WordParticle {
constructor(word, targetX, targetY) {
  this.word = word;
  this.targetX = targetX; // Target x position for assembling
  this.targetY = targetY; // Target y position for assembling
  this.x = targetX; // Start at the target position
  this.y = targetY; // Start at the target position
  this.velocity = {
    x: (Math.random() - 0.5) * 0.5, // Very slow horizontal speed
    y: (Math.random() - 0.5) * 0.5, // Very slow vertical speed
  };
  this.color = '#F2F0EF';
  this.alpha = 0.5; // Default opacity (50%)
  this.directionChangeCounter = 0;
  this.directionChangeInterval = 50; // Change direction every 50 frames
  this.maxDistance = 5; // Maximum distance from target position
  this.isHovered = false; // Track if the particle is hovered


}

draw() {
  ctx.font = 0.015 * window.innerWidth + "px MachinaRegular";
  ctx.globalAlpha = this.alpha; // Apply opacity
  ctx.fillStyle = this.color;
  ctx.fillText(this.word, this.x, this.y);
  ctx.globalAlpha = 1; // Reset global alpha for other drawings
}

update(mouse) {
  // Check if the cursor is near the particle
  const dx = mouse.x - this.x;
  const dy = mouse.y - this.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const cursor = document.querySelector('.cursor');

  if (distance < mouse.radius) {
    this.isHovered = true; // Particle is hovered
    this.alpha = 1; // Set opacity to 100% on hover
  } else {
    this.isHovered = false; // Particle is not hovered
    this.alpha = 0.5; // Reset opacity to 50% when not hovered
  }

  if (!isAssembled) {
    // Random movement
    if (!this.isHovered) {
      // Only move if not hovered
      this.x += this.velocity.x;
      this.y += this.velocity.y;

      // Change direction at a very slow rate
      this.directionChangeCounter++;
      if (this.directionChangeCounter > this.directionChangeInterval) {
        this.velocity.x = (Math.random() - 0.5) * 0.5; // Very slow horizontal speed
        this.velocity.y = (Math.random() - 0.5) * 0.5; // Very slow vertical speed
        this.directionChangeCounter = 0; // Reset counter
      }

      // Keep particles within a small radius of their target positions
      const dxTarget = this.targetX - this.x;
      const dyTarget = this.targetY - this.y;
      const distanceTarget = Math.sqrt(dxTarget * dxTarget + dyTarget * dyTarget);

      if (distanceTarget > this.maxDistance) {
        // Move particle back toward the target position
        this.x += dxTarget * 0.1;
        this.y += dyTarget * 0.1;
      }
    }
  } else {
    // Add subtle jitter while staying near the target position
    if (!this.isHovered) {
      // Only jitter if not hovered
      this.x = this.targetX + (Math.random() - 0.5) * 3; // Small random jitter
      this.y = this.targetY + (Math.random() - 0.5) * 3;
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
  particle.update(cursor);
  particle.draw();
});

requestAnimationFrame(animate);
}

// Initialize the system
init();
animate();

  // Handle click to scatter text
  // canvas.addEventListener('click', () => {
  //   isAssembled = !isAssembled; // Toggle between assembled and scattered states
  // });

  // Handle window resize
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
  });

  // Button Particle System
  const buttonCanvas = document.getElementById('particleButton');
  const buttonCtx = buttonCanvas.getContext('2d');

  buttonCanvas.width = 70;
  buttonCanvas.height = 70;

  const buttonParticlesArray = [];
  const numParticles = 150;

  // Define circular boundary
  const centerX = buttonCanvas.width / 2;
  const centerY = buttonCanvas.height / 2;
  const radius = Math.min(centerX, centerY) - 10; // Radius of the circular boundary

  class ButtonParticle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = 0.65;
      this.speedX = (Math.random() - 0.5) * 2; // Faster horizontal speed
      this.speedY = (Math.random() - 0.5) * 2; // Faster vertical speed
      this.color = "white"; // Set particle color to white
      this.noiseScale = 0.01; // Scale for Perlin noise
      this.noiseOffsetX = Math.random() * 1000; // Random offset for noise
      this.noiseOffsetY = Math.random() * 1000; // Random offset for noise
    }

    update() {
      // Add Perlin noise to the particle's speed for erratic movement
      const noiseX = noise(this.noiseOffsetX) * 2 - 1; // Noise value between -1 and 1
      const noiseY = noise(this.noiseOffsetY) * 2 - 1; // Noise value between -1 and 1

      this.speedX += noiseX * 0.1; // Apply noise to speed
      this.speedY += noiseY * 0.1; // Apply noise to speed

      // Update particle position
      this.x += this.speedX;
      this.y += this.speedY;

      // Calculate distance from the center
      const dx = this.x - centerX;
      const dy = this.y - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // If the particle goes outside the circular boundary, bring it back
      if (distance >= radius) {
        // Calculate the angle of the particle relative to the center
        const angle = Math.atan2(dy, dx);

        // Move the particle back to the edge of the boundary
        this.x = centerX + Math.cos(angle) * Math.random() * radius;
        this.y = centerY + Math.sin(angle) * Math.random() * radius;

        // Reverse the direction to simulate a bounce
        this.speedX *= -1;
        this.speedY *= -1;
      }

      // Update noise offsets
      this.noiseOffsetX += 0.01;
      this.noiseOffsetY += 0.01;
    }

    draw() {
      buttonCtx.fillStyle = this.color;
      buttonCtx.beginPath();
      buttonCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      buttonCtx.fill();
    }
  }

  // Perlin Noise function
  function noise(offset) {
    return Math.sin(offset) * 0.5 + 0.5; // Simple sine-based noise
  }

  function createButtonParticles() {
    for (let i = 0; i < numParticles; i++) {
      // Spawn particles randomly within the circular boundary
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * radius;
      const x = centerX + Math.cos(angle) * distance;
      const y = centerY + Math.sin(angle) * distance;
      buttonParticlesArray.push(new ButtonParticle(x, y));
    }
  }

  function animateButton() {
    buttonCtx.clearRect(0, 0, buttonCanvas.width, buttonCanvas.height);
    buttonParticlesArray.forEach(particle => {
      particle.update();
      particle.draw();
    });
    requestAnimationFrame(animateButton);
  }

  // Initialize Button Particles
  createButtonParticles();
  animateButton();
});