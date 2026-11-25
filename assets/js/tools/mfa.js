"use strict";
const SK_MFA=[{id:"key",name:"Passkey or FIDO2 security key",sec:10,phish:true,hw:true},{id:"totp",name:"Authenticator app (TOTP)",sec:7,phone:true,offline:true},{id:"push",name:"Push approval app",sec:6,phone:true,fatigue:true},{id:"email",name:"Email code",sec:4},{id:"sms",name:"SMS code",sec:3,phone:true,sim:true}];
function skMfaAdvise(a){const out=[];for(const m of SK_MFA){const why=[];let s=m.sec;
if(m.phone&&!a.smartphone&&m.id!=="sms"){out.push({id:m.id,name:m.name,score:-1,usable:false,why:["needs a smartphone"]});continue}
if(m.hw&&!a.keyOk){out.push({id:m.id,name:m.name,score:-1,usable:false,why:["needs a compatible device or a key you can buy"]});continue}
if(a.sensitivity==="high")s*=1.2;if(a.sensitivity==="low")s=s*.8+(m.id==="email"||m.id==="sms"?1:0);
if(a.phishing==="high"){if(m.phish){s+=3;why.push("resists phishing sites")}else s-=1}
if(m.fatigue&&a.phishing==="high"){s-=1;why.push("vulnerable to approval fatigue")}
if(m.sim)why.push("SIM swap and interception risk");
if(a.offline==="yes"){if(m.offline||m.hw){s+=1;why.push("works without signal")}else if(m.id==="sms"||m.id==="email"||m.id==="push")s-=2}
if(m.phish)why.unshift("strongest protection against phishing");if(m.id==="totp")why.unshift("good protection, works offline, but can be phished");if(m.id==="email")why.unshift("only as safe as the email account itself");
out.push({id:m.id,name:m.name,score:Math.round(s*10)/10,usable:true,why})}
return out.sort((x,y)=>y.score-x.score)}
T.mfa=r=>{const[l1,sn]=sel("How sensitive is the account?",["high","medium","low"]),[l2,ph]=sel("Phishing risk (targeted, public figure, finance, admin)",["high","medium","low"]),[l3,sp]=sel("Do you have a smartphone?",["yes","no"]),[l4,kk]=sel("Can you use a passkey or security key?",["yes","no"]),[l5,of]=sel("Do you often lack signal?",["no","yes"]),o=skOut(r);
r.prepend(l1,el("br"),l2,el("br"),l3,el("br"),l4,el("br"),l5);
r.append(btn("Recommend",()=>{const x=skMfaAdvise({sensitivity:sn.value,phishing:ph.value,smartphone:sp.value==="yes",keyOk:kk.value==="yes",offline:of.value}),u=x.filter(m=>m.usable);
o.set(u.map((m,i)=>(i+1)+". "+m.name+" (score "+m.score+") - "+m.why.join("; ")).join("\n")+(x.some(m=>!m.usable)?"\n\nNot available for you: "+x.filter(m=>!m.usable).map(m=>m.name+" ("+m.why[0]+")").join(", "):"")+"\n\nAlways also save backup codes and register a second method, so one lost device does not lock you out.","General guidance, not a security audit. Any second factor is much better than none.")}),btn("Clear",()=>o.clear(),1))};
