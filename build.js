const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function getTscCommand() {
  const candidates = [
    path.join(__dirname, 'node_modules/typescript/bin/tsc'),
    path.join(__dirname, '../../student-ai-support/node_modules/typescript/bin/tsc'),
    path.join(__dirname, '../../qoolla-student-app/node_modules/typescript/bin/tsc'),
    path.join(__dirname, '../../go3math-class-nextjs-trpc-web/node_modules/typescript/bin/tsc'),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return `node "${c}"`;
  }
  try {
    const p = require.resolve('typescript/bin/tsc');
    return `node "${p}"`;
  } catch (e) {
    return 'npx --yes typescript tsc';
  }
}

const tscCmd = getTscCommand();
const projectDir = __dirname;

try {
  // 1. Build TypeScript definitions and CommonJS
  execSync(`${tscCmd} -p "${projectDir}/tsconfig.json"`, { stdio: 'inherit' });
  
  // 2. Build ESM modules
  execSync(`${tscCmd} -p "${projectDir}/tsconfig.json" --module ES2020 --outDir "${projectDir}/dist/esm"`, { stdio: 'inherit' });

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

