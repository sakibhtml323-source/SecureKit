"use strict";
function skShift(s,n){return s.replace(/[a-z]/gi,c=>{const b=c<="Z"?65:97;return String.fromCharCode((c.charCodeAt(0)-b+n%26+26)%26+b)})}
function skRot47(s){return s.replace(/[!-~]/g,c=>String.fromCharCode((c.charCodeAt(0)-33+47)%94+33))}
function skAtbash(s){return s.replace(/[a-z]/gi,c=>{const b=c<="Z"?65:97;return String.fromCharCode(b+25-(c.charCodeAt(0)-b))})}
function skVigenere(s,key,dec){const k=key.toLowerCase().replace(/[^a-z]/g,"");if(!k)throw new Error("Enter a key with letters.");let i=0;return s.replace(/[a-z]/gi,c=>{const sh=k.charCodeAt(i++%k.length)-97;return skShift(c,dec?-sh:sh)})}
T.classic=r=>{const[l1,alg]=sel("Cipher",["Caesar","ROT13","ROT47","Atbash","Vigenere"]),[l2,dir]=sel("Direction",["Encrypt","Decrypt"]),[l3,sh]=num("Caesar shift",1,25,3),key=el("input",{type:"text",autocomplete:"off"}),inp=skArea("Input",4,"Text"),o=skOut(r);key.setAttribute("aria-label","Vigenere key");
const kb=skBox("Vigenere key (letters)",key),sync=()=>{kb.hidden=alg.value!=="Vigenere";l3.hidden=alg.value!=="Caesar";l2.hidden=alg.value==="ROT13"||alg.value==="ROT47"||alg.value==="Atbash"};alg.onchange=sync;
r.prepend(l1,l2,l3,kb,skBox("Input",inp));sync();
const run=()=>{const s=inp.value,d=dir.value==="Decrypt";return alg.value==="Caesar"?skShift(s,d?-(+sh.value||0):(+sh.value||0)):alg.value==="ROT13"?skShift(s,13):alg.value==="ROT47"?skRot47(s):alg.value==="Atbash"?skAtbash(s):skVigenere(s,key.value,d)};
r.append(btn("Run",()=>{try{o.set(run(),"Classical ciphers are trivially breakable. Use them for learning and puzzles, never for secrets.")}catch(e){o.err(skMsg(e))}}),btn("Caesar: show all 25 shifts",()=>{o.set(Array.from({length:25},(_,i)=>String(i+1).padStart(2," ")+": "+skShift(inp.value,i+1)).join("\n"))},1),btn("Clear",()=>{inp.value="";o.clear()},1))};
