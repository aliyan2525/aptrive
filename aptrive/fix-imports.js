import fs from 'node:fs';
import path from 'node:path';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else if (f.endsWith('.ts') || f.endsWith('.tsx')) {
      callback(dirPath);
    }
  });
}

const replacements = [
  { from: /@\/app\/admin/g, to: '@/app/(app)/admin' },
  { from: /@\/app\/practice/g, to: '@/app/(app)/practice' },
  { from: /@\/app\/auth/g, to: '@/app/(marketing)/auth' },
  { from: /@\/app\/onboarding/g, to: '@/app/(app)/onboarding' }
];

walkDir(path.join(process.cwd(), 'app'), (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  replacements.forEach(({from, to}) => {
    if (from.test(content)) {
      content = content.replace(from, to);
      changed = true;
    }
  });
  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
  }
});

walkDir(path.join(process.cwd(), 'components'), (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  replacements.forEach(({from, to}) => {
    if (from.test(content)) {
      content = content.replace(from, to);
      changed = true;
    }
  });
  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
  }
});

console.log('Fixed imports');

