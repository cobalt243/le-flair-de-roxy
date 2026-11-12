/* Le Flair de Roxy — musique de la version B (v2, après revue de la qualité sonore).
   Esprit « jeu en blocs » contemplatif (piano doux, silences) + couleurs du Sahel (balafon, tambour d'eau, flûte, cloche).
   Composition originale générée par le code (aucune mélodie existante reprise).
   composeB(ctx, sortie, variante 0..2) programme tout le morceau et renvoie sa durée en secondes.
   v2 : piano plus riche et plus clair, mixage pensé pour haut-parleur de téléphone (rien d'utile sous 180 Hz),
   balafon et cloche renforcés, réverbération plus courte, trois variantes. */
window.composeB=function(ctx,out,variant){
  variant=variant||0;
  let s=[11,29,53][variant%3];const rnd=()=>{s=(s*16807)%2147483647;return (s-1)/2147483646;};
  const midi=n=>440*Math.pow(2,(n-69)/12);
  const bpm=[66,62,69][variant%3],beat=60/bpm,bar=beat*4;

  /* ---- sortie : passe-haut 180 Hz, creux à 350 Hz, étagère d'aigus ---- */
  const hp=ctx.createBiquadFilter();hp.type='highpass';hp.frequency.value=180;hp.Q.value=.6;
  const mid=ctx.createBiquadFilter();mid.type='peaking';mid.frequency.value=350;mid.Q.value=.8;mid.gain.value=-3;
  const hs=ctx.createBiquadFilter();hs.type='highshelf';hs.frequency.value=2500;hs.gain.value=5;
  hp.connect(mid).connect(hs).connect(out);
  const dry=ctx.createGain();dry.gain.value=.85;dry.connect(hp);
  /* ---- réverbération : 2,2 s, décroissance exponentielle, pré-délai 20 ms, envoi sans graves ---- */
  const RT=2.2,ir=ctx.createBuffer(2,Math.floor(ctx.sampleRate*RT),ctx.sampleRate);
  for(let c=0;c<2;c++){const d=ir.getChannelData(c);for(let i=0;i<d.length;i++)d[i]=(rnd()*2-1)*Math.exp(-6.9*i/d.length);}
  const rv=ctx.createConvolver();rv.buffer=ir;const wet=ctx.createGain();wet.gain.value=.30;rv.connect(wet).connect(hp);
  const pre=ctx.createDelay(.1);pre.delayTime.value=.02;const sendHP=ctx.createBiquadFilter();sendHP.type='highpass';sendHP.frequency.value=250;pre.connect(sendHP).connect(rv);
  const bus=(pan,lp)=>{const p=ctx.createStereoPanner();p.pan.value=pan;const f=ctx.createBiquadFilter();f.type='lowpass';f.frequency.value=lp;f.connect(p);p.connect(dry);p.connect(pre);return f;};
  const PIANO=bus(-.1,6000),BALA=bus(.35,8000),DRUM=bus(-.25,4000),FLUTE=bus(.2,5000),BELL=bus(0,10000);
  const osc=(type,f,t,dst,env)=>{const o=ctx.createOscillator(),g=ctx.createGain();o.type=type;o.frequency.setValueAtTime(f,t);env(g.gain,o);o.connect(g).connect(dst);return o;};
  const noiseBuf=(()=>{const b=ctx.createBuffer(1,ctx.sampleRate*2,ctx.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=rnd()*2-1;return b;})();
  const noise=(t,dur,type,f,q,vol,dst)=>{const n=ctx.createBufferSource();n.buffer=noiseBuf;const bp=ctx.createBiquadFilter();bp.type=type;bp.frequency.value=f;bp.Q.value=q;
    const g=ctx.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+.004);g.gain.exponentialRampToValueAtTime(.0001,t+dur);n.connect(bp).connect(g).connect(dst);n.start(t,rnd()*1.5);n.stop(t+dur+.05);};

  /* ---- instruments ---- */
  function piano(n,t,vol,len){const f=midi(n);len=len||4.5;
    [[1,1,1],[2,.5,.7],[3,.28,.5],[4,.16,.4],[5,.09,.3],[6,.05,.25],[7,.03,.2]].forEach(([m,v,dk])=>{const fp=f*m*Math.sqrt(1+.0004*m*m);if(fp>9000)return;
      const o=osc('sine',fp,t,PIANO,g=>{g.setValueAtTime(0,t);g.linearRampToValueAtTime(vol*v,t+.010);g.exponentialRampToValueAtTime(vol*v*.35,t+.35*dk);g.exponentialRampToValueAtTime(.0001,t+len*dk);});
      o.start(t);o.stop(t+len*dk+.1);});
    noise(t,.02,'bandpass',2500,1.2,vol*.12,PIANO);}            // bruit de marteau
  function chord(notes,t,vol){notes.forEach((n,i)=>piano(n,t+i*.045+rnd()*.01,vol*(i===0?1:.75),6));piano(notes[0]-12,t,vol*.35,5);}
  function balafon(n,t,vol){const f=midi(n);
    [[1,1,.55],[3.93,.4,.25],[9.6,.12,.08]].forEach(([m,v,d])=>{const o=osc('sine',f*m,t,BALA,g=>{g.setValueAtTime(0,t);g.linearRampToValueAtTime(vol*v,t+.003);g.exponentialRampToValueAtTime(.0001,t+d);});o.start(t);o.stop(t+d+.05);});
    noise(t,.05,'bandpass',f*1.5,6,vol*.12,BALA);
    const bz=osc('sawtooth',f*.5,t,BALA,g=>{g.setValueAtTime(0,t);g.linearRampToValueAtTime(vol*.02,t+.01);g.exponentialRampToValueAtTime(.0001,t+.22);});bz.start(t);bz.stop(t+.3);}
  function drum(t,vol,low){const f0=low?180:260;
    [[1,1],[2,.3]].forEach(([m,v])=>{const o=osc('sine',f0*1.5*m,t,DRUM,g=>{g.setValueAtTime(0,t);g.linearRampToValueAtTime(vol*v,t+.005);g.exponentialRampToValueAtTime(.0001,t+(low?.5:.28)/m);});
      o.frequency.exponentialRampToValueAtTime(f0*m,t+.07);o.start(t);o.stop(t+.6);});
    noise(t,low?.08:.05,'bandpass',low?900:1500,1.2,vol*.4,DRUM);}
  function flute(n,t,dur,vol,slide){const f=midi(n);
    const o=osc('sine',f,t,FLUTE,g=>{g.setValueAtTime(0,t);g.linearRampToValueAtTime(vol,t+.18);g.setValueAtTime(vol,t+dur-.35);g.linearRampToValueAtTime(0,t+dur);});
    if(slide)o.frequency.setValueAtTime(midi(n+slide),t),o.frequency.exponentialRampToValueAtTime(f,t+.16);
    const lfo=ctx.createOscillator(),lg=ctx.createGain();lfo.frequency.value=5.2;lg.gain.setValueAtTime(0,t);lg.gain.linearRampToValueAtTime(f*.006,t+.5);lfo.connect(lg).connect(o.frequency);lfo.start(t);lfo.stop(t+dur);
    [[2,.16],[3,.06]].forEach(([m,v])=>{const h=osc('sine',f*m,t,FLUTE,g=>{g.setValueAtTime(0,t);g.linearRampToValueAtTime(vol*v,t+.2);g.linearRampToValueAtTime(0,t+dur);});h.start(t);h.stop(t+dur+.05);});
    o.start(t);o.stop(t+dur+.05);
    const n2=ctx.createBufferSource();n2.buffer=noiseBuf;const bp=ctx.createBiquadFilter();bp.type='bandpass';bp.frequency.value=f*2;bp.Q.value=2;const g2=ctx.createGain();
    g2.gain.setValueAtTime(0,t);g2.gain.linearRampToValueAtTime(vol*.12,t+.08);g2.gain.linearRampToValueAtTime(vol*.04,t+.4);g2.gain.linearRampToValueAtTime(0,t+dur);n2.connect(bp).connect(g2).connect(FLUTE);n2.start(t);n2.stop(t+dur+.05);}
  function bell(n,t,vol){const f=midi(n);
    [[1,1,3.0],[2.76,.45,1.6],[5.4,.22,.9],[8.93,.1,.5]].forEach(([m,v,d])=>{if(f*m>12000)return;const o=osc('sine',f*m,t,BELL,g=>{g.setValueAtTime(0,t);g.linearRampToValueAtTime(vol*v,t+.002);g.exponentialRampToValueAtTime(.0001,t+d);});o.start(t);o.stop(t+d+.05);});}

  /* ---- harmonie en ré majeur (accords resserrés, lisibles sur téléphone), trois variantes ---- */
  const D=[57,62,64,66,69],Bm=[59,61,62,66,69],G=[55,59,62,66,69],A=[57,59,62,64,69],Em=[59,62,64,67,71];
  const CH=[[D,Bm,G,A],[D,G,Bm,A],[G,D,Em,A]][variant%3];
  const MOTIF=[[[0,78],[1,76],[1.5,74],[2,69],[3.5,71]],[[0,74],[.5,76],[1.5,78],[2.5,76],[3.5,74]],[[0,81],[1,78],[2,76],[2.5,74],[3.5,76]]][variant%3];
  const PENTA=[62,64,66,69,71,74,76,78,81];
  const FL=[[[4,.5,[[74,2.4,-2],[71,1.6,0],[69,3.2,0]]],[10,0,[[76,1.8,-2],[78,1.4,0],[74,3.6,0]]]],
            [[5,0,[[78,2.0,-2],[76,1.6,0],[74,3.0,0]]],[11,1,[[71,1.6,0],[74,1.6,-2],[69,3.4,0]]]],
            [[4,1,[[69,1.8,0],[71,1.4,0],[74,3.4,-2]]],[9,.5,[[81,1.6,-2],[78,1.6,0],[76,3.2,0]]]]][variant%3];
  const balaFrom=[2,1,2][variant%3],dens=[.72,.6,.78][variant%3];
  let T=.3,ends=0;
  for(let cyc=0;cyc<4;cyc++){
    CH.forEach((c,i)=>{const t=T+(cyc*4+i)*bar;
      chord(c,t,.10);
      if(cyc>=1&&i%2===0)MOTIF.forEach(([b,n],k)=>{const v=(cyc===3&&k===4)?n+3:n;piano(v,t+b*beat,.085,3.5);});
      if(cyc>=1){drum(t,.2,true);drum(t+1.5*beat,.1,false);if(cyc>=2)drum(t+2.5*beat,.09,false),drum(t+3*beat,.13,true);}
      if(cyc>=balaFrom){let d=Math.floor(rnd()*4)+3;[0,.75,1.5,2,2.75,3.25].forEach(b=>{if(rnd()<dens){d+=[-1,1,-2,2,0,1][Math.floor(rnd()*6)];d=Math.max(0,Math.min(8,d));balafon(PENTA[d],t+b*beat,.18);}});}
      ends=t+bar;});
  }
  FL.forEach(([b0,off,ph])=>{let t=T+b0*bar+off*beat;ph.forEach(([n,d,sl])=>{flute(n,t,d,.085,sl);t+=d*.92;});});
  [0,4,8,12].forEach((k,i)=>bell(i%2?81:86,T+k*bar+.02,.09));
  chord([57,62,66,69,74,78],ends,.1);bell(86,ends+.03,.07);
  return ends+5.5;
};
