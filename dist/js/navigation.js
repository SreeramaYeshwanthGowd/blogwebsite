// Navigation enhancement with smooth scrolling and active state tracking

document.addEventListener('DOMContentLoaded', function() {
    enhanceNavigation();
    setupArticleLinks();
});

function enhanceNavigation() {
    const navLinks = document.querySelectorAll('nav ul li a');
    
    // Add click event listeners to navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // If it's an anchor link (starts with #)
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    // Smooth scroll to target
                    smoothScrollTo(targetElement);
                    
                    // Update URL without page reload
                    history.pushState(null, null, this.getAttribute('href'));
                    
                    // Update active state
                    updateActiveNavLink(this);
                }
            }
        });
    });
    
    // Track scroll position to update active nav link
    window.addEventListener('scroll', debounce(function() {
        updateActiveNavOnScroll();
    }, 100));
    
    // Handle browser back/forward buttons
    window.addEventListener('popstate', function() {
        const hash = window.location.hash;
        if (hash) {
            const targetElement = document.querySelector(hash);
            if (targetElement) {
                smoothScrollTo(targetElement);
                
                // Update active state
                const correspondingLink = document.querySelector(`nav a[href="${hash}"]`);
                if (correspondingLink) {
                    updateActiveNavLink(correspondingLink);
                }
            }
        }
    });
}

// Setup article links for seamless navigation
function setupArticleLinks() {
    const articleLinks = document.querySelectorAll('.article-card .read-more');
    
    articleLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get article data
            const articleCard = this.closest('.article-card');
            const articleTitle = articleCard.querySelector('h2').textContent;
            
            // In a real implementation, this would navigate to the article page
            // For now, we'll simulate loading the article with a transition
            simulateArticleLoad(articleCard, articleTitle);
        });
    });
}

// Simulate article loading with transition
function simulateArticleLoad(articleCard, articleTitle) {
    // Add loading state to article card
    articleCard.classList.add('seamless-loading');
    
    // Show loading message
    const loadingMessage = document.createElement('div');
    loadingMessage.className = 'article-loading-message';
    loadingMessage.textContent = `Loading "${articleTitle}"...`;
    
    const articlesContainer = document.querySelector('.articles-container');
    if (articlesContainer) {
        articlesContainer.insertBefore(loadingMessage, articlesContainer.firstChild);
    }
    
    // Simulate loading delay
    setTimeout(() => {
        // In a real implementation, this would navigate to the article page
        // For now, we'll just show a message
        loadingMessage.textContent = `Article "${articleTitle}" would load here.`;
        loadingMessage.classList.add('article-loaded');
        
        // Remove loading state
        articleCard.classList.remove('seamless-loading');
    }, 1000);
}

// Smooth scroll to element
function smoothScrollTo(element) {
    const headerOffset = 80; // Adjust based on your header height
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
    
    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
    });
}

// Update active state of navigation links
function updateActiveNavLink(activeLink) {
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    activeLink.classList.add('active');
}

// Update active nav link based on scroll position
function updateActiveNavOnScroll() {
    // Get all sections that have an ID
    const sections = document.querySelectorAll('section[id]');
    
    // Find the section that's currently in view
    let currentSection = null;
    let minDistance = Number.MAX_VALUE;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const scrollPosition = window.scrollY + 100; // Add offset for header
        
        // Check if we're in or just past this section
        if (scrollPosition >= sectionTop && scrollPosition <= sectionTop + sectionHeight) {
            const distance = Math.abs(scrollPosition - sectionTop);
            if (distance < minDistance) {
                minDistance = distance;
                currentSection = section;
            }
        }
    });
    
    // Update active nav link
    if (currentSection) {
        const correspondingLink = document.querySelector(`nav a[href="#${currentSection.id}"]`);
        if (correspondingLink) {
            updateActiveNavLink(correspondingLink);
        }
    }
}

// Debounce function to limit how often a function is called
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(context, args);
        }, wait);
    };
}
