/* Pour chaque animal : partir de la tortue, marcher en suivant la direction de la flèche (sans téléportation) jusqu'à pouvoir parler. */
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.route('**/cdnjs.cloudflare.com/**',r=>r.abort());await p.route('**/fonts.g*/**',r=>r.abort());
await p.goto('http://localhost:8000/?neuf&jour&test');await p.waitForFunction(()=>window.RX&&RX.debug,null,{timeout:60000});
const A=await p.evaluate(()=>RX.debug.animals());
const starts=[['tortue',A.find(a=>a.id==='tortue').pos],['départ',[30.5,5,40.5]]];
for(const [sn,sp] of starts)for(const a of A){if(a.id===sn)continue;
  const r=await p.evaluate(({sp,a})=>{const d=RX.debug;d.teleport(sp[0]+1.5,d.world.groundY(sp[0]+1.5,sp[2]+1.5)+.1,sp[2]+1.5);d.sim(.3);
    // « joueur naïf » : avance tout droit dans la direction de la cible (comme la flèche), caméra derrière Roxy
    for(let t=0;t<40;t++){const s=d.state;if(s.near===a.id)return {ok:true,t:t*.5};const dx=a.pos[0]-s.pos[0],dz=a.pos[2]-s.pos[2];d.setYaw(Math.atan2(-dx,-dz));d.sim(.5,['KeyW']);}
    const s=d.state;return {ok:false,pos:s.pos.map(v=>+v.toFixed(1)),near:s.near};},{sp,a});
  console.log(sn,'→',a.id,JSON.stringify(r));}
console.log('ERR',JSON.stringify(errs));await b.close();})();
