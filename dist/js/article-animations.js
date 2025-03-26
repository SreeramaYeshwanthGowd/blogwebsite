// JavaScript for article animations and interactive elements
document.addEventListener('DOMContentLoaded', function() {
    // Add reading progress bar
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    document.body.appendChild(progressBar);
    
    // Add back to top button
    const backToTopButton = document.createElement('div');
    backToTopButton.className = 'back-to-top';
    backToTopButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8 12a.5.5 0 0 0 .5-.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 .5.5z"/></svg>';
    document.body.appendChild(backToTopButton);
    
    // Update reading progress on scroll
    window.addEventListener('scroll', function() {
        // Update reading progress
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercentage = (scrollTop / scrollHeight) * 100;
        progressBar.style.width = scrollPercentage + '%';
        
        // Show/hide back to top button
        if (scrollTop > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });
    
    // Scroll to top when back to top button is clicked
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Add chart functionality when article modal is opened
    document.addEventListener('articleOpened', function(e) {
        setTimeout(initializeCharts, 1000); // Wait for article content to load
    });
    
    // Initialize interactive charts
    function initializeCharts() {
        const chartContainers = document.querySelectorAll('.chart-container');
        
        if (chartContainers.length === 0) {
            // If no chart containers exist in the article, create one for demo
            createDemoChart();
        } else {
            // Initialize existing charts
            chartContainers.forEach(container => {
                const canvas = container.querySelector('canvas');
                if (canvas) {
                    initializeChart(canvas);
                }
            });
        }
    }
    
    // Create a demo chart if none exists
    function createDemoChart() {
        const articleContent = document.querySelector('.article-full-content');
        if (!articleContent) return;
        
        // Find a good position to insert the chart (after the first few paragraphs)
        const paragraphs = articleContent.querySelectorAll('p');
        if (paragraphs.length >= 3) {
            const chartContainer = document.createElement('div');
            chartContainer.className = 'chart-container';
            chartContainer.innerHTML = `
                <h4>Technology Adoption Trends</h4>
                <canvas id="demoChart" width="400" height="250"></canvas>
            `;
            
            // Insert after the third paragraph
            paragraphs[2].insertAdjacentElement('afterend', chartContainer);
            
            // Initialize the chart
            const canvas = chartContainer.querySelector('canvas');
            initializeChart(canvas);
        }
    }
    
    // Initialize a chart with Chart.js
    function initializeChart(canvas) {
        if (!canvas || typeof Chart === 'undefined') {
            // Load Chart.js if not available
            loadChartJs().then(() => {
                if (canvas) initializeChartWithData(canvas);
            });
        } else {
            initializeChartWithData(canvas);
        }
    }
    
    // Load Chart.js dynamically
    function loadChartJs() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }
    
    // Initialize chart with sample data
    function initializeChartWithData(canvas) {
        const ctx = canvas.getContext('2d');
        
        // Sample data
        const data = {
            labels: ['AI/ML', 'Cloud Computing', 'Edge Computing', 'Blockchain', 'IoT', 'AR/VR'],
            datasets: [{
                label: 'Current Adoption',
                data: [65, 78, 42, 30, 55, 25],
                backgroundColor: 'rgba(108, 99, 255, 0.2)',
                borderColor: 'rgba(108, 99, 255, 1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(108, 99, 255, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(108, 99, 255, 1)'
            }, {
                label: 'Projected Growth (Next 2 Years)',
                data: [85, 90, 68, 45, 75, 60],
                backgroundColor: 'rgba(77, 163, 255, 0.2)',
                borderColor: 'rgba(77, 163, 255, 1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(77, 163, 255, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(77, 163, 255, 1)'
            }]
        };
        
        // Chart options
        const options = {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    angleLines: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    pointLabels: {
                        color: '#b0b7c9',
                        font: {
                            family: "'IBM Plex Mono', monospace",
                            size: 12
                        }
                    },
                    ticks: {
                        color: '#b0b7c9',
                        backdropColor: 'transparent'
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#b0b7c9',
                        font: {
                            family: "'IBM Plex Mono', monospace"
                        },
                        padding: 20
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(10, 10, 20, 0.9)',
                    titleColor: '#ffffff',
                    bodyColor: '#b0b7c9',
                    borderColor: 'rgba(108, 99, 255, 0.5)',
                    borderWidth: 1,
                    titleFont: {
                        family: "'IBM Plex Mono', monospace",
                        weight: 'bold'
                    },
                    bodyFont: {
                        family: "'IBM Plex Mono', monospace"
                    },
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.raw + '%';
                        }
                    }
                }
            }
        };
        
        // Create radar chart
        new Chart(ctx, {
            type: 'radar',
            data: data,
            options: options
        });
        
        // Add animation to chart container
        canvas.closest('.chart-container').classList.add('interactive-element');
    }
    
    // Add scroll-triggered animations to elements
    function initializeScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });
        
        // Observe elements that should animate on scroll
        document.querySelectorAll('.article-card, .filter-dropdown, .hero h1, .hero p').forEach(el => {
            observer.observe(el);
        });
    }
    
    // Initialize scroll animations
    initializeScrollAnimations();
    
    // Add custom tooltip functionality
    function initializeTooltips() {
        const tooltip = document.createElement('div');
        tooltip.className = 'chart-tooltip';
        tooltip.style.display = 'none';
        document.body.appendChild(tooltip);
        
        // Add tooltips to interactive elements
        document.querySelectorAll('.interactive-element').forEach(el => {
            el.addEventListener('mouseenter', (e) => {
                const tooltipText = el.getAttribute('data-tooltip');
                if (tooltipText) {
                    tooltip.textContent = tooltipText;
                    tooltip.style.display = 'block';
                    
                    // Position tooltip
                    const rect = el.getBoundingClientRect();
                    tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
                    tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
                }
            });
            
            el.addEventListener('mouseleave', () => {
                tooltip.style.display = 'none';
            });
        });
    }
    
    // Initialize tooltips
    initializeTooltips();
});
