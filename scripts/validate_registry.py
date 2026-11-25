#!/usr/bin/env python3
"""Validate data/tools.json against data/categories.json and data/tools.schema.json rules. Run: python3 scripts/validate_registry.py"""
import json,os,re,sys
root=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
L=lambda p:json.load(open(os.path.join(root,p),encoding="utf-8"))
cats={c["id"]:c for c in L("data/categories.json")["categories"]};tools=L("data/tools.json")["tools"];sc=L("data/tools.schema.json")
ids=[t["id"] for t in tools];err=[]
def chk(t,s,path):
    for k in s.get("required",[]):
        if k not in t:err.append(f"{path}: missing '{k}'")
    for k,v in t.items():
        p=s.get("properties",{}).get(k)
        if p is None:
            if s.get("additionalProperties") is False:err.append(f"{path}: unknown field '{k}'")
            continue
        ty=p.get("type")
        if ty=="string" and not isinstance(v,str):err.append(f"{path}.{k}: not a string")
        if ty=="string" and isinstance(v,str):
            if "pattern" in p and not re.search(p["pattern"],v):err.append(f"{path}.{k}: bad format '{v}'")
            if len(v)<p.get("minLength",0) or len(v)>p.get("maxLength",10**9):err.append(f"{path}.{k}: length {len(v)} out of range")
        if ty=="array" and (not isinstance(v,list) or len(v)<p.get("minItems",0) or len(v)>p.get("maxItems",10**9)):err.append(f"{path}.{k}: bad array")
        if "enum" in p and v not in p["enum"]:err.append(f"{path}.{k}: '{v}' not in {p['enum']}")
        if ty=="object" and isinstance(v,dict):chk(v,p,path+"."+k)
for t in tools:
    n="tool "+t.get("id","?");chk(t,sc,n)
    if ids.count(t["id"])>1:err.append(n+": duplicate id")
    if t["category"] not in cats:err.append(n+": unknown category")
    for r in t.get("related",[]):
        if r not in ids:err.append(n+": related '"+r+"' not in registry")
        if r==t["id"]:err.append(n+": relates to itself")
    if t["status"]=="live" and not os.path.exists(os.path.join(root,t["seo"]["path"])):err.append(n+": page missing "+t["seo"]["path"])
    for h in t["runtime"]["network"]:
        if not re.match(r"^[a-z0-9.-]+\.[a-z]{2,}$",h):err.append(n+": bad network host "+h)
    if t["privacy"]["analytics"]:err.append(n+": analytics must be false")
live=[t for t in tools if t["status"]=="live"]
print("registry: %d tools (%d live)"%(len(tools),len(live)))
for c in cats.values():print("  %-20s live %2d / planned %2d"%(c["id"],sum(t["category"]==c["id"] for t in live),c["plannedCount"]))
print("planned total:",sum(c["plannedCount"] for c in cats.values()))
print("network hosts (for CSP):",sorted({h for t in tools for h in t["runtime"]["network"]}))
if err:print("\nERRORS:");print("\n".join(err));sys.exit(1)
print("\nOK: registry valid")
