'use client';
import {useState} from 'react';
import {listVersions} from './version-storage';
export default function SavedPreviewLink({className='',children='저장본 미리보기 ↗'}){
 const [busy,setBusy]=useState(false),[error,setError]=useState('');
 async function open(event){event.preventDefault();if(busy)return;setBusy(true);try{const versions=await listVersions();const latest=versions.find(version=>['manual-save','edit-complete','restore'].includes(version.reason));if(!latest)throw Error('아직 저장 완료된 버전이 없습니다. 초안 저장 또는 편집 완료를 누른 뒤 다시 열어 주세요.');const url=new URL(location.href);url.search='';url.searchParams.set('view','saved');url.searchParams.set('version',latest.id);const tab=window.open(url.href,'_blank');if(!tab)location.assign(url.href);setError('')}catch(error){setError(error.message||'저장본을 열지 못했습니다. 기존 내용은 유지됩니다.')}finally{setBusy(false)}}
 return <><a className={className} href="?view=saved" target="_blank" rel="noopener noreferrer" aria-disabled={busy} onClick={open}>{busy?'저장본 확인 중…':children}</a>{error&&<div className="toast" role="status" onClick={()=>setError('')}>{error}</div>}</>;
}
