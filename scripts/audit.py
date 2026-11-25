#!/usr/bin/env python3
"""Release audit. Run after build_site.py: python3 scripts/audit.py (exit code 1 on any error)."""
import json,os,re,glob,subprocess,sys
R=os.path.dirname(os.path.dirname(os.path.abspath(__file__)));os.chdir(R)
J=lambda p:json.load(open(p,encoding="utf-8"));err=[]
r=subprocess.run([sys.executable,"scripts/validate_registry.py"],capture_output=True,text=True)
if r.returncode:err.append("registry invalid:\n"+r.stdout)
live=[t for t in J("data/tools.json")["tools"] if t["status"]=="live"]
mods=set(re.findall(r"T\.(\w+)=",open("assets/js/app.js").read()+open("assets/js/qr.js").read()+"".join(open(f).read() for f in glob.glob("assets/js/tools/*.js"))))
cov=J("tests/coverage.json");tsrc=open("assets/js/selftest.js").read()+"".join(open(f).read() for f in glob.glob("tests/*.js"))
for t in live:
    i=t["id"]
    for sc in t["runtime"].get("scripts",[]):
        if not os.path.exists("assets/js/"+sc):err.append(f"{i}: script missing {sc}")
    if t["runtime"]["module"] not in mods:err.append(f"{i}: module '{t['runtime']['module']}' not implemented")
    if not os.path.exists(f"tools/{i}.html"):err.append(f"{i}: page not built")
    if not cov.get(i):err.append(f"{i}: no test coverage entry")
    for n in cov.get(i,[]):
        if n not in tsrc:err.append(f"{i}: test '{n}' not found")
pages=glob.glob("*.html")+glob.glob("tools/*.html")+glob.glob("categories/*.html");titles={};descs={};sm=open("sitemap.xml").read()
for f in pages:
    t=open(f,encoding="utf-8").read()
    for need in['lang="en"','rel="canonical"','og:title','twitter:card','name="viewport"','id="main"']:
        if need not in t:err.append(f"{f}: missing {need}")
    if len(re.findall(r"<h1[ >]",t))!=1:err.append(f"{f}: needs exactly one h1")
    ti=re.search(r"<title>(.*?)</title>",t).group(1);de=re.search(r'name="description" content="(.*?)"',t).group(1)
    for d,v,k in((titles,ti,"title"),(descs,de,"description")):
        if v in d:err.append(f"{f}: duplicate {k} with {d[v]}")
        d[v]=f
    for m in re.findall(r'<script type="application/ld\+json">(.*?)</script>',t,re.S):
        try:json.loads(m)
        except Exception:err.append(f"{f}: invalid JSON-LD")
    if re.search(r'\sstyle="|<style|<script>[^<]|\son\w+="',t):err.append(f"{f}: inline code (breaks strict CSP)")
    for h in re.findall(r'(?:href|src)="([^"]+)"',t):
        if re.match(r"(https?:|mailto:|#|data:)",h):continue
        # Skip base tag hrefs (they're for GitHub Pages subdirectory, not local files)
        if re.search(r'<base\s+href="[^"]*"', t) and h == re.search(r'<base\s+href="([^"]*)"', t).group(1):
            continue
        p=os.path.normpath(os.path.join("." if f=="404.html" else os.path.dirname(f),h.split("#")[0].split("?")[0]))
        if not os.path.exists(p):err.append(f"{f}: broken link {h}")
    if f!="404.html" and ("/"+f if f!="index.html" else "/<") not in sm:err.append(f"{f}: not in sitemap")
home=open("index.html").read();m=re.search(r"<b>Tools</b>(\d+)",home)
if not m or int(m.group(1))!=len(live):err.append("home tool count does not match registry")
js="".join(open(f,encoding="utf-8").read() for f in glob.glob("assets/js/*.js")+glob.glob("assets/js/tools/*.js"))
for k in["Math.random","console.","eval(","new Function","innerHTML","document.cookie","sessionStorage","TODO","FIXME","unsafe-"]:
    if k in js:err.append(f"forbidden pattern in JS: {k}")
for ic in J("site.webmanifest")["icons"]:
    if not os.path.exists(ic["src"]):err.append("manifest icon missing "+ic["src"])
for f in re.findall(r'"([^"]+)"',re.search(r"const FILES=(\[.*?\]);",open("sw.js").read(),re.S).group(1)):
    if f!="./" and not os.path.exists(f):err.append("sw cache file missing "+f)
print(f"audit: {len(live)} live tools, {len(pages)} pages checked")
if err:print("\n".join("ERROR "+e for e in err));sys.exit(1)
print("AUDIT OK")
