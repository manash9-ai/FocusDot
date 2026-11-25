const fs = require('fs');
const lines = fs.readFileSync('promo/showcase.html', 'utf8').split('\n');

function inspectScene(name, startLine, endLine) {
  console.log('=== ' + name + ' ===');
  for (let i = startLine; i < endLine; i++) {
    const l = lines[i];
    if (l.includes('class="scene') || l.includes('class="feature-badge') || l.includes('class="scene-title') || l.includes('class="device') || l.includes('h2') || l.includes('h3') || l.includes('class="pill-badge"')) {
      console.log(`${i+1}: ${l.trim().substring(0, 95)}`);
    }
  }
}

inspectScene('Scene 3', 620, 710);
inspectScene('Scene 4', 705, 835);
inspectScene('Scene 5', 825, 945);
inspectScene('Scene 6', 940, 1055);
inspectScene('Scene 7', 1045, 1070);
