const fs=require("fs"),path=require("path");
const df=new Map();let pages=0;
function walk(d,cb){for(const e of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,e.name);if(e.isDirectory()){if(!/^(_next|_img|admin|image|images|video|resources)$/.test(e.name))walk(p,cb)}else if(e.name.endsWith(".html"))cb(p)}}
walk(process.argv[2]||"out",(f)=>{const h=fs.readFileSync(f,"utf8");pages++;
  const body=h.replace(/<script[\s\S]*?<\/script>/g," ").replace(/<style[\s\S]*?<\/style>/g," ");
  const txt=body.replace(/<[^>]+>/g,"\n")+" "+[...body.matchAll(/(?:alt|aria-label|title|placeholder)="([^"]*)"/g)].map(m=>m[1]).join(" ");
  const set=new Set(txt);for(const ch of set){if(ch.charCodeAt(0)<0x20)continue;df.set(ch,(df.get(ch)||0)+1)}});
// 검색 색인·클라이언트 문자열에서 쓰이는 글자도 포함
for(const f of ["src/generated/search-index.json"]){try{const t=fs.readFileSync(f,"utf8");for(const ch of new Set(t)){df.set(ch,(df.get(ch)||0)+0.5)}}catch{}}
const rows=[...df].map(([c,n])=>[c,n]).sort((a,b)=>b[1]-a[1]);
const isHangul=(c)=>{const x=c.codePointAt(0);return x>=0xAC00&&x<=0xD7A3};
const hang=rows.filter(r=>isHangul(r[0])),other=rows.filter(r=>!isHangul(r[0]));
console.log("pages",pages,"고유 글자",rows.length,"한글",hang.length,"기타",other.length);
const band=(lo,hi)=>hang.filter(r=>r[1]/pages>=lo&&r[1]/pages<hi).length;
console.log("한글 df 구간: >=30%",band(.3,2),"10~30%",band(.1,.3),"3~10%",band(.03,.1),"1~3%",band(.01,.03),"<1%",band(0,.01));
console.log("기타(비한글) 상위",other.slice(0,60).map(r=>r[0]).join(""));
console.log("기타 중 한자/기호 희귀",other.filter(r=>r[1]/pages<.02).map(r=>r[0]).slice(0,80).join(""));
fs.writeFileSync(process.argv[3],JSON.stringify({pages,rows}));
