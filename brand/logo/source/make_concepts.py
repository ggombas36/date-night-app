"""Generate the three round-1 logo concepts (black, 256 viewBox) and their lockups."""
import math
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "concepts"


def svg(body, w=256, h=256):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" '
            f'width="{w}" height="{h}">{body}</svg>\n')


def quad(t, p0, p1, p2):
    a, b, c = (1 - t) ** 2, 2 * (1 - t) * t, t ** 2
    return a * p0[0] + b * p1[0] + c * p2[0], a * p0[1] + b * p1[1] + c * p2[1]


# A: string lights. Two swags, three bulbs; only the next date (right) is lit.
def concept_a():
    parts = ['<path d="M14 70 Q71 128 128 70 Q185 128 242 70" fill="none" '
             'stroke="#000" stroke-width="9" stroke-linecap="round"/>']
    # unlit bulbs: cap + ring
    for x, y in ((71, 99), (128, 70)):
        parts.append(f'<rect x="{x - 7}" y="{y}" width="14" height="16" rx="2"/>')
        parts.append(f'<circle cx="{x}" cy="{y + 33}" r="15" fill="none" stroke="#000" stroke-width="8"/>')
    # lit bulb: bigger, solid
    x, y = 185, 99
    parts.append(f'<rect x="{x - 9}" y="{y}" width="18" height="18" rx="2"/>')
    parts.append(f'<circle cx="{x}" cy="{y + 44}" r="27"/>')
    return f'<g transform="translate(0 10)">{"".join(parts)}</g>'


# B: wax seal with a K cut out of it.
def concept_b():
    cx = cy = 128
    n, r = 16, 108
    pts = [(cx + r * math.cos(2 * math.pi * i / n - math.pi / 2),
            cy + r * math.sin(2 * math.pi * i / n - math.pi / 2)) for i in range(n)]
    chord = math.dist(pts[0], pts[1])
    bump = chord * 0.62
    d = f"M{pts[0][0]:.2f} {pts[0][1]:.2f}"
    for i in range(1, n + 1):
        x, y = pts[i % n]
        d += f" A{bump:.2f} {bump:.2f} 0 0 1 {x:.2f} {y:.2f}"
    d += " Z"
    k = [(90, 74), (116, 74), (116, 122), (153, 74), (185, 74), (136, 134),
         (188, 186), (155, 186), (116, 147), (116, 186), (90, 186)]
    d += " M" + " L".join(f"{x} {y}" for x, y in k) + " Z"
    return f'<path fill-rule="evenodd" d="{d}"/>'


# C: pendant lamp over our table.
def concept_c():
    return ('<rect x="123" y="18" width="10" height="50" rx="2"/>'
            '<path d="M56 136 A72 72 0 0 1 200 136 Z"/>'
            '<circle cx="128" cy="160" r="16"/>'
            '<rect x="58" y="206" width="140" height="12" rx="6"/>')


def lockup(symbol):
    text = ('<text x="296" y="112" font-family="Georgia, serif" font-style="italic" '
            'font-size="44">Kicsi\'s</text>'
            '<text x="294" y="186" font-family="Georgia, serif" font-size="76">Date Night</text>')
    return svg(f'<g transform="translate(16 16) scale(0.875)">{symbol}</g>{text}', w=760)


for key, fn in (("a-feny-fuzer", concept_a), ("b-pecset-k", concept_b), ("c-fuggolampa", concept_c)):
    body = fn()
    (OUT / f"{key}.svg").write_text(svg(body))
    (OUT / f"{key}-lockup.svg").write_text(lockup(body))
    print("wrote", key)
