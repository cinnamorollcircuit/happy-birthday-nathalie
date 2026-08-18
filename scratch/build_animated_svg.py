import os
import base64
from PIL import Image

layer_dir = r'C:\Users\HOME\.gemini\antigravity\scratch\birthday-experience\assets\images\layers'

layers_b64 = {}
layer_centers = {}

# ViewBox dimensions for SVG
svg_w = 440
svg_h = 520

# Scale factors from original PNG size (469x513) to SVG viewBox (440x520)
orig_w, orig_h = 469, 513
scale_x = 420 / orig_w
scale_y = 460 / orig_h
offset_x = 10
offset_y = 10

layer_files = [
    ('stems', 'stems.png'),
    ('leaves', 'leaves.png'),
    ('f1_red_rose', 'f1_red_rose.png'),
    ('f2_sunflower', 'f2_sunflower.png'),
    ('f3_pink_rose', 'f3_pink_rose.png'),
    ('f4_lavender_top', 'f4_lavender_top.png'),
    ('f5_tulip', 'f5_tulip.png'),
    ('f6_daisy_accents', 'f6_daisy_accents.png'),
    ('bow', 'bow.png'),
]

for key, filename in layer_files:
    p = os.path.join(layer_dir, filename)
    im = Image.open(p)
    bbox = im.getbbox()
    if bbox:
        cx = offset_x + ((bbox[0] + bbox[2]) / 2.0) * scale_x
        cy = offset_y + ((bbox[1] + bbox[3]) / 2.0) * scale_y
        layer_centers[key] = (round(cx, 1), round(cy, 1))
    else:
        layer_centers[key] = (220, 260)
        
    with open(p, 'rb') as f:
        b64 = base64.b64encode(f.read()).decode('utf-8')
        layers_b64[key] = f'data:image/png;base64,{b64}'

print('Layer Centers:', layer_centers)

# Build SVG structure with distinct layer groups
svg_code = f'''<svg class="bouquet-svg" viewBox="0 0 {svg_w} {svg_h}" aria-label="Animated Pixel-Art Flower Bouquet">
    <defs>
        <filter id="pixelShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="5" stdDeviation="5" flood-color="#8B1E4B" flood-opacity="0.3" />
        </filter>
    </defs>

    <!-- 1. Stems Layer Group (Grows on anim-stems) -->
    <g class="b-stems">
        <g class="stem stem-center">
            <image href="{layers_b64['stems']}" x="{offset_x}" y="{offset_y}" width="420" height="460" style="image-rendering: pixelated; image-rendering: crisp-edges;" />
        </g>
    </g>

    <!-- 2. Leaves Layer Group (Sprouts on anim-leaves) -->
    <g class="b-leaves">
        <g class="leaf L1" style="transform-origin: {layer_centers['leaves'][0]}px {layer_centers['leaves'][1]}px;">
            <image href="{layers_b64['leaves']}" x="{offset_x}" y="{offset_y}" width="420" height="460" style="image-rendering: pixelated; image-rendering: crisp-edges;" />
        </g>
    </g>

    <!-- 3. Flowers Layer Groups (Blooms sequentially) -->
    <g class="b-flowers" filter="url(#pixelShadow)">
        
        <!-- F4: Top Lavender & Spikes (Blooms on anim-f4) -->
        <g class="flower F4" style="transform-origin: {layer_centers['f4_lavender_top'][0]}px {layer_centers['f4_lavender_top'][1]}px;">
            <image href="{layers_b64['f4_lavender_top']}" x="{offset_x}" y="{offset_y}" width="420" height="460" style="image-rendering: pixelated; image-rendering: crisp-edges;" />
        </g>

        <!-- F5: Upper Left Golden Tulip (Blooms on anim-f4) -->
        <g class="flower F5" style="transform-origin: {layer_centers['f5_tulip'][0]}px {layer_centers['f5_tulip'][1]}px;">
            <image href="{layers_b64['f5_tulip']}" x="{offset_x}" y="{offset_y}" width="420" height="460" style="image-rendering: pixelated; image-rendering: crisp-edges;" />
        </g>

        <!-- F1: Centerpiece Crimson Red Rose (Blooms FIRST on anim-f1) -->
        <g class="flower F1" style="transform-origin: {layer_centers['f1_red_rose'][0]}px {layer_centers['f1_red_rose'][1]}px;">
            <image href="{layers_b64['f1_red_rose']}" x="{offset_x}" y="{offset_y}" width="420" height="460" style="image-rendering: pixelated; image-rendering: crisp-edges;" />
        </g>

        <!-- F2: Upper Right Sunflower (Blooms SECOND on anim-f2) -->
        <g class="flower F2" style="transform-origin: {layer_centers['f2_sunflower'][0]}px {layer_centers['f2_sunflower'][1]}px;">
            <image href="{layers_b64['f2_sunflower']}" x="{offset_x}" y="{offset_y}" width="420" height="460" style="image-rendering: pixelated; image-rendering: crisp-edges;" />
        </g>

        <!-- F3: Lower Left Pink Rose (Blooms THIRD on anim-f3) -->
        <g class="flower F3" style="transform-origin: {layer_centers['f3_pink_rose'][0]}px {layer_centers['f3_pink_rose'][1]}px;">
            <image href="{layers_b64['f3_pink_rose']}" x="{offset_x}" y="{offset_y}" width="420" height="460" style="image-rendering: pixelated; image-rendering: crisp-edges;" />
        </g>

        <!-- F6: Supporting Daisy & Accents (Blooms on anim-f4) -->
        <g class="flower F6" style="transform-origin: {layer_centers['f6_daisy_accents'][0]}px {layer_centers['f6_daisy_accents'][1]}px;">
            <image href="{layers_b64['f6_daisy_accents']}" x="{offset_x}" y="{offset_y}" width="420" height="460" style="image-rendering: pixelated; image-rendering: crisp-edges;" />
        </g>

    </g>

    <!-- 4. Bow & Ribbon Layer (Appears on anim-ribbon) -->
    <g class="b-ribbon" style="transform-origin: {layer_centers['bow'][0]}px {layer_centers['bow'][1]}px;">
        <image href="{layers_b64['bow']}" x="{offset_x}" y="{offset_y}" width="420" height="460" style="image-rendering: pixelated; image-rendering: crisp-edges;" />
    </g>

    <!-- 5. Orbiting Sparkles around Bouquet (Appears on anim-sparkles) -->
    <g class="b-orbit-sparkles">
        <text x="75" y="95" class="sparkle-star s1">🌸</text>
        <text x="360" y="105" class="sparkle-star s2">🌸</text>
        <text x="220" y="35" class="sparkle-star s3">🌸</text>
        <text x="35" y="210" class="sparkle-star s4">🌸</text>
        <text x="395" y="210" class="sparkle-star s5">🌸</text>
    </g>
</svg>'''

with open(r'C:\Users\HOME\.gemini\antigravity\scratch\birthday-experience\assets\images\exact_animated_bouquet.svg', 'w', encoding='utf-8') as out_f:
    out_f.write(svg_code)

print('Animated SVG successfully generated!')
