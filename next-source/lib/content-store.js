import { promises as fs } from 'node:fs';
import path from 'node:path';
import {defaultContent} from '../app/content-defaults';
import {validateShape} from '../app/content-schema';
export const dataDir=path.join(process.cwd(),'data');
export async function readContent(){try{return JSON.parse(await fs.readFile(path.join(dataDir,'content.json'),'utf8'))}catch(e){if(e.code==='ENOENT')return defaultContent;throw e}}
export function localRequest(request){
 try{const local=['localhost','127.0.0.1','[::1]'];const url=new URL(request.url);const host=new URL('http://'+(request.headers.get('host')||url.host));const origin=request.headers.get('origin');return local.includes(url.hostname)&&local.includes(host.hostname)&&(!origin||new URL(origin).host===host.host)&&request.headers.get('sec-fetch-site')!=='cross-site'}catch{return false}
}
export function validateContent(data){
 if(!data||typeof data!=='object'||Array.isArray(data))return false;
 return validateShape(data,defaultContent)&&data.documents.every(d=>['PDF','XLSX'].includes(d.format)&&['시스템 기획','콘텐츠 기획','밸런스 기획'].includes(d.type));
}


