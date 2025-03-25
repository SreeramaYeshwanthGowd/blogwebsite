// Enhanced search functionality with real-time results
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const articlesContainer = document.querySelector('.articles-container');
    
    // Create search results container
    const searchResults = document.createElement('div');
    searchResults.className = 'search-results';
    document.querySelector('.search-container').appendChild(searchResults);
    
    // Initialize search index
    const searchIndex = [];
    
    // Build search index from articles
    function buildSearchIndex() {
        const articles = document.querySelectorAll('.article-card');
        
        articles.forEach(article => {
            const id = article.getAttribute('data-id');
            const title = article.querySelector('h2').textContent;
            const excerpt = article.querySelector('.article-excerpt').textContent;
            const categories = article.getAttribute('data-category').split(',');
            
            searchIndex.push({
                id,
                title,
                excerpt,
                categories,
                element: article
            });
        });
    }
    
    // Perform search
    function performSearch(query) {
        if (!query || query.trim() === '') {
            hideSearchResults();
            return;
        }
        
        query = query.toLowerCase().trim();
        
        // Filter articles based on search query
        const results = searchIndex.filter(item => {
            return (
                item.title.toLowerCase().includes(query) ||
                item.excerpt.toLowerCase().includes(query) ||
                item.categories.some(category => category.toLowerCase().includes(query))
            );
        });
        
        displaySearchResults(results, query);
    }
    
    // Display search results
    function displaySearchResults(results, query) {
        searchResults.innerHTML = '';
        
        if (results.length === 0) {
            searchResults.innerHTML = `
                <div class="no-results">
                    No results found for "${query}"
                </div>
            `;
            searchResults.classList.add('active');
            return;
        }
        
        results.forEach(result => {
            const resultItem = document.createElement('div');
            resultItem.className = 'search-result-item';
            
            // Highlight matching text in title and excerpt
            const highlightedTitle = highlightText(result.title, query);
            const highlightedExcerpt = highlightText(result.excerpt, query);
            
            resultItem.innerHTML = `
                <div class="search-result-title">${highlightedTitle}</div>
                <div class="search-result-excerpt">${highlightedExcerpt}</div>
            `;
            
            // Add click event to navigate to article
            resultItem.addEventListener('click', () => {
                // Find the read more link in the article and trigger its click event
                const readMoreLink = result.element.querySelector('.read-more');
                if (readMoreLink) {
                    readMoreLink.click();
                }
                hideSearchResults();
            });
            
            searchResults.appendChild(resultItem);
        });
        
        // Force display of search results
        searchResults.style.display = 'block';
        searchResults.classList.add('active');
    }
    
    // Highlight matching text
    function highlightText(text, query) {
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }
    
    // Hide search results
    function hideSearchResults() {
        searchResults.classList.remove('active');
        searchResults.style.display = 'none';
    }
    
    // Event listeners
    searchInput.addEventListener('input', () => {
        performSearch(searchInput.value);
    });
    
    searchButton.addEventListener('click', (e) => {
        e.preventDefault();
        performSearch(searchInput.value);
    });
    
    // Close search results when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-container')) {
            hideSearchResults();
        }
    });
    
    // Handle keyboard navigation
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            performSearch(searchInput.value);
        } else if (e.key === 'Escape') {
            hideSearchResults();
        }
    });
    
    // Build search index on page load
    buildSearchIndex();
});
