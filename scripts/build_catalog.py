#!/usr/bin/env python3
"""Build docs/TOOL-CATALOG.md and data/tools-catalog.json from scripts/catalog_data.txt and enforce the no-duplicate rule."""
import json,os,re,sys,collections
R=os.path.dirname(os.path.dirname(os.path.abspath(__file__)));os.chdir(R)
AC={"jwt":"JWT","csp":"CSP","sri":"SRI","cors":"CORS","tls":"TLS","x509":"X.509","url":"URL","http":"HTTP","html":"HTML","css":"CSS","js":"JS","json":"JSON","xml":"XML","yaml":"YAML","toml":"TOML","sql":"SQL","pii":"PII","ip":"IP","cidr":"CIDR","mac":"MAC","dns":"DNS","har":"HAR","ssh":"SSH","hmac":"HMAC","rsa":"RSA","oaep":"OAEP","ecdh":"ECDH","jwk":"JWK","pem":"PEM","crc":"CRC","totp":"TOTP","otpauth":"OTPAuth","mfa":"MFA","csv":"CSV","api":"API","saml":"SAML","oauth":"OAuth","graphql":"GraphQL","aws":"AWS","sigv4":"SigV4","uuid":"UUID","qr":"QR","pdf":"PDF","svg":"SVG","cvss":"CVSS","owasp":"OWASP","stride":"STRIDE","utm":"UTM","ioc":"IOC","yara":"YARA","sbom":"SBOM","iac":"IaC","openpgp":"OpenPGP","ieee754":"IEEE 754","bigint":"BigInt","ids":"IDS","bcrypt":"bcrypt","argon2":"Argon2","wireguard":"WireGuard","nmap":"Nmap","ci":"CI","git":"Git","bijoy":"Bijoy","sqlite":"SQLite","websocket":"WebSocket","mime":"MIME","chmod":"chmod","hex":"Hex","pin":"PIN","id":"ID","pii":"PII","xlsx":"XLSX","hibp":"HIBP","csrf":"CSRF","xor":"XOR","aes":"AES","kdf":"KDF","ssh":"SSH","txt":"TXT","iban":"IBAN","env":".env","gitignore":".gitignore","cidr":"CIDR","base64":"Base64","bip":"BIP"}
name=lambda i:" ".join(AC.get(w,w.capitalize()) for w in i.split("-"))
ABSORBED={"sha256-generator":"hash-generator","md5-generator":"hash-generator","file-hash-calculator":"hash-generator","hash-verifier":"hash-generator","html-entity-encoder":"output-encoding-tool","string-escaper":"output-encoding-tool","xss-encoder":"output-encoding-tool","epoch-converter":"timestamp-converter","unix-timestamp":"timestamp-converter","password-checker":"password-strength","password-score":"password-strength","password-leak-check":"password-breach-check","random-password":"password-generator","diceware-generator":"passphrase-generator","qr-wifi-generator":"qr-generator","qr-url-generator":"qr-generator","qr-vcard-generator":"qr-generator","uuid-v7-generator":"uuid-generator","ulid-generator":"uuid-generator","nanoid-generator":"uuid-generator","base64-file-encoder":"base64","api-key-generator":"random-string","token-generator":"random-string","random-bytes-generator":"random-string","webhook-signature-verifier":"hmac-generator","tls-config-generator":"web-server-config-generator","headers-config-generator":"web-server-config-generator","nginx-config-generator":"web-server-config-generator","htaccess-generator":"web-server-config-generator","cors-config-generator":"web-server-config-generator","word-counter":"post-counter-preview","character-counter":"post-counter-preview","text-statistics":"post-counter-preview","jwt-decoder":"jwt-tool","jwt-signer":"jwt-tool","json-validator":"json-formatter","yaml-validator":"yaml-formatter","ssh-key-generator":"key-pair-generator","cidr-subnet-splitter":"cidr-calculator","vlsm-calculator":"cidr-calculator","ipv6-compressor":"ip-address-analyzer","exif-viewer":"metadata-tool","exif-remover":"metadata-tool","metadata-scrubber":"metadata-tool","hex-dump":"hex-viewer-strings","env-auditor":"secret-scanner","github-actions-generator":"ci-pipeline-generator","gitlab-ci-generator":"ci-pipeline-generator","pkce-generator":"oauth-request-builder","hotp-generator":"totp-generator","passkey-checker":"browser-security-checker","snort-rule-builder":"detection-rule-builder","sigma-rule-builder":"detection-rule-builder","incident-report-builder":"security-report-builder","vulnerability-report-builder":"security-report-builder","color-converter":"color-tool","contrast-checker":"color-tool","palette-generator":"color-tool","px-to-rem":"unit-converter","slug-generator":"text-case-converter","sri-generator":"sri-csp-hash-generator","csp-hash-generator":"sri-csp-hash-generator","mixed-content-checker":"html-security-linter","homograph-detector":"url-inspector","invisible-character-detector":"unicode-inspector","regex-replacer":"regex-tester","dockerfile-linter":"iac-security-linter","k8s-linter":"iac-security-linter","fake-data-generator":"mock-data-generator","json-schema-sample-generator":"mock-data-generator","smart-mock-data-generator":"mock-data-generator","rest-payload-generator":"mock-data-generator","graphql-payload-generator":"mock-data-generator","curl-converter":"http-request-builder","jwt-auditor":"jwt-tool","pdf-merger-splitter":"pdf-toolkit","pdf-watermark":"pdf-toolkit","pdf-page-numbering":"pdf-toolkit","exif-metadata-scrubber":"metadata-tool","file-encryptor":"symmetric-encrypt-decrypt","image-compressor":"image-tool","favicon-pwa-icon-suite":"image-tool","wcag-contrast-checker":"color-tool","markdown-to-html-converter":"markdown-previewer","markdown-to-pdf-converter":"markdown-previewer","diff-checker":"diff-viewer","svg-code-optimizer":"svg-optimizer","cidr-subnet-calculator":"cidr-calculator","regex-security-tester":"redos-checker","local-steganography":"steganography-tool","forensic-log-analyzer":"log-analyzer","code-converters":"json-to-types","webhook-payload-inspector":"http-message-parser"}
cats=[];tools=[];cur=None
for line in open("scripts/catalog_data.txt",encoding="utf-8"):
    line=line.strip()
    if line.startswith("## "):cur=line[3:];cats.append(cur);continue
    p=line.split("|");i=p[0];st,does=(p[1],p[2]) if len(p)==3 else ("planned",p[1])
    tools.append(dict(id=i,name=name(i),category=cur,status=st,does=does))
err=[];ids=[t["id"] for t in tools]
for k,v in collections.Counter(ids).items():
    if v>1:err.append("duplicate id "+k)
for k,v in collections.Counter(t["does"].lower() for t in tools).items():
    if v>1:err.append("duplicate job text: "+k)
for a,b in ABSORBED.items():
    if a in ids:err.append(f"{a} must not exist; it is a mode of {b}")
    if b not in ids:err.append(f"absorbed target {b} missing")
reg=[t["id"] for t in json.load(open("data/tools.json"))["tools"]]
for r in reg:
    if r not in ids:err.append("live tool missing from catalog: "+r)
if len(tools)!=215:err.append(f"catalog has {len(tools)} tools, expected 215")
if sum(t["status"]=="live" for t in tools)!=len(reg):err.append("live count differs from registry")
if err:print("\n".join("ERROR "+e for e in err));sys.exit(1)
cc=collections.Counter(t["category"] for t in tools);cl=collections.Counter(t["category"] for t in tools if t["status"]=="live")
C=json.load(open("data/categories.json"))
for c in C["categories"]:c["plannedCount"]=cc[c["id"]]
json.dump(C,open("data/categories.json","w"),indent=1,ensure_ascii=False)
json.dump({"total":len(tools),"tools":tools,"absorbed":ABSORBED},open("data/tools-catalog.json","w"),indent=1,ensure_ascii=False)
md=["# SecureKit tool catalog (215 tools)","",f"{len(tools)} unique tools, all free, no login, all running in the browser. {sum(cl.values())} are live; {len(tools)-sum(cl.values())} are planned.","","## Rules","",
"1. One job, one tool. If an existing tool can do a job, it gets a mode or option, never a second tool.","2. A different input language or file format with genuinely different logic is a different job (for example JSON formatter and XML formatter).","3. Only features that work locally. Nothing needing a platform API, a login, a database or a server.","4. Social media tools work on text, images and links; no posting or analytics.","5. This list is checked by `scripts/build_catalog.py`: unique ids, unique job text, count 215, no absorbed name used as a tool.","","## Totals","","| Category | Total | Live | Planned |","|---|---|---|---|"]
for c in cats:md.append(f"| {c} | {cc[c]} | {cl[c]} | {cc[c]-cl[c]} |")
md+=[f"| **All** | **{len(tools)}** | **{sum(cl.values())}** | **{len(tools)-sum(cl.values())}** |",""]
n=0
for c in cats:
    md+=[f"## {c.replace('-',' ').title()} ({cc[c]})","","| # | Tool | What it does | Status |","|---|---|---|---|"]
    for t in [x for x in tools if x["category"]==c]:
        n+=1;md.append(f"| {n} | {t['name']} (`{t['id']}`) | {t['does']} | {t['status']} |")
    md.append("")
md+=["## Merged into modes (never built as separate tools)","","| Not a tool | Lives inside |","|---|---|"]+[f"| {a} | {b} |" for a,b in sorted(ABSORBED.items())]
open("docs/TOOL-CATALOG.md","w",encoding="utf-8").write("\n".join(md)+"\n")
print("catalog OK:",len(tools),"tools;",dict(cc))
