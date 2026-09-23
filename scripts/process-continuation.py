import os
from PIL import Image
import collections

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.abspath(os.path.join(BASE_DIR, ".."))
BRAND_DIR = os.path.join(PROJECT_DIR, "public", "images", "brand")

def process_assets():
    # 1. Optimize Hero image: russa-hero-crop.png
    hero_path = os.path.join(BRAND_DIR, "russa-hero-crop.png")
    hero_img = Image.open(hero_path).convert("RGBA")
    hw, hh = hero_img.size

    # Find the last row with visible pixels in hero_img
    hero_pix = hero_img.load()
    last_hero_y = 0
    for y in range(hh - 1, -1, -1):
        if any(hero_pix[x, y][3] > 30 for x in range(hw)):
            last_hero_y = y
            break

    # Bottom cut row in Hero:
    cut_row = [x for x in range(hw) if hero_pix[x, last_hero_y][3] > 50]
    hero_cut_x0 = min(cut_row)
    hero_cut_x1 = max(cut_row)
    hero_cut_width = hero_cut_x1 - hero_cut_x0 + 1
    print(f"Hero cut line at y={last_hero_y}: span=[{hero_cut_x0}, {hero_cut_x1}], width={hero_cut_width}")

    # Trim empty bottom rows of Hero so it touches the bottom pixel of Hero section (pb-0)
    trimmed_hero_height = last_hero_y + 1 # 2428
    trimmed_hero = hero_img.crop((0, 0, hw, trimmed_hero_height))
    trimmed_hero.save(hero_path, optimize=True)
    print(f"Saved optimized Hero Crop: {hw}x{trimmed_hero_height} (aspect-[{hw}/{trimmed_hero_height}])")

    # 2. Process continuation image: continuação.png
    root_cont_files = [f for f in os.listdir(PROJECT_DIR) if "continua" in f.lower() and f.endswith(".png")]
    if not root_cont_files:
        raise FileNotFoundError("continuação.png not found in project root!")
    cont_source = os.path.join(PROJECT_DIR, root_cont_files[0])
    print(f"Found continuation asset: {cont_source}")

    cont_img = Image.open(cont_source).convert("RGBA")
    cw, ch = cont_img.size
    print(f"Continuation source size: {cw}x{ch}")

    # Inspect top cut row of continuation
    cont_gray = cont_img.convert("L")
    row0_dark = [x for x in range(cw) if cont_gray.getpixel((x, 0)) < 150]
    cont_cut_x0 = min(row0_dark)
    cont_cut_x1 = max(row0_dark)
    cont_cut_width = cont_cut_x1 - cont_cut_x0 + 1
    print(f"Continuation cut line at y=0: span=[{cont_cut_x0}, {cont_cut_x1}], width={cont_cut_width}")

    # Segment outside background using flood fill from edges
    visited = set()
    queue = collections.deque()
    for x in range(cw):
        if cont_gray.getpixel((x, 0)) > 150: queue.append((x, 0)); visited.add((x, 0))
        if cont_gray.getpixel((x, ch - 1)) > 150: queue.append((x, ch - 1)); visited.add((x, ch - 1))
    for y in range(ch):
        if cont_gray.getpixel((0, y)) > 150: queue.append((0, y)); visited.add((0, y))
        if cont_gray.getpixel((cw - 1, y)) > 150: queue.append((cw - 1, y)); visited.add((cw - 1, y))

    while queue:
        cx, cy = queue.popleft()
        for dx, dy in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
            nx, ny = cx + dx, cy + dy
            if 0 <= nx < cw and 0 <= ny < ch and (nx, ny) not in visited:
                if cont_gray.getpixel((nx, ny)) > 140:
                    visited.add((nx, ny))
                    queue.append((nx, ny))

    # Create transparent image keeping balaclava and mouth completely intact
    clean_cont = Image.new("RGBA", (cw, ch), (0, 0, 0, 0))
    cont_pix = cont_img.load()
    clean_pix = clean_cont.load()

    for y in range(ch):
        for x in range(cw):
            r, g, b, a = cont_pix[x, y]
            gv = cont_gray.getpixel((x, y))
            if (x, y) in visited:
                clean_pix[x, y] = (r, g, b, 0)
            else:
                # Smooth edge anti-aliasing
                is_edge = any((x + dx, y + dy) in visited for dx, dy in [(-1,0),(1,0),(0,-1),(0,1)] if 0 <= x+dx < cw and 0 <= y+dy < ch)
                if is_edge and gv > 70:
                    alpha_val = int(max(0, min(255, 255 * (210 - gv) / (210 - 43))))
                    clean_pix[x, y] = (43, 43, 43, alpha_val)
                else:
                    clean_pix[x, y] = (r, g, b, 255)

    # 3. Canvas alignment and high-res upscaling
    target_canvas_w = hw # 2557
    scale = hero_cut_width / cont_cut_width # 2007 / 212 = 9.46698

    # High-quality upscale using LANCZOS
    scaled_w = int(round(cw * scale))
    scaled_h = int(round(ch * scale))
    scaled_cont = clean_cont.resize((scaled_w, scaled_h), Image.Resampling.LANCZOS)
    print(f"Scaled continuation: {scaled_w}x{scaled_h}")

    scaled_cut_x0 = int(round(cont_cut_x0 * scale))
    offset_x = hero_cut_x0 - scaled_cut_x0
    print(f"Horizontal placement offset: {offset_x}")

    canvas_h = scaled_h
    about_canvas = Image.new("RGBA", (target_canvas_w, canvas_h), (0, 0, 0, 0))
    about_canvas.paste(scaled_cont, (offset_x, 0), scaled_cont)

    # Softly feather left, right, and bottom outer borders (ONLY below y=100)
    # This prevents any hard vertical or bottom cutoffs, ensuring organic fusion
    FEATHER_DIST = 50
    ac_pix = about_canvas.load()
    for y in range(canvas_h):
        if y < 80:
            # Top cut is 100% sharp to meet Hero cut line without any gap
            continue
        for x in range(target_canvas_w):
            r, g, b, a = ac_pix[x, y]
            if a == 0:
                continue
            factor = 1.0
            # Left edge
            if x < FEATHER_DIST:
                factor = min(factor, x / FEATHER_DIST)
            # Right edge
            if x > target_canvas_w - 1 - FEATHER_DIST:
                factor = min(factor, (target_canvas_w - 1 - x) / FEATHER_DIST)
            # Bottom edge
            if y > canvas_h - 1 - FEATHER_DIST:
                factor = min(factor, (canvas_h - 1 - y) / FEATHER_DIST)

            if factor < 1.0:
                new_a = int(round(a * (factor ** 1.5))) # smooth ease-in curve
                ac_pix[x, y] = (r, g, b, new_a)

    # Verify alignment at row 0:
    row0_pixels = [x for x in range(target_canvas_w) if ac_pix[x, 0][3] > 50]
    ac_cut_x0 = min(row0_pixels)
    ac_cut_x1 = max(row0_pixels)
    ac_cut_w = ac_cut_x1 - ac_cut_x0 + 1
    print(f"About Canvas cut line at y=0: span=[{ac_cut_x0}, {ac_cut_x1}], width={ac_cut_w}")
    print(f"Comparison:")
    print(f"  Hero bottom cut: [{hero_cut_x0}, {hero_cut_x1}], width={hero_cut_width}")
    print(f"  About top cut:   [{ac_cut_x0}, {ac_cut_x1}], width={ac_cut_w}")
    print(f"  Difference: left={ac_cut_x0 - hero_cut_x0}px, right={ac_cut_x1 - hero_cut_x1}px, width={ac_cut_w - hero_cut_width}px")

    # Save to public/images/brand/russa-continuation-bottom.png
    dest_path = os.path.join(BRAND_DIR, "russa-continuation-bottom.png")
    about_canvas.save(dest_path, optimize=True)
    print(f"Saved optimized continuation to: {dest_path}")
    print(f"Dimensions: {target_canvas_w}x{canvas_h}, Aspect Ratio: aspect-[{target_canvas_w}/{canvas_h}]")

if __name__ == "__main__":
    process_assets()
