"use strict";
function skLevenshtein(a,b){const m=a.length,n=b.length;if(!m)return n;if(!n)return m;let prev=Array.from({length:n+1},(_,j)=>j);for(let i=1;i<=m;i++){const cur=[i];for(let j=1;j<=n;j++)cur[j]=Math.min(prev[j]+1,cur[j-1]+1,prev[j-1]+(a[i-1]===b[j-1]?0:1));prev=cur}return prev[n]}
function skLongestCommon(a,b){let best=0,prev=new Array(b.length+1).fill(0);for(let i=1;i<=a.length;i++){const cur=new Array(b.length+1).fill(0);for(let j=1;j<=b.length;j++)if(a[i-1]===b[j-1]){cur[j]=prev[j-1]+1;if(cur[j]>best)best=cur[j]}prev=cur}return best}
function skReuseReport(list){const exact=[],similar=[],shared=[],n=list.length,seen=new Map();
list.forEach((p,i)=>{const k=p.toLowerCase();if(!seen.has(k))seen.set(k,[]);seen.get(k).push(i+1)});
for(const ids of seen.values())if(ids.length>1)exact.push(ids);
for(let i=0;i<n;i++)for(let j=i+1;j<n;j++){const a=list[i].toLowerCase(),b=list[j].toLowerCase();if(a===b)continue;const sim=1-skLevenshtein(a,b)/Math.max(a.length,b.length);if(sim>=.75)similar.push([i+1,j+1,Math.round(sim*100)]);else{const c=skLongestCommon(a,b);if(c>=6)shared.push([i+1,j+1,c])}}
return{exact,similar,shared}}
T.reuse=r=>{const inp=skArea("Passwords",6,"One password per line (kept only on this page)"),o=skOut(r);r.prepend(skBox("Passwords to compare (up to 200, one per line)",inp));
r.append(btn("Compare",()=>{const L=inp.value.split(/\r?\n/).filter(x=>x.length).slice(0,200);if(L.length<2){o.err("Enter at least two passwords.");return}const x=skReuseReport(L),lines=[];
x.exact.forEach(g=>lines.push("Same password (ignoring case): lines "+g.join(", ")));x.similar.forEach(([a,b,s])=>lines.push("Very similar: lines "+a+" and "+b+" ("+s+"% alike)"));x.shared.forEach(([a,b,c])=>lines.push("Share a "+c+"-character chunk: lines "+a+" and "+b));
o.set(lines.length?lines.join("\n"):"No reuse or close similarity found.","Compared "+L.length+" passwords. Only line numbers are shown. Similar passwords are almost as risky as reused ones if one leaks.")}),btn("Clear",()=>{inp.value="";o.clear()},1))};
