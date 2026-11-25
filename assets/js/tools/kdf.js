"use strict";
async function skPbkdf2(pw,salt,iter,hash,len){const km=await crypto.subtle.importKey("raw",pw,"PBKDF2",false,["deriveBits"]);return new Uint8Array(await crypto.subtle.deriveBits({name:"PBKDF2",salt,iterations:iter,hash},km,len*8))}
async function skHkdf(ikm,salt,info,hash,len){const km=await crypto.subtle.importKey("raw",ikm,"HKDF",false,["deriveBits"]);return new Uint8Array(await crypto.subtle.deriveBits({name:"HKDF",hash,salt,info},km,len*8))}
const skBytes=(s,f)=>f==="Hex"?U.unhex(s):U.enc(s);
T.kdf=r=>{if(skNeedCrypto(r))return;
const[l1,alg]=sel("Function",["PBKDF2","HKDF"]),[l2,hash]=sel("Hash",["SHA-256","SHA-512","SHA-384","SHA-1"]),[l3,it]=num("Iterations (PBKDF2)",1,10000000,600000),[l4,len]=num("Output bytes",1,128,32),[l5,fmt]=sel("Inputs are",["Text","Hex"]),
pw=el("input",{type:"password",autocomplete:"off"}),salt=el("input",{type:"text",autocomplete:"off"}),info=el("input",{type:"text",autocomplete:"off"}),o=skOut(r);pw.setAttribute("aria-label","Password or input key material");salt.setAttribute("aria-label","Salt");info.setAttribute("aria-label","HKDF info");
const ib=skBox("HKDF info (context label)",info),sync=()=>{ib.hidden=alg.value!=="HKDF";l3.hidden=alg.value!=="PBKDF2"};alg.onchange=sync;
r.prepend(l1,l2,l3,l4,l5,el("br"),skBox("Password / input key material",pw),skBox("Salt (use a random value, at least 16 bytes)",salt),ib);sync();
r.append(btn("Derive",()=>skGuard(o,async()=>{const L=Math.min(128,Math.max(1,parseInt(len.value,10)||32)),t0=performance.now();let d;
if(alg.value==="PBKDF2"){const n=Math.min(1e7,Math.max(1,parseInt(it.value,10)||1));d=await skPbkdf2(skBytes(pw.value,fmt.value),skBytes(salt.value,fmt.value),n,hash.value,L);const ms=performance.now()-t0;o.set(U.hex(d),"PBKDF2-HMAC-"+hash.value+": "+n.toLocaleString()+" iterations took "+Math.round(ms)+" ms on this device. Base64: "+U.b64(d))}
else{d=await skHkdf(skBytes(pw.value,fmt.value),skBytes(salt.value,fmt.value),skBytes(info.value,fmt.value),hash.value,L);o.set(U.hex(d),"HKDF-"+hash.value+". Base64: "+U.b64(d))}})),btn("Clear",()=>{pw.value="";salt.value="";info.value="";o.clear()},1))};
