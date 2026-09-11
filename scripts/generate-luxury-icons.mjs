import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

// Master ultra-luxury SVG for SamaXon Digital Solutions
// Designed like a royal bespoke digital studio crest / haute horlogerie luxury emblem
const masterSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <!-- Background Gradient -->
    <radialGradient id="bgGlow" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="#1A1815" />
      <stop offset="45%" stop-color="#0E0D0B" />
      <stop offset="100%" stop-color="#050505" />
    </radialGradient>

    <!-- Rich Metallic Gold Gradients -->
    <linearGradient id="goldSheen" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFF3D1" />
      <stop offset="25%" stop-color="#E5C158" />
      <stop offset="50%" stop-color="#BFA15A" />
      <stop offset="75%" stop-color="#8F712E" />
      <stop offset="100%" stop-color="#5E4616" />
    </linearGradient>

    <linearGradient id="goldHighlight" x1="100%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.9" />
      <stop offset="30%" stop-color="#F7DF94" stop-opacity="0.8" />
      <stop offset="70%" stop-color="#D6B46A" stop-opacity="0.4" />
      <stop offset="100%" stop-color="#8F712E" stop-opacity="0.1" />
    </linearGradient>

    <linearGradient id="innerPlateGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#181714" />
      <stop offset="100%" stop-color="#0A0A09" />
    </linearGradient>

    <filter id="luxuryGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>

    <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000000" flood-opacity="0.85" />
    </filter>
  </defs>

  <!-- Base App Background (Squircle with sleek 112px radius) -->
  <rect width="512" height="512" rx="112" fill="url(#bgGlow)" />
  
  <!-- Subtle Outer Metallic Rim -->
  <rect x="8" y="8" width="496" height="496" rx="104" fill="none" stroke="url(#goldSheen)" stroke-width="2" stroke-opacity="0.35" />

  <!-- Radial Golden Ambient Core Halo -->
  <circle cx="256" cy="256" r="160" fill="#D6B46A" opacity="0.07" filter="url(#luxuryGlow)" />

  <!-- Octagonal Precision Crest Outline -->
  <polygon points="256,44 420,112 488,256 420,400 256,468 92,400 24,256 92,112"
           fill="url(#innerPlateGrad)"
           stroke="url(#goldSheen)"
           stroke-width="3"
           stroke-opacity="0.4"
           filter="url(#softShadow)" />

  <!-- Inner Concentric Geometry Lines -->
  <circle cx="256" cy="256" r="186" fill="none" stroke="url(#goldHighlight)" stroke-width="1.5" stroke-dasharray="6 8" opacity="0.35" />
  <circle cx="256" cy="256" r="172" fill="none" stroke="url(#goldSheen)" stroke-width="2" opacity="0.5" />

  <!-- 4-Compass Micro Diamonds (Haute Horlogerie Accents) -->
  <polygon points="256,66 261,74 256,82 251,74" fill="url(#goldSheen)" />
  <polygon points="256,430 261,438 256,446 251,438" fill="url(#goldSheen)" />
  <polygon points="66,256 74,261 82,256 74,251" fill="url(#goldSheen)" />
  <polygon points="430,256 438,261 446,256 438,251" fill="url(#goldSheen)" />

  <!-- The Architectural Sculpted "S" Monogram (Geometric Beveled Luxury) -->
  <g filter="url(#softShadow)" transform="translate(0, -6)">
    <!-- Main Upper Sweep -->
    <path d="M 334,172 
             C 334,136 298,118 256,118 
             C 210,118 174,142 174,184 
             C 174,228 214,246 256,260 
             L 272,265 
             C 314,279 344,302 344,342 
             C 344,394 298,418 252,418 
             C 198,418 160,388 156,346
             L 194,340
             C 196,366 220,384 252,384
             C 280,384 306,368 306,342
             C 306,312 276,298 236,284
             L 220,279
             C 180,265 140,240 140,186
             C 140,132 190,88 256,88
             C 320,88 368,126 370,178
             Z" 
          fill="url(#goldSheen)" />

    <!-- Specular Highlight Bevel Core for 3D Chiseled Depth -->
    <path d="M 256,98 
             C 310,98 350,130 354,170 
             L 338,172 
             C 336,142 302,126 256,126 
             C 218,126 186,146 186,182 
             C 186,218 220,234 260,248 
             L 276,253 
             C 322,269 354,295 354,342 
             C 354,386 312,410 252,410 
             L 252,400 
             C 292,400 326,380 326,344 
             C 326,318 300,302 264,290 
             L 248,285 
             C 204,270 166,248 166,190 
             C 166,144 204,98 256,98 Z" 
          fill="url(#goldHighlight)" 
          opacity="0.75" />

    <!-- Center Facet Light Ridge -->
    <path d="M 256,88 L 256,118" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" opacity="0.8" />
    <path d="M 252,384 L 252,418" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" opacity="0.8" />
  </g>

  <!-- Crown / Apex Imperial Peak Accent -->
  <g transform="translate(256, 126)">
    <polygon points="0,-18 5,-8 14,-10 8,-2 10,8 0,3 -10,8 -8,-2 -14,-10 -5,-8" fill="url(#goldSheen)" />
    <circle cx="0" cy="-24" r="2.5" fill="#FFF2CE" />
  </g>

  <!-- Lower Micro Monogram Studio Label -->
  <g transform="translate(256, 458)">
    <text text-anchor="middle" font-family="'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif" font-weight="900" font-size="13" letter-spacing="4.5" fill="#D6B46A">
      SAMAXON
    </text>
  </g>
</svg>
`;

// Safe Maskable SVG (for Android adaptive launcher icons with 18% safe padding)
const maskableSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <radialGradient id="bgGlowM" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="#1A1815" />
      <stop offset="50%" stop-color="#0E0D0B" />
      <stop offset="100%" stop-color="#050505" />
    </radialGradient>
    <linearGradient id="goldSheenM" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFF3D1" />
      <stop offset="25%" stop-color="#E5C158" />
      <stop offset="50%" stop-color="#BFA15A" />
      <stop offset="75%" stop-color="#8F712E" />
      <stop offset="100%" stop-color="#5E4616" />
    </linearGradient>
    <linearGradient id="goldHighlightM" x1="100%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.95" />
      <stop offset="30%" stop-color="#F7DF94" stop-opacity="0.8" />
      <stop offset="70%" stop-color="#D6B46A" stop-opacity="0.4" />
      <stop offset="100%" stop-color="#8F712E" stop-opacity="0.1" />
    </linearGradient>
    <filter id="softShadowM" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="6" stdDeviation="10" flood-color="#000000" flood-opacity="0.85" />
    </filter>
  </defs>

  <!-- Solid Edge-to-Edge Canvas for Maskable Safe Zone -->
  <rect width="512" height="512" fill="url(#bgGlowM)" />
  <circle cx="256" cy="256" r="210" fill="none" stroke="url(#goldSheenM)" stroke-width="1.5" opacity="0.3" stroke-dasharray="4 6" />

  <!-- Scaled Crest & Monogram inside 72% Safe Circle -->
  <g transform="translate(71.68, 71.68) scale(0.72)">
    <!-- Octagonal Precision Crest Outline -->
    <polygon points="256,44 420,112 488,256 420,400 256,468 92,400 24,256 92,112"
             fill="#141311"
             stroke="url(#goldSheenM)"
             stroke-width="3.5"
             stroke-opacity="0.5"
             filter="url(#softShadowM)" />

    <circle cx="256" cy="256" r="172" fill="none" stroke="url(#goldSheenM)" stroke-width="2.5" opacity="0.55" />

    <!-- Sculpted S Monogram -->
    <g filter="url(#softShadowM)" transform="translate(0, -6)">
      <path d="M 334,172 
               C 334,136 298,118 256,118 
               C 210,118 174,142 174,184 
               C 174,228 214,246 256,260 
               L 272,265 
               C 314,279 344,302 344,342 
               C 344,394 298,418 252,418 
               C 198,418 160,388 156,346
               L 194,340
               C 196,366 220,384 252,384
               C 280,384 306,368 306,342
               C 306,312 276,298 236,284
               L 220,279
               C 180,265 140,240 140,186
               C 140,132 190,88 256,88
               C 320,88 368,126 370,178
               Z" 
            fill="url(#goldSheenM)" />

      <path d="M 256,98 
               C 310,98 350,130 354,170 
               L 338,172 
               C 336,142 302,126 256,126 
               C 218,126 186,146 186,182 
               C 186,218 220,234 260,248 
               L 276,253 
               C 322,269 354,295 354,342 
               C 354,386 312,410 252,410 
               L 252,400 
               C 292,400 326,380 326,344 
               C 326,318 300,302 264,290 
               L 248,285 
               C 204,270 166,248 166,190 
               C 166,144 204,98 256,98 Z" 
            fill="url(#goldHighlightM)" 
            opacity="0.8" />
    </g>

    <!-- Imperial Apex Star -->
    <g transform="translate(256, 126)">
      <polygon points="0,-18 5,-8 14,-10 8,-2 10,8 0,3 -10,8 -8,-2 -14,-10 -5,-8" fill="url(#goldSheenM)" />
      <circle cx="0" cy="-24" r="2.5" fill="#FFF2CE" />
    </g>

    <!-- Monogram Label -->
    <g transform="translate(256, 458)">
      <text text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="14" letter-spacing="4" fill="#D6B46A">
        SAMAXON
      </text>
    </g>
  </g>
</svg>
`;

async function generateAssets() {
  const publicDir = path.resolve('public');
  
  // 1. Write favicon.svg
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), masterSvg.trim());
  console.log('Saved public/favicon.svg');

  const masterBuffer = Buffer.from(masterSvg);
  const maskableBuffer = Buffer.from(maskableSvg);

  // 2. 512x512 Master PWA Icon
  await sharp(masterBuffer)
    .resize(512, 512)
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(path.join(publicDir, 'pwa-512x512.png'));
  console.log('Generated public/pwa-512x512.png');

  // 3. 192x192 Standard PWA Icon
  await sharp(masterBuffer)
    .resize(192, 192)
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(path.join(publicDir, 'pwa-192x192.png'));
  console.log('Generated public/pwa-192x192.png');

  // 4. 512x512 Maskable Icon
  await sharp(maskableBuffer)
    .resize(512, 512)
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(path.join(publicDir, 'pwa-maskable-512x512.png'));
  console.log('Generated public/pwa-maskable-512x512.png');

  // 5. 180x180 Apple Touch Icon
  await sharp(masterBuffer)
    .resize(180, 180)
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('Generated public/apple-touch-icon.png');

  // 6. High-res favicon.png (192x192)
  await sharp(masterBuffer)
    .resize(192, 192)
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(path.join(publicDir, 'favicon.png'));
  console.log('Generated public/favicon.png');

  // 7. Logo PNG (512x512)
  await sharp(masterBuffer)
    .resize(512, 512)
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(path.join(publicDir, 'logo.png'));
  console.log('Generated public/logo.png');

  // 8. Multi-layer favicon.ico (32x32)
  await sharp(masterBuffer)
    .resize(32, 32)
    .png()
    .toFile(path.join(publicDir, 'favicon.ico'));
  console.log('Generated public/favicon.ico');

  console.log('All luxury icon assets generated successfully!');
}

generateAssets().catch(err => {
  console.error('Error generating assets:', err);
  process.exit(1);
});
