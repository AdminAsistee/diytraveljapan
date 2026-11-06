import {calculateTotal,appendChecklist} from './booking-check-core.js';
const $=id=>document.getElementById(id),form=$('booking-check'),copy=JSON.parse($('check-copy').textContent),lang=document.documentElement.lang;
const values=()=>Object.fromEntries(new FormData(form));
const boxes=[...form.querySelectorAll('input[type=checkbox]')];
const money=(amount,currency)=>new Intl.NumberFormat(lang,{style:'currency',currency}).format(amount);
function update(){const d=values(),result=calculateTotal(d.base,d.extras,d.currency);$('check-total').textContent=result.kind==='ok'?money(result.total,d.currency):copy[result.kind==='empty'?'empty':result.kind];$('check-progress').textContent=copy.progress.replace('{n}',boxes.filter(x=>x.checked).length);for(const key of ['base','extras'])$(key).setAttribute('aria-invalid',String(result.kind==='invalid'||result.kind==='partial'));return result}
function summary(){if(!form.reportValidity())return null;const d=values(),result=update();if(['partial','invalid'].includes(result.kind)){ $('check-status').textContent=copy[result.kind];return null }
 const value=k=>d[k]?.trim()||copy.notRecorded;
 return [copy.draftLabel,copy.provider+': '+value('provider'),copy.experience+': '+value('experience'),copy.date+': '+value('date'),copy.time+': '+value('time'),copy.total+': '+(result.kind==='ok'?money(result.total,d.currency):copy.notRecorded),copy.deadline+': '+value('deadline'),copy.refund+': '+value('refund'),...boxes.map((box,i)=>(box.checked?'[✓] ':'[ ] ')+copy.checks[i]),copy.intro].join('\n');
}
form.addEventListener('input',()=>{update();$('check-trip').hidden=true;$('check-status').textContent=''});
form.addEventListener('submit',event=>event.preventDefault());
$('download-check').onclick=()=>{const text=summary();if(text===null)return;const url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='japan-booking-checklist.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);$('check-status').textContent=copy.backup};
$('save-check').onclick=async()=>{
 const text=summary();if(text===null)return;const b=$('save-check');b.disabled=true;$('check-signin').hidden=true;
 try{const response=await fetch('/api/portal',{cache:'no-store'});if(response.status===401){$('check-status').textContent=copy.signin;$('check-signin').hidden=false;return}if(!response.ok)throw Error();const state=await response.json();const trip=appendChecklist(state.data.trip,text);const saved=await fetch('/api/portal',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({type:'trip',text:trip,version:state.version})});if(!saved.ok){const error=await saved.json();throw Error(error.error)}$('check-status').textContent=copy.saved;$('check-trip').hidden=false;
 }catch(error){$('check-status').textContent=copy.failed+(error.message&&window.DIY_LOCALE?.[error.message]?' '+window.DIY_T(error.message):'')}
 finally{b.disabled=false}
};update();
