// Enhanced 3D background animation with interactive elements

document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('background-canvas');
    
    if (canvas) {
        initEnhancedBackgroundAnimation(canvas);
    }
});

function initEnhancedBackgroundAnimation(canvas) {
    const ctx = canvas.getContext('2d');
    const particles = [];
    const particleCount = 70; // Increased particle count for more visual interest
    let mouseX = 0;
    let mouseY = 0;
    let mouseRadius = 100;
    let animationIntensity = 0.5; // Controls the overall animation intensity
    
    // Set canvas to full window size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    // Initialize particles with varied properties
    function initParticles() {
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 2 + 1,
                color: getRandomColor(0.5), // Semi-transparent colors
                speedX: (Math.random() - 0.5) * animationIntensity,
                speedY: (Math.random() - 0.5) * animationIntensity,
                opacity: Math.random() * 0.5 + 0.1,
                connections: []
            });
        }
    }
    
    // Get random color from theme with opacity
    function getRandomColor(opacity = 1) {
        const colors = [
            [108, 99, 255],   // Purple
            [255, 120, 70],   // Orange
            [77, 163, 255],   // Blue
            [46, 204, 113],   // Green
            [255, 64, 136]    // Pink
        ];
        const color = colors[Math.floor(Math.random() * colors.length)];
        return `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${opacity})`;
    }
    
    // Draw particles and connections with depth effect
    function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw particles
        particles.forEach(particle => {
            // Update position with slight randomness for organic movement
            particle.x += particle.speedX + (Math.random() - 0.5) * 0.1;
            particle.y += particle.speedY + (Math.random() - 0.5) * 0.1;
            
            // Bounce off edges with slight damping
            if (particle.x < 0 || particle.x > canvas.width) {
                particle.speedX *= -0.95;
                particle.x = particle.x < 0 ? 0 : canvas.width;
            }
            
            if (particle.y < 0 || particle.y > canvas.height) {
                particle.speedY *= -0.95;
                particle.y = particle.y < 0 ? 0 : canvas.height;
            }
            
            // Mouse interaction - particles are attracted to mouse position
            const dx = mouseX - particle.x;
            const dy = mouseY - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < mouseRadius) {
                const force = (mouseRadius - distance) / mouseRadius;
                particle.speedX += dx * force * 0.02;
                particle.speedY += dy * force * 0.02;
                
                // Limit maximum speed
                const maxSpeed = 2;
                const currentSpeed = Math.sqrt(particle.speedX * particle.speedX + particle.speedY * particle.speedY);
                if (currentSpeed > maxSpeed) {
                    particle.speedX = (particle.speedX / currentSpeed) * maxSpeed;
                    particle.speedY = (particle.speedY / currentSpeed) * maxSpeed;
                }
            }
            
            // Apply slight friction to prevent excessive speeds
            particle.speedX *= 0.99;
            particle.speedY *= 0.99;
            
            // Draw particle with glow effect
            ctx.beginPath();
            const gradient = ctx.createRadialGradient(
                particle.x, particle.y, 0,
                particle.x, particle.y, particle.radius * 2
            );
            gradient.addColorStop(0, particle.color);
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            
            ctx.fillStyle = gradient;
            ctx.arc(particle.x, particle.y, particle.radius * 2, 0, Math.PI * 2);
            ctx.fill();
            
            // Reset connections
            particle.connections = [];
        });
        
        // Find and draw connections with depth effect
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                // Connect particles within a certain distance
                const maxDistance = 150;
                if (distance < maxDistance) {
                    particles[i].connections.push(j);
                    
                    // Calculate opacity based on distance
                    const opacity = 0.2 * (1 - distance / maxDistance);
                    
                    // Draw connection line with gradient
                    const gradient = ctx.createLinearGradient(
                        particles[i].x, particles[i].y,
                        particles[j].x, particles[j].y
                    );
                    
                    gradient.addColorStop(0, `rgba(255, 255, 255, ${opacity})`);
                    gradient.addColorStop(1, `rgba(255, 255, 255, ${opacity * 0.5})`);
                    
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = gradient;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
        
        requestAnimationFrame(drawParticles);
    }
    
    // Handle mouse interaction
    canvas.addEventListener('mousemove', function(e) {
        const rect = canvas.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
    });
    
    // Handle touch interaction for mobile
    canvas.addEventListener('touchmove', function(e) {
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        mouseX = e.touches[0].clientX - rect.left;
        mouseY = e.touches[0].clientY - rect.top;
    });
    
    // Reset mouse position when mouse leaves canvas
    canvas.addEventListener('mouseleave', function() {
        mouseX = canvas.width / 2;
        mouseY = canvas.height / 2;
    });
    
    // Initialize and start animation
    resizeCanvas();
    initParticles();
    drawParticles();
    
    // Handle window resize
    window.addEventListener('resize', function() {
        resizeCanvas();
    });
}
