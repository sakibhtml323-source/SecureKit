"use strict";
const $=s=>document.querySelector(s),T={};
function el(t,p,...k){const e=document.createElement(t);if(p)Object.assign(e,p);e.append(...k);return e}
const hasCrypto=!!(window.crypto&&crypto.getRandomValues),hasSub=!!(window.crypto&&crypto.subtle);
function rnd(n){const lim=Math.floor(4294967296/n)*n,b=new Uint32Array(1);do{crypto.getRandomValues(b)}while(b[0]>=lim);return b[0]%n}
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=rnd(i+1);[a[i],a[j]]=[a[j],a[i]]}return a}
async function sha(alg,text){const b=await crypto.subtle.digest(alg,new TextEncoder().encode(text));return[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,"0")).join("")}
async function copy(text,b){const o=b.textContent;try{if(navigator.clipboard&&navigator.clipboard.writeText)await navigator.clipboard.writeText(text);else{const t=el("textarea",{value:text});document.body.append(t);t.select();if(!document.execCommand("copy"))throw 0;t.remove()}b.textContent="Copied!"}catch(e){b.textContent="Copy failed"}setTimeout(()=>b.textContent=o,1500)}
function dl(n,t){const u=URL.createObjectURL(new Blob([t],{type:"text/plain"})),a=el("a",{href:u,download:n});a.click();setTimeout(()=>URL.revokeObjectURL(u),1000)}
function btn(t,f,s){const b=el("button",{type:"button",textContent:t,className:s?"s":""});b.onclick=()=>f(b);return b}
function field(l,i){const x=el("label",{},l+" ");x.append(i);return x}
function num(l,min,max,v){const i=el("input",{type:"number",min,max,value:v});i.style.width="90px";return[field(l,i),i]}
function chk(l,c){const i=el("input",{type:"checkbox",checked:c}),x=el("label");x.append(i," "+l);return[x,i]}
function sel(l,o){const i=el("select");o.forEach(v=>i.append(el("option",{value:v,textContent:v})));return[field(l,i),i]}
function listOut(r,onClear){let a=[];const o=el("div",{className:"out",textContent:"—"});o.setAttribute("aria-live","polite");
r.append(btn("Copy",b=>a.length&&copy(a.join("\n"),b),1),btn("Download TXT",()=>a.length&&dl("securekit.txt",a.join("\n")),1),btn("Clear",()=>{a=[];o.textContent="—";if(onClear)onClear()},1),o);
return v=>{a=v;o.textContent=a.join("\n")||"—"}}
function mk(k,v){const d=el("div",{className:"m"});d.append(el("b",{textContent:k}),String(v));return d}
function fmtTime(s){if(!(s>=0)||s>=3.15e11)return"extremely long";if(s<1)return"under a second";
const u=[[60,"second"],[60,"minute"],[24,"hour"],[30,"day"],[12,"month"],[100,"year"],[Infinity,"century"]];let v=s,i=0;
while(i<6&&Math.round(v)>=u[i][0]){v/=u[i][0];i++}
const n=Math.round(v),name=i===6&&n!==1?"centuries":u[i][1]+(n===1?"":"s");return n.toLocaleString()+" "+name}
const AMB=new Set("0Oo1Il5S2Z"),SETS={u:"ABCDEFGHIJKLMNOPQRSTUVWXYZ",l:"abcdefghijklmnopqrstuvwxyz",n:"0123456789",s:"!@#$%^&*()-_=+[]{}<>?/.,;:~"};
function label(s){return s<20?"Very Weak":s<40?"Weak":s<60?"Fair":s<75?"Good":s<90?"Strong":"Very Strong"}
function entropy(p){let pool=0;if(/[a-z]/.test(p))pool+=26;if(/[A-Z]/.test(p))pool+=26;if(/\d/.test(p))pool+=10;if(/[^A-Za-z0-9]/.test(p))pool+=32;return{pool,bits:p.length&&pool?p.length*Math.log2(pool):0}}
function crack(b){const g=Math.pow(2,b)/2;return[["Online rate-limited (100/s)",g/100],["Offline fast hash (10 billion/s)",g/1e10],["Offline slow hash (10,000/s)",g/1e4]]}
const COMMON=new Set("password,123456,12345678,123456789,qwerty,abc123,letmein,welcome,admin,iloveyou,monkey,dragon,football,baseball,master,login,princess,sunshine,trustno1,passw0rd,111111,000000,1234567,12345,1234567890,qwerty123,admin123,password1,password123,welcome123,letmein123,azerty,qazwsx,superman,michael,shadow,hello,freedom,whatever,starwars,123123,654321,666666,121212,access,flower,batman,ninja,mustang".split(","));
const KB=["qwertyuiop","asdfghjkl","zxcvbnm"],SUB={"@":"a","4":"a","3":"e","1":"l","!":"i","0":"o","$":"s","5":"s","7":"t"};
function seqRun(p,st){let m=0,r=1;for(let i=1;i<p.length;i++){if(p.charCodeAt(i)-p.charCodeAt(i-1)===st){r++;m=Math.max(m,r)}else r=1}return m}
function kb(s){for(const w of KB)for(const r of[w,[...w].reverse().join("")])for(let i=0;i<=r.length-4;i++)if(s.includes(r.slice(i,i+4)))return true;return false}
const ALLDIG=/^\d{1,6}$/;
function analyze(p){const lc=p.toLowerCase(),is=new Set();let common=false,pattern=false,repeat=false;
const base=lc.replace(/[@43105$7!]/g,c=>SUB[c]).replace(/[\d\W_]+$/,"");
if(COMMON.has(lc)){common=true;is.add("Matches a very common password.")}
else if(ALLDIG.test(lc)){common=true;is.add("Short all-digit passwords are among the first guesses attackers try.")}
else if(base.length>=3&&(COMMON.has(base)||COMMON.has(lc.replace(/\d+$/,"")))){common=true;is.add("Looks like a common password with a predictable suffix or substitution.")}
if(seqRun(lc,1)>=3||seqRun(lc,-1)>=3){pattern=true;is.add("Contains a numeric or alphabetic sequence (for example 1234, abcd or 4321).")}
if(kb(lc)){pattern=true;is.add("Contains a keyboard pattern (for example qwer or asdf).")}
if(/(19|20)\d\d$/.test(lc)&&p.length<14){pattern=true;is.add("Ends with a year, a predictable suffix.")}
if(/(.)\1{2,}/.test(p)){repeat=true;is.add("Contains a repeated character (for example aaa or 111).")}
{const m=/(.{2,4})\1/.exec(p);if(m){repeat=true;if(new Set(m[1]).size>1)is.add("Contains a repeated block (for example abab or abcabc).")}}
const e=entropy(p);let eff=e.bits;if(common)eff=Math.min(eff,12);if(pattern)eff*=.6;if(repeat)eff*=.7;eff=Math.round(eff*10)/10;
let sc=Math.min(100,eff*.85);if(common)sc=Math.min(sc,8);if(p.length<8)sc=Math.min(sc,25);
return{sc:p.length?Math.max(0,Math.round(sc)):0,e,eff,common,pattern,repeat,is:[...is]}}

/* analyzer family: password-strength, entropy, crack-time, pattern, repeat, common */
const DATA=new URL("../../data/",document.currentScript.src);let commonFail=false;
function loadJSON(n,ok){return fetch(new URL(n,DATA)).then(r=>{if(!r.ok)throw 0;return r.json()}).then(a=>{if(!Array.isArray(a)||!a.length)throw 0;ok(a);return true}).catch(()=>false)}
T.analyzer=(r,show)=>{
const[pw,sh,hide]=pwBox("Password to analyze"),sc=el("p"),grid=el("div",{className:"grid"}),ul=el("ul"),tipsH=el("h3",{textContent:"Recommendations"}),ul2=el("ul"),bo=el("p"),br=breachRunner(bo);
sc.setAttribute("role","status");bo.setAttribute("role","status");
if(show.includes("common")||show.includes("score"))loadJSON("common-passwords.json",x=>x.forEach(w=>COMMON.add(String(w).toLowerCase()))).then(ok=>{commonFail=!ok;if(pw.value)draw()});
r.append(pw,sh,btn("Clear",()=>{pw.value="";hide();br.reset();draw()},1));
if(show.includes("breach"))r.append(btn("Check breaches (HIBP)",()=>br.run(pw.value)));
r.append(btn("Print report",()=>window.print(),1),sc,grid,ul,tipsH,ul2,bo);
function draw(){const p=pw.value;grid.replaceChildren();ul.replaceChildren();ul2.replaceChildren();tipsH.hidden=true;sc.textContent="";if(!p)return;
const a=analyze(p);
const M={length:["Length",p.length],unique:["Unique characters",new Set(p).size],
comp:["Composition",["a-z","A-Z","0-9","symbols"].filter((n,i)=>[/[a-z]/,/[A-Z]/,/\d/,/[^A-Za-z0-9]/][i].test(p)).join(" ")||"none"],
pool:["Character pool",a.e.pool],entropy:["Entropy (character-pool estimate)",a.e.bits.toFixed(1)+" bits"],
eff:["Effective entropy (after penalties)",a.eff.toFixed(1)+" bits"+(a.eff<a.e.bits-.05?" (reduced: predictable pattern)":"")],
common:["Common password",a.common?"Match found":commonFail?"Common password data could not be loaded (short built-in list used)":"No match in the local list"],
pattern:["Patterns",a.pattern?"Found":"None found"],repeat:["Repeats",a.repeat?"Found":"None found"]};
for(const k of show){if(k==="crack")crack(a.eff).forEach(([n,s])=>grid.append(mk(n,fmtTime(s))));
else if(k==="issues")(a.is.length?a.is:["No issue detected by these rules."]).forEach(t=>ul.append(el("li",{textContent:t})));
else if(k==="tips"){tipsH.hidden=false;["Use a unique password per account.","Use a password manager.","Enable multi-factor authentication."].forEach(t=>ul2.append(el("li",{textContent:t})))}
else if(M[k])grid.append(mk(...M[k]))}
if(show.includes("score"))sc.textContent="Estimated Security Score: "+a.sc+"/100 ("+label(a.sc)+")"}
pw.oninput=()=>{br.reset();draw()};draw()}

/* HIBP k-anonymity */
const HFAIL="Unable to complete the breach check right now.";
function pwBox(lbl){const pw=el("input",{type:"password",autocomplete:"off",spellcheck:false}),sh=btn("Show password",()=>{const h=pw.type==="password";pw.type=h?"text":"password";sh.textContent=h?"Hide password":"Show password"},1);
pw.setAttribute("aria-label",lbl);pw.setAttribute("autocapitalize","off");return[pw,sh,()=>{pw.type="password";sh.textContent="Show password"}]}
async function hibp(pw,signal){if(navigator.onLine===false)return"You appear to be offline. Breach checking requires an internet connection.";if(!hasSub)return HFAIL;
const h=(await sha("SHA-1",pw)).toUpperCase(),pre=h.slice(0,5),suf=h.slice(5);
const res=await fetch("https://api.pwnedpasswords.com/range/"+pre,{signal,headers:{"Add-Padding":"true"},cache:"no-store",referrerPolicy:"no-referrer"});
if(!res.ok)return res.status===429?"Unable to complete the breach check right now (rate limited). Please wait and retry.":HFAIL;
let found=null,ok=false;for(const l of(await res.text()).split(/\r?\n/)){const m=/^([0-9A-F]{35}):(\d+)$/.exec(l.trim());if(m){ok=true;if(m[1]===suf)found=+m[2]}}
if(!ok)return HFAIL;
return found>0?"Found in known breaches ("+found.toLocaleString()+" times). Do not use this password. It has appeared in known breach data.":"No match found in the checked HIBP password dataset. Not finding a match does not guarantee that a password has never been exposed."}
function breachRunner(out){let id=0,ctl=null;return{reset(){id++;if(ctl)ctl.abort();ctl=null;out.textContent=""},
async run(pw){if(!pw){out.textContent="Enter a password first.";return}const my=++id;if(ctl)ctl.abort();const c=ctl=new AbortController(),t=setTimeout(()=>c.abort(),10000);out.textContent="Checking…";let m;
try{m=await hibp(pw,c.signal)}catch(e){m=HFAIL+(e&&e.name==="AbortError"?" The request timed out.":navigator.onLine===false?" Breach checking requires an internet connection.":" Network error: the breach-check service could not be reached. Check your internet connection and try again.")}finally{clearTimeout(t)}if(my===id)out.textContent=m}}}
T.breach=r=>{const[pw,sh,hide]=pwBox("Password to check"),out=el("p"),br=breachRunner(out);out.setAttribute("role","status");
r.append(pw,sh,btn("Check",()=>br.run(pw.value)),btn("Clear",()=>{pw.value="";hide();br.reset()},1),out);pw.oninput=()=>br.reset()}

/* generators */
function makeStr(len,sets,amb,guar){const pools=sets.map(s=>[...SETS[s]].filter(c=>!(amb&&AMB.has(c)))),all=pools.flat(),ch=guar?pools.map(p=>p[rnd(p.length)]):[];
while(ch.length<len)ch.push(all[rnd(all.length)]);return shuffle(ch).slice(0,Math.max(len,0)).join("")}
function charGen(r,min,max,def,guar){
if(!hasCrypto){r.append("Web Crypto is not available in this browser.");return}
const[l,len]=num("Length ("+min+"–"+max+")",min,max,def),cs=[["u","Uppercase"],["l","Lowercase"],["n","Numbers"],["s","Symbols"]].map(([k,n])=>[k,...chk(n,true)]),[la,amb]=chk("Exclude ambiguous characters (0 O o 1 I l 5 S 2 Z)",false),info=el("p",{className:"note"}),holder=el("div");
r.append(l);cs.forEach(c=>r.append(c[1]));r.append(la,el("br"));
const out=listOut(holder,()=>stats()),pool=()=>cs.filter(c=>c[2].checked).flatMap(c=>[...SETS[c[0]]].filter(ch=>!(amb.checked&&AMB.has(ch)))),L=()=>Math.min(max,Math.max(min,parseInt(len.value,10)||def));
function stats(){const P=pool().length;if(!P){info.textContent="Select at least one character set.";return}const b=L()*Math.log2(P);
info.textContent="Character pool: "+P+" characters · Entropy ≈ "+b.toFixed(0)+" bits · Strength: "+label(Math.min(100,b*.85))+" · Offline fast-hash estimate: "+fmtTime(Math.pow(2,b)/2/1e10)+". Nothing is stored."}
const go=n=>{const sets=cs.filter(c=>c[2].checked).map(c=>c[0]);if(!sets.length){stats();return}out(Array.from({length:n},()=>makeStr(L(),sets,amb.checked,guar)));stats()};
[len,amb,...cs.map(c=>c[2])].forEach(i=>i.addEventListener("change",stats));len.addEventListener("input",stats);
r.append(btn("Generate",()=>go(1)),btn("Generate 5",()=>go(5),1),btn("Generate 10",()=>go(10),1),info,holder);stats()}
T.password=r=>charGen(r,8,128,16,true);
T.random=r=>charGen(r,1,256,32,false);
const PBAD=["2580","0852","1357","2468","1004","2000","1122"];
function pinWeak(p){const n=p.length,c={};for(const d of p)c[d]=(c[d]||0)+1;
return Math.max(...Object.values(c))>Math.ceil(n/4)||/(\d)\1/.test(p)||seqRun(p,1)>=3||seqRun(p,-1)>=3||/^(\d\d)\1+$/.test(p)||PBAD.some(b=>p.includes(b))}
function pinOne(n){let p;do{p=Array.from({length:n},()=>rnd(10)).join("")}while(pinWeak(p));return p}
T.pin=r=>{if(!hasCrypto){r.append("Web Crypto is not available.");return}
const[l,len]=sel("PIN length",["4","6","8","10"]),holder=el("div"),out=listOut(holder),gen=n=>out(Array.from({length:n},()=>pinOne(+len.value)));
r.append(l,btn("Generate",()=>gen(1)),btn("Generate 5",()=>gen(5),1),btn("Generate 10",()=>gen(10),1),holder)};
let WORDS="able acorn adapt amber anchor angle apple arch arrow aspen atlas autumn badge baker barn basil beach beacon berry birch blaze bloom bold bonus book boost brave breeze bridge bright brook cabin cactus calm candle canyon carbon cedar chalk charm cherry civic clever cliff clock cloud clover cobalt comet coral cotton crane crisp crystal curve daisy dawn delta desert dew drift dune eagle earth echo elder ember falcon fern field flame flint forest fossil frost garden gentle glacier glow granite grove harbor hazel heron hill honey horizon indigo island ivory jade jasper jungle kernel kettle lake lantern laurel lemon lilac lunar maple marble meadow mellow mesa mint misty moss mountain nectar noble north oak oasis ocean olive onyx orchid otter paddle pearl pebble pine planet plum pond prairie quartz quiet quill rain raven reef ridge river robin rocket sage sand scarlet shadow silver sketch slate solar spark spruce stone storm summit sunny swift tidal timber topaz tulip valley velvet violet walnut willow winter wonder yellow zephyr".split(" ");
T.passphrase=r=>{loadJSON("passphrase-words.json",a=>{const c=a.filter(x=>typeof x==="string"&&/^[a-z]{3,12}$/.test(x));if(c.length>=100)WORDS=c});if(!hasCrypto){r.append("Web Crypto is not available.");return}
const[a,n]=num("Words (4–10)",4,10,5),[b,sep]=sel("Separator",["-","_",".","space"]),[c,cap]=chk("Capitalize",true),[d,dig]=chk("Add number",false),[e,sym]=chk("Add symbol",false),info=el("p",{className:"note"}),holder=el("div"),out=listOut(holder,()=>{info.textContent=""});
r.append(a,b,c,d,e,el("br"),btn("Generate",()=>{const N=Math.min(10,Math.max(4,parseInt(n.value,10)||5)),s=sep.value==="space"?" ":sep.value;
let w=Array.from({length:N},()=>{const x=WORDS[rnd(WORDS.length)];return cap.checked?x[0].toUpperCase()+x.slice(1):x});
const wb=N*Math.log2(WORDS.length),extra=[];let bits=wb,p=w.join(s);
if(dig.checked){p+=String(rnd(100)).padStart(2,"0");bits+=Math.log2(100);extra.push("2-digit number "+Math.log2(100).toFixed(1))}
if(sym.checked){const S=SETS.s;p+=S[rnd(S.length)];bits+=Math.log2(S.length);extra.push("symbol "+Math.log2(S.length).toFixed(1))}
out([p]);info.textContent=N+" words · "+p.length+" characters · entropy ≈ "+bits.toFixed(1)+" bits ("+N+" × log2("+WORDS.length+") = "+wb.toFixed(1)+(extra.length?" + "+extra.join(" + "):"")+") · Strength: "+label(Math.min(100,bits*.85))}),info,holder)};
function uuid(){if(crypto.randomUUID)return crypto.randomUUID();const b=crypto.getRandomValues(new Uint8Array(16));b[6]=b[6]&15|64;b[8]=b[8]&63|128;return[...b].map(x=>x.toString(16).padStart(2,"0")).join("").replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/,"$1-$2-$3-$4-$5")}
T.uuid=r=>{if(!hasCrypto){r.append("Web Crypto is not available.");return}const holder=el("div"),out=listOut(holder);
r.append(...[1,10,50,100].map((n,i)=>btn(n===1?"Generate":"Generate "+n,()=>out(Array.from({length:n},uuid)),i)),holder)};
function md5(by){const K=Array.from({length:64},(_,i)=>Math.floor(Math.abs(Math.sin(i+1))*4294967296)>>>0),S=[7,12,17,22,5,9,14,20,4,11,16,23,6,10,15,21],n=by.length,len=(((n+8)>>>6)+1)<<6,b=new Uint8Array(len);b.set(by);b[n]=128;
const dv=new DataView(b.buffer);dv.setUint32(len-8,(n*8)>>>0,true);dv.setUint32(len-4,Math.floor(n/536870912),true);let a0=0x67452301,b0=0xefcdab89,c0=0x98badcfe,d0=0x10325476;
for(let o=0;o<len;o+=64){const M=Array.from({length:16},(_,i)=>dv.getUint32(o+i*4,true));let A=a0,B=b0,C=c0,D=d0;
for(let i=0;i<64;i++){let F,g;if(i<16){F=(B&C)|(~B&D);g=i}else if(i<32){F=(D&B)|(~D&C);g=(5*i+1)%16}else if(i<48){F=B^C^D;g=(3*i+5)%16}else{F=C^(B|~D);g=(7*i)%16}
F=(F+A+K[i]+M[g])>>>0;A=D;D=C;C=B;const s=S[(i>>4)*4+(i%4)];B=(B+((F<<s)|(F>>>(32-s))))>>>0}
a0=(a0+A)>>>0;b0=(b0+B)>>>0;c0=(c0+C)>>>0;d0=(d0+D)>>>0}
const out=new DataView(new ArrayBuffer(16));[a0,b0,c0,d0].forEach((x,i)=>out.setUint32(i*4,x,true));return[...new Uint8Array(out.buffer)].map(x=>x.toString(16).padStart(2,"0")).join("")}
T.hash=r=>{const t=el("textarea",{rows:3});t.setAttribute("aria-label","Text to hash");const o=el("div");
r.append(t,btn("Generate",async()=>{o.replaceChildren();if(!t.value){o.textContent="Enter some text first.";return}for(const a of["MD5","SHA-1","SHA-256","SHA-384","SHA-512"]){if(a!=="MD5"&&!hasSub){o.append(el("p",{textContent:a+" needs Web Crypto (HTTPS or localhost)."}));continue}
const v=a==="MD5"?md5(new TextEncoder().encode(t.value)):await sha(a,t.value),d=el("div",{className:"out",textContent:a+": "+v}),w=el("div");w.append(d,btn("Copy "+a,b=>copy(d.textContent.split(": ")[1],b),1));o.append(w)}}),btn("Clear",()=>{t.value="";o.replaceChildren()},1),o)};
const b64enc=s=>{const b=new TextEncoder().encode(s);let x="";for(let i=0;i<b.length;i+=8192)x+=String.fromCharCode.apply(null,b.subarray(i,i+8192));return btoa(x)},b64dec=s=>new TextDecoder("utf-8",{fatal:true}).decode(Uint8Array.from(atob(s.replace(/\s+/g,"")),c=>c.charCodeAt(0)));
T.base64=r=>{const t=el("textarea",{rows:3});t.setAttribute("aria-label","Input");let bo="";const o=el("div",{className:"out",textContent:"—"});o.setAttribute("aria-live","polite");
const set=v=>{bo=v;o.textContent=v||"—"};
const enc=b64enc,dec=b64dec;
r.append(t,btn("Encode",()=>{try{set(enc(t.value))}catch(e){set("");o.textContent="Could not encode this input."}}),btn("Decode",()=>{try{set(dec(t.value))}catch(e){set("");o.textContent="Invalid Base64 or not valid UTF-8 text."}}),btn("Swap",()=>{t.value=bo;set("")},1),btn("Copy",b=>bo&&copy(bo,b),1),btn("Clear",()=>{t.value="";set("")},1),o)};
document.addEventListener("DOMContentLoaded",()=>{document.querySelectorAll("[data-tool]").forEach(t=>{if(T[t.dataset.tool])T[t.dataset.tool](t,(t.dataset.show||"").split(","))})});
