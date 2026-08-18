import base64

with open(r'C:\Users\HOME\.gemini\antigravity\scratch\birthday-experience\assets\images\exact_pixel_bouquet.png', 'rb') as f:
    b64_img = base64.b64encode(f.read()).decode('utf-8')

data_uri = f'data:image/png;base64,{b64_img}'

svg_parts = [
    '<svg class="bouquet-svg" viewBox="0 0 340 440" aria-label="Exact Copy Retro Pixel-Art Flower Bouquet">',
    '    <defs>',
    '        <filter id="pixelShadow" x="-10%" y="-10%" width="120%" height="120%">',
    '            <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#8B1E4B" flood-opacity="0.3" />',
    '        </filter>',
    '    </defs>',
    '    <g class="b-stems">',
    '        <path class="stem stem-center" d="M170,410 L170,330 M155,410 L155,330 M185,410 L185,330" stroke="#0A7E24" stroke-width="6" stroke-linecap="square" />',
    '    </g>',
    '    <g class="b-leaves">',
    '        <g class="leaf L1"><rect x="60" y="80" width="40" height="30" fill="#0A7E24" opacity="0" /></g>',
    '    </g>',
    '    <g class="b-flowers" filter="url(#pixelShadow)">',
    '        <g class="flower F1">',
    '            <image href="' + data_uri + '" x="15" y="15" width="310" height="340" style="image-rendering: pixelated; image-rendering: crisp-edges;" />',
    '        </g>',
    '    </g>',
    '    <g class="b-ribbon">',
    '        <rect x="110" y="320" width="120" height="40" fill="none" />',
    '    </g>',
    '    <g class="b-orbit-sparkles">',
    '        <text x="95" y="85" class="sparkle-star s1">🌸</text>',
    '        <text x="230" y="95" class="sparkle-star s2">🌸</text>',
    '        <text x="160" y="40" class="sparkle-star s3">🌸</text>',
    '        <text x="45" y="155" class="sparkle-star s4">🌸</text>',
    '        <text x="285" y="155" class="sparkle-star s5">🌸</text>',
    '    </g>',
    '</svg>'
]

svg_code = '\n'.join(svg_parts)

with open(r'C:\Users\HOME\.gemini\antigravity\scratch\birthday-experience\assets\images\exact_bouquet.svg', 'w', encoding='utf-8') as out_f:
    out_f.write(svg_code)

print('Done writing SVG.')
