const fs = require('fs');
const html = fs.readFileSync('promo/showcase.html', 'utf8');

for (let s = 1; s <= 7; s++) {
  const startTag = `id="scene-${s}"`;
  const idx = html.indexOf(startTag);
  if (idx !== -1) {
    const nextTag = s < 7 ? `id="scene-${s+1}"` : 'id="controls"';
    const endIdx = html.indexOf(nextTag);
    const sceneHtml = html.substring(idx - 20, endIdx);
    console.log(`=== SCENE ${s} (length: ${sceneHtml.length}) ===`);
    console.log(sceneHtml.substring(0, 300) + '...\n');
  }
}
