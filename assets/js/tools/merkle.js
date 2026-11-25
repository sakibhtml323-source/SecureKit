"use strict";
async function skSha256(b){return new Uint8Array(await crypto.subtle.digest("SHA-256",b))}
const skCat=(a,b)=>{const o=new Uint8Array(a.length+b.length);o.set(a);o.set(b,a.length);return o};
async function skMerkle(leaves,hashLeaves,odd){if(!leaves.length)throw new Error("Enter at least one leaf (one per line).");
let level=hashLeaves?await Promise.all(leaves.map(l=>skSha256(U.enc(l)))):leaves.map(l=>U.unhex(l));const levels=[level];
while(level.length>1){const next=[];for(let i=0;i<level.length;i+=2){if(i+1<level.length)next.push(await skSha256(skCat(level[i],level[i+1])));else next.push(odd==="duplicate"?await skSha256(skCat(level[i],level[i])):level[i])}level=next;levels.push(level)}
return{levels,root:level[0]}}
function skMerkleProof(levels,index,odd){const proof=[];let i=index;for(let l=0;l<levels.length-1;l++){const lv=levels[l],sib=i^1;if(sib<lv.length)proof.push({hash:lv[sib],left:sib<i});else if(odd==="duplicate")proof.push({hash:lv[i],left:false});i>>=1}return proof}
async function skMerkleVerify(leafHash,proof,root){let h=leafHash;for(const p of proof)h=await skSha256(p.left?skCat(p.hash,h):skCat(h,p.hash));return U.hex(h)===U.hex(root)}
T.merkle=r=>{if(skNeedCrypto(r))return;const inp=skArea("Leaves",6,"One leaf per line"),[l1,hl]=sel("Leaves are",["Text (hash with SHA-256)","Hex (already hashed)"]),[l2,odd]=sel("Odd node",["duplicate","promote"]),[l3,idx]=num("Proof for leaf #",1,100000,1),o=skOut(r);
r.prepend(l1,l2,l3,skBox("Leaves",inp));
r.append(btn("Build tree",()=>skGuard(o,async()=>{const L=inp.value.split(/\r?\n/).filter(x=>x.length),m=await skMerkle(L,hl.value.startsWith("Text"),odd.value),i=Math.min(L.length,Math.max(1,+idx.value||1))-1,pf=skMerkleProof(m.levels,i,odd.value);
o.set("Root: "+U.hex(m.root)+"\n\nLevels (leaf level first):\n"+m.levels.map((lv,k)=>k+": "+lv.map(h=>U.hex(h).slice(0,8)).join(" ")).join("\n")+"\n\nProof for leaf "+(i+1)+":\n"+(pf.map(p=>(p.left?"L ":"R ")+U.hex(p.hash)).join("\n")||"(single leaf)"),"SHA-256 binary tree. Hashes shown shortened in the levels list.")})),btn("Clear",()=>{inp.value="";o.clear()},1))};
