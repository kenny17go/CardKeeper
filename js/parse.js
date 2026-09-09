/* OCR text -> structured business-card fields, v3 parser */
const CardParse = (() => {
  const TITLE_KEYWORDS=['董事長','副董事長','總經理','副總經理','執行長','營運長','財務長','技術長','協理','總監','經理','副理','主任','組長','課長','部長','專員','工程師','設計師','業務','顧問','秘書','助理','店長','教授','醫師','律師','會計師','創辦人','負責人','CEO','CTO','CFO','COO','President','Director','Manager','Founder','Engineer','Designer','Consultant','Sales','Marketing','Specialist','Assistant','Executive','Officer','Chairman','Partner','Owner','VP'];
  const COMPANY_KEYWORDS=['股份有限公司','有限公司','企業社','工作室','科技','集團','事務所','診所','醫院','銀行','證券','保險','投信','投顧','公司','商行','國際','Inc.','Inc','Ltd','Ltd.','LLC','Co.','Corp','Corporation','Group','Company','Studio','Technology','Solutions','Bank'];
  const ADDRESS_HINTS=['路','街','巷','弄','號','樓','區','市','縣','鄉','鎮','Road','Rd','Street','St','Ave','Avenue','Floor','District','City','No.'];
  const CATEGORY_MAP=[
    {cat:'科技/軟體',kws:['科技','軟體','資訊','數位','網路','Tech','Software','Digital','IT','Cloud']},
    {cat:'金融/保險',kws:['銀行','保險','金控','證券','投信','投顧','Bank','Insurance','Capital','Financial']},
    {cat:'餐飲',kws:['餐廳','餐飲','咖啡','食品','Restaurant','Cafe','Food']},{cat:'醫療/健康',kws:['醫院','診所','藥局','健康','醫師','Clinic','Hospital','Medical','Health']},
    {cat:'設計/創意',kws:['設計','工作室','廣告','攝影','Design','Studio','Creative','Media']},{cat:'教育',kws:['學校','教育','大學','學院','School','University','Education']},
    {cat:'房地產/建築',kws:['建設','建築','房屋','地產','營造','Real Estate','Construction']},{cat:'製造/工業',kws:['工業','製造','機械','Manufacturing','Industrial']},
    {cat:'零售/貿易',kws:['貿易','商行','零售','Trading','Retail']},{cat:'法律/顧問',kws:['律師','事務所','會計師','顧問','Law','Legal','Consulting']}
  ];
  const clean=s=>(s||'').replace(/[|¦]/g,'I').replace(/[•●◆■]+/g,' ').replace(/\s+/g,' ').trim();
  const lines=t=>(t||'').split(/\r?\n/).map(clean).filter(Boolean);
  const digits=s=>(s||'').replace(/[^\d+]/g,'');
  function emails(t){return [...new Set((t.match(/[\w.%+-]+\s*@\s*[\w.-]+\s*\.\s*[A-Za-z]{2,}/g)||[]).map(x=>x.replace(/\s/g,'').toLowerCase()))];}
  function websites(t,es){return [...new Set(t.match(/(?:https?:\/\/)?(?:www\.)?[\w-]+(?:\.[\w-]+)+(?:\/[^\s]*)?/gi)||[])].map(x=>x.replace(/[),.;，。；]+$/,'')).filter(x=>!x.includes('@')&&!es.some(e=>e.includes(x.toLowerCase()))&&/\.(com|tw|net|org|io|co|biz|cc|asia|edu|gov)(\/|$|\.)/i.test(x));}
  function phoneObjects(t){
    const out=[]; const seen=new Set();
    const re=/(?:\+?886[-\s]?)?(?:\(?0?9\d{2}\)?[-\s]?\d{3}[-\s]?\d{3}|\(?0\d{1,2}\)?[-\s]?\d{3,4}[-\s]?\d{4})(?:\s*(?:ext\.?|x|#|分機)\s*\d{1,6})?/gi;
    for(const line of lines(t)){
      const label=/fax|傳真/i.test(line)?'fax':/mobile|cell|手機|行動/i.test(line)?'mobile':/tel|phone|電話/i.test(line)?'phone':'';
      for(const m of line.match(re)||[]){const key=digits(m);if(seen.has(key))continue;seen.add(key);out.push({value:clean(m),type:label||(/^\+?886?9|^09/.test(key)?'mobile':'phone'),source:line});}
    }
    // second pass catches unlabeled numbers when OCR puts labels elsewhere
    for(const m of t.match(re)||[]){const key=digits(m);if(!seen.has(key)){seen.add(key);out.push({value:clean(m),type:/^\+?886?9|^09/.test(key)?'mobile':'phone',source:''});}}
    return out;
  }
  const score=(line,kws)=>kws.reduce((n,k)=>n+(line.toLowerCase().includes(k.toLowerCase())?4:0),0)+(line.length>=3&&line.length<=45?1:0);
  const chineseName=l=>/^[\u3400-\u9fff·．]{2,5}$/.test(l), englishName=l=>/^[A-Z][A-Za-z.'-]+(?:\s+[A-Z][A-Za-z.'-]+){1,4}$/.test(l);
  function category(t){let b={cat:'未分類',n:0},low=t.toLowerCase();for(const e of CATEGORY_MAP){const n=e.kws.reduce((a,k)=>a+(low.includes(k.toLowerCase())?1:0),0);if(n>b.n)b={cat:e.cat,n};}return b.cat;}
  function parse(rawText){
    const text=rawText||'', ls=lines(text), es=emails(text), ws=websites(text,es), ps=phoneObjects(text), used=new Set();
    ps.forEach(p=>ls.forEach(l=>{if(p.source===l)used.add(l)})); es.forEach(e=>ls.forEach(l=>{if(l.toLowerCase().replace(/\s/g,'').includes(e))used.add(l)}));
    const company=[...ls].filter(l=>!used.has(l)).sort((a,b)=>score(b,COMPANY_KEYWORDS)-score(a,COMPANY_KEYWORDS))[0]; const companyOk=company&&score(company,COMPANY_KEYWORDS)>2.5?company:''; if(companyOk)used.add(companyOk);
    const title=[...ls].filter(l=>!used.has(l)).sort((a,b)=>score(b,TITLE_KEYWORDS)-score(a,TITLE_KEYWORDS))[0]; const titleOk=title&&score(title,TITLE_KEYWORDS)>2.5?title:''; if(titleOk)used.add(titleOk);
    const addr=ls.find(l=>!used.has(l)&&ADDRESS_HINTS.filter(k=>l.toLowerCase().includes(k.toLowerCase())).length>=2)||''; if(addr)used.add(addr);
    let name=ls.find(l=>!used.has(l)&&chineseName(l))||'';if(name)used.add(name); let nameEn=ls.find(l=>!used.has(l)&&englishName(l)&&!COMPANY_KEYWORDS.some(k=>l.toLowerCase().includes(k.toLowerCase())))||'';
    const mobiles=ps.filter(p=>p.type==='mobile'), faxes=ps.filter(p=>p.type==='fax'), phones=ps.filter(p=>p.type==='phone');
    return {name,nameEn,company:companyOk,title:titleOk,mobile:mobiles[0]?.value||'',phone:phones[0]?.value||'',phone2:phones[1]?.value||'',fax:faxes[0]?.value||'',phones:ps,email:es[0]||'',website:ws[0]||'',address:addr.replace(/^(地址|address)\s*[:：]?/i,'').trim(),category:category(text),rawText:text};
  }
  return {parse,CATEGORY_MAP,phoneObjects};
})();
