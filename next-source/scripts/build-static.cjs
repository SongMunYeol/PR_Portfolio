const fs=require('fs/promises');
const path=require('path');
const {spawnSync}=require('child_process');
const crypto=require('crypto');
const root=path.resolve(__dirname,'..');
const stage=path.join(root,process.env.STATIC_BUILD_DIR||'.static-build');
const base='/PR_Portfolio';
async function main(){
 await fs.mkdir(path.join(stage,'app'),{recursive:true});
 for(const name of await fs.readdir(path.join(root,'app'))){const src=path.join(root,'app',name);if((await fs.stat(src)).isFile()&&name!=='page.js')await fs.copyFile(src,path.join(stage,'app',name));}
 await fs.mkdir(path.join(stage,'public','assets','media'),{recursive:true});
 let sharp;try{sharp=require('C:/Users/ggurljam/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp')}catch{}
 let contentFile=process.argv[2]?path.resolve(process.argv[2]):path.join(root,'data','content.json');
 if(!process.argv[2]){try{await fs.access(contentFile)}catch{contentFile=path.join(root,'content.json')}}
 const content=JSON.parse(await fs.readFile(contentFile,'utf8'));
 const copied=new Map();
 async function walk(value){
  if(Array.isArray(value))return Promise.all(value.map(walk));
  if(value&&typeof value==='object')return Object.fromEntries(await Promise.all(Object.entries(value).map(async([k,v])=>[k,await walk(v)])));
  if(typeof value!=='string')return value;
  if(value.startsWith(base+'/assets/media/')){const name=path.basename(value);const candidates=[path.join(root,'public','assets','media',name),path.join(root,'..','site','assets','media',name)];let found=false;for(const candidate of candidates){try{await fs.copyFile(candidate,path.join(stage,'public','assets','media',name));found=true;break}catch{}}if(!found)throw Error('Published attachment missing: '+name);return value;}
  if(!value.startsWith('/api/media/')&&!value.startsWith('data:'))return value;
  if(copied.has(value))return copied.get(value);
  let bytes,extension;
  if(value.startsWith('/api/media/')){const name=path.basename(value);if(!/^[0-9a-f-]+\.(png|jpg|jpeg|webp|gif|pdf|xlsx)$/.test(name))throw Error('Invalid file '+name);bytes=await fs.readFile(path.join(root,'data','uploads',name));extension=path.extname(name)}
  else {const match=value.match(/^data:(image\/(?:png|jpeg|webp|gif)|application\/pdf|application\/vnd\.openxmlformats-officedocument\.spreadsheetml\.sheet);base64,(.+)$/s);if(!match)throw Error('Unsupported embedded file');bytes=Buffer.from(match[2],'base64');extension=({'image/png':'.png','image/jpeg':'.jpg','image/webp':'.webp','image/gif':'.gif','application/pdf':'.pdf','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':'.xlsx'})[match[1]]}
  if(sharp&&['.jpg','.jpeg','.png','.webp'].includes(extension)){bytes=await sharp(bytes).rotate().resize({width:1600,height:1600,fit:'inside',withoutEnlargement:true}).webp({quality:88}).toBuffer();extension='.webp'}
  const name=crypto.createHash('sha256').update(bytes).digest('hex').slice(0,24)+extension;await fs.writeFile(path.join(stage,'public','assets','media',name),bytes);const url=base+'/assets/media/'+name;copied.set(value,url);return url;
 }
 const published=await walk(content);
 await fs.writeFile(path.join(stage,'app','published-content.json'),JSON.stringify(published));
 await fs.writeFile(path.join(stage,'public','content.json'),JSON.stringify(published,null,2));
 await fs.writeFile(path.join(stage,'app','page.js'),"import Portfolio from './portfolio';\nimport content from './published-content.json';\nexport default function Page(){return <Portfolio initialContent={content}/>}");
 await fs.writeFile(path.join(stage,'package.json'),JSON.stringify({name:'portfolio-static',private:true}));
 await fs.writeFile(path.join(stage,'next.config.mjs'),`export default {output:'export',basePath:'${base}',trailingSlash:true,images:{unoptimized:true},env:{NEXT_PUBLIC_STATIC_EXPORT:'true'}};`);
 await fs.writeFile(path.join(stage,'public','.nojekyll'),'');
 const result=spawnSync(process.execPath,[path.join(root,'node_modules','next','dist','bin','next'),'build'],{cwd:stage,stdio:'inherit'});if(result.status!==0)process.exit(result.status||1);
 console.log('Static export ready: '+path.join(stage,'out'));
}
main().catch(e=>{console.error(e);process.exit(1)});
