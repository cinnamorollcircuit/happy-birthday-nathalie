import os
from PIL import Image

# Load the exact pixel bouquet sprite
img_path = r'C:\Users\HOME\.gemini\antigravity\scratch\birthday-experience\assets\images\exact_pixel_bouquet.png'
im = Image.open(img_path).convert('RGBA')

w, h = im.size
print(f'Cropped bouquet size: {w}x{h}')

# We will create individual transparent layers for:
# 1. stems_leaves (Greenery and stems)
# 2. red_rose (Center red rose)
# 3. sunflower (Upper-right sunflower)
# 4. pink_rose (Lower-left pink rose)
# 5. tulip_lavender (Upper-left tulip and top lavender/blue spikes)
# 6. supporting_flowers (Daisy, blue blossoms, marigold, dark red flower)
# 7. bow (Brown bow at bottom)

# Create blank RGBA images of same size
layers = {
    'stems': Image.new('RGBA', (w, h), (0, 0, 0, 0)),
    'leaves': Image.new('RGBA', (w, h), (0, 0, 0, 0)),
    'f1_red_rose': Image.new('RGBA', (w, h), (0, 0, 0, 0)),
    'f2_sunflower': Image.new('RGBA', (w, h), (0, 0, 0, 0)),
    'f3_pink_rose': Image.new('RGBA', (w, h), (0, 0, 0, 0)),
    'f4_lavender_top': Image.new('RGBA', (w, h), (0, 0, 0, 0)),
    'f5_tulip': Image.new('RGBA', (w, h), (0, 0, 0, 0)),
    'f6_daisy_accents': Image.new('RGBA', (w, h), (0, 0, 0, 0)),
    'bow': Image.new('RGBA', (w, h), (0, 0, 0, 0)),
}

for y in range(h):
    for x in range(w):
        r, g, b, a = im.getpixel((x, y))
        if a < 20:
            continue
        
        px = (r, g, b, a)
        
        # Classification by position & color:
        # Bow at bottom
        if y > h * 0.72 and not (g > r + 10 and g > b + 10):
            if g > r and g > b: # Green stems at very bottom
                layers['stems'].putpixel((x, y), px)
            else:
                layers['bow'].putpixel((x, y), px)
        # Green leaves / stems
        elif g > r + 10 and g > b + 10:
            if y > h * 0.55 and x > w * 0.35 and x < w * 0.65:
                layers['stems'].putpixel((x, y), px)
            else:
                layers['leaves'].putpixel((x, y), px)
        # F1: Red Rose (Center, approx x: 0.30..0.65, y: 0.20..0.48)
        elif r > 100 and g < 70 and b < 70 and (0.28*w < x < 0.65*w) and (0.18*h < y < 0.48*h):
            layers['f1_red_rose'].putpixel((x, y), px)
        # F2: Sunflower (Upper Right, x: >0.55, y: 0.20..0.55)
        elif (r > 180 and g > 130 and b < 100) and x > 0.52*w and y < 0.55*h:
            layers['f2_sunflower'].putpixel((x, y), px)
        # F3: Pink Rose (Lower Left, x: 0.20..0.55, y: 0.42..0.68)
        elif (r > 180 and g < 160 and b > 110) and x < 0.55*w and y > 0.40*h:
            layers['f3_pink_rose'].putpixel((x, y), px)
        # F4: Lavender / Top Spikes (y < 0.25*h)
        elif y < 0.25*h or (b > r and b > g and y < 0.30*h):
            layers['f4_lavender_top'].putpixel((x, y), px)
        # F5: Tulip (Upper Left, x < 0.38*w, y < 0.40*h)
        elif (r > 180 and g > 130) and x < 0.38*w and y < 0.40*h:
            layers['f5_tulip'].putpixel((x, y), px)
        # F6: Daisy & Accents
        else:
            layers['f6_daisy_accents'].putpixel((x, y), px)

out_dir = r'C:\Users\HOME\.gemini\antigravity\scratch\birthday-experience\assets\images\layers'
os.makedirs(out_dir, exist_ok=True)

for name, layer in layers.items():
    layer.save(os.path.join(out_dir, f'{name}.png'))
    print(f'Saved layer: {name}.png')

print('All layers created successfully!')
