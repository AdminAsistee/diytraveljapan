export const currencies=['JPY','USD','CNY','TWD','PHP','IDR','MYR','SGD','HKD','EUR','GBP','AUD'];
export function calculateTotal(base,extras,currency){
 if(!currencies.includes(currency))return {kind:'invalid'};
 if(base===''&&extras==='')return {kind:'empty'};
 if(base===''||extras==='')return {kind:'partial'};
 const decimals=new Intl.NumberFormat('en',{style:'currency',currency}).resolvedOptions().maximumFractionDigits;
 const scale=10**decimals;
 const amounts=[base,extras].map(value=>{
  if(!/^(?:\d+(?:\.\d*)?|\.\d+)$/.test(value))return NaN;
  const n=Number(value),fraction=(value.split('.')[1]||'').length;
  return n>=0&&n<=1e9&&fraction<=decimals?Math.round(n*scale):NaN;
 });
 if(amounts.some(n=>!Number.isFinite(n)))return {kind:'invalid'};
 return {kind:'ok',total:(amounts[0]+amounts[1])/scale};
}
export function appendChecklist(trip,summary){
 if(typeof trip!=='string'||typeof summary!=='string')throw Error('Invalid notes');
 if(trip.endsWith(summary))return trip;
 const result=trip+(trip?'\n\n':'')+summary;
 if(result.length>20000)throw Error('Trip must be under 20,000 characters.');
 return result;
}
