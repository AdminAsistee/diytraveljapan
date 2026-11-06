(async()=>{
 const t=window.DIY_T,q=new URLSearchParams(location.search).get('q')||'';
 const input=document.querySelector('#site-query');if(input)input.value=q;
 const out=document.querySelector('#results');if(!out)return;
 if(!q.trim()){out.textContent=t('Enter a destination or topic above to find a guide.');return}
 try{
  const locale=document.documentElement.lang;
  const r=await fetch('/search-index'+(locale==='en'?'':'-'+locale)+'.json');if(!r.ok)throw Error();const data=await r.json();
  const aliases={'東京':'tokyo','东京':'tokyo','京都':'kyoto','大阪':'osaka','拉麵':'ramen','拉面':'ramen','預算':'budget','预算':'budget','badyet':'budget','anggaran':'budget','bajet':'budget','keluarga':'family','pamilya':'family','親子':'family','亲子':'family','行程':'itinerary','rencana':'itinerary','jadual':'itinerary','araw':'days','hari':'days','天':'days','美食':'food','pagkain':'food','makanan':'food','kuliner':'food','kultura':'culture','budaya':'culture','文化':'culture','tagsibol':'spring','musim semi':'spring','musim bunga':'spring','春':'spring','秋':'autumn','taglagas':'autumn','musim gugur':'autumn','musim luruh':'autumn'};
  let normalized=q.toLowerCase();for(const [term,english] of Object.entries(aliases))normalized=normalized.replaceAll(term,' '+english+' ');
  const stop=new Set(['a','the','in','for','to','what','is','and','or','i','should','vs','versus','di','sa','ang','ng','dan']);
  const terms=(normalized.match(/[\p{L}\p{N}]+/gu)||[]).filter(w=>!stop.has(w));
  const matches=data.map(d=>({...d,score:terms.reduce((n,w)=>n+Number((d.title+' '+d.description+' '+d.path+' '+d.keywords).toLowerCase().includes(w)),0)})).filter(d=>d.score>0).sort((a,b)=>b.score-a.score);
  const count=document.createElement('p');count.textContent=matches.length?t('{count} guides for “{query}”',{count:matches.length,query:q}):t('No matching guides yet. Try Tokyo, ramen, family, or budget.');out.append(count);
  for(const d of matches){const a=document.createElement('a');a.className='result';a.href=window.DIY_PATH(d.path);const h=document.createElement('strong');h.textContent=d.title;const p=document.createElement('span');p.textContent=d.description;a.append(h,p);out.append(a)}
 }catch{out.textContent=t('Search is temporarily unavailable. Use Destinations or Travel journal above.')}
})();
