const fs = require('fs');
const path = require('path');

const inputDir = 'c:/Users/bot/Desktop/gruas';
const outputDir = 'c:/Users/bot/Desktop/gruas/app/src/pages';

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

function toCamelCase(str) {
    return str.replace(/([-_][a-z])/g, (group) =>
        group.toUpperCase().replace('-', '').replace('_', '')
    ).replace(/^[a-z]/, g => g.toUpperCase());
}

const folders = fs.readdirSync(inputDir).filter(f => fs.statSync(path.join(inputDir, f)).isDirectory() && f !== 'app');

let appRoutes = '';
let appImports = '';

folders.forEach(folder => {
    const codeHtmlPath = path.join(inputDir, folder, 'code.html');
    if (fs.existsSync(codeHtmlPath)) {
        let html = fs.readFileSync(codeHtmlPath, 'utf8');
        
        // Extract body content
        const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
        if (bodyMatch) {
            let bodyContent = bodyMatch[1];
            
            // Remove script tags
            bodyContent = bodyContent.replace(/<script[\s\S]*?<\/script>/gi, '');
            
            // Replace class with className
            bodyContent = bodyContent.replace(/class=/g, 'className=');
            
            // Replace basic inline styles for height
            bodyContent = bodyContent.replace(/style="height:\s*([^;"]+)[;]?"/g, 'style={{ height: \'$1\' }}');
            bodyContent = bodyContent.replace(/style="font-variation-settings:\s*([^;"]+)[;]?"/g, 'style={{ fontVariationSettings: "$1" }}');
            
            // Fix unclosed tags
            bodyContent = bodyContent.replace(/<img([^>]*[^\/])>/gi, '<img$1 />');
            bodyContent = bodyContent.replace(/<input([^>]*[^\/])>/gi, '<input$1 />');
            bodyContent = bodyContent.replace(/<br>/gi, '<br />');
            bodyContent = bodyContent.replace(/<hr>/gi, '<hr />');
            
            // Replace HTML comments with JSX comments
            bodyContent = bodyContent.replace(/<!--([\s\S]*?)-->/g, '{/*$1*/}');
            
            // stroke-width to strokeWidth
            bodyContent = bodyContent.replace(/stroke-width=/g, 'strokeWidth=');
            bodyContent = bodyContent.replace(/stroke-linecap=/g, 'strokeLinecap=');
            bodyContent = bodyContent.replace(/stroke-linejoin=/g, 'strokeLinejoin=');
            
            const componentName = toCamelCase(folder);
            
            const jsxCode = `import React from 'react';\nimport { Link } from 'react-router-dom';\n\nexport default function ${componentName}() {\n  return (\n    <div className="bg-background text-on-background min-h-screen pb-24">\n      ${bodyContent}\n    </div>\n  );\n}\n`;
            
            fs.writeFileSync(path.join(outputDir, `${componentName}.jsx`), jsxCode);
            
            appImports += `import ${componentName} from './pages/${componentName}';\n`;
            appRoutes += `        <Route path="/${folder}" element={<${componentName} />} />\n`;
        }
    }
});

// Update App.jsx
const appJsxCode = `import React from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
${appImports}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Gruas App Prototypes</h1>
            <ul className="flex flex-col gap-2">
${folders.map(f => `              <li><Link to="/${f}" className="text-primary hover:underline">${f}</Link></li>`).join('\n')}
            </ul>
          </div>
        } />
${appRoutes}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
`;

fs.writeFileSync(path.join('c:/Users/bot/Desktop/gruas/app/src/App.jsx'), appJsxCode);
console.log('Conversion complete!');
