"use strict";
async function skHotp(key,counter,digits,hash){const buf=new ArrayBuffer(8),dv=new DataView(buf);dv.setUint32(0,Math.floor(counter/4294967296));dv.setUint32(4,counter>>>0);
const k=await crypto.subtle.importKey("raw",key,{name:"HMAC",hash},false,["sign"]),h=new Uint8Array(await crypto.subtle.sign("HMAC",k,buf)),o=h[h.length-1]&15,n=(((h[o]&127)<<24)|(h[o+1]<<16)|(h[o+2]<<8)|h[o+3])>>>0;return String(n%Math.pow(10,digits)).padStart(digits,"0")}
const skTotp=(key,t,period,digits,hash)=>skHotp(key,Math.floor(t/period),digits,hash);
async function skTotpVerify(key,code,t,period,digits,hash,win){code=String(code).replace(/\s/g,"");for(let d=-win;d<=win;d++){if(U.ctEq(await skTotp(key,t+d*period,period,digits,hash),code))return d}return null}
T.totp=r=>{if(skNeedCrypto(r))return;
const sec=el("input",{type:"password",autocomplete:"off"}),[l1,mode]=sel("Type",["TOTP","HOTP"]),[l2,alg]=sel("Algorithm",["SHA-1","SHA-256","SHA-512"]),[l3,dg]=num("Digits",6,8,6),[l4,per]=num("Period (s)",10,120,30),[l5,ctr]=num("HOTP counter",0,9007199254740991,0),vin=el("input",{type:"text",autocomplete:"off"}),code=el("div",{className:"out",textContent:"—"}),info=el("p",{className:"note"});
sec.setAttribute("aria-label","Base32 secret");vin.setAttribute("aria-label","Code to verify");code.setAttribute("aria-live","polite");info.setAttribute("role","status");let timer=null;
const cfg=()=>({d:Math.min(8,Math.max(6,+dg.value||6)),p:Math.min(120,Math.max(10,+per.value||30)),h:alg.value,key:U.unb32(sec.value)});
const sync=()=>{l4.hidden=mode.value!=="TOTP";l5.hidden=mode.value!=="HOTP"};mode.onchange=sync;sync();
const tick=async()=>{try{const c=cfg();if(mode.value==="TOTP"){const now=Math.floor(Date.now()/1000);code.textContent=await skTotp(c.key,now,c.p,c.d,c.h);info.textContent="Valid for "+(c.p-now%c.p)+" more seconds."}else{code.textContent=await skHotp(c.key,Math.max(0,Math.floor(+ctr.value)||0),c.d,c.h);info.textContent="HOTP code for counter "+(+ctr.value||0)+"."}}catch(e){stop();code.textContent="—";info.textContent=skMsg(e)}};
const stop=()=>{if(timer){clearInterval(timer);timer=null}};
r.prepend(l1,l2,l3,l4,l5,el("br"),skBox("Base32 secret (as shown when you enable 2FA)",sec));
r.append(btn("Generate code",()=>{stop();tick();if(mode.value==="TOTP"&&!timer)timer=setInterval(tick,1000)}),btn("Stop",()=>{stop()},1),btn("Clear",()=>{stop();sec.value="";vin.value="";code.textContent="—";info.textContent=""},1),el("p",{className:"note",textContent:"Current code"}),code,info,skBox("Verify a code (accepts one step before and after)",vin),
btn("Verify",async()=>{try{const c=cfg();if(mode.value!=="TOTP"){info.textContent="Verification here is for TOTP.";return}const d=await skTotpVerify(c.key,vin.value,Math.floor(Date.now()/1000),c.p,c.d,c.h,1);info.textContent=d===null?"INVALID: code does not match.":"VALID (time offset "+d+" step"+(d===1||d===-1?"":"s")+").";}catch(e){info.textContent=skMsg(e)}},1))};
