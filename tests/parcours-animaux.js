const {chromium}=require('playwright');const dir=process.argv[2];
(async()=>{const b=await chromium.launch({args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const p=await b.newPage({viewport:{width:1280,height:760}});const errs=[];p.on('pageerror',e=>errs.push('PAGE '+e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text().slice(0,120))});
await p.route('**/cdnjs.cloudflare.com/**',r=>r.abort());await p.route('**/fonts.g*/**',r=>r.abort());
const t0=Date.now();await p.goto('http://localhost:8000/?neuf&jour&test');await p.waitForFunction(()=>window.RX&&RX.debug,null,{timeout:60000});console.log('load ms',Date.now()-t0);
const ev=(f,a)=>p.evaluate(f,a);
console.log('cubes',JSON.stringify((await ev(()=>RX.debug.state)).cubes));
const A=await ev(()=>RX.debug.animals());console.log(JSON.stringify(A.map(a=>[a.id,a.pos.map(v=>+v.toFixed(1))])));
// longueur du circuit depuis le départ
let cur=[30.5,40.5],L=0;const todo=A.slice();while(todo.length){todo.sort((a,b)=>Math.hypot(a.pos[0]-cur[0],a.pos[2]-cur[1])-Math.hypot(b.pos[0]-cur[0],b.pos[2]-cur[1]));const n=todo.shift();L+=Math.hypot(n.pos[0]-cur[0],n.pos[2]-cur[1]);cur=[n.pos[0],n.pos[2]];}
console.log('circuit blocs',Math.round(L),'≈ s à pied',Math.round(L/3.6));
const press=async k=>{await p.keyboard.press(k);await p.waitForTimeout(450);};
for(const a of A){
  // se placer à 2,5 blocs de l'animal, côté plaine, puis marcher pour se poser
  await ev(a=>{const x=a.pos[0],z=a.pos[2]+2.6;const y=RX.debug.world.groundY(x,z);RX.debug.teleport(x,y+.1,z,Math.PI);RX.debug.sim(.4);},a);
  let st=await ev(()=>RX.debug.state);if(st.near!==a.id){await ev(a=>{const x=a.pos[0]+2.4,z=a.pos[2];RX.debug.teleport(x,RX.debug.world.groundY(x,z)+.1,z,-Math.PI/2);RX.debug.sim(.4);},a);st=await ev(()=>RX.debug.state);}
  console.log(a.id,'near',st.near);
  await press('KeyE');await press('KeyE');
  for(const q of a.q){const j=await ev(q=>RX.QUESTIONS[q].opts.findIndex(o=>o.ok),q);
    if(a.id==='calao'&&q==='q7'){await press('1');}else await press(String(j+1));
    if(q===a.q[0]){await p.waitForTimeout(1500);}if(q===a.q[0])await p.screenshot({path:`${dir}/v3-${a.id}.png`});
    await press('KeyE');}
  st=await ev(()=>RX.debug.state);console.log(' met',st.met.length,'inDialog',st.inDialog);
}
for(let i=0;i<30;i++){const s=await ev(()=>[RX.debug.state.fete,document.getElementById('end').hidden]);if(!s[1])break;if(i%5==0)console.log('fete',JSON.stringify(s));await p.waitForTimeout(2000);}const st=await ev(()=>RX.debug.state);
console.log('finished',st.finished,'score',Object.values(st.ans).filter(Boolean).length,'/',Object.keys(st.ans).length,'end',await ev(()=>!document.getElementById('end').hidden));
await p.screenshot({path:dir+'/v3-end.png'});
console.log('ERR',JSON.stringify(errs.filter(e=>!e.includes('ERR_FAILED'))));await b.close();})();
