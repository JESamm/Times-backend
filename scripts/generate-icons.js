/**
 * Icon Generator Script for TMU TIMES PWA
 * 
 * Run this script to generate all required PWA icons:
 * node scripts/generate-icons.js
 * 
 * Requires: npm install sharp
 */

const fs = require('fs');
const path = require('path');

// Icon sizes needed for PWA
const sizes = [16, 32, 72, 96, 128, 144, 152, 192, 384, 512];

// SVG template for the icon
const generateSVG = (size) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1e3a8a"/>
      <stop offset="100%" style="stop-color:#0f172a"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${size * 0.15}" fill="url(#bg)"/>
  <text x="50%" y="55%" font-size="${size * 0.5}" fill="white" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" font-weight="bold">📰</text>
</svg>
`;

// Create icons directory if it doesn't exist
const iconsDir = path.join(__dirname, '..', 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Generate SVG icons (these work as fallbacks)
console.log('Generating PWA icons...\n');

sizes.forEach(size => {
  const svg = generateSVG(size);
  const filename = `icon-${size}x${size}.svg`;
  fs.writeFileSync(path.join(iconsDir, filename), svg);
  console.log(`✓ Generated ${filename}`);
});

// Generate apple touch icon
const appleSVG = generateSVG(180);
fs.writeFileSync(path.join(iconsDir, 'apple-touch-icon.svg'), appleSVG);
console.log('✓ Generated apple-touch-icon.svg');

// Generate favicon
const faviconSVG = generateSVG(32);
fs.writeFileSync(path.join(iconsDir, 'favicon.svg'), faviconSVG);
console.log('✓ Generated favicon.svg');

console.log('\n✅ Icon generation complete!');
console.log('\nNote: For production, convert SVG files to PNG using:');
console.log('- https://svgtopng.com/');
console.log('- Or install sharp: npm install sharp');
console.log('  Then run: node scripts/convert-icons.js');

// Also create a simple HTML page to manually save icons
const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <title>TMU TIMES Icon Generator</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5; }
    .icon-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 20px; }
    .icon-item { background: white; padding: 20px; border-radius: 8px; text-align: center; }
    canvas { display: block; margin: 0 auto 10px; }
    button { padding: 8px 16px; cursor: pointer; }
  </style>
</head>
<body>
  <h1>📰 TMU TIMES Icon Generator</h1>
  <p>Right-click each icon and save as PNG, or click the button to download.</p>
  <div class="icon-grid" id="icons"></div>
  
  <script>
    const sizes = [16, 32, 72, 96, 128, 144, 152, 192, 384, 512];
    const container = document.getElementById('icons');
    
    sizes.forEach(size => {
      const div = document.createElement('div');
      div.className = 'icon-item';
      
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      canvas.style.width = Math.min(size, 128) + 'px';
      canvas.style.height = Math.min(size, 128) + 'px';
      
      const ctx = canvas.getContext('2d');
      
      // Draw gradient background
      const gradient = ctx.createLinearGradient(0, 0, size, size);
      gradient.addColorStop(0, '#1e3a8a');
      gradient.addColorStop(1, '#0f172a');
      
      // Rounded rectangle
      const radius = size * 0.15;
      ctx.beginPath();
      ctx.moveTo(radius, 0);
      ctx.lineTo(size - radius, 0);
      ctx.quadraticCurveTo(size, 0, size, radius);
      ctx.lineTo(size, size - radius);
      ctx.quadraticCurveTo(size, size, size - radius, size);
      ctx.lineTo(radius, size);
      ctx.quadraticCurveTo(0, size, 0, size - radius);
      ctx.lineTo(0, radius);
      ctx.quadraticCurveTo(0, 0, radius, 0);
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // Draw emoji
      ctx.font = (size * 0.5) + 'px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('📰', size / 2, size / 2);
      
      const btn = document.createElement('button');
      btn.textContent = 'Download ' + size + 'x' + size;
      btn.onclick = () => {
        const link = document.createElement('a');
        link.download = 'icon-' + size + 'x' + size + '.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      };
      
      div.appendChild(canvas);
      div.appendChild(document.createTextNode(size + 'x' + size));
      div.appendChild(document.createElement('br'));
      div.appendChild(btn);
      container.appendChild(div);
    });
  </script>
</body>
</html>
`;

fs.writeFileSync(path.join(iconsDir, 'generator.html'), htmlContent);
console.log('✓ Generated icons/generator.html - Open this in browser to download PNG icons');
