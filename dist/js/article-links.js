// Article links functionality
document.addEventListener('DOMContentLoaded', function() {
    // Map article IDs to their corresponding content files
    const articleMap = {
        '1': 'content/real_time_analytics.md',
        '2': 'content/machine_learning_mlops_automl.md',
        '3': 'content/generative_ai.md',
        '4': 'content/etl_pipelines_databricks.md',
        '5': 'content/data_warehousing.md',
        '6': 'content/cicd_ml_systems.md',
        '7': 'content/documentation.md'
    };
    
    // Fix all read more links
    const readMoreLinks = document.querySelectorAll('.read-more');
    readMoreLinks.forEach(link => {
        const article = link.closest('.article-card');
        if (article) {
            const articleId = article.getAttribute('data-id');
            if (articleId && articleMap[articleId]) {
                link.href = articleMap[articleId];
                
                // Add click event to handle article viewing
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    openArticle(articleMap[articleId], article.querySelector('h2').textContent);
                });
            }
        }
    });
    
    // Function to open article content
    function openArticle(articlePath, title) {
        // Create modal for article viewing
        const modal = document.createElement('div');
        modal.className = 'article-modal';
        
        const modalContent = document.createElement('div');
        modalContent.className = 'article-modal-content';
        
        const closeBtn = document.createElement('span');
        closeBtn.className = 'close-modal';
        closeBtn.innerHTML = '&times;';
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        const articleTitle = document.createElement('h1');
        articleTitle.textContent = title;
        
        const articleContent = document.createElement('div');
        articleContent.className = 'article-full-content';
        articleContent.innerHTML = '<div class="loading">Loading article content...</div>';
        
        modalContent.appendChild(closeBtn);
        modalContent.appendChild(articleTitle);
        modalContent.appendChild(articleContent);
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
        
        // Fetch article content
        fetch(articlePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(markdown => {
                // Simple markdown to HTML conversion
                const html = convertMarkdownToHtml(markdown);
                articleContent.innerHTML = html;
            })
            .catch(error => {
                articleContent.innerHTML = `<div class="error">Error loading article: ${error.message}</div>`;
            });
    }
    
    // Simple markdown to HTML converter
    function convertMarkdownToHtml(markdown) {
        // Convert headers
        let html = markdown
            .replace(/^# (.*$)/gm, '<h1>$1</h1>')
            .replace(/^## (.*$)/gm, '<h2>$1</h2>')
            .replace(/^### (.*$)/gm, '<h3>$1</h3>')
            .replace(/^#### (.*$)/gm, '<h4>$1</h4>');
            
        // Convert paragraphs
        html = html.replace(/^\s*(\n)?(.+)/gm, function(m) {
            return /\<(\/)?(h|ul|ol|li|blockquote|pre|img)/.test(m) ? m : '<p>' + m + '</p>';
        });
        
        // Convert bold and italic
        html = html
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>');
            
        // Convert lists
        html = html
            .replace(/^\s*\n\d\.\s(.*)/gm, '<ol><li>$1</li></ol>')
            .replace(/^\s*\n\-\s(.*)/gm, '<ul><li>$1</li></ul>');
            
        // Fix lists (combine consecutive list items)
        html = html
            .replace(/<\/ol>\s*<ol>/g, '')
            .replace(/<\/ul>\s*<ul>/g, '');
            
        return html;
    }
});
