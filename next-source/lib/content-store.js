import { promises as fs } from 'node:fs';
import path from 'node:path';
import {defaultContent} from '../app/content-defaults';
export const dataDir=path.join(process.cwd(),'data');
export async function readContent(){try{return JSON.parse(await fs.readFile(path.join(dataDir,'content.json'),'utf8'))}catch(e){if(e.code==='ENOENT')return defaultContent;throw e}}
export function localRequest(request){
 try{const local=['localhost','127.0.0.1','[::1]'];const url=new URL(request.url);const host=new URL('http://'+(request.headers.get('host')||url.host));const origin=request.headers.get('origin');return local.includes(url.hostname)&&local.includes(host.hostname)&&(!origin||new URL(origin).host===host.host)&&request.headers.get('sec-fetch-site')!=='cross-site'}catch{return false}
}
export function validateContent(data){
 if(!data||typeof data!=='object'||Array.isArray(data))return false;
 function check(value,model,depth=0){if(depth>10)return false;if(typeof model==='string')return typeof value==='string'&&value.length<100000;if(Array.isArray(model))return Array.isArray(value)&&value.length<=100&&value.every(v=>check(v,model[0],depth+1));return value&&typeof value==='object'&&!Array.isArray(value)&&Object.keys(model).every(k=>Object.hasOwn(value,k)&&check(value[k],model[k],depth+1))&&Object.keys(value).every(k=>Object.hasOwn(model,k))}
 return check(data,defaultContent)&&data.documents.every(d=>['PDF','XLSX'].includes(d.format)&&['시스템 기획','콘텐츠 기획','밸런스 기획'].includes(d.type));
}
