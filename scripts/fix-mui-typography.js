const fs = require('fs');
const path = require('path');

function walk(dir) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (p.endsWith('.tsx')) {
      let c = fs.readFileSync(p, 'utf8');
      const orig = c;
      c = c.replace(
        /<Typography([^>]*?)fontWeight=\{(\d+)\}([^>]*)>/g,
        (m, before, weight, after) => {
          const sxMatch = (before + after).match(/sx=\{\{([^}]*)\}\}/);
          if (sxMatch) {
            const merged = `sx={{ ${sxMatch[1].trim()}, fontWeight: ${weight} }}`;
            return `<Typography${(before + after).replace(/ sx=\{\{[^}]*\}\}/, '')} ${merged}>`;
          }
          return `<Typography${before}${after} sx={{ fontWeight: ${weight} }}>`;
        }
      );
      c = c.replace(
        /<Typography([^>]*?)fontFamily="([^"]+)"([^>]*)>/g,
        (m, before, family, after) => {
          const sxMatch = (before + after).match(/sx=\{\{([^}]*)\}\}/);
          if (sxMatch) {
            const merged = `sx={{ ${sxMatch[1].trim()}, fontFamily: '${family}' }}`;
            return `<Typography${(before + after).replace(/ sx=\{\{[^}]*\}\}/, '')} ${merged}>`;
          }
          return `<Typography${before}${after} sx={{ fontFamily: '${family}' }}>`;
        }
      );
      if (c !== orig) fs.writeFileSync(p, c);
    }
  }
}

walk(path.join(__dirname, '../src'));
console.log('done');
