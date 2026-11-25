"use strict";
/* Shared helpers for tool modules (bytes, encodings, PEM, small UI parts). Requires app.js first. */
const U={
enc:s=>new TextEncoder().encode(s),dec:b=>new TextDecoder("utf-8",{fatal:true}).decode(b),
hex:b=>[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,"0")).join(""),
unhex(h){h=h.replace(/\s+|:/g,"").replace(/^0x/i,"");if(h.length%2||/[^0-9a-f]/i.test(h))throw new Error("Invalid hex input.");return Uint8Array.from(h.match(/../g)||[],x=>parseInt(x,16))},
b64(b){const u=new Uint8Array(b);let s="";for(let i=0;i<u.length;i+=8192)s+=String.fromCharCode.apply(null,u.subarray(i,i+8192));return btoa(s)},
unb64(s){try{s=s.replace(/\s+/g,"").replace(/-/g,"+").replace(/_/g,"/");while(s.length%4)s+="=";return Uint8Array.from(atob(s),c=>c.charCodeAt(0))}catch(e){throw new Error("Invalid Base64 input.")}},
b64url(b){return U.b64(b).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")},
pem(label,buf){return"-----BEGIN "+label+"-----\n"+U.b64(buf).match(/.{1,64}/g).join("\n")+"\n-----END "+label+"-----"},
unpem(t){const m=/-----BEGIN ([A-Z0-9 ]+)-----([\s\S]+?)-----END \1-----/.exec(String(t).trim());if(!m)throw new Error("Not a PEM block.");return{label:m[1],der:U.unb64(m[2])}},
b32(b){const A="ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";let bits=0,v=0,o="";for(const x of b){v=(v<<8)|x;bits+=8;while(bits>=5){o+=A[(v>>>(bits-5))&31];bits-=5}v&=(1<<bits)-1}if(bits)o+=A[(v<<(5-bits))&31];return o},
unb32(s){const A="ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";s=String(s).toUpperCase().replace(/[\s=-]/g,"");let bits=0,v=0;const out=[];for(const c of s){const i=A.indexOf(c);if(i<0)throw new Error("Invalid Base32 secret (use letters A-Z and digits 2-7).");v=(v<<5)|i;bits+=5;if(bits>=8){out.push((v>>>(bits-8))&255);bits-=8}v&=(1<<bits)-1}if(!out.length)throw new Error("Enter a Base32 secret.");return Uint8Array.from(out)},
ctEq(a,b){if(a.length!==b.length)return false;let d=0;for(let i=0;i<a.length;i++)d|=a.charCodeAt(i)^b.charCodeAt(i);return d===0}};
function skMsg(e){if(e instanceof Error&&e.name==="Error")return e.message;if(e&&e.name==="NotSupportedError")return"This algorithm is not supported by your browser.";return"Operation failed. Check the key, password and input."}
function skBox(lbl,node){const d=el("div");d.append(el("p",{className:"note",textContent:lbl}),node);return d}
function skArea(lbl,rows,ph){const t=el("textarea",{rows,placeholder:ph||""});t.setAttribute("aria-label",lbl);t.setAttribute("spellcheck","false");t.setAttribute("autocomplete","off");return t}
function skOut(r,label){let v="",mounted=false;const o=el("div",{className:"out",textContent:"—"}),st=el("p",{className:"note"}),lb=label?el("p",{className:"note",textContent:label}):null,cp=btn("Copy",b=>v&&copy(v,b),1);o.setAttribute("aria-live","polite");st.setAttribute("role","status");
const mount=()=>{if(!mounted){mounted=true;if(lb)r.append(lb);r.append(o,cp,st)}};
return{set(x,n){mount();v=x;o.textContent=x||"—";st.textContent=n||""},err(m){mount();v="";o.textContent="—";st.textContent=m},note(m){mount();st.textContent=m},clear(){v="";o.textContent="—";st.textContent=""},get:()=>v}}
async function skGuard(o,fn){try{await fn()}catch(e){o.err(skMsg(e))}}
function skSave(name,blob){const u=URL.createObjectURL(blob),a=el("a",{href:u,download:name});a.click();setTimeout(()=>URL.revokeObjectURL(u),1000)}
function skNeedCrypto(r){if(!(window.crypto&&crypto.subtle)){r.append("Web Crypto is not available. Open this page over HTTPS or localhost.");return true}return false}
