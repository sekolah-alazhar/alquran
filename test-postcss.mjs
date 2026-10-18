import postcss from 'postcss'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import fs from 'fs'

const css = fs.readFileSync('src/index.css', 'utf8')
const result = await postcss([tailwindcss, autoprefixer]).process(css, { from: 'src/index.css' })
console.log('CSS output length:', result.css.length)
console.log(result.css.substring(0, 300))
