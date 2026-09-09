/* =========================================================
   vcard.js — vCard 3.0 export/share for iOS/Android contacts.
   Browser security prevents silent contact writes; this creates
   a standards-based .vcf and opens the native share/import flow.
   ========================================================= */
const CardVCard = (() => {
  function esc(v) { return String(v || '').replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;'); }
  function cleanPhone(v) { return String(v || '').trim(); }
  function build(card) {
    const display = card.name || card.nameEn || card.company || '聯絡人';
    const lines = [
      'BEGIN:VCARD', 'VERSION:3.0',
      `FN:${esc(display)}`,
      card.name ? `N:${esc(card.name)};;;;` : '',
      card.nameEn ? `X-ALT-NAME:${esc(card.nameEn)}` : '',
      card.company ? `ORG:${esc(card.company)}` : '',
      card.title ? `TITLE:${esc(card.title)}` : '',
      card.mobile ? `TEL;TYPE=CELL:${esc(cleanPhone(card.mobile))}` : '',
      card.phone ? `TEL;TYPE=WORK,VOICE:${esc(cleanPhone(card.phone))}` : '',
      card.phone2 ? `TEL;TYPE=WORK,VOICE:${esc(cleanPhone(card.phone2))}` : '',
      card.fax ? `TEL;TYPE=WORK,FAX:${esc(cleanPhone(card.fax))}` : '',
      card.email ? `EMAIL;TYPE=INTERNET,WORK:${esc(card.email)}` : '',
      card.website ? `URL:${esc(/^https?:\/\//i.test(card.website) ? card.website : 'https://' + card.website)}` : '',
      card.address ? `ADR;TYPE=WORK:;;${esc(card.address)};;;;` : '',
      card.note ? `NOTE:${esc(card.note)}` : '',
      'END:VCARD'
    ].filter(Boolean);
    return lines.join('\r\n');
  }
  function filename(card) {
    const base = (card.name || card.nameEn || card.company || 'contact').replace(/[\\/:*?"<>|]/g, '_').slice(0, 48);
    return `${base}.vcf`;
  }
  async function addToContacts(card) {
    const blob = new Blob([build(card)], { type: 'text/vcard;charset=utf-8' });
    const file = new File([blob], filename(card), { type: 'text/vcard' });
    if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file], title: `加入聯絡人：${card.name || card.nameEn || card.company || ''}` });
      return 'shared';
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = filename(card);
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
    return 'downloaded';
  }
  return { build, addToContacts };
})();
