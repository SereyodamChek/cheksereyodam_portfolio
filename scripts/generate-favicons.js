const sharp = require('sharp');
const toIco = require('to-ico');
const fs = require('fs').promises;

(async () => {
  try {
    const src = 'src/app/favicon.png';
    const outDir = 'public';
    // Ensure the original main favicon exists in public
    await fs.copyFile(src, `${outDir}/favicon.png`);
    console.log('copied main favicon to public/favicon.png');

    const sizes = [16, 32, 48, 96, 180];

    for (const s of sizes) {
      const out = `${outDir}/favicon-${s}.png`;
      await sharp(src)
        .resize(s, s, { fit: 'cover' })
        .png()
        .toFile(out);
      console.log('wrote', out);
    }

    // Create apple-touch-icon from 180px PNG
    await fs.copyFile(`${outDir}/favicon-180.png`, `${outDir}/apple-touch-icon.png`);
    console.log('wrote apple-touch-icon.png');

    // Generate favicon.ico from 16x16 and 32x32 using to-ico
    const buf16 = await fs.readFile(`${outDir}/favicon-16.png`);
    const buf32 = await fs.readFile(`${outDir}/favicon-32.png`);
    const icoBuffer = await toIco([buf16, buf32]);
    await fs.writeFile(`${outDir}/favicon.ico`, icoBuffer);
    console.log('wrote', `${outDir}/favicon.ico`);

    console.log('All favicons generated successfully.');
  } catch (err) {
    console.error('Error generating favicons:', err);
    process.exit(1);
  }
})();
