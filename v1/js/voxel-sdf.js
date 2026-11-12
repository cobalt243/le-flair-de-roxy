/* Le Flair de Roxy — outils de modélisation voxel.
   Les personnages sont décrits par des volumes implicites (ellipsoïdes, capsules, boîtes arrondies),
   échantillonnés sur une grille de cubes. Seuls les cubes visibles sont conservés et regroupés par partie animable. */
window.RX = window.RX || {};
(function(RX){
  RX.sdf = {
    ell(p,c,r){const x=(p[0]-c[0])/r[0],y=(p[1]-c[1])/r[1],z=(p[2]-c[2])/r[2];const k0=Math.hypot(x,y,z),k1=Math.hypot(x/r[0],y/r[1],z/r[2]);return k0*(k0-1)/(k1||1e-6);},
    cap(p,a,b,r){const pa=[p[0]-a[0],p[1]-a[1],p[2]-a[2]],ba=[b[0]-a[0],b[1]-a[1],b[2]-a[2]];const h=Math.max(0,Math.min(1,(pa[0]*ba[0]+pa[1]*ba[1]+pa[2]*ba[2])/(ba[0]*ba[0]+ba[1]*ba[1]+ba[2]*ba[2])));return Math.hypot(pa[0]-ba[0]*h,pa[1]-ba[1]*h,pa[2]-ba[2]*h)-r;},
    rbox(p,c,h,r){const q=[Math.abs(p[0]-c[0])-h[0],Math.abs(p[1]-c[1])-h[1],Math.abs(p[2]-c[2])-h[2]];return Math.hypot(Math.max(q[0],0),Math.max(q[1],0),Math.max(q[2],0))+Math.min(Math.max(q[0],q[1],q[2]),0)-r;},
    smin(a,b,k){const h=Math.max(k-Math.abs(a-b),0)/k;return Math.min(a,b)-h*h*k*.25;}
  };
  RX.hash3=(i,j,k)=>{let h=(i*374761393+j*668265263+k*2147483647)|0;h=(h^(h>>>13))*1274126177;return ((h^(h>>>16))>>>0)/4294967295;};
  RX.hex=h=>[1,3,5].map(n=>parseInt(h.slice(n,n+2),16)/255);
  RX.mix=(a,b,t)=>a.map((v,n)=>v+(b[n]-v)*t);

  /* Texture originale 8×8 : arête de cube légèrement plus sombre */
  RX.edgeTexture=function(edge=236,base=246,spread=9){
    const c=document.createElement('canvas');c.width=c.height=8;const g=c.getContext('2d');let s=7;
    for(let y=0;y<8;y++)for(let x=0;x<8;x++){s=(s*9301+49297)%233280;const e=x===0||y===0||x===7||y===7;const v=e?edge:Math.round(base+(s/233280)*spread);g.fillStyle=`rgb(${v},${v},${v})`;g.fillRect(x,y,1,1);}
    const t=new THREE.CanvasTexture(c);t.magFilter=t.minFilter=THREE.NearestFilter;t.encoding=THREE.sRGBEncoding;return t;
  };

  /* Construit un modèle voxel.
     opts: {prims:[{part,reg,fold,f}], pivots:{part:[x,y,z]}, bounds:[x0,x1,y0,y1,z0,z1], vs, fold(p,prim)->{s,amp}, color(p,r,n)->[r,g,b], material, blendK} */
  RX.buildVoxelModel=function(opts){
    const {prims,pivots,bounds,vs}=opts;const [X0,X1,Y0,Y1,Z0,Z1]=bounds;const K=opts.blendK||.07;
    const NX=Math.ceil((X1-X0)/vs),NY=Math.ceil((Y1-Y0)/vs),NZ=Math.ceil((Z1-Z0)/vs);
    const solid=new Uint8Array(NX*NY*NZ),info=new Array(NX*NY*NZ);const id=(i,j,k)=>i+NX*(j+NY*k);
    const hard=opts.hard||[];
    for(let k=0;k<NZ;k++)for(let j=0;j<NY;j++)for(let i=0;i<NX;i++){
      const p=[X0+(i+.5)*vs,Y0+(j+.5)*vs,Z0+(k+.5)*vs];let d=1e9,best=null,bd=1e9;
      for(const q of prims){const v=q.f(p);if(v<bd){bd=v;best=q;}d=hard.includes(q.reg)?Math.min(d,v):RX.sdf.smin(d,v,K);}
      if(d>.12)continue;
      const fo=opts.fold?opts.fold(p,best):{s:0,amp:0};const dd=d-fo.amp*fo.s;
      if(dd<0){solid[id(i,j,k)]=1;info[id(i,j,k)]={q:best,s:fo.amp?fo.s:0};}
    }
    const sol=(i,j,k)=>i>=0&&j>=0&&k>=0&&i<NX&&j<NY&&k<NZ&&solid[id(i,j,k)];
    const groups={};let count=0;
    for(let k=0;k<NZ;k++)for(let j=0;j<NY;j++)for(let i=0;i<NX;i++){
      if(!solid[id(i,j,k)])continue;
      if(sol(i+1,j,k)&&sol(i-1,j,k)&&sol(i,j+1,k)&&sol(i,j-1,k)&&sol(i,j,k+1)&&sol(i,j,k-1))continue;
      const r=info[id(i,j,k)],p=[X0+(i+.5)*vs,Y0+(j+.5)*vs,Z0+(k+.5)*vs];
      let col=opts.color(p,r,RX.hash3(i,j,k));
      let occ=0;for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++)for(let c=-1;c<=1;c++)if((a||b||c)&&sol(i+a,j+b,k+c))occ++;
      const ao=1-Math.max(0,occ-9)/17*(opts.ao??.3);col=col.map(v=>v*ao);
      (groups[r.q.part]||(groups[r.q.part]=[])).push([p,col]);count++;
    }
    const parts={},geo=new THREE.BoxGeometry(vs,vs,vs),tmp=new THREE.Object3D(),cc=new THREE.Color();
    Object.keys(pivots).forEach(k=>{
      const g=new THREE.Group();const pv=pivots[k];g.position.set(pv[0],pv[1],pv[2]);parts[k]=g;
      const list=groups[k]||[];if(!list.length)return;
      const m=new THREE.InstancedMesh(geo,opts.material,list.length);m.castShadow=true;m.receiveShadow=true;
      list.forEach(([p,col],n)=>{tmp.position.set(p[0]-pv[0],p[1]-pv[1],p[2]-pv[2]);tmp.updateMatrix();m.setMatrixAt(n,tmp.matrix);cc.setRGB(col[0],col[1],col[2]).convertSRGBToLinear();m.setColorAt(n,cc);});
      g.add(m);
    });
    return {parts,count};
  };
})(window.RX);
