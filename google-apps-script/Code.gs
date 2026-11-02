const SPREADSHEET_ID = '1vlapQh0yb1xGnmsGMomRpzA1wlSyyLJ-KAs9IwE6Gxs';
const SHEET_NAME = 'Registrations';
const FIELDS = [
  'name', 'email', 'phone', 'college', 'referral', 'isParticipant',
  'eventCat', 'eventName', 'teamSize', 'isCaptain', 'teamName', 'membersName'
];
const LEGACY_HEADERS = ['timestamp', ...FIELDS];
const HEADERS = [
  'Registered At (IST)', 'Full Name', 'Email Address', 'Mobile Number',
  'Institution', 'Referral Code', 'Event Participant', 'Event Category',
  'Event Name', 'Team Size', 'Team Captain', 'Team Name', 'Team Members'
];
const CA_SHEET_NAME = 'Campus Ambassadors';
const CA_FIELDS = [
  'name', 'email', 'phone', 'gender', 'college', 'degree',
  'state', 'district', 'isSociety', 'society', 'referral'
];
const CA_HEADERS = [
  'Registered At (IST)', 'Full Name', 'Email Address', 'Mobile Number',
  'Gender', 'Institution', 'Degree / Programme', 'State', 'District',
  'Society Member', 'Society Name', 'Referral Code'
];

function cleanText(value) {
  if (value == null) return '';
  return value.trim().replace(/\s+/g, ' ');
}

function parseTeamMembers(value) {
  if (value == null) return [];
  return value.split(/[,;\r\n]+/).map(cleanText).filter(Boolean);
}

function formatRegistrationSheet(sheet) {
  formatSheet(sheet, HEADERS, [205, 180, 240, 145, 240, 140, 150, 200, 210, 100, 140, 200, 320]);
}

function formatSheet(sheet, headers, widths) {
  sheet.setFrozenRows(1);
  sheet.setRowHeight(1, 44);
  const table = sheet.getRange(1, 1, sheet.getMaxRows(), headers.length);
  table.setFontFamily('Arial').setFontSize(11).setVerticalAlignment('top').setWrap(true);
  if (sheet.getBandings().length === 0) {
    table.applyRowBanding()
      .setHeaderRowColor('#17365d')
      .setFirstRowColor('#ffffff')
      .setSecondRowColor('#f1f5f9');
  }
  sheet.getRange(1, 1, 1, headers.length)
    .setBackground('#17365d').setFontColor('#ffffff')
    .setFontWeight('bold').setVerticalAlignment('middle');
  widths.forEach((width, index) => sheet.setColumnWidth(index + 1, width));
  if (!sheet.getFilter()) table.createFilter();
}

function getCampusAmbassadorSheet() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = spreadsheet.getSheetByName(CA_SHEET_NAME)
    || spreadsheet.insertSheet(CA_SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, CA_HEADERS.length).setValues([CA_HEADERS]);
    formatSheet(sheet, CA_HEADERS, [205, 180, 240, 145, 120, 240, 180, 160, 160, 140, 200, 140]);
  } else {
    const existing = sheet.getRange(1, 1, 1, CA_HEADERS.length).getValues()[0];
    if (!existing.every((value, index) => value === CA_HEADERS[index])) {
      throw new Error('Unrecognized Campus Ambassadors headers. Existing data was not changed.');
    }
  }
  return sheet;
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function getRegistrationSheet() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = spreadsheet.getSheetByName(SHEET_NAME)
    || spreadsheet.insertSheet(SHEET_NAME);
  const isEmpty = sheet.getLastRow() === 0;
  const existing = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0];
  const isLegacy = existing.every((value, index) => value === LEGACY_HEADERS[index]);
  const isCurrent = existing.every((value, index) => value === HEADERS[index]);
  if (!isEmpty && !isLegacy && !isCurrent) {
    throw new Error('Unrecognized headers. Restore the original columns before running setup.');
  }
  if (isEmpty || isLegacy) {
    // Only rename the known header row. Existing registration data stays in place.
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    formatRegistrationSheet(sheet);
  }
  return sheet;
}

// Run once from the editor to authorize access and create the headers.
function setup() {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    formatRegistrationSheet(getRegistrationSheet());
    formatSheet(getCampusAmbassadorSheet(), CA_HEADERS, [205, 180, 240, 145, 120, 240, 180, 160, 160, 140, 200, 140]);
    SpreadsheetApp.flush();
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return jsonResponse({ status: 'ready' });
}

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new Error('Expected a registration object.');
  }
  if (data.recordType === 'campusAmbassador') return saveCampusAmbassador(data);
  if (data.recordType) throw new Error('Unknown record type.');
  const values = FIELDS.map(field => {
    const value = data[field] == null ? '' : data[field];
    if (typeof value !== 'string' || value.length > 5000) {
      throw new Error('Invalid field: ' + field);
    }
    if (field === 'membersName') return parseTeamMembers(value).join(', ');
    if (field === 'email') return value.trim().toLowerCase();
    return cleanText(value);
  });
  ['name', 'email', 'phone', 'college'].forEach(field => {
    if (!values[FIELDS.indexOf(field)]) throw new Error('Required: ' + field);
  });
  const normalized = Object.fromEntries(FIELDS.map((field, index) => [field, values[index]]));
  if (!/^\d{10}$/.test(normalized.phone)) throw new Error('Invalid phone.');
  if (!/^\S+@\S+\.\S+$/.test(normalized.email)) throw new Error('Invalid email.');
  if (!['yes', 'no'].includes(normalized.isParticipant)) {
    throw new Error('Invalid participant selection.');
  }
  if (normalized.isParticipant === 'yes') {
    ['eventCat', 'eventName', 'teamSize', 'isCaptain', 'teamName'].forEach(field => {
      if (!values[FIELDS.indexOf(field)]) throw new Error('Required: ' + field);
    });
  }

  if (normalized.isParticipant === 'yes') {
    if (!/^\d+$/.test(normalized.teamSize)
        || !Number.isSafeInteger(Number(normalized.teamSize)) || Number(normalized.teamSize) < 1) {
      throw new Error('Team size must be a positive whole number.');
    }
    if (!['yes', 'no'].includes(normalized.isCaptain)) throw new Error('Invalid captain selection.');
    if (parseTeamMembers(normalized.membersName).length > Number(normalized.teamSize)) {
      throw new Error('The number of names exceeds the team size.');
    }
  }

  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const sheet = getRegistrationSheet();
    // Store form input as text and escape formula prefixes.
    const safeValues = values.map((value, index) => {
      if (['isParticipant', 'isCaptain'].includes(FIELDS[index]) && value) {
        return value === 'yes' ? 'Yes' : 'No';
      }
      return /^[=+\-@]/.test(value) ? "'" + value : value;
    });
    const row = sheet.getRange(sheet.getLastRow() + 1, 1, 1, HEADERS.length);
    row.setNumberFormat('@');
    row.setFontFamily('Arial').setFontSize(11).setFontColor('#1f2937').setWrap(true);
    row.setValues([[Utilities.formatDate(new Date(), 'Asia/Kolkata', 'dd MMM yyyy, HH:mm:ss'), ...safeValues]]);
    SpreadsheetApp.flush();
    return jsonResponse({ ok: true });
  } finally {
    lock.releaseLock();
  }
}

function saveCampusAmbassador(data) {
  const values = CA_FIELDS.map(field => {
    const value = data[field] == null ? '' : data[field];
    if (typeof value !== 'string' || value.length > 5000) throw new Error('Invalid field: ' + field);
    if (field === 'email') return value.trim().toLowerCase();
    if (field === 'referral') return value.trim().toUpperCase();
    return cleanText(value);
  });
  const normalized = Object.fromEntries(CA_FIELDS.map((field, index) => [field, values[index]]));
  ['name', 'email', 'phone', 'college', 'referral'].forEach(field => {
    if (!normalized[field]) throw new Error('Required: ' + field);
  });
  if (!/^\d{10}$/.test(normalized.phone)) throw new Error('Invalid phone.');
  if (!/^\S+@\S+\.\S+$/.test(normalized.email)) throw new Error('Invalid email.');
  if (!/^[A-Z]{3}\d{3}$/.test(normalized.referral)) throw new Error('Invalid referral code.');
  if (!['MALE', 'FEMALE', 'OTHERS'].includes(normalized.gender)) throw new Error('Invalid gender.');
  if (!['yes', 'no'].includes(normalized.isSociety.toLowerCase())) throw new Error('Invalid society selection.');
  if (data.registeredAt != null && typeof data.registeredAt !== 'string') throw new Error('Invalid registration date.');
  const registeredAt = data.registeredAt ? new Date(data.registeredAt) : new Date();
  if (!Number.isFinite(registeredAt.getTime())) throw new Error('Invalid registration date.');

  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const sheet = getCampusAmbassadorSheet();
    if (sheet.getLastRow() > 1) {
      const existing = sheet.getRange(2, 1, sheet.getLastRow() - 1, CA_HEADERS.length).getValues();
      if (existing.some(row => String(row[3 - 1]).trim().toLowerCase() === normalized.email
          || String(row[12 - 1]).trim().toUpperCase() === normalized.referral)) {
        return jsonResponse({ ok: true, duplicate: true, sheet: CA_SHEET_NAME });
      }
    }
    const safeValues = values.map((value, index) => {
      if (CA_FIELDS[index] === 'isSociety') return value.toLowerCase() === 'yes' ? 'Yes' : 'No';
      return /^[=+\-@]/.test(value) ? "'" + value : value;
    });
    const row = sheet.getRange(sheet.getLastRow() + 1, 1, 1, CA_HEADERS.length);
    row.setNumberFormat('@');
    row.setFontFamily('Arial').setFontSize(11).setFontColor('#1f2937').setWrap(true);
    row.setValues([[Utilities.formatDate(registeredAt, 'Asia/Kolkata', 'dd MMM yyyy, HH:mm:ss'), ...safeValues]]);
    SpreadsheetApp.flush();
    return jsonResponse({ ok: true, sheet: CA_SHEET_NAME });
  } finally {
    lock.releaseLock();
  }
}
