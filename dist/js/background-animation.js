// 3D Background Animation
document.addEventListener('DOMContentLoaded', function() {
    // Create canvas element if it doesn't exist
    let canvas = document.getElementById('background-canvas');
    if (!canvas) {
        const backgroundDiv = document.createElement('div');
        backgroundDiv.className = 'background-animation';
        
        canvas = document.createElement('canvas');
        canvas.id = 'background-canvas';
        
        backgroundDiv.appendChild(canvas);
        document.body.appendChild(backgroundDiv);
    }
    
    // Set up canvas and context
    const ctx = canvas.getContext('2d');
    
    // Make canvas full screen
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Configuration
    const config = {
        particleCount: 50,
        connectionDistance: 150,
        moveSpeed: 0.5,
        lineOpacity: 0.15,
        particleColor: '#6c63ff',
        lineColor: '#6c63ff'
    };
    
    // Particle class
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * config.moveSpeed;
            this.vy = (Math.random() - 0.5) * config.moveSpeed;
            this.radius = Math.random() * 2 + 1;
        }
        
        update() {
            // Move particle
            this.x += this.vx;
            this.y += this.vy;
            
            // Bounce off edges
            if (this.x < 0 || this.x > canvas.width) {
                this.vx = -this.vx;
            }
            
            if (this.y < 0 || this.y > canvas.height) {
                this.vy = -this.vy;
            }
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = config.particleColor;
            ctx.fill();
        }
    }
    
    // Create particles
    const particles = [];
    for (let i = 0; i < config.particleCount; i++) {
        particles.push(new Particle());
    }
    
    // Animation loop
    function animate() {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw particles
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        // Draw connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < config.connectionDistance) {
                    // Calculate opacity based on distance
                    const opacity = config.lineOpacity * (1 - distance / config.connectionDistance);
                    
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(108, 99, 255, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
        
        // Request next frame
        requestAnimationFrame(animate);
    }
    
    // Handle window resize
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
    
    // Start animation
    animate();
});
