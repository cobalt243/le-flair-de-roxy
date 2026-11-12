/* Le Flair de Roxy — animaux en voxels.
   Éléphant, agame (lézard des rochers), singe patas, calao à bec rouge, vautour charognard, tortue sillonnée. */
(function(RX){
  const {ell,cap}=RX.sdf;
  const H=RX.hex,mix=RX.mix;

  /* Fabrique générique : spec = {prims(add), pivots, bounds, vs, scale, color(reg,p,n)} */
  function critter(material,spec,quality){
    const P=[],add=(part,reg,f)=>P.push({part,reg,fold:reg,f});spec.prims(add);
    const vs=spec.vs*(quality==='low'?1.25:1);
    const built=RX.buildVoxelModel({prims:P,pivots:spec.pivots,bounds:spec.bounds,vs,material,hard:spec.hard||[],ao:.3,blendK:spec.k||.05,
      fold:spec.fold||(()=>({s:0,amp:0})),color:(p,r,n)=>spec.color(r.q.reg,p,n,r.s)});
    const object=new THREE.Group(),root=new THREE.Group();object.add(root);root.scale.setScalar(spec.scale);
    Object.entries(built.parts).forEach(([k,g])=>{const parent=spec.parent&&spec.parent[k];if(parent){built.parts[parent].add(g);g.position.sub(built.parts[parent].position);}else root.add(g);});
    return {object,root,parts:built.parts,count:built.count};
  }
  const eye=(p,e,r=.035)=>Math.hypot(p[0]-e[0],p[1]-e[1],p[2]-e[2])<r;

  /* ===== Éléphant ===== */
  RX.createElephant=function(material,quality){
    const C={G:H("#8F8A84"),GL:H("#A6A098"),GD:H("#6E6964"),EI:H("#A08B84"),TU:H("#EDE3C8"),E:H("#1A1412"),W:H("#F4F1EA"),NA:H("#D5CBB4")};
    const EYES=[[-.36,2.4,1.28],[.36,2.4,1.28]];
    return critter(material,{scale:.85,vs:.085,k:.12,hard:["tusk"],bounds:[-1.05,1.05,0,3.05,-1.55,1.9],
      pivots:{body:[0,0,0],head:[0,2.3,.7],earL:[-.55,2.35,.78],earR:[.55,2.35,.78],trunk:[0,2.1,1.3]},parent:{earL:'head',earR:'head',trunk:'head'},
      prims(add){add("body","skin",p=>ell(p,[0,1.9,-.2],[.75,.8,1.1]));add("head","skin",p=>ell(p,[0,2.3,.95],[.52,.56,.5]));add("head","skin",p=>ell(p,[0,2.62,.85],[.36,.24,.34]));
        [-1,1].forEach(s=>add(s<0?"earL":"earR","ear",p=>ell(p,[.68*s,2.3,.82],[.09,.58,.48])));
        const tp=[[0,2.05,1.38],[0,1.7,1.55],[0,1.35,1.6],[0,1.0,1.55],[0,.78,1.45]];for(let i=1;i<tp.length;i++){const A=tp[i-1],B=tp[i],r=.17-.025*i;add("trunk","trunk",p=>cap(p,A,B,r));}
        [-1,1].forEach(s=>add("head","tusk",p=>cap(p,[.2*s,1.85,1.32],[.24*s,1.55,1.62],.05)));
        [[-.42,.45],[.42,.45],[-.42,-.75],[.42,-.75]].forEach(([x,z])=>{add("body","skin",p=>cap(p,[x,1.45,z],[x,.2,z+.02],.26));add("body","foot",p=>ell(p,[x,.12,z+.05],[.29,.13,.3]));});
        add("body","skin",p=>cap(p,[0,2.0,-1.25],[0,1.35,-1.42],.045));},
      fold:(p,q)=>q.reg==="trunk"?{s:Math.sin(p[1]*42),amp:.02}:q.reg==="skin"?{s:Math.sin(p[1]*18+p[2]*4),amp:.012}:{s:0,amp:0},
      color(reg,p,n,s){let c=mix(C.G,n>.5?C.GL:C.GD,Math.abs(n-.5)*.5);if(s>.4)c=mix(c,C.GL,.4);else if(s<-.4)c=mix(c,C.GD,.5);
        if(reg==="tusk")c=C.TU;if(reg==="ear"&&p[2]>.95)c=mix(c,C.EI,.5);if(reg==="foot"&&p[1]<.1&&Math.sin(p[0]*28)>.6)c=C.NA;
        EYES.forEach(e=>{if(eye(p,e,.08))c=C.E;if(eye(p,[e[0]*.97,e[1]+.03,e[2]+.02],.03))c=C.W;});return c;}},quality);
  };

  /* ===== Agame (lézard des rochers) : corps indigo, tête orangée ===== */
  RX.createAgama=function(material,quality){
    const C={B:H("#3E5BA6"),BL:H("#5B79C2"),BD:H("#2C437E"),O:H("#E2652C"),OL:H("#F08A4B"),T:H("#D9763A"),E:H("#111111"),Y:H("#F2D04B")};
    return critter(material,{scale:.85,vs:.04,bounds:[-.5,.5,0,.75,-1.75,1.0],pivots:{body:[0,0,0],head:[0,.42,.5]},
      prims(add){add("body","body",p=>ell(p,[0,.33,0],[.27,.19,.55]));add("head","head",p=>ell(p,[0,.46,.66],[.19,.16,.25]));
        add("body","tail",p=>cap(p,[0,.3,-.45],[0,.24,-1.05],.1));add("body","tail",p=>cap(p,[0,.24,-1.05],[.12,.12,-1.6],.065));
        [[.3,.3],[-.3,.3],[.3,-.33],[-.3,-.33]].forEach(([x,z])=>add("body","leg",p=>cap(p,[x*.8,.3,z],[x*1.3,.05,z+.08*Math.sign(z)],.06)));},
      color(reg,p,n){let c;if(reg==="head")c=mix(C.O,C.OL,n*.6);else if(reg==="tail")c=mix(C.T,C.OL,n*.4);else c=mix(C.B,n>.6?C.BL:C.BD,Math.abs(n-.5)*.7);
        if(reg==="body"&&p[1]>.48&&Math.sin(p[2]*30)>.7)c=mix(c,C.Y,.25);
        if(eye(p,[.14,.53,.74],.04)||eye(p,[-.14,.53,.74],.04))c=C.E;return c;}},quality);
  };

  /* ===== Singe patas, assis : dos roux, ventre et moustache blancs ===== */
  RX.createPatas=function(material,quality){
    const C={R:H("#B8653A"),RL:H("#CF7C4C"),RD:H("#94502D"),W:H("#EEE7DB"),F:H("#3E3532"),E:H("#120D0B"),N:H("#2A2220")};
    return critter(material,{scale:.95,vs:.04,bounds:[-.55,.55,0,1.6,-.95,.6],pivots:{body:[0,0,0],head:[0,1.12,.06],tail:[0,.45,-.25]},
      prims(add){add("body","fur",p=>ell(p,[0,.72,-.02],[.29,.4,.25]));add("head","fur",p=>ell(p,[0,1.3,.06],[.22,.22,.2]));
        add("head","face",p=>ell(p,[0,1.27,.22],[.15,.15,.08]));add("head","beard",p=>ell(p,[0,1.17,.24],[.15,.06,.07]));
        [-1,1].forEach(s=>{add("body","fur",p=>ell(p,[.19*s,.33,.12],[.12,.13,.3]));add("body","limb",p=>cap(p,[.27*s,.98,.04],[.22*s,.45,.32],.07));add("body","limb",p=>cap(p,[.17*s,.22,.35],[.17*s,.05,.45],.065));});
        add("tail","fur",p=>cap(p,[0,.42,-.24],[.18,.08,-.85],.055));},
      color(reg,p,n){let c=mix(C.R,n>.5?C.RL:C.RD,Math.abs(n-.5)*.6);
        if(reg==="fur"&&p[2]>.12&&p[1]>.45&&p[1]<1.0)c=C.W;if(reg==="limb")c=mix(C.W,C.R,p[1]>.8?.6:0);
        if(reg==="face")c=C.F;if(reg==="beard")c=C.W;
        if(eye(p,[.07,1.33,.27],.03)||eye(p,[-.07,1.33,.27],.03))c=C.E;if(eye(p,[0,1.25,.3],.03))c=C.N;return c;}},quality);
  };

  /* ===== Calao à bec rouge : dos gris tacheté, ventre blanc, bec rouge courbé ===== */
  RX.createHornbill=function(material,quality){
    const C={G:H("#6E635B"),GD:H("#4E4540"),W:H("#F1ECE3"),R:H("#D3372B"),RD:H("#A8261E"),E:H("#E8C33A"),K:H("#151111"),L:H("#8A8A86")};
    return critter(material,{scale:1.0,vs:.035,bounds:[-.4,.4,0,1.05,-.95,.85],pivots:{body:[0,0,0],head:[0,.78,.18],wingL:[-.18,.68,.05],wingR:[.18,.68,.05]},parent:{},
      prims(add){add("body","body",p=>ell(p,[0,.5,0],[.21,.23,.35]));add("head","head",p=>ell(p,[0,.86,.22],[.13,.13,.14]));
        add("head","bill",p=>cap(p,[0,.86,.32],[0,.82,.52],.055));add("head","bill",p=>cap(p,[0,.82,.52],[0,.72,.68],.035));
        [-1,1].forEach(s=>add(s<0?"wingL":"wingR","wing",p=>ell(p,[.19*s,.55,-.06],[.06,.17,.31])));
        add("body","tail",p=>cap(p,[0,.42,-.3],[0,.32,-.85],.065));
        [-1,1].forEach(s=>add("body","leg",p=>cap(p,[.07*s,.3,.02],[.07*s,.0,.05],.025)));},
      color(reg,p,n){let c;if(reg==="bill")c=mix(C.R,C.RD,p[1]<.8?.5:0);else if(reg==="leg")c=C.L;
        else if(reg==="wing"||reg==="tail"){c=C.GD;if(Math.sin(p[1]*60)*Math.sin(p[2]*55)>.55)c=C.W;if(reg==="tail"&&p[2]<-.75)c=C.W;}
        else if(reg==="body"){c=p[2]>.05&&p[1]<.6?C.W:mix(C.G,C.GD,n*.5);}else{c=mix(C.W,C.G,p[1]>.92?.5:0);if(Math.abs(p[0])>.09&&p[1]>.84&&p[1]<.9)c=C.GD;}
        if(eye(p,[.11,.89,.27],.028)||eye(p,[-.11,.89,.27],.028))c=C.E;if(eye(p,[.12,.89,.28],.013)||eye(p,[-.12,.89,.28],.013))c=C.K;return c;}},quality);
  };

  /* ===== Vautour charognard : plumage brun, tête rose nue, collerette claire ===== */
  RX.createVulture=function(material,quality){
    const C={B:H("#4B3B2F"),BD:H("#33281F"),BL:H("#64503F"),R:H("#A28B76"),P:H("#DDA89A"),PB:H("#C98D80"),K:H("#4A4A4A"),E:H("#111111")};
    return critter(material,{scale:1.05,vs:.045,bounds:[-.75,.75,0,1.4,-.85,.65],pivots:{body:[0,0,0],head:[0,1.0,.15],wingL:[-.26,.98,0],wingR:[.26,.98,0]},
      prims(add){add("body","body",p=>ell(p,[0,.7,0],[.3,.38,.38]));add("body","ruff",p=>ell(p,[0,.98,.12],[.2,.13,.17]));
        add("head","head",p=>ell(p,[0,1.16,.27],[.11,.12,.13]));add("head","bill",p=>cap(p,[0,1.15,.37],[0,1.07,.47],.035));
        [-1,1].forEach(s=>add(s<0?"wingL":"wingR","wing",p=>ell(p,[.3*s,.74,-.06],[.08,.34,.42])));
        add("body","body",p=>cap(p,[0,.5,-.32],[0,.36,-.72],.08));
        [-1,1].forEach(s=>add("body","leg",p=>cap(p,[.12*s,.36,.05],[.12*s,.0,.1],.04)));},
      color(reg,p,n){let c=mix(C.B,n>.5?C.BL:C.BD,Math.abs(n-.5)*.6);if(reg==="ruff")c=mix(C.R,C.BL,n*.4);
        if(reg==="head")c=mix(C.P,C.PB,n*.5);if(reg==="bill"||reg==="leg")c=C.K;
        if(reg==="wing"&&p[1]<.5)c=C.BD;if(eye(p,[.08,1.2,.35],.025)||eye(p,[-.08,1.2,.35],.025))c=C.E;return c;}},quality);
  };

  /* ===== Tortue sillonnée : carapace sable à écailles cerclées ===== */
  RX.createTortoise=function(material,quality){
    const C={S:H("#C9A46A"),SL:H("#DAB880"),SD:H("#8C6A3A"),K:H("#A88A62"),KD:H("#8A6F4C"),E:H("#111111")};
    return critter(material,{scale:1.0,vs:.045,bounds:[-.75,.75,0,.9,-.85,1.15],pivots:{body:[0,0,0],head:[0,.32,.62]},
      prims(add){add("body","shell",p=>ell(p,[0,.42,0],[.56,.37,.68]));add("body","rim",p=>ell(p,[0,.24,0],[.6,.1,.72]));
        add("head","head",p=>ell(p,[0,.36,.86],[.15,.13,.2]));add("head","neck",p=>cap(p,[0,.3,.55],[0,.34,.78],.11));
        [[.42,.42],[-.42,.42],[.42,-.42],[-.42,-.42]].forEach(([x,z])=>add("body","leg",p=>ell(p,[x,.14,z],[.15,.16,.15])));},
      color(reg,p,n){let c;
        if(reg==="shell"||reg==="rim"){c=mix(C.S,C.SL,n*.5);const g=Math.abs(Math.sin(p[0]*7.5))<.18||Math.abs(Math.sin(p[2]*6))<.16;if(g)c=C.SD;if(reg==="rim")c=mix(c,C.SD,.3);}
        else{c=mix(C.K,C.KD,n*.6);}
        if(eye(p,[.1,.42,.98],.028)||eye(p,[-.1,.42,.98],.028))c=C.E;return c;}},quality);
  };

  /* ===== Animations d'attente (et pendant le dialogue) ===== */
  RX.animateCritter=function(kind,M,t,talking){const p=M.parts;
    if(kind==="elephant"){const k=talking?1.6:1;p.earL.rotation.y=-.15-Math.max(0,Math.sin(t*1.7*k))*.35;p.earR.rotation.y=.15+Math.max(0,Math.sin(t*1.7*k+.4))*.35;
      p.trunk.rotation.x=(talking?-.35:0)+Math.sin(t*1.1)*.12;p.trunk.rotation.z=Math.sin(t*.8)*.1;p.head.rotation.x=talking?Math.sin(t*4)*.05:Math.sin(t*.5)*.03;M.root.position.y=Math.sin(t*1.2)*.01;}
    if(kind==="agama"){const pu=Math.max(0,Math.sin(t*(talking?5:2.4)));M.root.position.y=pu*pu*.07;p.head.rotation.x=-pu*.25;}
    if(kind==="patas"){p.head.rotation.y=Math.sin(t*.7)*.5;p.head.rotation.x=talking?Math.sin(t*5)*.08:0;p.tail.rotation.z=Math.sin(t*1.3)*.3;}
    if(kind==="hornbill"){p.head.rotation.z=Math.sin(t*1.1)*.25;p.head.rotation.x=talking?Math.sin(t*6)*.12:0;const f=Math.max(0,Math.sin(t*.9))**8;p.wingL.rotation.z=-f*.9;p.wingR.rotation.z=f*.9;M.root.position.y=f*.1;}
    if(kind==="vulture"){const f=(Math.max(0,Math.sin(t*.45))**6)*(talking?1:.8);p.wingL.rotation.z=-f*1.2;p.wingR.rotation.z=f*1.2;p.head.rotation.x=Math.sin(t*1.5)*.08+(talking?Math.sin(t*5)*.06:0);}
    if(kind==="tortoise"){p.head.position.z=.62*M.root.scale.x*0+.62+(talking?.05:Math.sin(t*.6)*.06);p.head.rotation.y=Math.sin(t*.4)*.3;}
  };
})(window.RX);
