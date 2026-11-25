"use strict";
function skSigParams(id,hash){return id==="RSA-PSS"?{name:"RSA-PSS",saltLength:32}:id==="ECDSA"?{name:"ECDSA",hash}:{name:"Ed25519"}}
async function skSign(id,o,privText,msg){const k=await skImport(privText,id,o,"private");return U.b64(await crypto.subtle.sign(skSigParams(id,o.hash),k,U.enc(msg)))}
async function skVerify(id,o,pubText,msg,sigB64){const k=await skImport(pubText,id,o,"public");return crypto.subtle.verify(skSigParams(id,o.hash),k,U.unb64(sigB64),U.enc(msg))}
T.signature=r=>{if(skNeedCrypto(r))return;
const c=skAlgControls(r,["ECDSA","Ed25519","RSA-PSS"],true),key=skArea("Key",5,"Private key to sign, or public key to verify (PEM or JWK)"),msg=skArea("Message",3,"Message"),sig=skArea("Signature",2,"Signature (Base64) for verification"),o=skOut(r);
r.prepend(skBox("Key",key),skBox("Message",msg),skBox("Signature (verify only)",sig));
r.append(btn("Sign",()=>skGuard(o,async()=>{o.set(await skSign(c.alg.value,c.opt(),key.value,msg.value),"Signature (Base64). ECDSA signatures use the raw r||s format used by Web Crypto and JWS.")})),
btn("Verify",()=>skGuard(o,async()=>{if(!sig.value.trim())throw new Error("Enter a signature to verify.");o.set((await skVerify(c.alg.value,c.opt(),key.value,msg.value,sig.value))?"VALID: signature matches the message and public key.":"INVALID: signature does not match.")}),1),btn("Clear",()=>{key.value="";msg.value="";sig.value="";o.clear()},1))};
