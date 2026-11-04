# Logóhasználat

Készlet: `final/` (v1.0, 2026-11-01). Bemutató: `final/board/board.html`, képek: `final/board/slides/`.

## Fájlok

| Mire | Fájl |
|---|---|
| Jel, világos háttér | `final/svg/kamea.svg` (viasz `#8c2f39`) |
| Jel, sötét háttér | `final/svg/kamea-dark.svg` (világos viasz `#c4515d`) |
| Jel 48 px alatt | `final/svg/kamea-small.svg`, `kamea-small-dark.svg` (12 hullám, szélesebb rés, szemüvegszár nélkül) |
| Egyszínű | `kamea-black.svg`, `kamea-white.svg`, `kamea-mono-8c2f39.svg`, `kamea-mono-c4515d.svg` |
| Vízszintes lockup | `final/svg/horizontal.svg`, `horizontal-dark.svg` |
| Álló lockup | `final/svg/stacked.svg`, `stacked-dark.svg` |
| Csak szójel | `final/svg/wordmark.svg`, `wordmark-dark.svg` |
| Webikonok | `final/web/`: `favicon.ico`, `favicon.svg`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`, `maskable-512.png`, `site.webmanifest`, `head-snippet.html` |
| PNG | `final/png/` (jel 64, 256, 1024 px; lockupok 1600 px, átlátszó) |

A jelben a profilok valódi kivágások: a háttér látszik át rajtuk. Világos háttéren krém arcok, sötéten sötét arcok, ez így helyes.

## Színek

| Név | Hex | Hol |
|---|---|---|
| Viasz | `#8c2f39` | Jel világos háttéren (7.55:1 a `#fbf6ec`-n) |
| Világos viasz | `#c4515d` | Jel sötét háttéren (4.20:1 a `#16100c`-n) |
| Tinta | `#2a211c` | Szójel világos háttéren |
| Krém | `#f5e9d6` | Szójel sötét háttéren |

## Szabályok

- **Védőtér:** a pecsét magasságának negyede minden oldalon.
- **Legkisebb méret:** a teljes jel 48 px, alatta a `small` rajz (16-32 px). A vízszintes lockup legalább 160 px széles.
- **Háttér:** krém, fehér, a nappali kép világos része, sötét esti felület. Fotón csak nyugodt, egyszínű részen.
- **Ne:** forgasd, nyújtsd, árnyékold, tegyél rá átmenetet, színezd másképp a két profilt, cseréld a szójel betűjét.

## Szójel

Fraunces (Google Fonts, OFL): „Kicsi’s” 600 dőlt, „Date Night” 400 normál, -1 betűköz. A lockupokban a betű adat-URI-ként be van ágyazva, a szöveg nincs körvonalazva (a gépen nincs fontTools). Nyomdai vagy vektoros továbbadás előtt körvonalazni kell.

Az appban a szójel HTML szöveg Fraunces webbetűvel, nem kép.

## Újragenerálás

```bash
cd brand/logo/source
python3 make_final.py      # jel, sötét és kis változat
python3 make_lockups.py    # szójel és lockupok
```

Az egyszínű változatokat és a webikonokat a `logo-design` skill `export_variants.py` scriptje készíti a `kamea.svg`-ből, `--favicon-source kamea-small.svg` kapcsolóval.
