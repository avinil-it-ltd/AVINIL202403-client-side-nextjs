const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Next.js Static HTML Export (cPanel / public_html mode)...');

process.env.STATIC_EXPORT = 'true';

try {
  // Run Next.js build with static export enabled
  execSync('node node_modules/next/dist/bin/next build', {
    stdio: 'inherit',
    env: { ...process.env, STATIC_EXPORT: 'true' }
  });

  const outDir = path.resolve(__dirname, '../out');
  const htaccessSrc = path.resolve(__dirname, '../public/.htaccess');
  const htaccessDest = path.join(outDir, '.htaccess');

  // Ensure .htaccess is included in the exported directory
  if (fs.existsSync(htaccessSrc) && fs.existsSync(outDir)) {
    fs.copyFileSync(htaccessSrc, htaccessDest);
    console.log('✅ Copied .htaccess to out/.htaccess');
  }

  console.log('\n✨ Static export completed successfully!');
  console.log(`📁 Static files ready in: ${outDir}`);
  console.log('📦 Deployment Instructions for cPanel:');
  console.log('   1. Select all files and folders INSIDE "out" and compress them to a .zip');
  console.log('   2. Open cPanel File Manager -> go into public_html');
  console.log('   3. Upload the .zip and click Extract.');
} catch (err) {
  console.error('\n❌ Static export failed.');
  process.exit(1);
}
