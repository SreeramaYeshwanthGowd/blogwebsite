// Scroll-driven animations and interactive charts implementation
import Chart from 'chart.js/auto';

document.addEventListener('DOMContentLoaded', function() {
    // Add CSS link if not already present
    if (!document.querySelector('link[href="css/scroll-animations.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'css/scroll-animations.css';
        document.head.appendChild(link);
    }

    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize interactive charts
    initInteractiveCharts();
});

// Initialize scroll-driven animations
function initScrollAnimations() {
    // Find all article content
    const articles = document.querySelectorAll('.article-card');
    
    // Add animation classes to article elements
    articles.forEach((article, index) => {
        // Add different animation to each article
        const animations = ['fade-up', 'slide-left', 'slide-right', 'scale-in', 'rotate-in'];
        const animationClass = animations[index % animations.length];
        
        article.classList.add('animate-on-scroll');
        article.dataset.animation = animationClass;
        
        // Add staggered animations to article content
        const title = article.querySelector('h2');
        const meta = article.querySelector('.article-meta');
        const excerpt = article.querySelector('.article-excerpt');
        const readMore = article.querySelector('.read-more');
        
        if (title) title.classList.add('stagger-list');
        if (meta) meta.classList.add('stagger-list');
        if (excerpt) excerpt.classList.add('stagger-list');
        if (readMore) readMore.classList.add('pulse');
    });
    
    // Add chart containers to articles
    addChartContainers();
    
    // Check which elements are visible on page load
    checkVisibility();
    
    // Listen for scroll events
    window.addEventListener('scroll', debounce(checkVisibility, 10));
}

// Add chart containers to articles
function addChartContainers() {
    // Add chart containers to specific articles
    const dataArticles = [
        {
            id: '1',
            chartTitle: 'Real-time Data Processing Throughput',
            chartDescription: 'Comparison of throughput rates across different streaming platforms',
            chartType: 'bar'
        },
        {
            id: '2',
            chartTitle: 'ML Model Accuracy Over Time',
            chartDescription: 'Improvement in model accuracy with continuous training',
            chartType: 'line'
        },
        {
            id: '5',
            chartTitle: 'Data Warehouse Query Performance',
            chartDescription: 'Query execution time comparison across platforms',
            chartType: 'radar'
        }
    ];
    
    dataArticles.forEach(articleData => {
        const article = document.querySelector(`.article-card[data-id="${articleData.id}"]`);
        if (article) {
            const content = article.querySelector('.article-content');
            if (content) {
                const chartContainer = document.createElement('div');
                chartContainer.className = 'chart-container animate-on-scroll';
                chartContainer.innerHTML = `
                    <h3 class="chart-title">${articleData.chartTitle}</h3>
                    <p class="chart-description">${articleData.chartDescription}</p>
                    <canvas id="chart-${articleData.id}" width="400" height="200"></canvas>
                    <div class="chart-legend" id="legend-${articleData.id}"></div>
                `;
                
                // Insert chart after excerpt but before read more button
                const excerpt = content.querySelector('.article-excerpt');
                if (excerpt) {
                    excerpt.insertAdjacentElement('afterend', chartContainer);
                }
            }
        }
    });
}

// Initialize interactive charts
function initInteractiveCharts() {
    // Chart 1: Real-time Data Processing Throughput (Bar Chart)
    createBarChart('chart-1', 'legend-1');
    
    // Chart 2: ML Model Accuracy Over Time (Line Chart)
    createLineChart('chart-2', 'legend-2');
    
    // Chart 5: Data Warehouse Query Performance (Radar Chart)
    createRadarChart('chart-5', 'legend-5');
}

// Create bar chart
function createBarChart(canvasId, legendId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Data for real-time processing throughput
    const data = {
        labels: ['Kafka', 'Pulsar', 'Kinesis', 'Flink', 'Spark Streaming'],
        datasets: [{
            label: 'Throughput (MB/s)',
            data: [120, 98, 85, 110, 95],
            backgroundColor: [
                'rgba(108, 99, 255, 0.7)',
                'rgba(77, 163, 255, 0.7)',
                'rgba(255, 120, 70, 0.7)',
                'rgba(46, 204, 113, 0.7)',
                'rgba(255, 64, 136, 0.7)'
            ],
            borderColor: [
                'rgb(108, 99, 255)',
                'rgb(77, 163, 255)',
                'rgb(255, 120, 70)',
                'rgb(46, 204, 113)',
                'rgb(255, 64, 136)'
            ],
            borderWidth: 1
        }]
    };
    
    // Chart configuration
    const config = {
        type: 'bar',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            return `Throughput: ${context.raw} MB/s`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.7)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.7)'
                    }
                }
            },
            animation: {
                duration: 2000,
                easing: 'easeOutQuart'
            }
        }
    };
    
    // Create chart
    const chart = new Chart(ctx, config);
    
    // Create custom legend
    createCustomLegend(legendId, data.labels, data.datasets[0].backgroundColor);
    
    // Add interactivity
    canvas.addEventListener('mousemove', (e) => {
        const activePoints = chart.getElementsAtEventForMode(e, 'nearest', { intersect: true }, false);
        if (activePoints.length > 0) {
            canvas.style.cursor = 'pointer';
        } else {
            canvas.style.cursor = 'default';
        }
    });
    
    canvas.addEventListener('click', (e) => {
        const activePoints = chart.getElementsAtEventForMode(e, 'nearest', { intersect: true }, false);
        if (activePoints.length > 0) {
            const index = activePoints[0].index;
            alert(`${data.labels[index]}: ${data.datasets[0].data[index]} MB/s\nClick for more details about ${data.labels[index]} performance.`);
        }
    });
}

// Create line chart
function createLineChart(canvasId, legendId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Data for ML model accuracy over time
    const data = {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
        datasets: [
            {
                label: 'Model A',
                data: [65, 72, 78, 83, 85, 87],
                borderColor: 'rgb(108, 99, 255)',
                backgroundColor: 'rgba(108, 99, 255, 0.1)',
                tension: 0.4,
                fill: true
            },
            {
                label: 'Model B',
                data: [60, 68, 75, 81, 84, 90],
                borderColor: 'rgb(255, 120, 70)',
                backgroundColor: 'rgba(255, 120, 70, 0.1)',
                tension: 0.4,
                fill: true
            }
        ]
    };
    
    // Chart configuration
    const config = {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.raw}% accuracy`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    min: 50,
                    max: 100,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.7)'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.7)'
                    }
                }
            },
            animation: {
                duration: 2000,
                easing: 'easeOutQuart'
            }
        }
    };
    
    // Create chart
    const chart = new Chart(ctx, config);
    
    // Create custom legend
    createCustomLegend(legendId, data.datasets.map(d => d.label), data.datasets.map(d => d.borderColor));
    
    // Add interactivity - hover effect
    canvas.addEventListener('mousemove', (e) => {
        const activePoints = chart.getElementsAtEventForMode(e, 'nearest', { intersect: true }, false);
        if (activePoints.length > 0) {
            canvas.style.cursor = 'pointer';
        } else {
            canvas.style.cursor = 'default';
        }
    });
}

// Create radar chart
function createRadarChart(canvasId, legendId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Data for data warehouse query performance
    const data = {
        labels: ['Simple Queries', 'Complex Joins', 'Aggregations', 'Window Functions', 'Data Loading', 'Concurrency'],
        datasets: [
            {
                label: 'Snowflake',
                data: [90, 85, 95, 80, 88, 92],
                backgroundColor: 'rgba(108, 99, 255, 0.2)',
                borderColor: 'rgb(108, 99, 255)',
                pointBackgroundColor: 'rgb(108, 99, 255)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgb(108, 99, 255)'
            },
            {
                label: 'Redshift',
                data: [85, 78, 88, 90, 75, 80],
                backgroundColor: 'rgba(255, 120, 70, 0.2)',
                borderColor: 'rgb(255, 120, 70)',
                pointBackgroundColor: 'rgb(255, 120, 70)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgb(255, 120, 70)'
            },
            {
                label: 'BigQuery',
                data: [92, 80, 90, 85, 95, 85],
                backgroundColor: 'rgba(46, 204, 113, 0.2)',
                borderColor: 'rgb(46, 204, 113)',
                pointBackgroundColor: 'rgb(46, 204, 113)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgb(46, 204, 113)'
            }
        ]
    };
    
    // Chart configuration
    const config = {
        type: 'radar',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    titleColor: '#fff',
                    bodyColor: '#fff'
                }
            },
            scales: {
                r: {
                    angleLines: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    pointLabels: {
                        color: 'rgba(255, 255, 255, 0.7)'
                    },
                    ticks: {
                        backdropColor: 'transparent',
                        color: 'rgba(255, 255, 255, 0.7)'
                    }
                }
            },
            animation: {
                duration: 2000,
                easing: 'easeOutQuart'
            }
        }
    };
    
    // Create chart
    const chart = new Chart(ctx, config);
    
    // Create custom legend
    createCustomLegend(legendId, data.datasets.map(d => d.label), data.datasets.map(d => d.borderColor));
}

// Create custom legend
function createCustomLegend(legendId, labels, colors) {
    const legend = document.getElementById(legendId);
    if (!legend) return;
    
    legend.innerHTML = '';
    
    labels.forEach((label, index) => {
        const item = document.createElement('div');
        item.className = 'legend-item';
        
        const colorBox = document.createElement('div');
        colorBox.className = 'legend-color';
        colorBox.style.backgroundColor = colors[index];
        
        const text = document.createElement('span');
        text.textContent = label;
        
        item.appendChild(colorBox);
        item.appendChild(text);
        legend.appendChild(item);
    });
}

// Check which elements are visible in the viewport
function checkVisibility() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    elements.forEach(element => {
        if (isElementInViewport(element)) {
            // Add the animation class based on data attribute or default to visible
            const animationClass = element.dataset.animation || 'visible';
            element.classList.add(animationClass);
            element.classList.add('visible');
            
            // Handle staggered list items
            const staggerItems = element.querySelectorAll('.stagger-list > *');
            staggerItems.forEach(item => {
                item.classList.add('visible');
            });
        }
    });
}

// Check if element is in viewport
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.85 &&
        rect.bottom >= 0
    );
}

// Debounce function to limit scroll event firing
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
