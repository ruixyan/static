const button = document.getElementById('particleButton');
const ctx = button.getContext('2d');

button.width = 80;
button.height = 80;

const particlesArray = [];
const numParticles = 100;

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 1;
        this.speedX = Math.random() / 2;
        this.speedY = Math.random() / 2;
        this.color = "white"; // Set particle color to white
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Keep particles within the button bounds
        if (this.x < 0 || this.x > button.width) this.speedX *= -3;
        if (this.y < 0 || this.y > button.height ) this.speedY *= -3;

        else {
            this.x = Math.random() * button.width;
            this.y = Math.random() * button.height;
            this.size = 1;
        }
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function createParticles() {
    for (let i = 0; i < numParticles; i++) {
        const x = Math.random() * button.width;
        const y = Math.random() * button.height;
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

