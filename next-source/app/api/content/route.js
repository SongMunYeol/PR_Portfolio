import { promises as fs } from 'node:fs';
import path from 'node:path';
import {readContent,dataDir,localRequest,validateContent} from '../../../lib/content-store';
export const dynamic='force-dynamic';
export async function GET(){return Response.json(await readContent(),{headers:{'Cache-Control':'no-store'}})}
export async function PUT(request){
 if(!localRequest(request))return Response.json({error:'편집은 로컬 주소에서만 가능합니다.'},{status:403});
 try{const text=await request.text();if(text.length>3_000_000)return Response.json({error:'내용이 너무 큽니다.'},{status:413});const content=JSON.parse(text);if(!validateContent(content))return Response.json({error:'콘텐츠 형식을 확인해 주세요.'},{status:400});await fs.mkdir(dataDir,{recursive:true});const temp=path.join(dataDir,`content-${crypto.randomUUID()}.tmp`);await fs.writeFile(temp,JSON.stringify(content,null,2),'utf8');await fs.rename(temp,path.join(dataDir,'content.json'));return Response.json({ok:true})}catch{return Response.json({error:'저장에 실패했습니다. 입력 내용과 저장 공간을 확인해 주세요.'},{status:500})}
}
