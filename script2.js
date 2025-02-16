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
  
window.sections = [...document.querySelectorAll('.section')];

document.body.style.background = window.sections[0].getAttribute('data-bg');

window.addEventListener('scroll', onScroll);

function onScroll() {

  const section = window.sections
    .map(section => {
      const el = section;
      const rect = el.getBoundingClientRect();
      return {el, rect};
    })
    .find(section => section.rect.bottom >= (window.innerHeight * 0.5));
  document.body.style.background = section.el.getAttribute('data-bg');
}


const ctx = button.getContext('2d');

button.width = 70;
button.height = 70;

const particlesArray = [];
const numParticles = 150;

// Define circular boundary
const centerX = button.width / 2;
const centerY = button.height / 2;
const radius = Math.min(centerX, centerY) - 10; // Radius of the circular boundary

class Particle {
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
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Simple Perlin noise function (can be replaced with a library like noisejs)
function noise(offset) {
    return Math.sin(offset) * 0.5 + 0.5; // Simple sine-based noise
}

function createParticles() {
    for (let i = 0; i < numParticles; i++) {
        // Spawn particles randomly within the circular boundary
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * radius;
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;
        particlesArray.push(new Particle(x, y));
    }
}

function handleParticles() {
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
    }
}

function animate() {
    ctx.clearRect(0, 0, button.width, button.height);
    handleParticles();
    requestAnimationFrame(animate);
}

// Initialize particles
createParticles();
animate();