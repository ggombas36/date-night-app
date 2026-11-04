"""Round-2 logo concepts: the two of us, drawn from the OG illustrations."""
import math
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


# D: selfie. Two busts leaning in: his swept fringe and happy closed eyes, her long hair and glasses.
def concept_d():
    him = (
        '<path d="M30 256 Q32 206 96 202 Q156 206 160 256 Z"/>'
        '<ellipse cx="96" cy="138" rx="42" ry="48" fill="#fff" stroke="#000" stroke-width="8"/>'
        '<path d="M52 142 C46 98 70 76 100 78 C116 66 146 64 152 84 C142 84 136 92 140 108 '
        'C120 98 92 102 70 108 C62 118 56 128 52 142 Z"/>'
        '<path d="M74 140 Q82 131 90 140 M104 140 Q112 131 120 140" fill="none" stroke="#000" '
        'stroke-width="6" stroke-linecap="round"/>'
        '<path d="M84 160 Q97 172 110 160" fill="none" stroke="#000" stroke-width="6" stroke-linecap="round"/>'
    )
    her = (
        '<g transform="rotate(-7 166 150)">'
        '<path d="M118 152 C114 100 138 82 166 82 C196 82 218 102 214 152 C214 196 222 218 228 236 '
        'L104 236 C112 214 118 194 118 152 Z" stroke="#fff" stroke-width="6"/>'
        '<path d="M112 256 Q116 212 166 208 Q220 212 226 256 Z" stroke="#fff" stroke-width="6"/>'
        '<ellipse cx="166" cy="146" rx="38" ry="44" fill="#fff" stroke="#000" stroke-width="8"/>'
        '<path d="M126 142 C124 108 142 90 168 90 C192 90 208 108 206 142 C196 120 180 108 156 108 '
        'C146 118 136 128 126 142 Z"/>'
        '<circle cx="152" cy="146" r="11" fill="none" stroke="#000" stroke-width="6"/>'
        '<circle cx="181" cy="146" r="11" fill="none" stroke="#000" stroke-width="6"/>'
        '<path d="M163 145 L170 145" stroke="#000" stroke-width="5"/>'
        '<path d="M154 168 Q166 178 178 168" fill="none" stroke="#000" stroke-width="6" stroke-linecap="round"/>'
        '</g>'
    )
    return him + her


# E: cameo seal. Our profiles nose to nose (OG10), cut out of the wax seal.
HIM = [  # facing right, origin = crown
    ("M", (0, 0)), ("C", (-26, -2), (-46, 18), (-46, 42)), ("C", (-46, 60), (-40, 72), (-32, 78)),
    ("L", (-30, 108)), ("L", (4, 108)), ("L", (6, 88)), ("C", (12, 86), (18, 84), (20, 80)),
    ("C", (22, 76), (21, 73), (19, 71)), ("C", (22, 69), (23, 66), (20, 63)),
    ("C", (24, 61), (26, 59), (24, 56)), ("L", (30, 50)), ("C", (26, 44), (22, 38), (21, 32)),
    ("C", (23, 26), (22, 18), (18, 12)), ("C", (26, 8), (30, -2), (24, -10)),
    ("C", (18, -4), (10, -2), (0, 0)),
]
HER_HAIR = [  # long hair down her back, replaces the nape and the quiff
    ("M", (0, 0)), ("C", (-28, -2), (-48, 18), (-48, 46)), ("C", (-48, 76), (-52, 96), (-58, 116)),
    ("L", (-30, 112)), ("L", (2, 112)), ("L", (5, 90)), ("C", (11, 88), (17, 85), (19, 81)),
    ("C", (21, 77), (20, 74), (18, 72)), ("C", (21, 70), (22, 67), (19, 64)),
    ("C", (23, 62), (25, 60), (23, 57)), ("L", (28, 51)), ("C", (25, 45), (21, 39), (20, 33)),
    ("C", (22, 27), (21, 19), (17, 13)), ("C", (16, 6), (10, 1), (0, 0)),
]


def profile(cmds, ox, oy, flip=False):
    sx = -1 if flip else 1
    out = []
    for c, *pts in cmds:
        out.append(c + " ".join(f"{ox + sx * x:.1f} {oy + y:.1f}" for x, y in pts))
    return " ".join(out) + " Z"


def concept_e():
    him = profile(HIM, 96, 70)
    her = profile(HER_HAIR, 160, 76, flip=True)
    # her glasses: lens at the eye, arm towards the ear
    gx, gy = 160 - 13, 76 + 40
    glasses = (f'<circle cx="{gx}" cy="{gy}" r="8" fill="none" stroke="#000" stroke-width="4"/>'
               f'<path d="M{gx + 8} {gy - 1} L{gx + 30} {gy - 4}" stroke="#000" stroke-width="4" '
               'stroke-linecap="round"/>')
    return (f'<path d="{seal_path()}"/>'
            f'<path d="{him}" fill="#fff"/><path d="{her}" fill="#fff"/>{glasses}')


# F: the hug (OG1, OG6). He holds her from behind, his arm across her shoulders.
def concept_f():
    him = (
        '<path d="M40 256 Q42 214 90 206 L150 256 Z"/>'
        '<ellipse cx="96" cy="112" rx="38" ry="44" fill="#fff" stroke="#000" stroke-width="8"/>'
        '<path d="M56 116 C50 74 74 54 102 56 C118 44 148 44 152 64 C140 64 134 72 138 88 '
        'C118 78 94 82 72 88 C64 96 60 104 56 116 Z"/>'
        '<path d="M78 116 Q86 108 94 116 M106 116 Q114 108 122 116" fill="none" stroke="#000" '
        'stroke-width="6" stroke-linecap="round"/>'
        '<path d="M88 134 Q100 144 112 134" fill="none" stroke="#000" stroke-width="6" stroke-linecap="round"/>'
    )
    her = (
        '<g stroke="#fff" stroke-width="6">'
        '<path d="M118 150 C114 104 136 86 162 86 C190 86 210 104 206 150 C206 190 214 214 220 232 '
        'L104 232 C112 212 118 192 118 150 Z"/>'
        '<path d="M100 256 Q104 214 160 210 Q216 214 222 256 Z"/>'
        '</g>'
        '<ellipse cx="162" cy="148" rx="36" ry="42" fill="#fff" stroke="#000" stroke-width="8"/>'
        '<path d="M124 144 C122 112 140 94 164 94 C188 94 202 112 200 144 C192 124 178 112 156 112 '
        'C146 120 134 130 124 144 Z"/>'
        '<circle cx="149" cy="148" r="11" fill="none" stroke="#000" stroke-width="6"/>'
        '<circle cx="177" cy="148" r="11" fill="none" stroke="#000" stroke-width="6"/>'
        '<path d="M160 147 L166 147" stroke="#000" stroke-width="5"/>'
        '<path d="M150 170 Q162 180 174 170" fill="none" stroke="#000" stroke-width="6" stroke-linecap="round"/>'
        # his forearm across her shoulders: skin = white with outline, like the faces
        '<path d="M58 236 C104 210 160 206 206 220" fill="none" stroke="#fff" stroke-width="40" stroke-linecap="round"/>'
        '<path d="M58 236 C104 210 160 206 206 220" fill="none" stroke="#000" stroke-width="30" stroke-linecap="round"/>'
        '<path d="M58 236 C104 210 160 206 206 220" fill="none" stroke="#fff" stroke-width="16" stroke-linecap="round"/>'
    )
    return him + her


def lockup(symbol):
    text = ('<text x="296" y="112" font-family="Georgia, serif" font-style="italic" '
            'font-size="44">Kicsi\'s</text>'
            '<text x="294" y="186" font-family="Georgia, serif" font-size="76">Date Night</text>')
    return svg(f'<g transform="translate(16 16) scale(0.875)">{symbol}</g>{text}', w=760)


if __name__ == "__main__":
    for key, fn in (("d-szelfi", concept_d), ("e-kamea-pecset", concept_e), ("f-oleles", concept_f)):
        body = fn()
        (OUT / f"{key}.svg").write_text(svg(body))
        (OUT / f"{key}-lockup.svg").write_text(lockup(body))
        print("wrote", key)
