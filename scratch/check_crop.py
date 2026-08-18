from PIL import Image

img = Image.open(r'C:\Users\HOME\.gemini\antigravity\scratch\birthday-experience\assets\images\cin_cookie.png')
bbox = img.getbbox()
print("BBox with alpha:", bbox)

cropped = img.crop(bbox)
cropped.save(r'C:\Users\HOME\.gemini\antigravity\scratch\birthday-experience\assets\images\cin_cookie.png')
print("Saved cropped image, new size:", cropped.size)
