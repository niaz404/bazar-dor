export function toBanglaNumber(number) {
  if (number === null || number === undefined) return '';
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(number).replace(/[0-9]/g, (digit) => banglaDigits[digit]);
}

export function fromBanglaNumber(banglaString) {
  if (!banglaString) return 0;
  const englishDigits = {
    '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
    '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9'
  };
  const eng = String(banglaString).replace(/[০-৯]/g, (d) => englishDigits[d] || d);
  const num = parseFloat(eng.replace(/[^0-9.-]/g, ''));
  return isNaN(num) ? 0 : num;
}

export function formatBanglaPrice(price) {
  if (price === null || price === undefined) return '০ টাকা';
  return `${toBanglaNumber(price)} টাকা`;
}

export function formatBanglaPct(pct, dir) {
  if (pct === undefined || pct === null) return '— ০.০%';
  const num = Math.abs(Number(pct) || 0).toFixed(1);
  const banglaPct = toBanglaNumber(num);

  if (dir === 'up' || Number(pct) > 0) {
    return `▲ ${banglaPct}%`;
  } else if (dir === 'down' || Number(pct) < 0) {
    return `▼ ${banglaPct}%`;
  }
  return `— ০.০%`;
}

export function formatBanglaUnit(unit) {
  if (!unit) return 'প্রতি একক';
  const u = String(unit).toLowerCase();
  if (u === 'kg' || u === 'কেজি') return 'প্রতি কেজি';
  if (u === 'liter' || u === 'লিটার') return 'প্রতি লিটার';
  if (u === 'dozen' || u === 'ডজন') return 'প্রতি ডজন';
  if (u === 'piece' || u === 'পিস') return 'প্রতি পিস';
  if (u === '100g') return 'প্রতি ১০০ গ্রাম';
  return `প্রতি ${unit}`;
}

export function getBanglaDate() {
  const days = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];
  const months = [
    'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
    'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
  ];

  const today = new Date();
  const dayName = days[today.getDay()];
  const date = toBanglaNumber(today.getDate());
  const monthName = months[today.getMonth()];
  const year = toBanglaNumber(today.getFullYear());

  return `${dayName}, ${date} ${monthName}, ${year}`;
}

export function getUserInitials(name) {
  if (!name) return 'U';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}
