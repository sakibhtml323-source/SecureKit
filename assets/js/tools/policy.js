"use strict";
function skPolicy(pw,p){const f=[],lc=pw.toLowerCase();
if(pw.length<p.min)f.push("shorter than "+p.min);if(p.max&&pw.length>p.max)f.push("longer than "+p.max);
if(p.upper&&!/[A-Z]/.test(pw))f.push("no uppercase letter");if(p.lower&&!/[a-z]/.test(pw))f.push("no lowercase letter");if(p.digit&&!/\d/.test(pw))f.push("no digit");if(p.symbol&&!/[^A-Za-z0-9]/.test(pw))f.push("no symbol");
if(p.repeat&&new RegExp("(.)\\1{"+(p.repeat-1)+",}").test(pw))f.push(p.repeat+"+ identical characters in a row");
if(p.user&&p.user.length>=3&&lc.includes(p.user.toLowerCase()))f.push("contains the username");
for(const w of p.banned||[])if(w&&lc.includes(w.toLowerCase())){f.push('contains banned word "'+w+'"');break}
if(p.common&&typeof analyze==="function"){const a=analyze(pw);if(a.common)f.push("is a common password")}
return{ok:!f.length,failures:f}}
T.policy=r=>{const[l1,mn]=num("Minimum length",1,128,12),[l2,mx]=num("Maximum length (0 = none)",0,512,0),[l3,rp]=num("Block N identical in a row (0 = off)",0,10,3),[a,up]=chk("Uppercase",true),[b,lo]=chk("Lowercase",true),[c,di]=chk("Digit",true),[d,sy]=chk("Symbol",false),[e,cm]=chk("Block common passwords",true),
user=el("input",{type:"text",autocomplete:"off"}),ban=el("input",{type:"text",autocomplete:"off",placeholder:"company, summer, admin"}),inp=skArea("Passwords to test",6,"One password per line"),o=skOut(r);user.setAttribute("aria-label","Username to disallow");ban.setAttribute("aria-label","Banned words");
r.prepend(l1,l2,l3,el("br"),a,b,c,d,e,el("br"),skBox("Username to disallow (optional)",user),skBox("Banned words, comma separated (optional)",ban),skBox("Passwords (never leave this page)",inp));
r.append(btn("Check against policy",()=>{const pol={min:+mn.value||1,max:+mx.value||0,upper:up.checked,lower:lo.checked,digit:di.checked,symbol:sy.checked,common:cm.checked,repeat:+rp.value||0,user:user.value.trim(),banned:ban.value.split(",").map(x=>x.trim()).filter(Boolean)},L=inp.value.split(/\r?\n/).filter(x=>x.length);
if(!L.length){o.err("Enter at least one password.");return}const res=L.map((x,i)=>{const q=skPolicy(x,pol);return"#"+(i+1)+" ("+x.length+" chars): "+(q.ok?"PASS":"FAIL - "+q.failures.join("; "))});o.set(res.join("\n"),L.filter(x=>skPolicy(x,pol).ok).length+" of "+L.length+" pass. Passwords are not echoed.")}),btn("Clear",()=>{inp.value="";o.clear()},1))};
