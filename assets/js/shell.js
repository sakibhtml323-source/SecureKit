"use strict";
/* SecureKit app shell: theme, drawer, search (Ctrl/Cmd+K or /), favorites and recent (tool IDs only), service worker, ?test=1 loader. */
(()=>{
const ROOT=new URL("../../",document.currentScript.src),KT="securekit:theme",KF="securekit:favorites",KR="securekit:recent",$=id=>document.getElementById(id);
const get=k=>{try{return localStorage.getItem(k)}catch(e){return null}},put=(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}};
const ids=k=>{try{const a=JSON.parse(get(k)||"[]");return Array.isArray(a)?a.filter(x=>typeof x==="string"&&/^[a-z0-9-]+$/.test(x)).slice(0,50):[]}catch(e){return[]}};
const mk=(t,p,...k)=>{const e=document.createElement(t);if(p)Object.assign(e,p);e.append(...k);return e};
let theme=get(KT);if(theme!=="dark"&&theme!=="light"&&theme!=="system")theme="system";
const apply=()=>theme==="system"?document.documentElement.removeAttribute("data-theme"):document.documentElement.setAttribute("data-theme",theme);
let index=null;const load=()=>index?Promise.resolve(index):fetch(new URL("data/search-index.json",ROOT)).then(r=>{if(!r.ok)throw 0;return r.json()}).then(j=>index=Array.isArray(j)?j:[]).catch(()=>index=[]);
const link=t=>mk("a",{href:new URL(t.path,ROOT).href},mk("span",{textContent:t.name}));
document.addEventListener("DOMContentLoaded",()=>{
apply();const tb=$("themebtn");if(tb){const lb=()=>{tb.textContent="Theme: "+theme;tb.setAttribute("aria-label","Change theme, current: "+theme)};lb();tb.onclick=()=>{theme=theme==="system"?"dark":theme==="dark"?"light":"system";put(KT,theme);apply();lb()}}
const side=$("side"),scrim=$("scrim"),menu=$("menu"),setDrawer=o=>{side.classList.toggle("open",o);scrim.hidden=!o;menu.setAttribute("aria-expanded",String(o))};
if(menu){menu.onclick=()=>setDrawer(!side.classList.contains("open"));scrim.onclick=()=>setDrawer(false);side.addEventListener("click",e=>{if(e.target.closest("a"))setDrawer(false)})}
const cur=location.pathname.split("/").pop()||"index.html";document.querySelectorAll(".side nav a").forEach(a=>{if(a.getAttribute("href").split("/").pop()===cur)a.setAttribute("aria-current","page")});
/* search */
const dlg=mk("dialog",{className:"sk-dlg"});
if(typeof dlg.showModal==="function"){dlg.setAttribute("aria-label","Search tools");
const inp=mk("input",{type:"search",placeholder:"Search tools…",autocomplete:"off"}),ul=mk("ul");inp.setAttribute("aria-label","Search tools");
const render=()=>{const q=inp.value.trim().toLowerCase(),f=ids(KF);let it=(index||[]).filter(t=>!q||(t.name+" "+t.c+" "+t.k.join(" ")+" "+t.s).toLowerCase().includes(q));if(!q)it=it.slice().sort((a,b)=>f.includes(b.id)-f.includes(a.id));
ul.replaceChildren(...it.slice(0,40).map(t=>mk("li",null,mk("a",{href:new URL(t.path,ROOT).href,textContent:(f.includes(t.id)?"★ ":"")+t.name+" · "+t.c}))));if(!it.length)ul.textContent="No matching tools."};
inp.oninput=render;inp.onkeydown=e=>{if(e.key==="Enter"){const a=ul.querySelector("a");if(a)location.href=a.href}};
dlg.append(inp,ul,mk("p",{className:"note",textContent:"Press Esc to close."}));dlg.addEventListener("click",e=>{if(e.target===dlg)dlg.close()});document.body.append(dlg);
const open=async()=>{setDrawer(false);await load();inp.value="";render();dlg.showModal();inp.focus()};
const sb=$("searchbtn");if(sb)sb.onclick=open;
document.addEventListener("keydown",e=>{const t=e.target,tag=t&&t.tagName,typing=tag==="INPUT"||tag==="TEXTAREA"||tag==="SELECT"||(t&&t.isContentEditable);
if(dlg.open)return;if((e.key==="k"||e.key==="K")&&(e.ctrlKey||e.metaKey)){e.preventDefault();open();return}
if(e.key==="/"&&!typing&&!e.ctrlKey&&!e.metaKey&&!e.altKey){e.preventDefault();open()}})}
else if($("searchbtn"))$("searchbtn").hidden=true;
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&side&&side.classList.contains("open"))setDrawer(false)});
/* favorites + recent (IDs only) */
const head=document.querySelector("[data-tool-id]"),id=head&&head.dataset.toolId;
const showLists=async()=>{const f=ids(KF),r=ids(KR);for(const [box,list] of [["sk-fav",f],["sk-rec",r]]){const el=$(box);if(el)el.hidden=!list.length}
if(!f.length&&!r.length)return;await load();for(const [box,list] of [["sk-fav",f],["sk-rec",r]]){const el=$(box);if(!el||!list.length)continue;const lst=el.querySelector(".lst");lst.replaceChildren(...list.map(i=>(index||[]).find(t=>t.id===i)).filter(Boolean).slice(0,8).map(link))}};
if(id){const fb=mk("button",{type:"button",className:"s"}),paint=()=>{const on=ids(KF).includes(id);fb.textContent=on?"★ Favorite":"☆ Add to favorites";fb.setAttribute("aria-pressed",String(on))};paint();
fb.onclick=()=>{let f=ids(KF);f=f.includes(id)?f.filter(x=>x!==id):f.concat(id);put(KF,JSON.stringify(f));paint();showLists()};head.append(fb);
put(KR,JSON.stringify([id].concat(ids(KR).filter(x=>x!==id)).slice(0,8)))}
showLists();
if(new URLSearchParams(location.search).get("test")==="1")document.head.append(mk("script",{src:new URL("assets/js/selftest.js",ROOT).href}));
});
if("serviceWorker"in navigator&&(location.protocol==="https:"||location.hostname==="localhost"||location.hostname==="127.0.0.1"))window.addEventListener("load",()=>{navigator.serviceWorker.register(new URL("sw.js",ROOT).href).catch(()=>{})});
})();
