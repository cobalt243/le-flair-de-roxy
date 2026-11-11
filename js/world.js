/* Le Flair de Roxy — monde en blocs : zone 1 « La Falaise aux greniers » (64 × 64 blocs), univers imaginaire.
   Aucune construction sacrée, aucun personnage humain. */
(function(RX){
  const W=64,H=28,D=64;
  const B={AIR:0,SAND:1,GRASS:2,LATERITE:3,ROCK:4,DIG:5,BANCO:6,STRAW:7,BARK:8,LEAF:9,WATER:10,MUD:11};
  const PAL={
    1:["#D2AA72","#CAA16A","#D9B57F"],2:["#BBA45A","#AE9852","#C5AE66"],3:["#A86A42","#9C5F3A"],
    5:["#EFD9A8","#F4E1B6"],6:["#A85E38","#B66B42"],7:["#C8A65E","#B8964F"],8:["#8B7A66","#7C6B58"],9:["#7F8A3E","#8E9A47","#6F7A35"],10:["#5E9BC0","#6AA6C8"],11:["#8A6A48","#7D5F40"]
  };
  const STRATA=["#A9603C","#9A5434","#B87048","#8E4B30","#A35B39"];
  const lin=v=>Math.pow(v,2.2);
  const grid=new Uint8Array(W*H*D);
  const idx=(x,y,z)=>x+W*(z+D*y);
  const get=(x,y,z)=>(x<0||y<0||z<0||x>=W||y>=H||z>=D)?(y<0?B.ROCK:B.AIR):grid[idx(x,y,z)];
  const set=(x,y,z,v)=>{if(x>=0&&y>=0&&z>=0&&x<W&&y<H&&z<D)grid[idx(x,y,z)]=v;};
  const opaque=v=>v!==B.AIR&&v!==B.WATER;

  /* bruit de valeur lissé, déterministe */
  const vn=(x,z)=>{const xi=Math.floor(x),zi=Math.floor(z),xf=x-xi,zf=z-zi;const s=t=>t*t*(3-2*t);
    const h=(a,b)=>RX.hash3(a,7,b);const a=h(xi,zi),b=h(xi+1,zi),c=h(xi,zi+1),d=h(xi+1,zi+1);
    return (a+(b-a)*s(xf))+((c+(d-c)*s(xf))-(a+(b-a)*s(xf)))*s(zf);};

  const CAVE={x0:20,x1:24};
  const edgeRaw=x=>13+Math.round(3*Math.sin(x*.21)+1.5*Math.sin(x*.53+1));
  const CAVE_EZ=edgeRaw(22);
  const edge=x=>(x>=CAVE.x0-1&&x<=CAVE.x1+1)?CAVE_EZ:edgeRaw(x);
  const LEDGE={x0:40,x1:48};
  const heights=new Int16Array(W*D);
  const surface=(x,z)=>heights[x+W*z];

  function generate(){
    grid.fill(0);
    for(let x=0;x<W;x++)for(let z=0;z<D;z++){
      const e=edge(x);let h,top;
      if(z<e){h=19+Math.round(vn(x*.15,z*.15)*3);
        for(let y=0;y<h;y++)set(x,y,z,B.ROCK);heights[x+W*z]=h;continue;}
      h=5+Math.round((vn(x*.08,z*.08)-.5)*2.4);
      const dd=Math.hypot(x-12,z-50);if(dd<9)h+=Math.round(3*(1-dd/9));
      const mare=((x-50)/7)**2+((z-42)/6)**2;
      let water=false;if(mare<1){h=4;water=true;}else if(mare<1.6)h=Math.min(h,5);
      for(let y=0;y<h;y++){let v=y<h-3?B.LATERITE:B.SAND;
        if(y===h-1){v=dd<9?B.SAND:(mare<1.6?B.MUD:(vn(x*.3+9,z*.3)>.45?B.GRASS:B.SAND));}
        set(x,y,z,v);}
      if(water)for(let y=h;y<5;y++)set(x,y,z,B.WATER);
      heights[x+W*z]=h;
    }
    // corniche + éboulis vers la graine 2
    for(let x=LEDGE.x0;x<=LEDGE.x1;x++){const e=edge(x);for(let z=e-3;z<e;z++){for(let y=10;y<H;y++)set(x,y,z,B.AIR);heights[x+W*z]=10;}}
    for(let x=44;x<=47;x++){const e=edge(x);[9,8,7,6].forEach((hh,i)=>{const z=e+i;for(let y=0;y<hh;y++)set(x,y,z,B.ROCK);heights[x+W*z]=Math.max(heights[x+W*z],hh);});}
    // abri creusé dans la falaise, fermé par du sable meuble
    for(let x=CAVE.x0;x<=CAVE.x1;x++)for(let z=CAVE_EZ-6;z<CAVE_EZ-1;z++)for(let y=5;y<=7;y++)set(x,y,z,B.AIR);
    for(let x=CAVE.x0+1;x<=CAVE.x1-1;x++)for(let y=5;y<=6;y++)set(x,y,CAVE_EZ-1,B.DIG);
    for(let x=CAVE.x0;x<=CAVE.x1;x++)for(let z=CAVE_EZ-6;z<CAVE_EZ;z++)set(x,4,z,B.ROCK);
    // greniers en banco à toit conique de paille
    [[29,3],[32,2],[35,4],[31,6]].forEach(([gx,dz])=>{const gz=edge(gx)+dz+1;const base=surface(gx,gz);
      for(let y=0;y<4;y++)for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++)set(gx+a,base+y,gz+b,B.BANCO);
      [[2,4],[1,5],[0,6]].forEach(([r,dy])=>{for(let a=-r;a<=r;a++)for(let b=-r;b<=r;b++)set(gx+a,base+dy,gz+b,B.STRAW);});});
    // baobabs
    const baobab=(bx,bz)=>{const base=surface(bx,bz);
      for(let y=0;y<9;y++)for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){if(y>6&&Math.abs(a)+Math.abs(b)>1)continue;set(bx+a,base+y,bz+b,B.BARK);}
      [[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,-1],[1,-1],[-1,1]].forEach(([dx,dz],k)=>{for(let i=1;i<=3;i++){set(bx+dx*i,base+8+(i>1?1:0),bz+dz*i,B.BARK);}
        for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++)if(RX.hash3(bx+a,k,bz+b)>.35)set(bx+dx*4+a,base+10,bz+dz*4+b,B.LEAF);});};
    baobab(14,30);baobab(38,55);
    // acacias parasols
    [[8,22],[24,58],[57,22],[54,57]].forEach(([ax,az])=>{const base=surface(ax,az);for(let y=0;y<4;y++)set(ax+(y>2?1:0),base+y,az,B.BARK);
      for(let a=-3;a<=3;a++)for(let b=-2;b<=2;b++)if(a*a/12+b*b/5<=1.05)set(ax+1+a,base+4,az+b,B.LEAF);});
    // rochers épars
    [[18,40],[26,48],[40,30],[58,34],[6,36],[33,22]].forEach(([rx,rz])=>{const base=surface(rx,rz);set(rx,base,rz,B.ROCK);if(RX.hash3(rx,1,rz)>.4)set(rx+1,base,rz,B.ROCK);});
  }

  /* ===== Maillage avec occlusion ambiante par sommet ===== */
  const FACES=[
    {n:[1,0,0],c:[[1,0,0],[1,1,0],[1,1,1],[1,0,1]],shade:.8},{n:[-1,0,0],c:[[0,0,1],[0,1,1],[0,1,0],[0,0,0]],shade:.8},
    {n:[0,1,0],c:[[0,1,1],[1,1,1],[1,1,0],[0,1,0]],shade:1},{n:[0,-1,0],c:[[0,0,0],[1,0,0],[1,0,1],[0,0,1]],shade:.55},
    {n:[0,0,1],c:[[1,0,1],[1,1,1],[0,1,1],[0,0,1]],shade:.88},{n:[0,0,-1],c:[[0,0,0],[0,1,0],[1,1,0],[1,0,0]],shade:.88}];
  FACES.forEach(f=>{const [a,b,c]=f.c;const u=[b[0]-a[0],b[1]-a[1],b[2]-a[2]],v=[c[0]-a[0],c[1]-a[1],c[2]-a[2]];
    const cr=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];if(cr[0]*f.n[0]+cr[1]*f.n[1]+cr[2]*f.n[2]<0)f.c.reverse();});
  const AOF=[.5,.68,.84,1];
  function blockColor(v,x,y,z){const n=RX.hash3(x,y,z);
    if(v===B.ROCK)return RX.hex(STRATA[((y>>1)+((x+z)%7===0?1:0))%5]).map(c=>c*(.94+n*.1));
    const p=PAL[v];return RX.hex(p[Math.floor(n*p.length)]).map(c=>c*(.96+n*.06));}
  function buildGeometry(filter,faceTest){
    const pos=[],nor=[],uv=[],col=[],ind=[];let vi=0;
    for(let y=0;y<H;y++)for(let z=0;z<D;z++)for(let x=0;x<W;x++){const v=grid[idx(x,y,z)];if(!filter(v))continue;
      const base=blockColor(v,x,y,z);
      for(const f of FACES){const nb=get(x+f.n[0],y+f.n[1],z+f.n[2]);if(!faceTest(v,nb))continue;
        const ao=[];
        f.c.forEach((c,ci)=>{const ax=[0,1,2].filter(a=>f.n[a]===0);const s=[0,0,0],t=[0,0,0];s[ax[0]]=c[ax[0]]?1:-1;t[ax[1]]=c[ax[1]]?1:-1;
          const L=[x+f.n[0],y+f.n[1],z+f.n[2]];const o=(d)=>opaque(get(L[0]+d[0],L[1]+d[1],L[2]+d[2]))?1:0;
          const s1=o(s),s2=o(t),cc=o([s[0]+t[0],s[1]+t[1],s[2]+t[2]]);const a=v===B.WATER?3:(s1&&s2?0:3-(s1+s2+cc));ao.push(a);
          pos.push(x+c[0],y+c[1],z+c[2]);nor.push(...f.n);uv.push([0,0,1,1][ci],[0,1,1,0][ci]);
          const k=f.shade*AOF[a];col.push(lin(base[0]*k),lin(base[1]*k),lin(base[2]*k));});
        if(ao[0]+ao[2]>ao[1]+ao[3])ind.push(vi,vi+1,vi+2,vi,vi+2,vi+3);else ind.push(vi+1,vi+2,vi+3,vi+1,vi+3,vi);vi+=4;}}
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(nor,3));
    g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setAttribute('color',new THREE.Float32BufferAttribute(col,3));g.setIndex(ind);g.computeBoundingSphere();return g;}

  RX.createWorld=function(scene,texture){
    generate();
    const mat=new THREE.MeshLambertMaterial({map:texture,vertexColors:true});
    const wmat=new THREE.MeshLambertMaterial({color:new THREE.Color("#3F7FA6").convertSRGBToLinear(),transparent:true,opacity:.78,map:texture});
    let mesh=null,water=null;
    function rebuild(){
      if(mesh){scene.remove(mesh);mesh.geometry.dispose();}
      mesh=new THREE.Mesh(buildGeometry(v=>opaque(v),(v,nb)=>!opaque(nb)),mat);mesh.castShadow=true;mesh.receiveShadow=true;scene.add(mesh);
      if(!water){water=new THREE.Mesh(buildGeometry(v=>v===B.WATER,(v,nb)=>nb===B.AIR),wmat);water.position.y=-.12;water.receiveShadow=true;scene.add(water);}
    }
    rebuild();
    // touffes d'herbe animées
    const tufts=[];for(let x=1;x<W-1;x++)for(let z=1;z<D-1;z++){const h=surface(x,z);if(get(x,h-1,z)===B.GRASS&&get(x,h,z)===B.AIR&&RX.hash3(x,3,z)>.82)tufts.push([x+.2+RX.hash3(x,4,z)*.6,h,z+.2+RX.hash3(x,5,z)*.6,RX.hash3(x,6,z)]);}
    const tg=new THREE.BoxGeometry(.1,.42,.1);tg.translate(0,.21,0);
    const tm=new THREE.InstancedMesh(tg,new THREE.MeshLambertMaterial({map:texture}),tufts.length*2);const cc=new THREE.Color(),o=new THREE.Object3D();
    tufts.forEach((t,i)=>{cc.set(t[3]>.5?"#B5A04F":"#A69347").convertSRGBToLinear();tm.setColorAt(i*2,cc);cc.set("#C2AE5C").convertSRGBToLinear();tm.setColorAt(i*2+1,cc);});
    tm.castShadow=false;tm.receiveShadow=true;tm.frustumCulled=false;scene.add(tm);
    function animateTufts(t,wind){tufts.forEach((p,i)=>{const sway=Math.sin(t*2.2+p[0]*.7+p[2]*.5)*.18*wind;
      o.position.set(p[0],p[1],p[2]);o.rotation.set(sway,0,sway*.6);o.scale.set(1,.8+p[3]*.6,1);o.updateMatrix();tm.setMatrixAt(i*2,o.matrix);
      o.position.set(p[0]+.12,p[1],p[2]-.08);o.rotation.set(sway*.8,0,-sway*.5);o.scale.set(1,.6+p[3]*.5,1);o.updateMatrix();tm.setMatrixAt(i*2+1,o.matrix);});tm.instanceMatrix.needsUpdate=true;}
    return {
      W,H,D,B,get,surface,edge,CAVE,CAVE_EZ,LEDGE,
      solid:(x,y,z)=>opaque(get(Math.floor(x),Math.floor(y),Math.floor(z))),
      water:(x,y,z)=>get(Math.floor(x),Math.floor(y),Math.floor(z))===B.WATER,
      isDig:(x,y,z)=>get(x,y,z)===B.DIG,
      dig(x,y,z){if(get(x,y,z)!==B.DIG)return false;set(x,y,z,B.AIR);if(get(x,y+1,z)===B.DIG)set(x,y+1,z,B.AIR);if(get(x,y-1,z)===B.DIG)set(x,y-1,z,B.AIR);rebuild();return true;},
      removeKeys(keys){keys.forEach(k=>{const [x,y,z]=k.split(',').map(Number);if(get(x,y,z)===B.DIG)set(x,y,z,B.AIR);});rebuild();},
      groundY(x,z){const xi=Math.floor(x),zi=Math.floor(z);for(let y=H-1;y>=0;y--)if(opaque(get(xi,y,zi)))return y+1;return 0;},
      animateTufts,mesh:()=>mesh,waterMesh:()=>water
    };
  };
})(window.RX);
