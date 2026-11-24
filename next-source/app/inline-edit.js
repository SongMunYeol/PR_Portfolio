'use client';
import {createContext,useContext,useRef,useState,useLayoutEffect} from 'react';
import {staticMode,staticUpload} from './static-storage';
export const InlineContext=createContext({editing:false});
export async function uploadInlineImage(file){
 if(staticMode)return staticUpload(file);
 const data=new FormData();
 data.append('file',file);
 const response=await fetch('/api/upload',{method:'POST',body:data});
 const result=await response.json();
 if(!response.ok)throw Error(result.error);
 return result.url;
}
export function EditableText({path,children,multiline=false,label=path.join('.'),placeholder='Enter로 줄바꿈'}){
 const ctx=useContext(InlineContext),ref=useRef();
 useLayoutEffect(()=>{if(ctx.editing&&ref.current){if(multiline){ref.current.style.height='auto';ref.current.style.height=ref.current.scrollHeight+'px'}else if(document.activeElement!==ref.current)ref.current.textContent=String(children??'')}},[children,ctx.editing,multiline]);
 if(!ctx.editing)return <>{children}</>;
 if(multiline)return <textarea ref={ref} className="inline-multiline" rows={2} aria-label={label} title="Enter로 줄바꿈" placeholder={placeholder} value={children??''} onChange={event=>ctx.update(path,event.target.value)} onClick={event=>event.stopPropagation()}/>;
 if(path[0]==='documents'&&path.at(-1)==='type')return <select className="inline-select" aria-label={path.join('.')} value={children} onChange={e=>ctx.update(path,e.target.value)}>{['시스템 기획','콘텐츠 기획','밸런스 기획'].map(value=><option key={value}>{value}</option>)}</select>;
 return <span ref={ref} className="inline-text" contentEditable suppressContentEditableWarning role="textbox" aria-label={path.join('.')} data-edit-path={path.join('.')} onClick={e=>e.stopPropagation()} onInput={e=>ctx.update(path,e.currentTarget.innerText)} onBlur={e=>{if(e.currentTarget.innerText!==String(children??''))ctx.update(path,e.currentTarget.innerText)}} onPaste={e=>{e.preventDefault();document.execCommand('insertText',false,e.clipboardData.getData('text/plain'))}}></span>;
}
export function EditableImage({path,children}){
 const ctx=useContext(InlineContext),[busy,setBusy]=useState(false);
 if(!ctx.editing||!path)return children;
 return <span className="inline-image">{children}<label className="inline-image-upload">{busy?'등록 중…':'이미지 변경'}<input aria-label={path.join('.')+' 이미지 변경'} type="file" accept="image/png,image/jpeg,image/webp,image/gif" disabled={busy} onChange={async e=>{const file=e.target.files[0];if(!file)return;setBusy(true);ctx.onPending?.(1);try{ctx.update(path,await uploadInlineImage(file))}catch(error){ctx.notify(error.message)}finally{setBusy(false);ctx.onPending?.(-1);e.target.value=''}}}/></label></span>;
}
