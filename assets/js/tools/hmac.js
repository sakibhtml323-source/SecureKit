"use strict";
async function skHmac(hash,key,msg,keyFmt){const k=await crypto.subtle.importKey("raw",keyFmt==="Hex"?U.unhex(key):U.enc(key),{name:"HMAC",hash},false,["sign"]);return new Uint8Array(await crypto.subtle.sign("HMAC",k,U.enc(msg)))}
function skSigNorm(s){return s.trim().replace(/^sha(1|256|384|512)=/i,"")}
async function skHmacVerify(sig,expected){const e=skSigNorm(expected);return U.ctEq(U.hex(sig),e.toLowerCase())||U.ctEq(U.b64(sig),e)||U.ctEq(U.b64url(sig),e)}
T.hmac=r=>{if(skNeedCrypto(r))return;
const msg=skArea("Message",4,"Message or webhook body (exact bytes as received)"),key=el("input",{type:"password",autocomplete:"off"}),exp=el("input",{type:"text",autocomplete:"off",placeholder:"Expected signature (hex or Base64, optional sha256= prefix)"}),
[l1,alg]=sel("Hash",["SHA-256","SHA-384","SHA-512","SHA-1"]),[l2,kf]=sel("Key format",["Text","Hex"]),[l3,of]=sel("Output",["Hex","Base64"]);key.setAttribute("aria-label","Secret key");exp.setAttribute("aria-label","Expected signature");
const o=skOut(r);r.prepend(skBox("Message",msg),skBox("Secret key",key),l1,l2,l3,el("br"));
const run=async()=>{const s=await skHmac(alg.value,key.value,msg.value,kf.value);return s};
r.append(skBox("Verify a signature (constant-time compare)",exp));
const bar=el("div");bar.append(btn("Compute HMAC",()=>skGuard(o,async()=>{const s=await run();o.set(of.value==="Hex"?U.hex(s):U.b64(s),"HMAC-"+alg.value)})),
btn("Verify",()=>skGuard(o,async()=>{if(!exp.value.trim())throw new Error("Enter the expected signature first.");const s=await run();o.set((await skHmacVerify(s,exp.value))?"VALID: signature matches.":"INVALID: signature does not match.")}),1),btn("Clear",()=>{msg.value="";key.value="";exp.value="";o.clear()},1));r.append(bar)};
