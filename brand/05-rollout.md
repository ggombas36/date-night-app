# 05 V2 bevezetés

A Sitewright prémium pipeline sorrendje egy személyes appra szabva: brand, tartalom, design spec, review, build, QA. Kód csak jóváhagyott spec után. Minden lépés végén `npm run build` és `npm run lint` hibátlan.

| # | Lépés | Kész, ha | Állapot |
|---|---|---|---|
| 1 | Brand: brief, stratégia, hang, logókoncepciók | `brand/` 00-04 megvan, egy logóirány kiválasztva | kész (Kámea pecsét) |
| 2 | Logókészlet és tokenek | Végleges SVG jel és szójel, favicon, apple-touch-icon, webmanifest; 03 paletta jóváhagyva | készlet kész (`logo/final/`), paletta jóváhagyásra vár |
| 3 | Tartalommodell | A valódi app tervei (`src/data/datePlans.json`, JSONBin) két opcionális mezőt kapnak: `hint`, `opensAt`. A meglévő 16 terv változatlan | leírva a [design-spec.md](design-spec.md) 9. pontjában, kódban nincs |
| 4 | Design spec | `brand/design-spec.md`: képernyők (A-I), 375 / 768 / 1280 px, mozgás, állapotok | kész |
| 5 | Design review | A spec megfelel a 02 hangnak, 03 rendszernek és a Sitewright 05-ux-principles mércének; `Status: approved` | kész (2026-11-04), a spec 0. pontjának megerősítése vár |
| 6 | Build: alap | Tokenek `@theme`-ben, Fraunces, nappal/este téma képcserével, kézi váltó villogás nélkül | kész (2026-11-04): tokenek, Fraunces, téma (egy körbeváltó gomb), képek 117 MB helyett kb. 2 MB |
| 7 | Build: meghívó | Következő randi kártya, pecsét felbontása (rugós mozgás, reduced-motion), lezárt és felbontott állapot | kész (2026-11-04): B, C, D, E állapot, belépő, emlékek, admin szerkesztő, törlés-megerősítés |
| 8 | QA | 375 / 768 / 1280 px vízszintes görgetés nélkül, billentyűvel bejárható, kontraszt, Lighthouse mobil 90+ | részben: `npm run build` és `lint` hibátlan; 375 / 768 / 1280 px görgetés nélkül, nappal és este, pecsét felbontása, szerkesztő megnyitása és Esc böngészőben ellenőrizve. Hátra: Lighthouse, mentés és törlés az élő adaton (szándékosan nem futott), Kicsi nézet valódi telefonon |
| 9 | Emlékek (2. kör) | Volt randi: kép, helyszín, élmény. Tárolás döntése előtte (helyi fájl vagy szinkronizált tár) | |
