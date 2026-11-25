"use strict";
async function skRsaEncrypt(pubText,msg,hash){const k=await skImport(pubText,"RSA-OAEP",{hash},"public");return U.b64(await crypto.subtle.encrypt({name:"RSA-OAEP"},k,U.enc(msg)))}
async function skRsaDecrypt(privText,b64,hash){const k=await skImport(privText,"RSA-OAEP",{hash},"private");try{return U.dec(new Uint8Array(await crypto.subtle.decrypt({name:"RSA-OAEP"},k,U.unb64(b64))))}catch(e){throw new Error("Decryption failed. Check the private key, hash and ciphertext.")}}
T.rsaoaep=r=>{if(skNeedCrypto(r))return;
const[l1,mode]=sel("Mode",["Encrypt","Decrypt"]),[l2,hash]=sel("OAEP hash",["SHA-256","SHA-384","SHA-512","SHA-1"]),key=skArea("Key",6,"-----BEGIN PUBLIC KEY----- (encrypt) or -----BEGIN PRIVATE KEY----- (decrypt), or a JWK"),inp=skArea("Input",4,"Text to encrypt, or Base64 ciphertext to decrypt"),o=skOut(r);
r.prepend(l1,l2,el("br"),skBox("Key",key),skBox("Input",inp));
r.append(btn("Run",()=>skGuard(o,async()=>{if(mode.value==="Encrypt"){if(!inp.value)throw new Error("Enter a message.");o.set(await skRsaEncrypt(key.value,inp.value,hash.value),"RSA-OAEP ciphertext (Base64). Limit: about key size minus hash overhead, e.g. 190 bytes for RSA-2048 with SHA-256.")}else o.set(await skRsaDecrypt(key.value,inp.value,hash.value),"Decrypted.")})),btn("Clear",()=>{key.value="";inp.value="";o.clear()},1))};
