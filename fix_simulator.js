const fs = require('fs');
const f = '/Users/deepak/Desktop/Loan_assistant/src/pages/Simulator.tsx';
let content = fs.readFileSync(f, 'utf8');

content = content.replace(/var\(--text-muted\)/g, 'var(--text-secondary)');
content = content.replace(/var\(--text-main\)/g, 'var(--text-primary)');
content = content.replace(/var\(--bg-panel\)/g, 'var(--bg-surface)');
content = content.replace(/var\(--success\)/g, 'var(--emerald-bright)');
content = content.replace(/var\(--danger\)/g, 'var(--rose-bright)');
content = content.replace(/var\(--warning\)/g, 'var(--gold-bright)');
content = content.replace(/var\(--accent-primary\)/g, 'var(--electric-bright)');
content = content.replace(/var\(--accent-secondary\)/g, 'var(--gold-bright)');
content = content.replace(/var\(--accent-tertiary\)/g, 'var(--cyan-bright)');

content = content.replace(/className="glass-panel"/g, 'className="card card-pad"');
content = content.replace(/style={{ padding: '24px' }}/g, '');
content = content.replace(/style={{ padding: '24px', height: '400px' }}/g, "style={{ height: '400px' }}");
content = content.replace(/style={{ padding: '24px', borderLeft: '4px solid var\(--cyan-bright\)' }}/g, "style={{ borderLeft: '4px solid var(--cyan-bright)' }}");
content = content.replace(/style={{ width: '500px', padding: '32px', borderTop: '4px solid var\(--gold-bright\)' }}/g, "style={{ width: '500px', borderTop: '4px solid var(--gold-bright)' }}");

content = content.replace(/rgba\(255,255,255,0\.05\)/g, 'var(--bg-raised)');
content = content.replace(/rgba\(255,255,255,0\.1\)/g, 'var(--glass-border-bright)');
content = content.replace(/rgba\(158, 206, 106, 0\.1\)/g, 'var(--emerald-glow)');
content = content.replace(/rgba\(247, 118, 142, 0\.1\)/g, 'var(--rose-glow)');

// manual fixes
content = content.replace(
  /<div>\s*<h1 className="text-gradient">Predictive EMI Simulations<\/h1>\s*<p style={{ color: 'var\(--text-secondary\)', fontSize: '1\.1rem' }}>/g,
  '<div className="page-header" style={{ marginBottom: 0 }}>\n          <h1>Predictive EMI Simulations</h1>\n          <p>'
);

content = content.replace(
  /border: `1px solid \$\{confidence > 70 \? 'var\(--emerald-bright\)' : 'var\(--rose-bright\)'\}` \}\}>/g,
  "border: `1px solid ${confidence > 70 ? 'var(--emerald)' : 'var(--rose)'}` }}>"
);

content = content.replace(
  /<span className="text-gradient">SHAP Value Analysis<\/span>/g,
  '<span>SHAP Value Analysis</span>'
);

fs.writeFileSync(f, content);
console.log("Replaced Simulator.tsx");
