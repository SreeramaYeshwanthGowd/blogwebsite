// Filter functionality for the technical blog

document.addEventListener('DOMContentLoaded', function() {
    const filterContainer = document.querySelector('.filter-container');
    const applyFiltersBtn = document.getElementById('apply-filters');
    
    if (filterContainer && applyFiltersBtn) {
        initializeFilters();
    }
});

function initializeFilters() {
    const applyFiltersBtn = document.getElementById('apply-filters');
    const filterCheckboxes = document.querySelectorAll('.filter-options input[type="checkbox"]');
    
    // Apply filters when button is clicked
    applyFiltersBtn.addEventListener('click', function() {
        const selectedFilters = getSelectedFilters();
        applyFilters(selectedFilters);
    });
    
    // Make filters collapsible on mobile
    const filterGroups = document.querySelectorAll('.filter-group h4');
    filterGroups.forEach(heading => {
        heading.addEventListener('click', function() {
            const options = this.nextElementSibling;
            options.classList.toggle('collapsed');
            this.classList.toggle('collapsed');
        });
    });
}

function getSelectedFilters() {
    const filters = {
        categories: [],
        date: []
    };
    
    // Get selected category filters
    const categoryCheckboxes = document.querySelectorAll('.filter-group:nth-child(1) input[type="checkbox"]:checked');
    categoryCheckboxes.forEach(checkbox => {
        filters.categories.push(checkbox.value);
    });
    
    // Get selected date filters
    const dateCheckboxes = document.querySelectorAll('.filter-group:nth-child(2) input[type="checkbox"]:checked');
    dateCheckboxes.forEach(checkbox => {
        filters.date.push(checkbox.value);
    });
    
    return filters;
}

function applyFilters(filters) {
    console.log('Applying filters:', filters);
    
    // Show loading state
    const articlesContainer = document.querySelector('.articles-container');
    if (articlesContainer) {
        articlesContainer.innerHTML = '<div class="loading">Filtering articles...</div>';
        
        // Simulate filter delay (would be an API call in production)
        setTimeout(() => {
            // Filter articles based on selected filters
            const filteredArticles = filterArticles(filters);
            
            // Update UI with filtered results
            updateArticlesDisplay(filteredArticles);
        }, 500);
    }
}

// Placeholder function for actual filter implementation
function filterArticles(filters) {
    // In a real implementation, this would query an API or filter through a local dataset
    // For now, we'll return mock data
    
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
        },
        {
            id: 4,
            title: 'ETL Pipelines with Databricks',
            excerpt: 'Building efficient ETL pipelines using Databricks and Apache Spark...',
            date: 'February 28, 2025',
            categories: ['data-engineering', 'databricks'],
            image: 'images/placeholder.jpg'
        },
        {
            id: 5,
            title: 'Data Warehousing Best Practices',
            excerpt: 'Modern approaches to data warehousing for analytics and business intelligence...',
            date: 'February 20, 2025',
            categories: ['data-warehousing', 'data-engineering'],
            image: 'images/placeholder.jpg'
        },
        {
            id: 6,
            title: 'CI/CD for ML Systems',
            excerpt: 'Implementing continuous integration and deployment for machine learning systems...',
            date: 'February 15, 2025',
            categories: ['mlops', 'ci-cd'],
            image: 'images/placeholder.jpg'
        },
        {
            id: 7,
            title: 'Technical Documentation Strategies',
            excerpt: 'Best practices for creating and maintaining technical documentation...',
            date: 'February 10, 2025',
            categories: ['documentation', 'best-practices'],
            image: 'images/placeholder.jpg'
        }
    ];
    
    // If no filters are selected, return all articles
    if (filters.categories.length === 0 && filters.date.length === 0) {
        return allArticles;
    }
    
    // Filter articles based on selected categories and dates
    return allArticles.filter(article => {
        // Category filter
        const categoryMatch = filters.categories.length === 0 || 
            article.categories.some(category => filters.categories.includes(category));
        
        // Date filter (simplified for demo)
        let dateMatch = true;
        if (filters.date.length > 0) {
            const articleDate = new Date(article.date);
            const currentDate = new Date();
            
            dateMatch = filters.date.some(dateFilter => {
                if (dateFilter === 'last-week') {
                    const lastWeek = new Date();
                    lastWeek.setDate(currentDate.getDate() - 7);
                    return articleDate >= lastWeek;
                } else if (dateFilter === 'last-month') {
                    const lastMonth = new Date();
                    lastMonth.setMonth(currentDate.getMonth() - 1);
                    return articleDate >= lastMonth;
                } else if (dateFilter === 'last-year') {
                    const lastYear = new Date();
                    lastYear.setFullYear(currentDate.getFullYear() - 1);
                    return articleDate >= lastYear;
                }
                return true;
            });
        }
        
        return categoryMatch && dateMatch;
    });
}

// Update the articles display with filtered results
function updateArticlesDisplay(articles) {
    const articlesContainer = document.querySelector('.articles-container');
    
    if (articlesContainer) {
        if (articles.length === 0) {
            articlesContainer.innerHTML = '<div class="no-results">No articles found matching your filters.</div>';
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
