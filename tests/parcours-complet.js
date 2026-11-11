const {chromium}=require('playwright');const dir=process.argv[2];
(async()=>{const b=await chromium.launch({args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const p=await b.newPage({viewport:{width:1280,height:760}});const errs=[];p.on('pageerror',e=>errs.push('PAGE '+e.message));
await p.route('**/cdnjs.cloudflare.com/**',r=>r.abort());await p.route('**/fonts.g*/**',r=>r.abort());
await p.goto('http://localhost:8000/?neuf&jour&test');await p.waitForFunction(()=>window.RX&&RX.debug,null,{timeout:60000});await p.waitForTimeout(500);
const ev=(f,a)=>p.evaluate(f,a);const st=()=>ev(()=>RX.debug.state);const log=(...a)=>console.log(...a);
// marche libre 2 s vers le nord (yaw 0 => avant = -z)
await ev(()=>RX.debug.setYaw(0));log('walk 2s',JSON.stringify(await ev(()=>RX.debug.sim(2,['KeyW']))));
log('run 2s',JSON.stringify(await ev(()=>RX.debug.sim(2,['KeyW','ShiftLeft']))));
// saut sur place
log('jump',JSON.stringify(await ev(()=>{RX.debug.sim(.05,['Space']);const ys=[];for(let i=0;i<8;i++)ys.push(+RX.debug.sim(.08)[1].toFixed(2));return ys;})));
// éléphant : dialogue
await ev(()=>RX.debug.teleport(41,5,41.5,Math.PI/2));await ev(()=>RX.debug.sim(.2));log('ctx',(await st()).context);
await p.keyboard.press('KeyE');await p.waitForTimeout(400);await p.screenshot({path:dir+'/r-dialog.png'});
for(let i=0;i<3;i++){await p.keyboard.press('KeyE');await p.waitForTimeout(250);}log('talked',(await st()).talked);
// graine 1 en marchant depuis le nord du baobab
await ev(()=>RX.debug.teleport(43.5,8,63,Math.PI));await ev(()=>RX.debug.sim(1));await ev(()=>RX.debug.setYaw(0));
log('to seed1',JSON.stringify(await ev(()=>RX.debug.sim(2,['KeyW']))),JSON.stringify((await st()).found));
// éboulis -> corniche
const e=await ev(()=>RX.debug.world.edge(45));await ev(e=>RX.debug.teleport(45.5,6,e+6,Math.PI),e);await ev(()=>RX.debug.sim(.5));await ev(()=>RX.debug.setYaw(0));
log('climb',JSON.stringify(await ev(()=>RX.debug.sim(5,['KeyW']))),'edge',e);
await ev(()=>RX.debug.setYaw(Math.PI/2));log('ledge walk -x',JSON.stringify(await ev(()=>RX.debug.sim(1.2,['KeyW']))),JSON.stringify((await st()).found));
await p.waitForTimeout(500);await p.screenshot({path:dir+'/r-ledge.png'});
// abri
const ez=await ev(()=>RX.debug.world.CAVE_EZ);await ev(ez=>RX.debug.teleport(22.5,5,ez+1.5,Math.PI),ez);await ev(()=>RX.debug.setYaw(0));await ev(()=>RX.debug.sim(.3,['KeyW']));
log('cave ctx',(await st()).context);await p.waitForTimeout(400);await p.screenshot({path:dir+'/r-cave.png'});
await p.keyboard.press('KeyE');await p.waitForTimeout(300);log('in',JSON.stringify(await ev(()=>RX.debug.sim(3,['KeyW']))),JSON.stringify((await st()).found));
await p.waitForTimeout(400);await p.screenshot({path:dir+'/r-incave.png'});
// quiz
await ev(()=>RX.debug.teleport(41,5,41.5,Math.PI/2));await ev(()=>RX.debug.sim(.2));
await p.keyboard.press('KeyE');await p.waitForTimeout(250);await p.keyboard.press('KeyE');await p.waitForTimeout(250);await p.keyboard.press('KeyE');await p.waitForTimeout(300);
await p.screenshot({path:dir+'/r-quiz.png'});
await p.keyboard.press('2');await p.waitForTimeout(250);await p.keyboard.press('KeyE');await p.waitForTimeout(300);
const j=await ev(()=>[...document.querySelectorAll('.opt')].findIndex(b=>b.textContent.includes('6 personnes')));await p.keyboard.press(String(j+1));await p.waitForTimeout(250);
await p.keyboard.press('KeyE');await p.waitForTimeout(250);await p.keyboard.press('KeyE');await p.waitForTimeout(4500);
const s=await st();log('planted',s.planted,JSON.stringify(s.quiz),'end visible',await ev(()=>!document.getElementById('end').hidden));
await p.screenshot({path:dir+'/r-end.png'});
// rechargement : sauvegarde
await p.goto('http://localhost:8000/?jour&test');await p.waitForFunction(()=>window.RX&&RX.debug,null,{timeout:60000});await p.waitForTimeout(400);
const s2=await st();log('reload',JSON.stringify(s2.found),s2.planted,JSON.stringify(s2.pos));
log('ERR',JSON.stringify(errs));await b.close();})();
