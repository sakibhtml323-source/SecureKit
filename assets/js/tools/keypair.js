"use strict";
T.keypair=r=>{if(skNeedCrypto(r))return;
const c=skAlgControls(r,["ECDSA","Ed25519","RSA-PSS","RSA-OAEP","ECDH","X25519"],false),[lb,bits]=sel("RSA size",["2048","3072","4096"]);r.append(lb);
const sync=()=>{lb.hidden=!c.alg.value.startsWith("RSA")};c.alg.addEventListener("change",sync);sync();
const names=["Public key (PEM)","Private key (PEM)","Public key (JWK)","Private key (JWK)"],outs=names.map(n=>skOut(r,n)),st=el("p",{className:"note"});
r.prepend(el("p",{className:"note",textContent:"Keys are generated in your browser and are not stored or sent. Copy the private key to a safe place; it is only shown here."}));
r.append(btn("Generate key pair",async()=>{outs.forEach(o=>o.clear());st.textContent="Generating…";try{const k=await skGen(c.alg.value,{curve:c.curve.value,bits:+bits.value});[k.pubPem,k.privPem,k.pubJwk,k.privJwk].forEach((v,i)=>outs[i].set(v));st.textContent="Done."}catch(e){st.textContent=skMsg(e)}}),st)};
