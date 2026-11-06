const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
for(const reduced of [false,true]){
 const listeners={},buttons=[{dataset:{direction:'-1'},addEventListener:(k,f)=>listeners.prev=f},{dataset:{direction:'1'},addEventListener:(k,f)=>listeners.next=f}];
 const track={scrollLeft:0,clientWidth:300,scrollWidth:940,querySelector:()=>({getBoundingClientRect:()=>({width:280})}),scrollBy(x){this.last=x;this.scrollLeft=Math.max(0,Math.min(640,this.scrollLeft+x.left));listeners.scroll()},addEventListener:(k,f)=>listeners[k]=f};
 const controls={hidden:true,querySelectorAll:()=>buttons};const carousel={querySelector:s=>s==='.comparison-track'?track:controls};
 vm.runInNewContext(fs.readFileSync(require('node:path').join(__dirname,'../public/comparisons.js'),'utf8'),{document:{querySelectorAll:()=>[carousel]},matchMedia:()=>({matches:reduced}),ResizeObserver:class{constructor(fn){this.fn=fn}observe(){this.fn()}}});
 assert.equal(buttons[0].disabled,true);listeners.next();assert.equal(track.scrollLeft,300);assert.equal(track.last.behavior,reduced?'instant':'smooth');
 let prevented=false;listeners.keydown({target:track,key:'ArrowRight',preventDefault:()=>prevented=true});assert(prevented);listeners.next();assert.equal(buttons[1].disabled,true);
 listeners.prev();assert.equal(buttons[1].disabled,false);assert.equal(controls.hidden,false);
 console.log('PASS carousel bounds, next/previous, keyboard, reduced-motion='+reduced);
}
