"use strict";
const SK_BACKUP_ALPHA="ABCDEFGHJKMNPQRSTVWXYZ23456789";
function skBackupCodes(n,len,group){const out=[];while(out.length<n){let c="";for(let i=0;i<len;i++){if(group&&i&&i%group===0)c+="-";c+=SK_BACKUP_ALPHA[rnd(SK_BACKUP_ALPHA.length)]}if(!out.includes(c))out.push(c)}return out}
T.backup=r=>{if(!(window.crypto&&crypto.getRandomValues)){r.append("Web Crypto is not available.");return}
const[l1,n]=num("Number of codes",1,50,10),[l2,len]=num("Characters per code",8,24,10),[l3,grp]=num("Group size (0 = none)",0,8,5),holder=el("div"),st=el("p",{className:"note"});let codes=[];
const out=listOut(holder,()=>{codes=[];st.textContent=""});
r.append(l1,l2,l3,el("br"),btn("Generate",()=>{const L=Math.min(24,Math.max(8,+len.value||10)),N=Math.min(50,Math.max(1,+n.value||10));codes=skBackupCodes(N,L,Math.min(8,Math.max(0,+grp.value||0)));out(codes);st.textContent="Each code has about "+(L*Math.log2(SK_BACKUP_ALPHA.length)).toFixed(0)+" bits of randomness. Store them offline (print or password manager). Each code should work once; this page does not store them."}),btn("Print",()=>window.print(),1),st,holder)};
