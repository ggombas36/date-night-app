"""Cameo seal (chosen direction, round 3): our profiles nose to nose, cut out of the wax seal.

Each profile is built from separate face and hair shapes. The hair carries a black outline:
on the black seal it disappears, over the white face it draws the hairline, so the hair
reads as hair and her neck separates from her hair.
"""
import math
import sys
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "concepts"


def svg(body, w=256, h=256):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" '
            f'width="{w}" height="{h}">{body}</svg>\n')


def seal_path(cx=128, cy=128, n=16, r=110):
    pts = [(cx + r * math.cos(2 * math.pi * i / n - math.pi / 2),
            cy + r * math.sin(2 * math.pi * i / n - math.pi / 2)) for i in range(n)]
    bump = math.dist(pts[0], pts[1]) * 0.62
    d = f"M{pts[0][0]:.2f} {pts[0][1]:.2f}"
    for i in range(1, n + 1):
        x, y = pts[i % n]
        d += f" A{bump:.2f} {bump:.2f} 0 0 1 {x:.2f} {y:.2f}"
    return d + " Z"


def path(cmds, ox, oy, flip=False):
    sx = -1 if flip else 1
    return " ".join(c + " ".join(f"{ox + sx * x:.1f} {oy + y:.1f}" for x, y in pts)
                    for c, *pts in cmds) + " Z"


# All shapes face right; origin = crown. x forward, y down.
HIS_FACE = [
    ("M", (-4, 0)), ("C", (6, 0), (14, 6), (18, 16)), ("C", (21, 24), (22, 32), (22, 37)),
    ("C", (21, 40), (19, 42), (19, 44)), ("C", (22, 48), (27, 53), (30, 58)),
    ("C", (28, 61), (25, 62), (22, 62)), ("C", (24, 65), (24, 67), (22, 69)),
    ("C", (24, 71), (24, 73), (21, 75)), ("C", (19, 77), (20, 80), (22, 84)),
    ("C", (22, 88), (19, 91), (14, 92)), ("C", (9, 93), (4, 95), (2, 98)),
    ("L", (2, 122)), ("L", (-20, 122)), ("L", (-20, 96)), ("C", (-22, 92), (-25, 89), (-26, 86)),
    ("C", (-38, 70), (-40, 40), (-32, 18)), ("C", (-26, 6), (-16, 0), (-4, 0)),
]
# Middle part, curtains falling to both sides: volume on top, the front curtain drops past
# the forehead to the brow, the side covers the ear and ends at the nape.
HIS_HAIR = [
    ("M", (-28, 78)), ("C", (-46, 64), (-50, 34), (-40, 12)), ("C", (-32, -4), (-10, -10), (6, -6)),
    ("C", (20, -2), (28, 12), (28, 24)), ("C", (28, 30), (26, 35), (23, 38)),
    ("C", (21, 34), (18, 32), (15, 33)), ("C", (13, 29), (10, 27), (7, 28)),
    ("C", (3, 32), (0, 38), (-6, 41)), ("C", (-14, 42), (-20, 46), (-21, 54)),
    ("C", (-22, 62), (-24, 70), (-28, 78)), ("Z",),
]
HER_FACE = [
    ("M", (-4, 0)), ("C", (6, 0), (13, 6), (17, 16)), ("C", (20, 24), (21, 31), (21, 36)),
    ("C", (20, 39), (18, 41), (18, 43)), ("C", (21, 47), (25, 51), (27, 56)),
    ("C", (25, 59), (22, 60), (20, 60)), ("C", (23, 63), (23, 66), (20, 68)),
    ("C", (23, 70), (23, 73), (19, 75)), ("C", (18, 78), (19, 81), (20, 84)),
    ("C", (20, 87), (17, 89), (12, 89)), ("C", (6, 89), (1, 91), (0, 96)),
    ("L", (0, 124)), ("L", (-17, 124)), ("L", (-17, 96)), ("C", (-19, 93), (-21, 91), (-22, 90)),
    ("C", (-34, 72), (-38, 40), (-30, 18)), ("C", (-24, 6), (-14, 0), (-4, 0)),
]
# Long hair with a side part, tucked behind the ear and falling down her back,
# with a gap between the hair and the back of her neck.
HER_HAIR = [
    ("M", (10, 5)), ("C", (2, -6), (-20, -8), (-34, 4)), ("C", (-50, 18), (-52, 50), (-50, 80)),
    ("C", (-49, 98), (-48, 110), (-46, 120)), ("L", (-30, 120)),
    ("C", (-29, 110), (-28, 100), (-27, 90)), ("C", (-25, 80), (-22, 72), (-21, 64)),
    ("C", (-20, 50), (-16, 36), (-8, 26)), ("C", (-2, 18), (4, 10), (10, 5)), ("Z",),
]

HIS_JAW = [("M", (9, 92)), ("C", (2, 90), (-6, 86), (-13, 77))]
HIS_EAR = [("M", (-12, 50)), ("C", (-20, 48), (-22, 62), (-14, 66))]
HER_JAW = [("M", (7, 89)), ("C", (0, 87), (-7, 83), (-13, 75))]


def profile(face, hair, ox, oy, flip, details=()):
    out = f'<path d="{path(face, ox, oy, flip)}" fill="#fff"/>'
    for d in details:
        out += (f'<path d="{path(d, ox, oy, flip)[:-2]}" fill="none" stroke="#000" '
                'stroke-width="3" stroke-linecap="round"/>')
    hair_cmds = [c for c in hair if c[0] != "Z"]
    out += f'<path d="{path(hair_cmds, ox, oy, flip)}" fill="#fff" stroke="#000" stroke-width="4" stroke-linejoin="round"/>'
    return out


def concept(scale=1.0):
    him = profile(HIS_FACE, HIS_HAIR, 96, 64, False, (HIS_JAW, HIS_EAR))
    her = profile(HER_FACE, HER_HAIR, 164, 68, True, (HER_JAW,))
    # her glasses: lens in front of the eye, arm back to the ear (into the hair)
    gx, gy = 164 - 12, 68 + 44
    glasses = (f'<circle cx="{gx}" cy="{gy}" r="8.5" fill="#fff" stroke="#000" stroke-width="4"/>'
               f'<path d="M{gx + 8} {gy - 2} L{gx + 22} {gy - 3}" stroke="#000" stroke-width="4" '
               'stroke-linecap="round"/>')
    people = f'<g transform="translate(128 128) scale({scale}) translate(-128 -128)">{him}{her}{glasses}</g>'
    return f'<path d="{seal_path()}"/>{people}'


if __name__ == "__main__":
    name = sys.argv[1] if len(sys.argv) > 1 else "b-kamea-v3"
    (OUT / f"{name}.svg").write_text(svg(concept()))
    print("wrote", name)
