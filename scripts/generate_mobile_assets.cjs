const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Ensure output directories exist
const assetsDir = path.resolve(__dirname, '../app/assets');
const publicDir = path.resolve(__dirname, '../app/public');
if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });
if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

// Vector Heart Definition from MilanAiLogo
const heartSvgPath = `
  <defs>
    <!-- Background Radial Aura -->
    <radialGradient id="auraGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FF007F" stop-opacity="0.35" />
      <stop offset="60%" stop-color="#963DFF" stop-opacity="0.12" />
      <stop offset="100%" stop-color="#070b12" stop-opacity="0" />
    </radialGradient>

    <!-- Left Wing Gradient: Hot Magenta / Pink -->
    <linearGradient id="pinkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF1378" />
      <stop offset="100%" stop-color="#E60067" />
    </linearGradient>

    <!-- Right Wing Gradient: Vivid Violet / Purple -->
    <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#963DFF" />
      <stop offset="100%" stop-color="#6C22E8" />
    </linearGradient>

    <!-- Center Overlap Blend Gradient -->
    <linearGradient id="blendGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#A819AA" stop-opacity="0.85" />
      <stop offset="100%" stop-color="#871796" stop-opacity="0.95" />
    </linearGradient>

    <!-- Ambient Glow Filter -->
    <filter id="milanGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="6" stdDeviation="12" flood-color="#FF007F" flood-opacity="0.55" />
      <feDropShadow dx="0" dy="2" stdDeviation="6" flood-color="#963DFF" flood-opacity="0.45" />
    </filter>
  </defs>

  <g filter="url(#milanGlow)">
    <!-- Left Heart Wing -->
    <path
      d="M 60 85 C 42 70 14 52 14 30 C 14 15 26 6 40 6 C 50 6 56 12 60 18 C 62 15 67 10 74 7 C 62 12 52 24 52 38 C 52 60 60 85 60 85 Z"
      fill="url(#pinkGrad)"
    />

    <!-- Right Heart Wing -->
    <path
      d="M 60 85 C 78 70 106 52 106 30 C 106 15 94 6 80 6 C 70 6 64 12 60 18 C 58 15 53 10 46 7 C 58 12 68 24 68 38 C 68 60 60 85 60 85 Z"
      fill="url(#purpleGrad)"
    />

    <!-- Center Overlap Lens -->
    <path
      d="M 60 18 C 66 26 70 36 70 47 C 70 64 60 85 60 85 C 60 85 50 64 50 47 C 50 36 54 26 60 18 Z"
      fill="url(#blendGrad)"
      opacity="0.92"
    />

    <!-- Highlight Reflection -->
    <ellipse
      cx="60"
      cy="46"
      rx="8"
      ry="16"
      fill="#FFFFFF"
      fill-opacity="0.25"
    />
  </g>
`;

async function generateAll() {
  console.log('Generating high-res brand assets for Milan AI...');

  // 1. Icon (512x512 with Dark Luxury Background #070b12)
  const iconSvg = `
    <svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <rect width="512" height="512" fill="#070b12" rx="112" />
      <circle cx="256" cy="256" r="230" fill="url(#auraGrad)" />
      <g transform="translate(76, 86) scale(3.0)">
        ${heartSvgPath}
      </g>
    </svg>
  `;

  // 2. Adaptive Icon (512x512 with Transparent Background, heart strictly in safe center 60% zone)
  const adaptiveIconSvg = `
    <svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <circle cx="256" cy="256" r="190" fill="url(#auraGrad)" />
      <g transform="translate(106, 116) scale(2.5)">
        ${heartSvgPath}
      </g>
    </svg>
  `;

  // 3. Splash Logo Icon (512x512 with transparent background for Android 12+ SplashScreen)
  const splashSvg = `
    <svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <circle cx="256" cy="256" r="220" fill="url(#auraGrad)" />
      <g transform="translate(86, 96) scale(2.83)">
        ${heartSvgPath}
      </g>
    </svg>
  `;

  // 4. Full Screen HD Splash (1242x2436 Full HD Mobile Splash)
  const fullSplashSvg = `
    <svg width="1242" height="2436" viewBox="0 0 1242 2436" xmlns="http://www.w3.org/2000/svg">
      <rect width="1242" height="2436" fill="#070b12" />
      <circle cx="621" cy="1100" r="550" fill="url(#auraGrad)" />
      
      <!-- Center Heart -->
      <g transform="translate(351, 850) scale(4.5)">
        ${heartSvgPath}
      </g>
      
      <!-- Brand Text -->
      <text x="621" y="1400" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="76" fill="#FFFFFF" letter-spacing="2">
        Milan <tspan fill="#FF007F">AI</tspan>
      </text>
      
      <text x="621" y="1470" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="26" fill="#94A3B8" letter-spacing="8">
        MINDFUL AI MATRIMONY
      </text>
    </svg>
  `;

  const targets = [
    { svg: iconSvg, name: 'icon.png', w: 512, h: 512 },
    { svg: iconSvg, name: 'icon-512.png', w: 512, h: 512 },
    { svg: adaptiveIconSvg, name: 'adaptive-icon.png', w: 512, h: 512 },
    { svg: splashSvg, name: 'splash.png', w: 512, h: 512 },
    { svg: fullSplashSvg, name: 'splash-full.png', w: 1242, h: 2436 },
    { svg: iconSvg, name: 'favicon.png', w: 192, h: 192 },
  ];

  for (const t of targets) {
    const buf = Buffer.from(t.svg);
    const pngBuffer = await sharp(buf).resize(t.w, t.h).png({ quality: 100, compressionLevel: 9 }).toBuffer();
    
    // Write to both assets/ and public/
    fs.writeFileSync(path.join(assetsDir, t.name), pngBuffer);
    fs.writeFileSync(path.join(publicDir, t.name), pngBuffer);
    console.log(`✓ Generated ${t.name} (${t.w}x${t.h})`);
  }

  console.log('All branding and splash assets generated successfully!');
}

generateAll().catch(err => {
  console.error('Error generating assets:', err);
  process.exit(1);
});
