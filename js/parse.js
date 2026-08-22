/* =========================================================
   parse.js — turn raw OCR text (zh + en) into structured fields
   Pure heuristics, no network calls, works fully offline.
   ========================================================= */
const CardParse = (() => {

  const TITLE_KEYWORDS = [
    '董事長','總經理','經理','副理','協理','主任','組長','課長','部長','執行長',
    '總監','專員','工程師','設計師','業務','顧問','秘書','助理','店長','院長',
    '教授','醫師','律師','會計師','創辦人','負責人','行銷','客服','編輯',
    'CEO','CTO','CFO','COO','President','Director','Manager','Founder','Co-Founder',
    'Engineer','Designer','Consultant','Sales','Marketing','Specialist','Assistant',
    'Executive','Officer','Chairman','Partner','Owner','VP','Vice President'
  ];

  const COMPANY_KEYWORDS = [
    '股份有限公司','有限公司','企業社','工作室','科技','集團','事務所','診所','醫院',
    '銀行','餐廳','公司','商行','聯合','國際',
    'Inc.', 'Inc', 'Ltd', 'Ltd.', 'LLC', 'Co.', 'Corp', 'Corporation', 'Group',
    'Company', 'Enterprises', 'Studio', 'Technologies', 'Technology', 'Solutions'
  ];

  const ADDRESS_HINTS = [
    '路','街','巷','弄','號','樓','區','市','縣','村','鎮',
    'Road','Rd','Street','St','Ave','Avenue','Floor','Fl','District','City','No.'
  ];

  // Category keyword map — used for 🏷️ auto classification
  const CATEGORY_MAP = [
    { cat: '科技/軟體', kws: ['科技','軟體','資訊','數位','網路','Tech','Software','Digital','IT','App','Cloud'] },
    { cat: '金融/保險', kws: ['銀行','保險','金控','證券','投顧','Bank','Insurance','Capital','Financial'] },
    { cat: '餐飲', kws: ['餐廳','餐飲','咖啡','小吃','食品','Restaurant','Cafe','Food'] },
    { cat: '醫療/健康', kws: ['醫院','診所','藥局','健康','醫師','牙醫','Clinic','Hospital','Medical','Health'] },
    { cat: '設計/創意', kws: ['設計','工作室','廣告','攝影','Design','Studio','Creative','Media'] },
    { cat: '教育', kws: ['學校','補習班','教育','大學','學院','School','University','Education','Academy'] },
    { cat: '房地產/建築', kws: ['建設','建築','房屋','地產','營造','Real Estate','Construction','Architecture'] },
    { cat: '製造/工業', kws: ['工業','製造','機械','工廠','Manufacturing','Industrial','Factory'] },
    { cat: '零售/貿易', kws: ['貿易','商行','百貨','零售','Trading','Retail','Trade'] },
    { cat: '法律/顧問', kws: ['律師','事務所','會計師','顧問','Law','Legal','Consulting','Advisory'] }
  ];

  function normalizeLines(text) {
    return text
      .split(/\r?\n/)
      .map(l => l.replace(/\s+/g, ' ').trim())
      .filter(l => l.length > 0);
  }

  function extractEmails(text) {
    const re = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    return [...new Set((text.match(re) || []).map(s => s.toLowerCase()))];
  }

  function extractWebsites(text, emails) {
    const re = /(https?:\/\/[^\s]+|www\.[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}[^\s]*|[a-zA-Z0-9-]+\.(?:com|com\.tw|tw|net|org|io|co)(?:\.[a-z]{2})?(?:\/[^\s]*)?)/gi;
    let found = [...new Set(text.match(re) || [])];
    // remove anything that's actually part of an email
    found = found.filter(w => !emails.some(e => e.includes(w.toLowerCase())));
    return found;
  }

  function extractPhones(text) {
    // Matches TW mobile (09xx), TW landline w/ area code, and generic intl numbers
    const re = /(\+?886[-\s]?)?0?9\d{2}[-\s]?\d{3}[-\s]?\d{3}|(\+?886[-\s]?)?\(?0\d{1,2}\)?[-\s]?\d{3,4}[-\s]?\d{4}|\+\d{1,3}[-\s]?\d{2,4}[-\s]?\d{3,4}[-\s]?\d{3,4}/g;
    const raw = text.match(re) || [];
    const cleaned = raw.map(s => s.trim()).filter((v, i, arr) => arr.indexOf(v) === i);

    const mobiles = [];
    const landlines = [];
    for (const num of cleaned) {
      const digits = num.replace(/\D/g, '');
      const isMobile = /^(886)?0?9\d{8}$/.test(digits);
      if (isMobile) mobiles.push(num); else landlines.push(num);
    }
    return { mobiles, landlines };
  }

  function extractAddress(lines, used) {
    let best = null;
    let bestScore = 0;
    for (const line of lines) {
      if (used.has(line)) continue;
      let score = 0;
      for (const hint of ADDRESS_HINTS) if (line.includes(hint)) score++;
      if (/\d/.test(line)) score += 0.5;
      if (line.length > 8 && score > bestScore) { bestScore = score; best = line; }
    }
    return bestScore >= 1 ? best : null;
  }

  function extractCompany(lines, used) {
    for (const line of lines) {
      if (used.has(line)) continue;
      if (COMPANY_KEYWORDS.some(k => line.includes(k))) return line;
    }
    return null;
  }

  function extractTitle(lines, used) {
    for (const line of lines) {
      if (used.has(line)) continue;
      if (TITLE_KEYWORDS.some(k => line.includes(k)) && line.length <= 20) return line;
    }
    return null;
  }

  function looksLikeChineseName(line) {
    return /^[\u4e00-\u9fa5·．]{2,4}$/.test(line);
  }

  function looksLikeEnglishName(line) {
    return /^[A-Z][a-zA-Z.'-]+(\s+[A-Z][a-zA-Z.'-]+){1,3}$/.test(line.trim());
  }

  function extractNames(lines, used) {
    let zh = null, en = null;
    for (const line of lines) {
      if (used.has(line)) continue;
      if (!zh && looksLikeChineseName(line)) { zh = line; continue; }
    }
    for (const line of lines) {
      if (used.has(line) || line === zh) continue;
      if (!en && looksLikeEnglishName(line)) { en = line; continue; }
    }
    // Fallback: first short line that isn't consumed and isn't company/title-ish
    if (!zh && !en) {
      const candidate = lines.find(l => !used.has(l) && l.length <= 12 &&
        !COMPANY_KEYWORDS.some(k => l.includes(k)));
      if (candidate) zh = candidate;
    }
    return { zh, en };
  }

  function guessCategory(fullText) {
    for (const entry of CATEGORY_MAP) {
      if (entry.kws.some(k => fullText.includes(k))) return entry.cat;
    }
    return '未分類';
  }

  function parse(rawText) {
    const text = rawText || '';
    const lines = normalizeLines(text);
    const used = new Set();

    const emails = extractEmails(text);
    const websites = extractWebsites(text, emails);
    const { mobiles, landlines } = extractPhones(text);

    // mark lines that are "consumed" by email/phone/website so name/company/title
    // extraction doesn't reuse them
    for (const line of lines) {
      if (emails.some(e => line.toLowerCase().includes(e))) used.add(line);
      if (websites.some(w => line.includes(w))) used.add(line);
      if (mobiles.some(m => line.includes(m))) used.add(line);
      if (landlines.some(l => line.includes(l))) used.add(line);
    }

    const company = extractCompany(lines, used);
    if (company) used.add(company);

    const title = extractTitle(lines, used);
    if (title) used.add(title);

    const address = extractAddress(lines, used);
    if (address) used.add(address);

    const { zh, en } = extractNames(lines, used);

    const category = guessCategory(text);

    return {
      name: zh || '',
      nameEn: en || '',
      company: company || '',
      title: title || '',
      mobile: mobiles[0] || '',
      phone: landlines[0] || '',
      email: emails[0] || '',
      website: websites[0] || '',
      address: address || '',
      category,
      rawText: text
    };
  }

  return { parse, CATEGORY_MAP };
})();
