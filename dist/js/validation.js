// Validation script to test all implemented features

document.addEventListener('DOMContentLoaded', function() {
    console.log('Running validation tests...');
    
    // Test all major components
    testUIComponents();
    testSearchFunctionality();
    testFilterFunctionality();
    testNavigationFunctionality();
    test3DBackgroundAnimation();
    testResponsiveness();
    testAccessibility();
    
    // Log validation results
    console.log('Validation complete. See results above.');
});

// Test UI components
function testUIComponents() {
    console.log('Testing UI components...');
    
    // Test sidebar filter visibility
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        console.log('✓ Sidebar filter exists');
    } else {
        console.error('✗ Sidebar filter not found');
    }
    
    // Test article cards
    const articleCards = document.querySelectorAll('.article-card');
    if (articleCards.length > 0) {
        console.log(`✓ ${articleCards.length} article cards found`);
    } else {
        console.error('✗ No article cards found');
    }
    
    // Test load more button
    const loadMoreButton = document.getElementById('load-more');
    if (loadMoreButton) {
        console.log('✓ Load more button exists');
    } else {
        console.error('✗ Load more button not found');
    }
    
    // Test contact form
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        console.log('✓ Contact form exists');
    } else {
        console.error('✗ Contact form not found');
    }
}

// Test search functionality
function testSearchFunctionality() {
    console.log('Testing search functionality...');
    
    // Test search input
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        console.log('✓ Search input exists');
        
        // Test search event listener
        const searchEvent = new Event('input');
        searchInput.value = 'test';
        searchInput.dispatchEvent(searchEvent);
        console.log('✓ Search input event dispatched');
    } else {
        console.error('✗ Search input not found');
    }
    
    // Test search button
    const searchButton = document.getElementById('search-button');
    if (searchButton) {
        console.log('✓ Search button exists');
    } else {
        console.error('✗ Search button not found');
    }
}

// Test filter functionality
function testFilterFunctionality() {
    console.log('Testing filter functionality...');
    
    // Test filter checkboxes
    const filterCheckboxes = document.querySelectorAll('.filter-options input[type="checkbox"]');
    if (filterCheckboxes.length > 0) {
        console.log(`✓ ${filterCheckboxes.length} filter checkboxes found`);
        
        // Test filter event listener
        const firstCheckbox = filterCheckboxes[0];
        firstCheckbox.checked = true;
        const changeEvent = new Event('change');
        firstCheckbox.dispatchEvent(changeEvent);
        console.log('✓ Filter checkbox event dispatched');
    } else {
        console.error('✗ No filter checkboxes found');
    }
    
    // Test apply filters button
    const applyFiltersButton = document.getElementById('apply-filters');
    if (applyFiltersButton) {
        console.log('✓ Apply filters button exists');
    } else {
        console.error('✗ Apply filters button not found');
    }
}

// Test navigation functionality
function testNavigationFunctionality() {
    console.log('Testing navigation functionality...');
    
    // Test navigation links
    const navLinks = document.querySelectorAll('nav ul li a');
    if (navLinks.length > 0) {
        console.log(`✓ ${navLinks.length} navigation links found`);
        
        // Test active class
        const activeLink = document.querySelector('nav ul li a.active');
        if (activeLink) {
            console.log('✓ Active navigation link found');
        } else {
            console.error('✗ No active navigation link found');
        }
    } else {
        console.error('✗ No navigation links found');
    }
    
    // Test section IDs for navigation
    const sections = ['articles', 'about', 'contact'];
    let allSectionsFound = true;
    
    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            console.log(`✓ Section #${sectionId} found`);
        } else {
            console.error(`✗ Section #${sectionId} not found`);
            allSectionsFound = false;
        }
    });
    
    if (allSectionsFound) {
        console.log('✓ All navigation sections found');
    }
}

// Test 3D background animation
function test3DBackgroundAnimation() {
    console.log('Testing 3D background animation...');
    
    // Test background animation container
    const backgroundAnimation = document.querySelector('.background-animation');
    if (backgroundAnimation) {
        console.log('✓ Background animation container exists');
    } else {
        console.error('✗ Background animation container not found');
    }
    
    // Test canvas element
    const canvas = document.getElementById('background-canvas');
    if (canvas) {
        console.log('✓ Background canvas exists');
    } else {
        console.error('✗ Background canvas not found');
    }
}

// Test responsiveness
function testResponsiveness() {
    console.log('Testing responsiveness...');
    
    // Test viewport meta tag
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    if (viewportMeta) {
        console.log('✓ Viewport meta tag exists');
    } else {
        console.error('✗ Viewport meta tag not found');
    }
    
    // Test responsive CSS
    const mediaQueries = [
        '@media (max-width: 992px)',
        '@media (max-width: 768px)',
        '@media (max-width: 576px)'
    ];
    
    // This is a simplified check - in a real environment we would use getComputedStyle
    let responsiveStylesFound = false;
    
    for (let i = 0; i < document.styleSheets.length; i++) {
        try {
            const rules = document.styleSheets[i].cssRules || document.styleSheets[i].rules;
            for (let j = 0; j < rules.length; j++) {
                if (rules[j].type === CSSRule.MEDIA_RULE) {
                    responsiveStylesFound = true;
                    console.log('✓ Responsive media queries found');
                    break;
                }
            }
            if (responsiveStylesFound) break;
        } catch (e) {
            // CORS error when accessing cross-origin stylesheets
            console.log('Could not access stylesheet rules (possibly due to CORS)');
        }
    }
    
    if (!responsiveStylesFound) {
        console.warn('⚠ Could not verify responsive media queries');
    }
}

// Test accessibility
function testAccessibility() {
    console.log('Testing accessibility...');
    
    // Test alt attributes on images
    const images = document.querySelectorAll('img');
    let allImagesHaveAlt = true;
    
    images.forEach(img => {
        if (!img.hasAttribute('alt')) {
            allImagesHaveAlt = false;
            console.error(`✗ Image missing alt attribute: ${img.src}`);
        }
    });
    
    if (allImagesHaveAlt) {
        console.log(`✓ All ${images.length} images have alt attributes`);
    }
    
    // Test form labels
    const formInputs = document.querySelectorAll('input, textarea');
    let allInputsHaveLabels = true;
    
    formInputs.forEach(input => {
        const id = input.getAttribute('id');
        if (id) {
            const label = document.querySelector(`label[for="${id}"]`);
            if (!label) {
                allInputsHaveLabels = false;
                console.error(`✗ Input #${id} missing associated label`);
            }
        } else {
            allInputsHaveLabels = false;
            console.error('✗ Input missing id attribute for label association');
        }
    });
    
    if (allInputsHaveLabels) {
        console.log(`✓ All ${formInputs.length} form inputs have associated labels`);
    }
    
    // Test ARIA attributes
    const ariaElements = document.querySelectorAll('[aria-label], [aria-required], [aria-current]');
    if (ariaElements.length > 0) {
        console.log(`✓ ${ariaElements.length} elements with ARIA attributes found`);
    } else {
        console.warn('⚠ No ARIA attributes found');
    }
    
    // Test skip to content link
    const skipLink = document.querySelector('.skip-to-content');
    if (skipLink) {
        console.log('✓ Skip to content link exists');
    } else {
        console.warn('⚠ Skip to content link not found');
    }
}
