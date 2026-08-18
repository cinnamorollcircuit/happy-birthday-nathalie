with open(r'C:\Users\HOME\.gemini\antigravity\scratch\birthday-experience\assets\images\exact_animated_bouquet.svg', 'r', encoding='utf-8') as f:
    svg_code = f.read()

with open(r'C:\Users\HOME\.gemini\antigravity\scratch\birthday-experience\index.html', 'r', encoding='utf-8') as f:
    html_code = f.read()

start_marker = '<!-- Spacious Hand-Tied SVG Bouquet:'
end_marker = '</div>'

start_idx = html_code.find(start_marker)
end_idx = html_code.find(end_marker, start_idx)

if start_idx != -1 and end_idx != -1:
    new_html = (
        html_code[:start_idx] +
        '<!-- Spacious Hand-Tied SVG Bouquet: Exact Copy Animated Retro Pixel-Art Bouquet -->\n'
        '                    <div class="bouquet-wrapper">\n'
        '                        ' + svg_code + '\n'
        '                    ' + html_code[end_idx:]
    )
    with open(r'C:\Users\HOME\.gemini\antigravity\scratch\birthday-experience\index.html', 'w', encoding='utf-8') as f:
        f.write(new_html)
    print('index.html updated successfully with exact animated bouquet SVG!')
else:
    print('Markers not found!')
