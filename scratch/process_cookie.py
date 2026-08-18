from PIL import Image
from collections import deque

src = r'C:\Users\HOME\.gemini\antigravity\brain\11935efe-2d20-4013-ad00-a423b5435e0a\.user_uploaded\media_1786853024807.jpg'
dst = r'C:\Users\HOME\.gemini\antigravity\scratch\birthday-experience\assets\images\cin_cookie.png'

img = Image.open(src).convert('RGBA')
w, h = img.size
pixels = img.load()

# Flood fill from the corners (0,0), (w-1,0), (0,h-1), (w-1,h-1)
# Any connected pixel that is near-white (e.g. R>240, G>240, B>240) and outside the sticker boundary should be made transparent.
# Let's inspect the sticker outline. The sticker has a subtle grey border or die-cut line. If we want to make everything outside the sticker transparent:

visited = set()
queue = deque([(0, 0), (w-1, 0), (0, h-1), (w-1, h-1)])

for pt in list(queue):
    visited.add(pt)

# We define background threshold. In JPEG, pure white can be 250-255 or slightly compressed.
def is_bg(r, g, b):
    # Outside background is near pure white: R, G, B all > 248 or very close to pure white with low saturation
    return r > 245 and g > 245 and b > 245 and abs(r-g) < 8 and abs(g-b) < 8 and abs(r-b) < 8

# Let's do a flood fill
while queue:
    x, y = queue.popleft()
    r, g, b, a = pixels[x, y]
    pixels[x, y] = (0, 0, 0, 0)
    
    for dx, dy in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
        nx, ny = x + dx, y + dy
        if 0 <= nx < w and 0 <= ny < h and (nx, ny) not in visited:
            nr, ng, nb, _ = pixels[nx, ny]
            if is_bg(nr, ng, nb):
                visited.add((nx, ny))
                queue.append((nx, ny))

img.save(dst, 'PNG')
print(f"Processed and saved {dst} (Size: {w}x{h})")
