document.addEventListener("DOMContentLoaded", () => {
  
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
  
  
  // Main Canvas Setup
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Cursor Setup
  const cursor = { x: null, y: null, radius: 50 }; // Cursor interaction radius
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
      this.directionChangeCounter = 0;
      this.directionChangeInterval = 50; // Change direction every 50 frames
      this.maxDistance = 5; // Maximum distance from target position
      this.isHovered = false; // Track if the particle is hovered
    }

    draw() {
      ctx.font = 0.015 * window.innerWidth + "px MachinaRegular";
      ctx.fillStyle = this.color;
      ctx.fillText(this.word, this.x, this.y);
    }

    update(mouse) {
      // Check if the cursor is near the particle
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < mouse.radius) {
        this.isHovered = true; // Particle is hovered
      } else {
        this.isHovered = false; // Particle is not hovered
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
          this.x = this.targetX + (Math.random() - 0.5) * 2; // Small random jitter
          this.y = this.targetY + (Math.random() - 0.5) * 2;
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
  canvas.addEventListener('click', () => {
    isAssembled = !isAssembled; // Toggle between assembled and scattered states
  });

  // Handle window resize
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
  });
});