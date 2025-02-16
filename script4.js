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

  // Text and Particles Setup
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
          this.x += (Math.random() - 0.5) * 8; // Small random jitter
          this.y += (Math.random() - 0.5) * 8;
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

  // Initialize the system
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

  // Simple Perlin noise function (can be replaced with a library like noisejs)
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