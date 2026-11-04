"""Final cameo-seal mark: real cut-outs (fill-rule evenodd), so every colour variant is one paint.

Geometry comes unchanged from the approved round-2 concept (make_round2.concept_e).
Writes logo/final/svg/kamea.svg (master, wax colour), kamea-dark.svg (lighter wax for dark
backgrounds), kamea-small.svg and kamea-small-dark.svg (simplified drawing for 16-32 px).
"""
import math
from pathlib import Path

from make_round2 import HER_HAIR, HIM, profile, seal_path, svg

OUT = Path(__file__).resolve().parent.parent / "final" / "svg"
WAX = "#8c2f39"
WAX_DARK = "#c4515d"


def ring(cx, cy, r_out, r_in):
    def circle(r):
        return f"M{cx - r} {cy} a{r} {r} 0 1 0 {2 * r} 0 a{r} {r} 0 1 0 {-2 * r} 0 Z"
    return circle(r_out) + " " + circle(r_in)


def capsule(x1, y1, x2, y2, w):
    """A straight line with round caps, as a filled outline."""
    dx, dy = x2 - x1, y2 - y1
    ln = math.hypot(dx, dy)
    nx, ny = -dy / ln * w / 2, dx / ln * w / 2
    r = w / 2
    return (f"M{x1 + nx:.2f} {y1 + ny:.2f} L{x2 + nx:.2f} {y2 + ny:.2f} "
            f"A{r} {r} 0 0 0 {x2 - nx:.2f} {y2 - ny:.2f} L{x1 - nx:.2f} {y1 - ny:.2f} "
            f"A{r} {r} 0 0 0 {x1 + nx:.2f} {y1 + ny:.2f} Z")


def mark(color, small=False):
    shift = 6 if small else 0  # small cut: wider gap so the faces stay apart at 16 px
    seal = seal_path(n=12) if small else seal_path()
    him = profile(HIM, 96 - shift, 70)
    her = profile(HER_HAIR, 160 + shift, 76, flip=True)
    gx, gy = 160 + shift - 13, 76 + 40
    if small:
        glasses = f'<path fill-rule="evenodd" d="{ring(gx, gy, 12, 6)}"/>'
    else:
        glasses = (f'<path fill-rule="evenodd" d="{ring(gx, gy, 10, 6)}"/>'
                   f'<path d="{capsule(gx + 8, gy - 1, gx + 30, gy - 4, 4)}"/>')
    return svg(f'<g fill="{color}"><path fill-rule="evenodd" d="{seal} {him} {her}"/>{glasses}</g>')


if __name__ == "__main__":
    OUT.mkdir(exist_ok=True)
    for name, body in (("kamea", mark(WAX)), ("kamea-dark", mark(WAX_DARK)),
                       ("kamea-small", mark(WAX, small=True)),
                       ("kamea-small-dark", mark(WAX_DARK, small=True))):
        (OUT / f"{name}.svg").write_text(body)
        print("wrote", name)
