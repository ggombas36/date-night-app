# 03 Vizuális rendszer (javaslat)

Állapot: javaslat, a logóválasztás után véglegesítjük. A tokenek a kódban `src/index.css` `@theme` blokkjába kerülnek.

## Elvek

1. **A kép a főszereplő.** A heti háttérkép adja a hangulatot, a felület csendes papír rajta.
2. **Egy meghívó, egy hangsúly.** Képernyőnként egy fő elem (a következő randi), egy fő gomb.
3. **Papír, nem üveg.** Krémszínű lap, finom árnyék, nincs üveghatás, nincs neon, nincs átmenetes gomb.
4. **Nappal és este ugyanaz a rend.** A két téma csak színben és képben tér el, elrendezésben nem.

## Témák

A téma a rendszerbeállítást követi (`prefers-color-scheme`), kézzel is váltható. Világos téma: nappali kép (`week_<n>_day.jpg`). Sötét téma: esti kép (`week_<n>_night.jpg`).

### Nappal (világos)

| Token | Hex | Szerep | Kontraszt (háttér / lap) |
|---|---|---|---|
| `--bg` | `#fbf6ec` | Háttér, krémpapír | |
| `--surface` | `#ffffff` | Meghívólap | |
| `--text` | `#2a211c` | Cím, szöveg (tinta) | 14.63 / 15.76 |
| `--muted` | `#5e5048` | Másodlagos szöveg | 7.18 / 7.73 |
| `--accent` | `#8c2f39` | Viaszpecsét, link, fő gomb | 7.55 / 8.14, fehér rajta 8.14 |

### Este (sötét)

| Token | Hex | Szerep | Kontraszt (háttér / lap) |
|---|---|---|---|
| `--bg` | `#16100c` | Háttér | |
| `--surface` | `#221913` | Meghívólap | |
| `--text` | `#f5e9d6` | Cím, szöveg | 15.72 / 14.39 |
| `--muted` | `#c9b59c` | Másodlagos | 9.50 / 8.69 |
| `--accent` | `#f0b45e` | Izzófény, link, fő gomb | 10.23 / 9.37, sötét szöveg rajta 10.23 |

Minden szövegpár WCAG AA felett van (4.5:1). A felület kiemelése este borostyán.

### Pecsét (logó)

| Token | Hex | Szerep | Kontraszt |
|---|---|---|---|
| `--seal` (nappal) | `#8c2f39` | Logó, pecsét gomb | 7.55 a nappali háttéren |
| `--seal` (este) | `#c4515d` | Logó, pecsét gomb sötéten | 4.20 az esti háttéren, 3.85 a lapon |

A `#8c2f39` sötét háttéren csak 2.32:1 lenne, ezért este a világosabb viasz áll.

## Betű

Egy család: **Fraunces** (Google Fonts, OFL). Változó betű, optikai mérettel: nagy címen lágy, kicsi szövegen olvasható.

| Szint | Beállítás |
|---|---|
| Cím (h1) | 600, opsz 144, 36-44 px |
| Alcím | 500 italic, 20-24 px |
| Szöveg | 400, opsz 14, 17 px, sormagasság 1.55 |
| Címke, gomb | 600, 15 px |

Csak a használt súlyok töltődnek, `font-display: swap`.

## Kép

- Minden randinak lehet saját képpárja (nappal, este). Ha nincs, a legutóbbi pár marad.
- A képek álló formátumúak, telefonra készülnek. Asztali nézeten a kép a lap mögött, középre vágva, enyhén elhalványítva áll.
- Formátum: JPEG vagy WebP, legfeljebb 350 KB, 1024 px széles.

## Mozgás

Az `apple-design` skill elvei szerint: rövid, fizikai, megszakítható.

- **Pecsét felbontása:** a fő mozdulat. A pecsét feltörik, a lap kihajlik, a teljes leírás kinyílik. Rugós mozgás, kb. 500 ms.
- Minden más: 150-200 ms áttűnés.
- `prefers-reduced-motion` esetén csak áttűnés, mozgás nélkül.

## Komponensek (első kör)

| Komponens | Leírás |
|---|---|
| Meghívólap | Krém lap, 20 px sarok, finom árnyék, a pecsét a lap alján középen |
| Pecsét | A logójel accent színben, 64 px, gombként működik (`button`, címke: „Felbontom”) |
| Részletsor | Ikon nélkül, címke + érték: Mikor, Hova, Mit vegyél fel, Mit hozz |
| Emlékkártya | Kép, dátum, hely, egy mondat (második kör) |
