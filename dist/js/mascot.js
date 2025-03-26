// Mascot implementation
document.addEventListener('DOMContentLoaded', function() {
    // Create mascot elements if they don't exist
    if (!document.querySelector('.mascot-container')) {
        createMascot();
    }
    
    // Initialize mascot behavior
    initMascotBehavior();
});

// Create mascot elements
function createMascot() {
    // Create container
    const container = document.createElement('div');
    container.className = 'mascot-container';
    
    // Create mascot
    const mascot = document.createElement('div');
    mascot.className = 'mascot';
    
    // Create mascot icon (fox)
    const mascotIcon = document.createElement('div');
    mascotIcon.className = 'mascot-icon';
    mascotIcon.innerHTML = `
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L6 7L4 20L12 22L20 20L18 7L12 2Z" fill="#FFA500"/>
            <path d="M12 2L6 7H18L12 2Z" fill="#FF7800"/>
            <circle cx="9" cy="12" r="1" fill="#000"/>
            <circle cx="15" cy="12" r="1" fill="#000"/>
            <path d="M10 15C10.5 15.5 11.5 16 12 16C12.5 16 13.5 15.5 14 15" stroke="#000" stroke-width="0.5" stroke-linecap="round"/>
        </svg>
    `;
    
    // Create message bubble
    const bubble = document.createElement('div');
    bubble.className = 'mascot-bubble';
    bubble.innerHTML = `
        <p>Hi there! I'm your reading companion. Need help finding something interesting?</p>
        <button class="close-bubble">Close</button>
    `;
    
    // Assemble mascot
    mascot.appendChild(mascotIcon);
    container.appendChild(mascot);
    container.appendChild(bubble);
    
    // Add to body
    document.body.appendChild(container);
}

// Initialize mascot behavior
function initMascotBehavior() {
    const mascot = document.querySelector('.mascot');
    const bubble = document.querySelector('.mascot-bubble');
    
    if (mascot && bubble) {
        // Toggle bubble on mascot click
        mascot.addEventListener('click', function() {
            bubble.classList.toggle('active');
        });
        
        // Close bubble when close button is clicked
        const closeButton = bubble.querySelector('.close-bubble');
        if (closeButton) {
            closeButton.addEventListener('click', function(e) {
                e.stopPropagation();
                bubble.classList.remove('active');
            });
        }
        
        // Show mascot on scroll
        let lastScrollTop = 0;
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Show mascot when scrolling down
            if (scrollTop > lastScrollTop) {
                document.querySelector('.mascot-container').style.opacity = '1';
                document.querySelector('.mascot-container').style.transform = 'translateY(0)';
            }
            
            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        });
    }
}
