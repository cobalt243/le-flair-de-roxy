/* Le Flair de Roxy — modèle voxel de Roxy (Shar-Peï) et ses animations.
   Référence : photo originale de Roxy + style validé (v0.3, « légèrement moins pixelisé »). */
(function(RX){
  const {ell,cap,rbox}=RX.sdf;
  const C={F:RX.hex("#C9975C"),L:RX.hex("#DDB077"),S:RX.hex("#9C6B3E"),Cr:RX.hex("#E0BE8C"),D:RX.hex("#5A473E"),D2:RX.hex("#4C3C35"),N:RX.hex("#151111"),M:RX.hex("#6B4A33"),R:RX.hex("#8D5A33"),R2:RX.hex("#6E4426"),T:RX.hex("#4A2E1C"),E:RX.hex("#120D0B"),W:RX.hex("#F4F1EA")};
  const EYES=[[-.17,1.79,1.14],[.17,1.79,1.14]];
  const PIV={body:[0,0,0],head:[0,1.4,.6],tail:[0,1.22,-.86],legFL:[-.24,.95,.45],legFR:[.24,.95,.45],legBL:[-.27,1.0,-.66],legBR:[.27,1.0,-.66]};

  function prims(){
    const P=[],add=(part,reg,fold,f)=>P.push({part,reg,fold,f});
    add("body","fur","torso",p=>ell(p,[0,1.0,-.15],[.42,.36,.74]));
    add("body","chest","torso",p=>ell(p,[0,.93,.42],[.4,.42,.38]));
    add("body","fur","neck",p=>ell(p,[0,1.3,.62],[.39,.4,.32]));
    add("body","chest","neck",p=>ell(p,[0,1.08,.74],[.3,.28,.24]));
    add("head","fur","head",p=>ell(p,[0,1.72,.82],[.43,.38,.38]));
    [-1,1].forEach(s=>{add("head","fur","brow",p=>ell(p,[.17*s,1.88,1.06],[.15,.07,.1]));add("head","fur","cheek",p=>ell(p,[.28*s,1.5,.98],[.2,.29,.24]));});
    add("head","muzzle","none",p=>rbox(p,[0,1.48,1.22],[.18,.14,.17],.07));
    add("head","muzzle","none",p=>rbox(p,[0,1.34,1.14],[.21,.06,.14],.06));
    add("head","nose","none",p=>rbox(p,[0,1.6,1.44],[.12,.06,.05],.02));
    [-1,1].forEach(s=>{add("head","ear","none",p=>rbox(p,[.31*s,2.03,.76],[.12,.05,.11],.02));add("head","ear","none",p=>rbox(p,[.34*s,1.93,.88],[.1,.08,.035],.02));});
    [-1,1].forEach(s=>{const k=s<0?"legFL":"legFR";add(k,"fur","leg",p=>cap(p,[.24*s,.95,.42],[.24*s,.12,.5],.14));add(k,"paw","none",p=>ell(p,[.24*s,.07,.57],[.15,.075,.19]));});
    [-1,1].forEach(s=>{const k=s<0?"legBL":"legBR";add(k,"fur","thigh",p=>ell(p,[.27*s,.78,-.66],[.18,.33,.29]));add(k,"fur","leg",p=>cap(p,[.27*s,.55,-.8],[.27*s,.12,-.72],.125));add(k,"paw","none",p=>ell(p,[.27*s,.07,-.64],[.14,.07,.18]));});
    let prev=null;for(let i=0;i<=10;i++){const t=i/10,a=-2.1+t*4.6,R=.24-.08*t;const pt=[.05*t,1.42+Math.sin(a)*R+.12*(1-t),-.86+Math.cos(a)*R*.9];
      if(prev){const A=prev,B=pt,r=.095-.035*t;add("tail","fur","tail",p=>cap(p,A,B,r));}prev=pt;}
    return P;
  }
  function fold(p,q){const [x,y,z]=p;let s=0,amp=0;
    switch(q.fold){
      case"torso":s=Math.sin(z*11+y*1.5);amp=.055*Math.max(0,Math.min(1,(y-.62)/.3));break;
      case"neck":s=Math.sin((y*.85+z*.55)*16);amp=.055;break;
      case"head":if(z>.66&&y>1.68){s=Math.sin(y*26-Math.abs(x)*4);amp=.04;}else{s=Math.sin(z*14+y*5);amp=.03;}break;
      case"brow":s=Math.sin(y*60);amp=.012;break;
      case"cheek":s=Math.sin(x*15+y*8);amp=.045;break;
      case"thigh":s=Math.sin(y*15+z*6);amp=.03;break;
      case"leg":s=Math.sin(y*18);amp=y>.5?.02:.008;break;
      case"tail":s=Math.sin(z*40);amp=.008;break;}
    return {s,amp:amp*.8};}
  function color(p,r,n){const reg=r.q.reg,mix=RX.mix;let col;
    if(reg==="muzzle")col=mix(C.D,C.D2,n*.8);
    else if(reg==="nose")col=mix(C.N,C.D,p[1]>1.63?.35:n*.15);
    else if(reg==="ear")col=mix(C.R,C.R2,n*.5+(p[2]>.86?.3:0));
    else{col=reg==="chest"?mix(C.F,C.Cr,.45):C.F;
      if(r.s>.3)col=mix(col,C.L,.45);else if(r.s<-.45)col=mix(col,C.S,.75);else if(r.s<-.1)col=mix(col,C.S,.3);
      col=mix(col,n>.5?C.L:C.S,Math.abs(n-.5)*.08);
      if(r.q.part==="head"){const dm=Math.hypot(p[0],(p[1]-1.5)*1.2,(p[2]-1.18)*1.1);if(dm<.42&&p[2]>.98)col=mix(col,C.M,Math.min(1,(.42-dm)/.16)*.85);
        EYES.forEach(e=>{const de=Math.hypot(p[0]-e[0],p[1]-e[1],p[2]-e[2]);if(de<.12)col=mix(col,C.M,(.12-de)/.12*.9);});}
      if(reg==="paw"){const toe=Math.sin(p[0]*62);const front=r.q.part.startsWith("legF")?p[2]>.62:p[2]>-.56;if(front&&toe>.55&&p[1]<.12)col=C.T;else col=mix(col,C.L,.12);}}
    EYES.forEach(e=>{if(Math.hypot(p[0]-e[0],p[1]-e[1],(p[2]-e[2])*.8)<.068)col=C.E;});
    EYES.forEach(e=>{if(Math.hypot(p[0]-(e[0]+.018),p[1]-(e[1]+.02),p[2]-(e[2]+.02))<.03)col=C.W;});
    return col;}

  /* Crée Roxy. Échelle : 1 unité modèle ≈ 0,46 bloc (Roxy ≈ 1 bloc de haut). */
  RX.createRoxy=function(material,quality){
    const vs=quality==="low"?.05:.04;
    const built=RX.buildVoxelModel({prims:prims(),pivots:PIV,bounds:[-.62,.62,0,2.3,-1.24,1.56],vs,fold,color,material,hard:["nose","ear"],ao:.3});
    const object=new THREE.Group(),root=new THREE.Group(),hips=new THREE.Group(),mover=new THREE.Group();
    object.add(root);hips.position.set(0,1.0,-.66);root.add(hips);mover.position.set(0,-1.0,.66);hips.add(mover);
    Object.entries(built.parts).forEach(([k,g])=>{(k==="legBL"||k==="legBR"?root:mover).add(g);});
    root.scale.setScalar(.46);
    return {object,root,hips,parts:built.parts,count:built.count,cur:{hip:0,y:0,hx:0,hy:0,fl:0,fr:0,bl:0,br:0,tail:0}};
  };

  /* Animation : state ∈ idle, walk, run, air, sniff, sit, lie, happy, dig. speed en blocs/s. */
  RX.animateRoxy=function(R,state,t,dt,speed){
    const T={hip:0,y:0,hx:0,hy:0,fl:0,fr:0,bl:0,br:0,tail:Math.sin(t*6)*.2};
    if(state==="idle"){T.y=Math.sin(t*2)*.006;T.hy=Math.sin(t*.6)*.25;}
    if(state==="walk"){const f=Math.max(4,speed*2.1),w=Math.sin(t*f)*.45;T.fl=w;T.br=w;T.fr=-w;T.bl=-w;T.y=Math.abs(Math.sin(t*f))*.02;T.hx=Math.sin(t*f*2)*.03;T.tail=Math.sin(t*f)*.3;}
    if(state==="run"){const f=Math.max(9,speed*2),w=Math.sin(t*f)*.8;T.fl=w;T.fr=w*.8;T.bl=-w;T.br=-w*.8;T.y=Math.abs(Math.sin(t*f))*.07;T.hip=Math.sin(t*f)*.06;T.hx=-.06;T.tail=.15;}
    if(state==="air"){T.fl=-.6;T.fr=-.5;T.bl=.6;T.br=.5;T.hip=-.08;T.tail=.3;}
    if(state==="sniff"){T.hx=.45+Math.sin(t*16)*.04;T.hy=Math.sin(t*1.6)*.45;T.tail=Math.sin(t*9)*.35;}
    if(state==="dig"){T.hx=.5;T.fl=Math.sin(t*16)*.9-.4;T.fr=Math.sin(t*16+Math.PI)*.9-.4;T.hip=.12;T.tail=Math.sin(t*12)*.4;}
    if(state==="sit"){T.hip=-.4;T.fl=.4;T.fr=.4;T.bl=-1.05;T.br=-1.05;T.y=-.32;T.hx=.12;T.hy=Math.sin(t*.5)*.15;}
    if(state==="lie"){T.y=-.62;T.fl=-1.35;T.fr=-1.35;T.bl=-1.35;T.br=-1.35;T.hx=.25;T.tail=Math.sin(t*1.2)*.1;}
    if(state==="happy"){T.y=Math.abs(Math.sin(t*9))*.25;T.tail=Math.sin(t*22)*.6;T.hx=-.15;T.fl=T.fr=-.3;}
    const c=R.cur,k=Math.min(1,dt*10);for(const n in T)c[n]+=(T[n]-c[n])*(n==="tail"?Math.min(1,dt*20):k);
    R.root.position.y=c.y*.46;R.hips.rotation.x=c.hip;
    R.parts.head.rotation.x=c.hx;R.parts.head.rotation.y=c.hy;R.parts.tail.rotation.z=c.tail;
    R.parts.legFL.rotation.x=c.fl;R.parts.legFR.rotation.x=c.fr;R.parts.legBL.rotation.x=c.bl;R.parts.legBR.rotation.x=c.br;
  };
})(window.RX);
