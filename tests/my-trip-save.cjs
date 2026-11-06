const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
(async()=>{
const els=new Map(),el=id=>{if(!els.has(id))els.set(id,{append(){},replaceChildren(){}});return els.get(id)};
let unblock,unload,posted,fail=false;
const state={version:1,data:{destination:'tokyo',interest:'food',trip:'Initial plan',history:[],bookmarks:[]}};
const fetch=async(url,opts)=>{if(url==='/api/assistant')return {ok:false};if(opts.method){posted=JSON.parse(opts.body);await new Promise(r=>unblock=r);return {ok:true,json:async()=>({...state,version:2})}}if(fail)throw Error('Offline');return {ok:true,json:async()=>state}};
vm.runInNewContext(fs.readFileSync(require.resolve('../public/account.js'),'utf8'),{document:{querySelector:el,createElement:()=>({append(){}})},window:{DIY_T:t=>t,DIY_PATH:p=>p,addEventListener:(k,f)=>unload=f},fetch,confirm:()=>true});
await new Promise(setImmediate);
const editor=el('#cloud-trip'),button=el('#save-cloud-trip');
editor.value='Plan A';editor.oninput();const pending=button.onclick();assert(button.disabled);assert.equal(posted.text,'Plan A');
editor.value='Plan B';editor.oninput();unblock();await pending;let warned=false;unload({preventDefault(){warned=true}});assert(warned);assert.equal(editor.value,'Plan B');assert(!el('#trip-save-status').textContent);
fail=true;await el('#refresh-account').onclick();assert.equal(el('#account-ui').hidden,false);
const retry=button.onclick();unblock();await retry;assert.equal(posted.text,'Plan B');assert.equal(el('#trip-save-status').textContent,'Saved to your account.');
console.log('PASS: in-flight edits stay unsaved; refresh failure preserves editor; retry saves latest text.');
})().catch(e=>{console.error(e);process.exitCode=1});
