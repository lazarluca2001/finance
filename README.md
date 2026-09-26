# Forintnapló – pénzügyi napló

Telefonra tehető pénzügyi napló. GitHub Pages-en fut, internet nélkül is megnyílik, és minden mentést beír egy Google Táblázatba. A táblázat csak tárolásra kell, hogy semmi ne vesszen el. A tervezés és a rögzítés az appban történik.

Az app három, egymástól **teljesen független** részből áll. Egymás adatait nem látják és nem módosítják: egy költés vagy a költségvetésbe kerül, vagy egy event költései közé, egy tartozás pedig csak a tartozások között van. A részek között a bal felső hamburger menüvel váltasz.

**1. Költségvetés**
- **Áttekintés:** a költhető pénzed (megtakarítás nélkül), teendők (esedékes fizetés, lakbér, előfizetés, félretevés), az aktuális hónap kerete hó végi előrejelzéssel.
- **Havi keret:** a hónap terve és a tényleges költés tételenként. Itt adod meg az eltéréseket és az egyszeri tételeket.
- **Tranzakciók:** kiadások, bevételek és átvezetések napokra bontva, szűréssel és kereséssel.
- **Költségterv:** a havi alaptervet itt építed fel a nulláról.
- **Számlák:** a költhető számláid: bankszámla, készpénz, hitelkártya.
- **Megtakarítás és befektetés:** a megtakarítási és tőzsdei számlák és a célok. Ezek nem számítanak költhető pénznek.
- **Statisztika:** havi bevétel és kiadás egy évre, kiadás csoportonként.

**2. Tartozások:** ki mennyivel tartozik neked, és te kinek, határidővel és részletfizetéssel. Nem hat a számlák egyenlegére és a havi keretre.

**3. Event költségvetés:** minden eventnek saját költségvetése van kategóriánként (event, szállás, utazás, étel, vagy bármi más), és a költéseit is itt rögzíted. Éves összesítő (tervezett, elköltött, a közelgőkből még hátralévő, kategóriánként) és eventenkénti összesítő, határidőkkel.

## Így építed fel a költségtervet

A **Költségterv** oldalon négy rész van. Mindegyiknél ott vannak a javaslatok (pl. „+ Albérlet”, „+ Spotify”, „+ Élelmiszer”): koppints rá, írd be az összeget, kész. Saját tételt a „+ Hozzáadás” gombbal veszel fel.

1. **Bevételek:** fizetés és egyéb rendszeres bevétel, a nappal, amikor jön. Aznap rákérdez: „Megjött?”
2. **Fix kiadások:** ami minden hónapban ugyanannyi, adott napon: lakbér, rezsi, telefon, előfizetések, bérletek. Az esedékesség napján az Áttekintésben egy koppintással rögzíted.
3. **Havi keretek:** a változó költések felső határa: élelmiszer, étterem, bulizás, eventek. Ezekre költés közben rögzítesz, és látod, mennyi maradt.
4. **Megtakarítás:** mennyit teszel félre havonta, melyik megtakarítási vagy befektetési számlára. Aznap szól, egy koppintással átvezeti.

Az oldal tetején azonnal látod: *bevétel − fix kiadások − havi keretek − megtakarítás = szabadon marad*.

Az alapterv **minden hónapra magától érvényes**. Ha egy hónap eltér (pl. decemberben több az ajándék), a Havi keret oldalon az „Eltérés ebben a hónapban” gombbal csak arra a hónapra írod át. Az „+ Egyszeri tétel” gombbal pedig olyat veszel fel, ami csak abban a hónapban van.

## Event költségvetés

1. **+ Új esemény:** név, dátum, helyszín, és a költségvetés kategóriánként (pl. event 45 000, szállás 35 000, utazás 17 000, étel 35 000). Saját kategóriát is felvehetsz.
2. Az event oldalán a **+ Költés** gombbal rögzíted, mire mennyit költöttél. Idegen pénznemben is, napi árfolyammal.
3. **Határidők:** pl. „Jegy második részlete, okt. 5., 25 000 Ft”. A „Fizetve” gomb rögzíti a költést, és késznek jelöli a határidőt.
4. Az Event költségvetés főoldalán évenként látod: mennyit terveztél és költöttél összesen, kategóriánként, mennyi van még hátra a közelgő eventekből, és a közelgő határidőket.

Ha a havi költségvetésben is szeretnél helyet hagyni az eventeknek, vegyél fel a Költségtervben egy „Eventek” keretet. Ez a havi keret része, az Event költségvetéstől független.

## Megtakarítás és befektetés

- Megtakarítási számlát a **Megtakarítás** oldalon veszel fel (típus: Megtakarítás, Befektetés vagy Nyugdíjpénztár). Ezek nem számítanak bele a költhető pénzbe.
- **Befizetés** vagy **Félretesz:** átvezetés költhető számláról megtakarításba. Nem kiadás, hanem a „Félretéve” sorban jelenik meg.
- **Kivétel:** vissza költhető számlára.
- **Érték frissítése:** befektetésnél beírod, mennyit ér most (pl. a brókerapp szerint). A különbség hozamként jelenik meg, nem bevételként.
- **Célok:** pl. „Új laptop, 300 000 Ft, júniusig”. Megmutatja, havonta mennyit kell félretenned.

## Tippek

- **Devizás költés:** a Ft helyett válassz pénznemet (EUR, PLN…). Az app lekéri a napi árfolyamot, és forintban rögzít. Az eredeti összeg és az árfolyam is megmarad.
- **Gyorsindítás (Android):** tartsd nyomva az app ikonját: Új kiadás, Új bevétel, Új tartozás.

## 1. Feltöltés GitHubra (kb. 5 perc)

1. Lépj be a github.com-ra, jobb fent **+ → New repository**.
2. Név: például `forintnaplo`. Legyen **Public** (az ingyenes GitHub Pages-hez ez kell). A programba nem kerül adat. **Create repository**.
3. A következő oldalon kattints az **uploading an existing file** linkre.
4. Húzd be ennek a mappának a tartalmát (nem magát a mappát): `index.html`, `sw.js`, `manifest.webmanifest`, `icon-192.png`, `icon-512.png`, `apple-touch-icon.png`, `Code.gs`, `README.md`.
5. Lent **Commit changes**.
6. Fent **Settings → Pages**. A Build and deployment résznél: Source: **Deploy from a branch**, Branch: **main**, mappa: **/ (root)** → **Save**.
7. 1–2 perc múlva ugyanitt megjelenik a címed, például: `https://FELHASZNALONEV.github.io/forintnaplo/`

## 2. Kitétel a telefon kezdőképernyőjére

**iPhone (Safari):** nyisd meg a címet → alul a **Megosztás** gomb → **Főképernyőhöz adás** → **Hozzáadás**.

**Android (Chrome):** nyisd meg a címet → jobb fent **⋮** → **Hozzáadás a kezdőképernyőhöz** vagy **Alkalmazás telepítése**.

Ezután mindig az ikonról nyisd meg. iPhone-on a kezdőképernyős app külön tárolja az adatait a Safaritól. Szinkronnal ez nem gond.

## 3. Google Táblázat szinkron (erősen ajánlott)

Szinkron nélkül az adatok csak a telefonon vannak. Ha törlöd az ikont vagy a böngésző adatait, elvesznek.

1. Hozz létre egy **új, üres** Google Táblázatot (például „Forintnapló”).
2. Menü: **Bővítmények → Apps Script**.
3. Töröld ki a benne lévő kódot, és másold be a `Code.gs` fájl teljes tartalmát.
4. A **12. sorban** írd át a TOKEN értékét egy saját titkos szóra, például `const TOKEN = 'zöld-forint-58';`. **Mentés** (floppy ikon).
5. Jobb fent **Telepítés → Új telepítés**. A fogaskeréknél válaszd: **Webes alkalmazás**.
   - Végrehajtás mint: **Én**
   - Hozzáférés: **Bárki**
6. **Telepítés** → engedélyezd a hozzáférést a fiókodhoz. Ha a Google figyelmeztet, hogy az app nincs ellenőrizve: **Speciális → Ugrás a projektre**.
7. Másold ki a **Webes alkalmazás URL**-t (`https://script.google.com/macros/s/…/exec`).
8. Az appban: **menü → Adatok és szinkron** → illeszd be az URL-t és a titkos szót → **Összekötés**.

A jobb felső sarokban ezután a „Szinkronizálva” felirat látszik. Az első szinkronnál a szkript létrehozza a lapokat, és feltölti, amit addig a telefonon rögzítettél.

A táblázat lapjai: a költségvetéshez **Költségterv** (az alapterv), **Terv** (havi eltérések és egyszeri tételek), **Tranzakciók**, **Számlák**, **Átvezetések**, **Értékelések** (befektetések értéke), **Célok**; külön a **Tartozások**; az eventekhez **Események**, **Event költések**, **Határidők**. Kézzel is javíthatsz bennük, csak az **Azonosító** oszlophoz ne nyúlj. Az egyenlegeket és összesítőket az app számolja.

Ha internet nélkül mentesz, az app megjegyzi a változásokat („N feltöltésre vár”), és amikor legközelebb van net, feltölti őket.

## 4. Discord értesítés (ajánlott)

Minden reggel a megadott órában a táblázat szkriptje megnézi, mi esedékes, és ha van valami, üzenetet küld egy Discord-csatornába. A Discord app értesít róla a telefonodon. Ilyen üzenetekre számíthatsz:

- 📌 Albérlet: 90 000 Ft (holnap)
- 💰 Fizetés érkezik: 497 150 Ft (ma)
- 🐷 Félretenni → Lightyear: 50 000 Ft (ma)
- ⏰ Jegy 2. részlet · Warsaw Halloween Swing: 25 000 Ft (2 nap múlva)
- 🤝 Marcell tartozik neked: 9 000 Ft (holnap)
- 🎟️ Santa Swing holnap indul · eddig 59 000 Ft / 129 000 Ft
- 🟠 Élelmiszer keret 90%-a elfogyott: 75 000 Ft / 80 000 Ft

Ha aznap nincs semmi, nem jön üzenet. A keret-figyelmeztetés havonta egyszer jön keretenként.

**Beállítás:**

1. A Discordban hozz létre egy saját szervert (bal oldalt **+ → Saját készítésű → Magamnak és barátaimnak**), vagy használj egy meglévőt, ahol csak te vagy. Legyen benne egy csatorna, például `#forintnaplo`.
2. A csatorna melletti fogaskerék → **Integrációk → Webhookok → Új webhook**. Adhatsz neki nevet, majd **Webhook URL másolása**. Ez a cím titkos: aki ismeri, írhat a csatornába.
3. Az appban: **menü → Adatok és szinkron → Discord értesítés** → illeszd be a címet, válaszd ki, hány órakor és mennyivel előre szóljon, és miről → kapcsold be → **Mentés** → **Teszt üzenet**. A teszt üzenetnek meg kell jelennie a csatornában.
4. A telefonos Discord appban nyomd hosszan a csatornát → **Értesítési beállítások → Minden üzenet**, hogy minden üzenetnél kapj értesítést.

Ha a Mentésnél hibát kapsz, a Code.gs frissítése után valószínűleg még nem engedélyezted az új jogosultságokat. Az Apps Script szerkesztőben futtasd le egyszer kézzel a `napiErtesites` függvényt (fent a függvényválasztó → Futtatás), és engedélyezd, amit kér. Az időzítőt a Mentés gomb állítja be, és a szerkesztőben az óra ikonnál (Eseményindítók) látod.

## Frissítés

**A 7. verzióhoz (különálló részek):** töltsd fel az új fájlokat, és frissítsd a `Code.gs`-t („Új verzió”). A táblázatban magától létrejön az Event költések lap. A korábban kiadásként rögzített event költések a költségvetésben maradnak; ha az Event költségvetésben is kellenek, ott rögzítsd újra őket.

**A Discord értesítéshez (6. verzió):** töltsd fel az új `index.html`-t és `sw.js`-t, és frissítsd a `Code.gs`-t az alábbi módon. Telepítéskor a Google új engedélyt kér: külső szolgáltatás elérése (a Discord) és időzített futtatás. Ezeket engedélyezd.

**A 4-es verzióról:** töltsd fel az új `index.html`-t és `sw.js`-t a GitHubra, és frissítsd a `Code.gs`-t az alábbi módon („Új verzió”). A táblázatodhoz nem kell nyúlnod, az Események lapra magától felkerül a Költségvetés oszlop.

Ha új fájlokat kapsz, töltsd fel őket ugyanígy (**Add file → Upload files**), felülírva a régieket. Amikor legközelebb megnyitod az appot, alul megjelenik az „Új verzió érhető el – Frissítés” sáv.

Ha a `Code.gs` is változik: a táblázatban **Bővítmények → Apps Script**, cseréld le a kódot, írd vissza a TOKEN-t, **Mentés**, majd **Telepítés → Telepítések kezelése → ceruza ikon → Verzió: Új verzió → Telepítés**. Így az URL ugyanaz marad.

Ellenőrzés: a webalkalmazás URL-je böngészőben megnyitva ezt írja: „A Forintnapló szinkron működik (7. verzió).”

## Biztonsági mentés

Az **Adatok és szinkron** részben a „Mentés letöltése” gomb egy fájlba menti az összes adatot, a „Visszatöltés fájlból” pedig visszaállítja. Szinkron nélkül érdemes ezt havonta megcsinálni.
