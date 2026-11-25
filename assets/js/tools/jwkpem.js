"use strict";
async function skConvert(text,id,o){const t=String(text||"").trim(),{role,key}=await skImportAuto(t,id,o);return t[0]==="{"?{from:"JWK",to:"PEM",role,out:await skExport(key,"pem")}:{from:"PEM",to:"JWK",role,out:await skExport(key,"jwk")}}
T.jwkpem=r=>{if(skNeedCrypto(r))return;
const c=skAlgControls(r,["ECDSA","ECDH","Ed25519","X25519","RSA-PSS","RSA-OAEP"],true),inp=skArea("Key",8,"Paste a JWK (JSON) or a PEM key (BEGIN PUBLIC KEY / BEGIN PRIVATE KEY)"),o=skOut(r);
r.prepend(skBox("Key (direction is detected automatically)",inp));
r.append(btn("Convert",()=>skGuard(o,async()=>{const x=await skConvert(inp.value,c.alg.value,c.opt());o.set(x.out,x.from+" to "+x.to+" ("+x.role+" key)")})),btn("Clear",()=>{inp.value="";o.clear()},1))};
