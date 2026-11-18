import {openDraftDatabase,queueDraftWrite} from './static-storage';

const INDEX='portfolio-version-index';
const versionKey=id=>'portfolio-version:'+id;
const assetKey=id=>'portfolio-version-asset:'+id;
const aliasKey=url=>'portfolio-version-url:'+url;
const mediaFields=new Set(['image','heroImage','portrait','logo','file']);
const hash=async bytes=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),b=>b.toString(16).padStart(2,'0')).join('');
const mimeFor=url=>({png:'image/png',jpg:'image/jpeg',jpeg:'image/jpeg',webp:'image/webp',gif:'image/gif',pdf:'application/pdf',xlsx:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}[url.split(/[?#]/)[0].split('.').pop().toLowerCase()]);
const dataUrl=blob=>new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=()=>reject(Error('버전의 첨부 파일을 읽지 못했습니다.'));reader.readAsDataURL(blob)});
async function get(key){const db=await openDraftDatabase();try{return await new Promise((resolve,reject)=>{const request=db.transaction('drafts').objectStore('drafts').get(key);request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error)})}finally{db.close()}}
export async function listVersions(){return [...(await get(INDEX)||[])].sort((a,b)=>b.createdAt-a.createdAt||b.id.localeCompare(a.id))}
function summary(content){return {name:content.profile.name,headline:content.profile.headline,documents:content.documents.length,licenses:content.licenses.length,games:content.genres.reduce((n,g)=>n+g.games.length,0),activities:(content.activities||[]).length}}

async function pack(content){
 const assets=new Map(),aliases=new Map(),pending=new Map(),unavailable=[];
 async function media(value){
  if(pending.has(value))return pending.get(value);
  const task=(async()=>{
   const remote=!value.startsWith('data:');
   if(remote){const cached=await get(aliasKey(value));if(cached&&await get(assetKey(cached)))return {__portfolioAsset:cached,original:value}}
   try{
    let blob;if(value.startsWith('data:')){const match=value.match(/^data:([^;,]+);base64,([\s\S]+)$/);if(!match)throw Error('지원하지 않는 첨부 형식입니다.');const bytes=Uint8Array.from(atob(match[2]),c=>c.charCodeAt(0));blob=new Blob([bytes],{type:match[1]})}
    else{const response=await fetch(value,{cache:'force-cache',signal:AbortSignal.timeout(20000)});if(!response.ok)throw Error('첨부 파일을 가져오지 못했습니다.');const source=await response.blob();blob=new Blob([source],{type:mimeFor(value)||source.type||'application/octet-stream'})}
    const id=await hash(await blob.arrayBuffer());assets.set(id,blob);if(remote)aliases.set(value,id);return {__portfolioAsset:id,...(remote?{original:value}:{})};
   }catch(error){if(value.startsWith('https://')||value.startsWith('http://')){unavailable.push(value);return value}throw Error('첨부 파일을 보관하지 못해 버전 저장을 중단했습니다. 현재 내용은 유지됩니다. '+error.message)}
  })();pending.set(value,task);return task;
 }
 async function walk(value,field=''){if(Array.isArray(value))return Promise.all(value.map(item=>walk(item,field)));if(value&&typeof value==='object')return Object.fromEntries(await Promise.all(Object.entries(value).map(async([key,item])=>[key,await walk(item,key)])));if(typeof value==='string'&&mediaFields.has(field)&&/^(data:|https?:\/\/|\/api\/media\/|\/PR_Portfolio\/assets\/media\/|\/documents\/)/.test(value))return media(value);return value}
 return {content:await walk(content),assets,aliases,unavailable};
}

export async function saveVersion(content,{reason='manual-save',persistDraft=true,onlyIfEmpty=false,restoredFrom=null}={}){
 const packed=await pack(content),db=await openDraftDatabase();
 const metadata={id:crypto.randomUUID(),createdAt:Date.now(),reason,summary:summary(content),unavailable:packed.unavailable.length,...(restoredFrom?{restoredFrom}:{})};
 try{return await new Promise((resolve,reject)=>{const tx=db.transaction('drafts','readwrite'),store=tx.objectStore('drafts'),request=store.get(INDEX);let result=metadata,failure;
  request.onsuccess=()=>{try{const index=request.result||[];if(onlyIfEmpty&&index.length){result=index[0];return}for(const [id,blob]of packed.assets){const existing=store.get(assetKey(id));existing.onsuccess=()=>{if(!existing.result)store.put(blob,assetKey(id))}}for(const [url,id]of packed.aliases)store.put(id,aliasKey(url));store.add({format:1,metadata,content:packed.content},versionKey(metadata.id));store.put([metadata,...index],INDEX);if(persistDraft)queueDraftWrite(store,content)}catch(error){failure=error;tx.abort()}};
  tx.oncomplete=()=>resolve(result);tx.onerror=event=>reject(failure||tx.error||event.target?.error||Error('버전 저장에 실패했습니다. 현재 내용은 유지됩니다.'));tx.onabort=()=>reject(failure||tx.error||Error('버전 저장이 중단됐습니다. 기존 기록과 현재 초안은 유지됩니다.'))
 })}finally{db.close()}
}
export async function ensureInitialVersion(content){if((await listVersions()).length)return;return saveVersion(content,{reason:'baseline',persistDraft:false,onlyIfEmpty:true})}

export async function readVersion(id,{originalUrls=false}={}){
 const record=await get(versionKey(id));if(!record||record.format!==1)throw Error('이 버전을 찾을 수 없습니다.');const resolved=new Map();
 async function walk(value){if(value&&typeof value==='object'&&typeof value.__portfolioAsset==='string'){if(originalUrls&&value.original?.startsWith('/api/media/'))return value.original;if(!resolved.has(value.__portfolioAsset))resolved.set(value.__portfolioAsset,(async()=>{const asset=await get(assetKey(value.__portfolioAsset));if(!(asset instanceof Blob))throw Error('버전의 첨부 파일이 누락되었습니다. 현재 내용은 변경하지 않았습니다.');return dataUrl(asset)})());return resolved.get(value.__portfolioAsset)}if(Array.isArray(value))return Promise.all(value.map(walk));if(value&&typeof value==='object')return Object.fromEntries(await Promise.all(Object.entries(value).map(async([key,item])=>[key,await walk(item)])));return value}
 return {metadata:record.metadata,content:await walk(record.content)};
}

export async function exportHistory(){
 const index=await listVersions(),versions=[],assets={},ids=new Set();
 function collect(value){if(value&&typeof value==='object'&&typeof value.__portfolioAsset==='string')ids.add(value.__portfolioAsset);else if(Array.isArray(value))value.forEach(collect);else if(value&&typeof value==='object')Object.values(value).forEach(collect)}
 for(const item of index){const record=await get(versionKey(item.id));if(!record)throw Error('기록 일부를 읽지 못했습니다.');collect(record.content);versions.push(record)}
 for(const id of ids){const blob=await get(assetKey(id));if(!(blob instanceof Blob))throw Error('첨부 파일이 누락되어 기록 백업을 중단했습니다.');assets[id]=await dataUrl(blob)}
 return {format:'munyeol-version-history',version:1,exportedAt:new Date().toISOString(),versions,assets};
}

export async function importHistory(bundle,validate){
 if(bundle?.format!=='munyeol-version-history'||bundle.version!==1||!Array.isArray(bundle.versions)||!bundle.assets||typeof bundle.assets!=='object')throw Error('전체 기록 백업 파일을 선택해 주세요.');
 const assets=new Map();for(const [id,value]of Object.entries(bundle.assets)){if(!/^[a-f0-9]{64}$/.test(id)||typeof value!=='string')throw Error('잘못된 첨부 기록입니다.');const match=value.match(/^data:([^;,]+);base64,([\s\S]+)$/);if(!match)throw Error('첨부 파일 형식이 올바르지 않습니다.');const bytes=Uint8Array.from(atob(match[2]),c=>c.charCodeAt(0));if(await hash(bytes)!==id)throw Error('백업의 첨부 파일이 변경되었습니다. 가져오기를 중단했습니다.');assets.set(id,new Blob([bytes],{type:match[1]}))}
 const ids=new Set();function unpack(value){if(value&&typeof value==='object'&&typeof value.__portfolioAsset==='string'){if(!assets.has(value.__portfolioAsset))throw Error('백업에 첨부 파일이 빠져 있습니다.');return bundle.assets[value.__portfolioAsset]}if(Array.isArray(value))return value.map(unpack);if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([key,item])=>[key,unpack(item)]));return value}
 for(const record of bundle.versions){const meta=record?.metadata;if(record?.format!==1||!meta||typeof meta.id!=='string'||!/^[a-zA-Z0-9-]{1,100}$/.test(meta.id)||!Number.isFinite(meta.createdAt)||typeof meta.reason!=='string'||ids.has(meta.id)||!validate(unpack(record.content)))throw Error('올바르지 않은 버전이 포함되어 있습니다. 현재 기록은 유지됩니다.');ids.add(meta.id)}
 const db=await openDraftDatabase();try{return await new Promise((resolve,reject)=>{const tx=db.transaction('drafts','readwrite'),store=tx.objectStore('drafts'),request=store.get(INDEX);let added=0;request.onsuccess=()=>{const index=request.result||[],known=new Set(index.map(item=>item.id));for(const [id,blob]of assets){const existing=store.get(assetKey(id));existing.onsuccess=()=>{if(!existing.result)store.put(blob,assetKey(id))}}for(const record of bundle.versions){if(known.has(record.metadata.id))continue;store.add(record,versionKey(record.metadata.id));index.push(record.metadata);added++}store.put(index.sort((a,b)=>b.createdAt-a.createdAt),INDEX)};tx.oncomplete=()=>resolve(added);tx.onerror=event=>reject(tx.error||event.target?.error||Error('기록을 가져오지 못했습니다.'));tx.onabort=()=>reject(tx.error||Error('가져오기를 중단했습니다. 기존 기록은 유지됩니다.'))})}finally{db.close()}
}
