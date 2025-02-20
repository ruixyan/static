document.addEventListener('DOMContentLoaded', () => {
  // Main Canvas Setup
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Cursor Setup
  document.addEventListener("mousemove", (e) => {
      const cursor = document.querySelector(".cursor");
      cursor.style.top = e.pageY + "px";
      cursor.style.left = e.pageX + "px";
  });

  const button = document.getElementById("particleButton"); // Corrected selector
  const author = document.querySelector(".author");

  if (button) {
      button.addEventListener('mouseover', () => {
          const cursor = document.querySelector('.cursor');
          cursor.style.transform = 'scale(4)'; // Scale up
      });

      button.addEventListener('mouseout', () => {
          const cursor = document.querySelector('.cursor');
          cursor.style.transform = 'scale(1)'; // Reset to original size
      });
  } else {
      console.error("Button element not found!");
  }

  // Main Particle System
  let particlesArray = [];
  const mouse = { x: null, y: null, radius: 100 }; // Mouse interaction radius
  let isMouseClicked = false;

  class MainParticle {
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
          ctx.fillStyle = '#F2F0EF';
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

              var delayInMilliseconds = 5000; // 5 seconds

              setTimeout(function () {
                  author.style.display = 'block';
                  button.style.display = 'block'; // Show the button
              }, delayInMilliseconds);

              // Add jitter after forming the word
              if (Math.abs(dx) < 1 && Math.abs(dy) < 1) {
                  this.x += (Math.random() - 0.5) * 3; // change value
                  this.y += (Math.random() - 0.5) * 3;
              }
          }
      }
  }

  // Initialize Main Particle System
  function init() {
      particlesArray = [];
      const text = 'static';
      ctx.fillStyle = '#F2F0EF';
      ctx.font = 0.2 * window.innerWidth + "px MachinaBold";
      ctx.fillText(text, canvas.width / 2 - ctx.measureText(text).width / 2, canvas.height / 2);

      const textData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let y = 0; y < canvas.height; y += 3) {
          for (let x = 0; x < canvas.width; x += 3) {
              const alpha = textData[(y * canvas.width + x) * 4 + 3];
              if (alpha > 128) {
                  const targetX = x;
                  const targetY = y;
                  const startX = Math.random() * canvas.width;
                  const startY = Math.random() * canvas.height;
                  particlesArray.push(new MainParticle(startX, startY, targetX, targetY));
              }
          }
      }
  }

  // Animate Main Particle System
  function animateMain() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesArray.forEach(particle => {
          particle.update(mouse);
          particle.draw();
      });
      requestAnimationFrame(animateMain);
  }

  // Circular Particle Button Setup
  const buttonCanvas = document.getElementById('particleButton');
  if (!buttonCanvas) {
      console.error("Button canvas not found!");
      return;
  }
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
          this.color = "#F2F0EF"; // Set particle color to white
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

  // Perlin noise function
  function noise(offset) {
      return Math.sin(offset) * 0.5 + 0.5; // Simple sine-based noise
  }

  // Initialize Button Particles
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

  // Animate Button Particles
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