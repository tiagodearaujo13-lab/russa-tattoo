import os
import pymupdf

output_dir = os.path.join(os.path.dirname(__file__), "..", "public", "images", "brand")
os.makedirs(output_dir, exist_ok=True)

pdf_path = os.path.join(os.path.dirname(__file__), "..", "logo-Russa.pdf")
doc = pymupdf.open(pdf_path)

p1 = doc[0]
p3 = doc[2]

# 1. russa-hero-crop.png (Page 3)
p3_drawings = p3.get_drawings()
crop_boxes = [p3_drawings[i]['rect'] for i in range(12)]
crop_rect = pymupdf.Rect(
    min(r.x0 for r in crop_boxes) - 10,
    min(r.y0 for r in crop_boxes) - 10,
    max(r.x1 for r in crop_boxes) + 10,
    max(r.y1 for r in crop_boxes) + 10
)
pix_crop = p3.get_pixmap(clip=crop_rect, alpha=True, dpi=200)
crop_path = os.path.join(output_dir, "russa-hero-crop.png")
pix_crop.save(crop_path)
print(f"Saved {crop_path}: {pix_crop.width}x{pix_crop.height}")

# 2. russa-hero-full.png (Page 1)
p1_drawings = p1.get_drawings()
full_boxes = [p1_drawings[i]['rect'] for i in range(26)]
full_rect = pymupdf.Rect(
    min(r.x0 for r in full_boxes) - 10,
    min(r.y0 for r in full_boxes) - 10,
    max(r.x1 for r in full_boxes) + 10,
    max(r.y1 for r in full_boxes) + 10
)
pix_full = p1.get_pixmap(clip=full_rect, alpha=True, dpi=200)
full_path = os.path.join(output_dir, "russa-hero-full.png")
pix_full.save(full_path)
print(f"Saved {full_path}: {pix_full.width}x{pix_full.height}")

# 3. russa-logo-dark.png and .svg (Page 3 left logo)
dark_boxes = [p3_drawings[i]['rect'] for i in range(12, 26)]
dark_rect = pymupdf.Rect(
    min(r.x0 for r in dark_boxes) - 10,
    min(r.y0 for r in dark_boxes) - 10,
    max(r.x1 for r in dark_boxes) + 10,
    max(r.y1 for r in dark_boxes) + 10
)
pix_dark = p3.get_pixmap(clip=dark_rect, alpha=True, dpi=300)
dark_png_path = os.path.join(output_dir, "russa-logo-dark.png")
pix_dark.save(dark_png_path)

# 4. russa-logo-light.png and .svg (Page 3 right logo)
light_boxes = [p3_drawings[i]['rect'] for i in range(38, 52)]
light_rect = pymupdf.Rect(
    min(r.x0 for r in light_boxes) - 10,
    min(r.y0 for r in light_boxes) - 10,
    max(r.x1 for r in light_boxes) + 10,
    max(r.y1 for r in light_boxes) + 10
)
pix_light = p3.get_pixmap(clip=light_rect, alpha=True, dpi=300)
light_png_path = os.path.join(output_dir, "russa-logo-light.png")
pix_light.save(light_png_path)

# Generate standalone SVGs for both logos
full_svg_p3 = p3.get_svg_image()

def make_cropped_svg(svg_text, rect, out_path):
    import re
    w = rect.width
    h = rect.height
    viewbox = f"{rect.x0} {rect.y0} {w} {h}"
    def repl_svg(m):
        attrs = m.group(0)
        attrs = re.sub(r'width="[^"]+"', f'width="{w:.1f}"', attrs)
        attrs = re.sub(r'height="[^"]+"', f'height="{h:.1f}"', attrs)
        attrs = re.sub(r'viewBox="[^"]+"', f'viewBox="{viewbox}"', attrs)
        return attrs
    new_svg = re.sub(r'<svg\b[^>]*>', repl_svg, svg_text, count=1)
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(new_svg)

make_cropped_svg(full_svg_p3, dark_rect, os.path.join(output_dir, "russa-logo-dark.svg"))
make_cropped_svg(full_svg_p3, light_rect, os.path.join(output_dir, "russa-logo-light.svg"))

print("Brand assets extracted successfully!")
