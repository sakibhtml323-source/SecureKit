#!/usr/bin/env python3
"""Build the static SecureKit site from data/ + templates/ + content/ + site.config.json.
Usage: python3 scripts/build_site.py   (edit site.config.json first: siteUrl, contactEmail, owner)"""
import json,os,re,html,glob,hashlib,datetime
R=os.path.dirname(os.path.dirname(os.path.abspath(__file__)));os.chdir(R)
J=lambda p:json.load(open(p,encoding="utf-8"));E=lambda s:html.escape(str(s),quote=True)
cfg=J("site.config.json");CATS=J("data/categories.json")["categories"];REG=J("data/tools.json")["tools"]
live=sorted([t for t in REG if t["status"]=="live"],key=lambda t:(t.get("order",999),t["id"]));byid={t["id"]:t for t in live};cat={c["id"]:c for c in CATS}
active=[c for c in CATS if any(t["category"]==c["id"] for t in live)];URL=cfg["siteUrl"].rstrip("/");NOTE="This is general informational content and should be reviewed for your specific business and jurisdiction. It is not legal advice."
TPL=lambda n:open(f"templates/{n}"+("" if n.endswith(".js") else ".html"),encoding="utf-8").read()
def render(t,c):return re.sub(r"\{\{(\w+)\}\}",lambda m:str(c[m.group(1)]),t)
def W(p,s):os.makedirs(os.path.dirname(p) or ".",exist_ok=True);open(p,"w",encoding="utf-8").write(s)
ini=lambda n:"".join(w[0] for w in re.findall(r"[A-Za-z0-9]+",n)[:2]).upper()
cnt=lambda cid:sum(t["category"]==cid for t in live)
LEGAL=[("about","About"),("privacy","Privacy"),("terms","Terms"),("cookie-policy","Cookie Policy"),("disclaimer","Disclaimer"),("contact","Contact")]
def card(t,b):return f'<a class="tcard c-{t["category"]}" href="{b}tools/{t["id"]}.html"><span class="ico" aria-hidden="true">{E(ini(t["name"]))}</span><strong>{E(t["name"])}</strong><span class="desc">{E(t["summary"])}</span><em class="tag">{E(cat[t["category"]]["name"])}</em></a>'
def ccard(c,b):return f'<a class="tcard c-{c["id"]}" href="{b}categories/{c["id"]}.html"><span class="ico" aria-hidden="true">{E(ini(c["name"]))}</span><strong>{E(c["name"])}</strong><span class="desc">{E(c["description"])}</span><em class="tag">{cnt(c["id"])} tools</em></a>'
def sidebar(b):
    cl="".join(f'<a href="{b}categories/{c["id"]}.html"><span>{E(c["name"])}</span><b>{cnt(c["id"])}</b></a>' for c in active)
    q="".join(f'<a href="{b}tools/{t["id"]}.html"><span>{E(t["name"])}</span></a>' for t in live if t.get("featured"))
    return f'<a class="brand" href="{b}index.html"><img src="{b}assets/icons/favicon.svg" alt="" width="32" height="32"><span><strong>SecureKit</strong><small>Analyze · Detect · Fix · Stay Secure</small></span></a><nav aria-label="Main"><a href="{b}index.html"><span>Home</span></a><a href="{b}categories/index.html"><span>All categories</span></a></nav><div id="sk-fav" hidden><h2>Favorites</h2><nav class="lst" aria-label="Favorites"></nav></div><div id="sk-rec" hidden><h2>Recent</h2><nav class="lst" aria-label="Recent tools"></nav></div><h2>Categories</h2><nav aria-label="Categories">{cl}</nav><h2>Quick access</h2><nav aria-label="Quick access">{q}</nav>'
def footer(b):return '<nav aria-label="Footer">'+"".join(f'<a href="{b}{k}.html">{n}</a>' for k,n in LEGAL)+f'</nav><p>SecureKit v{cfg["version"]} · Privacy-first browser-based security tools. © {cfg["year"]} SecureKit. All rights reserved.</p>'
def ld(*o):return "".join('<script type="application/ld+json">'+json.dumps(x,ensure_ascii=False)+"</script>\n" for x in o)
def page(out,title,desc,content,base="",scripts=("shell.js",),jsonld="",noindex=False,basetag=""):
    can=URL+"/"+("" if out=="index.html" else out)
    W(out,render(TPL("base"),dict(title=E(title),description=E(desc),canonical=E(can),robots='<meta name="robots" content="noindex">\n' if noindex else "",basetag=basetag,base=base,jsonld=jsonld,sidebar=sidebar(base),content=content,footer=footer(base),scripts="".join(f'<script src="{base}assets/js/{s}"></script>\n' for s in scripts))))
made=[]
# tools
for t in live:
    c=cat[t["category"]];net=t["runtime"]["network"];show=",".join(t["runtime"].get("options",{}).get("show",[]))
    badges="<span>Runs locally</span><span>Free</span><span>No login</span>"+("<span>Needs internet for lookup</span>" if net else "")
    info=[("Where it runs","In your browser (client-side)"),("Network requests","None" if not net else "Only to "+", ".join(net)),("Stores your input","No"),("Analytics","None"),("Price and login","Free, no account needed"),("Version",t["version"])]
    rel="".join(card(byid[r],"../") for r in t.get("related",[]) if r in byid)
    body=render(TPL("tool"),dict(cat=c["id"],catname=E(c["name"]),id=t["id"],name=E(t["name"]),badges=badges,intro=E(t.get("intro",t["summary"])),module=t["runtime"]["module"],show=E(show),notes="".join(f"<li>{E(n)}</li>" for n in t.get("notes",[])),faq="".join(f"<h3>{E(f['q'])}</h3><p>{E(f['a'])}</p>" for f in t["faq"]),info="".join(f"<tr><th scope=\"row\">{E(a)}</th><td>{E(b)}</td></tr>" for a,b in info),related=rel))
    url=f'{URL}/tools/{t["id"]}.html';ac="DeveloperApplication" if t["category"]=="developer-utilities" else "SecurityApplication"
    j=ld({"@context":"https://schema.org","@graph":[{"@type":"WebApplication","name":t["name"],"url":url,"description":t["summary"],"applicationCategory":ac,"operatingSystem":"Any","browserRequirements":"Requires JavaScript"},
      {"@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":URL+"/"},{"@type":"ListItem","position":2,"name":c["name"],"item":f'{URL}/categories/{c["id"]}.html'},{"@type":"ListItem","position":3,"name":t["name"],"item":url}]},
      {"@type":"FAQPage","mainEntity":[{"@type":"Question","name":f["q"],"acceptedAnswer":{"@type":"Answer","text":f["a"]}} for f in t["faq"]]}]})
    page(f'tools/{t["id"]}.html',t.get("seoTitle",t["name"])+" | SecureKit",t["summary"],body,"../",("app.js",)+(("qr.js",) if t["runtime"]["module"]=="qr" else ())+tuple(t["runtime"].get("scripts",[]))+("shell.js",),j);made.append(f'tools/{t["id"]}.html')
# categories
for c in active:
    ts=[t for t in live if t["category"]==c["id"]]
    page(f'categories/{c["id"]}.html',c["name"]+" Tools | SecureKit",c["description"],f'<nav class="crumb" aria-label="Breadcrumb"><a href="../index.html">Home</a> › <a href="index.html">Categories</a> › {E(c["name"])}</nav><h1>{E(c["name"])}</h1><p class="lead">{E(c["description"])}</p><div class="tgrid">'+"".join(card(t,"../") for t in ts)+"</div>","../");made.append(f'categories/{c["id"]}.html')
page("categories/index.html","All Categories | SecureKit","Browse every SecureKit category of free, browser-based security and developer tools.",'<nav class="crumb" aria-label="Breadcrumb"><a href="../index.html">Home</a> › Categories</nav><h1>All categories</h1><div class="tgrid">'+"".join(ccard(c,"../") for c in active)+'</div><h2>All tools</h2><div class="tgrid">'+"".join(card(t,"../") for t in live)+"</div>","../");made.append("categories/index.html")
# home
stats="".join(f'<div class="m"><b>{a}</b>{b}</div>' for a,b in[("Tools",len(live)),("Categories",len(active)),("Processing","In your browser"),("Tool inputs stored","None")])
page("index.html","SecureKit | Privacy-First Password & Security Toolkit","Free browser-based tools to analyze passwords, check breaches with k-anonymity, generate secure values, hash, encode and more. No account needed.",render(TPL("home"),dict(stats=stats,popular="".join(card(t,"") for t in live if t.get("featured")),catcards="".join(ccard(c,"") for c in active),education=open("content/home-education.html",encoding="utf-8").read())),"",("shell.js",),ld({"@context":"https://schema.org","@type":"WebSite","name":"SecureKit","url":URL+"/","description":"Privacy-first security and developer tools that work directly in your browser."}));made.append("index.html")
# legal + 404
for slug,_ in LEGAL:
    L=J(f"content/legal/{slug}.json");page(slug+".html",L["title"]+" | SecureKit",L["description"],f'<h1>{L["h1"]}</h1>\n'+L["body"].replace("{{email}}",E(cfg["contactEmail"]))+f'\n<p class="note">{L["note"]}</p>');made.append(slug+".html")
page("404.html","Page not found | SecureKit","The page you requested could not be found on SecureKit.",'<h1>Page not found</h1><p class="lead">The page you are looking for does not exist or has moved.</p><p><a class="btn" href="index.html">Go to Home</a><a class="btn s" href="categories/index.html">Browse all tools</a></p><h2>Popular tools</h2><div class="tgrid">'+"".join(card(t,"") for t in live if t.get("featured"))+"</div>","",noindex=True,basetag=f'<base href="{E(cfg["basePath"])}">\n')
# remove stale generated pages
for f in glob.glob("tools/*.html")+glob.glob("categories/*.html"):
    if f not in made:os.remove(f)
# data + seo files
W("data/search-index.json",json.dumps([{"id":t["id"],"name":t["name"],"c":cat[t["category"]]["name"],"path":f'tools/{t["id"]}.html',"s":t["summary"],"k":t.get("tags",[])} for t in live],ensure_ascii=False,separators=(",",":")))
today=datetime.date.today().isoformat();pages=["index.html"]+[p for p in made if p!="index.html"]
W("sitemap.xml",'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+"".join(f'  <url><loc>{URL}/{"" if p=="index.html" else p}</loc><lastmod>{today}</lastmod></url>\n' for p in pages if p!="404.html")+"</urlset>\n")
W("robots.txt",f"User-agent: *\nAllow: /\n\nSitemap: {URL}/sitemap.xml\n")
# security headers from declared network hosts
hosts=sorted({h for t in live for h in t["runtime"]["network"]})
csp="default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'"+"".join(" https://"+h for h in hosts)+"; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'"
H=[("Content-Security-Policy",csp),("X-Content-Type-Options","nosniff"),("Referrer-Policy","strict-origin-when-cross-origin"),("Permissions-Policy","camera=(), microphone=(), geolocation=()"),("Strict-Transport-Security","max-age=31536000")]
W("_headers","/*\n"+"".join(f"  {k}: {v}\n" for k,v in H));W("vercel.json",json.dumps({"headers":[{"source":"/(.*)","headers":[{"key":k,"value":v} for k,v in H]}]},indent=2)+"\n")
# service worker: file list + content-hash cache name
files=sorted(f for f in glob.glob("**/*",recursive=True) if os.path.isfile(f) and (f.startswith(("assets/","tools/","categories/")) or f in("data/common-passwords.json","data/passphrase-words.json","data/search-index.json","site.webmanifest") or (f.endswith(".html") and "/" not in f)) and not f.endswith("selftest.js"))
h=hashlib.sha256();[h.update(open(f,"rb").read()) for f in files]
W("sw.js",TPL("sw.js").replace("__CACHE__","securekit-"+h.hexdigest()[:12]).replace("__FILES__",json.dumps(["./"]+files)))
print(f"built {len(live)} tools, {len(active)} categories, {len(pages)} pages; network hosts: {hosts}")
