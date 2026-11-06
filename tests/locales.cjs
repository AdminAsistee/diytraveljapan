const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const base=require('node:path').join(__dirname,'../public/');
const locales=['en','zh-Hans','zh-Hant','id','ms','fil'];
const source=fs.readFileSync(base+'planner.js','utf8');
for(const lang of locales){
 const context={window:{addEventListener(){}},document:{documentElement:{lang}},console};
 vm.createContext(context);if(lang!=='en')vm.runInContext(fs.readFileSync(base+'locale-'+lang+'.js','utf8'),context);
 vm.runInContext(fs.readFileSync(base+'i18n.js','utf8'),context);
 assert.equal(context.window.DIY_PATH('/destinations/tokyo/'),(lang==='en'?'':'/'+lang)+'/destinations/tokyo/');
 assert.equal(context.window.DIY_T('Day',{n:3}),lang==='en'?'Day':{'zh-Hans':'第3天','zh-Hant':'第3天','id':'Hari 3','ms':'Hari 3','fil':'Araw 3'}[lang]);
 const els={};for(const id of ['notes','days','status','load','save','clear','export'])els[id]={value:id==='days'?'7':'',textContent:''};
 let stored='';context.document.querySelector=s=>els[s.slice(1)];context.document.createElement=()=>({click(){}});context.location={search:'?days=14'};context.URLSearchParams=URLSearchParams;context.URL={createObjectURL:()=>'',revokeObjectURL(){}};context.Blob=Blob;context.setTimeout=f=>f();context.confirm=()=>true;context.localStorage={getItem:()=>stored,setItem:(k,v)=>stored=v,removeItem:()=>stored=''};
 vm.runInContext(source,context);assert.equal(els.notes.value.split('\n\n').length,14);
 if(lang!=='en'){assert(!els.notes.value.includes('Arrive in Tokyo'));assert(!els.notes.value.includes('Departure'));}
 els.notes.value='User notes / 自分のメモ';els.save.onclick();assert.equal(stored,els.notes.value);
 els.clear.onclick();assert.equal(stored,'');
 const prefix=lang==='en'?'':lang+'/';
 const index=JSON.parse(fs.readFileSync(base+'search-index'+(lang==='en'?'':'-'+lang)+'.json'));
 assert.equal(index.length,15);
 for(const item of index){assert(fs.existsSync(base+prefix+item.path.slice(1)+'index.html'));}
 const html=fs.readFileSync(base+prefix+'planner/index.html','utf8');assert.equal((html.match(/<option value="zh-Hans"/g)||[]).length,1);assert.equal((html.match(/<option value="zh-Hant"/g)||[]).length,1);assert(html.includes('value="'+lang+'" selected'));assert(html.indexOf('/i18n.js')<html.indexOf('/planner.js'));
 console.log('PASS',lang,'localized templates, saved-text preservation, catalog links, language selection');
}
