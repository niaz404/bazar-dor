// Bengali Digit & Text Utilities

const BANGLA_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
const ENGLISH_DIGITS = {
  '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
  '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9'
};

const BANGLA_MONTHS = [
  'বৈশাখ', 'জ্যৈষ্ঠ', 'আষাঢ়', 'শ্রাবণ', 'ভাদ্র', 'আশ্বিন',
  'কার্তিক', 'অগ্রহায়ণ', 'পৌষ', 'মাঘ', 'ফাল্গুন', 'চৈত্র'
];

const BANGLA_DAYS = [
  'রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'
];

const GREGORIAN_BANGLA_MONTHS = [
  'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
  'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
];

/**
 * Converts English number/string to Bengali numerals
 */
export function toBanglaNumber(num) {
  if (num === null || num === undefined) return '';
  const str = String(num);
  return str.replace(/[0-9]/g, (digit) => BANGLA_DIGITS[parseInt(digit, 10)]);
}

/**
 * Converts Bengali string numerals back to standard JavaScript Number
 */
export function fromBanglaNumber(banglaStr) {
  if (!banglaStr) return 0;
  const englishStr = String(banglaStr).replace(/[০-৯]/g, (d) => ENGLISH_DIGITS[d] || d);
  const parsed = parseFloat(englishStr.replace(/[^0-9.-]/g, ''));
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Formats price with comma separation and Bengali digits
 */
export function formatBanglaPrice(num) {
  if (num === null || num === undefined) return '০ টাকা';
  const numVal = Number(num);
  const formatted = numVal.toLocaleString('en-IN');
  return `${toBanglaNumber(formatted)} টাকা`;
}

/**
 * Formats percentage change with indicator (▲, ▼, —)
 */
export function formatBanglaPct(pct, dir) {
  const absPct = Math.abs(Number(pct) || 0).toFixed(1);
  const banglaPct = toBanglaNumber(absPct);
  
  if (dir === 'up' || Number(pct) > 0) {
    return `▲ ${banglaPct}%`;
  }
  if (dir === 'down' || Number(pct) < 0) {
    return `▼ ${banglaPct}%`;
  }
  return `— ০.০%`;
}

/**
 * Translates unit keys (kg, liter, dozen, piece) to Bengali
 */
export function formatBanglaUnit(unit) {
  switch ((unit || '').toLowerCase()) {
    case 'kg':
    case 'কেজি':
      return 'প্রতি কেজি';
    case 'liter':
    case 'লিটার':
      return 'প্রতি লিটার';
    case 'dozen':
    case 'ডজন':
      return 'প্রতি ডজন';
    case 'piece':
    case 'পিস':
      return 'প্রতি পিস';
    case '100g':
    case '১০০ গ্রাম':
      return 'প্রতি ১০০ গ্রাম';
    default:
      return unit ? `প্রতি ${unit}` : 'প্রতি একক';
  }
}

/**
 * Returns formatted today's Bengali date
 */
export function getBanglaDate() {
  const now = new Date();
  const dayName = BANGLA_DAYS[now.getDay()];
  const dateNum = toBanglaNumber(now.getDate());
  const monthName = GREGORIAN_BANGLA_MONTHS[now.getMonth()];
  const yearNum = toBanglaNumber(now.getFullYear());
  
  return `${dayName}, ${dateNum} ${monthName}, ${yearNum}`;
}
