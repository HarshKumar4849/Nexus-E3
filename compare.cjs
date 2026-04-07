const fs = require('fs');
const path = require('path');

function compareDirs(dir1, dir2) {
  const f1 = fs.readdirSync(dir1).filter(f => f !== 'node_modules' && f !== '.git');
  const f2 = fs.readdirSync(dir2).filter(f => f !== 'node_modules' && f !== '.git');
  const set2 = new Set(f2);
  
  f1.forEach(f => {
    const p1 = path.join(dir1, f);
    const p2 = path.join(dir2, f);
    if (!set2.has(f)) {
      console.log('ONLY IN DIR1:', p1);
    } else {
      const s1 = fs.statSync(p1);
      const s2 = fs.statSync(p2);
      if (s1.isDirectory() && s2.isDirectory()) {
        compareDirs(p1, p2);
      } else if (s1.isFile() && s2.isFile()) {
        const c1 = fs.readFileSync(p1);
        const c2 = fs.readFileSync(p2);
        if (!c1.equals(c2)) {
          console.log('DIFFERENT:', p1);
        }
      }
    }
  });
  
  const set1 = new Set(f1);
  f2.forEach(f => {
    const p2 = path.join(dir2, f);
    if (!set1.has(f)) {
      console.log('NEW IN DIR2:', p2);
    }
  });
}

const dir1 = 'c:\\\\Users\\\\DELL\\\\Downloads\\\\magzine website\\\\Nexus-E3\\\\backend';
const dir2 = 'c:\\\\Users\\\\DELL\\\\Downloads\\\\magzine website\\\\Nexus-E3\\\\backend (2)\\\\backend';

try {
  compareDirs(dir1, dir2);
  console.log('DONE');
} catch (e) {
  console.error('ERROR:', e.message);
}
