# 04 Logó

Állapot: **döntve, a készlet kész (v1.0, 2026-11-01).** Végleges jel: Kámea pecsét (2. kör, változatlan geometria). Fájlok: `logo/final/`, használat: [logo/usage.md](logo/usage.md), bemutató: `logo/final/board/board.html`.

## Végleges készlet

| Elem | Állapot |
|---|---|
| Jel valódi kivágásokkal (egy festék, `evenodd`) | kész, audit 99/100 |
| Sötét háttérre: világos viasz `#c4515d` | kész |
| Kis rajz 16-32 px-re: 12 hullám, szélesebb rés, szemüvegszár nélkül | kész |
| Fekete, fehér, két egyszínű változat, négyzetes, app ikon | kész |
| Webikonok: favicon.ico/svg, apple-touch-icon, 192, 512, maskable, webmanifest | kész |
| Szójel és lockupok (vízszintes, álló), világos és sötét | kész, Fraunces beágyazva, nincs körvonalazva |
| Bemutató tábla mockupokkal | kész (a mockupok név- és domainadata helyőrző) |

## Előzmények

1. kör áttekintő: `logo/concepts/concepts-round1.png`. Generálás: `logo/source/make_concepts.py`.

## Rövid

| | |
|---|---|
| Név a logóban | Kicsi's Date Night |
| Jelzők | Meghitt, játékos, gondos |
| Kerülendő | Szív, rózsa, gyűrű, koccintó poharak, naptár, térképtű, átmenet |
| Működjön | 16 px favicon, kezdőképernyő ikon, a meghívó pecsétje az appban, egyszínűen és fordítva |

## A három koncepció

Közös szabály: egy forma, átmenet nélkül, szürkeskálán. A szójel a koncepciókban Georgia betűvel áll (helyőrző, élő szöveg). A végleges szójel Fraunces betűből, kontúrozva készül.

| | Ötlet | Erős | Gyenge |
|---|---|---|---|
| **A Fényfüzér** | Két ív, három izzó, csak a következő ég | Mindkét képen ott van; rendszerré bővíthető (idővonal: égő izzó = volt randi) | 16 px-en szétesik, kell egy egyszerűsített kis rajz. Az 1. változat nyakláncnak tűnt, ezért átrajzoltam |
| **B Pecsét K** | Viaszpecsét, benne kivágott K | A fő mozdulat maga (ízelítő → felbontás). 16 px-en is tiszta. Személyes (K = Kicsi) | A pecsét önmagában ismert forma, a K-t még egyedibbé kell rajzolni |
| **C Függőlámpa** | Lámpa a mi asztalunk fölött | Mindkét képen ott van, nappal és este is | Harangnak vagy lámpabolt logójának is olvasható |

## Ajánlás: B Pecsét K

Ez az egyetlen jel, amely a fő funkciót is elmondja. A meghívó lezárt, a pecsétet Kicsi töri fel. A pecsét ugyanaz a forma a logóban, az ikonon és az app fő gombján, így a logóból lesz a felület legfontosabb eleme. Kis méretben mindhárom közül ez a legerősebb.

Továbbfejlesztés, ha ez lesz: a K egyedi rajza (lágyabb, kalligrafikus szár, a Fraunces italicból), a pecsét széle szabálytalanabb (valódi viasz), pecsétszín `#8c2f39`.

## Tesztek (1. kör)

| Teszt | A | B | C |
|---|---|---|---|
| SVG audit (heurisztika) | 97/100 | 99/100 | 98/100 |
| 16 px | gyenge | jó | közepes |
| Egyszínű | igen | igen | igen |

Védjegyszűrés nem szükséges: magáncélú app.

## 2. kör: kettőnk alakja (2026-11-01)

Gergely kérése: a jel a közös rajzolt képekből (`OG_projects/date_night/date-night-app/src/assets/photos/OG1-OG22.png`) induljon, kettőjük alakjából vagy fejéből. Áttekintő: `logo/concepts/concepts-round2.png`. Generálás: `logo/source/make_round2.py`.

Karakterjegyek a képekről: Kicsi hosszú barna haj, kerek szemüveg, mosoly. Gergely felfelé söpört frufru, gyakran lehunyt, mosolygó szem. Visszatérő pózok: összehajló fejek (OG4, OG15, OG18), orr az orrhoz (OG10), ölelés hátulról (OG1, OG6).

| | Ötlet | Erős | Gyenge |
|---|---|---|---|
| **A Szelfi** | Két mellkép összehajolva, frufru és lehunyt szem, szemüveg és hosszú haj | A legközelebb áll a rajzolt képek stílusához, azonnal „ti ketten” | Avatar-jelleg, 16 px-en csak két folt. A frufru még sisakszerű |
| **B Kámea pecsét** | Két profil orr az orrhoz, a viaszpecsétbe vágva | Egyesíti az 1. kör pecsétjét (meghívó, felbontás) a személyességgel. Klasszikus kámea, időtálló | 16 px-en a profilok összefolynak, ehhez egyszerűsített kis rajz kell (csak pecsét és szemüveg) |
| **C Ölelés** | Hátulról átölelve, alkar a vállán | A legmelegebb póz | A kar még sálnak olvasható, és a jel túl részletes. Ebben a formában nem javaslom |

Ajánlás: **B Kámea pecsét** a logónak és a pecsét gombnak. Az **A Szelfi** rajzstílusa közben jó karakterkészlet az appon belül (üres állapot, emlékek, betöltés), így a két irány kiegészíti egymást.

## Döntés (2026-11-01)

**Végleges irány: a 2. kör B Kámea pecsétje változatlanul** (`logo/concepts/e-kamea-pecset.svg`, generálás: `logo/source/make_round2.py`, `concept_e`). A 3. kör átrajzolását (v3-v7) Gergely elvetette: túl drasztikus és kirívó lett. A v3-v7 fájlok csak előzményként maradnak, nem használjuk őket.

Kipróbált, elvetett finomítás (2026-11-01): Kicsi nyaka beljebb, rövidebb áll alatti vonallal (`kamea-nyak-compare.png`, `kamea-nyak-zoom.png`, a „Most” oldal). Gergely döntése: marad az eredeti. SVG audit 97/100.

## 3. kör: Kámea pecsét finomítása (elvetve)

Gergely döntése: **B Kámea pecsét**. Kérések: a fiú haja hosszabb, középen elválasztott, két oldalra omló; a lánynál kisebb toka, kiemelt áll és nyak, a nyak váljon el a hajtól; mindkét arc karcsú, de illeszkedjen az alakjukhoz.

Jelenlegi változat: `logo/concepts/b-kamea-v7.svg`, összehasonlítás: `logo/concepts/kamea-v7-compare.png`. Generálás: `python3 logo/source/make_kamea.py <név>`. A köztes lépések (v3-v6) a `concepts/` mappában maradnak.

Felépítés: minden profil külön arc- és hajformából áll. A haj fekete körvonala a fekete pecséten eltűnik, az arc fölött kirajzolja a hajvonalat.

| Változás | Hogyan |
|---|---|
| Fiú haja | Középen elválasztott függöny: dús tető, a homlok előtt hullámos függönyvég a szemöldök fölött, oldalt a fül mögött záródik. Látszik a fül |
| Lány álla és nyaka | Rövid állkapocsvonal az álltól a fül felé, az áll alatt éles törés a nyak felé, a haj és a tarkó között fekete rés |
| Karcsúbb arcok | Keskenyebb nyak (fiú 22, lány 17 egység), hosszabb arcarány, a koponya hátsó íve beljebb |

Teszt: SVG audit 97/100. 32 px-en a két arc és a szemüveg olvasható, 16 px-en nem: a faviconhoz egyszerűsített rajz kell (pecsét két profillal, részletek nélkül).

Tesztek (2. kör): SVG audit A 80, B 97, C 81 (heurisztika; A és C pontlevonása a fehér körvonalas átfedésekből jön, a végleges rajzban ezek valódi kivágások lesznek).
