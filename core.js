/* Jisenkoku: Black Wing. Original mission simulation. No runtime dependencies. */
(function(root){
'use strict';
const PILOTS=[{name:'KEVO',color:'#4a7dff',speed:8.8,rate:.095,damage:2},{name:'M.',color:'#ffffff',speed:8.2,rate:.14,damage:1.7},{name:'DAIGA',color:'#ff4563',speed:7.7,rate:.19,damage:4.5}];
const PHASES=[{at:0,name:'FLIGHT',jp:'出撃',hint:'Fly. Fire. Find your rhythm.'},{at:27,name:'DIMENSION CONTACT',jp:'次元接触',hint:'Match a bullet’s color to cancel it.'},{at:67,name:'ALTERNATING PRESSURE',jp:'交代戦闘',hint:'Blue: Kevo · White: M. · Red: Daiga'},{at:119,name:'CROSS FIRE',jp:'十字砲火',hint:'Orange threats must be dodged.'},{at:177,name:'CARRIER DIVE',jp:'空母降下',hint:'Follow the channel. Keep the formation moving.'},{at:231,name:'DIMENSION BREACH',jp:'次元突破',hint:'Destroy the assault frame.'}];
const FOCUS=.5,SCREEN={x:7.4,top:11.5,bottom:-4};

/* ---- Authored stage script --------------------------------------------
   Every wave is placed by hand on the mission clock. Nothing is random, so
   a route learned on one run holds on the next. Times are seconds into the
   playing state; PHASES above mark the section changes. */
const SCRIPT=[];
const at=(t,run)=>SCRIPT.push({t,run});
const aim=(n=1,o={})=>({pattern:'aim',n,spread:.2,speed:3.1,first:1.4,every:2.4,max:2,...o});
const fan=(n=7,o={})=>({pattern:'aim',n,spread:.19,speed:3.4,first:1.6,every:1.7,max:4,...o});
function swoop(g,s,{count=5,gap=.32,color=0,type='scout',dur=4.6,low=-1.5,fire=aim(1,{max:1,speed:2.9})}={}){
 for(let i=0;i<count;i++)g.after(i*gap,()=>g.spawn(type,s*5,14,typeof color==='function'?color(i):color,{kind:'bezier',dur,pts:[[s*5,14],[s*4,low],[-s*6,low],[-s*10,9]]},fire));
}
function drop(g,xs,{type='scout',color=0,stopY=7.5,hold=2.6,gap=.18,exit,fire}={}){
 xs.forEach((x,i)=>g.after(i*gap,()=>g.spawn(type,x,14,typeof color==='function'?color(i):color,{kind:'drop',stopY:typeof stopY==='function'?stopY(i):stopY,enter:1.15,hold,exit:exit||(type==='heavy'?[0,.8]:[(Math.sign(x)||1)*.7,-.8])},fire||(type==='heavy'?fan():type==='lancer'?aim(3,{spread:.08,speed:3.5,every:1.5,max:3}):aim(1,{every:1.3,max:2})))));
}
function side(g,dir,y,{count=6,gap=.38,color=0,type='scout',speed=4.4,fire=aim(1,{max:1})}={}){
 for(let i=0;i<count;i++)g.after(i*gap,()=>g.spawn(type,-dir*9.5,y,typeof color==='function'?color(i):color,{kind:'side',dir,speed,y0:y},fire));
}
function debris(g,k){for(let j=0;j<4;j++)g.after(j*.12,()=>g.bullet(7.6,10+j*1.1,-.9-j*.18-(k%2)*.3,-2.7,3,.22));}
const cyc=i=>i%3;
// 1 / FLIGHT. One color, slow aimed shots, room to learn the ship.
at(3,g=>swoop(g,-1));at(7,g=>swoop(g,1));
at(11,g=>drop(g,[-4,0,4],{fire:aim(1,{every:1.4,max:2,speed:2.9})}));
at(15,g=>side(g,1,8.5));at(18.5,g=>side(g,-1,6));
at(22,g=>drop(g,[-3,3],{type:'lancer',stopY:6.5,hold:3}));
// 2 / DIMENSION CONTACT. Blue walls to fly through, then white arrives.
at(29,g=>drop(g,[0],{type:'heavy',stopY:7,hold:5}));
at(30,g=>swoop(g,-1));at(33,g=>swoop(g,1));
at(36.5,g=>drop(g,[-4.5,-1.5,1.5,4.5],{type:'lancer',stopY:8,gap:.25}));
at(41,g=>g.emit('cue',{id:'white'}));
at(42,g=>drop(g,[-4,4],{type:'heavy',color:1,hold:4.5}));
at(45,g=>swoop(g,-1,{color:1,count:6}));at(48,g=>swoop(g,1,{color:1,count:6}));
at(51,g=>side(g,1,8.5));at(52.2,g=>side(g,-1,6,{color:1}));
at(56,g=>{drop(g,[0],{type:'heavy',color:1,hold:4});drop(g,[-4.5,4.5],{type:'lancer',stopY:5.5});});
at(61,g=>{swoop(g,-1,{color:0});swoop(g,1,{color:1});});
// 3 / ALTERNATING PRESSURE. Red joins; waves alternate so every pilot gets work.
at(69,g=>drop(g,[0],{type:'heavy',color:2,hold:5}));
at(71,g=>g.emit('cue',{id:'red'}));
at(73,g=>swoop(g,-1,{color:2}));at(74.5,g=>swoop(g,1,{color:0}));
at(78,g=>drop(g,[-4.5,-1.5,1.5,4.5],{type:'lancer',color:cyc,stopY:8,gap:.3}));
at(83,g=>side(g,1,9));at(84.2,g=>side(g,-1,6,{color:2}));
at(88,g=>{drop(g,[-4],{type:'heavy',color:1,hold:4});drop(g,[4],{type:'heavy',color:2,hold:4});});
at(92,g=>swoop(g,-1,{color:1,count:6}));at(93.5,g=>swoop(g,1,{color:2,count:6}));
at(98,g=>drop(g,[-4,0,4],{type:'heavy',color:cyc,gap:.6,hold:3.5,stopY:i=>[7.5,6,7.5][i]}));
at(104,g=>side(g,1,8.5,{count:9,gap:.3,color:cyc}));
at(108,g=>{swoop(g,-1,{color:i=>i%2?2:0,count:6});swoop(g,1,{color:i=>i%2?0:1,count:6});});
at(113,g=>drop(g,[-5,-3,-1,1,3,5],{type:'lancer',color:cyc,stopY:i=>i%2?6:8.5,gap:.15,hold:2.2}));
// 4 / CROSS FIRE. Orange debris rounds that no pilot can cancel.
const fanO=(n=9)=>fan(n,{orange:true});
at(120,g=>{drop(g,[0],{type:'heavy',color:0,hold:4.5,fire:fanO()});g.after(1,()=>swoop(g,-1,{color:2}));});
at(124,g=>{side(g,1,9,{color:0});side(g,-1,7,{color:1});});
at(128,g=>drop(g,[-4.5,4.5],{type:'heavy',color:i=>[2,0][i],hold:4,fire:fanO(7)}));
at(132,g=>swoop(g,-1,{color:cyc,count:7,gap:.28}));at(133.5,g=>swoop(g,1,{color:i=>(i+1)%3,count:7,gap:.28}));
at(138,g=>{drop(g,[0],{type:'heavy',color:1,hold:4,fire:fanO()});drop(g,[-5,-3,3,5],{type:'lancer',color:i=>[0,2,0,2][i],stopY:5.5,gap:.2});});
at(144,g=>{side(g,1,9,{color:2});g.after(1,()=>side(g,-1,7,{color:0}));g.after(2,()=>side(g,1,5,{color:1}));});
at(150,g=>drop(g,[-4,0,4],{type:'heavy',color:i=>[2,1,0][i],gap:.5,hold:3.5,fire:fanO(7)}));
at(156,g=>{swoop(g,-1,{color:0,count:7,gap:.28});swoop(g,1,{color:2,count:7,gap:.28});});
at(161,g=>{drop(g,[-5,-2.5,0,2.5,5],{type:'lancer',color:cyc,stopY:8.5,gap:.12});g.after(1.4,()=>drop(g,[-3.75,-1.25,1.25,3.75],{type:'lancer',color:i=>(i+1)%3,stopY:6,gap:.12}));});
at(166,g=>{drop(g,[-4,4],{type:'heavy',color:i=>[1,2][i],hold:4,fire:fanO(7)});g.after(1.5,()=>side(g,1,9.5,{color:0,count:8,gap:.3}));});
// 5 / CARRIER DIVE. Burning debris pours off the carrier on the right;
// the enemy pushes down the open channel on the left.
for(let k=0;k<11;k++)at(179+k*4,g=>{debris(g,k);let c=k%3;if(k%3===0)side(g,1,9,{color:c,count:5});else if(k%3===1)drop(g,[-4.5,-1.5],{type:'lancer',color:i=>(c+i)%3,stopY:7});else drop(g,[-3],{type:k>5?'heavy':'lancer',color:c,hold:3,fire:k>5?fanO(7):undefined});});
// 6 / DIMENSION BREACH begins at 231 with the boss.

class Game {
 constructor(seed=3201){this.seed=seed;this.reset();}
 random(){this.seed=(1664525*this.seed+1013904223)>>>0;return this.seed/4294967296;}
 reset(){this.seed=3201;this.state='title';this.time=0;this.intro=0;this.outro=0;this.pilot=0;this.player={x:0,y:-6,hp:6,inv:0,vx:0,vy:0};this.enemies=[];this.bullets=[];this.shots=[];this.particles=[];this.items=[];this.rings=[];this.pending=[];this.events=[];this.score=0;this.cancels=0;this.kills=0;this.shifts=0;this.grazes=0;this.chain=0;this.maxChain=0;this.chainTimer=0;this.shotTimer=0;this.scriptIndex=0;this.wave=0;this.phase=0;this.boss=null;this.shiftAge=9;this.departing=0;this.gameOverCause='';this.uid=0;this.totalFired=0;this.totalDamage=0;this.itemScore=0;this.slow=0;this.focus=false;this.itemSound=0;}
 emit(type,data={}){this.events.push({type,...data});}
 after(delay,fn){this.pending.push({at:this.time+delay,fn});}
 start(){this.reset();this.state='intro';this.emit('start');}
 skipIntro(){if(this.state==='intro'){this.state='playing';this.emit('ikuze');}}
 shift(p){if(!['playing','intro'].includes(this.state)||p===this.pilot||p<0||p>2)return false;this.departing=this.pilot;this.pilot=p;this.shiftAge=0;this.shifts++;this.emit('shift',{pilot:p});return true;}
 pause(){if(this.state==='playing'||this.state==='intro'){this.beforePause=this.state;this.state='paused';}else if(this.state==='paused')this.state=this.beforePause;}
 burst(x,y,color,n=14,speed=5){for(let i=0;i<n;i++){let a=this.random()*Math.PI*2,s=1+this.random()*speed;this.particles.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:.3+this.random()*.55,max:.85,color});}if(this.particles.length>550)this.particles.splice(0,this.particles.length-550);}
 ring(x,y,size,color,life=.42){this.rings.push({x,y,size,color,life,max:life});if(this.rings.length>24)this.rings.shift();}
 // Bullets turned into score items fly to the player. Used for kills, boss phases, and the boss death.
 convert(filter,value){for(let b of this.bullets)if(!b.dead&&filter(b)){b.dead=true;this.items.push({x:b.x,y:b.y,vx:(this.random()-.5)*2,vy:1+this.random()*1.6,age:0,value});}this.bullets=this.bullets.filter(b=>!b.dead);if(this.items.length>400)this.items.splice(0,this.items.length-400);}
 hurt(){if(this.player.inv>0||this.state!=='playing')return;let p=this.player;p.hp--;this.totalDamage++;p.inv=1.55;this.chain=0;this.burst(p.x,p.y,3,25);this.ring(p.x,p.y,3.2,3,.5);
  // Mercy clear: bullets crowding the hitbox are erased so one mistake does not chain into two.
  for(let b of this.bullets)if(Math.hypot(b.x-p.x,b.y-p.y)<2.8){b.dead=true;this.burst(b.x,b.y,b.color,1);}this.bullets=this.bullets.filter(b=>!b.dead);
  this.emit('damage');if(p.hp<=0){this.state='dead';this.gameOverCause='FORMATION LOST';this.emit('dead');}}
 cancel(b){b.dead=true;this.cancels++;this.chain++;this.maxChain=Math.max(this.maxChain,this.chain);this.chainTimer=2.5;this.score+=20*Math.min(8,1+Math.floor(this.chain/12));this.burst(b.x,b.y,b.color,3);if(this.cancels%4===0)this.emit('cancel',{pilot:b.color});}
 bullet(x,y,vx,vy,color,r=.14,owner=0){this.bullets.push({id:++this.uid,x,y,vx,vy,color,r,age:0,dead:false,grazed:false,owner});}
 spawn(type,x,y,color,move=null,fire=null){let e={id:++this.uid,type,x,y,baseX:x,y0:y,color,hp:type==='heavy'?36:type==='lancer'?18:9,age:0,timer:fire?fire.first:type==='heavy'?1.9:1.6,telegraph:0,dead:false,r:type==='heavy'?.65:.44,move,fire,shotsLeft:fire?fire.max:Infinity,heading:0,flash:0,vx:0,vy:0};this.enemies.push(e);return e;}
 // Runs the next authored wave of the current section. Used by QA fixtures.
 spawnWave(){let from=PHASES[this.phase].at,w=SCRIPT.find(s=>s.t>=from)||SCRIPT[0];this.wave++;w.run(this);}
 moveEnemy(e,dt){let m=e.move,ox=e.x,oy=e.y;
  if(!m){e.y-=dt*(e.type==='heavy'?.9:1.4);e.x=e.baseX+Math.sin(e.age*(e.type==='lancer'?1.6:.9))*(e.type==='lancer'?1.4:.55);}
  else if(m.kind==='bezier'){let u=e.age/m.dur;if(u>=1){e.dead=true;return;}let [a,b,c,d]=m.pts,v=1-u;e.x=v*v*v*a[0]+3*v*v*u*b[0]+3*v*u*u*c[0]+u*u*u*d[0];e.y=v*v*v*a[1]+3*v*v*u*b[1]+3*v*u*u*c[1]+u*u*u*d[1];}
  else if(m.kind==='drop'){let t=e.age;if(t<m.enter){let k=t/m.enter,ease=1-(1-k)*(1-k)*(1-k);e.y=e.y0+(m.stopY-e.y0)*ease;}else if(t<m.enter+m.hold){e.y=m.stopY+Math.sin((t-m.enter)*1.7)*.12;e.x=e.baseX+Math.sin((t-m.enter)*1.1)*.25;}else{let k=t-m.enter-m.hold,s=Math.min(7,1+k*6);e.x+=m.exit[0]*s*dt;e.y+=m.exit[1]*s*dt;}}
  else if(m.kind==='side'){e.x+=m.dir*m.speed*dt;e.y=m.y0+Math.sin(e.age*1.9)*.45-e.age*.25;}
  e.vx=(e.x-ox)/dt;e.vy=(e.y-oy)/dt;
  // Face the direction of travel; slow movers settle back to facing the player.
  let sp=Math.hypot(e.vx,e.vy),want=m&&sp>1.2?Math.max(-1.4,Math.min(1.4,Math.atan2(e.vx,-e.vy))):0;e.heading+=(want-e.heading)*Math.min(1,dt*7);
  if(e.age>1.5&&(Math.abs(e.x)>13||e.y<-14||e.y>16))e.dead=true;}
 onScreen(e){return e.y<SCREEN.top&&e.y>SCREEN.bottom&&Math.abs(e.x)<SCREEN.x;}
 fireEnemy(e){let a=Math.atan2(this.player.y-e.y,this.player.x-e.x);
  if(e.fire){let f=e.fire;for(let j=0;j<f.n;j++){let b=a+(j-(f.n-1)/2)*f.spread;this.bullet(e.x,e.y-.2,Math.cos(b)*f.speed,Math.sin(b)*f.speed,e.color,e.type==='heavy'?.16:.14,e.id);}if(f.orange)this.bullet(e.x,e.y-.2,Math.cos(a)*5,Math.sin(a)*5,3,.2,e.id);this.emit('enemyFire');return;}
  let speed=this.phase<2?3.1:4.1;if(e.type==='heavy'){for(let j=-3;j<=3;j++)this.bullet(e.x,e.y,Math.cos(a+j*.19)*3.6,Math.sin(a+j*.19)*3.6,e.color,.14,e.id);if(this.phase>=3)this.bullet(e.x,e.y,Math.cos(a)*5,Math.sin(a)*5,3,.2,e.id);}else if(e.type==='lancer'){for(let j=-1;j<=1;j++)this.bullet(e.x+j*.32,e.y,Math.cos(a)*speed,Math.sin(a)*speed,e.color,.14,e.id);}else{let count=this.phase>1?3:1;for(let j=0;j<count;j++){let b=a+(j-(count-1)/2)*.22;this.bullet(e.x,e.y,Math.cos(b)*speed,Math.sin(b)*speed,e.color,.14,e.id);}}this.emit('enemyFire');}
 killEnemy(e){e.dead=true;this.kills++;let value=e.type==='heavy'?800:e.type==='lancer'?300:200;this.score+=value;this.burst(e.x,e.y,e.color,e.type==='heavy'?34:20,e.type==='heavy'?7:5);this.burst(e.x,e.y,1,e.type==='heavy'?12:6,3);this.ring(e.x,e.y,e.type==='heavy'?2.6:1.4,e.color);
  // A destroyed heavy takes its own bullets with it, paid out as score items.
  if(e.type==='heavy')this.convert(b=>b.owner===e.id&&b.color!==3,10);
  this.emit('explosion',{big:e.type==='heavy'});this.emit('popup',{x:e.x,y:e.y,text:String(value),big:e.type==='heavy'});}
 fire(){let p=PILOTS[this.pilot];if(this.pilot===1){for(let k=-1;k<=1;k++)this.shots.push({x:this.player.x+k*.2,y:this.player.y+.65,vx:k*2,vy:23,damage:p.damage,color:1,dead:false});}else if(this.pilot===0){for(let k of [-1,1])this.shots.push({x:this.player.x+k*.2,y:this.player.y+.7,vx:0,vy:27,damage:p.damage,color:0,dead:false});}else{for(let k of [-1,1])this.shots.push({x:this.player.x+k*.33,y:this.player.y+.7,vx:k*.3,vy:21,damage:p.damage,color:2,dead:false});}this.totalFired++;if(this.totalFired%3===0)this.emit('fire',{pilot:this.pilot});}
 spawnBoss(){this.enemies=[];this.bullets=[];this.pending=[];this.boss={x:0,y:15,hp:1500,maxHp:1500,age:0,timer:2,phase:0,color:0,cycle:0,telegraph:0,flash:0,dying:-1,boom:0,parts:[{x:-2.4,hp:150,max:150,flash:0},{x:2.4,hp:150,max:150,flash:0}]};this.emit('boss');}
 updateBoss(dt){let b=this.boss;if(!b)return;b.age+=dt;b.flash=Math.max(0,b.flash-dt);for(let part of b.parts)part.flash=Math.max(0,part.flash-dt);
  if(b.dying>=0){b.dying+=dt;b.y-=dt*.6;b.x+=Math.sin(b.dying*31)*.02;this.player.inv=Math.max(this.player.inv,.5);b.boom-=dt;
   if(b.boom<=0){b.boom=.13;let ox=(this.random()-.5)*4.4,oy=(this.random()-.5)*2.6;this.burst(b.x+ox,b.y+oy,this.random()<.5?2:3,18,6);this.ring(b.x+ox,b.y+oy,1.6+this.random()*1.4,3,.35);this.emit('explosion',{big:true});}
   if(b.dying>2.6){this.state='victory';for(let it of this.items){this.score+=it.value;this.itemScore+=it.value;}this.items=[];this.score+=15000+this.player.hp*1000;this.burst(b.x,b.y,3,130,9);this.burst(b.x,b.y,1,60,6);this.ring(b.x,b.y,7,1,.8);this.bullets=[];this.emit('victory');}
   return;}
  b.y+=((b.age<4?7.4:6.5)-b.y)*dt*1.3;b.x=Math.sin(b.age*.35)*2.35;let phase=b.hp>1000?0:b.hp>480?1:2;if(phase!==b.phase){b.phase=phase;this.convert(()=>true,20);this.ring(b.x,b.y,5,1,.6);b.timer=1.8;this.slow=.35;this.emit('bossPhase',{phase});}b.timer-=dt;b.telegraph=b.timer<.65?1-b.timer/.65:0;if(b.age>3&&b.timer<=0){b.color=b.cycle++%3;let aim=Math.atan2(this.player.y-b.y,this.player.x-b.x);if(b.phase===0){for(let j=-5;j<=5;j++){let a=aim+j*.12;this.bullet(b.x,b.y-1.4,Math.cos(a)*3.8,Math.sin(a)*3.8,b.color,.17);}}else if(b.phase===1){for(let s of [-1,1]){for(let j=-4;j<=4;j++){let a=-Math.PI/2+j*.17+s*.12;this.bullet(b.x+s*2.4,b.y-1,Math.cos(a)*4.2,Math.sin(a)*4.2,(b.color+(s===1?1:0))%3,.16);}}this.bullet(b.x,b.y-1.5,Math.cos(aim)*5.5,Math.sin(aim)*5.5,3,.24);}else{for(let j=0;j<21;j++){let a=-Math.PI+j*Math.PI/20+Math.sin(b.age)*.14;this.bullet(b.x,b.y-1.3,Math.cos(a)*4.5,Math.sin(a)*4.5,Math.floor(j/7)%3,.17);}for(let s of [-1,1]){this.bullet(b.x+s*1.3,b.y-1.5,Math.cos(aim)*5,Math.sin(aim)*5,3,.24);}}for(const part of b.parts)if(part.hp>0)this.bullet(b.x+part.x,b.y-1.3,Math.cos(aim)*4,Math.sin(aim)*4,(b.color+1)%3,.18);b.timer=b.phase===0?1.7:b.phase===1?1.65:1.45;this.emit('bossFire');}}
 updateItems(dt){let p=this.player,dying=this.boss&&this.boss.dying>=0;for(let it of this.items){it.age+=dt;if(it.age<.35&&!dying){it.x+=it.vx*dt;it.y+=it.vy*dt;it.vx*=.94;it.vy*=.94;}else{let dx=p.x-it.x,dy=p.y-it.y,d=Math.hypot(dx,dy)||1,s=Math.min(32,8+it.age*24);it.x+=dx/d*s*dt;it.y+=dy/d*s*dt;if(d<.6){it.dead=true;this.score+=it.value;this.itemScore+=it.value;if(++this.itemSound%5===0)this.emit('item');}}}this.items=this.items.filter(i=>!i.dead);}
 update(dt,input={}){dt=Math.min(dt,.05);if(this.state==='paused'||this.state==='title')return;if(this.slow>0){this.slow-=dt;dt*=.35;}this.shiftAge+=dt;for(let p of this.particles){p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt;}this.particles=this.particles.filter(p=>p.life>0);for(let r of this.rings)r.life-=dt;this.rings=this.rings.filter(r=>r.life>0);if(this.state==='intro'){this.intro+=dt;if(this.intro>=8)this.skipIntro();return;}if(this.state==='victory'){this.outro+=dt;return;}if(this.state!=='playing')return;
 this.time+=dt;let phase=PHASES.reduce((a,p,i)=>this.time>=p.at?i:a,0);if(phase!==this.phase){this.phase=phase;this.emit('phase',{phase});if(phase===5)this.spawnBoss();}
 // Waves more than a second late (after a QA time jump) are skipped rather than dumped at once.
 while(this.scriptIndex<SCRIPT.length&&this.time>=SCRIPT[this.scriptIndex].t){let w=SCRIPT[this.scriptIndex++];if(!this.boss&&this.time-w.t<1)w.run(this);}
 if(this.pending.length){let due=this.pending.filter(q=>this.time>=q.at);if(due.length){this.pending=this.pending.filter(q=>this.time<q.at);for(let q of due)q.fn();}}
 let p=this.player;this.focus=!!input.focus;let sp=PILOTS[this.pilot].speed*(this.focus?FOCUS:1),dx=input.x||0,dy=input.y||0,len=Math.hypot(dx,dy);if(len>1){dx/=len;dy/=len;}let oldX=p.x,oldY=p.y;if(input.target){let x=input.target.x-p.x,y=input.target.y-p.y,d=Math.hypot(x,y),step=Math.min(d,sp*1.65*dt);if(d>.02){p.x+=x/d*step;p.y+=y/d*step;}}else{p.x+=dx*sp*dt;p.y+=dy*sp*dt;}p.x=Math.max(-6.5,Math.min(6.5,p.x));p.y=Math.max(-7.8,Math.min(9,p.y));p.vx=(p.x-oldX)/dt;p.vy=(p.y-oldY)/dt;p.inv=Math.max(0,p.inv-dt);this.chainTimer-=dt;if(this.chainTimer<=0)this.chain=0;this.shotTimer-=dt;if(this.shotTimer<=0){this.fire();this.shotTimer+=PILOTS[this.pilot].rate;}
 for(let e of this.enemies){e.age+=dt;e.flash=Math.max(0,e.flash-dt);this.moveEnemy(e,dt);if(e.dead)continue;e.timer-=dt;e.telegraph=e.shotsLeft>0?(e.timer<.65?Math.min(1,1-e.timer/.65):0):0;
  // Enemies only fire while fully on screen and above the player's lane.
  if(e.timer<=0&&e.shotsLeft>0&&this.onScreen(e)){this.fireEnemy(e);e.shotsLeft--;e.timer=e.fire?e.fire.every:e.type==='heavy'?2.4:2.7;}
  if(Math.hypot(e.x-p.x,e.y-p.y)<e.r+.18)this.hurt();if(!e.move&&e.y<-12)e.dead=true;}
 this.updateBoss(dt);this.updateItems(dt);
 for(let s of this.shots){s.x+=s.vx*dt;s.y+=s.vy*dt;if(s.y>16)s.dead=true;for(let e of this.enemies){if(!e.dead&&!s.dead&&e.y<13&&Math.abs(s.x-e.x)<e.r+.1&&Math.abs(s.y-e.y)<e.r+.5){e.hp-=s.damage;e.flash=.06;s.dead=true;this.burst(s.x,s.y,s.color,2);if(e.hp<=0)this.killEnemy(e);}}let b=this.boss;if(b&&!s.dead&&b.age>2.4&&b.dying<0){for(let part of b.parts)if(part.hp>0&&Math.abs(s.x-(b.x+part.x))<.75&&Math.abs(s.y-(b.y-.5))<1.1){part.hp-=s.damage;part.flash=.06;s.dead=true;if(part.hp<=0){this.score+=2500;this.burst(b.x+part.x,b.y,3,45,7);this.ring(b.x+part.x,b.y,3,3);this.convert(()=>true,20);this.emit('explosion',{big:true});this.emit('popup',{x:b.x+part.x,y:b.y,text:'2500',big:true});}break;}if(!s.dead&&Math.abs(s.x-b.x)<1.75&&Math.abs(s.y-b.y)<1.5){b.hp-=s.damage;b.flash=.05;s.dead=true;this.burst(s.x,s.y,s.color,2);if(b.hp<=0){b.hp=0;b.dying=0;b.boom=0;this.slow=.9;this.convert(()=>true,50);this.emit('bossDown');break;}}}}
 for(let b of this.bullets){b.x+=b.vx*dt;b.y+=b.vy*dt;b.age+=dt;let d=Math.hypot(b.x-p.x,b.y-p.y);if(b.color===this.pilot&&d<.92+b.r)this.cancel(b);else if(d<.17+b.r){b.dead=true;this.hurt();}else if(!b.grazed&&d<.6){b.grazed=true;this.grazes++;this.score+=5;this.particles.push({x:b.x,y:b.y,vx:(b.x-p.x)*4,vy:(b.y-p.y)*4,life:.25,max:.85,color:1});}if(Math.abs(b.x)>13||b.y<-13||b.y>18||b.age>12)b.dead=true;}
 this.enemies=this.enemies.filter(e=>!e.dead);this.shots=this.shots.filter(s=>!s.dead);this.bullets=this.bullets.filter(b=>!b.dead);if(this.bullets.length>650)this.bullets.splice(0,this.bullets.length-650);
 }
 snapshot(){return {state:this.state,time:this.time,pilot:this.pilot,hp:this.player.hp,x:this.player.x,y:this.player.y,score:this.score,cancels:this.cancels,shifts:this.shifts,grazes:this.grazes,enemies:this.enemies.length,bullets:this.bullets.length,items:this.items.length,phase:this.phase,boss:this.boss?{hp:this.boss.hp,phase:this.boss.phase,dying:this.boss.dying,parts:this.boss.parts.map(p=>p.hp)}:null};}
}
root.BlackWing={Game,PILOTS,PHASES,SCRIPT};if(typeof module!=='undefined')module.exports=root.BlackWing;
})(typeof window!=='undefined'?window:globalThis);
