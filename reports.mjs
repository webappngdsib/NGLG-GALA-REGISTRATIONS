const EVENT_DETAILS = Object.freeze({
  dec2026: {
    title: 'Μεγάλη Συνέλευση 19ης Δεκεμβρίου 2026',
    dinner: 'το δείπνο της 19ης Δεκ στην Κέρκυρα'
  },
  may2027: {
    title: 'Μεγάλη Συνέλευση 15ης Μαΐου 2027',
    dinner: 'το δείπνο της 15ης Μαΐου 2027'
  }
});

const LODGE_NUMBERS = [
  1,2,3,4,5,6,8,9,10,11,12,13,15,16,17,18,19,21,23,24,26,28,29,30,31,32,33,36,
  39,42,44,48,50,52,53,54,55,58,59,60,61,62,64,66,67,69,70,71,74,76,78,80,84,85,
  86,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,
  110,111,112,113,114,115,116,117,118,''
];

const PROVINCES = [
  'ΑΘΗΝΩΝ',
  'ΠΕΙΡΑΙΩΣ & ΑΙΓΑΙΟΥ',
  'ΙΟΝΙΩΝ ΝΗΣΩΝ',
  'ΔΥΤΙΚΗΣ ΕΛΛΑΔΟΣ',
  'ΚΕΝΤΡΙΚΗΣ & ΒΟΡΕΙΟΥ ΕΛΛΑΔΟΣ',
  'ΚΥΠΡΟΥ',
  'ΣΤΟΑ ΚΕΝΤΡΟΥ'
];

// Province classification from the supplied 87-lodge reference list.
// Use Lodge number first: some names are shared by different Lodges.
const DEC_PROVINCE_LABELS = Object.freeze(["ΑΘΗΝΩΝ", "ΠΕΙΡΑΙΩΣ & ΑΡΧΙΠΕΛΑΓΟΥΣ ΑΙΓΑΙΟΥ", "ΙΟΝΙΩΝ ΝΗΣΩΝ", "ΠΕΛ & Δ ΕΛΛΑΔΟΣ", "ΚΕΝΤΡΙΚΗΣ & ΒΟΡΕΙΟΥ ΕΛΛΑΔΟΣ", "ΚΥΠΡΟΥ", "ΣΤΟΑ ΚΕΝΤΡΟΥ"]);
const DEC_LODGE_REFERENCE = Object.freeze([
  [1, "ΠΑΛΑΙΩΝ ΠΑΤΡΩΝ ΓΕΡΜΑΝΟΣ", "ΠΕΛ & Δ ΕΛΛΑΔΟΣ"],
  [2, "ΑΚΡΟΠΟΛΙΣ", "ΑΘΗΝΩΝ"],
  [3, "ΠΑΡΘΕΝΩΝ", "ΠΕΙΡΑΙΩΣ & ΑΡΧΙΠΕΛΑΓΟΥΣ ΑΙΓΑΙΟΥ"],
  [4, "ΜΙΑΟΥΛΗΣ", "ΠΕΙΡΑΙΩΣ & ΑΡΧΙΠΕΛΑΓΟΥΣ ΑΙΓΑΙΟΥ"],
  [5, "ΠΙΣΤΙΣ", "ΠΕΙΡΑΙΩΣ & ΑΡΧΙΠΕΛΑΓΟΥΣ ΑΙΓΑΙΟΥ"],
  [6, "ΟΜΟΝΟΙΑ ΣΤΟΑ ΜΕΓΑΛΟΥ ΔΙΔΑΣΚΑΛΟΥ", "ΑΘΗΝΩΝ"],
  [8, "ΗΛΙΟΤΡΟΠΙΟΝ", "ΑΘΗΝΩΝ"],
  [9, "ΙΣΙΣ", "ΑΘΗΝΩΝ"],
  [10, "ΗΡΑΚΛΕΙΤΟΣ", "ΑΘΗΝΩΝ"],
  [11, "ΑΘΗΝΑ ΣΟΦΙΑ", "ΑΘΗΝΩΝ"],
  [12, "ΗΡΑΚΛΗΣ", "ΠΕΙΡΑΙΩΣ & ΑΡΧΙΠΕΛΑΓΟΥΣ ΑΙΓΑΙΟΥ"],
  [13, "GARIBALDI", "ΑΘΗΝΩΝ"],
  [15, "ΕΜΠΕΔΟΚΛΗΣ", "ΠΕΙΡΑΙΩΣ & ΑΡΧΙΠΕΛΑΓΟΥΣ ΑΙΓΑΙΟΥ"],
  [16, "ΕΝΩΣΙΣ ΛΕΥΚΑΔΟΣ", "ΙΟΝΙΩΝ ΝΗΣΩΝ"],
  [17, "ΑΝΑΓΕΝΝΗΣΙΣ", "ΑΘΗΝΩΝ"],
  [18, "ΕΓΚΑΤΕΣΤΗΜΕΝΩΝ ΣΕΒΑΣΜΙΩΝ", "ΑΘΗΝΩΝ"],
  [19, "ΤΡΙΠΤΟΛΕΜΟΣ", "ΑΘΗΝΩΝ"],
  [21, "ΑΤΤΙΚΟΣ ΑΣΤΗΡ", "ΑΘΗΝΩΝ"],
  [23, "ΠΥΘΑΓΟΡΑΣ", "ΑΘΗΝΩΝ"],
  [24, "ΦΙΛΙΚΗ ΕΤΑΙΡΕΙΑ", "ΠΕΙΡΑΙΩΣ & ΑΡΧΙΠΕΛΑΓΟΥΣ ΑΙΓΑΙΟΥ"],
  [26, "ΜΕΓΑΣ ΑΛΕΞΑΝΔΡΟΣ", "ΚΕΝΤΡΙΚΗΣ & ΒΟΡΕΙΟΥ ΕΛΛΑΔΟΣ"],
  [28, "ΚΑΜΕΙΡΟΣ", "ΠΕΙΡΑΙΩΣ & ΑΡΧΙΠΕΛΑΓΟΥΣ ΑΙΓΑΙΟΥ"],
  [29, "ΚΑΣΣΑΝΔΡΟΣ", "ΚΕΝΤΡΙΚΗΣ & ΒΟΡΕΙΟΥ ΕΛΛΑΔΟΣ"],
  [30, "ΘΕΣΣΑΛΟΝΙΚΗ", "ΚΕΝΤΡΙΚΗΣ & ΒΟΡΕΙΟΥ ΕΛΛΑΔΟΣ"],
  [31, "ΣΩΚΡΑΤΗΣ", "ΠΕΙΡΑΙΩΣ & ΑΡΧΙΠΕΛΑΓΟΥΣ ΑΙΓΑΙΟΥ"],
  [32, "ΔΙΩΝΗ", "ΠΕΛ & Δ ΕΛΛΑΔΟΣ"],
  [33, "ΠΟΣΕΙΔΩΝΙΑ", "ΠΕΙΡΑΙΩΣ & ΑΡΧΙΠΕΛΑΓΟΥΣ ΑΙΓΑΙΟΥ"],
  [36, "ΔΕΙΝΟΚΡΑΤΗΣ", "ΚΕΝΤΡΙΚΗΣ & ΒΟΡΕΙΟΥ ΕΛΛΑΔΟΣ"],
  [39, "ΙΠΠΟΚΡΑΤΗΣ", "ΑΘΗΝΩΝ"],
  [42, "ΑΔΑΜΑΝΤΙΟΣ ΚΟΡΑΗΣ", "ΑΘΗΝΩΝ"],
  [44, "ΒΥΖΑΣ", "ΠΕΙΡΑΙΩΣ & ΑΡΧΙΠΕΛΑΓΟΥΣ ΑΙΓΑΙΟΥ"],
  [48, "ΑΡΗΤΗ", "ΙΟΝΙΩΝ ΝΗΣΩΝ"],
  [50, "ΔΑΙΔΑΛΟΣ", "ΠΕΙΡΑΙΩΣ & ΑΡΧΙΠΕΛΑΓΟΥΣ ΑΙΓΑΙΟΥ"],
  [52, "SAINT GEORGE", "ΑΘΗΝΩΝ"],
  [53, "BENEFICENZA", "ΙΟΝΙΩΝ ΝΗΣΩΝ"],
  [54, "ΑΡΓΩ", "ΑΘΗΝΩΝ"],
  [55, "ΕΝΩΣΙΣ(ΚΥΠΡΟΣ)", "ΚΥΠΡΟΥ"],
  [58, "LA FRANCE", "ΑΘΗΝΩΝ"],
  [59, "ΟΜΗΡΟΣ", "ΑΘΗΝΩΝ"],
  [60, "ΔΗΜΗΤΡΑ", "ΚΕΝΤΡΙΚΗΣ & ΒΟΡΕΙΟΥ ΕΛΛΑΔΟΣ"],
  [61, "ΑΝΤΩΝΙΟΣ ΜΠΕΝΑΚΗΣ", "ΙΟΝΙΩΝ ΝΗΣΩΝ"],
  [62, "ΠΛΟΥΤΑΡΧΟΣ", "ΑΘΗΝΩΝ"],
  [64, "ΦΙΛΕΛΛΗΝΩΝ", "ΚΥΠΡΟΥ"],
  [66, "ΠΥΘΑΓΟΡΑΣ", "ΙΟΝΙΩΝ ΝΗΣΩΝ"],
  [67, "ΕΛΛΗΝΟΓΛΩΣΣΟΝ ΞΕΝΟΔΟΧΕΙΟΝ", "ΑΘΗΝΩΝ"],
  [69, "ΑΝΤΙΠΛΟΙΑΡΧΟΣ ΒΛΑΧΑΚΟΣ", "ΠΕΙΡΑΙΩΣ & ΑΡΧΙΠΕΛΑΓΟΥΣ ΑΙΓΑΙΟΥ"],
  [70, "ΠΛΑΤΩΝ", "ΑΘΗΝΩΝ"],
  [71, "ΛΗΔΡΑ", "ΚΥΠΡΟΥ"],
  [74, "ΜΕΓΑΛΩΝ ΕΠΙΜΕΛΗΤΩΝ", "ΠΕΙΡΑΙΩΣ & ΑΡΧΙΠΕΛΑΓΟΥΣ ΑΙΓΑΙΟΥ"],
  [76, "ΛΟΡΔΟΣ ΒΥΡΩΝ", "ΑΘΗΝΩΝ"],
  [78, "ΑΘΗΝΑ ΣΤΑΘΜΙΑ", "ΑΘΗΝΩΝ"],
  [80, "ΑΠΟΛΛΩΝΙΟΣ Ο ΡΟΔΙΟΣ", "ΠΕΙΡΑΙΩΣ & ΑΡΧΙΠΕΛΑΓΟΥΣ ΑΙΓΑΙΟΥ"],
  [84, "ΚΥΠΡΑΙΩΝ ΗΡΩΩΝ", "ΚΥΠΡΟΥ"],
  [85, "RUDYARD KIPLING", "ΙΟΝΙΩΝ ΝΗΣΩΝ"],
  [86, "FRATELLI BANDIERA", "ΙΟΝΙΩΝ ΝΗΣΩΝ"],
  [88, "ΑΓΙΟΥ ΙΩΑΝΝΟΥ", "ΑΘΗΝΩΝ"],
  [89, "ΛΟΓΟΣ", "ΑΘΗΝΩΝ"],
  [90, "ΑΘΑΝΑΣΙΟΣ ΛΕΥΚΑΔΙΤΗΣ", "ΑΘΗΝΩΝ"],
  [91, "ΕΛΛΗΝΩΝ ΗΡΩΩΝ", "ΑΘΗΝΩΝ"],
  [92, "ΙΩΑΝΝΗΣ ΚΑΠΟΔΙΣΤΡΙΑΣ", "ΙΟΝΙΩΝ ΝΗΣΩΝ"],
  [93, "ΦΙΛΟΓΕΝΕΙΑ", "ΙΟΝΙΩΝ ΝΗΣΩΝ"],
  [94, "ΔΙΟΝΥΣΙΟΣ ΡΩΜΑΣ", "ΙΟΝΙΩΝ ΝΗΣΩΝ"],
  [95, "LA ΡAIX", "ΙΟΝΙΩΝ ΝΗΣΩΝ"],
  [96, "ΘΕΜΙΣΤΟΚΛΗΣ", "ΠΕΙΡΑΙΩΣ & ΑΡΧΙΠΕΛΑΓΟΥΣ ΑΙΓΑΙΟΥ"],
  [97, "ΙΣΟΤΗΣ 1882", "ΑΘΗΝΩΝ"],
  [98, "ΔΩΔΩΝΗ", "ΠΕΛ & Δ ΕΛΛΑΔΟΣ"],
  [99, "ΚΑΘΗΚΟΝ", "ΠΕΙΡΑΙΩΣ & ΑΡΧΙΠΕΛΑΓΟΥΣ ΑΙΓΑΙΟΥ"],
  [100, "ΑΚΑΚΙΑ", "ΠΕΛ & Δ ΕΛΛΑΔΟΣ"],
  [101, "ΑΛΕΞΑΝΔΡΟΣ ΡΩΜΑΣ", "ΠΕΛ & Δ ΕΛΛΑΔΟΣ"],
  [102, "ΦΕΡΔΙΝΑΝΔΟΣ ΦΟΝ ΜΠΡΑΟΥΝΣΒΑΪΚ", "ΑΘΗΝΩΝ"],
  [103, "ΠΛΑΤΩΝ", "ΑΘΗΝΩΝ"],
  [104, "ΑΚΡΟΠΟΛΙΣ", "ΑΘΗΝΩΝ"],
  [105, "ΠΡΟΜΗΘΕΥΣ", "ΑΘΗΝΩΝ"],
  [106, "ΜΑΚΕΔΩΝ", "ΚΕΝΤΡΙΚΗΣ & ΒΟΡΕΙΟΥ ΕΛΛΑΔΟΣ"],
  [107, "ΑΤΛΑΝΤΙΣ", "ΠΕΙΡΑΙΩΣ & ΑΡΧΙΠΕΛΑΓΟΥΣ ΑΙΓΑΙΟΥ"],
  [108, "ΕΥΡΩΠΗ", "ΑΘΗΝΩΝ"],
  [109, "ΑΡΙΣΤΟΜΕΝΗΣ", "ΠΕΛ & Δ ΕΛΛΑΔΟΣ"],
  [110, "ΜΥΚΟΝΟΣ", "ΠΕΙΡΑΙΩΣ & ΑΡΧΙΠΕΛΑΓΟΥΣ ΑΙΓΑΙΟΥ"],
  [111, "ΣΠΥΡΙΔΩΝ ΝΑΓΟΣ", "ΑΘΗΝΩΝ"],
  [112, "ΗΦΑΙΣΤΙΑ", "ΠΕΙΡΑΙΩΣ & ΑΡΧΙΠΕΛΑΓΟΥΣ ΑΙΓΑΙΟΥ"],
  [113, "ΔΗΜΗΤΗΡ 123", "ΠΕΙΡΑΙΩΣ & ΑΡΧΙΠΕΛΑΓΟΥΣ ΑΙΓΑΙΟΥ"],
  [114, "ΓΕΩΡΓΙΟΣ ΣΟΥΡΗΣ", "ΠΕΙΡΑΙΩΣ & ΑΡΧΙΠΕΛΑΓΟΥΣ ΑΙΓΑΙΟΥ"],
  [115, "ΟΡΦΕΥΣ", "ΚΕΝΤΡΙΚΗΣ & ΒΟΡΕΙΟΥ ΕΛΛΑΔΟΣ"],
  [116, "ΕΥΣΤΑΘΙΟΣ ΛΙΑΚΟΠΟΥΛΟΣ", "ΑΘΗΝΩΝ"],
  [117, "ΣΠΥΡΟΣ ΣΑΜΑΡΑΣ", "ΙΟΝΙΩΝ ΝΗΣΩΝ"],
  [118, "ΑΤΛΑΣ", "ΠΕΙΡΑΙΩΣ & ΑΡΧΙΠΕΛΑΓΟΥΣ ΑΙΓΑΙΟΥ"],
  [null, "ΦΟΙΝΙΞ ΚΕΡΚΥΡΑΣ", "ΙΟΝΙΩΝ ΝΗΣΩΝ"],
]);

const DEC_UNKNOWN_PROVINCE = 'ΜΗ ΤΑΥΤΟΠΟΙΗΜΕΝΗ ΕΠΑΡΧΙΑ';


// ---------------------------------------------------------------------------
// Web entry points
// - Without ?action=…  → serves the form page (works on PC, as before).
// - With ?action=…     → JSON interface used by the standalone form page
//                        (GitHub Pages). That page opens on every phone,
//                        whatever Google accounts the browser is signed into.
//
// IMPORTANT: deploy with "Execute as: Me" and "Who has access: Anyone"
// (NOT "Anyone with Google account"), otherwise the JSON calls from the
// standalone page are redirected to a Google sign-in page and fail.
// ---------------------------------------------------------------------------

function sanitizeForm_(form) {
  return {
    assembly: clean_(form.assembly),
    name: clean_(form.name),
    surname: clean_(form.surname),
    salutation: clean_(form.salutation),
    statusType: clean_(form.statusType),
    office: clean_(form.office),
    province: clean_(form.province),
    lodge: clean_(form.lodge),
    partner: Math.max(0, parseInt(form.partner, 10) || 0),
    mobile: normalizeMobile_(form.mobile),
    email: clean_(form.email).toLowerCase()
  };
}

function validateForm_(data) {
  if (!Object.hasOwn(EVENT_DETAILS, data.assembly)) throw new Error('Παρακαλούμε επιλέξτε Μεγάλη Συνέλευση.');
  ['name','surname','salutation','statusType','office','province','lodge','email'].forEach(key => {
    if (!data[key]) throw new Error('Λείπει το υποχρεωτικό πεδίο: ' + key);
  });
  if (!PROVINCES.includes(data.province)) throw new Error('Μη έγκυρη Επαρχία / Περιφέρεια.');
  validateMobile_(data.mobile);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) throw new Error('Μη έγκυρη διεύθυνση email.');
}

export function confirmation(data) {
  const event = EVENT_DETAILS[data.assembly];
  const subject = 'Επιβεβαίωση Εγγραφής ' + data.salutation + ' ' + data.name + ' ' + data.surname + ' στο ' + event.dinner.replace(/^το /, '');
  const rows = [
    ['Μεγάλη Συνέλευση', event.title],
    ['Ονοματεπώνυμο', data.name + ' ' + data.surname],
    ['Προσφώνηση', data.salutation],
    ['Κατάσταση / Αξίωμα', data.statusType + ' - ' + data.office],
    ['Επαρχία / Περιφέρεια', data.province],
    ['Στοά', data.lodge],
    ['Συνοδοί στο δείπνο', String(data.partner)],
    ['Κινητό', data.mobile],
    ['Email', data.email]
  ];
  const tableRows = rows.map(row =>
    '<tr><th style="padding:9px;border:1px solid #d0aa4f;background:#f5ecd5;text-align:left">' + escapeHtml_(row[0]) + '</th>' +
    '<td style="padding:9px;border:1px solid #d0aa4f">' + escapeHtml_(row[1]) + '</td></tr>'
  ).join('');

  const html = '<div style="max-width:680px;margin:auto;font-family:Arial,sans-serif;color:#061a35">' +
    '<div style="padding:24px;background:#123f78;color:white;text-align:center;border-bottom:4px solid #d0aa4f">' +
    '<h1 style="margin:0;font-size:23px">ΕΘΝΙΚΗ ΜΕΓΑΛΗ ΣΤΟΑ ΤΗΣ ΕΛΛΑΔΟΣ</h1></div>' +
    '<div style="padding:28px;border:1px solid #d0aa4f">' +
    '<h2>Ευχαριστούμε για τη δήλωση συμμετοχής</h2>' +
    '<p>Αγαπητέ ' + escapeHtml_(data.salutation + ' ' + data.name + ' ' + data.surname) + ',</p>' +
    '<p>Η εγγραφή σας καταχωρίστηκε επιτυχώς.</p>' +
    '<div style="margin:18px 0;padding:14px;border:2px solid #a32626;background:#fff0e8;color:#861c1c;font-weight:bold">' +
    'ΠΡΟΣΟΧΗ: Η ΔΗΛΩΣΗ ΣΥΜΜΕΤΟΧΗΣ ΑΦΟΡΑ ΤΟ ΔΕΙΠΝΟ ΚΑΙ ΟΧΙ ΤΗ ΜΕΓΑΛΗ ΣΥΝΕΛΕΥΣΗ.</div>' +
    '<table style="width:100%;border-collapse:collapse">' + tableRows + '</table>' +
    '<p style="margin-top:25px">Για τη Διοργάνωση<br>Ο Μέγας Γραμματεύς<br><strong>Πσεβ. Αδ. Δημήτριος Σκιαδόπουλος</strong></p>' +
    '</div></div>';

  const plain = 'Αγαπητέ ' + data.salutation + ' ' + data.name + ' ' + data.surname + ',\n\n' +
    'Η εγγραφή σας καταχωρίστηκε επιτυχώς για ' + event.dinner + '.\n\n' +
    'ΠΡΟΣΟΧΗ: Η ΔΗΛΩΣΗ ΣΥΜΜΕΤΟΧΗΣ ΑΦΟΡΑ ΤΟ ΔΕΙΠΝΟ ΚΑΙ ΟΧΙ ΤΗ ΜΕΓΑΛΗ ΣΥΝΕΛΕΥΣΗ.\n\n' +
    'Για τη Διοργάνωση\nΟ Μέγας Γραμματεύς\nΠσεβ. Αδ. Δημήτριος Σκιαδόπουλος';

  return {to:data.email,subject,text:plain,html};
}


function normalizeMobile_(value) {
  return String(value || '').replace(/\D/g, '').replace(/^30(?=69\d{8}$)/, '');
}

function validateMobile_(mobile) {
  if (!/^69\d{8}$/.test(mobile)) throw new Error('INVALID_MOBILE: Μη έγκυρο ελληνικό κινητό.');
}

function clean_(value) {
  return String(value == null ? '' : value).trim();
}


function escapeHtml_(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

// Normalise Greek accents/spacing for matching free-text Lodge names and provinces.
function normalizeDecemberText_(value) {
  return String(value == null ? '' : value).normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ').trim().toUpperCase();
}

function normalizedDecemberLodgeName_(value) {
  return normalizeDecemberText_(value)
    .replace(/\s+ΥΠ\s*[’']?\s*ΑΡΙΘΜ\.?\s*\d+\b.*$/, '')
    .replace(/\s+(?:NO|NΟ|ΝΟ|Ν|#)\.?\s*\d+\b.*$/, '')
    .trim();
}

function classifyDecemberProvince_(lodge, enteredProvince) {
  const master = getDecemberMasterLodge_(lodge);
  if (master) return canonicalDecemberProvince_(master[2]);
  const text = normalizeDecemberText_(lodge);
  const numMatch = text.match(/ΥΠ\s*[’']?\s*ΑΡΙΘΜ\.?\s*(\d+)\b/) ||
    text.match(/(?:^|\s)(?:NO|NΟ|ΝΟ|Ν|#)\.?\s*(\d+)\b/);
  if (numMatch) {
    const number = Number(numMatch[1]);
    const byNumber = DEC_LODGE_REFERENCE.find(ref => ref[0] === number);
    if (byNumber) return byNumber[2];
  }

  const name = normalizedDecemberLodgeName_(lodge);
  if (name) {
    const provinces = [...new Set(DEC_LODGE_REFERENCE
      .filter(ref => normalizedDecemberLodgeName_(ref[1]) === name)
      .map(ref => ref[2]))];
    if (provinces.length === 1) return provinces[0];
  }

  // F is a fallback when the Lodge is absent/ambiguous in the provided list.
  const selected = normalizeDecemberText_(enteredProvince);
  const aliases = [
    ['ΑΘΗΝΩΝ', 'ΑΘΗΝΩΝ'],
    ['ΠΕΙΡΑΙΩΣ & ΑΙΓΑΙΟΥ', 'ΠΕΙΡΑΙΩΣ & ΑΡΧΙΠΕΛΑΓΟΥΣ ΑΙΓΑΙΟΥ'],
    ['ΠΕΙΡΑΙΩΣ & ΑΡΧΙΠΕΛΑΓΟΥΣ ΑΙΓΑΙΟΥ', 'ΠΕΙΡΑΙΩΣ & ΑΡΧΙΠΕΛΑΓΟΥΣ ΑΙΓΑΙΟΥ'],
    ['ΙΟΝΙΩΝ ΝΗΣΩΝ', 'ΙΟΝΙΩΝ ΝΗΣΩΝ'],
    ['ΔΥΤΙΚΗΣ ΕΛΛΑΔΟΣ', 'ΠΕΛ & Δ ΕΛΛΑΔΟΣ'],
    ['ΠΕΛ & Δ ΕΛΛΑΔΟΣ', 'ΠΕΛ & Δ ΕΛΛΑΔΟΣ'],
    ['ΚΕΝΤΡΙΚΗΣ & ΒΟΡΕΙΟΥ ΕΛΛΑΔΟΣ', 'ΚΕΝΤΡΙΚΗΣ & ΒΟΡΕΙΟΥ ΕΛΛΑΔΟΣ'],
    ['ΚΥΠΡΟΥ', 'ΚΥΠΡΟΥ'],
    ['ΣΤΟΑ ΚΕΝΤΡΟΥ', 'ΣΤΟΑ ΚΕΝΤΡΟΥ']
  ];
  const match = aliases.find(pair => normalizeDecemberText_(pair[0]) === selected);
  return match ? match[1] : DEC_UNKNOWN_PROVINCE;
}

// Each entry is B:H, with F=province, G=Lodge, H=companions.
// Return the exact same counts used by the email and the statistics tab.
function getDecemberProvinceStatistics_(entries) {
  const totals = Object.fromEntries(DEC_PROVINCE_LABELS.map(province =>
    [province, { brothers: 0, companions: 0, seats: 0 }]));
  const unmatched = [];
  let brothers = 0;
  let companions = 0;
  entries.forEach(row => {
    if (!String(row[0]).trim() || !String(row[1]).trim()) return;
    const province = classifyDecemberProvince_(row[5], row[4]);
    const parsed = Number(String(row[6] == null ? '0' : row[6]).trim().replace(',', '.'));
    const guests = Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 0;
    if (!Object.prototype.hasOwnProperty.call(totals, province)) {
      totals[province] = { brothers: 0, companions: 0, seats: 0 };
    }
    totals[province].brothers += 1;
    totals[province].companions += guests;
    totals[province].seats += guests + 1;
    brothers += 1;
    companions += guests;
    if (province === DEC_UNKNOWN_PROVINCE) {
      unmatched.push([row[0], row[1], row[5]].join(' '));
    }
  });
  const names = DEC_PROVINCE_LABELS.slice();
  if (totals[DEC_UNKNOWN_PROVINCE]) names.push(DEC_UNKNOWN_PROVINCE);
  return {
    rows: names.map(name => [name, totals[name].brothers, totals[name].companions, totals[name].seats]),
    brothers: brothers,
    companions: companions,
    seats: brothers + companions,
    unmatched: unmatched
  };
}

// Add a separate 4-column provincial table (H:K) without touching May 2027.

export function dinnerReport(entries) {
  if (entries.length === 0) return null;

  const provinceReport = getDecemberProvinceStatistics_(entries);
  const brothers = provinceReport.brothers;
  const companions = provinceReport.companions;
  const seats = provinceReport.seats;
  const newest = entries[entries.length - 1];
  const subject = 'ΔΗΛΩΣΗ ΔΕΙΠΝΟΥ 19 ΔΕΚ - ' +
    String(newest[0]).trim() + ' ' + String(newest[1]).trim() +
    ' - ' + String(newest[5]).trim();

  const zeroSection = buildDecemberZeroLodgesSection_(getDecemberDailyDetails_(entries));
  const columns = ['ΟΝΟΜΑ (B)', 'ΕΠΩΝΥΜΟ (C)', 'ΑΞΙΩΜΑ (E)', 'ΣΤΟΑ (G)', 'ΣΥΝΟΔΟΙ (H)'];
  const reportRows = entries.map(row => [row[0], row[1], row[3], row[5], row[6]]);

  const plain = [
    'ΕΘΝΙΚΗ ΜΕΓΑΛΗ ΣΤΟΑ ΤΗΣ ΕΛΛΑΔΟΣ',
    'ΔΗΛΩΣΕΙΣ ΣΥΜΜΕΤΟΧΗΣ — ΔΕΙΠΝΟ 19 ΔΕΚΕΜΒΡΙΟΥ 2026',
    '',
    'ΑΔΕΛΦΟΙ ΔΗΛΩΣΑΝ : ' + brothers,
    'ΣΥΝΟΔΟΙ : ' + companions,
    'ΣΥΝΟΛΟ ΘΕΣΕΩΝ: ' + seats,
    '',
    'ΣΥΜΜΕΤΟΧΗ ΕΠΑΡΧΙΩΝ',
    'ΕΠΑΡΧΙΑ | ΑΔΕΛΦΟΙ | ΣΥΝΟΔΟΙ | ΣΥΝΟΛΟ ΘΕΣΕΩΝ',
    ...provinceReport.rows.map(row => row.join(' | ')),
    ['ΓΕΝΙΚΟ ΣΥΝΟΛΟ', brothers, companions, seats].join(' | '),
    ...(provinceReport.unmatched.length ? ['ΜΗ ΤΑΥΤΟΠΟΙΗΜΕΝΕΣ ΣΤΟΕΣ: ' + provinceReport.unmatched.join('; ')] : []),
    '',
    'ΑΝΑΛΥΤΙΚΗ ΚΑΤΑΣΤΑΣΗ ΕΓΓΡΑΦΩΝ',
    columns.join(' | '),
    ...reportRows.map(row => row.map(cell => String(cell == null ? '' : cell)).join(' | ')),
    ...zeroSection.plain
  ].join('\n');

  const htmlHeaders = columns.map(col =>
    '<th style="padding:9px;border:1px solid #c7d2df;background:#123f78;color:white;text-align:left">' +
    escapeHtml_(col) + '</th>'
  ).join('');
  const htmlRows = reportRows.map((row, index) =>
    '<tr style="background:' + (index % 2 ? '#f4f7fb' : '#ffffff') + '">' +
    row.map(cell => '<td style="padding:8px;border:1px solid #d5dee8">' +
      escapeHtml_(cell) + '</td>').join('') + '</tr>'
  ).join('');
  const provinceHeaders = ['ΕΠΑΡΧΙΑ', 'ΑΔΕΛΦΟΙ', 'ΣΥΝΟΔΟΙ', 'ΣΥΝΟΛΟ ΘΕΣΕΩΝ'];
  const provinceHtmlHeaders = provinceHeaders.map(col =>
    '<th style="padding:9px;border:1px solid #c7d2df;background:#123f78;color:white;text-align:left">' +
    escapeHtml_(col) + '</th>'
  ).join('');
  const provinceHtmlRows = provinceReport.rows.map((row, index) =>
    '<tr style="background:' + (index % 2 ? '#f4f7fb' : '#ffffff') + '">' +
    row.map((cell, cellIndex) => '<td style="padding:8px;border:1px solid #d5dee8;' +
      (cellIndex > 0 ? 'text-align:center;' : '') + '">' + escapeHtml_(cell) + '</td>')
      .join('') + '</tr>'
  ).join('');
  const provinceTotalHtml = '<tr style="background:#f5ecd5;font-weight:bold">' +
    ['ΓΕΝΙΚΟ ΣΥΝΟΛΟ', brothers, companions, seats].map(cell =>
      '<td style="padding:9px;border:1px solid #c8a44d">' + escapeHtml_(cell) + '</td>')
      .join('') + '</tr>';

  const html = '<div style="font-family:Arial,sans-serif;color:#102c4f">' +
    '<h2 style="margin:0 0 6px">ΕΘΝΙΚΗ ΜΕΓΑΛΗ ΣΤΟΑ ΤΗΣ ΕΛΛΑΔΟΣ</h2>' +
    '<h3 style="margin:0 0 18px">ΔΗΛΩΣΗ ΔΕΙΠΝΟΥ — 19 ΔΕΚΕΜΒΡΙΟΥ 2026</h3>' +
    '<div style="padding:14px;background:#f0f4f9;border-left:4px solid #c8a44d;line-height:1.9">' +
    '<strong>ΑΔΕΛΦΟΙ ΔΗΛΩΣΑΝ : ' + brothers + '</strong><br>' +
    '<strong>ΣΥΝΟΔΟΙ : ' + companions + '</strong><br>' +
    '<strong>ΣΥΝΟΛΟ ΘΕΣΕΩΝ: ' + seats + '</strong></div>' +
    '<h3 style="margin-top:24px">ΣΥΜΜΕΤΟΧΗ ΕΠΑΡΧΙΩΝ</h3>' +
    '<div style="overflow-x:auto"><table style="border-collapse:collapse;width:100%;font-size:13px">' +
    '<thead><tr>' + provinceHtmlHeaders + '</tr></thead><tbody>' + provinceHtmlRows +
    provinceTotalHtml + '</tbody></table></div>' +
    (provinceReport.unmatched.length ? '<p style="color:#a32626;font-size:12px">' +
      'Χωρίς ταυτοποίηση επαρχίας: ' + escapeHtml_(provinceReport.unmatched.join('; ')) + '</p>' : '') +
    '<p style="margin-top:24px">Αναλυτική κατάσταση δηλώσεων (γραμμή 2 έως τελευταία καταχώριση):</p>' +
    '<div style="overflow-x:auto"><table style="border-collapse:collapse;width:100%;font-size:13px">' +
    '<thead><tr>' + htmlHeaders + '</tr></thead><tbody>' + htmlRows +
    '</tbody></table></div>' + zeroSection.html + '</div>';
  return { subject: subject, plain: plain, html: html };
}


const DEC_ZERO_LODGE_MASTER = Object.freeze([
  [
    "1",
    "ΠΑΛΑΙΩΝ ΠΑΤΡΩΝ ΓΕΡΜΑΝΟΣ",
    "ΕπΜΣτ. Πελοποννήσου & Δυτικής Ελλάδας",
    "Ενεργή"
  ],
  [
    "2",
    "ΑΚΡΟΠΟΛΙΣ",
    "ΕπΜΣτ. Αθηνών",
    "Ενεργή"
  ],
  [
    "3",
    "ΠΑΡΘΕΝΩΝ",
    "ΕπΜΣτ. Πειραιώς & Νήσων Αρχ. Αιγαίου",
    "Ενεργή"
  ],
  [
    "4",
    "ΜΙΑΟΥΛΗΣ",
    "ΕπΜΣτ. Πειραιώς & Νήσων Αρχ. Αιγαίου",
    "Ενεργή"
  ],
  [
    "5",
    "ΠΙΣΤΙΣ",
    "ΕπΜΣτ. Πειραιώς & Νήσων Αρχ. Αιγαίου",
    "Ενεργή"
  ],
  [
    "6",
    "ΟΜΟΝΟΙΑ ΣΤΟΑ ΜΕΓΑΛΟΥ ΔΙΔΑΣΚΑΛΟΥ",
    "ΕπΜΣτ. Αθηνών",
    "Ενεργή"
  ],
  [
    "8",
    "ΗΛΙΟΤΡΟΠΙΟΝ",
    "ΕπΜΣτ. Αθηνών",
    "Ενεργή"
  ],
  [
    "9",
    "ΙΣΙΣ",
    "ΕπΜΣτ. Αθηνών",
    "Ενεργή"
  ],
  [
    "10",
    "ΗΡΑΚΛΕΙΤΟΣ",
    "ΕπΜΣτ. Αθηνών",
    "Ενεργή"
  ],
  [
    "11",
    "ΑΘΗΝΑ ΣΟΦΙΑ",
    "ΕπΜΣτ. Αθηνών",
    "Ενεργή"
  ],
  [
    "12",
    "ΗΡΑΚΛΗΣ",
    "ΕπΜΣτ. Πειραιώς & Νήσων Αρχ. Αιγαίου",
    "Ενεργή"
  ],
  [
    "13",
    "GARIBALDI",
    "ΕπΜΣτ. Αθηνών",
    "Ενεργή"
  ],
  [
    "15",
    "ΕΜΠΕΔΟΚΛΗΣ",
    "ΕπΜΣτ. Πειραιώς & Νήσων Αρχ. Αιγαίου",
    "Ενεργή"
  ],
  [
    "16",
    "ΕΝΩΣΙΣ ΛΕΥΚΑΔΟΣ",
    "ΕπΜΣτ. Ιονίων Νήσων",
    "Ενεργή"
  ],
  [
    "17",
    "ΑΝΑΓΕΝΝΗΣΙΣ",
    "ΕπΜΣτ. Αθηνών",
    "Ενεργή"
  ],
  [
    "18",
    "ΕΓΚΑΤΕΣΤΗΜΕΝΩΝ ΣΕΒΑΣΜΙΩΝ",
    "ΕπΜΣτ. Αθηνών",
    "Ενεργή"
  ],
  [
    "19",
    "ΤΡΙΠΤΟΛΕΜΟΣ",
    "ΕπΜΣτ. Αθηνών",
    "Ενεργή"
  ],
  [
    "21",
    "ΑΤΤΙΚΟΣ ΑΣΤΗΡ",
    "ΕπΜΣτ. Αθηνών",
    "Ενεργή"
  ],
  [
    "23",
    "ΠΥΘΑΓΟΡΑΣ",
    "ΕπΜΣτ. Αθηνών",
    "Ενεργή"
  ],
  [
    "24",
    "ΦΙΛΙΚΗ ΕΤΑΙΡΕΙΑ",
    "ΕπΜΣτ. Πειραιώς & Νήσων Αρχ. Αιγαίου",
    "Ενεργή"
  ],
  [
    "26",
    "ΜΕΓΑΣ ΑΛΕΞΑΝΔΡΟΣ",
    "ΕπΜΣτ. Κεντρικής & Βορείου Ελλάδος",
    "Ενεργή"
  ],
  [
    "28",
    "ΚΑΜΕΙΡΟΣ",
    "ΕπΜΣτ. Πειραιώς & Νήσων Αρχ. Αιγαίου",
    "Ενεργή"
  ],
  [
    "29",
    "ΚΑΣΣΑΝΔΡΟΣ",
    "ΕπΜΣτ. Κεντρικής & Βορείου Ελλάδος",
    "Ενεργή"
  ],
  [
    "30",
    "ΘΕΣΣΑΛΟΝΙΚΗ",
    "ΕπΜΣτ. Κεντρικής & Βορείου Ελλάδος",
    "Ενεργή"
  ],
  [
    "31",
    "ΣΩΚΡΑΤΗΣ",
    "ΕπΜΣτ. Πειραιώς & Νήσων Αρχ. Αιγαίου",
    "Ενεργή"
  ],
  [
    "32",
    "ΔΙΩΝΗ",
    "ΕπΜΣτ. Πελοποννήσου & Δυτικής Ελλάδας",
    "Ενεργή"
  ],
  [
    "33",
    "ΠΟΣΕΙΔΩΝΙΑ",
    "ΕπΜΣτ. Πειραιώς & Νήσων Αρχ. Αιγαίου",
    "Ενεργή"
  ],
  [
    "36",
    "ΔΕΙΝΟΚΡΑΤΗΣ",
    "ΕπΜΣτ. Κεντρικής & Βορείου Ελλάδος",
    "Ενεργή"
  ],
  [
    "39",
    "ΙΠΠΟΚΡΑΤΗΣ",
    "ΕπΜΣτ. Αθηνών",
    "Ενεργή"
  ],
  [
    "42",
    "ΑΔΑΜΑΝΤΙΟΣ ΚΟΡΑΗΣ",
    "ΕπΜΣτ. Αθηνών",
    "Ενεργή"
  ],
  [
    "44",
    "ΒΥΖΑΣ",
    "ΕπΜΣτ. Πειραιώς & Νήσων Αρχ. Αιγαίου",
    "Ενεργή"
  ],
  [
    "48",
    "ΑΡΗΤΗ",
    "ΕπΜΣτ. Ιονίων Νήσων",
    "Ενεργή"
  ],
  [
    "50",
    "ΔΑΙΔΑΛΟΣ",
    "ΕπΜΣτ. Πειραιώς & Νήσων Αρχ. Αιγαίου",
    "Ενεργή"
  ],
  [
    "52",
    "SAINT GEORGE",
    "ΕπΜΣτ. Αθηνών",
    "Ανενεργή"
  ],
  [
    "53",
    "BENEFICENZA",
    "ΕπΜΣτ. Ιονίων Νήσων",
    "Ενεργή"
  ],
  [
    "54",
    "ΑΡΓΩ",
    "ΕπΜΣτ. Αθηνών",
    "Ενεργή"
  ],
  [
    "55",
    "ΕΝΩΣΙΣ (ΚΥΠΡΟΣ)",
    "ΠΜΣτ. Κύπρου",
    "Ενεργή"
  ],
  [
    "58",
    "LA FRANCE",
    "ΕπΜΣτ. Αθηνών",
    "Ενεργή"
  ],
  [
    "59",
    "ΟΜΗΡΟΣ",
    "ΕπΜΣτ. Αθηνών",
    "Ενεργή"
  ],
  [
    "60",
    "ΔΗΜΗΤΡΑ",
    "ΕπΜΣτ. Κεντρικής & Βορείου Ελλάδος",
    "Ενεργή"
  ],
  [
    "61",
    "ΑΝΤΩΝΙΟΣ ΜΠΕΝΑΚΗΣ",
    "ΕπΜΣτ. Ιονίων Νήσων",
    "Ενεργή"
  ],
  [
    "62",
    "ΠΛΟΥΤΑΡΧΟΣ",
    "ΕπΜΣτ. Αθηνών",
    "Ανενεργή"
  ],
  [
    "64",
    "ΦΙΛΕΛΛΗΝΩΝ",
    "ΠΜΣτ. Κύπρου",
    "Ενεργή"
  ],
  [
    "66",
    "ΠΥΘΑΓΟΡΑΣ",
    "ΕπΜΣτ. Ιονίων Νήσων",
    "Ενεργή"
  ],
  [
    "67",
    "ΕΛΛΗΝΟΓΛΩΣΣΟΝ ΞΕΝΟΔΟΧΕΙΟΝ",
    "ΕπΜΣτ. Αθηνών",
    "Ενεργή"
  ],
  [
    "69",
    "ΑΝΤΙΠΛΟΙΑΡΧΟΣ ΒΛΑΧΑΚΟΣ",
    "ΕπΜΣτ. Πειραιώς & Νήσων Αρχ. Αιγαίου",
    "Ενεργή"
  ],
  [
    "70",
    "ΠΛΑΤΩΝ",
    "ΕπΜΣτ. Αθηνών",
    "Ενεργή"
  ],
  [
    "71",
    "ΛΗΔΡΑ",
    "ΠΜΣτ. Κύπρου",
    "Ενεργή"
  ],
  [
    "74",
    "ΜΕΓΑΛΩΝ ΕΠΙΜΕΛΗΤΩΝ",
    "ΕπΜΣτ. Αθηνών",
    "Ενεργή"
  ],
  [
    "76",
    "ΛΟΡΔΟΣ ΒΥΡΩΝ",
    "ΕπΜΣτ. Αθηνών",
    "Ενεργή"
  ],
  [
    "78",
    "ΑΘΗΝΑ ΣΤΑΘΜΙΑ",
    "ΕπΜΣτ. Αθηνών",
    "Ενεργή"
  ],
  [
    "80",
    "ΑΠΟΛΛΩΝΙΟΣ Ο ΡΟΔΙΟΣ",
    "ΕπΜΣτ. Πειραιώς & Νήσων Αρχ. Αιγαίου",
    "Ενεργή"
  ],
  [
    "84",
    "ΚΥΠΡΑΙΩΝ ΗΡΩΩΝ",
    "ΠΜΣτ. Κύπρου",
    "Ενεργή"
  ],
  [
    "85",
    "RUDYARD KIPLING",
    "ΕπΜΣτ. Ιονίων Νήσων",
    "Ενεργή"
  ],
  [
    "86",
    "FRATELLI BANDIERA",
    "ΕπΜΣτ. Ιονίων Νήσων",
    "Ενεργή"
  ],
  [
    "88",
    "ΑΓΙΟΥ ΙΩΑΝΝΟΥ",
    "ΕπΜΣτ. Αθηνών",
    "Ανενεργή"
  ],
  [
    "89",
    "ΛΟΓΟΣ",
    "ΕπΜΣτ. Αθηνών",
    "Ενεργή"
  ],
  [
    "90",
    "ΑΘΑΝΑΣΙΟΣ ΛΕΥΚΑΔΙΤΗΣ",
    "ΕπΜΣτ. Αθηνών",
    "Ενεργή"
  ],
  [
    "91",
    "ΕΛΛΗΝΩΝ ΗΡΩΩΝ",
    "ΕπΜΣτ. Αθηνών",
    "Ενεργή"
  ],
  [
    "92",
    "ΙΩΑΝΝΗΣ ΚΑΠΟΔΙΣΤΡΙΑΣ",
    "ΕπΜΣτ. Ιονίων Νήσων",
    "Ενεργή"
  ],
  [
    "93",
    "ΦΙΛΟΓΕΝΕΙΑ",
    "ΕπΜΣτ. Ιονίων Νήσων",
    "Ενεργή"
  ],
  [
    "94",
    "ΔΙΟΝΥΣΙΟΣ ΡΩΜΑΣ",
    "ΕπΜΣτ. Ιονίων Νήσων",
    "Ενεργή"
  ],
  [
    "95",
    "LA PAIX",
    "ΕπΜΣτ. Ιονίων Νήσων",
    "Ενεργή"
  ],
  [
    "96",
    "ΘΕΜΙΣΤΟΚΛΗΣ",
    "ΕπΜΣτ. Πειραιώς & Νήσων Αρχ. Αιγαίου",
    "Ενεργή"
  ],
  [
    "97",
    "ΙΣΟΤΗΣ 1882",
    "ΕπΜΣτ. Αθηνών",
    "Ενεργή"
  ],
  [
    "98",
    "ΔΩΔΩΝΗ",
    "ΕπΜΣτ. Πελοποννήσου & Δυτικής Ελλάδας",
    "Ενεργή"
  ],
  [
    "99",
    "ΚΑΘΗΚΟΝ",
    "ΕπΜΣτ. Πειραιώς & Νήσων Αρχ. Αιγαίου",
    "Ενεργή"
  ],
  [
    "100",
    "ΑΚΑΚΙΑ",
    "ΕπΜΣτ. Πελοποννήσου & Δυτικής Ελλάδας",
    "Ενεργή"
  ],
  [
    "101",
    "ΑΛΕΞΑΝΔΡΟΣ ΡΩΜΑΣ",
    "ΕπΜΣτ. Πελοποννήσου & Δυτικής Ελλάδας",
    "Ενεργή"
  ],
  [
    "102",
    "ΦΕΡΔΙΝΑΝΔΟΣ ΦΟΝ ΜΠΡΑΟΥΝΣΒΑΪΚ",
    "ΕπΜΣτ. Αθηνών",
    "Ενεργή"
  ],
  [
    "103",
    "ΠΛΑΤΩΝ",
    "ΕπΜΣτ. Αθηνών",
    "Ενεργή"
  ],
  [
    "104",
    "ΑΚΡΟΠΟΛΙΣ",
    "ΕπΜΣτ. Αθηνών",
    "Ενεργή"
  ],
  [
    "105",
    "ΠΡΟΜΗΘΕΥΣ",
    "ΕπΜΣτ. Αθηνών",
    "Ενεργή"
  ],
  [
    "106",
    "ΜΑΚΕΔΩΝ",
    "ΕπΜΣτ. Κεντρικής & Βορείου Ελλάδος",
    "Ενεργή"
  ],
  [
    "107",
    "ΑΤΛΑΝΤΙΣ",
    "ΕπΜΣτ. Πειραιώς & Νήσων Αρχ. Αιγαίου",
    "Ενεργή"
  ],
  [
    "108",
    "ΕΥΡΩΠΗ",
    "ΕπΜΣτ. Αθηνών",
    "Ενεργή"
  ],
  [
    "109",
    "ΑΡΙΣΤΟΜΕΝΗΣ",
    "ΕπΜΣτ. Πελοποννήσου & Δυτικής Ελλάδας",
    "Ανενεργή"
  ],
  [
    "110",
    "ΜΥΚΟΝΟΣ",
    "ΕπΜΣτ. Πειραιώς & Νήσων Αρχ. Αιγαίου",
    "Ενεργή"
  ],
  [
    "111",
    "ΣΠΥΡΙΔΩΝ ΝΑΓΟΣ",
    "ΕπΜΣτ. Αθηνών",
    "Ενεργή"
  ],
  [
    "112",
    "ΗΦΑΙΣΤΙΑ",
    "ΕπΜΣτ. Πειραιώς & Νήσων Αρχ. Αιγαίου",
    "Ενεργή"
  ],
  [
    "113",
    "ΔΗΜΗΤΗΡ 123",
    "ΕπΜΣτ. Πειραιώς & Νήσων Αρχ. Αιγαίου",
    "Ενεργή"
  ],
  [
    "114",
    "ΓΕΩΡΓΙΟΣ ΣΟΥΡΗΣ",
    "ΕπΜΣτ. Πειραιώς & Νήσων Αρχ. Αιγαίου",
    "Ενεργή"
  ],
  [
    "115",
    "ΟΡΦΕΥΣ",
    "ΕπΜΣτ. Κεντρικής & Βορείου Ελλάδος",
    "Ενεργή"
  ],
  [
    "116",
    "ΕΥΣΤΑΘΙΟΣ ΛΙΑΚΟΠΟΥΛΟΣ",
    "ΕπΜΣτ. Αθηνών",
    "Ενεργή"
  ],
  [
    "117",
    "ΣΠΥΡΟΣ ΣΑΜΑΡΑΣ",
    "ΕπΜΣτ. Αθηνών",
    "Ενεργή"
  ],
  [
    "118",
    "ΑΤΛΑΣ",
    "ΕπΜΣτ. Πειραιώς & Νήσων Αρχ. Αιγαίου",
    "Ενεργή"
  ],
  [
    "Φ",
    "ΦΟΙΝΙΞ ΚΕΡΚΥΡΑΣ",
    "ΕπΜΣτ. Ιονίων Νήσων",
    "Ενεργή"
  ]
]);

const DEC_ZERO_PROVINCE_ORDER = Object.freeze([
  'ΕπΜΣτ. Αθηνών',
  'ΕπΜΣτ. Πειραιώς & Νήσων Αρχ. Αιγαίου',
  'ΕπΜΣτ. Ιονίων Νήσων',
  'ΕπΜΣτ. Πελοποννήσου & Δυτικής Ελλάδας',
  'ΕπΜΣτ. Κεντρικής & Βορείου Ελλάδος',
  'ΠΜΣτ. Κύπρου',
  'ΧΩΡΙΣ ΚΑΤΑΧΩΡΙΣΜΕΝΗ ΕΠΑΡΧΙΑ'
]);

function normalizeDecemberZeroLodgeName_(value) {
  return String(value == null ? '' : value).normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/[’'`´\-.,()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function resolveDecemberLodgeKey_(value, knownKeys, byName) {
  const text = normalizeDecemberZeroLodgeName_(value);
  if (!text) return null;
  if (text.includes('ΦΟΙΝΙΞ ΚΕΡΚΥΡΑΣ')) return knownKeys.has('Φ') ? 'Φ' : null;

  // Examples: "ΘΕΜΙΣΤΟΚΛΗΣ υπ’ αριθμ. 96", "ΣΤΟΑ No. 96".
  // Latin and Greek "No" (Ν/N + Ο/O), αριθμ./αριθ./αρ., #, №.
  const m = text.match(/(?:^|\s)(?:ΑΡΙΘΜ|ΑΡΙΘ|ΑΡ|[NΝ][OΟ]|NUMBER|№|#)\s*[.:#º°-]*\s*(\d{1,3})(?!\d)/);
  if (m) {
    const key = String(Number(m[1]));
    return knownKeys.has(key) ? key : null;
  }
  // Unique full lodge name (also covers names that contain digits:
  // ΙΣΟΤΗΣ 1882, ΔΗΜΗΤΗΡ 123). Duplicate names such as
  // ΑΚΡΟΠΟΛΙΣ / ΠΛΑΤΩΝ / ΠΥΘΑΓΟΡΑΣ without a number are NOT guessed.
  if (byName.has(text)) return byName.get(text);
  // "ΘΕΜΙΣΤΟΚΛΗΣ 96" or "96 ΘΕΜΙΣΤΟΚΛΗΣ": accept only if name and number agree.
  const nameByKey = getDecemberLodgeMasterIndex_().nameByKey;
  const bare = text.match(/^(.+?)\s+(\d{1,3})$/) || text.match(/^(\d{1,3})\s+(.+)$/);
  if (bare) {
    const num = /^\d+$/.test(bare[1]) ? bare[1] : bare[2];
    const name = /^\d+$/.test(bare[1]) ? bare[2] : bare[1];
    const key = String(Number(num));
    if (knownKeys.has(key) && nameByKey.get(key) === name) return key;
  }
  return null;
}
// ===========================================================================
// ΤΕΛΙΚΗ ΡΥΘΜΙΣΗ EMAIL — ΔΕΙΠΝΟ 19/12/2026
//   (1) ΕΝΑ πρωινό email περί τις 09:30 στους 4 παραλήπτες (έως 18/12/2026).
//   (2) Η υφιστάμενη επιβεβαίωση στον Αδελφό παραμένει ίδια.
//   (3) Μία πλήρης αναλυτική ενημέρωση στο info@nglgreece.gr σε κάθε νέα δήλωση.
// Η προηγούμενη ΞΕΧΩΡΙΣΤΗ ημερήσια αναφορά μηδενικών Στοών ΚΑΤΑΡΓΕΙΤΑΙ.
// Οι Στοές χωρίς συμμετοχή εμφανίζονται ΜΕΣΑ στο ένα πρωινό email.
// ===========================================================================


const DEC_BRIEFING_DETAIL_PROVINCES = Object.freeze(['ΙΟΝΙΩΝ ΝΗΣΩΝ']);

// Map the official uploaded 88-lodge catalogue to the six reporting provinces.
function canonicalDecemberProvince_(masterProvince) {
  const value = normalizeDecemberText_(masterProvince);
  if (value.includes('ΑΘΗΝΩΝ')) return 'ΑΘΗΝΩΝ';
  if (value.includes('ΠΕΙΡΑΙΩΣ')) return 'ΠΕΙΡΑΙΩΣ & ΑΡΧΙΠΕΛΑΓΟΥΣ ΑΙΓΑΙΟΥ';
  if (value.includes('ΙΟΝΙΩΝ')) return 'ΙΟΝΙΩΝ ΝΗΣΩΝ';
  if (value.includes('ΠΕΛΟΠΟΝΝΗΣΟΥ') || value.includes('ΔΥΤΙΚΗΣ ΕΛΛΑΔ')) return 'ΠΕΛ & Δ ΕΛΛΑΔΟΣ';
  if (value.includes('ΒΟΡΕΙΟΥ')) return 'ΚΕΝΤΡΙΚΗΣ & ΒΟΡΕΙΟΥ ΕΛΛΑΔΟΣ';
  if (value.includes('ΚΥΠΡΟΥ')) return 'ΚΥΠΡΟΥ';
  return DEC_UNKNOWN_PROVINCE;
}

let DEC_MASTER_INDEX_CACHE_ = null;
function getDecemberLodgeMasterIndex_() {
  if (DEC_MASTER_INDEX_CACHE_) return DEC_MASTER_INDEX_CACHE_;
  const byKey = new Map();
  const nameByKey = new Map();
  const namesToKeys = new Map();
  DEC_ZERO_LODGE_MASTER.forEach(row => {
    const key = String(row[0]);
    byKey.set(key, row);
    const name = normalizeDecemberZeroLodgeName_(row[1]);
    nameByKey.set(key, name);
    if (!namesToKeys.has(name)) namesToKeys.set(name, []);
    namesToKeys.get(name).push(key);
  });
  const uniqueByName = new Map();
  namesToKeys.forEach((keys, name) => {
    if (keys.length === 1) uniqueByName.set(name, keys[0]);
  });
  DEC_MASTER_INDEX_CACHE_ = { byKey: byKey, nameByKey: nameByKey,
    uniqueByName: uniqueByName, knownKeys: new Set(byKey.keys()) };
  return DEC_MASTER_INDEX_CACHE_;
}

function getDecemberMasterLodge_(lodgeValue) {
  const index = getDecemberLodgeMasterIndex_();
  const key = resolveDecemberLodgeKey_(lodgeValue, index.knownKeys, index.uniqueByName);
  return key ? index.byKey.get(key) : null;
}

// Read only completed B:C rows. Breakdown by Επαρχία -> Αριθμός/Στοά,
// with Brothers, companions (H) and seats. Never silently lose unknown lodges.
function getDecemberDailyDetails_(entries) {
  const index = getDecemberLodgeMasterIndex_();
  const grouped = new Map(DEC_PROVINCE_LABELS.map(name => [name, new Map()]));
  const registeredKeys = new Set();
  const unknown = new Set();
  let brothers = 0;
  let companions = 0;

  entries.forEach(row => {
    const firstName = String(row[0] || '').trim(); // B
    const lastName = String(row[1] || '').trim();  // C
    if (!firstName || !lastName) return;
    const rawLodge = String(row[5] || '').trim(); // G
    const rawGuests = Number(String(row[6] == null ? '0' : row[6]).trim().replace(',', '.')); // H
    const guests = Number.isFinite(rawGuests) && rawGuests > 0 ? Math.floor(rawGuests) : 0;
    const key = resolveDecemberLodgeKey_(rawLodge, index.knownKeys, index.uniqueByName);
    const master = key ? index.byKey.get(key) : null;
    if (master) registeredKeys.add(key);
    else unknown.add(rawLodge || '(ΧΩΡΙΣ ΣΤΟΑ)');

    const province = master ? canonicalDecemberProvince_(master[2]) :
      classifyDecemberProvince_(rawLodge, row[4]); // F
    if (!grouped.has(province)) grouped.set(province, new Map());
    const number = master ? String(master[0]) : '—';
    const name = master ? String(master[1]) : (rawLodge || 'ΜΗ ΤΑΥΤΟΠΟΙΗΜΕΝΗ ΣΤΟΑ');
    const recordKey = master ? 'id:' + number : 'unmatched:' + normalizeDecemberText_(name);
    const lodges = grouped.get(province);
    if (!lodges.has(recordKey)) {
      lodges.set(recordKey, { number: number, name: name, brothers: 0, companions: 0, seats: 0 });
    }
    const record = lodges.get(recordKey);
    record.brothers += 1;
    record.companions += guests;
    record.seats += 1 + guests;
    brothers += 1;
    companions += guests;
  });

  const order = DEC_PROVINCE_LABELS.slice();
  for (const name of grouped.keys()) if (!order.includes(name)) order.push(name);
  const provinces = order.map(name => {
    const lodges = [...(grouped.get(name) || new Map()).values()]
      .sort((a, b) => (a.number === 'Φ' ? 999 : Number(a.number) || 998) -
                       (b.number === 'Φ' ? 999 : Number(b.number) || 998) ||
                       a.name.localeCompare(b.name, 'el'));
    return {
      name: name, lodges: lodges,
      brothers: lodges.reduce((sum, v) => sum + v.brothers, 0),
      companions: lodges.reduce((sum, v) => sum + v.companions, 0),
      seats: lodges.reduce((sum, v) => sum + v.seats, 0)
    };
  });

  const zero = DEC_ZERO_LODGE_MASTER.filter(row => !registeredKeys.has(String(row[0])));
  const zeroActive = zero.filter(row => String(row[3]).trim() === 'Ενεργή');
  const zeroInactive = zero.filter(row => String(row[3]).trim() !== 'Ενεργή');
  const zeroProvinceOrder = order.slice();
  if (zeroActive.some(row => canonicalDecemberProvince_(row[2]) === DEC_UNKNOWN_PROVINCE) &&
      !zeroProvinceOrder.includes(DEC_UNKNOWN_PROVINCE)) {
    zeroProvinceOrder.push(DEC_UNKNOWN_PROVINCE);
  }
  const zeroByProvince = zeroProvinceOrder.map(name => ({
    name: name,
    lodges: zeroActive.filter(row => canonicalDecemberProvince_(row[2]) === name)
      .sort((a, b) => (Number(a[0]) || 999) - (Number(b[0]) || 999))
  }));
  return {
    provinces: provinces,
    brothers: brothers,
    companions: companions,
    seats: brothers + companions,
    zeroCount: zero.length,
    zeroActive: zeroActive.length,
    zeroInactive: zeroInactive.length,
    zeroByProvince: zeroByProvince,
    inactiveLodges: zeroInactive,
    unknownLodges: [...unknown].sort((a, b) => a.localeCompare(b, 'el'))
  };
}

// Στοές με μηδενική συμμετοχή — μόνο για info@nglgreece.gr.
function buildDecemberZeroLodgesSection_(report) {
  const plain = ['', 'ΣΤΟΕΣ ΜΕ ΜΗΔΕΝΙΚΗ ΣΥΜΜΕΤΟΧΗ: ' + report.zeroCount +
    ' (Ενεργές: ' + report.zeroActive + ', Ανενεργές: ' + report.zeroInactive + ')'];
  let html = '<h3 style="margin-top:28px">ΣΤΟΕΣ ΜΕ ΜΗΔΕΝΙΚΗ ΣΥΜΜΕΤΟΧΗ: ' + report.zeroCount + '</h3>' +
    '<p>Ενεργές: <b>' + report.zeroActive + '</b> — Ανενεργές: <b>' + report.zeroInactive + '</b></p>';
  report.zeroByProvince.forEach(province => {
    if (!province.lodges.length) return;
    plain.push('', province.name + ' (' + province.lodges.length + ')');
    province.lodges.forEach(lodge => plain.push('  ' + lodge[0] + ' — ' + lodge[1]));
    html += '<h4 style="color:#123f78;margin:14px 0 4px">' + escapeHtml_(province.name) +
      ' (' + province.lodges.length + ')</h4><p style="margin:0;line-height:1.8;font-size:13px">' +
      province.lodges.map(lodge => escapeHtml_(lodge[0] + ' — ' + lodge[1])).join('<br>') + '</p>';
  });
  if (report.inactiveLodges.length) {
    plain.push('', 'ΑΝΕΝΕΡΓΕΣ ΣΤΟΕΣ ΧΩΡΙΣ ΔΗΛΩΣΗ');
    report.inactiveLodges.forEach(lodge => plain.push('  ' + lodge[0] + ' — ' + lodge[1]));
    html += '<h4 style="margin:16px 0 4px">ΑΝΕΝΕΡΓΕΣ ΣΤΟΕΣ ΧΩΡΙΣ ΔΗΛΩΣΗ</h4><p style="font-size:13px">' +
      report.inactiveLodges.map(lodge => escapeHtml_(lodge[0] + ' — ' + lodge[1])).join('<br>') + '</p>';
  }
  if (report.unknownLodges.length) {
    plain.push('', 'ΕΛΕΓΧΟΣ: ΜΗ ΤΑΥΤΟΠΟΙΗΜΕΝΕΣ ΣΤΟΕΣ', ...report.unknownLodges);
    html += '<p style="padding:10px;background:#fff0e8;color:#a32626"><b>Απαιτείται έλεγχος:</b> ' +
      escapeHtml_(report.unknownLodges.join('; ')) + '</p>';
  }
  return { plain: plain, html: html };
}

export function morningReport(entries, day) {
  const report = getDecemberDailyDetails_(entries);
  const subject = 'ΠΡΩΙΝΗ ΕΝΗΜΕΡΩΣΗ ΣΥΜΜΕΤΟΧΩΝ' + ' (' + report.seats + ')';
  const intro = [
    'ΕΘΝΙΚΗ ΜΕΓΑΛΗ ΣΤΟΑ ΤΗΣ ΕΛΛΑΔΟΣ',
    'ΔΗΛΩΣΗ ΔΕΙΠΝΟΥ — 19 ΔΕΚΕΜΒΡΙΟΥ 2026',
    'Ημερομηνία αναφοράς: ' + day,
    '',
    'ΣΥΝΟΛΟ ΣΥΜΜΕΤΟΧΩΝ',
    'ΑΔΕΛΦΟΙ ΔΗΛΩΣΑΝ : ' + report.brothers,
    'ΣΥΝΟΔΟΙ : ' + report.companions,
    'ΣΥΝΟΛΟ ΘΕΣΕΩΝ : ' + report.seats
  ];
  const detailed = report.provinces.filter(p => DEC_BRIEFING_DETAIL_PROVINCES.includes(p.name));
  detailed.forEach(province => {
    intro.push('', 'ΑΝΑΛΥΣΗ ΑΝΑ ΣΤΟΑ — ' + province.name);
    if (province.lodges.length) {
      province.lodges.forEach(lodge => intro.push(
        '  ' + lodge.number + ' — ' + lodge.name +
        ' | Αδελφοί: ' + lodge.brothers + ' | Συνοδοί: ' + lodge.companions +
        ' | Σύνολο: ' + lodge.seats));
    } else intro.push('  Καμία δήλωση συμμετοχής.');
    intro.push('  ΣΥΝΟΛΟ ' + province.name + ' | Αδελφοί: ' + province.brothers +
      ' | Συνοδοί: ' + province.companions + ' | Σύνολο: ' + province.seats);
  });
  intro.push('', 'ΣΥΜΜΕΤΟΧΗ ΕΠΑΡΧΙΩΝ');
  report.provinces.forEach(province => intro.push(province.name + ' — Αδελφοί: ' +
    province.brothers + ' | Συνοδοί: ' + province.companions +
    ' | Σύνολο θέσεων: ' + province.seats));
  intro.push('ΓΕΝΙΚΟ ΣΥΝΟΛΟ — Αδελφοί: ' + report.brothers +
    ' | Συνοδοί: ' + report.companions + ' | Σύνολο θέσεων: ' + report.seats);
  // Οι Στοές με μηδενική συμμετοχή αποστέλλονται ΜΟΝΟ στο info@nglgreece.gr
  // (βλ. sendDecemberDinnerReport_), όχι στην πρωινή ενημέρωση.
  intro.push('', 'Με αφοσίωση,', 'ΜΓραμμ.');
  const plain = intro.join('\n');

  const head = '<div style="border-bottom:4px solid #c8a44d;padding-bottom:12px">' +
    '<h2 style="margin:0;color:#123f78">ΕΘΝΙΚΗ ΜΕΓΑΛΗ ΣΤΟΑ ΤΗΣ ΕΛΛΑΔΟΣ</h2>' +
    '<h3 style="margin:5px 0">ΔΗΛΩΣΗ ΔΕΙΠΝΟΥ — 19 ΔΕΚΕΜΒΡΙΟΥ 2026</h3>' +
    '<div style="font-size:12px;color:#69778b">Πρωινή ενημέρωση: ' + day + '</div></div>';
  const summary = '<h3 style="margin:20px 0 8px">ΣΥΝΟΛΟ ΣΥΜΜΕΤΟΧΩΝ</h3>' +
    '<table style="border-collapse:collapse;width:100%;max-width:650px;font-size:15px">' +
    '<tr style="background:#eff4fa"><td style="padding:10px;border:1px solid #c9d3df">ΑΔΕΛΦΟΙ ΔΗΛΩΣΑΝ</td>' +
    '<td style="padding:10px;border:1px solid #c9d3df;text-align:right"><b>' + report.brothers + '</b></td></tr>' +
    '<tr><td style="padding:10px;border:1px solid #c9d3df">ΣΥΝΟΔΟΙ</td>' +
    '<td style="padding:10px;border:1px solid #c9d3df;text-align:right"><b>' + report.companions + '</b></td></tr>' +
    '<tr style="background:#f5ecd5"><td style="padding:10px;border:1px solid #c8a44d">ΣΥΝΟΛΟ ΘΕΣΕΩΝ</td>' +
    '<td style="padding:10px;border:1px solid #c8a44d;text-align:right"><b>' + report.seats + '</b></td></tr></table>';
  const th = (value) => '<th style="background:#123f78;color:white;padding:8px;border:1px solid #a9b7c8;text-align:left">' +
    escapeHtml_(value) + '</th>';
  const td = (value, numeric) => '<td style="padding:7px 9px;border:1px solid #d6e0ea;' +
    (numeric ? 'text-align:center;' : '') + '">' + escapeHtml_(value) + '</td>';
  let detailHtml = '';
  let provinceHtml = '<h3 style="margin-top:28px">ΣΥΜΜΕΤΟΧΗ ΕΠΑΡΧΙΩΝ</h3>' +
    '<table style="width:100%;border-collapse:collapse;font-size:13px"><thead><tr>' +
    th('ΕΠΑΡΧΙΑ') + th('ΑΔΕΛΦΟΙ') + th('ΣΥΝΟΔΟΙ') + th('ΣΥΝΟΛΟ ΘΕΣΕΩΝ') + '</tr></thead><tbody>';
  report.provinces.forEach((province, idx) => {
    provinceHtml += '<tr style="background:' + (idx % 2 ? '#f4f7fb' : '#ffffff') + '">' +
      td(province.name, false) + td(province.brothers, true) +
      td(province.companions, true) + td(province.seats, true) + '</tr>';
  });
  provinceHtml += '<tr style="background:#f5ecd5;font-weight:bold">' + td('ΓΕΝΙΚΟ ΣΥΝΟΛΟ', false) +
    td(report.brothers, true) + td(report.companions, true) + td(report.seats, true) +
    '</tr></tbody></table>';
  report.provinces.filter(p => DEC_BRIEFING_DETAIL_PROVINCES.includes(p.name)).forEach(province => {
    detailHtml += '<h3 style="margin:24px 0 8px;color:#123f78">ΑΝΑΛΥΣΗ ΑΝΑ ΣΤΟΑ — ' +
      escapeHtml_(province.name) + '</h3>';
    detailHtml += '<table style="width:100%;border-collapse:collapse;font-size:13px"><thead><tr>' +
      th('ΑΡ. ΣΤΟΑΣ') + th('ΣΤΟΑ') + th('ΑΔΕΛΦΟΙ') + th('ΣΥΝΟΔΟΙ') + th('ΣΥΝΟΛΟ') + '</tr></thead><tbody>';
    if (province.lodges.length) {
      province.lodges.forEach((lodge, idx) => {
        detailHtml += '<tr style="background:' + (idx % 2 ? '#f4f7fb' : '#ffffff') + '">' +
          td(lodge.number, false) + td(lodge.name, false) + td(lodge.brothers, true) +
          td(lodge.companions, true) + td(lodge.seats, true) + '</tr>';
      });
    } else detailHtml += '<tr><td colspan="5" style="padding:9px;color:#69778b">Καμία δήλωση συμμετοχής.</td></tr>';
    detailHtml += '<tr style="background:#e7edf4;font-weight:bold">' + td('ΣΥΝΟΛΟ', false) + td(province.name, false) +
      td(province.brothers, true) + td(province.companions, true) + td(province.seats, true) + '</tr></tbody></table>';
  });

  const html = '<div style="font-family:Arial,Helvetica,sans-serif;color:#102c4f;max-width:980px;line-height:1.45">' +
    head + summary + detailHtml + provinceHtml +
    '<p style="margin-top:28px">Με αφοσίωση,<br><strong>ΜΓραμμ.</strong></p></div>';
  return { subject: subject, plain: plain, html: html, report: report };
}

// A single, idempotent morning email. No duplicate on the same Athens day.

export {EVENT_DETAILS, sanitizeForm_, validateForm_, normalizeMobile_};
