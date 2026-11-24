import {createServer} from 'node:http';
import {StringDecoder} from 'node:string_decoder';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync, mkdirSync} from 'node:fs';
import {dirname} from 'node:path';
import {EVENT_DETAILS, sanitizeForm_, validateForm_, normalizeMobile_, confirmation, dinnerReport, morningReport} from './reports.mjs';

const path = process.env.DB_PATH || 'data/dinner.sqlite';
mkdirSync(dirname(path), {recursive:true, mode:0o700});
const db = new DatabaseSync(path);
db.exec(`
  PRAGMA busy_timeout = 5000;
  PRAGMA journal_mode = WAL;
  CREATE TABLE IF NOT EXISTS registrations (
    id INTEGER PRIMARY KEY, assembly TEXT NOT NULL, mobile TEXT NOT NULL,
    created TEXT NOT NULL, payload TEXT NOT NULL, UNIQUE(assembly,mobile)
  );
  CREATE TABLE IF NOT EXISTS mail (
    id TEXT PRIMARY KEY, payload TEXT NOT NULL, created INTEGER NOT NULL,
    sent INTEGER, failed INTEGER
  );
`);
const insert = db.prepare('INSERT OR IGNORE INTO registrations(assembly,mobile,created,payload) VALUES(?,?,?,?)');
const enqueue = db.prepare('INSERT OR IGNORE INTO mail(id,payload,created) VALUES(?,?,?)');
const entries = db.prepare("SELECT payload FROM registrations WHERE assembly='dec2026' ORDER BY id");
const catalog = JSON.parse(readFileSync(new URL('./public/catalog.json',import.meta.url)));
const reportRows = () => entries.all().map(({payload}) => {
  const r = JSON.parse(payload);
  return [r.name,r.surname,r.salutation,r.statusType+' - '+r.office,r.province,r.lodge,r.partner];
});
const recipients = name => (process.env[name] || '').split(',').map(s=>s.trim()).filter(Boolean);
const saveMail = (id, data) => {
  if (data.to.length) enqueue.run(id, JSON.stringify(data), Date.now());
};
const reportMail = (to, report, bcc = []) => ({
  to, bcc, subject:report.subject, text:report.plain, html:report.html
});
const sending = new Map();
function deliver(id) {
  if (sending.has(id)) return sending.get(id);
  const pending = send(id).finally(()=>sending.delete(id));
  sending.set(id,pending);
  return pending;
}
async function send(id) {
  const row = db.prepare('SELECT * FROM mail WHERE id=?').get(id);
  if (!row || row.failed) return false;
  if (row.sent) return true;
  if (!process.env.RESEND_API_KEY || !process.env.MAIL_FROM) return false;
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method:'POST',
      signal:AbortSignal.timeout(8000),
      headers:{authorization:'Bearer '+process.env.RESEND_API_KEY,
        'content-type':'application/json','idempotency-key':id},
      body:JSON.stringify({...JSON.parse(row.payload), from:process.env.MAIL_FROM})
    });
    if (!response.ok) {
      console.error('Mail provider returned HTTP',response.status);
      return false;
    }
    db.prepare("UPDATE mail SET sent=?,payload='{}' WHERE id=?").run(Date.now(),id);
    return true;
  } catch {
    console.error('Mail delivery attempt failed');
    return false;
  }
}

const timezone = 'Europe/Athens';
const calendar = new Intl.DateTimeFormat('sv-SE', {
  timeZone:timezone, year:'numeric', month:'2-digit', day:'2-digit',
  hour:'2-digit', minute:'2-digit', hourCycle:'h23'
});
let ticking = false;
async function tick() {
  if (ticking) return;
  ticking = true;
  try {
    const [day,time] = calendar.format(new Date()).split(' ');
    if (day >= '2026-11-20' && day <= '2026-12-18' && time >= '09:30' && (!process.env.DAILY_START_DATE || day >= process.env.DAILY_START_DATE)) {
      const to = recipients('DAILY_TO');
      const id = 'morning-'+day;
      if (to.length && !db.prepare('SELECT 1 FROM mail WHERE id=?').get(id)) {
        const report = morningReport(reportRows(),day.split('-').reverse().join('/'));
        saveMail(id,reportMail(to,report,recipients('DAILY_BCC')));
      }
    }
    // Keep automatic retries within the mail provider's idempotency window.
    db.prepare("UPDATE mail SET failed=? WHERE sent IS NULL AND failed IS NULL AND created<?").run(Date.now(),Date.now()-23*3600000);
    if (!process.env.RESEND_API_KEY || !process.env.MAIL_FROM) return;
    for (const row of db.prepare('SELECT id FROM mail WHERE sent IS NULL AND failed IS NULL ORDER BY created LIMIT 10').all()) {
      await deliver(row.id);
    }
  } finally {
    ticking = false;
  }
}

if (process.argv[2] === 'export') {
  const columns = ['register day','name','surname','Salutation','Office','Province','Lodge','Partner','mobile','email'];
  const assembly = process.argv[3];
  if (!Object.hasOwn(EVENT_DETAILS,assembly)) throw Error('Χρησιμοποιήστε dec2026 ή may2027.');
  const rows = db.prepare('SELECT created,payload FROM registrations WHERE assembly=? ORDER BY id').all(assembly);
  const cell = value => {
    const text = String(value ?? '');
    return '"' + (/^[=+@-]/.test(text) ? "'" : '') + text.replaceAll('"','""') + '"';
  };
  const lines = rows.map(({created,payload})=>{
    const r = JSON.parse(payload);
    return [created,r.name,r.surname,r.salutation,[r.statusType,r.office].filter(Boolean).join(' - '),
      r.province,r.lodge,r.partner,r.mobile,r.email].map(cell).join(',');
  });
  process.stdout.write('\uFEFF'+[columns.map(cell).join(','),...lines].join('\r\n')+'\r\n');
  process.exit();
}

if (process.argv[2] === 'import') {
  const data = JSON.parse(readFileSync(0,'utf8'));
  const result = {};
  db.exec('BEGIN IMMEDIATE');
  try {
    for (const r of data) {
      r.mobile = normalizeMobile_(r.mobile);
      if (!Object.hasOwn(EVENT_DETAILS,r.assembly) || !r.name || !r.surname || !r.mobile) throw Error('Μη έγκυρη γραμμή Excel.');
      const summary = result[r.assembly] ??= {inserted:0,duplicates:0};
      if (insert.run(r.assembly,r.mobile,r.created,JSON.stringify(r)).changes) summary.inserted++;
      else summary.duplicates++;
    }
    db.exec('COMMIT');
  } catch (error) {
    db.exec('ROLLBACK');
    throw error;
  }
  console.log(result);
  process.exit();
}

const staticFiles = new Map([
  ['/', ['./index.html','text/html; charset=utf-8']],
  ['/catalog.json',['catalog.json','application/json; charset=utf-8']],
  ...['background.jpg','emblem.jpg','grand-master.jpg','compass.png','montserrat.woff2','playfair.woff2'].map(name=>[
    '/assets/'+name,['assets/'+name,name.endsWith('.woff2')?'font/woff2':name.endsWith('.png')?'image/png':'image/jpeg']
  ])
]);
const json = (res,status,data) => res.writeHead(status,{'content-type':'application/json; charset=utf-8','cache-control':'no-store'}).end(JSON.stringify(data));
createServer(async (req,res) => {
  res.setHeader('x-content-type-options','nosniff');
  res.setHeader('referrer-policy','no-referrer');
  const url = new URL(req.url,'http://localhost');
  if (req.method === 'GET' && url.pathname === '/health') return json(res,200,{ok:true});
  const file = staticFiles.get(url.pathname.replace(/^\/public(?=\/)/,''));
  if (req.method === 'GET' && file) {
    return res.writeHead(200,{'content-type':file[1],'cache-control':url.pathname.startsWith('/assets/')?'public, max-age=3600':'no-cache'})
      .end(readFileSync(new URL(url.pathname==='/' ? file[0] : './public/'+file[0],import.meta.url)));
  }
  if (req.method !== 'POST' || url.pathname !== '/api/registrations') return json(res,404,{error:'Η σελίδα δεν βρέθηκε.'});
  if (!/^application\/json(?:;|$)/i.test(req.headers['content-type'] || '')) return json(res,415,{error:'Μη έγκυρη υποβολή.'});
  let form = '';
  const decoder = new StringDecoder('utf8');
  let data;
  try {
    for await (const chunk of req) {
      form += decoder.write(chunk);
      if (form.length > 12000) {
        json(res,413,{error:'Υπερβολικά μεγάλη δήλωση.'});
        return;
      }
    }
    const raw = JSON.parse(form + decoder.end());
    if (!raw || Object.values(raw).some(value=>!['string','number'].includes(typeof value) || String(value).length>254)) throw Error('Μη έγκυρα πεδία.');
    data = sanitizeForm_(raw);
    validateForm_(data);
    if (!Number.isSafeInteger(Number(raw.partner)) || Number(raw.partner)<0 ||
        !catalog.lodges.some(lodge=>lodge.province.toLocaleLowerCase('el')===data.province.toLocaleLowerCase('el') &&
          (lodge.lodge==='ΦΟΙΝΙΞ ΚΕΡΚΥΡΑΣ' ? 'ΦΟΙΝΙΞ ΚΕΡΚΥΡΑΣ έτος Ιδρ. 1818' :
            lodge.lodge+(lodge.number?' υπ’ αριθμ. '+lodge.number:''))===data.lodge)) {
      throw Error('Ελέγξτε τη στοά και τους συνοδούς.');
    }
  } catch (error) {
    return json(res,400,{error:error instanceof SyntaxError?'Μη έγκυρη δήλωση.':error.message});
  }
  let id;
  try {
    db.exec('BEGIN IMMEDIATE');
    const result = insert.run(data.assembly,data.mobile,new Date().toISOString(),JSON.stringify(data));
    if (!result.changes) {
      db.exec('ROLLBACK');
      return json(res,409,{error:'DUPLICATE_MOBILE: Υπάρχει ήδη εγγραφή με αυτό το κινητό.'});
    }
    id = String(result.lastInsertRowid);
    saveMail('confirm-'+id,confirmation(data));
    const to = recipients(data.assembly==='dec2026'?'DEC_ORGANIZER_TO':'MAY_ORGANIZER_TO');
    if (to.length && data.assembly==='dec2026') saveMail('organizer-'+id,reportMail(to,dinnerReport(reportRows())));
    if (to.length && data.assembly==='may2027') saveMail('organizer-'+id,{
      to, subject:'Νέα εγγραφή δείπνου — '+data.name+' '+data.surname,
      text:EVENT_DETAILS.may2027.title+'\n'+data.name+' '+data.surname+'\n'+data.mobile+'\n'+data.email
    });
    db.exec('COMMIT');
  } catch {
    if (db.isTransaction) db.exec('ROLLBACK');
    console.error('Registration transaction failed');
    return json(res,500,{error:'Η καταχώριση απέτυχε. Δοκιμάστε ξανά.'});
  }
  const emailSent = await deliver('confirm-'+id);
  if (process.env.ENABLE_MAIL_WORKER === 'true') void tick().catch(()=>console.error('Mail worker failed'));
  return json(res,201,{emailSent});
}).listen(Number(process.env.PORT || 3000),'0.0.0.0');
if (process.env.ENABLE_MAIL_WORKER === 'true') {
  setInterval(()=>void tick().catch(()=>console.error('Mail worker failed')),60000);
}
