import {promises as fs} from 'node:fs';
import path from 'node:path';
import {dataDir} from '../../../../lib/content-store';
export async function GET(request,{params}){const {name}=await params;if(!/^[0-9a-f-]{36}\.(png|jpg|jpeg|webp|gif|pdf|xlsx)$/.test(name))return new Response('Not found',{status:404});try{const bytes=await fs.readFile(path.join(dataDir,'uploads',name));const type={png:'image/png',jpg:'image/jpeg',jpeg:'image/jpeg',webp:'image/webp',gif:'image/gif',pdf:'application/pdf',xlsx:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}[name.split('.').pop()];return new Response(bytes,{headers:{'Content-Type':type,'X-Content-Type-Options':'nosniff','Cache-Control':'public, max-age=31536000, immutable'}})}catch{return new Response('Not found',{status:404})}}
