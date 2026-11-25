// ===== Bully Escape =====
// Asset paths (files live in www/assets)
const MUSIC='assets/music.mp3';
const LOGO='assets/logo.jpg';
const BIMG=["assets/bully1.png", "assets/bully2.png", "assets/bully3.png", "assets/bully4.png"];
const HFRONT='assets/hero_front.png',HBACK='assets/hero_back.png';
const C=document.getElementById('c'),X=C.getContext('2d'),$=id=>document.getElementById(id);
let W,H,S;function rs(){W=C.width=innerWidth;H=C.height=innerHeight}addEventListener('resize',rs);rs();
const WW=2400,WH=960,walls=[],spots=[];
const R=(x,y,w,h)=>walls.push({x,y,w,h});
R(0,0,WW,40);R(0,920,WW,40);R(-20,0,20,WH);R(WW,0,20,WH);
let pv=0,pv2=0;
for(let j=0;j<6;j++){const cx=200+400*j;R(pv,380,cx-45-pv,20);R(pv2,560,cx-45-pv2,20);pv=pv2=cx+45}
R(pv,380,WW-pv,20);R(pv2,560,WW-pv2,20);
for(let j=1;j<6;j++){R(400*j-10,40,20,340);R(400*j-10,580,20,340)}
for(let j=0;j<6;j++){const cx=200+400*j;
 spots.push({x:cx-130,y:428,t:'locker',top:1},{x:cx+130,y:428,t:'locker',top:1},{x:cx-130,y:532,t:'locker'},{x:cx+130,y:532,t:'locker'});
 for(const [dx,y] of [[-110,200],[110,200],[0,300]]){spots.push({x:cx+dx,y,t:'desk'},{x:cx+dx,y:WH-y,t:'desk'})}}
const hitW=(x,y,r)=>walls.some(w=>x+r>w.x&&x-r<w.x+w.w&&y+r>w.y&&y-r<w.y+w.h);
const SK=[{hair:'#2a1a10',shirt:'#c0392b',shorts:'#333',big:1},{hair:'#111',shirt:'#6c3483',shorts:'#222',big:1},{hair:'#d4ac0d',shirt:'#1f618d',shorts:'#444',big:1},{hair:'#5d4037',shirt:'#117a65',shorts:'#2c2c2c',big:1},{hair:'#888',shirt:'#af601a',shorts:'#222',big:1}];
const HERO={hair:'#ff8a1f',shirt:'#8bd450',shorts:'#6b4a2f',glasses:1,stripes:1};
const HI=new Image();HI.src=HFRONT;
function drawI(i,x,y,h,mw){if(!i.complete||!i.naturalWidth)return;let w=h*i.naturalWidth/i.naturalHeight;if(mw&&w>mw){h*=mw/w;w=mw}X.drawImage(i,x-w/2,y-h,w,h)}
const BI=BIMG.map(u=>{const i=new Image();i.src=u;return i});
function drawB(x,y,h,k,mw){const i=BI[k%4];if(!i.complete||!i.naturalWidth)return;let w=h*i.naturalWidth/i.naturalHeight;if(mw&&w>mw){h*=mw/w;w=mw}X.drawImage(i,x-w/2,y-h,w,h)}
function kid(x,y,s,o,mood){X.save();X.translate(x,y);X.scale(s,s);const sk='#f4c9a0';
 X.fillStyle=sk;X.fillRect(-9,-22,6,18);X.fillRect(3,-22,6,18);
 X.fillStyle='#222';X.fillRect(-11,-5,10,5);X.fillRect(1,-5,10,5);
 X.fillStyle=o.shorts;X.fillRect(-12,-34,24,16);
 X.fillStyle=o.shirt;X.fillRect(-12,-54,24,22);
 if(o.stripes){X.fillStyle='#a8e06c';X.fillRect(-12,-50,24,5);X.fillRect(-12,-41,24,5)}
 X.fillStyle=sk;X.fillRect(-18,-52,6,18);X.fillRect(12,-52,6,18);
 X.fillRect(-15,-80,30,27);
 X.fillStyle=o.hair;X.fillRect(-17,-88,34,12);X.fillRect(-17,-80,5,10);X.fillRect(12,-80,5,10);
 if(o.glasses){X.strokeStyle='#111';X.lineWidth=2.5;X.beginPath();X.arc(-7,-68,7,0,7);X.moveTo(14,-68);X.arc(7,-68,7,0,7);X.moveTo(-1,-68);X.lineTo(1,-68);X.stroke();
  X.fillStyle='#4aa8e8';X.beginPath();X.arc(-7,-68,2.5,0,7);X.arc(7,-68,2.5,0,7);X.fill();
  X.fillStyle='#fff';X.fillRect(-3,-60,3,4);X.fillRect(0,-60,3,4)}
 else{X.fillStyle='#111';X.fillRect(-9,-69,4,4);X.fillRect(5,-69,4,4);X.lineWidth=2.5;X.strokeStyle='#111';X.beginPath();X.moveTo(-11,-74);X.lineTo(-4,-71);X.moveTo(11,-74);X.lineTo(4,-71);X.stroke();
  X.fillRect(-5,-59,10,2)}
 X.restore()}
let st='menu',lvl=1,P,bl=[],f,keys={},jv={x:0,y:0},hiding=null,pendingHide=false,time=0;
function msg(h,p,b,cb){st='pause';const o=$('ov');o.style.display='flex';o.innerHTML=`<h1>${h}</h1><p>${p}</p><button>${b}</button>`;o.querySelector('button').onclick=()=>{o.style.display='none';cb()}}
function ui(m){$('joy').style.display=m=='menu'?'none':'';$('hide').style.display=m=='play'?'':'none';$('punch').style.display=$('kick').style.display=m=='fight'?'block':'none'}
let CELLS=[],EX={x:0,y:0},MAPB={x0:0,x1:1,y0:0,y1:1,rooms:[]};
const BLK=[[1,5],[6,11],[12,17],[18,23]],blockOf=l=>BLK.findIndex(r=>l>=r[0]&&l<=r[1]);
let SPD=70,VIS=150;
function startLevel(){if(f)f.keep=0;st='play';ui('play');hiding=null;bl=[];
 const fin=lvl>23,blk=fin?0:blockOf(lvl),b0=fin?5:lvl-BLK[blk][0]+1;
 buildLevel(fin?64:10+b0*5+blk*2,fin?10:Math.min(8,(b0-1)*2),fin?.5:.3);
 SPD=fin?105:55+b0*5+blk*8;VIS=fin?170:120+b0*6+blk*6;
 P={x:CELLS[0].x,y:CELLS[0].y};
 const n=fin?24:2*b0,L=CELLS.length,s0=Math.ceil(L*.3);
 const RM=MAPB.rooms.filter(r=>r.owner>=s0);
 for(let i=0;i<n;i++){const r=RM.length?RM[Math.floor(i*RM.length/n)]:null,ci=r?r.owner:Math.min(L-1,s0+Math.floor(i*(L-s0)/n)),c=r||CELLS[ci],ox=(Math.random()-.5)*44,oy=(Math.random()-.5)*44;
  bl.push({x:c.x+ox,y:c.y+oy,ox,oy,home:ci,zn:fin?6:3,ci,ti:ci,rm:r,tr:r,wait:Math.random()*3,alert:0,skin:fin?i%4:blk})}
 $('hud').textContent=fin?'FINAL ESCAPE':'Level '+lvl+' / 24';yaw=-Math.PI/2;syncSprites()}
function done(){const fin=lvl>23,b=!fin&&lvl==BLK[blockOf(lvl)][1];
 if(fin)msg('YOU ESCAPED!','You got out of the school past every bully!','Play again',()=>{lvl=1;startLevel()});
 else msg('LEVEL COMPLETED!','You made it out of level '+lvl+'!',b?'Fight the bully':'Next level',()=>{if(b)startFight();else{lvl++;startLevel()}})}
function sees(b){const dx=P.x-b.x,dy=P.y-b.y,d=Math.hypot(dx,dy),r=VIS;if(d>r)return false;
 for(let i=1;i<d/10;i++)if(hitW(b.x+dx*i*10/d,b.y+dy*i*10/d,0))return false;return true}
const HH=()=>Math.min(H*.4,W*.36);
function startFight(){st='fight';ui('fight');const i=blockOf(lvl)+1,m=100+25*i;jv.x=jv.y=0;
 f={i,t:60,intro:1,end:0,win:0,fx:[],skin:i-1,p:{x:W*.3,hp:100,lag:100,jy:0,vy:0,at:null,st:0},b:{x:W*.72,hp:m,lag:m,mx:m,at:null,st:0,ai:1.2,jy:0,vy:0}};$('hud').textContent='FIGHT '+i+' / 4'}
function swing(o,e,hh){const a=o.at;if(!a.hit&&a.t>=a.h){a.hit=1;if(Math.abs(o.x-e.x)<=hh*a.r&&(e.jy||0)<hh*.22){e.hp-=a.dm;e.st=.28;e.at=null;e.x+=Math.sign(e.x-o.x)*a.kb*hh/160;f.fx.push({x:(o.x+e.x)/2,y:H*.84-hh*a.ty,t:.25})}}
 if(o.at&&a.t>=a.d)o.at=null}
function finishFight(){f.keep=1;if(f.win){const w=lvl==23;msg('WINNER!',w?'You beat all 4 bullies! Now escape the school with every one of them looking for you!':'You beat bully '+f.i+'! On to the next levels.',w?'Final escape':'Next level',()=>{lvl++;startLevel()})}
 else{const q=BLK[blockOf(lvl)][0];msg('YOU LOSE','The bully got you. Back to level '+q+'.','Try again',()=>{lvl=q;startLevel()})}}
function update(dt){time+=dt;
 if(st=='play'){let mx=(keys.d?1:0)-(keys.a?1:0)+jv.x,my=(keys.s?1:0)-(keys.w?1:0)+jv.y;if(keys.ArrowLeft)yaw+=2*dt;if(keys.ArrowRight)yaw-=2*dt;
  const m=Math.hypot(mx,my);if(m>1){mx/=m;my/=m}
  if(!hiding){const sp=150*dt;let nx=P.x+(Math.sin(yaw)*my+Math.cos(yaw)*mx)*sp,ny=P.y+(Math.cos(yaw)*my-Math.sin(yaw)*mx)*sp;if(!hitW(nx,P.y,10))P.x=nx;if(!hitW(P.x,ny,10))P.y=ny}
  if(pendingHide){pendingHide=false;if(hiding)hiding=null;else{const s=nearSpot();if(s){hiding=s;P.x=s.x;P.y=s.y}}}
  $('hide').textContent=hiding?'COME OUT':'HIDE';$('hide').classList.toggle('near',!!(hiding||nearSpot()));
  for(const b of bl){
   if(b.wait>0)b.wait-=dt;
   const seen=!hiding&&sees(b);b.alert=Math.max(0,b.alert+(seen?dt:-dt*.8));
   if(b.alert>0.7){msg('CAUGHT!','A bully spotted you!','Try again',startLevel);return}
   if(b.alert>0.05||b.wait>0)continue;
   let tp=null,k=0;
   if(b.rm&&b.rm!==b.tr){tp=CELLS[b.rm.owner];k=1}
   else if(!b.rm&&b.ci!=b.ti){tp=CELLS[b.ci+Math.sign(b.ti-b.ci)];k=2}
   else if(!b.rm&&b.tr){tp=b.tr;k=3}
   if(!tp){const zr=MAPB.rooms.filter(r=>r!==b.rm&&Math.abs(r.owner-b.home)<=b.zn);
    if(zr.length&&Math.random()<.85){b.tr=zr[Math.floor(Math.random()*zr.length)];b.ti=b.tr.owner}else{b.tr=null;b.ti=Math.min(CELLS.length-1,Math.max(2,b.home+Math.round((Math.random()*2-1)*b.zn)))}
    b.wait=.3+Math.random()*.8;continue}
   const dx=tp.x+b.ox-b.x,dy=tp.y+b.oy-b.y,d=Math.hypot(dx,dy),sp=SPD*dt;
   if(d<=sp){b.x=tp.x+b.ox;b.y=tp.y+b.oy;if(k==1){b.ci=b.rm.owner;b.rm=null}else if(k==2)b.ci+=Math.sign(b.ti-b.ci);else{b.rm=b.tr;b.wait=2+Math.random()*2.5}}else{b.x+=dx/d*sp;b.y+=dy/d*sp}}
  if(Math.hypot(P.x-EX.x,P.y-EX.y)<50)done()}
 else if(st=='fight'){const hh=HH(),p=f.p,b=f.b;f.fx=f.fx.filter(q=>(q.t-=dt)>0);
  if(f.intro>0)f.intro-=dt;
  else if(f.end>0){f.end-=dt;if(f.end<=0)finishFight()}
  else{f.t-=dt;
   if(p.st>0)p.st-=dt;
   else if(!p.at){const mx=(keys.d||keys.ArrowRight?1:0)-(keys.a||keys.ArrowLeft?1:0)+jv.x;p.x+=Math.max(-1,Math.min(1,mx))*hh*1.1*dt;if(p.jy==0&&(jv.y<-.55||keys.w||keys.ArrowUp))p.vy=hh*2.6}
   if(p.vy!=0||p.jy>0){p.jy+=p.vy*dt;p.vy-=hh*9*dt;if(p.jy<=0){p.jy=0;p.vy=0}}
   if(b.st>0)b.st-=dt;
   else if(!b.at){const d=Math.abs(b.x-p.x),dr=Math.sign(p.x-b.x),sp=hh*(.5+.07*f.i);
    if(p.at&&!p.at.rc){p.at.rc=1;if(b.jy==0&&d<hh*.8&&Math.random()<.4)b.vy=hh*2.6}if(b.jy==0&&d>hh*1.1&&Math.random()<dt*.5)b.vy=hh*2.4;const bs=sp*(b.jy>0?1.8:1);if(d>hh*.5)b.x+=dr*bs*dt;else if(d<hh*.34)b.x-=dr*bs*.5*dt;
    b.ai-=dt;if(b.ai<=0&&d<hh*.62){const k=Math.random()<.6?'punch':'kick',i=f.i;
     b.at=k=='punch'?{t:0,type:k,h:.32-.03*i,d:.55-.04*i,dm:5+2*i,r:.55,kb:22,ty:.62}:{t:0,type:k,h:.45-.04*i,d:.75-.05*i,dm:8+3*i,r:.7,kb:44,ty:.4};
     b.ai=Math.max(.45,1.2-.15*i)*(.6+Math.random()*.8)}}
   if(b.vy!=0||b.jy>0){b.jy+=b.vy*dt;b.vy-=hh*9*dt;if(b.jy<=0){b.jy=0;b.vy=0}}
   if(p.at){p.at.t+=dt;swing(p,b,hh)}if(b.at){b.at.t+=dt;swing(b,p,hh)}
   p.x=Math.max(hh*.2,Math.min(W-hh*.2,p.x));b.x=Math.max(hh*.2,Math.min(W-hh*.2,b.x));
   const md=hh*.3;if(Math.abs(p.x-b.x)<md){const m=(p.x+b.x)/2,sg=p.x<b.x?-1:1;p.x=m+sg*md/2;b.x=m-sg*md/2}
   p.lag=Math.max(p.hp,p.lag-35*dt);b.lag=Math.max(b.hp,b.lag-35*dt*b.mx/100);
   if(p.hp<=0||b.hp<=0||f.t<=0){f.end=1;f.win=b.hp<=0?1:p.hp<=0?0:(p.hp/100>=b.hp/b.mx?1:0)}}}
}
function nearSpot(){let bs=null,bd=55;for(const s of spots){const d=Math.hypot(s.x-P.x,s.y-P.y);if(d<bd){bd=d;bs=s}}return bs}
function draw(){
 if(st=='fight'||(st=='pause'&&f&&f.keep)){G.style.visibility='hidden';drawFight();return}
 G.style.visibility='visible';X.clearRect(0,0,W,H);
 if(!P)return;
 const fx=-Math.sin(yaw),fz=-Math.cos(yaw);let cd=hiding?0:62;while(cd>6&&hitW(P.x-fx*cd,P.y-fz*cd,4))cd-=6;
 const mv=Math.hypot(P.x-lpx,P.y-lpy)>.1;lpx=P.x;lpy=P.y;
 cam.position.set(P.x-fx*cd,hiding?(hiding.t=='desk'?16:50):68,P.y-fz*cd);cam.rotation.x=hiding?0:-.2;cam.rotation.y=yaw;
 HS.visible=!hiding;HS.position.set(P.x,30+(mv?Math.abs(Math.sin(time*10))*3:0),P.y);
 bl.forEach((b,i)=>{const s=spr[i];if(!s)return;const a=b.alert>.05;s.position.set(b.x,40,b.y);s.material.color.setHex(a?0xff7777:0xffffff);const e=s.userData.ex;e.visible=a;e.position.set(b.x,98,b.y)});
 R3.render(scene,cam);
 if(hiding){X.fillStyle='#000';X.fillRect(0,0,W,H*.4);X.fillRect(0,H*.6,W,H*.4);X.fillStyle='#fff';X.font='bold 20px sans-serif';X.textAlign='center';X.fillText('hidden - stay quiet',W/2,H*.9)}
 const M=MAPB,bw=190,bh=150,mx=W-bw-10,my=10,sc=Math.min((bw-8)/(M.x1-M.x0),(bh-8)/(M.y1-M.y0)),ox=mx+(bw-(M.x1-M.x0)*sc)/2,oy=my+(bh-(M.y1-M.y0)*sc)/2,tx=x=>ox+(x-M.x0)*sc,ty=y=>oy+(y-M.y0)*sc;
 X.fillStyle='rgba(0,0,0,.6)';X.fillRect(mx-3,my-3,bw+6,bh+6);
 X.fillStyle='#7fa7bd';for(const r of M.rooms)X.fillRect(tx(r.x-80),ty(r.y-80),160*sc,160*sc);
 X.fillStyle='#dcc9a0';for(const c of CELLS)X.fillRect(tx(c.x-80),ty(c.y-80),160*sc,160*sc);
 X.fillStyle='#2ecc71';X.fillRect(tx(EX.x-80),ty(EX.y-80),160*sc,160*sc);
 X.fillStyle='#3a3f55';for(const w of walls)X.fillRect(tx(w.x),ty(w.y),Math.max(1.2,w.w*sc),Math.max(1.2,w.h*sc));
 X.fillStyle='#f33';for(const b of bl){X.beginPath();X.arc(tx(b.x),ty(b.y),3,0,7);X.fill()}
 X.strokeStyle='#2a7fff';X.lineWidth=2;X.beginPath();X.moveTo(tx(P.x),ty(P.y));X.lineTo(tx(P.x)-Math.sin(yaw)*12,ty(P.y)-Math.cos(yaw)*12);X.stroke();
 X.fillStyle='#2a7fff';X.beginPath();X.arc(tx(P.x),ty(P.y),3.5,0,7);X.fill();X.strokeStyle='#fff';X.lineWidth=1;X.stroke()}
function playground(){const g=X.createLinearGradient(0,0,0,H*.5);g.addColorStop(0,'#5db8f0');g.addColorStop(1,'#d5f0ff');X.fillStyle=g;X.fillRect(0,0,W,H);
 X.fillStyle='#ffe680';X.beginPath();X.arc(W*.85,H*.13,H*.06,0,7);X.fill();
 X.fillStyle='#fff';for(const[a,b]of[[.15,.1],[.5,.07],[.68,.2]]){X.beginPath();X.arc(W*a,H*b,H*.04,0,7);X.arc(W*a+H*.05,H*b,H*.05,0,7);X.arc(W*a+H*.1,H*b,H*.035,0,7);X.fill()}
 X.fillStyle='#4aa84a';X.fillRect(0,H*.42,W,H*.58);X.fillStyle='#a0702d';for(let x=0;x<W;x+=26)X.fillRect(x,H*.36,14,H*.1);X.fillRect(0,H*.4,W,6);
 X.fillStyle='#c9bfa8';X.fillRect(0,H*.66,W,H*.34);
 X.strokeStyle='#d33';X.lineWidth=7;const sx=W*.5,sw=Math.min(W*.4,H*.5);X.beginPath();X.moveTo(sx-sw/2,H*.62);X.lineTo(sx-sw/4,H*.3);X.lineTo(sx+sw/4,H*.3);X.lineTo(sx+sw/2,H*.62);X.moveTo(sx-sw/4,H*.3);X.lineTo(sx-sw/2+8,H*.62);X.moveTo(sx+sw/4,H*.3);X.lineTo(sx+sw/2-8,H*.62);X.stroke();
 X.strokeStyle='#555';X.lineWidth=3;for(const o of[-.12,.12]){X.beginPath();X.moveTo(sx+sw*o,H*.3);X.lineTo(sx+sw*o,H*.55);X.stroke();X.fillStyle='#fc0';X.fillRect(sx+sw*o-14,H*.55,28,6)}
 X.fillStyle='#3a7bd5';X.beginPath();X.moveTo(W*.04,H*.62);X.lineTo(W*.04,H*.34);X.lineTo(W*.08,H*.34);X.lineTo(W*.2,H*.62);X.fill()}
function drawFight(){playground();const hh=HH(),fy=H*.84,sc=hh/88,p=f.p,b=f.b,dir=Math.sign(b.x-p.x)||1;
 for(const o of[p,b]){X.fillStyle='rgba(0,0,0,.25)';X.beginPath();X.ellipse(o.x,fy+4,hh*.2,hh*.035,0,0,7);X.fill()}
 {const k=b.at?b.at.t/b.at.d:0,ox=b.at?-dir*Math.sin(Math.min(1,k)*Math.PI)*hh*.2:0;
  X.save();if(b.st>0&&Math.floor(time*30)%2)X.globalAlpha=.5;drawB(b.x+ox,fy-b.jy,hh,f.skin,hh*.8);X.restore();
  if(b.at&&b.at.t<b.at.h){X.font='bold '+hh*.2+'px sans-serif';X.fillStyle='#f33';X.textAlign='center';X.fillText('!',b.x,fy-hh*1.05)}}
 {const k=p.at?p.at.t/p.at.d:0,ex=p.at?Math.sin(Math.min(1,k)*Math.PI):0,hx=p.x+dir*ex*hh*.12,hy=fy-p.jy*1;
  X.save();if(p.st>0&&Math.floor(time*30)%2)X.globalAlpha=.5;drawI(HI,hx,hy,hh,hh*.8);X.restore();
  if(p.at){const kk=p.at.type=='kick';X.save();X.translate(hx,hy-hh*(kk?.32:.55));X.scale(dir,1);X.fillStyle='#f4c9a0';X.strokeStyle='#1b1020';X.lineWidth=3;
   if(kk){X.rotate(-.45*ex);X.fillRect(0,-hh*.04,hh*(.1+.5*ex),hh*.08);X.strokeRect(0,-hh*.04,hh*(.1+.5*ex),hh*.08);X.fillStyle='#222';X.fillRect(hh*(.1+.5*ex),-hh*.06,hh*.1,hh*.12)}
   else{X.fillRect(0,-hh*.03,hh*(.1+.4*ex),hh*.06);X.strokeRect(0,-hh*.03,hh*(.1+.4*ex),hh*.06);X.beginPath();X.arc(hh*(.1+.4*ex),0,hh*.05,0,7);X.fill();X.stroke()}
   X.restore()}}
 for(const q of f.fx){X.fillStyle='rgba(255,220,60,'+Math.min(1,q.t*4)+')';X.beginPath();X.arc(q.x,q.y,hh*.12*(1.3-q.t*2),0,7);X.fill();X.strokeStyle='#f60';X.lineWidth=5;X.stroke()}
 const by=Math.max(56,H*.1),bw=W/2-hh*.22,bh=20;
 const bar=(x,w,fr,lg,right)=>{X.fillStyle='#111';X.fillRect(x-3,by-3,w+6,bh+6);const lw=w*Math.max(0,lg),fw=w*Math.max(0,fr);X.fillStyle='#f9a';X.fillRect(right?x+w-lw:x,by,lw,bh);X.fillStyle=fr<.3?'#e33':'#3c3';X.fillRect(right?x+w-fw:x,by,fw,bh)};
 bar(12,bw-12,p.hp/100,p.lag/100,0);bar(W-bw,bw-12,b.hp/b.mx,b.lag/b.mx,1);
 X.fillStyle='#fff';X.font='bold 14px sans-serif';X.textAlign='left';X.fillText('YOU',14,by+bh+20);X.textAlign='right';X.fillText('BULLY '+f.i,W-14,by+bh+20);
 X.fillStyle='#2a1a5a';X.beginPath();X.arc(W/2,by+bh/2,24,0,7);X.fill();X.strokeStyle='#fff';X.lineWidth=2;X.stroke();X.fillStyle='#fff';X.font='bold 24px sans-serif';X.textAlign='center';X.fillText(Math.max(0,Math.ceil(f.t)),W/2,by+bh/2+8);
 if(f.intro>0||f.end>0){X.font='bold '+H*.12+'px sans-serif';X.lineWidth=8;X.strokeStyle='#000';X.fillStyle='#ffd21f';const t=f.end>0?'K.O.!':'FIGHT!';X.strokeText(t,W/2,H*.42);X.fillText(t,W/2,H*.42)}}
const G=document.getElementById('g'),R3=new THREE.WebGLRenderer({canvas:G});
const scene=new THREE.Scene(),cam=new THREE.PerspectiveCamera(72,1,1,900);cam.rotation.order='YXZ';let yaw=-Math.PI/2;
scene.background=new THREE.Color(0x15110c);scene.fog=new THREE.Fog(0x15110c,120,620);
function rs3(){R3.setSize(W,H,false);cam.aspect=W/H;cam.updateProjectionMatrix()}addEventListener('resize',rs3);rs3();
function tex(fn){const c=document.createElement('canvas');c.width=c.height=128;const g=c.getContext('2d');fn(g);const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.magFilter=THREE.NearestFilter;return t}
const noise=(g,b)=>{g.fillStyle=b;g.fillRect(0,0,128,128);for(let i=0;i<2500;i++){g.fillStyle='rgba('+(i%2?'0,0,0':'255,255,255')+','+Math.random()*.22+')';g.fillRect(Math.random()*128,Math.random()*128,2,2)}};
const tBlue=tex(g=>noise(g,'#0b1f6b')),tBeige=tex(g=>noise(g,'#b99a62')),
tCeil=tex(g=>{noise(g,'#d9d9d9');g.fillStyle='#8a8a8a';g.fillRect(0,0,128,3);g.fillRect(0,0,3,128)}),
tWood=tex(g=>{g.fillStyle='#b8741f';g.fillRect(0,0,128,128);for(let x=0;x<128;x+=32){g.fillStyle='#8a5412';g.fillRect(x,0,3,128);g.fillStyle='rgba(255,200,120,.2)';g.fillRect(x+8,0,6,128)}}),
tBrick=tex(g=>{g.fillStyle='#ececec';g.fillRect(0,0,128,128);g.fillStyle='#a5a5a5';for(let r=0;r<8;r++)for(let c=0;c<5;c++)g.fillRect(c*32+(r%2)*16-16+1,r*16+1,30,14)}),
tLock=tex(g=>{g.fillStyle='#d01818';g.fillRect(0,0,128,128);g.fillStyle='#7a0a0a';g.fillRect(0,0,128,5);g.fillRect(62,0,4,128);for(let y=12;y<110;y+=18){g.fillRect(8,y,40,3);g.fillRect(80,y,40,3)}g.fillStyle='#ddd';g.fillRect(50,60,6,12);g.fillRect(72,60,6,12)}),
tDesk=tex(g=>{g.fillStyle='#e0782a';g.fillRect(0,0,128,128);g.fillStyle='#a8531a';g.fillRect(0,0,128,8);g.fillRect(0,120,128,8)}),
tBoard=tex(g=>{g.fillStyle='#111';g.fillRect(0,0,128,128);g.strokeStyle='#8a5412';g.lineWidth=8;g.strokeRect(0,0,128,128);g.fillStyle='#fff';g.font='bold 44px sans-serif';g.textAlign='center';g.fillText('WOW',64,76)}),
tExit=tex(g=>{g.fillStyle='#1fa84f';g.fillRect(0,0,128,128);g.fillStyle='#fff';g.font='bold 40px sans-serif';g.textAlign='center';g.fillText('EXIT',64,76)}),
tEx=tex(g=>{g.font='bold 120px sans-serif';g.fillStyle='#f22';g.textAlign='center';g.fillText('!',64,105)});
let lpx=0,lpy=0;
const HT=new THREE.TextureLoader().load(HBACK);
const HS=new THREE.Sprite(new THREE.SpriteMaterial({map:HT,transparent:true}));HS.scale.set(60*0.364,60,1);scene.add(HS);
const MT=(t,rx,ry)=>{const c=t.clone();c.needsUpdate=true;c.repeat.set(rx,ry);return new THREE.MeshBasicMaterial({map:c})};
const mc={};function MC(t,rx,ry){const k=t.uuid+rx+','+ry;return mc[k]||(mc[k]=MT(t,rx,ry))}
let grp=null;const DX=[1,0,-1,0],DY=[0,1,0,-1],CS=160;
const box=(w,h,d,m,x,y,z)=>{const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);o.position.set(x,y,z);grp.add(o)};
function flat(x,z,w,d,t,y,up){const o=new THREE.Mesh(new THREE.PlaneGeometry(w,d),MC(t,w/64,d/64));o.rotation.x=up?-Math.PI/2:Math.PI/2;o.position.set(x+w/2,y,z+d/2);grp.add(o)}
function wall(x,y,w,h,t){R(x,y,w,h);box(w,100,h,MC(t,Math.max(w,h)/64,1.5),x+w/2,50,y+h/2)}
function edgeWall(cx,cy,d,door,t){const ex=cx+DX[d]*80,ey=cy+DY[d]*80;
 if(DX[d]){if(door){wall(ex-10,cy-90,20,55,t);wall(ex-10,cy+35,20,55,t)}else wall(ex-10,cy-90,20,180,t)}
 else{if(door){wall(cx-90,ey-10,55,20,t);wall(cx+35,ey-10,55,20,t)}else wall(cx-90,ey-10,180,20,t)}}
function plane(t,w,h,x,y,z,nx,nz){const o=new THREE.Mesh(new THREE.PlaneGeometry(w,h),MC(t,1,1));o.position.set(x,y,z);o.rotation.y=Math.atan2(nx,nz);grp.add(o)}
function genPath(len,turns){
 for(let tr=0;tr<300;tr++){
  const c=[[0,0]],occ=new Set(['0,0']);let dir=0,ok=1,rem=len-1;
  const free=(x,y,px,py)=>{if(occ.has(x+','+y))return 0;for(let d=0;d<4;d++){const a=x+DX[d],b=y+DY[d];if(occ.has(a+','+b)&&!(a==px&&b==py))return 0}return 1};
  for(let q=0;q<=turns&&ok;q++){
   let L=q==turns?rem:Math.max(2,Math.round(rem/(turns+1-q)+(Math.random()-.5)*2));L=Math.min(L,rem);
   for(let i=0;i<L;i++){const [px,py]=c[c.length-1],x=px+DX[dir],y=py+DY[dir];if(!free(x,y,px,py)){ok=0;break}c.push([x,y]);occ.add(x+','+y)}
   rem-=L;if(!ok||rem<=0)break;dir=(dir+(Math.random()<.5?1:3))%4}
  if(ok&&c.length==len)return c}
 return Array.from({length:len},(_,i)=>[i,0])}
function buildLevel(len,turns,rp){
 if(grp){grp.traverse(o=>{if(o.geometry)o.geometry.dispose()});scene.remove(grp)}
 grp=new THREE.Group();scene.add(grp);walls.length=0;spots.length=0;
 const g=genPath(len,turns),mnx=Math.min(...g.map(p=>p[0]))-1,mny=Math.min(...g.map(p=>p[1]))-1,wc=(a,b)=>({x:(a-mnx+.5)*CS,y:(b-mny+.5)*CS}),key=(a,b)=>a+','+b;
 CELLS=g.map(p=>({...wc(p[0],p[1]),gx:p[0],gy:p[1]}));const L=CELLS.length,pi=new Map(g.map((p,i)=>[key(p[0],p[1]),i])),rooms=new Map();
 const ed=[(g[L-1][0]-g[L-2][0]),(g[L-1][1]-g[L-2][1])],exd=DX.findIndex((v,d)=>v==ed[0]&&DY[d]==ed[1]);
 CELLS.forEach((c,i)=>{if(i<1||i>=L-1)return;for(let d=0;d<4;d++){const nx=c.gx+DX[d],ny=c.gy+DY[d],k=key(nx,ny);if(pi.has(k)||rooms.has(k)||Math.random()>rp)continue;rooms.set(k,{gx:nx,gy:ny,owner:i,d,...wc(nx,ny)})}});
 CELLS.forEach((c,i)=>{flat(c.x-80,c.y-80,160,160,tBeige,0,1);flat(c.x-80,c.y-80,160,160,tCeil,100,0);
  for(let d=0;d<4;d++){const k=key(c.gx+DX[d],c.gy+DY[d]),n=pi.get(k);if(n===i-1||n===i+1)continue;
   const r=rooms.get(k);edgeWall(c.x,c.y,d,r&&r.owner==i,tWood);
   if(!r&&!(i==L-1&&d==exd)&&Math.random()<.45){const ex=c.x+DX[d]*(80-17),ey=c.y+DY[d]*(80-17);
    for(const o of[-40,0,40])box(DX[d]?14:38,72,DX[d]?38:14,lm,ex+(DX[d]?0:o),36,ey+(DX[d]?o:0));
    spots.push({x:c.x+DX[d]*35,y:c.y+DY[d]*35,t:'locker'})}}});
 for(const r of rooms.values()){flat(r.x-80,r.y-80,160,160,tBlue,0,1);flat(r.x-80,r.y-80,160,160,tCeil,100,0);
  for(let d=0;d<4;d++){if(d==(r.d+2)%4||pi.has(key(r.gx+DX[d],r.gy+DY[d])))continue;edgeWall(r.x,r.y,d,0,tBrick)}
  plane(tBoard,100,45,r.x+DX[r.d]*68,62,r.y+DY[r.d]*68,-DX[r.d],-DY[r.d]);
  for(const sg of[-1,1]){const x=r.x+Math.abs(DY[r.d])*sg*38,y=r.y+Math.abs(DX[r.d])*sg*38;box(48,4,30,dm,x,32,y);box(40,30,24,dm,x,15,y);spots.push({x,y,t:'desk'})}}
 const e=CELLS[L-1];EX={x:e.x,y:e.y};plane(tExit,110,85,e.x+DX[exd]*69,42,e.y+DY[exd]*69,-DX[exd],-DY[exd]);
 const rl=[...rooms.values()],xs=CELLS.concat(rl).map(c=>c.x),ys=CELLS.concat(rl).map(c=>c.y);
 MAPB={x0:Math.min(...xs)-90,x1:Math.max(...xs)+90,y0:Math.min(...ys)-90,y1:Math.max(...ys)+90,rooms:rl}}
const lm=MC(tLock,1,1),dm=MC(tDesk,1,1);
const BT=BIMG.map(u=>new THREE.TextureLoader().load(u)),AR=[0.408, 0.339, 0.386, 0.45];let spr=[];
function syncSprites(){spr.forEach(m=>{scene.remove(m);scene.remove(m.userData.ex)});
 spr=bl.map(b=>{const k=b.skin%4,m=new THREE.Sprite(new THREE.SpriteMaterial({map:BT[k],transparent:true}));m.scale.set(80*AR[k],80,1);
  const e=new THREE.Sprite(new THREE.SpriteMaterial({map:tEx,transparent:true,fog:false}));e.scale.set(26,26,1);e.visible=false;m.userData.ex=e;scene.add(m,e);return m})}
let lid=null,lx=0;
C.addEventListener('pointerdown',e=>{if(lid===null){lid=e.pointerId;lx=e.clientX;C.setPointerCapture(lid)}});
C.addEventListener('pointermove',e=>{if(e.pointerId==lid){if(st=='play')yaw-=(e.clientX-lx)*.006;lx=e.clientX}});
['pointerup','pointercancel'].forEach(n=>C.addEventListener(n,e=>{if(e.pointerId==lid)lid=null}));
// controls
const joy=$('joy'),kn=$('knob');let jid=null;
function jmove(e){const r=joy.getBoundingClientRect(),dx=e.clientX-r.left-65,dy=e.clientY-r.top-65,d=Math.hypot(dx,dy),m=Math.min(d,50);const a=Math.atan2(dy,dx);
 const ux=d?Math.cos(a)*m:0,uy=d?Math.sin(a)*m:0;kn.style.left=40+ux+'px';kn.style.top=40+uy+'px';jv.x=ux/50;jv.y=uy/50;if(Math.hypot(jv.x,jv.y)<.15){jv.x=jv.y=0}}
joy.addEventListener('pointerdown',e=>{jid=e.pointerId;joy.setPointerCapture(jid);jmove(e)});
joy.addEventListener('pointermove',e=>{if(e.pointerId==jid)jmove(e)});
const jend=e=>{if(e.pointerId==jid){jid=null;jv.x=jv.y=0;kn.style.left=kn.style.top='40px'}};
joy.addEventListener('pointerup',jend);joy.addEventListener('pointercancel',jend);
const hideAct=()=>{if(st=='play')pendingHide=true};
const PA={punch:{h:.1,d:.26,dm:6,r:.55,kb:22,ty:.62},kick:{h:.2,d:.48,dm:11,r:.7,kb:44,ty:.4}},
go=k=>{if(st=='fight'&&f.intro<=0&&f.end<=0&&f.p.st<=0&&!f.p.at)f.p.at={t:0,type:k,...PA[k]}},punchAct=()=>go('punch'),kickAct=()=>go('kick');
$('hide').addEventListener('pointerdown',e=>{e.preventDefault();hideAct()});
$('punch').addEventListener('pointerdown',e=>{e.preventDefault();punchAct()});
$('kick').addEventListener('pointerdown',e=>{e.preventDefault();kickAct()});
addEventListener('keydown',e=>{keys[e.key]=1;if(e.key==' '||e.key=='e')hideAct();if(e.key=='j')punchAct();if(e.key=='k')kickAct()});
addEventListener('keyup',e=>keys[e.key]=0);
ui('menu');
msg('<img src="'+LOGO+'" alt="Bully Escape" style="width:min(72vw,300px);border-radius:28px;display:block;margin:0 auto">','Sneak through the halls to the EXIT without being seen. Swipe the screen to look around. Use the corner map to spot bullies and hide in lockers or under desks. 24 levels with a boss fight after each bully!','Start',()=>{lvl=1;startLevel()});
let bgm=null,muted=false;
function audioStart(){if(bgm){if(bgm.paused&&!muted&&!document.hidden)bgm.play().catch(()=>{});return}
 bgm=new Audio(MUSIC);bgm.loop=true;bgm.volume=.55;bgm.muted=muted;bgm.play().catch(()=>{})}
$('mute').addEventListener('pointerdown',e=>{e.stopPropagation()});
$('mute').addEventListener('click',()=>{audioStart();muted=!muted;if(bgm)bgm.muted=muted;$('mute').innerHTML=muted?'&#128263;':'&#128266;'});
addEventListener('pointerdown',audioStart);addEventListener('keydown',audioStart);
document.addEventListener('visibilitychange',()=>{if(bgm){if(document.hidden)bgm.pause();else if(!muted)bgm.play().catch(()=>{})}});
let last=performance.now();
(function loop(t){const dt=Math.min(.05,(t-last)/1000);last=t;update(dt);draw();requestAnimationFrame(loop)})(last);
