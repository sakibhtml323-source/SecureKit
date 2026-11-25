"use strict";
async function skSshFingerprint(line){const parts=String(line||"").trim().split(/\s+/);if(parts.length<2)throw new Error("Paste a public key line such as: ssh-ed25519 AAAA... comment");
const type=parts[0],blob=U.unb64(parts[1]),dv=new DataView(blob.buffer,blob.byteOffset,blob.byteLength);if(blob.length<8)throw new Error("Key data is too short.");
const n=dv.getUint32(0);if(n>blob.length-4||U.dec(blob.slice(4,4+n))!==type)throw new Error("The key type does not match the key data.");
const sha=new Uint8Array(await crypto.subtle.digest("SHA-256",blob));return{type,bytes:blob.length,sha256:"SHA256:"+U.b64(sha).replace(/=+$/,""),md5:md5(blob).match(/../g).join(":")}}
T.sshfp=r=>{if(skNeedCrypto(r))return;const inp=skArea("SSH public key",3,"ssh-ed25519 AAAAC3... user@host"),o=skOut(r);
r.prepend(skBox("Public key (one line from a .pub file or authorized_keys)",inp));
r.append(btn("Fingerprint",()=>skGuard(o,async()=>{const f=await skSshFingerprint(inp.value);o.set(f.sha256+"\nMD5:"+f.md5,f.type+", "+f.bytes+" bytes. Compare the SHA256 value with what ssh or your host shows.")})),btn("Clear",()=>{inp.value="";o.clear()},1))};
