// Create a simple index.html for Node serving
const fs = require('fs')
const path = require('path')

const indexPath = path.join(__dirname, 'dist', 'index.html')

if (fs.existsSync(indexPath)) {
  console.log('✓ Build successful - index.html exists')
  const content = fs.readFileSync(indexPath, 'utf8')
  console.log('Generated index.html length:', content.length)
  
  // Check for key elements
  if (content.includes('id="root"')) console.log('✓ Root element found')
  if (content.includes('font-arabic')) console.log('✓ Arabic font class found')
  if (content.includes('min-h-screen')) console.log('✓ Tailwind min-h-screen utility found')
} else {
  console.log('✗ index.html not found')
  process.exit(1)
}
