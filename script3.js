document.addEventListener("DOMContentLoaded", () => {
  // Main Canvas Setup
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Cursor Setup
  const mainCursor = document.querySelector(".mainCursor");
  const cursor = document.querySelector(".spotlight");

  let mainCursorX = window.innerWidth / 2;
  let mainCursorY = window.innerHeight / 2;
  let cursorX = mainCursorX;
  let cursorY = mainCursorY;

  const lerpFactor = 0.05; // Controls the smoothness of the trailing effect (0.1 = 10% smoothing)

  document.addEventListener("mousemove", (e) => {
    // Update main cursor position
    mainCursorX = e.pageX;
    mainCursorY = e.pageY;
    mainCursor.style.top = mainCursorY + "px";
    mainCursor.style.left = mainCursorX + "px";
  });

  const button = document.getElementById("particleButton");

  button.addEventListener('mouseover', () => {
    mainCursor.style.transform = 'scale(4)'; // Scale up
  });

  button.addEventListener('mouseout', () => {
    cursor.style.transform = 'scale(1)'; // Reset to original size
    mainCursor.style.transform = 'scale(1)';
  });

  // Smoothing function for trailing cursor
  function lerp(start, end, factor) {
    return start + (end - start) * factor;
  }

  function animateCursors() {
    // Smoothly move the trailing cursor toward the main cursor
    cursorX = lerp(cursorX, mainCursorX, lerpFactor);
    cursorY = lerp(cursorY, mainCursorY, lerpFactor);

    // Update the trailing cursor position
    cursor.style.top = cursorY + "px";
    cursor.style.left = cursorX + "px";

    // Repeat the animation
    requestAnimationFrame(animateCursors);
  }

  // Start the cursor animation
  animateCursors();

  // Main Particle System
  let particlesArray = [];
  const mouse = { x: null, y: null, radius: 100 }; // Mouse interaction radius
  let isMouseClicked = false;

  // Function to calculate responsive font size
  function getResponsiveFontSize(baseSize) {
    const screenWidth = window.innerWidth;
    const minWidth = 320; // Minimum screen width (e.g., mobile)
    const maxWidth = 1200; // Maximum screen width (e.g., desktop)
    const minFontSize = baseSize * 0.7; // Minimum font size (60% of base size)
    const maxFontSize = baseSize; // Maximum font size (base size)

    // Calculate font size based on screen width
    if (screenWidth <= minWidth) return `${minFontSize}px`;
    if (screenWidth >= maxWidth) return `${maxFontSize}px`;
    return `${minFontSize + ((screenWidth - minWidth) / (maxWidth - minWidth)) * (maxFontSize - minFontSize)}px`;
  }

  // Define multiple lines of text
  const textLines = [
    { text: 'a candle melts and ', font: `bold ${getResponsiveFontSize(42)} MachinaRegular` },
    { text: 'fingers of the lake slowly abound.', font: `bold ${getResponsiveFontSize(42)} MachinaRegular` },
    { text: 'i need that request of light', font: `bold ${getResponsiveFontSize(42)} MachinaRegular` },
    { text: 'About me always, for stalking', font: `bold ${getResponsiveFontSize(42)} MachinaRegular` },
    { text: 'Myself blindly as a stranger in the night.', font: `bold ${getResponsiveFontSize(42)} MachinaRegular` },
  ];

  class MainParticle {
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
        this.x += dx / 18;
        this.y += dy / 18;

        // Add jitter after forming the word
        if (Math.abs(dx) < 1 && Math.abs(dy) < 1) {
          this.x += (Math.random() - 0.5) * 1.2; // Change value for jitter
          this.y += (Math.random() - 0.5) * 1.2;
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
            particlesArray.push(new MainParticle(startX, startY, targetX, targetY));
          }
        }
      }
    });

    // Clear the canvas after extracting pixel data
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function animateMain() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particlesArray.forEach(particle => {
      particle.update(mouse);
      particle.draw();
    });
    requestAnimationFrame(animateMain);
  }

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
      this.color = "black"; // Set particle color to white
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

  // Initialize Both Systems
  init();
  animateMain();
  createButtonParticles();
  animateButton();

  // Event Listeners
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
});