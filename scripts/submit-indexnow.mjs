import fs from "node:fs"; import path from "node:path"; import { fileURLToPath } from "node:url";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),".."); const data=JSON.parse(fs.readFileSync(path.join(root,"src/content/site-content.json"),"utf8"));
const site=(process.env.NEXT_PUBLIC_SITE_URL||data.site.url).replace(/\/+$/,""); const key="cd6b5f316aa84975136f630f3eb1cd02"; const keyLocation=site+"/"+key+".txt";
const urls=data.pages.filter((p)=>p.indexable).map((p)=>site+(p.path==="/"?"":p.path));
const keyResponse=await fetch(keyLocation,{redirect:"follow"}); if(!keyResponse.ok||(await keyResponse.text()).trim()!==key)throw new Error("IndexNow key is not live at "+keyLocation);
const checks=await Promise.all(urls.map(async(url)=>[url,(await fetch(url,{method:"HEAD",redirect:"follow"})).status])); const bad=checks.filter(([,status])=>status!==200); if(bad.length)throw new Error("Refusing submission; non-200 URLs: "+JSON.stringify(bad));
const response=await fetch("https://api.indexnow.org/indexnow",{method:"POST",headers:{"content-type":"application/json; charset=utf-8"},body:JSON.stringify({host:new URL(site).host,key,keyLocation,urlList:urls})});
if(!response.ok)throw new Error("IndexNow "+response.status+" "+await response.text()); console.log("IndexNow accepted "+urls.length+" URLs for "+site);