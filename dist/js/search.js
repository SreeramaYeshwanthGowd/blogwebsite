// Search functionality for the technical blog

document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    
    if (searchInput && searchButton) {
        initializeSearch();
    }
});

function initializeSearch() {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    
    // Real-time search as user types (with debounce)
    let debounceTimer;
    searchInput.addEventListener('input', function() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            const query = this.value.trim();
            if (query.length >= 3) {
                performSearch(query);
            }
        }, 300); // 300ms debounce
    });
    
    // Search on button click
    searchButton.addEventListener('click', function() {
        const query = searchInput.value.trim();
        if (query.length > 0) {
            performSearch(query);
        }
    });
    
    // Search on Enter key
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const query = this.value.trim();
            if (query.length > 0) {
                performSearch(query);
            }
        }
    });
}

function performSearch(query) {
    console.log('Searching for:', query);
    
    // Show loading state
    const articlesContainer = document.querySelector('.articles-container');
    if (articlesContainer) {
        articlesContainer.innerHTML = '<div class="loading">Searching...</div>';
        
        // Simulate search delay (would be an API call in production)
        setTimeout(() => {
            // Filter articles based on search query
            // This is a placeholder for the actual search implementation
            const filteredArticles = searchArticles(query);
            
            // Update UI with search results
            updateArticlesDisplay(filteredArticles);
        }, 500);
    }
}

// Placeholder function for actual search implementation
function searchArticles(query) {
    // In a real implementation, this would query an API or search through a local dataset
    // For now, we'll return mock data
    
    // Convert query to lowercase for case-insensitive matching
    query = query.toLowerCase();
    
    // Mock articles data
    const allArticles = [
        {
            id: 1,
            title: 'Real-time Analytics',
            excerpt: 'Exploring the latest techniques in real-time data processing and analytics...',
            date: 'March 15, 2025',
            categories: ['data-engineering', 'real-time'],
            image: 'images/placeholder.jpg'
        },
        {
            id: 2,
            title: 'Machine Learning & MLOps',
            excerpt: 'Best practices for implementing machine learning operations in production...',
            date: 'March 10, 2025',
            categories: ['machine-learning', 'mlops'],
            image: 'images/placeholder.jpg'
        },
        {
            id: 3,
            title: 'Generative AI',
            excerpt: 'Exploring the capabilities and applications of generative AI models...',
            date: 'March 5, 2025',
            categories: ['ai', 'generative'],
            image: 'images/placeholder.jpg'
        }
    ];
    
    // Filter articles based on query
    return allArticles.filter(article => {
        return (
            article.title.toLowerCase().includes(query) ||
            article.excerpt.toLowerCase().includes(query) ||
            article.categories.some(cat => cat.toLowerCase().includes(query))
        );
    });
}

// Update the articles display with search results
function updateArticlesDisplay(articles) {
    const articlesContainer = document.querySelector('.articles-container');
    
    if (articlesContainer) {
        if (articles.length === 0) {
            articlesContainer.innerHTML = '<div class="no-results">No articles found matching your search.</div>';
            return;
        }
        
        let html = '';
        
        articles.forEach(article => {
            html += `
                <div class="article-card" data-category="${article.categories.join(',')}">
                    <div class="article-image">
                        <img src="${article.image}" alt="${article.title}">
                    </div>
                    <div class="article-content">
                        <h2>${article.title}</h2>
                        <p class="article-meta">Published: ${article.date}</p>
                        <p class="article-excerpt">${article.excerpt}</p>
                        <a href="#" class="read-more">Read More</a>
                    </div>
                </div>
            `;
        });
        
        articlesContainer.innerHTML = html;
    }
}
