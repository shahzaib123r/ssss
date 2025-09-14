const fs = require('fs');
const path = require('path');

const pluginsDir = path.join(__dirname, 'plugins'); // 👈 apna plugins folder ka path

function fixExportsInFile(filePath) {
    let code = fs.readFileSync(filePath, 'utf-8');

    if (code.includes('export default handler')) {
        code = code.replace(/export\s+default\s+handler\s*;?/g, 'module.exports = handler');
        fs.writeFileSync(filePath, code, 'utf-8');
        console.log(`✅ Fixed: ${filePath}`);
    }
}

function scanDir(dir) {
    fs.readdirSync(dir).forEach(file => {
        let fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            scanDir(fullPath);
        } else if (file.endsWith('.js')) {
            fixExportsInFile(fullPath);
        }
    });
}

// Run fixer
console.log('🔄 Fixing plugin exports...');
scanDir(pluginsDir);
console.log('✨ All plugins fixed successfully!');
