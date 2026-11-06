const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');const base=path.join(__dirname,'../public/');
const cases=[['en','family'],['zh-Hans','亲子'],['zh-Hant','親子'],['fil','pamilya'],['id','keluarga'],['ms','keluarga']];
(async()=>{for(const [lang,query] of cases){
 const out={items:[],append(x){this.items.push(x)}};const input={value:''};
 const context={window:{},document:{documentElement:{lang},querySelector:s=>s==='#results'?out:input,createElement:()=>({items:[],append(...x){this.items.push(...x)}})},location:{search:'?q='+encodeURIComponent(query)},URLSearchParams,fetch:async url=>({ok:true,json:async()=>JSON.parse(fs.readFileSync(base+url.slice(1)))})};vm.createContext(context);
 if(lang!=='en')vm.runInContext(fs.readFileSync(base+'locale-'+lang+'.js','utf8'),context);vm.runInContext(fs.readFileSync(base+'i18n.js','utf8'),context);
 await vm.runInContext(fs.readFileSync(base+'site.js','utf8'),context);assert(out.items.some(x=>x.href===(lang==='en'?'':'/'+lang)+'/journal/family-japan/'));
 const result=out.items.find(x=>x.href);if(lang!=='en')assert(!result.items[0].textContent.includes('Japan with children'));console.log('PASS',lang,'search returns localized family guide');
}})().catch(e=>{console.error(e);process.exit(1)});
