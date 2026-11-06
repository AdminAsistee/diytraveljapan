import assert from 'node:assert/strict';
import {calculateTotal as sum,appendChecklist as append} from '../public/booking-check-core.js';
for (const [a,b,c,r] of [['','','JPY','empty'],['100','','JPY','partial'],['0','0','JPY',0],['1900','100','JPY',2000],['1.10','.20','USD',1.3],['1.5','0','JPY','invalid'],['1.001','0','USD','invalid'],['-1','0','JPY','invalid'],['1','0','XYZ','invalid'],['1000000001','0','JPY','invalid']]) {
 const result=sum(a,b,c);assert.deepEqual(result,typeof r==='number'?{kind:'ok',total:r}:{kind:r});
}
assert.equal(append('Original trip','Check'), 'Original trip\n\nCheck');
assert.equal(append('Original trip\n\nCheck','Check'),'Original trip\n\nCheck');
assert.throws(()=>append('A'.repeat(20000),'Check'));
console.log('Booking totals, notes preservation, duplicate save and length bound passed.');
