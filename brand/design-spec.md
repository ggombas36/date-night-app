# Design spec: Kicsi's Date Night v2

Status: **approved** (2026-11-04, design review után; a 0. pont alapértelmezéseit Gergely még megerősíti) · Verzió: 2

Design Read: csendes papírmeghívó egy kép előtt (nappal kert, este fényfüzér); egyetlen hangsúly képernyőnként, a pecsét.

Alap: [01-strategy.md](01-strategy.md), [02-voice.md](02-voice.md), [03-visual-system.md](03-visual-system.md), [logo/usage.md](logo/usage.md). Kódbázis: ez a repó (`date_night`, ág: `v2-rebrand`).

## 0. Alapértelmezések (egy sorral felülírhatók)

| Kérdés | Alapérték | Hatás, ha mást kérsz |
|---|---|---|
| Név | **Kicsi's Date Night** (a logó és a brand ezt használja; az élő app „OG's Date Night”) | `index.html`, `Login`, `DateNightCard` fejléc, lockup fájlok |
| Felület nyelve | **Angol**, mert mind a 16 terv angol. A magyar szabályok (02-voice) angolra átültetve: tegező egyes szám, konkrétum, nincs em dash, felkiáltójel, emoji a felületen | Szövegtábla a 7. pontban |
| Emoji a tervekben | **Marad**: a te szöveged (cím, leírás, lista). A felületen (gombok, címkék) nincs | Egy `stripEmoji` a megjelenítésben |
| Biztonság | **Külön feladat, nem része a v2-nek.** Lásd 11. pont | |

## 1. Mi marad, mi változik

**Marad (funkció):** belépés, két szerepkör (Kicsi, admin), tervek böngészése, admin: új, szerkesztés, törlés, fotógaléria, JSONBin API (`dateApiServices.ts`) helyi JSON tartalékkal, Netlify deploy.

**Változik (megjelenés):** a zöld (emerald) paletta, az üvegkártyák (`rgba .1` + blur), a piros Logout, az „OG's Date Night App” fejléc, az angol UI-szövegek stílusa. Új: pecsétes meghívó (lezárt és felbontott állapot), nappali és esti téma, Fraunces betű, logó a belépőn és a fejlécben.

## 2. Tokenek

`src/index.css`, Tailwind 4 `@theme` blokk. A téma a rendszerbeállítást követi, kézzel is váltható (`data-theme="light|dark"` a `<html>`-en, `localStorage` `theme`, villogás nélkül: inline script az `index.html`-ben).

| Token | Nappal | Este | Szerep |
|---|---|---|---|
| `--bg` | `#fbf6ec` | `#16100c` | Háttérszín a kép mögött, betöltés alatt |
| `--surface` | `#ffffff` | `#221913` | Meghívólap |
| `--text` | `#2a211c` | `#f5e9d6` | Cím, szöveg |
| `--muted` | `#5e5048` | `#c9b59c` | Másodlagos szöveg |
| `--accent` | `#8c2f39` | `#f0b45e` | Link, fókuszgyűrű, fő gomb háttere (nappal) |
| `--accent-fg` | `#ffffff` | `#16100c` | Szöveg a fő gombon |
| `--seal` | `#8c2f39` | `#c4515d` | Pecsét, logó |
| `--rule` | `#2a211c` 14% | `#f5e9d6` 14% | Hajszálvonal |

Kontraszt (számolva, 03-visual-system): minden szövegpár 7:1 fölött. Pecsét este 4.20:1 (nagy grafika, 3:1 elég).

Forma: lap sarok 20 px, gomb 12 px, hajszálvonal 1 px, árnyék `0 10px 30px rgba(42,33,28,.18)` (este `rgba(0,0,0,.5)`). Nincs blur, nincs üveghatás, nincs átmenetes gomb.

## 3. Betű

Fraunces (OFL), önállóan hosztolva, `font-display: swap`. Fájlok a `src/assets/fonts/` alá, `latin` és `latin-ext` (az „ő, ű” miatt): `normal 400`, `normal 600`, `italic 600`. A repóban most csak `normal 400` és `italic 600` van meg a `Digital_product/marka/betuk/web` mappában, a `normal 600`-hoz a `Digital_product/marka/betuk/src/fetch_fonts.py` kell (build 6. lépés).

| Szint | Beállítás |
|---|---|
| Terv címe (h2) | normal 600, 28 px (mobil) / 34 px, sormagasság 1.2 |
| Dátum | italic 600, 18 px, `--muted` |
| Szöveg | normal 400, 17 px, sormagasság 1.6 |
| Lista | normal 400, 17 px |
| Címke, gomb | normal 600, 15 px |

Szövegblokk: `max-width: 60ch`, a flex és grid gyerekekben `min-width: 0`, a címen `overflow-wrap: anywhere`, hogy keskeny oszlopban sem törjön 4-5 karakterenként. Gombok és fülek angol szöveggel is elférnek 320 px-en (nincs `white-space: nowrap` fix szélességgel).

A tervek szövege `*...*` csillagjelölést tartalmaz („the *real* cat cafe”): a megjelenítésben dőlt (`<em>`), nem látszik a csillag.

## 4. Elrendezés

Mobil elsődleges (375 px). Egy oszlop, a lap kitölti a szélességet 16 px peremmel, magassága tartalomé (nem `h-[90vh]`), a háttérkép `fixed`, a lap görget, nem a belső div.

| Szélesség | Lap | Háttér |
|---|---|---|
| < 768 | 100% - 32 px | `*_mobile` kép, `cover`, `fixed` |
| 768-1279 | max 520 px, középen | `*_desktop` kép |
| >= 1280 | max 560 px, középen | `*_desktop` kép, a lap két oldalán a képből látszik |

Fejléc (sticky, 56 px, `--surface` 92%): bal oldalt a **kis jel** (`kamea-small`, 32 px) és mellette a szójel („Kicsi's Date Night” HTML szövegként), jobb oldalt témaváltó és `Log out` szöveggomb. Nincs piros gomb. Alul mobilon 2 fülű sáv (`Next date`, `Memories`), asztalin a fejléc alatt ugyanaz vízszintesen. A fülsáv 48 px, aktív fül aláhúzott és `aria-current`.

A verziószöveg („© 2025.05.15 V2.3.1”) a lábléc kis szövege lesz, nem lebeg a lap fölött. Értéke `2.0.0`.

## 5. Képernyők és állapotok

| # | Képernyő | Mikor | Tartalom |
|---|---|---|---|
| A | Belépés | Nincs bejelentkezve | Lap: nagy pecsét (96 px), szójel, két mező, `Come in` gomb, hibaüzenet a mezők alatt (`role="alert"`, `aria-describedby`) |
| B | Lezárt meghívó | A terv dátuma jövőbeli és nincs felbontva | Pecsét, dátum, `teaser`, gomb |
| C | Még nem bontható | `opensAt` jövőbeli | Mint B, a gomb helyén `Opens Fri 7 Nov, 9:00` (nem gomb, szöveg) |
| D | Felbontott meghívó | Felbontva, vagy a dátum elmúlt, vagy admin | Cím, dátum, leírás, `The plan` lista |
| E | Nincs közelgő | Minden terv múltbeli | D állapot a legutóbbi tervvel, a lap tetején `Last time` címke, alján `The next invitation is still being written.` |
| F | Emlékek | `Memories` fül | Fotórács, kártya: kép 2:3, alatta cím és dátum |
| G | Szerkesztő (admin) | Admin, ceruza gomb | Lásd 8. pont |
| H | Betöltés | API hívás alatt | Lap váz (3 szürke sáv), nem „Loading...” szöveg |
| I | Hiba | API nem elérhető | A helyi JSON látszik, felül csendes sor: `Showing the saved copy. Couldn't reach the latest.` |

**Olvasási sorrend és méretlépcső:** B és C: 1. dátum (italic 18), 2. `hint` (normal 22, kiemelt), 3. pecsét. D: 1. cím (34), 2. dátum (18), 3. leírás (17), 4. lista (17, behúzva). E: mint D, de a `Last time` címke (15) az első. Három méretlépcső: 34 / 22-18 / 17-15. Képernyőnként egy elsődleges gomb (a pecsét vagy `Come in`), minden más szöveggomb vagy ikon.

**Melyik terv a „következő”:** a `date >= ma` tervek közül a legkorábbi. Ha nincs, E állapot. A nyilak (`Earlier`, `Later`) a meglévő sorrendben lépnek (újabb elöl), a `Later` a következő felé visz. Dátumformátum a tervben `YYYY.MM.DD` marad, megjelenítve `Sat 18 Apr 2026`.

Ma (2026-11-04) mind a 16 terv múltbeli, ezért az első betöltéskor E állapot látszik. Ez a helyes viselkedés, amíg nincs jövőbeli terv.

**Témaváltó:** háromállású (`System`, `Day`, `Night`), egyetlen körbeváltó gomb, ikon (monitor, nap, hold; nem emoji), az `aria-label` mondja az aktuális és a következő állapotot (`Theme: System. Switch to Day.`). Váltáskor `document.startViewTransition` 250 ms cross-fade (a háttérkép és a színek együtt); ha nincs támogatás vagy `prefers-reduced-motion: reduce`, azonnali csere.

**Hover és fókusz:** minden kattintható elem 150 ms áttűnéssel (szín, árnyék, `transform: translateY(-1px)`), fókusz mindig látszik (2 px gyűrű `--accent`, 2 px eltolás), célméret legalább 44 px.

## 6. A pecsét felbontása

A fő mozdulat, az egyetlen látványos elem.

- A pecsét (`kamea`, 72 px) a lap alján középen áll, **`button`**, címke: `Break the seal`, célméret 72 px, fókuszgyűrű 2 px `--accent`.
- Állapotok: nyugalmi (finom lebegés 4 px, 4 s, csak ha nincs `prefers-reduced-motion`), nyomva (scale .96), felbontva.
- Felbontás, kb. 500 ms, rugós (stiffness 300, damping 26), megszakítható: a pecsét kettéreped (két fél, ±8° elfordul és lefelé csúszik, elhalványul), a lap kihajlik (`max-height` + `opacity`, a teljes leírás kinyílik), a fókusz a terv címére (`h2`, `tabindex=-1`) kerül.
- `prefers-reduced-motion: reduce`: csak 150 ms áttűnés, nincs mozgás.
- A felbontás állapota eszközönként a `localStorage`-ban (`opened:<id>`), mert ez kényelmi állapot, nem adat. Üres vagy blokkolt tároló esetén is működik (felbontva marad az oldal élettartamára).
- **A zár nem biztonsági funkció.** A teljes terv szövege a JSONBin válaszban és a JS csomagban ott van, a pecsét csak dramaturgia. Valódi titkosításhoz szerveroldal kell (11. pont).

## 7. Szövegek (angol, a 02-voice szabályai szerint)

| Hely | Szöveg |
|---|---|
| Belépés cím | `Kicsi's Date Night` (szójel, nem h2 szöveg) |
| Mezők | `Name`, `Password` (látható címke a mező fölött) |
| Gomb | `Come in` (folyamatban: `Coming in...`) |
| Hiba | `That didn't match. Check the name and password.` |
| Lezárt, `teaser` nélkül | `Something is planned for {Sat 7 Nov}.` |
| Lezárt címke | `A little hint` |
| Gomb | `Break the seal` |
| Még nem bontható | `Opens {Fri 7 Nov, 9:00}` |
| Lista cím | `The plan` |
| Nyilak | `Earlier`, `Later` (aria: `Earlier date: {title}`) |
| Fülek | `Next date`, `Memories` |
| E állapot | `Last time`, `The next invitation is still being written.` |
| Üres emlék | `No photos yet.` |
| Kilépés | `Log out` |
| Admin gombok | `New date`, `Edit`, `Delete` |
| Törlés megerősítés | Dialógus: `Delete "{title}"? You can't undo this.` / `Delete`, `Keep it` |
| Utolsó terv törlése | `You can't delete the last date. Add a new one first.` (dialógusban, nem `alert`) |
| Fotó hiba | A kép helyén szürke lap `Photo not available` (nem külső `via.placeholder.com`) |

## 8. Admin szerkesztő

Modál mobilon teljes képernyős lap (alulról felcsúszik), asztalin középen 560 px. Címke minden mező fölött, `Save` és `Cancel` alul, ragadós.

Mezők: `Title`, `Date` (`type="date"`, mentés `YYYY.MM.DD`-ként), `Opens at` (`datetime-local`, opcionális), `Hint` (rövid ízelítő, opcionális, max 160 karakter, számláló), `Description` (textarea), `Plan` (lista, sorok hozzáadása és törlése, a törlő gomb címkéje `Remove step {n}`). Mentés közben a gomb tiltott és `Saving...`. Hiba esetén a kitöltött adat megmarad, a hiba a gomb fölött áll.

Az admin mindig a teljes (D) nézetet látja, a lap tetején `Admin view` kis címkével.

## 9. Adatmodell

`src/types/DatePlan.ts`, két új, **opcionális** mező (a meglévő 16 terv és a JSONBin tartalom változtatás nélkül érvényes marad):

```ts
export interface DatePlan {
  id: string;
  title: string;
  date: string;        // "YYYY.MM.DD"
  description: string;
  activities: string[];
  is_deleted?: boolean;
  hint?: string;       // rövid ízelítő a lezárt állapothoz
  opensAt?: string;    // ISO, ez előtt nem bontható fel
}
```

A típus most három fájlban is külön szerepel (`Home.tsx`, `DateNightCard.tsx`, `DateNightContent.tsx` saját `interface DatePlan`), a build lépés egyetlen `types/DatePlan.ts` importra cseréli.

## 10. Képek és teljesítmény

| Elem | Most | Cél |
|---|---|---|
| Háttér (4 PNG, 7-10 MB) | 52 MB | JPEG/WebP, mobil 1024 px széles és legfeljebb 250 KB, asztali 1920 px és legfeljebb 450 KB; `<picture>` mobil/asztali |
| Fotók (22 PNG) | 65 MB | 640 px széles WebP, legfeljebb 90 KB darabonként, `loading="lazy"`, `width`/`height` megadva |
| Betű | nincs | 3 fájl, csak latin és latin-ext, összesen < 200 KB |

Háttérpárosítás: **nappal** a meglévő évszakos kép (tavaszi kert; téli faház télen), **este** a `week_1_night` (fényfüzéres terasz) a kertre, a téli faház este is a faház (eleve esti). Ezt a párosítást a build 6. lépésében képernyőképpel ellenőrizzük, mert a kert nappali képe este nem működik sötétítéssel. A háttér fölé a lap `--surface` színű, így az olvashatóság nem a képtől függ.

A szülinapi terv (`birthday_plan.png`, magyar nyelvű pergamenkép) külön marad, nem része a témarendszernek.

Cél (mobil, 4G): LCP < 2.5 s, INP < 200 ms, CLS < 0.1; Lighthouse mobil 90 fölött.

## 11. Nincs a v2 hatókörében, de tudnod kell

- A belépési jelszó (`20220331`) és az `admin` felhasználó a forráskódban van, a `.env` kulcsok (JSONBin mesterkulcs) a böngészőbe kerülő csomagba is beépülnek, és a jelszó a git előzményben is szerepel. Bárki, aki megnyitja az oldalt, kiolvashatja és átírhatja a terveket. Javítás: Netlify Function viszi a kulcsot és a belépést szerveroldalra, és a jelszót cserélni kell. Külön feladat, ezt a v2 nem érinti.
- Emlékek (kép, helyszín, élmény volt randihoz): a tárolás (JSONBin vagy fájl) döntése után, a v2 második köre.

## 12. Review jegyzet (2026-11-04)

A Sitewright `design-reviewer` szempontjai szerint, a magánappra vonatkozókat alkalmazva. A kereskedelmi weboldalra szabott pontok (Sitewright védjegy a láblécben, HU/EN kapcsoló, háromfunkciós űrlap, kézműves widget, 4 rétegű háttérmotívum) itt nem érvényesek.

- **Javítva közvetlenül:** szövegblokk `max-width` és `min-width: 0` (15. pont), olvasási sorrend és három méretlépcső (11.), témaváltó átmenet és reduced-motion tartalék (18.), hover és fókusz 150 ms (10.).
- **Eltérés az alapelvtől, indokkal:** a Fraunces a Sitewright ügyfélsablonokban kerülendő alapértelmezett betű (sablonszag). Itt a brand kifejezett döntése, az `ő`/`ű` miatt `latin-ext` is betöltődik, és kizárólag ennél az appnál használatos.
- **Rendben:** két betűcsalád helyett egy (konkrét méretekkel), nincs em/en dash, nincs gradiens vagy neon, nincs `h-screen`, egy elsődleges CTA képernyőnként, kontraszt 7:1 fölött, a profilok a logóban egymás felé néznek.
- **Nyitott, nem blokkoló:** a 0. pont négy alapértelmezése, a nappali és esti háttérpárosítás képernyőképes ellenőrzése (build 6. lépés).

## 13. Kész-feltétel (a reviewhoz)

- [ ] Minden képernyő (A-I) elrendezése 375, 768, 1280 px-en leírva és a tokenekből építhető
- [ ] Minden szöveg a 02-voice szabályai szerint (nincs em dash, felkiáltójel, emoji a felületen)
- [ ] Kontraszt és fókusz, célméret, `prefers-reduced-motion`, `prefers-color-scheme` leírva
- [ ] Az adatmodell visszafelé kompatibilis a meglévő tervekkel
- [ ] `Status: approved` után indul a 6. lépés (build alap, lásd [05-rollout.md](05-rollout.md))
