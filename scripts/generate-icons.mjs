#!/usr/bin/env node

/**
 * Generate PWA icons from SVG master files
 *
 * Generates all required icon sizes for PWA from the SVG master icons
 * Requires: sharp package for image conversion
 */

import { readFile, writeFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');
const iconsDir = join(publicDir, 'icons');

// Required icon sizes for PWA
const iconSizes = [
  72,
  96,
  128,
  144,
  152,
  192,
  384,
  512
];

// Icon configurations
const icons = [
  {
    input: join(iconsDir, 'icon-master.svg'),
    prefix: 'icon-',
    sizes: iconSizes
  },
  {
    input: join(iconsDir, 'maskable-icon-master.svg'),
    prefix: 'maskable-icon-',
    sizes: [512] // Only need 512x512 for maskable
  }
];

// Apple touch icon (180x180)
const appleIcon = {
  input: join(iconsDir, 'icon-master.svg'),
  output: join(publicDir, 'apple-touch-icon.png'),
  size: 180
};

async function checkSharp() {
  try {
    await import('sharp');
    return true;
  } catch (error) {
    return false;
  }
}

async function generateWithSharp() {
  const sharp = (await import('sharp')).default;

  console.log('✨ Generating PWA icons with sharp...\n');

  // Generate regular and maskable icons
  for (const icon of icons) {
    console.log(`📱 Processing ${icon.prefix}icons...`);

    const svgBuffer = await readFile(icon.input);

    for (const size of icon.sizes) {
      const outputPath = join(iconsDir, `${icon.prefix}${size}x${size}.png`);

      await sharp(svgBuffer)
        .resize(size, size)
        .png()
        .toFile(outputPath);

      console.log(`   ✅ Generated ${size}x${size}`);
    }
  }

  // Generate Apple touch icon
  console.log('\n🍎 Generating Apple touch icon...');
  const appleSvgBuffer = await readFile(appleIcon.input);

  await sharp(appleSvgBuffer)
    .resize(appleIcon.size, appleIcon.size)
    .png()
    .toFile(appleIcon.output);

  console.log(`   ✅ Generated ${appleIcon.size}x${appleIcon.size}`);

  // Generate favicon.ico (using 32x32 PNG)
  console.log('\n🔖 Generating favicon...');
  const faviconPath = join(publicDir, 'favicon.ico');

  await sharp(appleSvgBuffer)
    .resize(32, 32)
    .png()
    .toFile(faviconPath.replace('.ico', '-32x32.png'));

  console.log('   ✅ Generated 32x32 PNG (rename to favicon.ico manually or use online converter)');

  console.log('\n✨ All icons generated successfully!');
  console.log('\n📋 Next steps:');
  console.log('   1. Convert favicon-32x32.png to favicon.ico using an online tool');
  console.log('   2. Test icons in browser DevTools > Application > Manifest');
  console.log('   3. Use https://www.pwabuilder.com/ to validate your PWA\n');
}

async function generateManual() {
  console.log('⚠️  Sharp package not found!\n');
  console.log('📋 Manual icon generation required:\n');
  console.log('Option 1: Install sharp');
  console.log('  npm install --save-dev sharp');
  console.log('  node scripts/generate-icons.mjs\n');
  console.log('Option 2: Use online SVG to PNG converter');
  console.log('  1. Open public/icons/icon-master.svg in browser');
  console.log('  2. Use https://svgtopng.com/ or similar tool');
  console.log('  3. Generate these sizes:');
  iconSizes.forEach(size => {
    console.log(`     - icon-${size}x${size}.png`);
  });
  console.log('  4. Generate maskable-icon-512x512.png from maskable-icon-master.svg');
  console.log('  5. Generate apple-touch-icon.png (180x180) from icon-master.svg');
  console.log('  6. Generate favicon.ico (32x32) from icon-master.svg\n');
}

// Main execution
const hasSharp = await checkSharp();

if (hasSharp) {
  await generateWithSharp();
} else {
  await generateManual();
}
