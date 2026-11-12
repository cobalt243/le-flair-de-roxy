/* Le Flair de Roxy — esquisse musicale B : esprit « jeu en blocs » contemplatif + couleurs du Sahel.
   Composition originale générée par le code (aucune mélodie existante reprise).
   Couches : piano feutré (accords + motif), balafon, tambour d'eau, flûte en bois, cloche en fer. */
window.composeB=function(ctx,out,seed){
  let s=seed||7;const rnd=()=>{s=(s*16807)%2147483647;return (s-1)/2147483646;};
  const midi=n=>440*Math.pow(2,(n-69)/12);
  const bpm=66,beat=60/bpm,bar=beat*4;

  /* ---- bus : filtre doux + réverbération ---- */
  const hp=ctx.createBiquadFilter();hp.type='highpass';hp.frequency.value=135;hp.Q.value=.6;hp.connect(out);out=hp;   // pas de graves inutiles sur téléphone
  const dry=ctx.createGain();dry.gain.value=.8;dry.connect(out);
  const ir=ctx.createBuffer(2,ctx.sampleRate*3.4,ctx.sampleRate);
  for(let c=0;c<2;c++){const d=ir.getChannelData(c);for(let i=0;i<d.length;i++)d[i]=(rnd()*2-1)*Math.pow(1-i/d.length,3);}
  const rv=ctx.createConvolver();rv.buffer=ir;const wet=ctx.createGain();wet.gain.value=.42;rv.connect(wet).connect(out);
  const bus=(pan,lp)=>{const p=ctx.createStereoPanner();p.pan.value=pan;const f=ctx.createBiquadFilter();f.type='lowpass';f.frequency.value=lp;f.connect(p);p.connect(dry);p.connect(rv);return f;};
  const PIANO=bus(-.1,3400),BALA=bus(.35,5200),DRUM=bus(-.25,3000),FLUTE=bus(.2,3800),BELL=bus(0,6000);
  const osc=(type,f,t,dst,env)=>{const o=ctx.createOscillator(),g=ctx.createGain();o.type=type;o.frequency.setValueAtTime(f,t);env(g.gain,o);o.connect(g).connect(dst);return o;};
  const noiseBuf=(()=>{const b=ctx.createBuffer(1,ctx.sampleRate*2,ctx.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=rnd()*2-1;return b;})();
  const noise=(t,dur,type,f,q,vol,dst)=>{const n=ctx.createBufferSource();n.buffer=noiseBuf;const bp=ctx.createBiquadFilter();bp.type=type;bp.frequency.value=f;bp.Q.value=q;
    const g=ctx.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+.004);g.gain.exponentialRampToValueAtTime(.0001,t+dur);n.connect(bp).connect(g).connect(dst);n.start(t,rnd()*1.5);n.stop(t+dur+.05);};

  /* ---- instruments ---- */
  function piano(n,t,vol,len){const f=midi(n);len=len||4.5;
    [[1,1,1],[2,.38,.55],[3,.14,.35],[4,.06,.25]].forEach(([m,v,dk],k)=>{
      const o=osc('sine',f*m*(1+(k?.0007*k:0)),t,PIANO,g=>{g.setValueAtTime(0,t);g.linearRampToValueAtTime(vol*v,t+.012);g.exponentialRampToValueAtTime(vol*v*.35,t+.35*dk);g.exponentialRampToValueAtTime(.0001,t+len*dk);});
      o.start(t);o.stop(t+len+.1);});
    noise(t,.03,'bandpass',f*2,4,vol*.03,PIANO);}            // petit bruit de feutre
  function chord(notes,t,vol){notes.forEach((n,i)=>piano(n,t+i*.045+rnd()*.01,vol*(i===0?1:.75),6));}
  function balafon(n,t,vol){const f=midi(n);
    [[1,1,.55],[3.93,.22,.12],[9.6,.06,.05]].forEach(([m,v,d])=>{const o=osc('sine',f*m,t,BALA,g=>{g.setValueAtTime(0,t);g.linearRampToValueAtTime(vol*v,t+.003);g.exponentialRampToValueAtTime(.0001,t+d);});o.start(t);o.stop(t+d+.05);});
    noise(t,.05,'bandpass',f*1.5,6,vol*.10,BALA);              // attaque de la mailloche
    const bz=osc('sawtooth',f*.5,t,BALA,g=>{g.setValueAtTime(0,t);g.linearRampToValueAtTime(vol*.018,t+.01);g.exponentialRampToValueAtTime(.0001,t+.22);});bz.start(t);bz.stop(t+.3);} // léger bourdonnement de calebasse
  function drum(t,vol,low){const f0=low?118:165;
    const o=osc('sine',f0*1.6,t,DRUM,g=>{g.setValueAtTime(0,t);g.linearRampToValueAtTime(vol,t+.005);g.exponentialRampToValueAtTime(.0001,t+(low?.55:.3));});
    o.frequency.exponentialRampToValueAtTime(f0,t+.08);o.start(t);o.stop(t+.6);
    noise(t,low?.08:.05,'bandpass',low?700:1300,1.2,vol*.35,DRUM);}
  function flute(n,t,dur,vol,slide){const f=midi(n);
    const o=osc('sine',f,t,FLUTE,g=>{g.setValueAtTime(0,t);g.linearRampToValueAtTime(vol,t+.18);g.setValueAtTime(vol,t+dur-.35);g.linearRampToValueAtTime(0,t+dur);});
    if(slide)o.frequency.setValueAtTime(midi(n+slide),t),o.frequency.exponentialRampToValueAtTime(f,t+.16);
    const lfo=ctx.createOscillator(),lg=ctx.createGain();lfo.frequency.value=5.2;lg.gain.setValueAtTime(0,t);lg.gain.linearRampToValueAtTime(f*.006,t+.5);lfo.connect(lg).connect(o.frequency);lfo.start(t);lfo.stop(t+dur);
    const h=osc('sine',f*2,t,FLUTE,g=>{g.setValueAtTime(0,t);g.linearRampToValueAtTime(vol*.12,t+.2);g.linearRampToValueAtTime(0,t+dur);});h.start(t);h.stop(t+dur+.05);
    o.start(t);o.stop(t+dur+.05);
    const n2=ctx.createBufferSource();n2.buffer=noiseBuf;const bp=ctx.createBiquadFilter();bp.type='bandpass';bp.frequency.value=f*2;bp.Q.value=2;const g2=ctx.createGain();
    g2.gain.setValueAtTime(0,t);g2.gain.linearRampToValueAtTime(vol*.09,t+.08);g2.gain.linearRampToValueAtTime(vol*.03,t+.4);g2.gain.linearRampToValueAtTime(0,t+dur);n2.connect(bp).connect(g2).connect(FLUTE);n2.start(t);n2.stop(t+dur+.05);}
  function bell(n,t,vol){const f=midi(n);
    [[1,1,3.2],[2.76,.45,1.6],[5.4,.22,.9],[8.93,.1,.5]].forEach(([m,v,d])=>{const o=osc('sine',f*m,t,BELL,g=>{g.setValueAtTime(0,t);g.linearRampToValueAtTime(vol*v,t+.002);g.exponentialRampToValueAtTime(.0001,t+d);});o.start(t);o.stop(t+d+.05);});}

  /* ---- harmonie (ré majeur, couleurs add9 / maj7) ---- */
  const CH=[[50,57,64,66,69],[47,54,61,62,66],[55,59,62,66,69],[45,52,57,59,64]]; // Dadd9 · Bm9 · Gmaj7(9) · A6sus
  const MOTIF=[[0,78],[1,76],[1.5,74],[2,69],[3.5,71]];                            // motif court (fa# mi ré la si)
  const PENTA=[62,64,66,69,71,74,76,78,81];                                        // ré pentatonique majeure
  let T=.3,ends=0;
  // A : piano seul, puis motif  (2 tours de 4 accords, 1 mesure chacun)
  for(let cyc=0;cyc<4;cyc++){
    CH.forEach((c,i)=>{const t=T+(cyc*4+i)*bar;
      chord(c,t,.11);
      if(cyc>=1&&i%2===0)MOTIF.forEach(([b,n],k)=>{const v=(cyc===3&&k===4)?n+3:n;piano(v,t+b*beat,.075,3.5);});
      // tambour d'eau : à partir du 2e tour, très léger
      if(cyc>=1){drum(t,.16,true);drum(t+1.5*beat,.08,false);if(cyc>=2)drum(t+2.5*beat,.07,false),drum(t+3*beat,.1,true);}
      // balafon : phrases syncopées aux tours 2 et 3
      if(cyc>=2){let d=Math.floor(rnd()*4)+3;[0,.75,1.5,2,2.75,3.25].forEach((b,k)=>{if(rnd()<.72){d+=[-1,1,-2,2,0,1][Math.floor(rnd()*6)];d=Math.max(0,Math.min(8,d));balafon(PENTA[d],t+b*beat,.12);}});}
      ends=t+bar;});
  }
  // flûte : deux phrases rares
  [[T+4*bar+.5*beat,[[74,2.4,-2],[71,1.6,0],[69,3.2,0]]],[T+10*bar,[[76,1.8,-2],[78,1.4,0],[74,3.6,0]]]].forEach(([t0,ph])=>{let t=t0;ph.forEach(([n,d,sl])=>{flute(n,t,d,.07,sl);t+=d*.92;});});
  // cloche en fer : début de chaque tour
  [0,4,8,12].forEach((k,i)=>bell(i%2?81:86,T+k*bar+.02,.05));
  // conclusion : accord final tenu
  chord([50,57,62,66,69,74,78],ends,.1);bell(86,ends+.03,.04);
  return ends+7;
};
