// Dropdown filter functionality for the technical blog
document.addEventListener('DOMContentLoaded', function() {
    const filterContainer = document.querySelector('.filter-container');
    
    if (filterContainer) {
        convertToDropdownFilters();
        initializeFilters();
    }
});

function convertToDropdownFilters() {
    const filterContainer = document.querySelector('.filter-container');
    const filterGroups = document.querySelectorAll('.filter-group');
    
    // Clear existing filter container
    const filterContainerHTML = filterContainer.innerHTML;
    filterContainer.innerHTML = '<h3>Filter Articles</h3>';
    
    // Create categories dropdown
    const categoriesDropdown = document.createElement('div');
    categoriesDropdown.className = 'filter-dropdown';
    categoriesDropdown.innerHTML = `
        <div class="filter-dropdown-header">
            <span class="filter-dropdown-title">Categories</span>
            <span class="filter-dropdown-icon">▼</span>
        </div>
        <div class="filter-dropdown-content">
            <div class="filter-option">
                <input type="checkbox" id="data-engineering" value="data-engineering">
                <label for="data-engineering">Data Engineering</label>
            </div>
            <div class="filter-option">
                <input type="checkbox" id="machine-learning" value="machine-learning">
                <label for="machine-learning">Machine Learning</label>
            </div>
            <div class="filter-option">
                <input type="checkbox" id="ai" value="ai">
                <label for="ai">Artificial Intelligence</label>
            </div>
            <div class="filter-option">
                <input type="checkbox" id="mlops" value="mlops">
                <label for="mlops">MLOps</label>
            </div>
            <div class="filter-option">
                <input type="checkbox" id="data-warehousing" value="data-warehousing">
                <label for="data-warehousing">Data Warehousing</label>
            </div>
            <div class="filter-option">
                <input type="checkbox" id="databricks" value="databricks">
                <label for="databricks">Databricks</label>
            </div>
            <div class="filter-option">
                <input type="checkbox" id="documentation" value="documentation">
                <label for="documentation">Documentation</label>
            </div>
            <div class="filter-actions">
                <button class="clear-filters">Clear</button>
                <button class="apply-filters">Apply</button>
            </div>
        </div>
    `;
    
    // Create date dropdown
    const dateDropdown = document.createElement('div');
    dateDropdown.className = 'filter-dropdown';
    dateDropdown.innerHTML = `
        <div class="filter-dropdown-header">
            <span class="filter-dropdown-title">Date</span>
            <span class="filter-dropdown-icon">▼</span>
        </div>
        <div class="filter-dropdown-content">
            <div class="filter-option">
                <input type="checkbox" id="last-week" value="last-week">
                <label for="last-week">Last Week</label>
            </div>
            <div class="filter-option">
                <input type="checkbox" id="last-month" value="last-month">
                <label for="last-month">Last Month</label>
            </div>
            <div class="filter-option">
                <input type="checkbox" id="last-year" value="last-year">
                <label for="last-year">Last Year</label>
            </div>
            <div class="filter-actions">
                <button class="clear-filters">Clear</button>
                <button class="apply-filters">Apply</button>
            </div>
        </div>
    `;
    
    // Add selected filters display
    const selectedFiltersContainer = document.createElement('div');
    selectedFiltersContainer.className = 'selected-filters';
    
    // Add apply filters button
    const applyFiltersBtn = document.createElement('button');
    applyFiltersBtn.id = 'apply-filters';
    applyFiltersBtn.textContent = 'Apply Filters';
    
    // Append all elements to filter container
    filterContainer.appendChild(categoriesDropdown);
    filterContainer.appendChild(dateDropdown);
    filterContainer.appendChild(selectedFiltersContainer);
    filterContainer.appendChild(applyFiltersBtn);
}

function initializeFilters() {
    const applyFiltersBtn = document.getElementById('apply-filters');
    const filterDropdowns = document.querySelectorAll('.filter-dropdown');
    const selectedFiltersContainer = document.querySelector('.selected-filters');
    
    // Toggle dropdown on header click
    filterDropdowns.forEach(dropdown => {
        const header = dropdown.querySelector('.filter-dropdown-header');
        header.addEventListener('click', () => {
            // Close other dropdowns
            filterDropdowns.forEach(d => {
                if (d !== dropdown && d.classList.contains('active')) {
                    d.classList.remove('active');
                }
            });
            
            // Toggle current dropdown
            dropdown.classList.toggle('active');
        });
        
        // Handle clear button
        const clearBtn = dropdown.querySelector('.clear-filters');
        if (clearBtn) {
            clearBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const checkboxes = dropdown.querySelectorAll('input[type="checkbox"]');
                checkboxes.forEach(checkbox => {
                    checkbox.checked = false;
                });
                updateSelectedFilters();
            });
        }
        
        // Handle apply button in dropdown
        const applyBtn = dropdown.querySelector('.apply-filters');
        if (applyBtn) {
            applyBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                dropdown.classList.remove('active');
                updateSelectedFilters();
                applyFilters(getSelectedFilters());
            });
        }
        
        // Handle checkbox changes
        const checkboxes = dropdown.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                updateSelectedFilters();
            });
        });
    });
    
    // Apply filters when main button is clicked
    applyFiltersBtn.addEventListener('click', function() {
        const selectedFilters = getSelectedFilters();
        applyFilters(selectedFilters);
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.filter-dropdown') && !e.target.closest('#apply-filters')) {
            filterDropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });
    
    // Update selected filters display
    function updateSelectedFilters() {
        selectedFiltersContainer.innerHTML = '';
        
        const allCheckboxes = document.querySelectorAll('.filter-dropdown input[type="checkbox"]:checked');
        allCheckboxes.forEach(checkbox => {
            const filterTag = document.createElement('div');
            filterTag.className = 'selected-filter';
            filterTag.innerHTML = `
                ${checkbox.nextElementSibling.textContent}
                <span class="remove-filter" data-id="${checkbox.id}">×</span>
            `;
            selectedFiltersContainer.appendChild(filterTag);
        });
        
        // Add event listeners to remove buttons
        const removeButtons = document.querySelectorAll('.remove-filter');
        removeButtons.forEach(button => {
            button.addEventListener('click', () => {
                const checkboxId = button.getAttribute('data-id');
                const checkbox = document.getElementById(checkboxId);
                if (checkbox) {
                    checkbox.checked = false;
                    updateSelectedFilters();
                }
            });
        });
    }
}

function getSelectedFilters() {
    const filters = {
        categories: [],
        date: []
    };
    
    // Get selected category filters
    const categoryDropdown = document.querySelector('.filter-dropdown:nth-child(1)');
    const categoryCheckboxes = categoryDropdown.querySelectorAll('input[type="checkbox"]:checked');
    categoryCheckboxes.forEach(checkbox => {
        filters.categories.push(checkbox.value);
    });
    
    // Get selected date filters
    const dateDropdown = document.querySelector('.filter-dropdown:nth-child(2)');
    const dateCheckboxes = dateDropdown.querySelectorAll('input[type="checkbox"]:checked');
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
                <div class="article-card" data-category="${article.categories.join(',')}" data-id="${article.id}">
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
        
        // Reattach event listeners to read more links
        const readMoreLinks = articlesContainer.querySelectorAll('.read-more');
        readMoreLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const articleId = this.closest('.article-card').getAttribute('data-id');
                openArticle(articleId);
            });
        });
    }
}

// Function to open article (placeholder)
function openArticle(articleId) {
    console.log('Opening article:', articleId);
    // This would be implemented to open the article modal
}
