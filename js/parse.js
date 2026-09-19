/* OCR text -> structured business-card fields, v4 parser (v5.1 OCR) */
const CardParse = (() => {
  const TITLE_KEYWORDS=['董事長','副董事長','總經理','副總經理','執行長','營運長','財務長','技術長','協理','總監','經理','副理','主任','組長','課長','部長','專員','工程師','設計師','業務','顧問','秘書','助理','店長','教授','醫師','律師','會計師','創辦人','負責人','CEO','CTO','CFO','COO','President','Director','Manager','Founder','Engineer','Designer','Consultant','Sales','Marketing','Specialist','Assistant','Executive','Officer','Chairman','Partner','Owner','VP'];
  const COMPANY_KEYWORDS=['股份有限公司','有限公司','企業社','工作室','科技','集團','事務所','診所','醫院','銀行','證券','保險','投信','投顧','公司','商行','國際','Inc.','Inc','Ltd','Ltd.','LLC','Co.','Corp','Corporation','Group','Company','Studio','Technology','Solutions','Bank'];
  const ADDRESS_HINTS=['路','街','巷','弄','號','樓','區','市','縣','鄉','鎮','Road','Rd','Street','St','Ave','Avenue','Floor','District','City','No.'];
  const CATEGORY_MAP=[
    {cat:'科技/軟體',kws:['科技','軟體','資訊','數位','網路','Tech','Software','Digital','IT','Cloud']},
    {cat:'金融/保險',kws:['銀行','保險','金控','證券','投信','投顧','Bank','Insurance','Capital','Financial']},
    {cat:'餐飲',kws:['餐廳','餐飲','咖啡','食品','Restaurant','Cafe','Food']},
    {cat:'醫療/健康',kws:['醫院','診所','藥局','健康','醫師','Clinic','Hospital','Medical','Health']},
    {cat:'設計/創意',kws:['設計','工作室','廣告','攝影','Design','Studio','Creative','Media']},
    {cat:'教育',kws:['學校','教育','大學','學院','School','University','Education']},
    {cat:'房地產/建築',kws:['建設','建築','房屋','地產','營造','Real Estate','Construction']},
    {cat:'製造/工業',kws:['工業','製造','機械','Manufacturing','Industrial']},
    {cat:'零售/貿易',kws:['貿易','商行','零售','Trading','Retail']},
    {cat:'法律/顧問',kws:['律師','事務所','會計師','顧問','Law','Legal','Consulting']}
  ];

  const NAME_EXCLUDE=['行銷','機構','金融','業務','管理','服務','部','處','科','課','組','中心','銀行','公司','股份','有限公司'];

  const clean = s => (s || '')
    .replace(/\u3000/g,' ')
    .replace(/協埋/g,'協理')
    .replace(/總緩/g,'總機')
    .replace(/[＠﹫]/g,'@')
    .replace(/[：﹕]/g,':')
    .replace(/[，]/g,',')
    .replace(/[；]/g,';')
    .replace(/[．]/g,'.')
    .replace(/[–—−]/g,'-')
    .replace(/[|¦｜]/g,'I')
    .replace(/[•●◆■]+/g,' ')
    .replace(/\s+/g,' ')
    .trim();

  const lines = t => (t || '').split(/\r?\n/).map(clean).filter(Boolean);
  const digits = s => (s || '').replace(/[^\d+]/g,'');

  function normalizeContactText(t) {
    return clean(t)
      .replace(/\s*@\s*/g,'@')
      .replace(/\s+\.\s+(?=[A-Za-z]{2,}\b)/g,'.')
      .replace(/\b(?:e[- ]?mail|mail)\s*[:：]?\s*/ig,'')
      .replace(/\b(?:web|website|網址)\s*[:：]?\s*/ig,'');
  }

  function emails(t) {
    const normalized=(t || '').split(/\r?\n/).map(normalizeContactText).join('\n');
    const found=normalized.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi) || [];
    return [...new Set(found.map(x=>x.toLowerCase().replace(/[),.;，。；]+$/,'')))];
  }

  function websites(t,es) {
    const normalized=(t || '').split(/\r?\n/).map(normalizeContactText).join('\n');
    return [...new Set(normalized.match(/(?:https?:\/\/)?(?:www\.)?[\w-]+(?:\.[\w-]+)+(?:\/[^\s]*)?/gi)||[])]
      .map(x=>x.replace(/[),.;，。；]+$/,''))
      .filter(x=>!x.includes('@')&&!es.some(e=>e.includes(x.toLowerCase()))&&/\.(com|tw|net|org|io|co|biz|cc|asia|edu|gov)(\/|$|\.)/i.test(x));
  }

  function phoneReadyLine(line) {
    const labeled=/(?:tel|phone|mobile|cell|fax|電話|手機|行動|傳真|分機|\bT\b|\bM\b|\bF\b)/i.test(line);
    let s=clean(line);
    if(labeled) s=s.replace(/[OoＯ]/g,'0');
    return s;
  }

  function phoneObjects(t) {
    const out=[]; const seen=new Set();
    const re=/(?:\+?886[-\s]?)?(?:\(?0?9\d{2}\)?[-\s]?\d{3}[-\s]?\d{3}|\(?0\d{1,2}\)?[-\s]?\d{3,4}[-\s]?\d{4})(?:\s*(?:ext\.?|x|#|分機)\s*\d{1,6})?/gi;

    function classify(line, matchIndex, value) {
      const before=line.slice(Math.max(0,matchIndex-12),matchIndex).toLowerCase();
      const key=digits(value).replace(/\D/g,'');
      // Classify by the label BEFORE this specific number. Looking after the
      // match can steal the next label on lines such as 總機... 傳真...
      if(/fax|傳真|(?:^|\s)f\s*[:：]?/i.test(before)) return 'fax';
      if(/mobile|cell|手機|行動|(?:^|\s)m\s*[:：]?/i.test(before)) return 'mobile';
      if(/專線|direct/i.test(before)) return 'phone';
      if(/tel|phone|電話|總機|(?:^|\s)t\s*[:：]?/i.test(before)) return 'phone';
      return /^(?:886)?9\d{8}$/.test(key.replace(/^0/,'')) || /^09\d{8}$/.test(key) ? 'mobile' : 'phone';
    }

    for(const original of lines(t)){
      const line=phoneReadyLine(original);
      re.lastIndex=0;
      let m;
      while((m=re.exec(line))){
        const value=clean(m[0]);
        const key=digits(value);
        if(key.replace(/\D/g,'').length < 8 || seen.has(key)) continue;
        seen.add(key);
        out.push({value,type:classify(line,m.index,value),source:original,index:m.index});
      }
    }
    return out;
  }

  const score=(line,kws)=>kws.reduce((n,k)=>n+(line.toLowerCase().includes(k.toLowerCase())?4:0),0)+(line.length>=3&&line.length<=45?1:0);
  const chineseName=l=>/^[\u3400-\u9fff·．]{2,5}$/.test(l);
  const englishName=l=>/^[A-Z][A-Za-z.'-]+(?:\s+[A-Z][A-Za-z.'-]+){1,4}$/.test(l);

  function stripFieldLabel(line) {
    return clean(line)
      .replace(/^(?:姓名|name|聯絡人|contact)\s*[:：-]?\s*/i,'')
      .replace(/^(?:公司|company|organization|organisation)\s*[:：-]?\s*/i,'')
      .replace(/^(?:職稱|title|position)\s*[:：-]?\s*/i,'')
      .trim();
  }

  function category(t) {
    let b={cat:'未分類',n:0},low=(t||'').toLowerCase();
    for(const e of CATEGORY_MAP){
      const n=e.kws.reduce((a,k)=>a+(low.includes(k.toLowerCase())?1:0),0);
      if(n>b.n)b={cat:e.cat,n};
    }
    return b.cat;
  }

  function parse(rawText) {
    const text=rawText||'';
    const ls=lines(text);
    const es=emails(text);
    const ws=websites(text,es);
    const ps=phoneObjects(text);
    const used=new Set();

    ps.forEach(p=>ls.forEach(l=>{if(p.source===l)used.add(l)}));
    es.forEach(e=>ls.forEach(l=>{if(normalizeContactText(l).toLowerCase().includes(e))used.add(l)}));

    const companyCandidates=ls
      .filter(l=>!used.has(l))
      .map((l,i)=>({raw:l,index:i,value:stripFieldLabel(l)}))
      .map(x=>{
        const hit=COMPANY_KEYWORDS.find(k=>x.value.toLowerCase().includes(k.toLowerCase()));
        if(hit){
          const pos=x.value.toLowerCase().indexOf(hit.toLowerCase());
          const prefix=x.value.slice(0,pos);
          if(prefix.length>0 && prefix.length<=5 && !/[\u3400-\u9fff]{2,}/.test(prefix)) x.value=x.value.slice(pos);
        }
        x.value=x.value.replace(/\s+[A-Za-z]{1,3}$/,'').trim();
        return x;
      })
      .sort((a,b)=>(score(b.value,COMPANY_KEYWORDS)-b.index*.03)-(score(a.value,COMPANY_KEYWORDS)-a.index*.03));
    const companyTop=companyCandidates[0];
    const companyOk=companyTop&&score(companyTop.value,COMPANY_KEYWORDS)>2.5?companyTop.value:'';
    if(companyOk)used.add(companyTop.raw);

    const titleCandidates=ls
      .filter(l=>!used.has(l))
      .map((l,i)=>({raw:l,index:i,value:stripFieldLabel(l)}))
      .sort((a,b)=>(score(b.value,TITLE_KEYWORDS)-b.index*.02)-(score(a.value,TITLE_KEYWORDS)-a.index*.02));
    const titleTop=titleCandidates[0];
    const titleOk=titleTop&&score(titleTop.value,TITLE_KEYWORDS)>2.5?titleTop.value:'';
    if(titleOk)used.add(titleTop.raw);

    const addrRaw=ls.find(l=>{
      if(used.has(l)) return false;
      const low=l.toLowerCase();
      const hits=ADDRESS_HINTS.filter(k=>low.includes(k.toLowerCase())).length;
      return /^(?:地址|address)\s*[:：]?/i.test(l) ? hits>=1 : hits>=2;
    })||'';
    if(addrRaw)used.add(addrRaw);
    const addr=addrRaw.replace(/^(地址|address)\s*[:：]?\s*/i,'').replace(/^[=：:·•\-\s]+/,'').replace(/\s*(?:統編|統一編號)\s*[:：]?\s*\d{8}.*$/i,'').replace(/[ _-]+$/,'').trim();

    let name='';
    let nameEn='';

    const nameCandidates=ls
      .map((l,i)=>({raw:l,index:i,value:stripFieldLabel(l)}))
      .filter(x=>!used.has(x.raw) && chineseName(x.value))
      .filter(x=>!NAME_EXCLUDE.some(k=>x.value.includes(k)))
      .map(x=>{
        let n=0;
        if(x.value.length===3) n+=8;
        else if(x.value.length===2 || x.value.length===4) n+=5;
        else n+=1;
        n+=Math.max(0,5-x.index*.35);
        if(TITLE_KEYWORDS.some(k=>x.value.includes(k))) n-=8;
        return {...x,nameScore:n};
      })
      .sort((a,b)=>b.nameScore-a.nameScore);
    if(nameCandidates[0]){
      name=nameCandidates[0].value;
      used.add(nameCandidates[0].raw);
    }

    for(const l of ls){
      if(used.has(l)) continue;
      const candidate=stripFieldLabel(l);
      if(!nameEn && englishName(candidate) && !COMPANY_KEYWORDS.some(k=>candidate.toLowerCase().includes(k.toLowerCase()))){
        nameEn=candidate;
      }
    }

    const mobiles=ps.filter(p=>p.type==='mobile');
    const faxes=ps.filter(p=>p.type==='fax');
    const phones=ps.filter(p=>p.type==='phone');
    phones.sort((a,b)=>(/專線|direct/i.test(b.source)?3:0)-(/專線|direct/i.test(a.source)?3:0));

    return {
      name,
      nameEn,
      company:companyOk,
      title:titleOk,
      mobile:mobiles[0]?.value||'',
      phone:phones[0]?.value||'',
      phone2:phones[1]?.value||'',
      fax:faxes[0]?.value||'',
      phones:ps,
      email:es[0]||'',
      website:ws[0]||'',
      address:addr,
      category:category(text),
      rawText:text
    };
  }

  return {parse,CATEGORY_MAP,phoneObjects};
})();
