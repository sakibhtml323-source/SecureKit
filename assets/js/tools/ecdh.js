"use strict";
function skEcdhBits(id,curve){return id==="X25519"?256:curve==="P-521"?528:curve==="P-384"?384:256}
async function skEcdh(id,o,privText,pubText,info){const priv=await skImport(privText,id,o,"private"),pub=await skImport(pubText,id,o,"public"),bits=skEcdhBits(id,o.curve);
const secret=new Uint8Array(await crypto.subtle.deriveBits({name:id,public:pub},priv,bits));
const hk=await crypto.subtle.importKey("raw",secret,"HKDF",false,["deriveBits"]),key=new Uint8Array(await crypto.subtle.deriveBits({name:"HKDF",hash:"SHA-256",salt:new Uint8Array(0),info:U.enc(info||"")},hk,256));
return{secret:U.hex(secret),key:U.hex(key)}}
T.ecdh=r=>{if(skNeedCrypto(r))return;
const c=skAlgControls(r,["ECDH","X25519"],false),priv=skArea("Your private key",5,"Your private key (PEM or JWK)"),pub=skArea("Peer public key",5,"The other party's public key (PEM or JWK)"),info=el("input",{type:"text",value:"securekit-ecdh"}),o1=skOut(r,"Raw shared secret (hex)"),o2=skOut(r,"HKDF-SHA-256 derived 256-bit key (hex)");info.setAttribute("aria-label","HKDF info");
r.prepend(skBox("Your private key",priv),skBox("Peer public key",pub),skBox("HKDF info label",info));
r.append(btn("Derive shared secret",async()=>{o1.clear();o2.clear();try{const s=await skEcdh(c.alg.value,c.opt(),priv.value,pub.value,info.value);o1.set(s.secret,"Both parties derive the same secret. Use the HKDF output as the key, not the raw secret.");o2.set(s.key)}catch(e){o1.err(skMsg(e))}}),btn("Clear",()=>{priv.value="";pub.value="";o1.clear();o2.clear()},1))};
