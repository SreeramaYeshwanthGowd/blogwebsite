// Create placeholder images for the blog
document.addEventListener('DOMContentLoaded', function() {
    createPlaceholderImages();
});

function createPlaceholderImages() {
    // Create a directory for images if it doesn't exist
    const fs = require('fs');
    const path = require('path');
    const imagesDir = path.join(__dirname, '../images');
    
    if (!fs.existsSync(imagesDir)) {
        fs.mkdirSync(imagesDir, { recursive: true });
    }
    
    // Create a placeholder image using canvas
    const { createCanvas } = require('canvas');
    const canvas = createCanvas(600, 400);
    const ctx = canvas.getContext('2d');
    
    // Fill background
    ctx.fillStyle = '#232a47';
    ctx.fillRect(0, 0, 600, 400);
    
    // Add some design elements
    ctx.fillStyle = '#6c63ff';
    ctx.fillRect(50, 50, 500, 10);
    
    ctx.fillStyle = '#ff7846';
    ctx.fillRect(50, 340, 500, 10);
    
    // Add text
    ctx.font = 'bold 40px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText('Technical Blog', 300, 180);
    
    ctx.font = '20px Arial';
    ctx.fillText('Placeholder Image', 300, 220);
    
    // Save the image
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(path.join(imagesDir, 'placeholder.jpg'), buffer);
    
    console.log('Placeholder image created successfully');
}
