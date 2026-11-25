import { strToU8, zipSync } from 'fflate';

const sheets = [
  { key: 'dec2026', title: 'DEC 2026' },
  { key: 'may2027', title: 'MAY 2027' }
];
const columns = ['Ημερομηνία εγγραφής', 'Όνομα', 'Επώνυμο', 'Προσφώνηση', 'Κατάσταση / Αξίωμα',
  'Επαρχία / Περιφέρεια', 'Στοά', 'Συνοδοί', 'Κινητό', 'Email'];
const xml = value => String(value ?? '').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\ufffe\uffff]/g, '')
  .replace(/[&<>]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[char]);
const signature = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
const spreadsheet = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main';
const office = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships';
const relations = 'http://schemas.openxmlformats.org/package/2006/relationships';

function sheetXml(rows) {
  const body = [columns, ...rows].map((row, i) => '<row r="' + (i + 1) + '">' +
    row.map((value, j) => {
      const ref = String.fromCharCode(65 + j) + (i + 1);
      return typeof value === 'number' && Number.isFinite(value)
        ? '<c r="' + ref + '"><v>' + value + '</v></c>'
        : '<c r="' + ref + '" t="inlineStr"><is><t xml:space="preserve">' + xml(value) + '</t></is></c>';
    }).join('') + '</row>').join('');
  return signature + '<worksheet xmlns="' + spreadsheet + '"><sheetViews><sheetView workbookViewId="0">' +
    '<pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>' +
    '<cols><col min="1" max="4" width="25" customWidth="1"/><col min="5" max="7" width="38" customWidth="1"/>' +
    '<col min="8" max="9" width="17" customWidth="1"/><col min="10" max="10" width="34" customWidth="1"/></cols>' +
    '<sheetData>' + body + '</sheetData><autoFilter ref="A1:J' + (rows.length + 1) + '"/></worksheet>';
}

export function createWorkbook(records) {
  const grouped = new Map(sheets.map(sheet => [sheet.key, []]));
  for (const row of records) {
    const data = JSON.parse(row.payload);
    grouped.get(row.assembly).push([
      row.created, data.name, data.surname, data.salutation, [data.statusType, data.office].filter(Boolean).join(' - '),
      data.province, data.lodge, Number(data.partner || 0), row.mobile, data.email
    ]);
  }
  const parts = {
    '[Content_Types].xml': signature + '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
      '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' +
      '<Default Extension="xml" ContentType="application/xml"/>' +
      '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>' +
      sheets.map((_, i) => '<Override PartName="/xl/worksheets/sheet' + (i + 1) +
        '.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>').join('') + '</Types>',
    '_rels/.rels': signature + '<Relationships xmlns="' + relations + '"><Relationship Id="rId1" Type="' + office +
      '/officeDocument" Target="xl/workbook.xml"/></Relationships>',
    'xl/workbook.xml': signature + '<workbook xmlns="' + spreadsheet + '" xmlns:r="' + office + '"><sheets>' +
      sheets.map(({ title }, i) => '<sheet name="' + title + '" sheetId="' + (i + 1) + '" r:id="rId' + (i + 1) + '"/>').join('') +
      '</sheets></workbook>',
    'xl/_rels/workbook.xml.rels': signature + '<Relationships xmlns="' + relations + '">' +
      sheets.map((_, i) => '<Relationship Id="rId' + (i + 1) + '" Type="' + office + '/worksheet" Target="worksheets/sheet' +
        (i + 1) + '.xml"/>').join('') + '</Relationships>'
  };
  sheets.forEach(({ key }, i) => { parts['xl/worksheets/sheet' + (i + 1) + '.xml'] = sheetXml(grouped.get(key)); });
  return zipSync(Object.fromEntries(Object.entries(parts).map(([name, data]) => [name, strToU8(data)])), { level: 0 });
}

function page(status, message = '') {
  return new Response(`<!doctype html><html lang="el"><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1"><title>Λήψη εγγραφών ΕΜΣΤΕ</title>
<style>body{font:1rem system-ui;background:#f1f4f9;color:#102d52;margin:0;padding:1.25rem}main{max-width:30rem;margin:8vh auto;background:#fff;padding:1.5rem;border-radius:.75rem}label,input,button{display:block}input,button{box-sizing:border-box;width:100%;font:inherit;padding:.7rem;margin-top:.5rem}button{color:white;background:#123f78;border:0;border-radius:.3rem}p[role]{color:#942b1f}</style>
<main><h1>Λήψη εγγραφών σε Excel</h1><p>Περιλαμβάνει τις δηλώσεις Δεκεμβρίου 2026 και Μαΐου 2027.</p>
${message ? '<p role="alert">' + message + '</p>' : ''}
<form method="post"><label for="key">Κλειδί εξαγωγής</label><input id="key" name="key" type="password"
autocomplete="off" required maxlength="256"><button>Λήψη Excel</button></form></main></html>`, {
    status, headers: {
      'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store',
      'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; frame-ancestors 'none'",
      'Referrer-Policy': 'no-referrer', 'X-Robots-Tag': 'noindex'
    }
  });
}

export async function exportRegistrations(request, env) {
  if (request.method === 'GET') return page(200);
  if (request.method !== 'POST') return new Response(null, { status: 405, headers: { Allow: 'GET, POST' } });
  if (!env.EXPORT_ACCESS_KEY || env.EXPORT_ACCESS_KEY.length < 24) {
    return page(503, 'Η πρόσβαση για εξαγωγή δεν έχει ρυθμιστεί.');
  }
  if (!/^application\/x-www-form-urlencoded(?:;|$)/i.test(request.headers.get('Content-Type') || '') ||
      Number(request.headers.get('Content-Length')) > 4000) return page(400, 'Μη έγκυρο αίτημα.');
  const key = (await request.formData()).get('key');
  if (typeof key !== 'string' || key.length > 256) return page(400, 'Μη έγκυρο αίτημα.');
  const digest = secret => crypto.subtle.digest('SHA-256', strToU8(secret));
  const [actual, expected] = await Promise.all([digest(key), digest(env.EXPORT_ACCESS_KEY)]);
  if (!crypto.subtle.timingSafeEqual(actual, expected)) return page(403, 'Το κλειδί εξαγωγής δεν είναι σωστό.');
  try {
    const rows = [];
    let lastId = 0;
    for (;;) {
      const { results } = await env.DB.prepare(
        "SELECT id, assembly, mobile, created, payload FROM registrations WHERE id > ? AND assembly IN ('dec2026', 'may2027') ORDER BY id LIMIT 500"
      ).bind(lastId).all();
      rows.push(...results);
      if (results.length < 500) break;
      lastId = results.at(-1).id;
    }
    return new Response(createWorkbook(rows), { headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="NGLG-GALA-REGISTRATIONS.xlsx"',
      'Cache-Control': 'private, no-store', 'X-Content-Type-Options': 'nosniff'
    } });
  } catch {
    console.error('Registration workbook export failed');
    return page(503, 'Η εξαγωγή δεν ολοκληρώθηκε. Δοκίμασε ξανά.');
  }
}
