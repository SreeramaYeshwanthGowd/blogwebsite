// Main JavaScript file for the technical blog

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeComponents();
    
    // Setup event listeners
    setupEventListeners();
    
    // Load initial content
    loadInitialContent();
});

// Initialize all components
function initializeComponents() {
    console.log('Initializing components...');
    
    // Initialize mobile menu
    const header = document.querySelector('header');
    if (header && window.innerWidth <= 768) {
        const mobileMenuToggle = document.createElement('button');
        mobileMenuToggle.className = 'mobile-menu-toggle';
        mobileMenuToggle.innerHTML = '&#9776;';
        mobileMenuToggle.setAttribute('aria-label', 'Toggle navigation menu');
        
        const logo = header.querySelector('.logo');
        if (logo) {
            header.insertBefore(mobileMenuToggle, logo.nextSibling);
        }
    }
    
    // Initialize article cards
    const articleCards = document.querySelectorAll('.article-card');
    articleCards.forEach(card => {
        // Add hover effect
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.2)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    });
}

// Setup event listeners
function setupEventListeners() {
    console.log('Setting up event listeners...');
    
    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    if (mobileMenuToggle) {
        const navMenu = document.querySelector('nav ul');
        
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
    
    // Load more button
    const loadMoreButton = document.getElementById('load-more');
    if (loadMoreButton) {
        loadMoreButton.addEventListener('click', function() {
            loadMoreArticles();
        });
    }
    
    // Contact form submission
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleContactFormSubmission();
        });
    }
}

// Load initial content
function loadInitialContent() {
    console.log('Loading initial content...');
    
    // Simulate loading articles
    const articlesContainer = document.querySelector('.articles-container');
    if (articlesContainer) {
        // Articles are already loaded in HTML
        console.log('Articles loaded successfully');
    }
}

// Load more articles
function loadMoreArticles() {
    console.log('Loading more articles...');
    
    // Show loading indicator
    const pagination = document.querySelector('.pagination');
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'loading';
    loadingIndicator.textContent = 'Loading more articles...';
    
    if (pagination) {
        pagination.insertBefore(loadingIndicator, document.getElementById('load-more'));
        document.getElementById('load-more').style.display = 'none';
    }
    
    // Simulate loading delay
    setTimeout(function() {
        // Create new articles
        const articlesContainer = document.querySelector('.articles-container');
        
        if (articlesContainer) {
            // Add new articles
            const newArticles = [
                {
                    id: 7,
                    title: 'Technical Documentation Strategies',
                    excerpt: 'Best practices for creating and maintaining technical documentation for software projects and APIs.',
                    date: 'February 10, 2025',
                    categories: ['documentation', 'best-practices'],
                    image: 'images/placeholder.jpg'
                },
                {
                    id: 8,
                    title: 'Data Mesh Architecture',
                    excerpt: 'Exploring the data mesh architectural pattern for scalable and domain-oriented data platforms.',
                    date: 'February 5, 2025',
                    categories: ['data-engineering', 'architecture'],
                    image: 'images/placeholder.jpg'
                },
                {
                    id: 9,
                    title: 'Feature Engineering for ML',
                    excerpt: 'Advanced techniques for feature engineering to improve machine learning model performance.',
                    date: 'January 28, 2025',
                    categories: ['machine-learning', 'data-science'],
                    image: 'images/placeholder.jpg'
                }
            ];
            
            // Add new articles to container
            newArticles.forEach(article => {
                const articleElement = document.createElement('article');
                articleElement.className = 'article-card';
                articleElement.setAttribute('data-category', article.categories.join(','));
                articleElement.setAttribute('data-id', article.id);
                articleElement.setAttribute('itemscope', '');
                articleElement.setAttribute('itemtype', 'http://schema.org/BlogPosting');
                
                articleElement.innerHTML = `
                    <div class="article-image">
                        <img src="${article.image}" alt="${article.title}" itemprop="image">
                    </div>
                    <div class="article-content">
                        <h2 itemprop="headline">${article.title}</h2>
                        <p class="article-meta" itemprop="datePublished">Published: ${article.date}</p>
                        <p class="article-excerpt" itemprop="description">${article.excerpt}</p>
                        <a href="#" class="read-more" itemprop="url">Read More</a>
                    </div>
                    <meta itemprop="author" content="Technical Blog">
                    <meta itemprop="keywords" content="${article.categories.join(', ')}">
                `;
                
                articlesContainer.appendChild(articleElement);
                
                // Add animation
                setTimeout(() => {
                    articleElement.style.opacity = '1';
                }, 100);
            });
            
            // Remove loading indicator
            loadingIndicator.remove();
            
            // Update load more button
            document.getElementById('load-more').style.display = 'inline-block';
            document.getElementById('load-more').textContent = 'No More Articles';
            document.getElementById('load-more').disabled = true;
        }
    }, 1500);
}

// Handle contact form submission
function handleContactFormSubmission() {
    const form = document.querySelector('.contact-form');
    const submitButton = form.querySelector('.submit-button');
    
    // Disable button and show loading state
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';
    
    // Simulate form submission
    setTimeout(function() {
        // Show success message
        const successMessage = document.createElement('div');
        successMessage.className = 'form-success';
        successMessage.textContent = 'Your message has been sent successfully!';
        
        form.innerHTML = '';
        form.appendChild(successMessage);
    }, 1500);
}
