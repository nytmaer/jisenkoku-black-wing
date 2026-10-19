/* Version 2: supplied fighter art, decoded and matted once at startup.
   Original files remain untouched. Both renderers share the prepared canvases. */
(function(){
'use strict';
const defs={
 beta:{file:'Beta_Blue.png',label:'Beta Blue',height:2.8,anchor:.59,exhaust:[[-.39,-1.06],[.39,-1.06]]},
 wendigo:{file:'Wendigo_White.png',label:'Wendigo White',whiten:true,height:2.8,anchor:.59,exhaust:[[-.29,-.95],[.29,-.95]]},
 revo:{file:'Revo_Red.png',label:'Revo Red',redden:true,height:2.8,anchor:.59,exhaust:[[-.31,-1.05],[.31,-1.05]]},
 support:{file:'3211c563-b201-4b4f-87ab-579848f408de.png',label:'Allied support fighter',height:2.65,anchor:.59},
 interceptor:{file:'990e9330-82bc-48bb-b4bd-c3b8bfe9fd0e.png',label:'Dark interceptor',height:2.15,anchor:.55},
 neutralDrone:{file:'Neutral Drone.png',label:'Neutral Drone',height:1.7,anchor:.55},
 redDrone:{file:'Red Drone.png',label:'Red Drone',height:1.7,anchor:.55},
 buster:{file:'DF_Buster_Jet.png',label:'DF Buster',height:2.65,anchor:.55},
 busterAce:{file:'df43fc7d-c31d-40aa-b0c1-cb7062a9ea0b.png',label:'DF Buster variant',height:2.65,anchor:.55}
};
const prepared={},pilots=['revo','beta','wendigo'];
function matte(img,def){
 const w=img.naturalWidth,h=img.naturalHeight,n=w*h,canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;const ctx=canvas.getContext('2d',{willReadFrequently:true});ctx.drawImage(img,0,0);const data=ctx.getImageData(0,0,w,h),rgba=data.data;
 let rr=[],gg=[],bb=[],transparent=0;for(let x=0;x<w;x+=4)for(let y of [2,h-3]){let j=(y*w+x)*4;rr.push(rgba[j]);gg.push(rgba[j+1]);bb.push(rgba[j+2]);if(rgba[j+3]<10)transparent++;}
 const median=a=>a.sort((x,y)=>x-y)[a.length>>1];const key=[median(rr),median(gg),median(bb)],hasAlpha=transparent>rr.length*.5;
 const foreground=new Uint8Array(n),background=new Uint8Array(n),queue=new Int32Array(n);
 // Remove only key-colored pixels connected to the canvas edge. Interior
 // teal-gray armor is retained, even when it resembles the background.
 if(!hasAlpha){const eligible=new Uint8Array(n);for(let i=0;i<n;i++){let j=i*4,dr=rgba[j]-key[0],dg=rgba[j+1]-key[1],db=rgba[j+2]-key[2];eligible[i]=dr*dr+dg*dg+db*db<=42*42?1:0;}let head=0,tail=0;const add=p=>{if(eligible[p]&&!background[p]){background[p]=1;queue[tail++]=p;}};for(let x=0;x<w;x++){add(x);add((h-1)*w+x);}for(let y=1;y<h-1;y++){add(y*w);add(y*w+w-1);}while(head<tail){let p=queue[head++],x=p%w;if(x)add(p-1);if(x<w-1)add(p+1);if(p>=w)add(p-w);if(p<n-w)add(p+w);}}
 for(let i=0;i<n;i++){let j=i*4,dr=rgba[j]-key[0],dg=rgba[j+1]-key[1],db=rgba[j+2]-key[2];let enclosedGreen=def.file==='Red Drone.png'&&rgba[j+1]>rgba[j]*1.25&&rgba[j+1]>rgba[j+2]*1.13;foreground[i]=!background[i]&&!enclosedGreen&&rgba[j+3]>24?1:0;}
 // Keep the largest connected ship silhouette, removing isolated speckles.
 const seen=new Uint8Array(n);let largest=new Int32Array(0);
 for(let seed=0;seed<n;seed++){if(!foreground[seed]||seen[seed])continue;let head=0,tail=1;queue[0]=seed;seen[seed]=1;const add=p=>{if(foreground[p]&&!seen[p]){seen[p]=1;queue[tail++]=p;}};while(head<tail){let p=queue[head++],x=p%w;if(x)add(p-1);if(x<w-1)add(p+1);if(p>=w)add(p-w);if(p<n-w)add(p+w);}if(tail>largest.length)largest=queue.slice(0,tail);}
 if(largest.length<n*.03)throw new Error('Fighter silhouette could not be prepared');
 const keep=new Uint8Array(n);let x0=w,y0=h,x1=0,y1=0;for(let p of largest){keep[p]=1;let x=p%w,y=Math.floor(p/w);x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y);}
 for(let i=0;i<n;i++)if(!keep[i])rgba[i*4+3]=0;
 // Wendigo's supplied paint is a teal gray. Lift its mid and light tones toward a cool white while
 // leaving the dark ink lines and panel shading intact; the saturated yellow core crystal is untouched.
 if(def.whiten)for(let i=0;i<n;i++){if(!keep[i])continue;let j=i*4,r=rgba[j],g=rgba[j+1],b=rgba[j+2],mx=Math.max(r,g,b),mn=Math.min(r,g,b);if(r>140&&g>120&&b<110&&mx-mn>70)continue;let l=.299*r+.587*g+.114*b,k=l<28?0:l>95?1:(l-28)/67,v=l+(255-l)*.6*k*k*(3-2*k);rgba[j]=r*.08+v*.92*.96;rgba[j+1]=g*.08+v*.92*.985;rgba[j+2]=b*.08+v*.92;}
 // Revo's supplied armor is painted green. Rotate green hues to crimson, keeping each pixel's lightness
 // and shading; ink lines, grays, and the existing red / orange accents are left alone.
 if(def.redden)for(let i=0;i<n;i++){if(!keep[i])continue;let j=i*4,r=rgba[j]/255,g=rgba[j+1]/255,b=rgba[j+2]/255,mx=Math.max(r,g,b),mn=Math.min(r,g,b),d=mx-mn,l=(mx+mn)/2;if(d<.04)continue;let sat=d/(1-Math.abs(2*l-1)),h=mx===r?((g-b)/d+6)%6:mx===g?(b-r)/d+2:(r-g)/d+4;h*=60;if(h<55||h>185)continue;
  let nh=(353+(h-115)*.1+360)%360,ns=Math.min(1,sat*1.75+.18),nl=Math.min(.62,l*1.06),c=(1-Math.abs(2*nl-1))*ns,x=c*(1-Math.abs((nh/60)%2-1)),m=nl-c/2,k=Math.floor(nh/60),rr=[c,x,0,0,x,c][k],gg=[x,c,c,x,0,0][k],bb=[0,0,x,c,c,x][k];rgba[j]=(rr+m)*255;rgba[j+1]=(gg+m)*255;rgba[j+2]=(bb+m)*255;}
 ctx.putImageData(data,0,0);
 const pad=3,cw=x1-x0+1+pad*2,ch=y1-y0+1+pad*2,scale=Math.min(1,768/Math.max(cw,ch)),out=document.createElement('canvas');out.width=Math.round(cw*scale);out.height=Math.round(ch*scale);let o=out.getContext('2d');o.imageSmoothingQuality='high';o.drawImage(canvas,x0,y0,x1-x0+1,y1-y0+1,pad*scale,pad*scale,(cw-pad*2)*scale,(ch-pad*2)*scale);
 return {canvas:out,bounds:{x:x0,y:y0,width:x1-x0+1,height:y1-y0+1},sourceWidth:w,sourceHeight:h,foregroundPixels:largest.length,usedSourceAlpha:hasAlpha};
}
async function load(onProgress){let i=0;for(let [key,def] of Object.entries(defs)){let img=new Image();img.src=BLACK_WING_ASSET_DATA[def.file];await img.decode();prepared[key]={...def,...matte(img,def)};onProgress?.(++i,Object.keys(defs).length);await new Promise(resolve=>requestAnimationFrame(resolve));}return prepared;}
function enemyKey(type,color){return type==='heavy'?(color===0?'busterAce':'buster'):type==='lancer'?'interceptor':color===0?'redDrone':'neutralDrone';}
function sprite(key){let a=prepared[key],h=a.height,w=h*a.canvas.width/a.canvas.height;return {canvas:a.canvas,x:-w/2,y:-h*a.anchor,w,h};}
window.BlackWingArt={load,defs,prepared,pilots,enemyKey,sprite};
})();
