// SEO optimization and content structure improvements

document.addEventListener('DOMContentLoaded', function() {
    // Add skip to content link for accessibility
    addSkipToContentLink();
    
    // Improve heading structure
    improveHeadingStructure();
    
    // Add structured data for articles
    addArticleStructuredData();
    
    // Lazy load images for performance
    setupLazyLoading();
    
    // Add breadcrumbs for better navigation and SEO
    addBreadcrumbs();
});

// Add skip to content link for accessibility
function addSkipToContentLink() {
    const skipLink = document.createElement('a');
    skipLink.href = '#articles';
    skipLink.className = 'skip-to-content';
    skipLink.textContent = 'Skip to content';
    document.body.insertBefore(skipLink, document.body.firstChild);
}

// Improve heading structure for better SEO
function improveHeadingStructure() {
    // Ensure proper heading hierarchy
    const articleCards = document.querySelectorAll('.article-card');
    
    articleCards.forEach(card => {
        // Convert article cards to semantic article elements
        card.setAttribute('role', 'article');
        
        // Ensure proper heading levels
        const heading = card.querySelector('h2');
        if (heading) {
            // Add microdata for better SEO
            heading.setAttribute('itemprop', 'headline');
        }
        
        // Add publication date microdata
        const metaElement = card.querySelector('.article-meta');
        if (metaElement) {
            metaElement.setAttribute('itemprop', 'datePublished');
        }
        
        // Add description microdata
        const excerptElement = card.querySelector('.article-excerpt');
        if (excerptElement) {
            excerptElement.setAttribute('itemprop', 'description');
        }
    });
}

// Add structured data for articles
function addArticleStructuredData() {
    const articleCards = document.querySelectorAll('.article-card');
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "itemListElement": []
    };
    
    articleCards.forEach((card, index) => {
        const title = card.querySelector('h2').textContent;
        const excerpt = card.querySelector('.article-excerpt').textContent;
        const dateText = card.querySelector('.article-meta').textContent.replace('Published: ', '');
        const categories = card.getAttribute('data-category').split(',');
        const id = card.getAttribute('data-id');
        
        // Add to structured data
        structuredData.itemListElement.push({
            "@type": "ListItem",
            "position": index + 1,
            "item": {
                "@type": "BlogPosting",
                "headline": title,
                "description": excerpt,
                "datePublished": dateText,
                "keywords": categories.join(', '),
                "url": `https://technicalblog.com/article/${id}`
            }
        });
    });
    
    // Add structured data to page
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);
}

// Setup lazy loading for images
function setupLazyLoading() {
    const images = document.querySelectorAll('img');
    
    if ('loading' in HTMLImageElement.prototype) {
        // Browser supports native lazy loading
        images.forEach(img => {
            img.loading = 'lazy';
        });
    } else {
        // Fallback for browsers that don't support native lazy loading
        const lazyImages = Array.from(images);
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const lazyImage = entry.target;
                        lazyImage.src = lazyImage.dataset.src;
                        imageObserver.unobserve(lazyImage);
                    }
                });
            });
            
            lazyImages.forEach(lazyImage => {
                imageObserver.observe(lazyImage);
            });
        } else {
            // Fallback for older browsers without IntersectionObserver
            let active = false;
            
            const lazyLoad = function() {
                if (active === false) {
                    active = true;
                    
                    setTimeout(function() {
                        lazyImages.forEach(lazyImage => {
                            if ((lazyImage.getBoundingClientRect().top <= window.innerHeight && lazyImage.getBoundingClientRect().bottom >= 0) && getComputedStyle(lazyImage).display !== "none") {
                                lazyImage.src = lazyImage.dataset.src;
                                lazyImages = lazyImages.filter(image => image !== lazyImage);
                                
                                if (lazyImages.length === 0) {
                                    document.removeEventListener("scroll", lazyLoad);
                                    window.removeEventListener("resize", lazyLoad);
                                    window.removeEventListener("orientationchange", lazyLoad);
                                }
                            }
                        });
                        
                        active = false;
                    }, 200);
                }
            };
            
            document.addEventListener("scroll", lazyLoad);
            window.addEventListener("resize", lazyLoad);
            window.addEventListener("orientationchange", lazyLoad);
        }
    }
}

// Add breadcrumbs for better navigation and SEO
function addBreadcrumbs() {
    const mainContent = document.querySelector('main');
    const heroSection = document.querySelector('.hero');
    
    if (mainContent && heroSection) {
        const breadcrumbsNav = document.createElement('nav');
        breadcrumbsNav.className = 'breadcrumbs';
        breadcrumbsNav.setAttribute('aria-label', 'Breadcrumb');
        
        const breadcrumbsList = document.createElement('ol');
        breadcrumbsList.innerHTML = `
            <li><a href="/">Home</a></li>
            <li aria-current="page">Articles</li>
        `;
        
        breadcrumbsNav.appendChild(breadcrumbsList);
        mainContent.insertBefore(breadcrumbsNav, heroSection.nextSibling);
        
        // Add structured data for breadcrumbs
        const breadcrumbsData = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": "https://technicalblog.com"
                },
                {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "Articles",
                    "item": "https://technicalblog.com/articles"
                }
            ]
        };
        
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(breadcrumbsData);
        document.head.appendChild(script);
    }
}
