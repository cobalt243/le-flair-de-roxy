const {chromium,devices}=require('playwright');const dir=process.argv[2];
(async()=>{const b=await chromium.launch({args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const ctx=await b.newContext({...devices['iPhone 13']});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push('PAGE '+e.message));
await p.route('**/cdnjs.cloudflare.com/**',r=>r.abort());await p.route('**/fonts.g*/**',r=>r.abort());
await p.goto('http://localhost:8000/');await p.evaluate(()=>localStorage.setItem('flair-roxy-2-proto-v3',JSON.stringify({met:['calao'],ans:{q7:true,q8:true},pos:[30.5,6,24.5],time:60,tuto:3,cineDone:true,finished:false})));
await p.goto('http://localhost:8000/?jour&test');await p.waitForFunction(()=>window.RX&&RX.debug,null,{timeout:60000});
for(const [n,yw] of [['a',Math.PI],['b',0],['c',Math.PI/2]]){await p.evaluate(y=>RX.debug.setYaw(y),yw);await p.waitForTimeout(2200);await p.screenshot({path:`${dir}/h-${n}.png`});
  console.log(n,await p.evaluate(()=>[!document.getElementById('edge').hidden,document.querySelector('#edge span').textContent]));}
console.log('ERR',JSON.stringify(errs));await b.close();})();
