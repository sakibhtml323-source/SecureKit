"use strict";
// Runs the self-test vectors plus DOM-simulated UI checks in Node. Usage: node tests/run_tests.js
const fs=require("fs"),cp=require("child_process"),path=require("path");process.chdir(path.join(__dirname,".."));
class El{constructor(t){this.tag=t;this.children=[];this.attrs={};this.style={};this.classList={add(){},remove(){},toggle(){return true}};this.hidden=false;this.value="";this.textContent="";this.ev={}}
append(...k){this.children.push(...k);if(this.tag==="select"&&!this.value){const o=k.find(x=>x&&x.tag==="option");if(o)this.value=o.value}}prepend(...k){this.children.unshift(...k)}replaceChildren(...k){this.children=k}setAttribute(a,v){this.attrs[a]=v}after(){}addEventListener(t,f){(this.ev[t]=this.ev[t]||[]).push(f)}}
const txt=e=>typeof e==="string"?e:(e.hidden?"":(e.textContent||"")+" "+e.children.map(txt).join(" ")),all=(e,o=[])=>{if(typeof e!=="string"){o.push(e);e.children.forEach(c=>all(c,o))}return o};
global.document={createElement:t=>new El(t),addEventListener(){},currentScript:{src:"http://x/assets/js/app.js"},querySelectorAll:()=>[]};
global.window={crypto:globalThis.crypto,print(){}};Object.defineProperty(globalThis,"navigator",{value:{onLine:true},configurable:true});global.fetch=()=>Promise.reject(new TypeError("offline"));
const TOOLJS=fs.readdirSync("assets/js/tools").sort().map(f=>"assets/js/tools/"+f);
const src=["assets/js/app.js","assets/js/qr.js"].concat(TOOLJS,["assets/js/selftest.js","tests/encryption_tests.js","tests/auth_tests.js"]).map(f=>fs.readFileSync(f,"utf8")).join("\n").replace(/"use strict";/g,"");
const X=new Function("document","window","fetch",src+";return {skRunTests,skEncryptionTests,skAuthTests,T}")(document,window,fetch);
const click=(r,l)=>{const b=all(r).find(x=>x.tag==="button"&&x.textContent===l);if(!b)throw new Error("no button "+l);return b.onclick(b)};
(async()=>{const R=(await X.skRunTests()).concat(await X.skEncryptionTests(),await X.skAuthTests()),u=(n,f)=>{try{R.push([n,!!f()])}catch(e){R.push([n,false])}};
let r=new El("div");X.T.analyzer(r,"score,entropy,eff,crack,common,pattern,issues,tips".split(","));const pw=all(r).find(x=>x.tag==="input");pw.value="1234";pw.oninput();
const a=txt(r);u("ui: analyzer shows score once",()=>(a.match(/Estimated Security Score/g)||[]).length===1&&/Match found/.test(a)&&/1 second|seconds|under a second/.test(a));
r=new El("div");X.T.passphrase(r,[]);const cb=all(r).filter(x=>x.type==="checkbox");cb[1].checked=true;cb[2].checked=true;click(r,"Generate");u("ui: passphrase breakdown",()=>/× log2\(\d+\) = [\d.]+ \+ 2-digit number 6\.6 \+ symbol/.test(txt(r)));
r=new El("div");X.T.password(r,[]);const bx=all(r).filter(x=>x.type==="checkbox"),pool=()=>+txt(r).match(/Character pool: (\d+)/)[1];const p0=pool();bx[4].checked=true;bx[4].ev.change.forEach(f=>f());u("ui: generator pool updates",()=>p0===89&&pool()===79);
r=new El("div");X.T.qr(r,[]);const ty=all(r).find(x=>x.tag==="select");ty.value="URL";ty.onchange();const hid=()=>all(r).filter(x=>x.hidden&&["label","input","select"].includes(x.tag)).length,hu=hid();ty.value="Wi-Fi";ty.onchange();u("ui: qr hides wifi fields for URL",()=>hu===3&&hid()===0);
r=new El("div");X.T.breach(r,[]);all(r).find(x=>x.tag==="input").value="abc";await click(r,"Check");await new Promise(z=>setTimeout(z,30));u("ui: breach network error message",()=>/Network error/.test(txt(r))&&!/Not breached|No match found/.test(txt(r)));
for(const[n,m]of[["enc: mount hmac","hmac"],["enc: mount symenc","symenc"],["enc: mount keypair","keypair"],["enc: mount rsaoaep","rsaoaep"],["enc: mount signature","signature"],["enc: mount ecdh","ecdh"],["enc: mount jwkpem","jwkpem"],["enc: mount kdf","kdf"],["enc: mount hashid","hashid"],["enc: mount crc","crc"],["enc: mount classic","classic"],["enc: mount xorcipher","xorcipher"],["enc: mount sshfp","sshfp"],["enc: mount merkle","merkle"],["enc: mount randtest","randtest"]])u(n,()=>{X.T[m](new El("div"),[]);return true});
for(const[n,m]of[["auth: mount totp","totp"],["auth: mount otpauth","otpauth"],["auth: mount policy","policy"],["auth: mount backup","backup"],["auth: mount reuse","reuse"],["auth: mount lockout","lockout"],["auth: mount alias","alias"],["auth: mount csvaudit","csvaudit"],["auth: mount mfa","mfa"],["auth: mount wordlist","wordlist"]])u(n,()=>{X.T[m](new El("div"),[]);return true});
{const lab=(r,l)=>all(r).find(x=>x.attrs&&x.attrs["aria-label"]===l),box=(m,show)=>{const r=new El("div");X.T[m](r,show||[]);return r},areas=r=>all(r).filter(x=>x.tag==="textarea"),inputs=r=>all(r).filter(x=>x.tag==="input");
let r=box("policy");areas(r)[0].value="short\nXk9mP2vL8nQ4";click(r,"Check against policy");u("ui: policy checker runs",()=>/#1 \(5 chars\): FAIL/.test(txt(r))&&/#2 \(12 chars\): PASS/.test(txt(r))&&!/Xk9mP2/.test(txt(r)));
r=box("backup");click(r,"Generate");u("ui: backup codes generate",()=>(txt(r).match(/[A-Z2-9]{5}-[A-Z2-9]{5}/g)||[]).length>=10);
r=box("alias");lab(r,"Your email").value="me@gmail.com";lab(r,"Tags").value="shop, bank";click(r,"Generate aliases");u("ui: email aliases generate",()=>/me\+shop@gmail.com/.test(txt(r))&&/me\+bank@gmail.com/.test(txt(r)));
r=box("mfa");click(r,"Recommend");u("ui: mfa advisor runs",()=>/1\. Passkey or FIDO2/.test(txt(r)));
r=box("lockout");click(r,"Calculate");u("ui: lockout calculator runs",()=>/guesses per day/.test(txt(r))&&/Chance/.test(txt(r)));
r=box("totp");lab(r,"Base32 secret").value="GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ";click(r,"Generate code");await new Promise(z=>setTimeout(z,50));const tt=txt(r);click(r,"Stop");u("ui: totp generates a code",()=>/\b\d{6}\b/.test(tt)&&/Valid for/.test(tt));
r=box("otpauth");lab(r,"Issuer").value="Example";lab(r,"Account").value="alice@example.com";lab(r,"Base32 secret").value="JBSWY3DPEHPK3PXP";click(r,"Build link and QR");u("ui: otpauth builds a link",()=>/otpauth:\/\/totp\/Example:alice%40example.com\?secret=JBSWY3DPEHPK3PXP/.test(txt(r)));
r=box("csvaudit");areas(r)[0].value="name,password\nA,123456\nB,Xk9#mP2$vL8@nQ4!";click(r,"Audit");u("ui: csv audit runs",()=>/Flagged: 1/.test(txt(r))&&!/123456/.test(txt(r)));
r=box("wordlist");areas(r)[0].value="5f4dcc3b5aa765d61d8327deb882cf99";areas(r)[1].value="letmein\npassword";click(r,"Match");await new Promise(z=>setTimeout(z,100));u("ui: hash wordlist matcher runs",()=>/->  password  \(MD5\)/.test(txt(r)))}
const bad=R.filter(x=>!x[1]);bad.forEach(x=>console.log("FAIL",x[0]));
for(const f of fs.readdirSync("assets/js").filter(x=>x.endsWith(".js")).map(x=>"assets/js/"+x).concat(TOOLJS,["sw.js"])){try{cp.execFileSync("node",["--check",f],{stdio:"pipe"})}catch(e){bad.push([f]);console.log("SYNTAX FAIL",f)}}
console.log(`tests: ${R.length-R.filter(x=>!x[1]).length}/${R.length} passed`);process.exit(bad.length?1:0)})();
