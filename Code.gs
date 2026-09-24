/**
 * Forintnapló – Google Táblázat szinkron
 *
 * A telefonos Forintnapló ezen keresztül olvassa a Terv lapot, és ide írja
 * a költéseket a Tranzakciók lapra. A Terv és az Áttekintés lapot nyugodtan
 * szerkesztheted kézzel, az app nem írja felül őket. A Tranzakciók lapon is
 * javíthatsz, csak az Azonosító oszlophoz ne nyúlj.
 *
 * Telepítés: lásd README.md, 3. lépés.
 */

const TOKEN = 'ide-a-titkos-szavad';

const VERSION = 1;
const SH_PLAN = 'Terv';
const SH_TX = 'Tranzakciók';
const PLAN_HEAD = ['Hónap', 'Csoport', 'Tétel', 'Tervezett', 'Tényleges', 'Különbözet'];
const TX_HEAD = ['Dátum', 'Hónap', 'Csoport', 'Tétel', 'Összeg', 'Megjegyzés', 'Azonosító'];
const FT = '#,##0 "Ft";-#,##0 "Ft";"–"';

function doGet(e) {
  const p = (e && e.parameter) || {};
  if (!p.action) {
    return ContentService.createTextOutput('A Forintnapló szinkron működik (' + VERSION + '. verzió).');
  }
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
    const done = [];
    (body.ops || []).forEach(function (op) {
      try {
        if (op.op === 'add') addTx_(op.tx);
        else if (op.op === 'update') updateTx_(op.tx);
        else if (op.op === 'delete') deleteTx_(op.id);
        else if (op.op === 'addItem') addItem_(op.item);
        done.push(op.opId);
      } catch (err) {
        done.push(op.opId); // hibás műveletet nem próbálunk újra végtelenül
      }
    });
    SpreadsheetApp.flush();
    return json_(Object.assign({ ok: true, done: done }, state_()));
  } finally {
    lock.releaseLock();
  }
}

/* ---------- olvasás ---------- */

function state_() {
  setup_();
  const ss = SpreadsheetApp.getActive();
  const tz = ss.getSpreadsheetTimeZone();
  const pv = ss.getSheetByName(SH_PLAN).getDataRange().getValues();
  const plan = [];
  for (let i = 1; i < pv.length; i++) {
    const r = pv[i];
    if (!r[0] || !r[2]) continue;
    plan.push({ month: monthStr_(r[0], tz), group: String(r[1] || 'EGYÉB').trim(), item: String(r[2]).trim(), planned: num_(r[3]) });
  }
  const tv = ss.getSheetByName(SH_TX).getDataRange().getValues();
  const tx = [];
  const sh = ss.getSheetByName(SH_TX);
  let fixed = false;
  for (let i = 1; i < tv.length; i++) {
    const r = tv[i];
    if (r[4] === '' || r[4] === null) continue;
    let id = String(r[6] || '').trim();
    if (!id) { id = 'k-' + Utilities.getUuid().slice(0, 8); sh.getRange(i + 1, 7).setValue(id); fixed = true; }
    const date = r[0] instanceof Date ? Utilities.formatDate(r[0], tz, 'yyyy-MM-dd') : String(r[0]).slice(0, 10);
    tx.push({
      id: id, date: date, month: r[1] ? monthStr_(r[1], tz) : date.slice(0, 7),
      group: String(r[2] || 'EGYÉB').trim(), item: String(r[3] || '').trim(),
      amount: num_(r[4]), note: String(r[5] || '')
    });
  }
  if (fixed) SpreadsheetApp.flush();
  return { version: VERSION, plan: plan, tx: tx, syncedAt: new Date().toISOString() };
}

/* ---------- írás ---------- */

function addTx_(t) {
  const sh = SpreadsheetApp.getActive().getSheetByName(SH_TX);
  if (findRow_(sh, t.id)) return; // már bent van (ismételt küldés)
  const row = sh.getLastRow() + 1;
  sh.getRange(row, 2).setNumberFormat('@'); // a hónap szöveg maradjon, ne dátum
  sh.getRange(row, 1, 1, 7).setValues([[toDate_(t.date), t.date.slice(0, 7), t.group, t.item, Number(t.amount), t.note || '', t.id]]);
  sh.getRange(row, 1).setNumberFormat('yyyy.mm.dd');
  sh.getRange(row, 5).setNumberFormat(FT);
  ensureItem_(t.date.slice(0, 7), t.group, t.item, 0);
}

function updateTx_(t) {
  const sh = SpreadsheetApp.getActive().getSheetByName(SH_TX);
  const row = findRow_(sh, t.id);
  if (!row) return addTx_(t);
  sh.getRange(row, 2).setNumberFormat('@');
  sh.getRange(row, 1, 1, 6).setValues([[toDate_(t.date), t.date.slice(0, 7), t.group, t.item, Number(t.amount), t.note || '']]);
  ensureItem_(t.date.slice(0, 7), t.group, t.item, 0);
}

function deleteTx_(id) {
  const sh = SpreadsheetApp.getActive().getSheetByName(SH_TX);
  const row = findRow_(sh, id);
  if (row) sh.deleteRow(row);
}

function addItem_(it) {
  ensureItem_(it.month, it.group, it.item, Number(it.planned) || 0);
}

function ensureItem_(month, group, item, planned) {
  const sh = SpreadsheetApp.getActive().getSheetByName(SH_PLAN);
  const tz = SpreadsheetApp.getActive().getSpreadsheetTimeZone();
  const v = sh.getDataRange().getValues();
  for (let i = 1; i < v.length; i++) {
    if (monthStr_(v[i][0], tz) === month && String(v[i][1]).trim() === group && String(v[i][2]).trim() === item) return;
  }
  const r = sh.getLastRow() + 1;
  sh.getRange(r, 1).setNumberFormat('@'); // a hónap szöveg maradjon, ne dátum
  sh.getRange(r, 1, 1, 4).setValues([[month, group, item, planned]]);
  sh.getRange(r, 5).setFormula('=SUMIFS(\'' + SH_TX + '\'!$E:$E,\'' + SH_TX + '\'!$B:$B,$A' + r + ',\'' + SH_TX + '\'!$C:$C,$B' + r + ',\'' + SH_TX + '\'!$D:$D,$C' + r + ')');
  sh.getRange(r, 6).setFormula('=IF($B' + r + '="BEVÉTEL",E' + r + '-D' + r + ',D' + r + '-E' + r + ')');
  sh.getRange(r, 4, 1, 3).setNumberFormat(FT);
}

/* ---------- segédek ---------- */

function setup_() {
  const ss = SpreadsheetApp.getActive();
  [[SH_PLAN, PLAN_HEAD], [SH_TX, TX_HEAD]].forEach(function (d) {
    let sh = ss.getSheetByName(d[0]);
    if (!sh) {
      sh = ss.insertSheet(d[0]);
      sh.getRange(1, 1, 1, d[1].length).setValues([d[1]]).setFontWeight('bold').setFontColor('#ffffff').setBackground('#1F5C4E');
      sh.setFrozenRows(1);
    }
  });
}

function findRow_(sh, id) {
  if (!id) return 0;
  const last = sh.getLastRow();
  if (last < 2) return 0;
  const ids = sh.getRange(2, 7, last - 1, 1).getValues();
  for (let i = 0; i < ids.length; i++) if (String(ids[i][0]) === String(id)) return i + 2;
  return 0;
}

function monthStr_(v, tz) {
  if (v instanceof Date) return Utilities.formatDate(v, tz, 'yyyy-MM');
  return String(v).trim().slice(0, 7);
}
function toDate_(s) { const p = String(s).split('-').map(Number); return new Date(p[0], p[1] - 1, p[2]); }
function num_(v) { const n = Number(v); return isFinite(n) ? n : 0; }
function json_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
