from PIL import Image
import os

stickers = [
    ('cin_yay.jpg', 'cin_yay.png'),
    ('cin_xie_xie.jpg', 'cin_xie_xie.png'),
    ('cin_matane.jpg', 'cin_matane.png'),
]

img_dir = r'C:\Users\HOME\.gemini\antigravity\scratch\birthday-experience\assets\images'

for src_name, dst_name in stickers:
    src = os.path.join(img_dir, src_name)
    dst = os.path.join(img_dir, dst_name)

    img = Image.open(src).convert('RGBA')
    pixels = img.load()
    w, h = img.size

    for y in range(h):
        for x in range(w):
            r, g, b, a = pixels[x, y]
            # Make near-black pixels transparent
            if r < 40 and g < 40 and b < 40:
                pixels[x, y] = (0, 0, 0, 0)

    img.save(dst)
    print(f'Saved {dst_name}')

print('Done!')
