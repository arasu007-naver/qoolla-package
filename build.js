const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const tscPath = path.resolve(__dirname, '../../qoolla/tutor-web/node_modules/.bin/tsc');
const projectDir = __dirname;

try {
  // 1. Build TypeScript definitions and CommonJS
  execSync(`"${tscPath}" -p "${projectDir}/tsconfig.json"`, { stdio: 'inherit' });
  
  // 2. Build ESM modules
  execSync(`"${tscPath}" -p "${projectDir}/tsconfig.json" --module ES2020 --outDir "${projectDir}/dist/esm"`, { stdio: 'inherit' });

  // 3. Process ESM files (.mjs with correct relative import specifiers)
  const esmDir = path.join(projectDir, 'dist/esm');
  if (fs.existsSync(esmDir)) {
    const esmFiles = fs.readdirSync(esmDir);
    for (const file of esmFiles) {
      if (file.endsWith('.js')) {
        let content = fs.readFileSync(path.join(esmDir, file), 'utf8');
        // Replace relative imports without extension with .mjs
        content = content.replace(/from\s+["'](\.\/[^"']+)["']/g, (match, p1) => {
          if (!p1.endsWith('.mjs') && !p1.endsWith('.js')) {
            return `from "${p1}.mjs"`;
          }
          return match;
        });
        const mjsName = file.replace(/\.js$/, '.mjs');
        fs.writeFileSync(path.join(projectDir, 'dist', mjsName), content, 'utf8');
      }
    }
    fs.rmSync(esmDir, { recursive: true, force: true });
  }

  console.log('Build completed successfully.');
} catch (e) {
  console.error('Build failed:', e);
  process.exit(1);
}

