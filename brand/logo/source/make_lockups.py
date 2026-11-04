"""Wordmark and lockups. Fraunces (OFL) is embedded as a data URI, so the SVGs render
without network; the letters stay live text (not outlined, fontTools is not installed).
Writes logo/final/svg/{wordmark,horizontal,stacked}{,-dark}.svg.
"""
import base64
from pathlib import Path

from make_final import WAX, WAX_DARK, mark

HERE = Path(__file__).resolve().parent
OUT = HERE.parent / "final" / "svg"
INK, INK_DARK = "#2a211c", "#f5e9d6"


def font_face():
    def face(file, style, weight):
        data = base64.b64encode((HERE / "fonts" / file).read_bytes()).decode()
        return (f"@font-face{{font-family:'Fraunces';font-style:{style};font-weight:{weight};"
                f"src:url(data:font/woff2;base64,{data}) format('woff2');}}")
    return ("<style>" + face("fraunces-normal-400-latin.woff2", "normal", 400)
            + face("fraunces-italic-600-latin.woff2", "italic", 600) + "</style>")


def words(x, y, ink, anchor="start", small=52, big=92, gap=80):
    a = f'text-anchor="{anchor}"'
    return (f'<text x="{x}" y="{y}" {a} font-family="Fraunces, serif" font-style="italic" '
            f'font-weight="600" font-size="{small}" fill="{ink}">Kicsi’s</text>'
            f'<text x="{x}" y="{y + gap}" {a} font-family="Fraunces, serif" font-weight="400" '
            f'font-size="{big}" fill="{ink}" letter-spacing="-1">Date Night</text>')


def symbol(color):
    return mark(color).split(">", 1)[1].rsplit("</svg>", 1)[0]


def doc(w, h, body):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" '
            f'height="{h}">{font_face()}{body}</svg>\n')


if __name__ == "__main__":
    for suffix, wax, ink in (("", WAX, INK), ("-dark", WAX_DARK, INK_DARK)):
        (OUT / f"wordmark{suffix}.svg").write_text(doc(500, 170, words(6, 62, ink)))
        (OUT / f"horizontal{suffix}.svg").write_text(
            doc(800, 256, f'<g>{symbol(wax)}</g>' + words(292, 106, ink)))
        (OUT / f"stacked{suffix}.svg").write_text(
            doc(520, 480, f'<g transform="translate(132 0)">{symbol(wax)}</g>'
                + words(260, 330, ink, anchor="middle")))
        print("wrote lockups", suffix or "(light)")
