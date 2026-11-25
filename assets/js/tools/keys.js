"use strict";
/* Web Crypto key helpers shared by key-pair, RSA-OAEP, signature, ECDH and JWK/PEM tools. */
function skAlg(id,o){o=o||{};const hash=o.hash||"SHA-256",curve=o.curve||"P-256";
switch(id){
case"RSA-OAEP":return{a:{name:"RSA-OAEP",hash},pub:["encrypt"],priv:["decrypt"],rsa:true};
case"RSA-PSS":return{a:{name:"RSA-PSS",hash},pub:["verify"],priv:["sign"],rsa:true};
case"ECDSA":return{a:{name:"ECDSA",namedCurve:curve},pub:["verify"],priv:["sign"]};
case"ECDH":return{a:{name:"ECDH",namedCurve:curve},pub:[],priv:["deriveBits"]};
case"Ed25519":return{a:{name:"Ed25519"},pub:["verify"],priv:["sign"]};
case"X25519":return{a:{name:"X25519"},pub:[],priv:["deriveBits"]};}
throw new Error("Unknown algorithm.")}
async function skExport(key,fmt){if(fmt==="jwk")return JSON.stringify(await crypto.subtle.exportKey("jwk",key),null,2);
return key.type==="private"?U.pem("PRIVATE KEY",await crypto.subtle.exportKey("pkcs8",key)):U.pem("PUBLIC KEY",await crypto.subtle.exportKey("spki",key))}
async function skGen(id,o){o=o||{};const s=skAlg(id,o),p=s.rsa?Object.assign({},s.a,{modulusLength:o.bits||2048,publicExponent:new Uint8Array([1,0,1])}):s.a;
const kp=await crypto.subtle.generateKey(p,true,s.pub.concat(s.priv));
return{pubPem:await skExport(kp.publicKey,"pem"),privPem:await skExport(kp.privateKey,"pem"),pubJwk:await skExport(kp.publicKey,"jwk"),privJwk:await skExport(kp.privateKey,"jwk")}}
async function skImport(text,id,o,role){const s=skAlg(id,o),t=String(text||"").trim();if(!t)throw new Error("Paste a key first.");
if(t[0]==="{"){let j;try{j=JSON.parse(t)}catch(e){throw new Error("The JWK is not valid JSON.")}
delete j.key_ops;delete j.ext;delete j.alg;if(role==="public"){for(const k of["d","p","q","dp","dq","qi","oth"])delete j[k]}
else if(!j.d)throw new Error("This JWK is a public key; a private key is required here.");
return crypto.subtle.importKey("jwk",j,s.a,true,role==="public"?s.pub:s.priv)}
const{label,der}=U.unpem(t);
if(label==="RSA PRIVATE KEY"||label==="RSA PUBLIC KEY"||label==="EC PRIVATE KEY")throw new Error("PKCS#1/SEC1 keys are not supported. Convert first with: openssl pkcs8 -topk8 -nocrypt");
if(role==="private"){if(label!=="PRIVATE KEY")throw new Error("A private key (BEGIN PRIVATE KEY) is required here.");return crypto.subtle.importKey("pkcs8",der,s.a,true,s.priv)}
if(label!=="PUBLIC KEY")throw new Error("A public key (BEGIN PUBLIC KEY) is required here.");return crypto.subtle.importKey("spki",der,s.a,true,s.pub)}
async function skImportAuto(text,id,o){const t=String(text||"").trim();let role;
if(t[0]==="{"){try{role=JSON.parse(t).d?"private":"public"}catch(e){throw new Error("The JWK is not valid JSON.")}}else role=U.unpem(t).label==="PRIVATE KEY"?"private":"public";
return{role,key:await skImport(t,id,o,role)}}
const SK_PUB_ALGS=["RSA-OAEP","RSA-PSS","ECDSA","ECDH","Ed25519","X25519"];
function skAlgControls(r,algs,withHash){const[la,alg]=sel("Algorithm",algs),[lc,curve]=sel("Curve",["P-256","P-384","P-521"]),[lh,hash]=sel("Hash",["SHA-256","SHA-384","SHA-512","SHA-1"]);
const sync=()=>{lc.hidden=!(alg.value==="ECDSA"||alg.value==="ECDH");lh.hidden=!(withHash&&(alg.value==="RSA-OAEP"||alg.value==="RSA-PSS"||alg.value==="ECDSA"))};
alg.onchange=sync;r.append(la,lc,lh);sync();return{alg,curve,hash,opt:()=>({curve:curve.value,hash:hash.value})}}
