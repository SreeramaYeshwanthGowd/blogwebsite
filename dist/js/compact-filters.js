// Compact dropdown filters functionality
document.addEventListener('DOMContentLoaded', function() {
    // Convert existing filter sidebar to compact dropdowns
    convertFiltersToDropdowns();
    
    // Initialize filter functionality
    initializeFilters();
    
    function convertFiltersToDropdowns() {
        const filterContainer = document.querySelector('.filter-container');
        if (!filterContainer) return;
        
        // Get existing filter groups
        const filterGroups = filterContainer.querySelectorAll('.filter-group');
        
        // Clear existing content
        filterContainer.innerHTML = '<h3>Filter Articles</h3>';
        
        // Create selected filters container
        const selectedFiltersContainer = document.createElement('div');
        selectedFiltersContainer.className = 'selected-filters';
        filterContainer.appendChild(selectedFiltersContainer);
        
        // Convert each filter group to dropdown
        filterGroups.forEach(group => {
            const title = group.querySelector('h4').textContent;
            const options = Array.from(group.querySelectorAll('label')).map(label => {
                const input = label.querySelector('input');
                return {
                    value: input.value,
                    text: label.textContent.trim(),
                    checked: input.checked
                };
            });
            
            createFilterDropdown(filterContainer, title, options);
        });
        
        // Add apply filters button
        const applyButton = document.createElement('button');
        applyButton.id = 'apply-filters';
        applyButton.textContent = 'Apply Filters';
        filterContainer.appendChild(applyButton);
    }
    
    function createFilterDropdown(container, title, options) {
        const dropdown = document.createElement('div');
        dropdown.className = 'filter-dropdown';
        
        // Create dropdown header
        const header = document.createElement('div');
        header.className = 'filter-dropdown-header';
        header.innerHTML = `
            <span class="filter-dropdown-title">${title}</span>
            <span class="filter-dropdown-icon">▼</span>
        `;
        
        // Create dropdown content
        const content = document.createElement('div');
        content.className = 'filter-dropdown-content';
        
        // Add options to dropdown
        options.forEach(option => {
            const optionElement = document.createElement('div');
            optionElement.className = 'filter-option';
            optionElement.innerHTML = `
                <input type="checkbox" id="${option.value}" value="${option.value}" ${option.checked ? 'checked' : ''}>
                <label for="${option.value}">${option.text}</label>
            `;
            content.appendChild(optionElement);
        });
        
        // Add filter actions
        const actions = document.createElement('div');
        actions.className = 'filter-actions';
        actions.innerHTML = `
            <button class="clear-filters">Clear</button>
            <button class="apply-filters">Apply</button>
        `;
        content.appendChild(actions);
        
        // Append elements to dropdown
        dropdown.appendChild(header);
        dropdown.appendChild(content);
        
        // Add dropdown to container
        container.appendChild(dropdown);
        
        // Add event listeners
        header.addEventListener('click', () => {
            dropdown.classList.toggle('active');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target)) {
                dropdown.classList.remove('active');
            }
        });
        
        // Handle clear button
        const clearButton = content.querySelector('.clear-filters');
        clearButton.addEventListener('click', (e) => {
            e.stopPropagation();
            const checkboxes = content.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(checkbox => {
                checkbox.checked = false;
            });
        });
        
        // Handle apply button
        const applyButton = content.querySelector('.apply-filters');
        applyButton.addEventListener('click', (e) => {
            e.stopPropagation();
            updateSelectedFilters();
            dropdown.classList.remove('active');
        });
    }
    
    function initializeFilters() {
        // Add event listener to main apply button
        const applyButton = document.getElementById('apply-filters');
        if (applyButton) {
            applyButton.addEventListener('click', applyFilters);
        }
        
        // Initialize selected filters display
        updateSelectedFilters();
    }
    
    function updateSelectedFilters() {
        const selectedFiltersContainer = document.querySelector('.selected-filters');
        if (!selectedFiltersContainer) return;
        
        // Clear existing selected filters
        selectedFiltersContainer.innerHTML = '';
        
        // Get all checked filters
        const checkedFilters = document.querySelectorAll('.filter-option input[type="checkbox"]:checked');
        
        // If no filters selected, leave container empty
        if (checkedFilters.length === 0) {
            return;
        }
        
        // Add each selected filter
        checkedFilters.forEach(filter => {
            const filterLabel = filter.nextElementSibling.textContent;
            const filterValue = filter.value;
            
            const selectedFilter = document.createElement('div');
            selectedFilter.className = 'selected-filter';
            selectedFilter.innerHTML = `
                ${filterLabel}
                <span class="remove-filter" data-value="${filterValue}">×</span>
            `;
            
            selectedFiltersContainer.appendChild(selectedFilter);
        });
        
        // Add event listeners to remove buttons
        const removeButtons = document.querySelectorAll('.remove-filter');
        removeButtons.forEach(button => {
            button.addEventListener('click', () => {
                const value = button.getAttribute('data-value');
                const checkbox = document.querySelector(`.filter-option input[value="${value}"]`);
                if (checkbox) {
                    checkbox.checked = false;
                    updateSelectedFilters();
                }
            });
        });
    }
    
    function applyFilters() {
        // Get all checked categories
        const selectedCategories = Array.from(
            document.querySelectorAll('.filter-option input[type="checkbox"]:checked')
        ).map(input => input.value);
        
        // Get all articles
        const articles = document.querySelectorAll('.article-card');
        
        // If no categories selected, show all articles
        if (selectedCategories.length === 0) {
            articles.forEach(article => {
                article.style.display = 'block';
            });
            return;
        }
        
        // Filter articles based on selected categories
        articles.forEach(article => {
            const articleCategories = article.getAttribute('data-category').split(',');
            const hasMatchingCategory = articleCategories.some(category => 
                selectedCategories.includes(category)
            );
            
            article.style.display = hasMatchingCategory ? 'block' : 'none';
        });
    }
});
