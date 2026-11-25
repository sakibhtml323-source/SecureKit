"use strict";
/* SecureKit QR encoder: original implementation following ISO/IEC 18004 (byte mode, error correction level M, versions 1-40). No external library. */
const QR=(()=>{
const ECC=[10,16,26,18,24,16,18,22,22,26,30,22,22,24,24,28,28,26,26,26,26,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28];
const BLK=[1,1,1,2,2,4,4,4,5,5,5,8,9,9,10,10,11,13,14,16,17,17,18,20,21,23,25,26,28,29,31,33,35,37,38,40,43,45,47,49];
function raw(v){let r=(16*v+128)*v+64;if(v>=2){const n=Math.floor(v/7)+2;r-=(25*n-10)*n-55;if(v>=7)r-=36}return r}
function dataCw(v){return Math.floor(raw(v)/8)-ECC[v-1]*BLK[v-1]}
function mul(x,y){let z=0;for(let i=7;i>=0;i--){z=(z<<1)^((z>>>7)*0x11D);z^=((y>>>i)&1)*x}return z}
function divisor(d){const r=new Array(d-1).fill(0);r.push(1);let root=1;for(let i=0;i<d;i++){for(let j=0;j<r.length;j++){r[j]=mul(r[j],root);if(j+1<r.length)r[j]^=r[j+1]}root=mul(root,2)}return r}
function remainder(data,div){const r=div.map(()=>0);for(const b of data){const f=b^r.shift();r.push(0);div.forEach((c,i)=>{r[i]^=mul(c,f)})}return r}
function encode(text){
const bytes=new TextEncoder().encode(text);let v=1;
for(;;v++){if(v>40)throw new Error("too long");if(4+(v<10?8:16)+8*bytes.length<=dataCw(v)*8)break}
const bits=[],put=(x,n)=>{for(let i=n-1;i>=0;i--)bits.push((x>>>i)&1)};
put(4,4);put(bytes.length,v<10?8:16);bytes.forEach(b=>put(b,8));
put(0,Math.min(4,dataCw(v)*8-bits.length));while(bits.length%8)bits.push(0);
const data=[];for(let i=0;i<bits.length;i+=8){let x=0;for(let j=0;j<8;j++)x=x<<1|bits[i+j];data.push(x)}
for(let p=0xEC;data.length<dataCw(v);p^=0xEC^0x11)data.push(p);
const nb=BLK[v-1],ne=ECC[v-1],rc=Math.floor(raw(v)/8),ns=nb-rc%nb,sl=Math.floor(rc/nb),div=divisor(ne),blocks=[];
for(let i=0,k=0;i<nb;i++){const d=data.slice(k,k+sl-ne+(i<ns?0:1));k+=d.length;const e=remainder(d,div);if(i<ns)d.push(0);blocks.push(d.concat(e))}
const all=[];for(let i=0;i<blocks[0].length;i++)blocks.forEach((b,j)=>{if(i!==sl-ne||j>=ns)all.push(b[i])});
const n=v*4+17,m=Array.from({length:n},()=>new Array(n).fill(false)),f=Array.from({length:n},()=>new Array(n).fill(false));
const set=(x,y,d)=>{m[y][x]=d;f[y][x]=true};
for(let i=0;i<n;i++){set(6,i,i%2===0);set(i,6,i%2===0)}
const finder=(cx,cy)=>{for(let dy=-4;dy<=4;dy++)for(let dx=-4;dx<=4;dx++){const d=Math.max(Math.abs(dx),Math.abs(dy)),x=cx+dx,y=cy+dy;if(x>=0&&x<n&&y>=0&&y<n)set(x,y,d!==2&&d!==4)}};
finder(3,3);finder(n-4,3);finder(3,n-4);
let pos=[];if(v>1){const na=Math.floor(v/7)+2,step=v===32?26:Math.ceil((v*4+4)/(na*2-2))*2;pos=[6];for(let p=n-7;pos.length<na;p-=step)pos.splice(1,0,p)}
const L=pos.length-1;
for(let i=0;i<=L;i++)for(let j=0;j<=L;j++){if((i===0&&j===0)||(i===0&&j===L)||(i===L&&j===0))continue;for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++)set(pos[i]+dx,pos[j]+dy,Math.max(Math.abs(dx),Math.abs(dy))!==1)}
const fmt=mask=>{let r=mask;for(let i=0;i<10;i++)r=(r<<1)^((r>>>9)*0x537);const b=((mask<<10)|r)^0x5412,g=i=>((b>>>i)&1)!==0;
for(let i=0;i<=5;i++)set(8,i,g(i));set(8,7,g(6));set(8,8,g(7));set(7,8,g(8));for(let i=9;i<15;i++)set(14-i,8,g(i));
for(let i=0;i<8;i++)set(n-1-i,8,g(i));for(let i=8;i<15;i++)set(8,n-15+i,g(i));set(8,n-8,true)};
fmt(0);
if(v>=7){let r=v;for(let i=0;i<12;i++)r=(r<<1)^((r>>>11)*0x1F25);const b=v<<12|r;for(let i=0;i<18;i++){const bit=((b>>>i)&1)!==0,a=n-11+i%3,c=Math.floor(i/3);set(a,c,bit);set(c,a,bit)}}
let k=0;
for(let right=n-1;right>=1;right-=2){if(right===6)right=5;for(let vert=0;vert<n;vert++)for(let j=0;j<2;j++){const x=right-j,y=((right+1)&2)===0?n-1-vert:vert;if(!f[y][x]&&k<all.length*8){m[y][x]=((all[k>>>3]>>>(7-(k&7)))&1)!==0;k++}}}
const MASKS=[(x,y)=>(x+y)%2===0,(x,y)=>y%2===0,(x,y)=>x%3===0,(x,y)=>(x+y)%3===0,(x,y)=>(Math.floor(x/3)+Math.floor(y/2))%2===0,(x,y)=>x*y%2+x*y%3===0,(x,y)=>(x*y%2+x*y%3)%2===0,(x,y)=>((x+y)%2+x*y%3)%2===0];
const mask=i=>{for(let y=0;y<n;y++)for(let x=0;x<n;x++)if(!f[y][x]&&MASKS[i](x,y))m[y][x]=!m[y][x]};
const pen=()=>{let p=0,dark=0;for(let y=0;y<n;y++){let r=1,c=1;for(let x=1;x<=n;x++){if(x<n&&m[y][x]===m[y][x-1])r++;else{if(r>=5)p+=r-2;r=1}if(x<n&&m[x][y]===m[x-1][y])c++;else{if(c>=5)p+=c-2;c=1}}
for(let x=0;x<n;x++){if(m[y][x])dark++;if(x<n-1&&y<n-1&&m[y][x]===m[y][x+1]&&m[y][x]===m[y+1][x]&&m[y][x]===m[y+1][x+1])p+=3}}
return p+(Math.ceil(Math.abs(dark*20-n*n*10)/(n*n))-1)*10};
let best=0,bp=Infinity;for(let i=0;i<8;i++){mask(i);fmt(i);const p=pen();if(p<bp){bp=p;best=i}mask(i)}
mask(best);fmt(best);return{size:n,m,version:v}}
function svg(q,quiet=4){const s=q.size+quiet*2;let d="";for(let y=0;y<q.size;y++)for(let x=0;x<q.size;x++)if(q.m[y][x])d+="M"+(x+quiet)+","+(y+quiet)+"h1v1h-1z";
return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+s+" "+s+'" shape-rendering="crispEdges"><rect width="'+s+'" height="'+s+'" fill="#fff"/><path d="'+d+'" fill="#000"/></svg>'}
function png(q,cb,quiet=4,scale=8){const s=(q.size+quiet*2)*scale,c=document.createElement("canvas");c.width=c.height=s;const g=c.getContext("2d");if(!g){cb(null);return}
g.fillStyle="#fff";g.fillRect(0,0,s,s);g.fillStyle="#000";for(let y=0;y<q.size;y++)for(let x=0;x<q.size;x++)if(q.m[y][x])g.fillRect((x+quiet)*scale,(y+quiet)*scale,scale,scale);c.toBlob(cb,"image/png")}
return{encode,svg,png}})();
function saveBlob(name,blob){const u=URL.createObjectURL(blob),a=el("a",{href:u,download:name});a.click();setTimeout(()=>URL.revokeObjectURL(u),1000)}
if(typeof T!=="undefined")T.qr=r=>{
const[tl,type]=sel("Type",["Text","URL","Wi-Fi","Email","Phone"]),main=el("input",{type:"text",autocomplete:"off",spellcheck:false}),wp=el("input",{type:"password",autocomplete:"off"}),[sl,sec]=sel("Security",["WPA","WEP","nopass"]);
const ml=el("label",{htmlFor:"qrmain"},"Content"),pl=el("label",{htmlFor:"qrpw"},"Wi-Fi password");main.id="qrmain";wp.id="qrpw";
const st=el("p",{className:"note"}),img=el("img",{alt:"Generated QR code",width:256,height:256}),box=el("div");img.hidden=true;img.style.background="#fff";st.setAttribute("role","status");
let cur=null;
const sync=()=>{const t=type.value,w=t==="Wi-Fi";ml.textContent=w?"Network name (SSID)":t==="URL"?"URL (https://…)":t==="Email"?"Email address":t==="Phone"?"Phone number":"Text";sl.hidden=!w;wp.hidden=pl.hidden=!w||sec.value==="nopass";main.type="text"};
type.onchange=sync;sec.onchange=sync;
const content=()=>{const t=type.value,a=main.value.trim();if(!a)throw new Error("Enter some content first.");
if(t==="URL"){if(!/^https?:\/\/\S+$/i.test(a))throw new Error("Enter a valid http(s) URL.");return a}
if(t==="Email"){if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(a))throw new Error("Enter a valid email address.");return"mailto:"+a}
if(t==="Phone"){const p=a.replace(/[^\d+]/g,"");if(p.replace(/\D/g,"").length<3)throw new Error("Enter a valid phone number.");return"tel:"+p}
if(t==="Wi-Fi"){const e=s=>s.replace(/([\\;,:"])/g,"\\$1");return"WIFI:T:"+sec.value+";S:"+e(a)+";"+(sec.value!=="nopass"&&wp.value?"P:"+e(wp.value)+";":"")+";"}
return main.value};
const gen=()=>{try{cur=QR.encode(content());img.src="data:image/svg+xml;charset=utf-8,"+encodeURIComponent(QR.svg(cur));img.hidden=false;box.hidden=false;st.textContent="QR code generated."}
catch(e){cur=null;img.hidden=true;box.hidden=true;st.textContent=e.message==="too long"?"Content is too large for a QR code.":e.message||"Could not generate a QR code."}};
const bar=el("div");bar.append(btn("Download PNG",()=>cur&&QR.png(cur,b=>b?saveBlob("qr-code.png",b):st.textContent="PNG download failed."),1),btn("Download SVG",()=>cur&&saveBlob("qr-code.svg",new Blob([QR.svg(cur)],{type:"image/svg+xml"})),1),
btn("Share page",async b=>{const u=location.href.split("#")[0];if(navigator.share){try{await navigator.share({title:"SecureKit QR Generator",url:u})}catch(e){}}else copy(u,b)},1));box.append(bar);box.hidden=true;
r.append(tl,el("br"),ml,main,pl,wp,sl,el("br"),btn("Generate",gen),btn("Clear",()=>{main.value="";wp.value="";cur=null;img.hidden=true;box.hidden=true;st.textContent=""},1),st,el("div",{},img),box,el("p",{className:"note",textContent:"Your QR content is processed locally in your browser. Share copies only this page's address, never your QR content."}));
sync()};
