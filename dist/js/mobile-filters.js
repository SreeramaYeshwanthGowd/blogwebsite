// Mobile-friendly sidebar filter functionality

document.addEventListener('DOMContentLoaded', function() {
    // Add sidebar toggle button for mobile
    const content = document.querySelector('.content .container');
    if (content) {
        // Create toggle button
        const toggleButton = document.createElement('button');
        toggleButton.className = 'sidebar-toggle';
        toggleButton.innerHTML = '&equiv;';
        toggleButton.setAttribute('aria-label', 'Toggle filters');
        document.body.appendChild(toggleButton);
        
        // Create close button for sidebar
        const sidebar = document.querySelector('.sidebar');
        if (sidebar) {
            const closeButton = document.createElement('button');
            closeButton.className = 'sidebar-close';
            closeButton.innerHTML = '&times;';
            closeButton.setAttribute('aria-label', 'Close filters');
            sidebar.prepend(closeButton);
            
            // Toggle sidebar on button click
            toggleButton.addEventListener('click', function() {
                sidebar.classList.add('active');
            });
            
            // Close sidebar on close button click
            closeButton.addEventListener('click', function() {
                sidebar.classList.remove('active');
            });
            
            // Close sidebar when clicking outside
            document.addEventListener('click', function(event) {
                if (!sidebar.contains(event.target) && event.target !== toggleButton) {
                    sidebar.classList.remove('active');
                }
            });
        }
    }
    
    // Make filter groups collapsible on mobile
    const filterGroups = document.querySelectorAll('.filter-group h4');
    filterGroups.forEach(heading => {
        // Add click event to toggle collapse
        heading.addEventListener('click', function() {
            const options = this.nextElementSibling;
            this.classList.toggle('collapsed');
            options.classList.toggle('collapsed');
        });
    });
    
    // Multi-select functionality for filters
    const filterCheckboxes = document.querySelectorAll('.filter-options input[type="checkbox"]');
    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            // Update visual indicator for selected filters
            updateSelectedFiltersCount();
        });
    });
});

// Update count of selected filters
function updateSelectedFiltersCount() {
    const filterGroups = document.querySelectorAll('.filter-group');
    
    filterGroups.forEach(group => {
        const heading = group.querySelector('h4');
        const checkboxes = group.querySelectorAll('input[type="checkbox"]:checked');
        
        // Remove existing count
        const existingCount = heading.querySelector('.selected-count');
        if (existingCount) {
            existingCount.remove();
        }
        
        // Add count if filters are selected
        if (checkboxes.length > 0) {
            const countSpan = document.createElement('span');
            countSpan.className = 'selected-count';
            countSpan.textContent = ` (${checkboxes.length})`;
            heading.appendChild(countSpan);
        }
    });
}
