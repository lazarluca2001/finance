# Forintnapló – pénzügyi napló

Telefonra tehető pénzügyi napló. A lapok között a bal felső hamburger menüvel váltasz:

- **Áttekintés:** nettó vagyon (számlák + amivel neked tartoznak − amivel te tartozol), az aktuális hónap kerete, nyitott tartozások határidővel, számlaegyenlegek, és gyors gombok: Kiadás, Bevétel, Tartozás, Átvezetés.
- **Havi keret:** mennyit költöttél a tervhez képest, csoportonként és tételenként.
- **Tranzakciók:** a hónap összes mozgása napokra bontva, típus, csoport és számla szerint szűrhetően. Bármelyikre koppintva szerkesztheted vagy törölheted.
- **Tartozások:** személyenként látod, ki mennyivel tartozik neked, és te kinek. Részletek, határidő, lejárt jelzés, és egy gombnyomással rögzíted, ha megadta vagy megadtad.
- **Számlák:** bankszámla, készpénz, megtakarítás stb. egyenlege, és átvezetés köztük.
- **Statisztika:** havi bevétel és kiadás egy évre, kiadás csoportonként, és a swing eventek költése eseményenként (az EVENT KÖLTSÉGEK tételeiből, pl. „Milan Modern Swing - étel”). GitHub Pages-en fut, internet nélkül is megnyílik, és minden mentést beír a Google Táblázatodba. Külön adatbázis nincs: a táblázat a fő példány.

## 1. Feltöltés GitHubra (kb. 5 perc)

1. Lépj be a github.com-ra, jobb fent **+ → New repository**.
2. Név: például `forintnaplo`. Legyen **Public** (az ingyenes GitHub Pages-hez ez kell). A programba nem kerül adat, a költéseid a táblázatban és a telefonodon vannak. **Create repository**.
3. A következő oldalon kattints az **uploading an existing file** linkre.
4. Húzd be ennek a mappának a tartalmát (nem magát a mappát): `index.html`, `sw.js`, `manifest.webmanifest`, `icon-192.png`, `icon-512.png`, `apple-touch-icon.png`, `Code.gs`, `README.md`.
5. Lent **Commit changes**.
6. Fent **Settings → Pages**. A Build and deployment résznél: Source: **Deploy from a branch**, Branch: **main**, mappa: **/ (root)** → **Save**.
7. 1–2 perc múlva ugyanitt megjelenik a címed, például: `https://FELHASZNALONEV.github.io/forintnaplo/`

## 2. Kitétel a telefon kezdőképernyőjére

**iPhone (Safari):** nyisd meg a címet → alul a **Megosztás** gomb → **Főképernyőhöz adás** → **Hozzáadás**.

**Android (Chrome):** nyisd meg a címet → jobb fent **⋮** → **Hozzáadás a kezdőképernyőhöz** vagy **Alkalmazás telepítése**.

Ezután mindig az ikonról nyisd meg. iPhone-on a kezdőképernyős app külön tárolja az adatait a Safaritól. Szinkronnal ez nem gond, mert mindkettő a táblázatból tölt.

## 3. Google Táblázat szinkron

Ebből jön a havi terved, és ide kerül minden költés. A `Forintnapló_2026.xlsx` már tartalmazza a 2026-os tervedet és az eddigi költéseidet a régi költségvetésedből.

1. Töltsd fel a `Forintnapló_2026.xlsx`-et a Google Drive-odra, nyisd meg, majd **Fájl → Mentés Google Táblázatként**. Innentől ezt az új, Google Táblázat változatot használd (az xlsx-et törölheted).
2. A táblázatban: **Bővítmények → Apps Script**.
3. Töröld ki a benne lévő kódot, és másold be a `Code.gs` fájl teljes tartalmát.
4. A **12. sorban** írd át a TOKEN értékét egy saját titkos szóra, például `const TOKEN = 'zöld-forint-58';`. **Mentés** (floppy ikon).
5. Jobb fent **Telepítés → Új telepítés**. A fogaskeréknél válaszd: **Webes alkalmazás**.
   - Végrehajtás mint: **Én**
   - Hozzáférés: **Bárki**
6. **Telepítés** → engedélyezd a hozzáférést a fiókodhoz. Ha a Google figyelmeztet, hogy az app nincs ellenőrizve: **Speciális → Ugrás a projektre**.
7. Másold ki a **Webes alkalmazás URL**-t (`https://script.google.com/macros/s/…/exec`).
8. Az appban: **menü → Adatok és szinkron** → illeszd be az URL-t és a titkos szót → **Összekötés**.

A jobb felső sarokban ezután a „Szinkronizálva” felirat látszik. Ha az összekötés előtt már rögzítettél valamit a telefonon, az ilyenkor feltöltődik a táblázatba.

### A táblázat lapjai

- **Áttekintés:** havonta a tervezett és a tényleges bevétel, kiadás és egyenleg. Csak képletek vannak rajta.
- **Terv:** hónap, csoport, tétel, tervezett összeg. **Itt tervezel**: a kék Tervezett oszlopot írd át, vagy vegyél fel új sort (a Tényleges és a Különbözet oszlop képletét másold le a fenti sorból). A hónapot `2026-11` alakban írd, szövegként: ha a táblázat dátummá alakítaná, írj elé egy aposztrófot (`'2026-11`). Az app minden szinkronnál innen olvassa a tervet.
- **Tranzakciók:** egy sor egy költés vagy bevétel, a Számla oszlopban azzal, honnan ment. Az app ide ír. Kézzel is javíthatsz vagy felvehetsz sort, csak az **Azonosító** oszlopot ne módosítsd (új sornál hagyd üresen, a szkript kitölti).
- **Számlák:** a számláid nyitó egyenleggel és nyitó dátummal. Az Egyenleg oszlop képlet: nyitó egyenleg + a nyitó dátum óta rá rögzített bevételek − kiadások ± átvezetések és tartozásmozgások. Számlát az appban vegyél fel, mert a képletet a szinkron írja be.
- **Átvezetések:** pénz mozgatása a saját számláid között (pl. megtakarításba). Nem számít kiadásnak.
- **Tartozások:** egy sor egy esemény: *Nekem tartozik* (kölcsönadtál vagy fizettél helyette), *Én tartozom*, *Visszakaptam*, *Visszafizettem*. Az utolsó oszlop előjeles összeg, így `=SUMIF(B:B;"Marcell";I:I)` megmondja, mennyivel tartozik Marcell. Ha a Számla üres, a pénz nem mozgott egyik számládon sem (pl. valaki kifizette a vacsorádat).

Tipp a számlákhoz: vegyél fel egy számlát a mai egyenleggel és mai dátummal, és állítsd be alapértelmezettnek (Adatok és szinkron). Onnantól minden új kiadás arról megy, hacsak nem választasz mást. A régi, importált tételek a nyitó dátum előttiek, ezért nem számolja bele őket.

Bevételt a + Költés lapon a **Bevétel** fülön rögzítesz. A terven kívüli tételeket (**+ Új tétel…**) a szkript 0 Ft-os tervvel felveszi a Terv lapra.

Ha internet nélkül mentesz, az app megjegyzi a változásokat („N feltöltésre vár”), és amikor legközelebb van net, feltölti őket.

## Frissítés

Ha új fájlokat kapsz, töltsd fel őket ugyanígy (**Add file → Upload files**), felülírva a régieket. Amikor legközelebb megnyitod az appot, alul megjelenik az „Új verzió érhető el – Frissítés” sáv. Az adataidat a frissítés nem érinti.

Ha a `Code.gs` is változik: a táblázatban **Bővítmények → Apps Script**, cseréld le a kódot, írd vissza a TOKEN-t, **Mentés**, majd **Telepítés → Telepítések kezelése → ceruza ikon → Verzió: Új verzió → Telepítés**. Így az URL ugyanaz marad.

Ellenőrzés: a webalkalmazás URL-je böngészőben megnyitva ezt írja: „A Forintnapló szinkron működik (2. verzió).”

### Ha az 1. verziót már beállítottad

Töltsd fel az új `index.html`-t és `sw.js`-t a GitHubra, és frissítsd a `Code.gs`-t a fenti módon (Új verzió!). A táblázatodhoz nem kell nyúlnod: az első szinkronnál a szkript létrehozza a Számlák, Átvezetések és Tartozások lapot, és a Tranzakciók lapra felveszi a Számla oszlopot. Amíg a régi szkript fut, az app szól, és az új adatok a telefonon várnak.

## Biztonsági mentés

Az **Adatok és szinkron** részben a „Mentés letöltése” gomb egy fájlba menti a telefonon lévő adatokat, a „Visszatöltés fájlból” pedig visszaállítja őket. Szinkronnal erre nincs szükség, mert minden a táblázatban van.
