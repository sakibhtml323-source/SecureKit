"use strict";
/* SecureKit developer self-test (?test=1). Uses fixed public test vectors only; no user data is read, stored or logged. */
async function skRunTests(){
const R=[],E=s=>new TextEncoder().encode(s),t=(n,f)=>{try{R.push([n,!!f()])}catch(e){R.push([n,false])}},ta=async(n,f)=>{try{R.push([n,!!await f()])}catch(e){R.push([n,false])}};
t("UUID v4 format",()=>/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(uuid()));
t("UUID uniqueness (200)",()=>new Set(Array.from({length:200},uuid)).size===200);
t("Random range and spread",()=>{const c=new Array(10).fill(0);for(let i=0;i<10000;i++){const v=rnd(10);if(v<0||v>9)return false;c[v]++}return c.every(x=>x>800&&x<1200)});
t("Shuffle keeps elements",()=>shuffle([1,2,3,4,5,6,7,8]).sort().join()==="1,2,3,4,5,6,7,8");
t("Generator classes and ambiguity option",()=>{for(let i=0;i<50;i++){const p=makeStr(24,["u","l","n","s"],true,true);if(p.length!==24||!/[A-Z]/.test(p)||!/[a-z]/.test(p)||!/\d/.test(p)||!/[^A-Za-z0-9]/.test(p)||[...p].some(c=>AMB.has(c)))return false}return true});
t("MD5 vectors",()=>md5(E(""))==="d41d8cd98f00b204e9800998ecf8427e"&&md5(E("abc"))==="900150983cd24fb0d6963f7d28e17f72");
await ta("SHA-1 vector",async()=>await sha("SHA-1","abc")==="a9993e364706816aba3e25717850c26c9cd0d89d");
await ta("SHA-256 vector",async()=>await sha("SHA-256","abc")==="ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad");
await ta("SHA-384 vector",async()=>await sha("SHA-384","abc")==="cb00753f45a35e8bb5a03d699ac65007272c32ab0eded1631a8b605a43ff5bed8086072ba1e7cc2358baeca134c825a7");
await ta("SHA-512 vector",async()=>await sha("SHA-512","abc")==="ddaf35a193617abacc417349ae20413112e6fa4e89a97ea20a9eeee64b55d39a2192992a274fc1a836ba3c23a3feebbd454d4423643ce80e2a9ac94fa54ca49f");
t("Base64 Unicode round trip",()=>{const s="বাংলা 😀 ünï — test";return b64dec(b64enc(s))===s&&b64enc("hello")==="aGVsbG8="});
t("Base64 malformed input rejected",()=>{try{b64dec("%%%");return false}catch(e){return true}});
t("Common password lookup",()=>analyze("123456").common&&!analyze("Xk9#mP2$vL8@nQ4!").common);
t("Pattern detection",()=>analyze("abcd1234").pattern&&analyze("qwerty99").pattern&&!analyze("Xk9#mP2$vL8@nQ4!").pattern);
t("Repeat detection",()=>analyze("aaaaaa").repeat&&analyze("abcabc").repeat&&!analyze("Xk9#mP2$vL8@nQ4!").repeat);
t("Strong random password scores 75+",()=>analyze("Xk9#mP2$vL8@nQ4!").sc>=75);
t("Entropy formula",()=>Math.abs(entropy("abcdef").bits-6*Math.log2(26))<.01&&entropy("").bits===0);
t("Crack-time ordering and units",()=>crack(40)[0][1]>crack(40)[1][1]&&fmtTime(.5)==="under a second"&&fmtTime(1e12)==="extremely long");
t("QR initialization",()=>typeof QR!=="undefined"&&QR.encode("Hello").size===21&&QR.encode("x".repeat(300)).version>=9);
t("Time formatting singular/plural",()=>fmtTime(1.2)==="1 second"&&fmtTime(3600)==="1 hour"&&fmtTime(86400)==="1 day"&&fmtTime(7200)==="2 hours"&&fmtTime(59.7)==="1 minute"&&fmtTime(0)==="under a second");
t("1234 is common, sequence and heavily penalized",()=>{const x=analyze("1234");return x.common&&x.pattern&&x.eff<x.e.bits&&x.sc<20});
t("Pattern warnings are not duplicated",()=>{const x=analyze("1234");return new Set(x.is).size===x.is.length&&x.is.filter(m=>/sequence/.test(m)).length===1});
t("PIN policy rejects repeated digits",()=>["3999","4494","1234","4321","1111","1212","2580","1123"].every(pinWeak)&&!pinWeak("3817"));
t("Generated PINs follow policy (4/6/8/10)",()=>[4,6,8,10].every(n=>{for(let i=0;i<300;i++){const p=pinOne(n);if(p.length!==n||pinWeak(p))return false}return true}));
return R}
(async()=>{
if(typeof document==="undefined"||!document.body||typeof T==="undefined")return;
if(typeof QR==="undefined")await new Promise(r=>{const s=document.createElement("script");s.src=new URL("qr.js",document.currentScript?document.currentScript.src:location.href).href;s.onload=s.onerror=r;document.head.append(s)});
const R=await skRunTests(),box=document.createElement("section");box.className="card";box.setAttribute("aria-label","Self-test results");
const h=document.createElement("h2");h.textContent="Self-test: "+R.filter(x=>x[1]).length+"/"+R.length+" passed";box.append(h);
const ul=document.createElement("ul");R.forEach(([n,ok])=>{const li=document.createElement("li");li.textContent=(ok?"PASS ":"FAIL ")+n;ul.append(li)});box.append(ul);document.body.prepend(box)})();
