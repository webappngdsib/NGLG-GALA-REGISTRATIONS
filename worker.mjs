import catalog from './public/catalog.json' with { type: 'json' };
import { sanitizeForm_, validateForm_ } from './reports.mjs';

function validate(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw) ||
      Object.values(raw).some(value => !['string', 'number'].includes(typeof value) || String(value).length > 254)) {
    throw new Error('Μη έγκυρα πεδία.');
  }
  const data = sanitizeForm_(raw);
  validateForm_(data);
  const lodgeMatches = catalog.lodges.some(lodge => {
    if (lodge.province.toLocaleLowerCase('el') !== data.province.toLocaleLowerCase('el')) return false;
    const name = lodge.lodge === 'ΦΟΙΝΙΞ ΚΕΡΚΥΡΑΣ'
      ? 'ΦΟΙΝΙΞ ΚΕΡΚΥΡΑΣ έτος Ιδρ. 1818'
      : lodge.lodge + (lodge.number ? ' υπ’ αριθμ. ' + lodge.number : '');
    return name === data.lodge;
  });
  if (raw.partner === undefined || !Number.isSafeInteger(Number(raw.partner)) || Number(raw.partner) < 0 || !lodgeMatches) {
    throw new Error('Ελέγξτε τη στοά και τους συνοδούς.');
  }
  return data;
}

export default {
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
      return json(201, { emailSent: false });
    } catch {
      console.error('D1 registration write failed');
      return json(503, { error: 'Η καταχώριση απέτυχε. Δοκιμάστε ξανά.' });
    }
  }
};
