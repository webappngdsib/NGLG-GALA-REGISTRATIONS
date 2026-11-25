import catalog from './public/catalog.json' with { type: 'json' };
import { sanitizeForm_, validateForm_, normalizeRegistrationLodge, confirmation, morningReport } from './reports.mjs';
import { gmailConfigured, sendGmail } from './gmail.mjs';

function validate(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw) ||
      Object.values(raw).some(value => !['string', 'number'].includes(typeof value) || String(value).length > 254)) {
    throw new Error('Μη έγκυρα πεδία.');
  }
  const data = sanitizeForm_(raw);
  validateForm_(data);
  if (raw.partner === undefined || !Number.isSafeInteger(Number(raw.partner)) || Number(raw.partner) < 0 ||
      !normalizeRegistrationLodge(data, catalog.lodges)) {
    throw new Error('Ελέγξτε τη στοά και τους συνοδούς.');
  }
  return data;
}

const athensDate = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Athens' });
const mailRecipients = value => (value || '').split(',').map(item => item.trim()).filter(Boolean);

async function sendDailyReport(event, env) {
  if (env.REGISTRATIONS_OPEN !== 'true' || !gmailConfigured(env)) return;
  const day = athensDate.format(new Date(event.scheduledTime));
  if (day < '2026-11-20' || day > '2026-12-18' || (env.DAILY_START_DATE && day < env.DAILY_START_DATE)) return;
  const to = mailRecipients(env.DAILY_TO);
  if (!to.length) return;

  const claimed = await env.DB.prepare(
    "INSERT INTO daily_mail(day, state) VALUES (?, 'pending') ON CONFLICT(day) DO NOTHING RETURNING day"
  ).bind(day).first();
  if (!claimed) return;

  let sent = false;
  try {
    const { results } = await env.DB.prepare(
      "SELECT payload FROM registrations WHERE assembly = 'dec2026' ORDER BY id"
    ).all();
    const entries = results.map(({ payload }) => {
      const data = JSON.parse(payload);
      return [data.name, data.surname, data.salutation, data.office, data.province, data.lodge, data.partner];
    });
    const report = morningReport(entries, day.split('-').reverse().join('/'));
    sent = await sendGmail(env, { ...report, to, bcc: mailRecipients(env.DAILY_BCC) });
  } catch {
    console.error('Daily Gmail report failed');
  }
  await env.DB.prepare('UPDATE daily_mail SET state=? WHERE day=?').bind(sent ? 'sent' : 'failed', day).run();
}

export default {
  async scheduled(event, env) {
    await sendDailyReport(event, env);
  },

  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    const allowedOrigin = request.headers.get('Origin') === env.FORM_ORIGIN;
    const headers = {
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      'Vary': 'Origin'
    };
    if (allowedOrigin) headers['Access-Control-Allow-Origin'] = env.FORM_ORIGIN;
    const json = (status, value) => Response.json(value, { status, headers });

    if (request.method === 'GET' && pathname === '/health') {
      try {
        await env.DB.prepare('SELECT 1 AS ready FROM registrations LIMIT 1').first();
        return json(200, { ok: true, registrationsOpen: env.REGISTRATIONS_OPEN === 'true' });
      } catch {
        return json(503, { ok: false });
      }
    }
    if (pathname !== '/api/registrations') return json(404, { error: 'Η σελίδα δεν βρέθηκε.' });
    if (!allowedOrigin) return json(403, { error: 'Η προέλευση της φόρμας δεν επιτρέπεται.' });
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: {
        ...headers, 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type'
      } });
    }
    if (request.method !== 'POST') return json(405, { error: 'Μη επιτρεπτή μέθοδος.' });
    if (env.REGISTRATIONS_OPEN !== 'true') return json(503, { error: 'Οι δηλώσεις δεν έχουν ανοίξει ακόμη.' });
    if (!/^application\/json(?:;|$)/i.test(request.headers.get('Content-Type') || '')) {
      return json(415, { error: 'Μη έγκυρη υποβολή.' });
    }

    let data;
    try {
      const decoder = new TextDecoder();
      let body = '';
      let bytes = 0;
      for await (const chunk of request.body || []) {
        bytes += chunk.byteLength;
        if (bytes > 12000) return json(413, { error: 'Υπερβολικά μεγάλη δήλωση.' });
        body += decoder.decode(chunk, { stream: true });
      }
      data = validate(JSON.parse(body + decoder.decode()));
    } catch (error) {
      return json(400, { error: error instanceof SyntaxError ? 'Μη έγκυρη δήλωση.' : error.message });
    }

    try {
      const row = await env.DB.prepare(`
        INSERT INTO registrations (assembly, mobile, created, payload)
        VALUES (?, ?, ?, ?)
        ON CONFLICT (assembly, mobile) DO NOTHING
        RETURNING id
      `).bind(data.assembly, data.mobile, new Date().toISOString(), JSON.stringify(data)).first();
      if (!row) return json(409, { error: 'DUPLICATE_MOBILE: Υπάρχει ήδη εγγραφή με αυτό το κινητό.' });
    } catch {
      console.error('D1 registration write failed');
      return json(503, { error: 'Η καταχώριση απέτυχε. Δοκιμάστε ξανά.' });
    }
    let emailSent = false;
    try {
      emailSent = await sendGmail(env, confirmation(data));
    } catch {
      console.error('Confirmation Gmail delivery failed');
    }
    return json(201, { emailSent });
  }
};
