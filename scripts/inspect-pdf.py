import pymupdf

doc = pymupdf.open("logo-Russa.pdf")
p0 = doc[0]
drawings = p0.get_drawings()
for i in range(26):
    d = drawings[i]
    r = d["rect"]
    print(f"{i:2d}: rect=({r.x0:.1f}, {r.y0:.1f}, {r.x1:.1f}, {r.y1:.1f}) fill={d.get('fill')} color={d.get('color')}")
