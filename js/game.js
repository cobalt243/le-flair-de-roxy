/* Le Flair de Roxy — prototype 0.3 : se déplacer et rencontrer 6 animaux qui posent 12 questions.
   Durée visée : 8 minutes maximum. Pensé d'abord pour le téléphone. (La version 0.2, avec graines et flair, est archivée.) */
(function(RX){
  const $=s=>document.querySelector(s);
  const SAVE_KEY='flair-roxy-proto-v3';
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const touch=matchMedia('(pointer: coarse)').matches||('ontouchstart' in window);
  const params=new URLSearchParams(location.search);
  const V3=(x,y,z)=>new THREE.Vector3(x,y,z);

  RX.start=function(){
    const host=$('#game');let renderer;
    try{renderer=new THREE.WebGLRenderer({antialias:!touch,powerPreference:'high-performance'});}
    catch(e){$('#loading').textContent='WebGL est indisponible sur cet appareil : le jeu 3D ne peut pas démarrer.';return;}
    renderer.setPixelRatio(Math.min(devicePixelRatio||1,touch?1:1.5));renderer.outputEncoding=THREE.sRGBEncoding;
    renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.82;renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
    host.appendChild(renderer.domElement);
    const scene=new THREE.Scene();scene.fog=new THREE.Fog(0x8ec7e6,38,95);
    const camera=new THREE.PerspectiveCamera(55,1,.1,220);
    const hemi=new THREE.HemisphereLight(0xfff1d6,0x6b4a2c,.8);scene.add(hemi);
    const amb=new THREE.AmbientLight(0xffffff,.12);scene.add(amb);
    const sun=new THREE.DirectionalLight(0xffe0b0,1.1);sun.castShadow=true;sun.shadow.mapSize.set(touch?1024:2048,touch?1024:2048);
    Object.assign(sun.shadow.camera,{left:-22,right:22,top:22,bottom:-22,near:1,far:90});sun.shadow.bias=-.0006;sun.shadow.normalBias=.02;scene.add(sun);scene.add(sun.target);

    const tex=RX.edgeTexture();
    const world=RX.createWorld(scene,tex);
    const charMat=new THREE.MeshLambertMaterial({map:RX.edgeTexture(238,246,9)});
    const quality=touch?'low':'high';
    const roxy=RX.createRoxy(charMat,quality);scene.add(roxy.object);

    /* ===== Les 6 animaux ===== */
    const top=(x,z)=>world.groundY(x,z);
    const gEdge=world.edge(31),stepE=world.edge(45);
    const ANIMALS=[
      {id:'agame',kind:'agama',make:RX.createAgama,name:'L’agame',theme:'Connaître Claude',q:['q1','q2'],pos:V3(26.5,top(26.5,48.5),48.5),
        intro:'Salut Roxy ! Moi, je fais des pompes sur les rochers. Et toi, sais-tu ce que Claude sait faire… ou pas ?'},
      {id:'elephant',kind:'elephant',make:RX.createElephant,name:'L’éléphant',theme:'Le bon prompt',q:['q3','q11'],pos:V3(43.5,world.surface(43,41),41.5),
        intro:'Bonjour Roxy ! Demander de l’aide à Claude, c’est tout un art. Ta demande écrite s’appelle un « prompt ». Voyons ta façon de demander.'},
      {id:'patas',kind:'patas',make:RX.createPatas,name:'Le singe patas',theme:'Les outils',q:['q5','q6'],pos:V3(32.5,world.surface(32,50),50.5),
        intro:'Hé, Roxy ! Claude a plusieurs outils. Sauras-tu choisir le bon ?'},
      {id:'calao',kind:'hornbill',make:RX.createHornbill,name:'Le calao',theme:'Les données',q:['q7','q8'],pos:V3(31.5,world.surface(31,gEdge+11),gEdge+11.5),
        intro:'Roxy ! Avant de confier une information à Claude, on réfléchit. À toi de trier !'},
      {id:'vautour',kind:'vulture',make:RX.createVulture,name:'Le vautour',theme:'Vérifier',q:['q9','q10'],pos:V3(40.5,top(40.5,30.5),30.5),
        intro:'Rien n’échappe à mon œil, Roxy. Et toi, sais-tu vérifier ce que Claude écrit ?'},
      {id:'tortue',kind:'tortoise',make:RX.createTortoise,name:'La tortue sillonnée',theme:'Claude au travail',q:['q4','q12'],pos:V3(22.5,world.surface(22,world.CAVE_EZ+2),world.CAVE_EZ+2.5),
        intro:'Doucement, Roxy… Au travail, on utilise Claude avec méthode. Voici mes deux questions.'}];
    const critMat=new THREE.MeshLambertMaterial({map:RX.edgeTexture(234,246,9)});
    ANIMALS.forEach((a,i)=>{a.model=a.make(critMat,quality);a.model.object.position.copy(a.pos);a.model.object.rotation.y=Math.PI;scene.add(a.model.object);a.phase=i*1.7;});

    /* ===== Particules (étincelles, confettis) ===== */
    const PMAX=1100,pMesh=new THREE.InstancedMesh(new THREE.BoxGeometry(.11,.11,.11),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.95,fog:true,toneMapped:false}),PMAX);
    pMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);pMesh.frustumCulled=false;scene.add(pMesh);
    {const c0=new THREE.Color('#F2B93B');for(let i=0;i<PMAX;i++)pMesh.setColorAt(i,c0);pMesh.count=0;}
    const parts=[],tmpO=new THREE.Object3D(),tmpC=new THREE.Color();
    function emit(p){if(parts.length>=PMAX)parts.shift();parts.push(p);}
    function updateParticles(dt,t){for(let i=parts.length-1;i>=0;i--){parts[i].age+=dt;if(parts[i].age>parts[i].life)parts.splice(i,1);}let n=0;
      parts.forEach(p=>{if(p.age<0)return;if(p.v){p.v.y-=p.g*dt;p.x+=p.v.x*dt;p.y+=p.v.y*dt;p.z+=p.v.z*dt;}const k=1-p.age/p.life,s=(p.s||1)*(.4+.6*k);
        tmpO.position.set(p.x,p.y,p.z);tmpO.rotation.set(t*2,t*1.5,0);tmpO.scale.setScalar(Math.max(.01,s));tmpO.updateMatrix();pMesh.setMatrixAt(n,tmpO.matrix);tmpC.set(p.c).convertSRGBToLinear();pMesh.setColorAt(n,tmpC);n++;});
      pMesh.count=n;pMesh.instanceMatrix.needsUpdate=true;if(pMesh.instanceColor)pMesh.instanceColor.needsUpdate=true;}
    function sparkle(pos,colors,num=30,force=4){for(let i=0;i<num;i++)emit({x:pos.x,y:pos.y,z:pos.z,v:{x:(Math.random()-.5)*force,y:Math.random()*force+1,z:(Math.random()-.5)*force},g:8,life:1.2+Math.random()*.8,age:0,c:colors[i%colors.length],s:1});}

    /* Poussière portée par le vent */
    const DN=220,dPos=new Float32Array(DN*3),dGeo=new THREE.BufferGeometry();dGeo.setAttribute('position',new THREE.BufferAttribute(dPos,3));
    scene.add(new THREE.Points(dGeo,new THREE.PointsMaterial({color:0xe9cf9c,size:.07,transparent:true,opacity:.55})));
    for(let i=0;i<DN;i++){dPos[i*3]=Math.random()*64;dPos[i*3+1]=4+Math.random()*10;dPos[i*3+2]=Math.random()*64;}

    /* Jeune baobab de la fête finale */
    const FETE=V3(37.5,world.surface(37,45),45.5);
    const sapling=new THREE.Group();{const bark=new THREE.MeshLambertMaterial({color:new THREE.Color('#8B7A66').convertSRGBToLinear(),map:tex}),leaf=new THREE.MeshLambertMaterial({color:new THREE.Color('#8E9A47').convertSRGBToLinear(),map:tex});
      for(let y=0;y<4;y++){const m=new THREE.Mesh(new THREE.BoxGeometry(.5,1,.5),bark);m.position.y=y+.5;m.castShadow=true;sapling.add(m);}
      [[1,0],[-1,0],[0,1],[0,-1],[0,0]].forEach(([a,b])=>{const m=new THREE.Mesh(new THREE.BoxGeometry(1,.5,1),leaf);m.position.set(a*.9,4.2+(a||b?0:.5),b*.9);m.castShadow=true;sapling.add(m);});
      sapling.position.copy(FETE);sapling.scale.setScalar(.001);sapling.visible=false;scene.add(sapling);}
    const TREE=(()=>{const L=[],add=(x,y,z,c)=>L.push([x,y,z,c]),H=RX.hash3;
      for(let y=0;y<9;y++)for(let x=-1;x<=1;x++)for(let z=-1;z<=1;z++){if(y>5&&Math.abs(x)+Math.abs(z)>1)continue;add(x,y,z,H(x,y,z)>.5?'#8B7A66':'#7C6B58');}
      [[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([x,z])=>add(x*2,0,z*2,'#7C6B58'));
      const dirs=[[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,-1],[1,-1],[-1,1]];
      dirs.forEach(([dx,dz],k)=>{for(let i=1;i<=3;i++)add(dx*i,8+Math.floor(i/2),dz*i,'#7C6B58');
        for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){const lx=dx*3+a,lz=dz*3+b;add(lx,10,lz,H(lx,k,lz)>.45?'#8E9A47':'#7F8A3E');if(!a&&!b)add(lx,11,lz,'#9DAA52');}
        add(dx*3,9,dz*3,'#E8B13A');});
      const seen=new Set(),U=[];L.forEach(p=>{const k=p.slice(0,3).join();if(!seen.has(k)){seen.add(k);U.push(p);}});
      U.sort((a,b)=>a[1]-b[1]||Math.hypot(a[0],a[2])-Math.hypot(b[0],b[2]));
      const m=new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1),new THREE.MeshLambertMaterial({map:tex}),U.length);m.castShadow=true;m.receiveShadow=true;
      const o=new THREE.Object3D(),c=new THREE.Color();U.forEach((p,i)=>{c.set(p[3]).convertSRGBToLinear();m.setColorAt(i,c);o.position.set(FETE.x+p[0],FETE.y+p[1]+.5,FETE.z+p[2]);o.scale.setScalar(.001);o.updateMatrix();m.setMatrixAt(i,o.matrix);});
      m.count=U.length;scene.add(m);
      function show(k){const n=Math.floor(k*U.length);U.forEach((p,i)=>{const s=i<n?1:(i===n?(k*U.length-n):.001);o.position.set(FETE.x+p[0],FETE.y+p[1]+.5,FETE.z+p[2]);o.scale.setScalar(Math.max(.001,s));o.updateMatrix();m.setMatrixAt(i,o.matrix);});m.instanceMatrix.needsUpdate=true;}
      const LEAF=['#8E9A47','#7F8A3E','#9DAA52'],GOLDS=['#F2C14E','#E8A92E','#FFD873'];
      function gold(on){U.forEach((p,i)=>{if(!LEAF.includes(p[3]))return;c.set(on?GOLDS[i%3]:p[3]).convertSRGBToLinear();m.setColorAt(i,c);});m.instanceColor.needsUpdate=true;}
      return {show,gold,n:U.length};})();

    /* Flèche d'objectif */
    const markMat=new THREE.MeshBasicMaterial({color:new THREE.Color('#F2B93B').convertSRGBToLinear(),depthTest:false,transparent:true,opacity:.95,toneMapped:false});
    const marker=new THREE.Group();{const c=new THREE.Mesh(new THREE.ConeGeometry(.42,.7,4),markMat);c.rotation.x=Math.PI;c.rotation.y=Math.PI/4;marker.add(c);
      const sh=new THREE.Mesh(new THREE.BoxGeometry(.22,.55,.22),markMat);sh.position.y=.6;marker.add(sh);marker.children.forEach(m=>m.renderOrder=20);}scene.add(marker);
    const guide=new THREE.Group();{const sh=new THREE.Shape();[[0,.95],[.62,.15],[.26,.15],[.26,-.6],[-.26,-.6],[-.26,.15],[-.62,.15]].forEach(([x,y],i)=>i?sh.lineTo(x,y):sh.moveTo(x,y));
      const m=new THREE.Mesh(new THREE.ShapeGeometry(sh),new THREE.MeshBasicMaterial({color:new THREE.Color('#F2B93B').convertSRGBToLinear(),depthTest:false,transparent:true,opacity:.92,toneMapped:false,side:THREE.DoubleSide}));
      m.rotation.x=-Math.PI/2;m.renderOrder=19;guide.add(m);}scene.add(guide);
    const edgeEl=$('#edge'),edgeTxt=$('#edge span'),edgeSvg=$('#edge svg');

    /* ===== État et sauvegarde ===== */
    const START=V3(30.5,world.surface(30,40),40.5);
    const P=START.clone();
    const fresh=()=>({met:[],ans:{},pos:null,time:0,tuto:0,cineDone:false,finished:false});
    let S=fresh();
    try{const s=JSON.parse(localStorage.getItem(SAVE_KEY));if(s&&Array.isArray(s.met))S={...S,...s};}catch(e){}
    if(params.has('neuf'))S=fresh();
    if(S.pos&&S.pos.length===3)P.set(S.pos[0],S.pos[1]+.05,S.pos[2]);
    const save=()=>{S.pos=[+P.x.toFixed(2),+P.y.toFixed(2),+P.z.toFixed(2)];try{localStorage.setItem(SAVE_KEY,JSON.stringify(S));}catch(e){}};

    /* ===== Fête finale ===== */
    function placeFete(instant){ANIMALS.forEach((a,i)=>{const ang=i/ANIMALS.length*Math.PI*2+.3,r=a.kind==='elephant'?6.2:5;
        const x=FETE.x+Math.cos(ang)*r,z=FETE.z+Math.sin(ang)*r;a.pos=V3(x,world.surface(Math.floor(x),Math.floor(z)),z);
        a.model.object.position.copy(a.pos);a.model.object.rotation.y=Math.atan2(FETE.x-x,FETE.z-z);});
      TREE.show(instant?1:0);if(instant){const okN=Object.values(S.ans).filter(Boolean).length;TREE.gold(okN>=12);}}
    if(S.finished)placeFete(true);

    /* ===== Entrées ===== */
    const keys={};let joy={x:0,y:0,run:false};
    let yaw=0,pitch=.32,dist=5.6,lastCamInput=-10,paused=true,inDialog=false,started=false,clock=0,drag=null;
    window.addEventListener('keydown',e=>{if(e.target.tagName==='INPUT')return;keys[e.code]=true;if(!started)return;
      if(e.code==='Escape'||e.code==='KeyP'){togglePause();e.preventDefault();return;}
      if(paused)return;
      if(inDialog){const onOpt=document.activeElement&&document.activeElement.classList.contains('opt');if((e.code==='KeyE'||e.code==='Enter'||e.code==='Space')&&!onOpt){e.preventDefault();dialogAdvance();}const m=/^(?:Digit|Numpad)([1-4])$/.exec(e.code);if(m){e.preventDefault();answerKey(+m[1]-1);}return;}
      if(e.code==='Space')e.preventDefault();if(e.code==='KeyE'||e.code==='Enter')action();});
    window.addEventListener('keyup',e=>{keys[e.code]=false;});
    window.addEventListener('blur',()=>{for(const k in keys)keys[k]=false;});
    const cv=renderer.domElement;
    cv.addEventListener('pointerdown',e=>{drag={id:e.pointerId,x:e.clientX,y:e.clientY};cv.setPointerCapture(e.pointerId);});
    cv.addEventListener('pointermove',e=>{if(!drag||drag.id!==e.pointerId)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;drag.x=e.clientX;drag.y=e.clientY;
      yaw-=dx*.006;pitch=Math.max(.05,Math.min(1.25,pitch+dy*.004));lastCamInput=clock;});
    const endDrag=()=>drag=null;cv.addEventListener('pointerup',endDrag);cv.addEventListener('pointercancel',endDrag);
    cv.addEventListener('wheel',e=>{dist=Math.max(3.5,Math.min(12,dist+e.deltaY*.01));e.preventDefault();},{passive:false});
    if(touch){document.body.classList.add('touch');
      const base=$('#joy'),knob=$('#joy i');let jid=null,cx=0,cy=0;
      const move=e=>{if(e.pointerId!==jid)return;let dx=e.clientX-cx,dy=e.clientY-cy;const m=Math.hypot(dx,dy),R=52;if(m>R){dx*=R/m;dy*=R/m;}knob.style.transform=`translate(${dx}px,${dy}px)`;joy.x=dx/R;joy.y=dy/R;joy.run=m>R*.95;};
      base.addEventListener('pointerdown',e=>{jid=e.pointerId;base.setPointerCapture(jid);const r=base.getBoundingClientRect();cx=r.left+r.width/2;cy=r.top+r.height/2;move(e);});
      base.addEventListener('pointermove',move);
      const up=e=>{if(e.pointerId!==jid)return;jid=null;joy={x:0,y:0,run:false};knob.style.transform='';};base.addEventListener('pointerup',up);base.addEventListener('pointercancel',up);
      $('#bAct').addEventListener('pointerdown',e=>{e.preventDefault();if(inDialog)dialogAdvance();else action();});}

    /* ===== Interface ===== */
    const hud={obj:$('#objective'),stars:$('#stars'),prompt:$('#prompt'),toast:$('#toast'),dlg:$('#dialog')};
    function toast(t,ms=2800){hud.toast.textContent=t;hud.toast.classList.add('show');clearTimeout(hud.toast._t);hud.toast._t=setTimeout(()=>hud.toast.classList.remove('show'),ms);}
    function refreshHUD(){const n=S.met.length;
      hud.stars.innerHTML=ANIMALS.map(a=>`<span class="star ${S.met.includes(a.id)?'got':''}" title="${a.name}" aria-label="${a.name} : ${S.met.includes(a.id)?'rencontré':'à rencontrer'}"></span>`).join('');
      hud.obj.textContent=S.retry&&S.retry.length?`Revanche : ${S.retry.length} question${S.retry.length>1?'s':''} à rejouer`:S.finished?'Bravo ! Explorez librement.':n===0?'Allez à la rencontre des animaux.':n<6?`Animaux rencontrés : ${n} sur 6`:'Tous les animaux sont rencontrés !';}
    refreshHUD();

    /* ===== Dialogues et questions ===== */
    let dlgClosedAt=0,dq=[],dqDone=null,curQ=null,qAnswered=false,lineAt=0,talker=null;
    let dlgYaw=0;
    function blocked(q){if(world.solid(q.x,q.y,q.z))return true;if(!S.finished)return false;const d=Math.hypot(q.x-FETE.x,q.z-FETE.z),y=q.y-FETE.y;return (d<2.6&&y<9.5)||(d<5.4&&y>8.3&&y<12.6);}
    function clearShot(t,yw,pt,dd){const dir=V3(Math.sin(yw)*Math.cos(pt),Math.sin(pt),Math.cos(yw)*Math.cos(pt));for(let s=.5;s<=dd;s+=.3){const q=t.clone().addScaledVector(dir,s);if(blocked(q))return false;}return true;}
    function dlgTarget(a){return V3((P.x+a.pos.x)/2,(P.y+a.pos.y)/2+.3,(P.z+a.pos.z)/2);}
    function chooseShot(a){const base=Math.atan2(P.x-a.pos.x,P.z-a.pos.z),t=dlgTarget(a),dd=a.kind==='elephant'?8.5:6.5;
      for(const o of [1.0,-1.0,.55,-.55,1.5,-1.5,0,2.2,-2.2]){if(clearShot(t,base+o,.42,dd)){dlgYaw=base+o;return;}}dlgYaw=base+1.0;}
    function openDialog(a,lines,done){inDialog=true;talker=a;chooseShot(a);document.body.classList.add('indialog');dq=lines.slice();dqDone=done;RX.audio.talk();showLine();}
    function showLine(){const l=dq[0];hud.dlg.hidden=false;lineAt=performance.now();const who=talker?`${talker.name} · ${talker.theme}`:'';
      if(l.q){curQ=RX.QUESTIONS[l.q];qAnswered=false;const qi=talker.q.indexOf(l.q)+1;
        hud.dlg.innerHTML=`<div class="who">${who} · question ${qi}/2</div>${curQ.lead?`<p class="lead">${curQ.lead}</p>`:''}<p class="say">${curQ.q}</p>
          <div class="opts ${curQ.two?'two':''}">${curQ.opts.map((o,i)=>`<button class="opt" data-i="${i}"><b>${i+1}</b><span>${o.t}</span></button>`).join('')}</div><div class="fb" id="fb"></div>`;
        hud.dlg.querySelectorAll('.opt').forEach(b=>b.onclick=()=>answerKey(+b.dataset.i));}
      else{curQ=null;hud.dlg.innerHTML=`<div class="who">${who}</div><p class="say">${l.t}</p><button class="next" id="dnext">${l.btn||'Continuer'} <kbd>E</kbd></button>`;
        $('#dnext').onclick=dialogAdvance;$('#dnext').focus({preventScroll:true});}
      hud.dlg.scrollTop=0;requestAnimationFrame(moreHint);}
    function moreHint(){const d=hud.dlg;d.classList.toggle('more',d.scrollHeight-d.clientHeight-d.scrollTop>8);}
    hud.dlg.addEventListener('scroll',moreHint,{passive:true});
    function answerKey(i){if(!curQ||qAnswered||performance.now()-lineAt<400)return;const o=curQ.opts[i];if(!o)return;qAnswered=true;
      const key=dq[0].q;if(S.ans[key]===undefined||(S.retry&&S.retry.includes(key))||(talker&&!S.met.includes(talker.id)&&!S.qDone?.[key]))S.ans[key]=o.ok;(S.qDone||(S.qDone={}))[key]=1;save();
      hud.dlg.querySelectorAll('.opt').forEach((b,k)=>{b.disabled=true;b.classList.add(curQ.opts[k].ok?'right':k===i?'wrong':'dim');});
      const right=curQ.opts.find(x=>x.ok);lineAt=performance.now();
      $('#fb').innerHTML=`<p><b class="${o.ok?'g':'r'}">${o.ok?'Bien flairé !':'Pas tout à fait.'}</b> ${o.ok?o.why:o.why+(o.why!==right.why?` <br><span class="g">Bonne réponse :</span> ${right.t} ${right.why}`:'')}</p><button class="next" id="dnext">${dq.length>1?'Question suivante':'Terminer'} <kbd>E</kbd></button>`;
      if(o.ok){RX.audio.ok();sparkle(V3(P.x,P.y+1.2,P.z),['#F2B93B','#FFE08A'],12,2.5);}else RX.audio.no();
      $('#dnext').onclick=dialogAdvance;$('#dnext').focus({preventScroll:true});$('#fb').scrollIntoView({block:'nearest'});}
    function dialogAdvance(){if(curQ&&!qAnswered)return;if(performance.now()-lineAt<400)return;lineAt=performance.now();dq.shift();
      if(dq.length)showLine();else{dlgClosedAt=performance.now();hud.dlg.hidden=true;inDialog=false;document.body.classList.remove('indialog');curQ=null;const d=dqDone;dqDone=null;talker=null;d&&d();}}

    const GAME_URL='https://cobalt243.github.io/le-flair-de-roxy/';
    const REC_KEY='flair-roxy-record';
    function getRecord(){try{return JSON.parse(localStorage.getItem(REC_KEY))||null;}catch(e){return null;}}
    function setRecord(ok){const r=getRecord();if(!r||ok>r.ok){try{localStorage.setItem(REC_KEY,JSON.stringify({ok}));}catch(e){}return true;}return false;}
    const retryOf=a=>(S.retry||[]).filter(q=>a.q.includes(q));
    function talkTo(a){
      const rq=retryOf(a);
      if(rq.length){openDialog(a,[{t:`Revanche, Roxy ! Je te repose ${rq.length>1?'mes deux questions':'ma question'}. Prends ton temps.`,btn:'C’est parti'},...rq.map(q=>({q}))],()=>{
        S.retry=S.retry.filter(q=>!rq.includes(q));save();refreshHUD();RX.audio.pick();sparkle(V3(a.pos.x,a.pos.y+1.5,a.pos.z),['#F2B93B','#FFE08A','#E2652C'],40);
        if(S.retry.length)toast(`Plus que ${S.retry.length} question${S.retry.length>1?'s':''} à rejouer`,3000);else{S.retry=null;save();startFete();}});return;}
      if(S.met.includes(a.id)){openDialog(a,[{t:S.finished?'Merci encore, Roxy ! Le baobab pousse bien.':'Merci Roxy ! Va voir les autres animaux : suis la flèche dorée.',btn:'À plus tard'}]);return;}
      openDialog(a,[{t:a.intro,btn:'C’est parti'},{q:a.q[0]},{q:a.q[1]}],()=>{
        S.met.push(a.id);save();refreshHUD();RX.audio.pick();sparkle(V3(a.pos.x,a.pos.y+1.5,a.pos.z),['#F2B93B','#FFE08A','#E2652C'],40);
        if(S.met.length<6)toast(`Bravo ! ${a.name} vous donne une étoile (${S.met.length}/6)`,3200);else startFete();});}

    let feteT=0,growT=-1,rockets=[],fwT=0;const FETE_DUR=reduced?.6:11;const FW=['#F2B93B','#E2652C','#5B79C2','#FFE08A','#62C186','#D3372B','#F4F1EA'];
    let tier=3;const TIERS=[ // 0 : <7, 1 : 7-9, 2 : 10-11, 3 : 12
      {h:'Bon début !',p:'Le baobab a poussé. Rejouez pour qu’il fleurisse d’or !',gap:[9,9],dbl:0,sky:0},
      {h:'Bien joué !',p:'Le baobab du savoir a poussé',gap:[1.6,2.2],dbl:0,sky:.25},
      {h:'Bravo !',p:'Le baobab du savoir a poussé',gap:[.65,.9],dbl:.2,sky:.55},
      {h:'Parfait !',p:'Un sans-faute : le baobab se couvre d’or !',gap:[.32,.5],dbl:.55,sky:.8}];
    function startFete(){S.prevRecord=getRecord();const okN=Object.values(S.ans).filter(Boolean).length;tier=okN>=12?3:okN>=10?2:okN>=7?1:0;const T=TIERS[tier];
      setRecord(okN);S.recordSet=true;
      $('#finale h2').textContent=T.h;$('#finale p').textContent=T.p;document.body.dataset.tier=tier;S.finished=true;S.endTime=S.time;save();refreshHUD();placeFete(false);P.set(FETE.x+.4,FETE.y,FETE.z+4.2);heading=Math.PI;V.set(0,0,0);
      feteT=FETE_DUR;growT=0;fwT=1.2;yaw=1.75;document.body.classList.add('finale');RX.audio.fanfare(tier);
      const f=$('#finale');f.hidden=false;f.classList.remove('go');void f.offsetWidth;f.classList.add('go');
      $('#flash').classList.remove('go');void $('#flash').offsetWidth;$('#flash').classList.add('go');}
    function launch(){const a=Math.random()*Math.PI*2,r=4+Math.random()*7;rockets.push({x:FETE.x+Math.cos(a)*r,y:FETE.y+1,z:FETE.z+Math.sin(a)*r,vy:13+Math.random()*4,fuse:.75+Math.random()*.45,t:0,c:FW[Math.floor(Math.random()*FW.length)],c2:FW[Math.floor(Math.random()*FW.length)]});RX.audio.whoosh();}
    function updateFireworks(dt){if(feteT>0&&!reduced){fwT-=dt;if(fwT<=0&&feteT>1.4&&tier>0){const T=TIERS[tier];launch();if(Math.random()<T.dbl)launch();fwT=T.gap[0]+Math.random()*(T.gap[1]-T.gap[0]);}}
      for(let i=rockets.length-1;i>=0;i--){const r=rockets[i];r.t+=dt;r.y+=r.vy*dt;r.vy-=6*dt;emit({x:r.x,y:r.y,z:r.z,life:.45,age:0,c:'#FFE08A',s:.6});
        if(r.t>=r.fuse){rockets.splice(i,1);RX.audio.boom();for(let k=0;k<75;k++){const u=Math.random()*2-1,th=Math.random()*Math.PI*2,q=Math.sqrt(1-u*u),sp=6+Math.random()*2.5;
          emit({x:r.x,y:r.y,z:r.z,v:{x:q*Math.cos(th)*sp,y:u*sp,z:q*Math.sin(th)*sp},g:3.2,life:1.5+Math.random()*.9,age:0,c:k%3?r.c:r.c2,s:1.7});}}}}
    const RANKS=[[12,'Flair d’or','Un sans-faute ! Vous avez tous les bons réflexes.','or'],[10,'Flair d’argent','Excellent ! Vous maîtrisez l’essentiel.','argent'],[7,'Flair de bronze','Bien joué ! Quelques réflexes à affiner.','bronze'],[0,'Chiot curieux','Bon début ! Rejouez pour gagner une médaille.','chiot']];
    function showEnd(){document.body.classList.remove('finale');$('#finale').hidden=true;{const k=Object.values(S.ans).filter(Boolean).length;tier=k>=12?3:k>=10?2:k>=7?1:0;}
      const ok=Object.values(S.ans).filter(Boolean).length;const sec=Math.round(S.endTime||S.time),m=Math.floor(sec/60),s=sec%60;
      const rk=RANKS.find(r=>ok>=r[0]);$('#rankName').textContent=rk[1];$('#rankLine').textContent=rk[2];$('.medal').dataset.m=rk[3];
      const st=ok>=12?3:ok>=10?2:ok>=7?1:0;$('#endStars').innerHTML=[0,1,2].map(i=>`<span class="${i<st?'on':''}" style="animation-delay:${.9+i*.25}s">★</span>`).join('');
      $('#endStats').innerHTML=`<li><b id="scoreNum">0/12</b> bonnes réponses</li><li><b>${m} min ${String(s).padStart(2,'0')}</b> de jeu</li>`;
      let n=0;const tick=()=>{if(n>ok)return;$('#scoreNum').textContent=n+'/12';if(n>0)RX.audio.tick(n);n++;setTimeout(tick,reduced?0:110);};setTimeout(tick,reduced?0:500);
      $('#confetti').innerHTML=reduced?'':Array.from({length:[8,20,40,70][tier]},(_,i)=>`<i style="left:${Math.random()*100}%;background:${FW[i%FW.length]};animation-delay:${(Math.random()*3).toFixed(2)}s;animation-duration:${(3+Math.random()*3).toFixed(2)}s"></i>`).join('');
      $('#endMemo').innerHTML=RX.MEMO.map(t=>`<li>${t}</li>`).join('');
      const next=[[7,'Flair de bronze'],[10,'Flair d’argent'],[12,'Flair d’or']].find(r=>ok<r[0]);
      $('#goal').hidden=!next;if(next){const k=next[0]-ok;$('#goal').innerHTML=`<b>Encore ${k} bonne${k>1?'s':''} réponse${k>1?'s':''}</b> pour le ${next[1]} ${next[0]===12?'et le baobab doré':''}<span class="gbar"><i style="width:${ok/12*100}%"></i></span>`;}
      const missed=Object.keys(RX.QUESTIONS).filter(q=>S.ans[q]===false);
      $('#endRetry').hidden=!missed.length;$('#endRetry').textContent=`Rejouer mes ${missed.length} erreur${missed.length>1?'s':''}`;
      $('#endRetry').onclick=()=>{S.retry=missed;save();refreshHUD();$('#end').hidden=true;$('#confetti').innerHTML='';paused=false;toast('Revanche ! Suivez la flèche dorée jusqu’aux animaux concernés.',3500);};
      const prevR=S.prevRecord,newRec=!!prevR&&ok>prevR.ok;$('#recordLine').textContent=newRec?'🎉 Nouveau record !':'';setRecord(ok);
      const medal=ok>=12?'🥇':ok>=10?'🥈':ok>=7?'🥉':'🐶';
      const msg=`${medal} J’ai obtenu le « ${rk[1]} » (${ok}/12) dans Le Flair de Roxy, un petit jeu pour apprendre à bien utiliser Claude. À ton tour de faire mieux ! ${GAME_URL}`;
      $('#share').href='https://wa.me/?text='+encodeURIComponent(msg);
      $('#share').onclick=e=>{if(navigator.share){e.preventDefault();navigator.share({text:msg}).catch(()=>{});}};
      $('#copyMsg').onclick=()=>{const done=()=>toast('Message copié : collez-le dans WhatsApp');(navigator.clipboard?navigator.clipboard.writeText(msg):Promise.reject()).then(done).catch(()=>{const t=document.createElement('textarea');t.value=msg;document.body.appendChild(t);t.select();try{document.execCommand('copy');done();}catch(e){}t.remove();});};$('#end').hidden=false;paused=true;$('#endContinue').focus({preventScroll:true});$('.endcard').scrollTop=0;}
    $('#endContinue').onclick=()=>{$('#end').hidden=true;$('#confetti').innerHTML='';paused=false;};
    $('#endRestart').onclick=()=>restart();
    const openResult=()=>{$('#start').hidden=true;$('#pause').hidden=true;started=true;showEnd();};
    $('#seeResult').onclick=openResult;$('#pauseResult').onclick=openResult;

    /* ===== Action ===== */
    let near=null;
    function action(){if(inDialog||cineT>0||feteT>0||performance.now()-dlgClosedAt<500)return;if(near){talkTo(near);if(S.tuto<3){S.tuto=3;save();}}else toast('Approchez-vous d’un animal pour lui parler. Suivez la flèche dorée.');}
    function restart(){try{localStorage.removeItem(SAVE_KEY);}catch(e){}location.replace(location.pathname);}

    /* ===== Pause ===== */
    function togglePause(force){if(!$('#end').hidden||!started)return;paused=force!==undefined?force:!paused;$('#pause').hidden=!paused;$('#restartConfirm').hidden=true;if(paused)$('#resume').focus();}
    $('#btnPause').onclick=()=>togglePause(true);$('#resume').onclick=()=>togglePause(false);
    $('#music').checked=RX.audio.music;$('#music').onchange=e=>RX.audio.setMusic(e.target.checked);
    $('#shadows').onchange=e=>{renderer.shadowMap.enabled=e.target.checked;scene.traverse(o=>{if(o.material)o.material.needsUpdate=true;});};
    $('#restartAsk').onclick=()=>{$('#restartConfirm').hidden=false;};$('#restartNo').onclick=()=>{$('#restartConfirm').hidden=true;};$('#restartYes').onclick=restart;
    const soundBtn=$('#btnSound');soundBtn.onclick=()=>{const on=RX.audio.toggle();try{localStorage.setItem('flair-roxy-son',on?'oui':'non');}catch(e){}soundBtn.textContent=on?'Son : oui':'Son : non';soundBtn.setAttribute('aria-pressed',on);};
    $('#play').onclick=()=>{started=true;paused=false;$('#start').hidden=true;let sOff=false;try{sOff=localStorage.getItem('flair-roxy-son')==='non';}catch(e){}if(!RX.audio.on&&!sOff){const on=RX.audio.toggle();soundBtn.textContent=on?'Son : oui':'Son : non';}
      if(!S.cineDone&&!S.met.length){cineT=CINE;S.cineDone=true;save();$('#cine').hidden=false;}};
    $('#cine').onclick=()=>{cineT=Math.min(cineT,.6);};

    /* ===== Physique ===== */
    const HW=.3,HH=.95,V=V3(0,0,0);let waterT=0,grounded=false,heading=Math.PI,idleT=0,stepAcc=0,wasWater=false;
    function collides(x,y,z){for(let xi=Math.floor(x-HW);xi<=Math.floor(x+HW-1e-4);xi++)for(let yi=Math.floor(y);yi<=Math.floor(y+HH-1e-4);yi++)for(let zi=Math.floor(z-HW);zi<=Math.floor(z+HW-1e-4);zi++)if(world.solid(xi,yi,zi))return true;return false;}
    function moveAxis(a,d){if(!d)return;const o=P[a];P[a]+=d;if(!collides(P.x,P.y,P.z))return;
      if(a==='y'){if(d<0){P.y=Math.floor(P.y)+1;grounded=true;}else P.y=Math.floor(P.y+HH)-HH-1e-3;V.y=0;}
      else{P[a]=d>0?Math.floor(P[a]+HW)-HW-1e-3:Math.floor(P[a]-HW)+1+HW+1e-3;V[a]=0;}
      if(collides(P.x,P.y,P.z)){P[a]=o;if(a==='y')V.y=0;else V[a]=0;}}
    function animalBlocks(){if(S.finished){const dx=P.x-FETE.x,dz=P.z-FETE.z,d=Math.hypot(dx,dz);if(d<1.9&&d>1e-3){const k=(1.9-d)/d;P.x+=dx*k;P.z+=dz*k;}}ANIMALS.forEach(a=>{const r=a.kind==='elephant'?1.6:.7,dx=P.x-a.pos.x,dz=P.z-a.pos.z,d=Math.hypot(dx,dz);
      if(d<r+HW&&Math.abs(P.y-a.pos.y)<1.5&&d>1e-3){const k=(r+HW-d)/d,ox=P.x,oz=P.z;P.x+=dx*k;P.z+=dz*k;if(collides(P.x,P.y,P.z)){P.x=ox;P.z=oz;}}});}
    function physics(dt){
      let ix=0,iz=0;if(!inDialog&&feteT<=0){if(keys.KeyW||keys.ArrowUp)iz-=1;if(keys.KeyS||keys.ArrowDown)iz+=1;if(keys.KeyA||keys.ArrowLeft)ix-=1;if(keys.KeyD||keys.ArrowRight)ix+=1;ix+=joy.x;iz+=joy.y;}
      const m=Math.hypot(ix,iz);if(m>1){ix/=m;iz/=m;}
      const fx=-Math.sin(yaw),fz=-Math.cos(yaw),rx=Math.cos(yaw),rz=-Math.sin(yaw);const dx=fx*(-iz)+rx*ix,dz=fz*(-iz)+rz*ix;
      const water=world.water(P.x,P.y+.2,P.z);if(water&&!wasWater)RX.audio.splash();wasWater=water;
      waterT=water?waterT+dt:0;if(waterT>3.5){waterT=0;let best=null,bd=1e9;for(let r=1;r<10&&!best;r++)for(let k=0;k<16;k++){const a=k/16*Math.PI*2,x=P.x+Math.cos(a)*r,z=P.z+Math.sin(a)*r;const gy=world.groundY(x,z);if(!world.water(x,gy+.2,z)&&gy>=5&&gy-P.y<4){const d=r;if(d<bd){bd=d;best=[x,z];}}}
        if(best){P.set(best[0],world.groundY(best[0],best[1]),best[1]);V.set(0,0,0);toast('Roxy s’ébroue et remonte sur la berge.');}}
      const run=(keys.ShiftLeft||keys.ShiftRight||joy.run)&&!water;const sp=(run?6.2:3.6)*(water?.55:1);
      const acc=grounded?14:5;V.x+=(dx*sp-V.x)*Math.min(1,acc*dt);V.z+=(dz*sp-V.z)*Math.min(1,acc*dt);
      if(Math.hypot(dx,dz)>.05){let d=Math.atan2(dx,dz)-heading;d=Math.atan2(Math.sin(d),Math.cos(d));heading+=d*Math.min(1,dt*10);}
      if(grounded&&!inDialog){let jump=keys.Space;
        if(!jump&&Math.hypot(dx,dz)>.3){const ax=P.x+Math.sign(dx)*(HW+.15)*(Math.abs(dx)>.3?1:0),az=P.z+Math.sign(dz)*(HW+.15)*(Math.abs(dz)>.3?1:0),yb=Math.floor(P.y+.01);
          if(world.solid(Math.floor(ax),yb,Math.floor(az))&&!world.solid(Math.floor(ax),yb+1,Math.floor(az))&&!world.solid(Math.floor(P.x),yb+1,Math.floor(P.z)))jump=true;}
        if(jump){V.y=8.4;grounded=false;RX.audio.jump();}}
      V.y-=24*dt;if(V.y<-30)V.y=-30;
      grounded=false;moveAxis('y',V.y*dt);moveAxis('x',V.x*dt);moveAxis('z',V.z*dt);animalBlocks();
      if(!grounded&&V.y<=0&&collides(P.x,P.y-.02,P.z))grounded=true;
      P.x=Math.max(1.4,Math.min(62.6,P.x));P.z=Math.max(1.4,Math.min(62.6,P.z));
      if(P.y<-6){P.copy(START);V.set(0,0,0);toast('Roxy revient au point de départ.');}
      const hs=Math.hypot(V.x,V.z);if(grounded&&hs>.5){stepAcc+=hs*dt;if(stepAcc>(run?1.3:.9)){stepAcc=0;RX.audio.step();}}
      return hs;}

    /* ===== Contexte ===== */
    const nameLow=a=>a.name.replace(/^(L’|Le |La )/,m=>m==='L’'?'l’':m.toLowerCase());
    function updateContext(){near=null;let best=1e9;
      ANIMALS.forEach(a=>{const d=Math.hypot(a.pos.x-P.x,a.pos.z-P.z),r=a.kind==='elephant'?4.6:4.0;if(d<r&&Math.abs(a.pos.y-P.y)<9&&d<best){best=d;near=a;}});
      hud.prompt.innerHTML=inDialog||paused||!near?'':`<kbd>E</kbd> Parler à ${nameLow(near)}`;
      document.body.classList.toggle('cantalk',!!near&&!inDialog);
      if(touch){const lb=near?'Parler':'…';const el=$('#bAct b');if(el.textContent!==lb)el.textContent=lb;}}
    function objectiveTarget(){if(S.retry&&S.retry.length){const t=ANIMALS.filter(a=>retryOf(a).length);t.sort((a,b)=>Math.hypot(a.pos.x-P.x,a.pos.z-P.z)-Math.hypot(b.pos.x-P.x,b.pos.z-P.z));const a=t[0];return a?a.pos.clone().add(V3(0,a.kind==='elephant'?3.9:2.1,0)):null;}
      if(S.finished)return null;const todo=ANIMALS.filter(a=>!S.met.includes(a.id));if(!todo.length)return null;
      todo.sort((a,b)=>Math.hypot(a.pos.x-P.x,a.pos.z-P.z)-Math.hypot(b.pos.x-P.x,b.pos.z-P.z));const a=todo[0];return a.pos.clone().add(V3(0,a.kind==='elephant'?3.9:2.1,0));}

    /* Tutoriel en 3 bulles */
    const TIPS=touch?['Glissez le rond à gauche pour faire marcher Roxy.','Suivez la flèche dorée jusqu’à un animal.','Touchez le gros bouton doré pour lui parler.']
                    :['Déplacez Roxy avec ZQSD ou les flèches.','Suivez la flèche dorée jusqu’à un animal.','Appuyez sur E pour lui parler.'];
    let tutoMove=0,distT=0;
    function updateTuto(dt,hs){const tip=$('#tip');
      if(S.tuto===0){tutoMove+=hs*dt;if(tutoMove>3){S.tuto=1;save();}}
      if(S.tuto<2&&near)S.tuto=2;
      if(S.tuto===2&&!near)S.tuto=1;
      const show=started&&!paused&&!inDialog&&cineT<=0&&S.tuto<3&&!S.met.length;tip.hidden=!show;if(show&&tip.textContent!==TIPS[S.tuto])tip.textContent=TIPS[S.tuto];}
    const CINE=reduced?.01:4.2;let cineT=0;

    /* ===== Ciel et jour-nuit ===== */
    const GOLD=new THREE.Color('#F2B26A');const SKY={day:new THREE.Color('#8EC7E6'),dusk:new THREE.Color('#E9A86A'),night:new THREE.Color('#1F2A48')},sky=new THREE.Color();
    const CYCLE=params.has('jour')?1e9:300;
    function lighting(t){const ph=(.1+t/CYCLE)%1,ang=ph*Math.PI*2,elev=Math.sin(ang),day=Math.max(0,Math.min(1,elev*2.2+.25));
      if(elev>.22)sky.copy(SKY.day);else if(elev>-.05)sky.copy(SKY.dusk).lerp(SKY.day,(elev+.05)/.27);else sky.copy(SKY.night).lerp(SKY.dusk,Math.max(0,1+(elev+.05)*5));
      if(feteT>0){const e=FETE_DUR-feteT,k=Math.min(1,e/2)*Math.min(1,feteT/1.5);sky.lerp(GOLD,k*TIERS[tier].sky);}
      renderer.setClearColor(sky);scene.fog.color.copy(sky);sun.intensity=.15+1.0*day;hemi.intensity=.42+.38*day;amb.intensity=.12+.12*(1-day);sun.color.setHSL(.08,.6,.55+.25*day);
      const L=Math.max(.15,elev);sun.position.set(P.x+Math.cos(ang)*28,P.y+8+L*30,P.z+12);sun.target.position.copy(P);return day;}

    /* ===== Caméra ===== */
    const camT=V3(0,0,0);let camInit=false;
    function updateCamera(dt,moving){
      if(!started){const t=performance.now()/1000,yw=Math.PI*.85+t*.08,port=camera.aspect<.8,R=port?7:5.2;
        camera.position.set(P.x+Math.sin(yw)*R,P.y+(port?2.2:1.1),P.z+Math.cos(yw)*R);camera.lookAt(V3(P.x,P.y-(port?1.55:.9),P.z));camInit=false;return;}
      if(moving&&clock-lastCamInput>2.5&&!inDialog){let d=heading+Math.PI-yaw;d=Math.atan2(Math.sin(d),Math.cos(d));yaw+=d*Math.min(1,dt*.9);}
      let target=V3(P.x,P.y+1.05,P.z),pt=pitch,dd=dist;
      if(inDialog&&talker){target=dlgTarget(talker);let d=dlgYaw-yaw;d=Math.atan2(Math.sin(d),Math.cos(d));yaw+=d*Math.min(1,dt*3);pt=.42;dd=talker.kind==='elephant'?8.5:6.5;}
      if(feteT>0){const e=FETE_DUR-feteT,k=Math.min(1,Math.max(0,(e-1.2)/7)),ek=k*k*(3-2*k);const port=camera.aspect<.8?1.35:1;target=V3(FETE.x,FETE.y+1.6+ek*4.5,FETE.z);yaw+=dt*.3;pt=.42+ek*.08;dd=(16+ek*12)*port;
        camT.lerp(target,Math.min(1,dt*4));const dir=V3(Math.sin(yaw)*Math.cos(pt),Math.sin(pt),Math.cos(yaw)*Math.cos(pt));camera.position.copy(camT).addScaledVector(dir,dd);camera.lookAt(camT);return;}
      if(!camInit){camT.copy(target);camInit=true;}camT.lerp(target,Math.min(1,dt*(inDialog||feteT>0?3:8)));
      const dir=V3(Math.sin(yaw)*Math.cos(pt),Math.sin(pt),Math.cos(yaw)*Math.cos(pt));
      let d2=dd;for(let s=.5;s<=dd;s+=.25){const q=camT.clone().addScaledVector(dir,s);if(blocked(q)){d2=Math.max(1.2,s-.35);break;}}
      camera.position.copy(camT).addScaledVector(dir,d2);
      if(cineT>0){const k=1-cineT/CINE,e=k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;const S0=V3(P.x-26,30,P.z+30),L0=V3(32,14,10);
        camera.position.lerpVectors(S0,camera.position.clone(),e);camera.lookAt(V3(0,0,0).lerpVectors(L0,camT,e));}else camera.lookAt(camT);}
    function resize(){const w=host.clientWidth,h=host.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.fov=w/h<.8?68:55;camera.updateProjectionMatrix();}
    new ResizeObserver(resize).observe(host);resize();

    /* ===== Boucle ===== */
    let saveT=0,wind=1,last=performance.now(),perfLast=last,perfAcc=0,perfN=0,autoQ=false,fpsAcc=0,fpsN=0,fps=0;const fpsEl=params.has('fps')?$('#fps'):null;if(fpsEl)fpsEl.hidden=false;
    function frame(now){const dt=Math.min(.05,(now-last)/1000);last=now;
      if(!paused){clock+=dt;if(!S.finished)S.time+=dt;}
      if(cineT>0&&!paused){cineT-=dt;if(cineT<=0){cineT=0;$('#cine').hidden=true;}}
      if(feteT>0&&!paused){feteT-=dt;if(feteT<=0){feteT=0;showEnd();}}
      const hs=paused||cineT>0?0:physics(dt);
      if(!paused)updateContext();
      if(hs>.4||inDialog)idleT=0;else idleT+=dt;
      const state=feteT>0?'happy':!grounded?'air':hs>4.6?'run':hs>.4?'walk':idleT>16?'lie':idleT>7?'sit':'idle';
      RX.animateRoxy(roxy,state,clock,dt,hs);roxy.object.position.copy(P);
      if(inDialog&&talker){let d=Math.atan2(talker.pos.x-P.x,talker.pos.z-P.z)-heading;d=Math.atan2(Math.sin(d),Math.cos(d));heading+=d*Math.min(1,dt*6);}
      roxy.object.rotation.y=heading;
      ANIMALS.forEach(a=>{RX.animateCritter(a.kind,a.model,clock+a.phase,talker===a||feteT>0);
        if(feteT<=0&&!S.finished&&Math.hypot(P.x-a.pos.x,P.z-a.pos.z)<9){const o=a.model.object;let d=Math.atan2(P.x-a.pos.x,P.z-a.pos.z)-o.rotation.y;d=Math.atan2(Math.sin(d),Math.cos(d));o.rotation.y+=d*Math.min(1,dt*2);}
        if(S.met.includes(a.id)&&!reduced&&Math.random()<dt*.8)emit({x:a.pos.x+(Math.random()-.5),y:a.pos.y+(a.kind==='elephant'?3.6:1.6),z:a.pos.z+(Math.random()-.5),v:{x:0,y:.7,z:0},g:0,life:1.4,age:0,c:'#FFE08A',s:.6});});
      if(growT>=0){growT+=dt;const k=Math.min(1,growT/(reduced?.1:4.2));TREE.show(1-Math.pow(1-k,2));if(!reduced&&Math.random()<dt*(8+tier*8))emit({x:FETE.x+(Math.random()-.5)*(tier===3?9:3),y:FETE.y+k*11,z:FETE.z+(Math.random()-.5)*(tier===3?9:3),v:{x:0,y:2,z:0},g:0,life:1.2,age:0,c:tier===3?'#FFD54A':'#FFE08A',s:tier===3?1.4:1});if(k>=1){growT=-1;TREE.show(1);if(tier===3){TREE.gold(true);RX.audio.pick();sparkle(V3(FETE.x,FETE.y+10,FETE.z),['#FFD873','#F2C14E','#FFFFFF'],90,7);}}}
      updateFireworks(dt);
      if(feteT>0){const e=FETE_DUR-feteT;ANIMALS.forEach((a,i)=>{const ph=e*3-i*.55;a.model.object.position.y=a.pos.y+(ph>0?Math.abs(Math.sin(ph*Math.PI*.9))*(a.kind==='elephant'?.35:.7)*(.45+tier*.2):0);});}
      else if(S.finished)ANIMALS.forEach(a=>a.model.object.position.y=a.pos.y);
      wind=1+.6*Math.sin(clock*.23)*Math.sin(clock*.07);
      for(let i=0;i<DN;i++){dPos[i*3]+=.9*wind*dt;dPos[i*3+2]+=.3*dt;if(dPos[i*3]>P.x+25)dPos[i*3]-=50;if(dPos[i*3]<P.x-25)dPos[i*3]+=50;if(dPos[i*3+2]>P.z+25)dPos[i*3+2]-=50;if(dPos[i*3+2]<P.z-25)dPos[i*3+2]+=50;}
      dGeo.attributes.position.needsUpdate=true;
      if(!reduced)world.animateTufts(clock,wind);
      const day=lighting(clock);RX.audio.ambience(dt,day,wind);
      updateParticles(dt,clock);updateCamera(dt,hs>.4);updateTuto(dt,hs);
      {const tg=objectiveTarget();const showG=!!tg&&!inDialog&&started&&cineT<=0&&!paused;marker.visible=showG;guide.visible=false;edgeEl.hidden=true;
        if(tg){marker.position.copy(tg);marker.position.y+=reduced?0:Math.sin(clock*3)*.18;marker.rotation.y=clock*1.2;
        const d=Math.hypot(tg.x-P.x,tg.z-P.z);marker.scale.setScalar(Math.min(2.6,1.3+d/14));
        if(showG&&d>2.5){const ux=(tg.x-P.x)/d,uz=(tg.z-P.z)/d,pulse=reduced?0:Math.sin(clock*5)*.12;
          guide.visible=true;guide.position.set(P.x+ux*(1.5+pulse),P.y+.06,P.z+uz*(1.5+pulse));guide.rotation.y=Math.atan2(-ux,-uz);guide.scale.setScalar(.85);
          const v=tg.clone().project(camera),behind=v.z>1;let sx=behind?-v.x:v.x,sy=behind?-v.y:v.y;
          if(behind||Math.abs(sx)>.88||Math.abs(sy)>.82){const a=Math.atan2(sy,sx),W=innerWidth,Hh=innerHeight,rx=W/2-46,ry=Hh/2-(touch?150:80);
            edgeEl.hidden=false;edgeEl.style.left=(W/2+Math.cos(a)*rx)+'px';edgeEl.style.top=(Hh/2-Math.sin(a)*ry)+'px';edgeSvg.style.transform=`rotate(${-a}rad)`;edgeTxt.textContent=Math.round(d)+' m';}}distT-=dt;if(distT<=0){distT=.3;$('#dist').textContent=d>4?`à ${Math.round(d)} m`:'tout près !';}}else $('#dist').textContent='';}
      renderer.render(scene,camera);
      saveT+=dt;if(saveT>5&&!paused){saveT=0;save();}
      perfAcc+=(now-perfLast)/1000;perfLast=now;perfN++;
      if(started&&!paused&&!autoQ&&perfAcc>4){const f=perfN/perfAcc;autoQ=true;if(f<28&&renderer.shadowMap.enabled){renderer.shadowMap.enabled=false;$('#shadows').checked=false;scene.traverse(o=>{if(o.material)o.material.needsUpdate=true;});toast('Ombres désactivées pour plus de fluidité');}}
      if(!started||paused){perfAcc=0;perfN=0;}
      if(fpsEl){fpsAcc+=dt;fpsN++;if(fpsAcc>1){fps=Math.round(fpsN/fpsAcc);fpsAcc=0;fpsN=0;fpsEl.textContent=fps+' img/s';}}
      requestAnimationFrame(frame);}
    requestAnimationFrame(frame);
    $('#loading').hidden=true;$('#play').disabled=false;$('#play').textContent=S.met.length?'Reprendre':'Jouer';
    {const r=getRecord();if(r){$('#record').hidden=false;$('#record').textContent=`Votre record : ${r.ok>=12?'🥇 Flair d’or':r.ok>=10?'🥈 Flair d’argent':r.ok>=7?'🥉 Flair de bronze':'Chiot curieux'} (${r.ok}/12)`;}}
    if(S.finished){$('#seeResult').hidden=false;$('#pauseResult').hidden=false;}
    if(S.met.length){$('#progress').hidden=false;$('#progress').textContent=S.finished?'Parcours terminé : 6 animaux sur 6':`Animaux rencontrés : ${S.met.length} sur 6`;$('#newGame').hidden=false;}
    $('#newGame').onclick=()=>{const b=$('#newGame');if(b.dataset.ok){restart();return;}b.dataset.ok=1;b.textContent='Confirmer : effacer ma progression';};
    if(S.finished){const playGame=$('#play').onclick;$('#play').textContent='Nouvelle partie';$('#play').onclick=()=>restart();
      const b=$('#newGame');b.textContent='Continuer à explorer l’ancienne partie';b.onclick=playGame;}
    if(params.has('test')){started=true;paused=false;$('#start').hidden=true;}

    /* Accès de test (automatisation) */
    RX.debug={get state(){return {pos:[P.x,P.y,P.z],grounded,met:S.met.slice(),ans:{...S.ans},finished:S.finished,fete:+feteT.toFixed(2),near:near&&near.id,inDialog,paused,cubes:{roxy:roxy.count,animals:ANIMALS.map(a=>a.model.count)},fps,time:S.time};},
      animals:()=>ANIMALS.map(a=>({id:a.id,pos:[a.pos.x,a.pos.y,a.pos.z],q:a.q})),
      feteAt(e){feteT=Math.max(.05,FETE_DUR-e);growT=Math.min(e,4.2);},
      teleport(x,y,z,h){P.set(x,y,z);V.set(0,0,0);if(h!==undefined)heading=h;camInit=false;},setYaw(v){yaw=v;lastCamInput=clock;},world,
      sim(sec,input=[]){input.forEach(k=>keys[k]=true);for(let i=0;i<Math.round(sec*60);i++){const hs=physics(1/60);updateContext();updateTuto(1/60,hs);}input.forEach(k=>keys[k]=false);return [P.x,P.y,P.z];}};
  };
})(window.RX);
