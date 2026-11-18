const mediaHashes=new Map();
export async function contentSignature(content){
 const cache=mediaHashes;async function walk(value){if(Array.isArray(value))return Promise.all(value.map(walk));if(value&&typeof value==='object'){const result={};for(const key of Object.keys(value).sort())result[key]=await walk(value[key]);return result}if(typeof value!=='string')return value;
 const stored=value.match(/^\/PR_Portfolio\/assets\/media\/([a-f0-9]{24})\.[a-z0-9]+$/);if(stored)return 'media:'+stored[1];if(!value.startsWith('data:'))return value;if(!cache.has(value)){if(cache.size>256)cache.clear();cache.set(value,(async()=>{const comma=value.indexOf(','),header=value.slice(0,comma),body=value.slice(comma+1),raw=header.includes(';base64')?atob(body):decodeURIComponent(body),bytes=Uint8Array.from(raw,c=>c.charCodeAt(0));const hash=await crypto.subtle.digest('SHA-256',bytes);return 'media:'+Array.from(new Uint8Array(hash),x=>x.toString(16).padStart(2,'0')).join('').slice(0,24)})());}return cache.get(value)}
 return JSON.stringify(await walk(content));
}
