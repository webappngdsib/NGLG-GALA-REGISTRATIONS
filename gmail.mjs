const sender = 'info@nglgreece.gr';
const encoder = new TextEncoder();

function base64(value) {
  const bytes = encoder.encode(value);
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function encodedHeader(value) {
  // Keep each encoded word under the RFC limit without splitting a code point.
  const words = [];
  let part = '';
  for (const character of value) {
    if (encoder.encode(part + character).length > 42) {
      words.push('=?UTF-8?B?' + base64(part) + '?=');
      part = '';
    }
    part += character;
  }
  if (part) words.push('=?UTF-8?B?' + base64(part) + '?=');
  return words.join('\r\n ');
}

const addresses = value => (Array.isArray(value) ? value : [value]).map(address => {
  const clean = String(address || '').trim();
  if (!/^[^\s@<>,;]+@[^\s@<>,;]+\.[^\s@<>,;]+$/.test(clean)) throw Error('Invalid mail recipient');
  return clean;
}).join(', ');

export function gmailConfigured(env) {
  return Boolean(env.GMAIL_CLIENT_ID && env.GMAIL_CLIENT_SECRET && env.GMAIL_REFRESH_TOKEN);
}

export async function sendGmail(env, mail) {
  if (!gmailConfigured(env)) return false;
  const mime = [
    'From: ' + encodedHeader('Εθνική Μεγάλη Στοά της Ελλάδος') + ' <' + sender + '>',
    'To: ' + addresses(mail.to),
    ...(mail.bcc?.length ? ['Bcc: ' + addresses(mail.bcc)] : []),
    'Subject: ' + encodedHeader(mail.subject),
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
    '',
    base64(mail.html).match(/.{1,76}/g)?.join('\r\n') || ''
  ].join('\r\n');
  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    signal: AbortSignal.timeout(8000),
    body: new URLSearchParams({
      grant_type: 'refresh_token', client_id: env.GMAIL_CLIENT_ID,
      client_secret: env.GMAIL_CLIENT_SECRET, refresh_token: env.GMAIL_REFRESH_TOKEN
    })
  });
  if (!tokenResponse.ok) {
    console.error('Gmail authorization failed', tokenResponse.status);
    return false;
  }
  const { access_token } = await tokenResponse.json();
  if (!access_token) return false;
  const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    signal: AbortSignal.timeout(8000),
    headers: { Authorization: 'Bearer ' + access_token, 'Content-Type': 'application/json' },
    body: JSON.stringify({ raw: base64(mime).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '') })
  });
  if (!response.ok) console.error('Gmail rejected message', response.status);
  return response.ok;
}
