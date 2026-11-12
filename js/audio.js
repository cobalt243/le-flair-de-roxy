/* Le Flair de Roxy — sons originaux synthétisés (Web Audio). Aucun fichier sonore externe. */
(function(RX){
  let ctx=null,master=null,windGain=null,enabled=false,birdT=0;
  function init(){if(ctx)return;try{ctx=new (window.AudioContext||window.webkitAudioContext)();}catch(e){return;}
    ctx.onstatechange=()=>{if(ctx.state==='interrupted'&&!document.hidden&&enabled){const pr=ctx.resume();if(pr&&pr.catch)pr.catch(()=>{});}};   // iOS : reprise après un appel ou une alerte
    master=ctx.createGain();master.gain.value=1.0;master.connect(ctx.destination);
    const len=ctx.sampleRate*2,buf=ctx.createBuffer(1,len,ctx.sampleRate),d=buf.getChannelData(0);let last=0;
    for(let i=0;i<len;i++){last=(last+.02*(Math.random()*2-1))/1.02;d[i]=last*3.5;}for(let i=0;i<2000;i++){const k=i/2000;d[i]*=k;d[len-1-i]*=k;}
    const src=ctx.createBufferSource();src.buffer=buf;src.loop=true;const lp=ctx.createBiquadFilter();lp.type='lowpass';lp.frequency.value=240;
    windGain=ctx.createGain();windGain.gain.value=0;src.connect(lp).connect(windGain).connect(master);src.start();}
  function tone(f,dur,type='sine',vol=.08,delay=0,slide=0){if(!enabled||!ctx)return;vol*=2.2;const t=ctx.currentTime+delay,o=ctx.createOscillator(),g=ctx.createGain();
    o.type=type;o.frequency.setValueAtTime(f,t);if(slide)o.frequency.exponentialRampToValueAtTime(Math.max(40,f+slide),t+dur);
    g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+.01);g.gain.exponentialRampToValueAtTime(.0008,t+dur);o.connect(g).connect(master);o.start(t);o.stop(t+dur+.05);}
  function noise(dur,freq,vol=.1,delay=0){if(!enabled||!ctx)return;vol*=2.2;const t=ctx.currentTime+delay,len=Math.floor(ctx.sampleRate*dur),buf=ctx.createBuffer(1,len,ctx.sampleRate),d=buf.getChannelData(0);
    for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*(1-i/len);const s=ctx.createBufferSource();s.buffer=buf;const bp=ctx.createBiquadFilter();bp.type='bandpass';bp.frequency.value=freq;bp.Q.value=1.2;
    const g=ctx.createGain();g.gain.value=vol;s.connect(bp).connect(g).connect(master);s.start(t);}
  /* iPhone : le bouton silencieux coupe le Web Audio. On passe la session audio en mode « lecture »
     et on joue un son silencieux via un élément <audio>, pendant le geste de l'utilisateur. */
  let silent=null;
  function silentWav(){const sr=8000,n=sr,buf=new ArrayBuffer(44+n*2),v=new DataView(buf);const w=(o,t)=>{for(let i=0;i<t.length;i++)v.setUint8(o+i,t.charCodeAt(i));};
    w(0,'RIFF');v.setUint32(4,36+n*2,true);w(8,'WAVE');w(12,'fmt ');v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,1,true);v.setUint32(24,sr,true);v.setUint32(28,sr*2,true);v.setUint16(32,2,true);v.setUint16(34,16,true);w(36,'data');v.setUint32(40,n*2,true);
    return URL.createObjectURL(new Blob([buf],{type:'audio/wav'}));}
  function unlock(){
    try{if(navigator.audioSession)navigator.audioSession.type='playback';}catch(e){}
    try{if(!silent){silent=document.createElement('audio');silent.src=silentWav();silent.loop=true;silent.setAttribute('playsinline','');silent.volume=.01;}const pr=silent.play();if(pr&&pr.catch)pr.catch(()=>{});}catch(e){}
    if(ctx){ctx.resume();try{const b=ctx.createBuffer(1,1,22050),src=ctx.createBufferSource();src.buffer=b;src.connect(ctx.destination);src.start(0);}catch(e){}}
  }
  ['touchend','pointerup','click'].forEach(ev=>window.addEventListener(ev,()=>{if(enabled&&ctx&&ctx.state!=='running')unlock();},{passive:true}));
  document.addEventListener('visibilitychange',()=>{if(!ctx)return;if(document.hidden){ctx.suspend();if(silent)silent.pause();}else if(enabled){ctx.resume();if(silent){const pr=silent.play();if(pr&&pr.catch)pr.catch(()=>{});}}});

  /* ===== Musique originale, générée par le code =====
     Timbres : kora (harpe-luth), balafon (xylophone) et nappe douce, pour un univers imaginaire.
     Esprit : musique d'ambiance calme et contemplative, notes rares, résonance, et silences entre les morceaux.
     Chaque morceau est composé en direct (gamme pentatonique, marche mélodique aléatoire) : aucune mélodie existante n'est reprise. */
  let musicWanted=true,mGain=null,mDry=null,mWet=null,mTimer=null,mNext=0,mLevel=.7,dayF=1;
  try{musicWanted=localStorage.getItem('flair-roxy-2-musique')!=='non';}catch(e){}
  const PENTA=[0,3,5,7,10];                    // pentatonique mineure (demi-tons)
  const KEYS=[57,50,55,52];                     // la, ré, sol, mi (notes MIDI)
  const midi=n=>440*Math.pow(2,(n-69)/12);
  let piece=null;
  function newPiece(){const key=KEYS[Math.floor(Math.random()*KEYS.length)];
    return {key,beat:0,len:64+Math.floor(Math.random()*48),deg:5+Math.floor(Math.random()*3),bpm:62+Math.floor(Math.random()*10),
      pad:[0,0,3,0,4,0,3,2].map(x=>x),voice:Math.random()<.5?'kora':'balafon',rest:0};}
  function note(deg,oct=0){const d=((deg%5)+5)%5,o=Math.floor(deg/5);return piece.key+PENTA[d]+12*(o+oct);}
  function reverb(){const len=ctx.sampleRate*3.2,ir=ctx.createBuffer(2,len,ctx.sampleRate);
    for(let c=0;c<2;c++){const d=ir.getChannelData(c);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,3.2);}
    const cv=ctx.createConvolver();cv.buffer=ir;return cv;}
  function setupMusic(){mGain=ctx.createGain();mGain.gain.value=0;mGain.connect(master);
    mDry=ctx.createGain();mDry.gain.value=.65;mDry.connect(mGain);
    const rv=reverb();mWet=ctx.createGain();mWet.gain.value=.55;rv.connect(mWet).connect(mGain);
    const lp=ctx.createBiquadFilter();lp.type='lowpass';lp.frequency.value=2600;lp.connect(mDry);lp.connect(rv);mDry._in=lp;}
  const IN=()=>mDry._in;
  function pluck(f,t,vol,kind){
    const dur=kind==='kora'?3.2:1.4;
    const parts=kind==='kora'?[[1,1],[2,.32],[3,.12]]:[[1,1],[3.98,.18],[9.1,.05]];
    parts.forEach(([m,v])=>{const o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.setValueAtTime(f*m,t);
      g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol*v,t+(kind==='kora'?.008:.004));g.gain.exponentialRampToValueAtTime(.0004,t+dur/(m>1?m*.7:1));
      o.connect(g).connect(IN());o.start(t);o.stop(t+dur+.1);});}
  function pad(f,t,dur,vol){[-4,4].forEach(cents=>{const o=ctx.createOscillator(),g=ctx.createGain(),lp=ctx.createBiquadFilter();o.type='triangle';o.frequency.setValueAtTime(f,t);o.detune.value=cents;
    lp.type='lowpass';lp.frequency.value=700;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+dur*.35);g.gain.linearRampToValueAtTime(0,t+dur);
    o.connect(lp).connect(g).connect(IN());o.start(t);o.stop(t+dur+.1);});}
  /* ===== Musique : morceau « piano doux + balafon, tambour d'eau, flûte, cloche »,
     trois variantes (audio/musique-1..3.mp3), une par passage, suivie d'une pause de 45 à 75 s (compromis : musique rare, 3 à 4 passages par partie). ===== */
  const B_GAIN=1,B_N=3;let bBuf=null,bLoading=false,bSrc=null,bLast=-1;let bHold=false;
  function loadB(){if(bBuf||bLoading||!ctx)return;bLoading=true;
    let k=Math.floor(Math.random()*B_N);if(k===bLast)k=(k+1)%B_N;bLast=k;        // trois variantes, jamais deux fois la même de suite
    fetch('audio/musique-'+(k+1)+'.mp3').then(r=>r.arrayBuffer()).then(a=>new Promise((ok,ko)=>ctx.decodeAudioData(a,ok,ko))).then(b=>{bBuf=b;}).catch(()=>{}).finally(()=>{bLoading=false;});}
  function schedule(){
    if(!ctx||ctx.state!=='running'||bHold)return;
    if(!bBuf){loadB();return;}
    if(mNext<ctx.currentTime)mNext=ctx.currentTime+.2;
    if(mNext<ctx.currentTime+.3){const src=ctx.createBufferSource(),g=ctx.createGain();g.gain.value=B_GAIN;src.buffer=bBuf;src.connect(g).connect(mGain);
      src.start(mNext);bSrc=src;src.onended=()=>{if(bSrc===src)bSrc=null;};mNext+=bBuf.duration+45+Math.random()*30;
      bBuf=null;setTimeout(loadB,8000);}}                                     // la variante suivante se charge pendant que celle-ci joue
  function startMusic(){if(!ctx||mTimer)return;if(!mGain)setupMusic();loadB();mGain.gain.cancelScheduledValues(ctx.currentTime);mGain.gain.setValueAtTime(mGain.gain.value,ctx.currentTime);
    mGain.gain.linearRampToValueAtTime(mLevel,ctx.currentTime+1);mNext=ctx.currentTime+1.2;mTimer=setInterval(schedule,200);}
  function stopMusic(){if(mTimer){clearInterval(mTimer);mTimer=null;}if(mGain&&ctx){mGain.gain.cancelScheduledValues(ctx.currentTime);mGain.gain.setTargetAtTime(0,ctx.currentTime,.25);}
    if(bSrc&&ctx){try{bSrc.stop(ctx.currentTime+1.2);}catch(e){}bSrc=null;}}
  /* Grand final : la musique s'efface, puis reprend depuis le début sur l'écran des résultats. */
  function musicHold(){bHold=true;if(!ctx||!mGain)return;const t=ctx.currentTime;mGain.gain.cancelScheduledValues(t);mGain.gain.setValueAtTime(mGain.gain.value,t);mGain.gain.linearRampToValueAtTime(0,t+1.5);
    if(bSrc){try{bSrc.stop(t+1.6);}catch(e){}bSrc=null;}}
  function musicFromStart(){bHold=false;if(!ctx||!mGain||!mTimer)return;const t=ctx.currentTime;
    if(bSrc){try{bSrc.stop(t+.3);}catch(e){}bSrc=null;}
    mGain.gain.cancelScheduledValues(t);mGain.gain.setValueAtTime(mGain.gain.value,t);mGain.gain.linearRampToValueAtTime(0,t+.3);mGain.gain.linearRampToValueAtTime(mLevel,t+.5);mNext=t+.6;}   // plein volume avant le premier accord
  /* Carillon de réussite, court, en ré pentatonique comme la musique ; plus riche selon le score. */
  function chime(lv){const N=[587.3,740,880,1174.7,1480,1760];const n=lv>=3?6:lv>=2?5:lv>=1?4:3;const step=lv>=3?.11:.14;
    for(let i=0;i<n;i++){const f=N[i];tone(f,.9,'sine',.06,i*step);tone(f*3.93,.12,'sine',.012,i*step);}
    const tb=n*step+.05;[[1174.7,1,2.2],[1174.7*2.76,.4,1.2],[1174.7*5.4,.18,.7]].forEach(([f,v,d])=>tone(f,d,'sine',.045*v,tb));
    if(lv>=2)[293.7,440,587.3].forEach((f,k)=>tone(f,2.2,'triangle',.03,tb+k*.03));
    if(lv>=3){[1760,2349.3].forEach((f,k)=>tone(f,.6,'sine',.025,tb+.25+k*.12));}}
  RX.audio={
    toggle(){init();if(!ctx)return false;enabled=!enabled;if(enabled){unlock();if(musicWanted)startMusic();}else stopMusic();if(windGain)windGain.gain.setTargetAtTime(enabled?.015:0,ctx.currentTime,.4);return enabled;},
    setMusic(on){musicWanted=on;try{localStorage.setItem('flair-roxy-2-musique',on?'oui':'non');}catch(e){}if(on&&enabled)startMusic();else stopMusic();},
    get music(){return musicWanted;},
    get musicPlaying(){return !!mTimer;},
    unlock,musicHold,musicFromStart,chime,
    get on(){return enabled;},
    step(){noise(.05,500,.04);},
    jump(){tone(330,.18,'triangle',.06,0,220);},
    sniff(){for(let i=0;i<3;i++)noise(.09,2400,.09,i*.14);},
    dig(){noise(.18,260,.16);tone(180,.2,'sine',.08);},
    pick(){[784,988,1175,1568].forEach((f,i)=>tone(f,.25,'sine',.07,i*.08));},
    talk(){tone(392,.25,'triangle',.06);tone(294,.3,'triangle',.05,.12);},
    ok(){tone(587.3,.18,'sine',.08);tone(880,.25,'sine',.08,.1);},
    no(){tone(440,.25,'triangle',.06);tone(349.2,.3,'triangle',.05,.12);},
    /* Grand final : fanfare originale (balafon + kora + percussions), environ 6 s */
    fanfare(lv=3){const N=[523,659,784,1047,880,1047,1175,1319,1568].slice(0,lv>=2?9:lv===1?6:4);N.forEach((f,i)=>{tone(f,.35,'sine',.07,i*.13);tone(f*4.02,.06,'triangle',.02,i*.13);});
      if(lv<1)return;[[262,330,392],[294,370,440],[330,415,494],[349,440,523]].slice(0,lv+1).forEach((ch,j)=>ch.forEach((f,k)=>tone(f,2.2,'sine',.045,1.3+j*.9+k*.04)));
      for(let i=0;i<lv*2+2;i++){noise(.12,180,.22,1.3+i*.45);if(i%2)noise(.06,1600,.08,1.52+i*.45);}
      if(lv>=3)[1047,1319,1568,2093].forEach((f,i)=>tone(f,1.4,'sine',.05,4.9+i*.12));},
    whoosh(){tone(300,.7,'sine',.025,0,900);noise(.5,2200,.03);},
    boom(){noise(.5,300,.22);noise(.25,3000,.06,.05);for(let i=0;i<5;i++)noise(.04,5000,.03,.15+i*.07);},
    tick(n){tone(660+n*40,.06,'square',.025);},
    win(){[523,659,784,1047,784,1047].forEach((f,i)=>tone(f,.3,'sine',.08,i*.12));},
    splash(){noise(.25,900,.08);},
    ambience(dt,day,wind){if(!enabled||!ctx)return;dayF=day;if(mGain&&mTimer){const lv=.5+.2*day;if(Math.abs(lv-mLevel)>.02){mLevel=lv;mGain.gain.setTargetAtTime(mLevel,ctx.currentTime,2);}}if(windGain)windGain.gain.setTargetAtTime(.008+.014*wind,ctx.currentTime,.8);
      birdT-=dt;if(birdT<=0){birdT=3+Math.random()*7;if(day>.35){const f=1800+Math.random()*1400;tone(f,.09,'sine',.035,0,600);tone(f*1.1,.08,'sine',.03,.12,-400);}
        else{for(let i=0;i<4;i++)tone(4200,.03,'square',.012,i*.06);}}}
  };
})(window.RX);
