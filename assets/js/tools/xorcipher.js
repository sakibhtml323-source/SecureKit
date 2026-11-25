"use strict";
function skXor(data,key){if(!key.length)throw new Error("Enter a key.");return data.map((b,i)=>b^key[i%key.length])}
function skEnglishScore(b){let s=0;for(const x of b){if(x===32)s+=3;else if((x>=65&&x<=90)||(x>=97&&x<=122))s+=2;else if(x>=48&&x<=57||x===39||x===44||x===46)s+=1;else if(x<32&&x!==10&&x!==13&&x!==9||x>126)s-=4}return s/b.length}
function skXorBrute(data){const res=[];for(let k=0;k<256;k++){const p=skXor(data,Uint8Array.of(k));res.push({key:k,score:skEnglishScore(p),text:Array.from(p,c=>c>=32&&c<127?String.fromCharCode(c):"·").join("")})}return res.sort((a,b)=>b.score-a.score).slice(0,5)}
T.xorcipher=r=>{const[l1,fmt]=sel("Input is",["Text","Hex"]),[l2,kf]=sel("Key is",["Text","Hex"]),key=el("input",{type:"text",autocomplete:"off"}),inp=skArea("Input",4,"Input data"),o=skOut(r);key.setAttribute("aria-label","Key");
r.prepend(l1,l2,skBox("Key",key),skBox("Input",inp));
const data=()=>fmt.value==="Hex"?U.unhex(inp.value):U.enc(inp.value);
r.append(btn("XOR",()=>{try{const x=skXor(data(),kf.value==="Hex"?U.unhex(key.value):U.enc(key.value));o.set(U.hex(x),"Hex output. Repeating-key XOR is not secure encryption.")}catch(e){o.err(skMsg(e))}}),
btn("Brute-force single-byte key",()=>{try{const d=data();if(!d.length)throw new Error("Enter some input.");o.set(skXorBrute(d).map(x=>"key 0x"+x.key.toString(16).padStart(2,"0")+" (score "+x.score.toFixed(2)+"): "+x.text).join("\n"),"Top 5 candidates ranked by how English-like the result is.")}catch(e){o.err(skMsg(e))}},1),btn("Clear",()=>{key.value="";inp.value="";o.clear()},1))};
