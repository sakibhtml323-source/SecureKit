#!/usr/bin/env python3
"""Zip the whole project: python3 scripts/package.py  -> ../SecureKit-v<version>.zip"""
import json,os,zipfile
R=os.path.dirname(os.path.dirname(os.path.abspath(__file__)));v=json.load(open(os.path.join(R,"site.config.json")))["version"]
out=os.path.join(os.path.dirname(R),f"SecureKit-v{v}.zip")
with zipfile.ZipFile(out,"w",zipfile.ZIP_DEFLATED) as z:
    for d,ds,fs in sorted(os.walk(R)):
        ds[:]=[x for x in ds if x not in("__pycache__",".git")]
        for f in sorted(fs):
            p=os.path.join(d,f);z.write(p,os.path.join("SecureKit",os.path.relpath(p,R)))
print("wrote",out,os.path.getsize(out)//1024,"KB")
