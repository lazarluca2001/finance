/**
 * Forintnapló – Google Táblázat szinkron (2. verzió)
 *
 * A telefonos Forintnapló ezen keresztül olvassa és írja a táblázatot:
 * Terv, Tranzakciók, Számlák, Átvezetések, Tartozások. A Terv és az
 * Áttekintés lapot nyugodtan szerkesztheted kézzel. A többi lapon is
 * javíthatsz, csak az Azonosító oszlophoz ne nyúlj.
 *
 * Telepítés és frissítés: lásd README.md.
 */

const TOKEN = 'ide-a-titkos-szavad';

const VERSION = 2;
const FT = '#,##0 "Ft";-#,##0 "Ft";"–"';
const INCOME = 'BEVÉTEL';
const DEBT_PLUS = ['Nekem tartozik', 'Visszafizettem'];   // ettől nő, amennyivel nekem tartoznak

// Lapok leírása. type: date | month | num | text; az "id" mező a sor azonosítója.
const SHEETS = {
  plan: { name: 'Terv', head: ['Hónap', 'Csoport', 'Tétel', 'Tervezett', 'Tényleges', 'Különbözet'] },
  tx: {
    name: 'Tranzakciók', key: 'id',
    head: ['Dátum', 'Hónap', 'Csoport', 'Tétel', 'Összeg', 'Megjegyzés', 'Azonosító', 'Számla'],
    fields: [['date', 'date'], ['month', 'month'], ['group', 'text'], ['item', 'text'], ['amount', 'num'], ['note', 'text'], ['id', 'text'], ['account', 'text']]
  },
  account: {
    name: 'Számlák', key: 'name',
    head: ['Számla', 'Típus', 'Nyitó egyenleg', 'Nyitó dátum', 'Egyenleg'],
    fields: [['name', 'text'], ['kind', 'text'], ['opening', 'num'], ['openingDate', 'date']]
  },
  transfer: {
    name: 'Átvezetések', key: 'id',
    head: ['Dátum', 'Honnan', 'Hová', 'Összeg', 'Megjegyzés', 'Azonosító'],
    fields: [['date', 'date'], ['from', 'text'], ['to', 'text'], ['amount', 'num'], ['note', 'text'], ['id', 'text']]
  },
  debt: {
    name: 'Tartozások', key: 'id',
    head: ['Dátum', 'Személy', 'Típus', 'Összeg', 'Határidő', 'Számla', 'Megjegyzés', 'Azonosító', 'Nekem tartozik (±)'],
    fields: [['date', 'date'], ['person', 'text'], ['type', 'text'], ['amount', 'num'], ['due', 'date'], ['account', 'text'], ['note', 'text'], ['id', 'text']]
  }
};

function doGet(e) {
  const p = (e && e.parameter) || {};
  if (!p.action) return ContentService.createTextOutput('A Forintnapló szinkron működik (' + VERSION + '. verzió).');
  if (p.token !== TOKEN) return json_({ ok: false, error: 'rossz_token' });
  if (p.action === 'pull') return json_(Object.assign({ ok: true }, state_()));
  return json_({ ok: false, error: 'ismeretlen_muvelet' });
}

function doPost(e) {
  let body;
  try { body = JSON.parse(e.postData.contents); } catch (err) { return json_({ ok: false, error: 'hibas_keres' }); }
  if (body.token !== TOKEN) return json_({ ok: false, error: 'rossz_token' });
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    setup_();
    const done = [], failed = [];
    (body.ops || []).forEach(function (op) {
      try {
        if (op.op === 'upsert') upsert_(op.kind, op.rec);
        else if (op.op === 'remove') remove_(op.kind, op.id);
        else if (op.op === 'addItem') ensureItem_(op.item.month, op.item.group, op.item.item, Number(op.item.planned) || 0);
        // 1. verziós app műveletei
        else if (op.op === 'add' || op.op === 'update') upsert_('tx', op.tx);
        else if (op.op === 'delete') remove_('tx', op.id);
        done.push(op.opId);
      } catch (err) {
        failed.push({ opId: op.opId, error: String(err) });
        done.push(op.opId); // hibás műveletet nem próbálunk újra végtelenül
      }
    });
    SpreadsheetApp.flush();
    return json_(Object.assign({ ok: true, done: done, failed: failed }, state_()));
  } finally {
    lock.releaseLock();
  }
}

/* ---------- olvasás ---------- */

function state_() {
  setup_();
  const ss = SpreadsheetApp.getActive();
  const tz = ss.getSpreadsheetTimeZone();

  const plan = [];
  const pv = ss.getSheetByName(SHEETS.plan.name).getDataRange().getValues();
  for (let i = 1; i < pv.length; i++) {
    const r = pv[i];
    if (!r[0] || !r[2]) continue;
    plan.push({ month: monthStr_(r[0], tz), group: String(r[1] || 'EGYÉB').trim(), item: String(r[2]).trim(), planned: num_(r[3]) });
  }
  return {
    version: VERSION,
    plan: plan,
    tx: readSheet_('tx', tz).filter(function (t) { return t.amount; }).map(function (t) {
      t.month = t.month || t.date.slice(0, 7); t.group = t.group || 'EGYÉB'; return t;
    }),
    accounts: readSheet_('account', tz).filter(function (a) { return a.name; }),
    transfers: readSheet_('transfer', tz).filter(function (t) { return t.amount; }),
    debts: readSheet_('debt', tz).filter(function (d) { return d.amount && d.person; }),
    syncedAt: new Date().toISOString()
  };
}

function readSheet_(kind, tz) {
  const def = SHEETS[kind];
  const sh = SpreadsheetApp.getActive().getSheetByName(def.name);
  const v = sh.getDataRange().getValues();
  const idCol = def.fields.findIndex(function (f) { return f[0] === 'id'; });
  const out = [];
  for (let i = 1; i < v.length; i++) {
    const rec = {};
    def.fields.forEach(function (f, c) {
      const x = v[i][c];
      if (f[1] === 'date') rec[f[0]] = x instanceof Date ? Utilities.formatDate(x, tz, 'yyyy-MM-dd') : String(x || '').slice(0, 10);
      else if (f[1] === 'month') rec[f[0]] = x ? monthStr_(x, tz) : '';
      else if (f[1] === 'num') rec[f[0]] = num_(x);
      else rec[f[0]] = String(x == null ? '' : x).trim();
    });
    if (idCol >= 0 && !rec.id && v[i].some(function (x) { return x !== ''; })) {
      rec.id = 'k-' + Utilities.getUuid().slice(0, 8);
      sh.getRange(i + 1, idCol + 1).setValue(rec.id);
    }
    out.push(rec);
  }
  return out;
}

/* ---------- írás ---------- */

function upsert_(kind, rec) {
  const def = SHEETS[kind];
  if (!def || !def.fields) throw new Error('ismeretlen lap: ' + kind);
  const sh = SpreadsheetApp.getActive().getSheetByName(def.name);
  if (kind === 'tx') rec.month = String(rec.date).slice(0, 7);
  let row = findRow_(sh, def, rec[def.key]);
  if (!row) row = sh.getLastRow() + 1;
  // szövegként tartandó oszlopok (hónap, nevek), hogy a táblázat ne alakítsa dátummá
  def.fields.forEach(function (f, c) {
    const cell = sh.getRange(row, c + 1);
    if (f[1] === 'month' || f[1] === 'text') cell.setNumberFormat('@');
    else if (f[1] === 'date') cell.setNumberFormat('yyyy.mm.dd');
    else if (f[1] === 'num') cell.setNumberFormat(FT);
  });
  const values = def.fields.map(function (f) {
    const x = rec[f[0]];
    if (f[1] === 'date') return x ? toDate_(x) : '';
    if (f[1] === 'num') return Number(x) || 0;
    return x == null ? '' : String(x);
  });
  sh.getRange(row, 1, 1, values.length).setValues([values]);
  formulas_(kind, sh, row);
  if (kind === 'tx') ensureItem_(rec.month, rec.group, rec.item, 0);
}

function remove_(kind, id) {
  const def = SHEETS[kind];
  const sh = SpreadsheetApp.getActive().getSheetByName(def.name);
  const row = findRow_(sh, def, id);
  if (row) sh.deleteRow(row);
}

function formulas_(kind, sh, r) {
  if (kind === 'account') {
    const d = '">="&$D' + r, a = '$A' + r;
    const T = "'Tranzakciók'!", A = "'Átvezetések'!", D = "'Tartozások'!";
    sh.getRange(r, 5).setFormula(
      '=$C' + r +
      '+SUMIFS(' + T + '$E:$E,' + T + '$H:$H,' + a + ',' + T + '$C:$C,"' + INCOME + '",' + T + '$A:$A,' + d + ')' +
      '-SUMIFS(' + T + '$E:$E,' + T + '$H:$H,' + a + ',' + T + '$C:$C,"<>' + INCOME + '",' + T + '$A:$A,' + d + ')' +
      '+SUMIFS(' + A + '$D:$D,' + A + '$C:$C,' + a + ',' + A + '$A:$A,' + d + ')' +
      '-SUMIFS(' + A + '$D:$D,' + A + '$B:$B,' + a + ',' + A + '$A:$A,' + d + ')' +
      '-SUMIFS(' + D + '$I:$I,' + D + '$F:$F,' + a + ',' + D + '$A:$A,' + d + ')'
    ).setNumberFormat(FT);
  } else if (kind === 'debt') {
    sh.getRange(r, 9).setFormula('=IF(OR($C' + r + '="' + DEBT_PLUS[0] + '",$C' + r + '="' + DEBT_PLUS[1] + '"),$D' + r + ',-$D' + r + ')').setNumberFormat(FT);
  }
}

function ensureItem_(month, group, item, planned) {
  const sh = SpreadsheetApp.getActive().getSheetByName(SHEETS.plan.name);
  const tz = SpreadsheetApp.getActive().getSpreadsheetTimeZone();
  const v = sh.getDataRange().getValues();
  for (let i = 1; i < v.length; i++) {
    if (monthStr_(v[i][0], tz) === month && String(v[i][1]).trim() === group && String(v[i][2]).trim() === item) return;
  }
  const r = sh.getLastRow() + 1;
  sh.getRange(r, 1).setNumberFormat('@');
  sh.getRange(r, 1, 1, 4).setValues([[month, group, item, planned]]);
  const T = "'Tranzakciók'!";
  sh.getRange(r, 5).setFormula('=SUMIFS(' + T + '$E:$E,' + T + '$B:$B,$A' + r + ',' + T + '$C:$C,$B' + r + ',' + T + '$D:$D,$C' + r + ')');
  sh.getRange(r, 6).setFormula('=IF($B' + r + '="' + INCOME + '",E' + r + '-D' + r + ',D' + r + '-E' + r + ')');
  sh.getRange(r, 4, 1, 3).setNumberFormat(FT);
}

/* ---------- segédek ---------- */

// Hiányzó lapokat és oszlopokat létrehozza, így az 1. verziós táblázat is frissül.
function setup_() {
  const ss = SpreadsheetApp.getActive();
  Object.keys(SHEETS).forEach(function (k) {
    const def = SHEETS[k];
    let sh = ss.getSheetByName(def.name);
    if (!sh) {
      sh = ss.insertSheet(def.name);
      sh.setFrozenRows(1);
    }
    const head = sh.getRange(1, 1, 1, def.head.length);
    const cur = head.getValues()[0];
    if (cur.some(function (x, i) { return String(x) !== def.head[i]; })) {
      def.head.forEach(function (h, i) { if (!cur[i]) sh.getRange(1, i + 1).setValue(h); });
      head.setFontWeight('bold').setFontColor('#ffffff').setBackground('#1F5C4E');
    }
  });
}

function findRow_(sh, def, key) {
  if (!key) return 0;
  const col = def.fields.findIndex(function (f) { return f[0] === def.key; }) + 1;
  const last = sh.getLastRow();
  if (last < 2) return 0;
  const vals = sh.getRange(2, col, last - 1, 1).getValues();
  for (let i = 0; i < vals.length; i++) if (String(vals[i][0]).trim() === String(key)) return i + 2;
  return 0;
}

function monthStr_(v, tz) {
  if (v instanceof Date) return Utilities.formatDate(v, tz, 'yyyy-MM');
  return String(v).trim().slice(0, 7);
}
function toDate_(s) { const p = String(s).split('-').map(Number); return new Date(p[0], p[1] - 1, p[2]); }
function num_(v) { const n = Number(v); return isFinite(n) ? n : 0; }
function json_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
