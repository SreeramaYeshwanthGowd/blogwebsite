// Navigation functionality testing and fixes
document.addEventListener('DOMContentLoaded', function() {
    // Get all navigation links
    const navLinks = document.querySelectorAll('nav ul li a');
    
    // Add click event listeners to all navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // If link is not external (doesn't start with http)
            if (!this.href.startsWith('http')) {
                e.preventDefault();
                
                // Get the target section from the href
                const targetId = this.getAttribute('href').replace('#', '');
                
                // If it's the home link and we're not on the home page
                if (this.textContent.trim().toLowerCase() === 'home' && window.location.pathname !== '/') {
                    window.location.href = '/';
                    return;
                }
                
                // If target section exists, scroll to it
                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    // Smooth scroll to target section
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                    
                    // Update active state
                    navLinks.forEach(link => link.classList.remove('active'));
                    this.classList.add('active');
                    
                    // Update URL without page reload
                    history.pushState(null, null, `#${targetId}`);
                }
            }
        });
    });
    
    // Set active nav link based on current scroll position
    function setActiveNavOnScroll() {
        const scrollPosition = window.scrollY;
        
        // Get all sections that have IDs
        const sections = document.querySelectorAll('section[id]');
        
        // Find the current section
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Remove active class from all links
                navLinks.forEach(link => link.classList.remove('active'));
                
                // Add active class to corresponding nav link
                const correspondingLink = document.querySelector(`nav ul li a[href="#${sectionId}"]`);
                if (correspondingLink) {
                    correspondingLink.classList.add('active');
                }
            }
        });
    }
    
    // Listen for scroll events
    window.addEventListener('scroll', setActiveNavOnScroll);
    
    // Set active nav link on page load
    setActiveNavOnScroll();
    
    // Handle hash changes
    window.addEventListener('hashchange', function() {
        const hash = window.location.hash.substring(1);
        if (hash) {
            const targetSection = document.getElementById(hash);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
    
    // If there's a hash in the URL on page load, scroll to that section
    if (window.location.hash) {
        const hash = window.location.hash.substring(1);
        const targetSection = document.getElementById(hash);
        if (targetSection) {
            // Use setTimeout to ensure DOM is fully loaded
            setTimeout(() => {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    }
});
