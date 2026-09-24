# Forintnapló – pénzügyi napló

Telefonra tehető pénzügyi napló. GitHub Pages-en fut, internet nélkül is megnyílik, és minden mentést beír egy Google Táblázatba. A táblázat csak tárolásra kell, hogy semmi ne vesszen el. A tervezés és a rögzítés az appban történik.

A lapok között a bal felső hamburger menüvel váltasz:

- **Áttekintés:** a költhető pénzed (megtakarítás nélkül), tartozások és kintlévőségek, teendők (esedékes fizetés, lakbér, előfizetés, félretétel, határidők), az aktuális hónap kerete hó végi előrejelzéssel.
- **Havi keret:** a hónap terve és a tényleges költés tételenként. Itt adod meg az eltéréseket és az egyszeri tételeket.
- **Tranzakciók:** minden mozgás napokra bontva, szűréssel és kereséssel.
- **Költségterv:** a havi alaptervet itt építed fel a nulláról.
- **Tartozások:** ki mennyivel tartozik neked, és te kinek, határidővel.
- **Események:** a swing eventjeid kerettel, bontással (event, szállás, utazás, étel) és határidőkkel.
- **Számlák:** a költhető számláid: bankszámla, készpénz, hitelkártya.
- **Megtakarítás és befektetés:** külön oldal a megtakarítási és tőzsdei számláknak és a céloknak. Ezek nem számítanak költhető pénznek.
- **Statisztika:** havi bevétel és kiadás egy évre, kiadás csoportonként.

## Így építed fel a költségtervet

A **Költségterv** oldalon négy rész van. Mindegyiknél ott vannak a javaslatok (pl. „+ Albérlet”, „+ Spotify”, „+ Élelmiszer”): koppints rá, írd be az összeget, kész. Saját tételt a „+ Hozzáadás” gombbal veszel fel.

1. **Bevételek:** fizetés és egyéb rendszeres bevétel, a nappal, amikor jön. Aznap rákérdez: „Megjött?”
2. **Fix kiadások:** ami minden hónapban ugyanannyi, adott napon: lakbér, rezsi, telefon, előfizetések, bérletek. Az esedékesség napján az Áttekintésben egy koppintással rögzíted.
3. **Havi keretek:** a változó költések felső határa: élelmiszer, étterem, bulizás, eventek. Ezekre költés közben rögzítesz, és látod, mennyi maradt.
4. **Megtakarítás:** mennyit teszel félre havonta, melyik megtakarítási vagy befektetési számlára. Aznap szól, egy koppintással átvezeti.

Az oldal tetején azonnal látod: *bevétel − fix kiadások − havi keretek − megtakarítás = szabadon marad*.

Az alapterv **minden hónapra magától érvényes**. Ha egy hónap eltér (pl. decemberben több az ajándék), a Havi keret oldalon az „Eltérés ebben a hónapban” gombbal csak arra a hónapra írod át. Az „+ Egyszeri tétel” gombbal pedig olyat veszel fel, ami csak abban a hónapban van. Ha új eseményt kerettel veszel fel, a kerete magától bekerül a kezdés hónapjának tervébe.

Ha egy új fix tétel e havi napja már elmúlt, arra a hónapra nem kér rögzítést, mert valószínűleg már kifizetted. Jövő hónaptól emlékeztet.

## Megtakarítás és befektetés

- Megtakarítási számlát a **Megtakarítás** oldalon veszel fel (típus: Megtakarítás, Befektetés vagy Nyugdíjpénztár). Ezek nem számítanak bele a költhető pénzbe.
- **Befizetés** vagy **Félretesz:** átvezetés költhető számláról megtakarításba. Nem kiadás, hanem a „Félretéve” sorban jelenik meg.
- **Kivétel:** vissza költhető számlára.
- **Érték frissítése:** befektetésnél beírod, mennyit ér most (pl. a brókerapp szerint). A különbség hozamként jelenik meg, nem bevételként.
- **Célok:** pl. „Új laptop, 300 000 Ft, júniusig”. Megmutatja, havonta mennyit kell félretenned.

## Tippek

- **Közös költség:** kiadásnál kapcsold be a „Megosztom másokkal” kapcsolót. A saját részed kiadás lesz, a többieké tartozás náluk. Ha más fizetett, a te részed kiadás, és ennyivel tartozol neki.
- **Devizás költés:** a Ft helyett válassz pénznemet (EUR, PLN…). Az app lekéri a napi árfolyamot, és forintban rögzít. Az eredeti összeg és az árfolyam is megmarad.
- **Esemény költése:** az esemény oldalán a + Költés gombbal kategóriánként rögzítesz. A Havi keretben az esemény tervsorára, vagy ha nincs ilyen, az „Eventek” keretre számít.
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

A táblázat lapjai: **Költségterv** (az alapterv), **Terv** (havi eltérések és egyszeri tételek), **Tranzakciók**, **Számlák**, **Átvezetések**, **Értékelések** (befektetések értéke), **Tartozások**, **Események**, **Határidők**, **Célok**. Kézzel is javíthatsz bennük, csak az **Azonosító** oszlophoz ne nyúlj. Az egyenlegeket és összesítőket az app számolja.

Ha internet nélkül mentesz, az app megjegyzi a változásokat („N feltöltésre vár”), és amikor legközelebb van net, feltölti őket.

## Frissítés

Ha új fájlokat kapsz, töltsd fel őket ugyanígy (**Add file → Upload files**), felülírva a régieket. Amikor legközelebb megnyitod az appot, alul megjelenik az „Új verzió érhető el – Frissítés” sáv.

Ha a `Code.gs` is változik: a táblázatban **Bővítmények → Apps Script**, cseréld le a kódot, írd vissza a TOKEN-t, **Mentés**, majd **Telepítés → Telepítések kezelése → ceruza ikon → Verzió: Új verzió → Telepítés**. Így az URL ugyanaz marad.

Ellenőrzés: a webalkalmazás URL-je böngészőben megnyitva ezt írja: „A Forintnapló szinkron működik (4. verzió).”

## Biztonsági mentés

Az **Adatok és szinkron** részben a „Mentés letöltése” gomb egy fájlba menti az összes adatot, a „Visszatöltés fájlból” pedig visszaállítja. Szinkron nélkül érdemes ezt havonta megcsinálni.
