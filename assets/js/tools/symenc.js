"use strict";
/* Container format "SKE1": magic(4) | PBKDF2 iterations uint32 BE (4) | salt(16) | IV(12) | AES-256-GCM ciphertext+tag */
const SKE_MAGIC=[0x53,0x4b,0x45,0x31],SKE_MAX=300*1024*1024;
async function skeKey(pw,salt,iter,usage){const km=await crypto.subtle.importKey("raw",U.enc(pw),"PBKDF2",false,["deriveKey"]);return crypto.subtle.deriveKey({name:"PBKDF2",salt,iterations:iter,hash:"SHA-256"},km,{name:"AES-GCM",length:256},false,[usage])}
async function skeEncrypt(bytes,pw,iter){iter=iter||600000;if(!pw)throw new Error("Enter a password.");const salt=crypto.getRandomValues(new Uint8Array(16)),iv=crypto.getRandomValues(new Uint8Array(12)),key=await skeKey(pw,salt,iter,"encrypt"),ct=new Uint8Array(await crypto.subtle.encrypt({name:"AES-GCM",iv},key,bytes)),out=new Uint8Array(36+ct.length);
out.set(SKE_MAGIC,0);new DataView(out.buffer).setUint32(4,iter);out.set(salt,8);out.set(iv,24);out.set(ct,36);return out}
async function skeDecrypt(data,pw){if(!pw)throw new Error("Enter a password.");if(data.length<52||SKE_MAGIC.some((b,i)=>data[i]!==b))throw new Error("This is not data produced by this tool.");
const iter=new DataView(data.buffer,data.byteOffset).getUint32(4);if(iter<1000||iter>20000000)throw new Error("Invalid file header.");
try{return new Uint8Array(await crypto.subtle.decrypt({name:"AES-GCM",iv:data.slice(24,36)},await skeKey(pw,data.slice(8,24),iter,"decrypt"),data.slice(36)))}catch(e){throw new Error("Wrong password, or the data was changed.")}}
T.symenc=r=>{if(skNeedCrypto(r))return;
const[l1,mode]=sel("Mode",["Encrypt","Decrypt"]),[l2,kind]=sel("Input",["Text","File"]),[l3,it]=num("PBKDF2 iterations",100000,5000000,600000),txt=skArea("Text input",5,"Text to encrypt, or Base64 to decrypt"),file=el("input",{type:"file"}),[pw,sh,hide]=pwBox("Password"),o=skOut(r);file.setAttribute("aria-label","File input");
const fb=skBox("File (processed in memory, max 300 MB)",file),tb=skBox("Text",txt);const sync=()=>{fb.hidden=kind.value!=="File";tb.hidden=kind.value!=="Text"};kind.onchange=sync;
r.prepend(l1,l2,l3,el("br"),tb,fb,skBox("Password",pw),sh);sync();
const bar=el("div");bar.append(btn("Run",()=>skGuard(o,async()=>{const enc=mode.value==="Encrypt",iter=Math.min(5e6,Math.max(1e5,parseInt(it.value,10)||6e5));
if(kind.value==="Text"){if(!txt.value)throw new Error("Enter some text.");if(enc)o.set(U.b64(await skeEncrypt(U.enc(txt.value),pw.value,iter)),"Encrypted with AES-256-GCM. Keep the password safe; it cannot be recovered.");else{let t;try{t=U.dec(await skeDecrypt(U.unb64(txt.value),pw.value))}catch(e){if(e.name==="TypeError")throw new Error("Decrypted data is not text; use File mode.");throw e}o.set(t,"Decrypted.")}return}
const f=file.files&&file.files[0];if(!f)throw new Error("Choose a file.");if(f.size>SKE_MAX)throw new Error("File is too large for in-memory processing (300 MB limit).");
const buf=new Uint8Array(await f.arrayBuffer());if(enc){skSave(f.name+".ske",new Blob([await skeEncrypt(buf,pw.value,iter)]));o.set("",'Encrypted file downloaded as "'+f.name+'.ske".')}else{const d=await skeDecrypt(buf,pw.value);skSave(f.name.replace(/\.ske$/i,"")||"decrypted.bin",new Blob([d]));o.set("","Decrypted file downloaded.")}})),btn("Clear",()=>{txt.value="";pw.value="";hide();file.value="";o.clear()},1));r.append(bar)};
