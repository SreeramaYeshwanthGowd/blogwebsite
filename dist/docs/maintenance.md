# Maintenance Guide

## Adding New Articles

To add a new article to the technical blog, follow these steps:

### 1. Create Content File

Create a new Markdown file in the `content/` directory with the article content. Use the following naming convention:

```
article_title_with_underscores.md
```

Example content structure:

```markdown
# Article Title

## Introduction
Introduction text goes here...

## Main Section
Main content goes here...

## Conclusion
Conclusion text goes here...

## References
- [Reference 1](https://example.com)
- [Reference 2](https://example.com)
```

### 2. Add Article Card to HTML

Add a new article card to the `index.html` file in the `articles-container` section:

```html
<article class="article-card" data-category="category1,category2" data-id="unique-id" itemscope itemtype="http://schema.org/BlogPosting">
    <div class="article-image">
        <img src="images/your-image.jpg" alt="Descriptive alt text" itemprop="image">
    </div>
    <div class="article-content">
        <h2 itemprop="headline">Article Title</h2>
        <p class="article-meta" itemprop="datePublished">Published: Month Day, Year</p>
        <p class="article-excerpt" itemprop="description">Article excerpt or summary...</p>
        <a href="#" class="read-more" itemprop="url">Read More</a>
    </div>
    <meta itemprop="author" content="Technical Blog">
    <meta itemprop="keywords" content="keyword1, keyword2, keyword3">
</article>
```

Make sure to:
- Set unique `data-id` attribute
- Add relevant categories in `data-category` attribute
- Provide descriptive alt text for the image
- Include proper schema.org attributes

### 3. Update Search Functionality

Update the `getAllArticles()` function in `js/enhanced-search.js` to include the new article:

```javascript
function getAllArticles() {
    return [
        // Existing articles...
        {
            id: [next-id-number],
            title: 'Article Title',
            excerpt: 'Article excerpt or summary...',
            date: 'Month Day, Year',
            categories: ['category1', 'category2'],
            image: 'images/your-image.jpg'
        }
        // Add more articles as needed
    ];
}
```

### 4. Add Article Image

Place the article image in the `images/` directory. Optimize the image for web:
- Resolution: 600x400px recommended
- Format: JPEG or WebP for photos, PNG for graphics
- File size: Under 100KB if possible

## Modifying Filters

### Adding New Filter Categories

1. Update the filter options in the sidebar section of `index.html`:

```html
<div class="filter-group">
    <h4>Categories</h4>
    <div class="filter-options">
        <!-- Existing categories -->
        <label><input type="checkbox" value="new-category"> New Category</label>
    </div>
</div>
```

2. Make sure articles use the new category in their `data-category` attribute.

### Adding New Filter Groups

To add a completely new filter group (e.g., "Difficulty Level"):

```html
<div class="filter-group">
    <h4>Difficulty Level</h4>
    <div class="filter-options">
        <label><input type="checkbox" value="beginner"> Beginner</label>
        <label><input type="checkbox" value="intermediate"> Intermediate</label>
        <label><input type="checkbox" value="advanced"> Advanced</label>
    </div>
</div>
```

Then update the filter logic in `js/filters.js` to handle the new filter group.

## Updating Styles

### Changing Color Scheme

To update the color scheme, modify the CSS variables in `css/styles.css`:

```css
:root {
  --primary-bg: #your-color;
  --secondary-bg: #your-color;
  --text-color: #your-color;
  --text-secondary: #your-color;
  --accent-purple: #your-color;
  --accent-orange: #your-color;
  --accent-blue: #your-color;
  /* Add more colors as needed */
}
```

### Modifying Typography

To change fonts, update the font imports in `index.html` and the font variables in `css/styles.css`:

```css
:root {
  --font-primary: 'Your Font', fallback-font;
  --font-secondary: 'Your Font', fallback-font;
}
```

## Troubleshooting Guide

### Search Not Working

**Symptoms:**
- No search results appear
- Search doesn't update in real-time
- Console errors related to search

**Solutions:**
1. Check browser console for JavaScript errors
2. Verify that `enhanced-search.js` is properly loaded in `index.html`
3. Check if the search input has the correct ID (`search-input`)
4. Ensure the articles container has the correct class (`articles-container`)
5. Check if the article data structure in `getAllArticles()` matches what the search function expects

### Filters Not Working

**Symptoms:**
- Filters don't affect displayed articles
- Apply button doesn't respond
- Filter checkboxes don't work

**Solutions:**
1. Verify that filter checkboxes have the correct values matching article `data-category` attributes
2. Check if the apply button has the correct ID (`apply-filters`)
3. Inspect the filter logic in `filters.js`
4. Ensure event listeners are properly attached
5. Check browser console for JavaScript errors

### 3D Background Animation Issues

**Symptoms:**
- Background animation doesn't appear
- Animation is sluggish or causes performance issues
- Console errors related to canvas or WebGL

**Solutions:**
1. Check if WebGL is supported in the browser
2. Verify that `enhanced-background.js` is properly loaded
3. Check if the canvas element has the correct ID (`background-canvas`)
4. Reduce particle count for better performance on lower-end devices
5. Ensure the animation container has the correct class (`background-animation`)

### Mobile Layout Problems

**Symptoms:**
- Layout breaks on mobile devices
- Sidebar doesn't collapse properly
- Touch interactions don't work

**Solutions:**
1. Test with different viewport sizes using browser developer tools
2. Check media queries in CSS files
3. Verify that mobile-specific JavaScript is working correctly
4. Ensure the mobile menu toggle button appears at the right breakpoint
5. Check if touch events are properly handled

### Performance Issues

**Symptoms:**
- Slow page loading
- Sluggish interactions
- High CPU/memory usage

**Solutions:**
1. Optimize image sizes using compression tools
2. Implement lazy loading for images
3. Reduce the number of particles in the background animation
4. Minimize DOM manipulations in JavaScript
5. Consider code splitting for larger JavaScript files

### SEO Issues

**Symptoms:**
- Poor search engine rankings
- Missing meta tags in search results
- Accessibility warnings

**Solutions:**
1. Verify all required meta tags are present in `index.html`
2. Check if structured data is valid using Google's Structured Data Testing Tool
3. Ensure all images have descriptive alt text
4. Verify proper heading hierarchy (h1, h2, h3, etc.)
5. Check for any accessibility issues using tools like Lighthouse

## Common Code Locations

- **HTML Structure**: `src/index.html`
- **Base Styles**: `src/css/styles.css`
- **UI Improvements**: `src/css/ui-improvements.css`
- **Search Functionality**: `src/js/enhanced-search.js`
- **Filter Logic**: `src/js/filters.js`
- **Mobile Filters**: `src/js/mobile-filters.js`
- **Background Animation**: `src/js/enhanced-background.js`
- **SEO Optimization**: `src/js/seo-optimization.js`
- **Article Content**: `content/*.md`
