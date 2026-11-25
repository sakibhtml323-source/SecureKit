"use strict";
function skCrcTable(poly,bits){const t=[],top=1<<(bits-1),mask=bits===32?0xFFFFFFFF:(1<<bits)-1;for(let i=0;i<256;i++){let c=i<<(bits-8);for(let k=0;k<8;k++)c=(c&top)?((c<<1)^poly):(c<<1);t.push(c&mask)}return t}
function skCrcRefl(poly){const t=[];for(let i=0;i<256;i++){let c=i;for(let k=0;k<8;k++)c=(c&1)?(c>>>1)^poly:(c>>>1);t.push(c>>>0)}return t}
const SK_CRC32T=skCrcRefl(0xEDB88320),SK_CRC16MT=skCrcRefl(0xA001),SK_CRC16CT=skCrcTable(0x1021,16),SK_CRC8T=skCrcTable(0x07,8);
function skCrc32(b){let c=0xFFFFFFFF;for(const x of b)c=SK_CRC32T[(c^x)&255]^(c>>>8);return(c^0xFFFFFFFF)>>>0}
function skCrc16Modbus(b){let c=0xFFFF;for(const x of b)c=SK_CRC16MT[(c^x)&255]^(c>>>8);return c&0xFFFF}
function skCrc16Ccitt(b){let c=0xFFFF;for(const x of b)c=((c<<8)&0xFFFF)^SK_CRC16CT[((c>>>8)^x)&255];return c&0xFFFF}
function skCrc8(b){let c=0;for(const x of b)c=SK_CRC8T[c^x];return c&255}
function skAdler32(b){let a=1,s=0;for(const x of b){a=(a+x)%65521;s=(s+a)%65521}return((s<<16)|a)>>>0}
const SK_CRCS=[["CRC-32 (ISO-HDLC, zip, png)",skCrc32,8],["CRC-16/CCITT-FALSE",skCrc16Ccitt,4],["CRC-16/MODBUS",skCrc16Modbus,4],["CRC-8 (poly 0x07)",skCrc8,2],["Adler-32",skAdler32,8]];
T.crc=r=>{const[l,fmt]=sel("Input is",["Text (UTF-8)","Hex bytes"]),inp=skArea("Input",4,"Text or hex bytes"),o=skOut(r);
r.prepend(l,skBox("Input",inp));
r.append(btn("Calculate",()=>{try{const b=fmt.value.startsWith("Hex")?U.unhex(inp.value):U.enc(inp.value);o.set(SK_CRCS.map(([n,f,w])=>n+": 0x"+f(b).toString(16).toUpperCase().padStart(w,"0")+" ("+f(b)+")").join("\n"),b.length+" bytes. Checksums detect accidental errors only; they are not secure against tampering.")}catch(e){o.err(skMsg(e))}}),btn("Clear",()=>{inp.value="";o.clear()},1))};
