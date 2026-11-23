'use client';

import {useContext, useRef, useState} from 'react';
import {defaultAiGame} from './ai-game-content';
import {EditableText, InlineContext} from './inline-edit';
import {safeUrl} from './editor';
import {staticMode} from './static-storage';

function imageUrl(value) {
  const url = safeUrl(value);
  return staticMode && url.startsWith('/ai-game/') ? '/PR_Portfolio' + url : url;
}

function httpsUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password ? url : null;
  } catch {
    return null;
  }
}

function videoSource(value) {
  const url = httpsUrl(value);
  if (!url) return null;
  const host = url.hostname.replace(/^www\./, '');
  const segments = url.pathname.split('/').filter(Boolean);
  if (['youtube.com','youtube-nocookie.com','m.youtube.com','youtu.be'].includes(host)) {
    const id = host === 'youtu.be' ? segments[0] : url.searchParams.get('v') || segments[1];
    return /^[\w-]{11}$/.test(id ?? '') ? {embed: 'https://www.youtube-nocookie.com/embed/' + id} : null;
  }
  return {src: url.href};
}

function Field({path, value, multiline = false}) {
  return <EditableText path={['aiGame', ...path]} multiline={multiline}>{value}</EditableText>;
}

function ToolList({tools}) {
  return <ul className="bunker-tools" aria-label="사용한 도구">
    {tools.map(({name, logo, purpose}, index) => <li key={index} title={purpose}>
      {imageUrl(logo) && <img src={imageUrl(logo)} alt="" className={'bunker-tool-icon' + (name === 'Claude' ? ' bunker-tool-claude' : '')}/>}
      <span>{name}</span>
    </li>)}
  </ul>;
}

function MediaGallery({game, Image}) {
  const video = videoSource(game.videoUrl);
  const screenshots = game.screenshots.flatMap((entry, position) => imageUrl(entry.image) ?
    [{...entry, position, image: imageUrl(entry.image)}] : []);
  const items = video ? [{video, label: '게임 플레이 영상'}, ...screenshots] : screenshots;
  const [index, setIndex] = useState(0);
  const rail = useRef(null);
  const active = items.length ? index % items.length : 0;
  const item = items[active];

  function select(next) {
    if (!items.length) return;
    const selected = (next + items.length) % items.length;
    setIndex(selected);
    const target = rail.current?.children[selected];
    if (target && rail.current.scrollWidth > rail.current.clientWidth) {
      rail.current.scrollLeft = target.offsetLeft;
    }
  }

  if (!item) return null;
  return <section className="bunker-gallery" aria-label="플레이 영상과 게임 캡처">
    <figure className="bunker-stage">
      {item.video?.embed ? (
        <iframe src={item.video.embed} title={item.label} allow="encrypted-media; picture-in-picture; fullscreen" allowFullScreen/>
      ) : item.video ? (
        <video controls playsInline preload="metadata" aria-label={item.label} poster={imageUrl(game.image)} src={item.video.src}/>
      ) : (
        <Image path={['aiGame','screenshots',item.position,'image']} src={item.image} alt={item.label}/>
      )}
    </figure>
    {items.length > 1 && <div className="bunker-carousel" role="group" aria-label="게임 캡처 캐러셀"
      onKeyDown={event => {
        if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
        event.preventDefault();
        select(active + (event.key === 'ArrowRight' ? 1 : -1));
      }}>
      <button className="bunker-arrow" type="button" aria-label="이전 미디어" onClick={() => select(active - 1)}>‹</button>
      <div className="bunker-thumbnails" ref={rail}>
        {items.map((entry, position) => <button key={position} type="button" aria-pressed={active === position}
          aria-label={entry.label || '캡처 ' + (position + 1)} onClick={() => select(position)}>
          <img src={entry.image || imageUrl(game.image) || undefined} alt=""/>
          {entry.video && <span aria-hidden="true">▶</span>}
        </button>)}
      </div>
      <button className="bunker-arrow" type="button" aria-label="다음 미디어" onClick={() => select(active + 1)}>›</button>
    </div>}
  </section>;
}

function DownloadGame({game}) {
  const url = httpsUrl(game.downloadUrl);
  const label = game.downloadLabel || defaultAiGame.downloadLabel;
  const body = <><span>{label}</span><span className="bunker-download-icon" aria-hidden="true">↓</span></>;
  return url ? <a className="bunker-download" href={url.href} target="_blank" rel="noopener noreferrer" download>{body}</a>
    : <button type="button" className="bunker-download" disabled>{body}</button>;
}

function Overview({game, Image}) {
  const {editing} = useContext(InlineContext);
  return <div className="bunker-overview">
    <div className="bunker-media-column">
      <MediaGallery game={game} Image={Image}/>
      <div className="bunker-tool-strip">
        <section>
          <h3><Field path={['toolsTitle']} value={game.toolsTitle}/></h3>
          <ToolList tools={game.tools}/>
        </section>
        <DownloadGame game={game}/>
      </div>
    </div>
    <section className="bunker-summary" aria-label="게임 설명">
      <header className="bunker-title">
        {(imageUrl(game.image) || editing) && <Image path={['aiGame','image']} src={imageUrl(game.image)} alt=""/>}
        <div><h2><Field path={['title']} value={game.title}/></h2>
          <p><Field path={['tagline']} value={game.tagline}/></p></div>
      </header>
      <p className="bunker-meta"><Field path={['meta']} value={game.meta}/></p>
      <h3><Field path={['rulesTitle']} value={game.rulesTitle}/></h3>
      <p><Field path={['description']} value={game.description} multiline/></p>
      <dl className="bunker-facts">
        {game.facts.map(({label,description}, index) => <div key={index}>
          <dt><Field path={['facts',index,'label']} value={label}/></dt>
          <dd><Field path={['facts',index,'description']} value={description}/></dd>
        </div>)}
      </dl>
      <details className="bunker-controls">
        <summary>{game.controlsTitle}</summary>
        <p><Field path={['controls']} value={game.controls} multiline/></p>
      </details>
    </section>
  </div>;
}

function Development({game, Image}) {
  const {editing, update} = useContext(InlineContext);
  return <div className="bunker-development">
    <header><h2><Field path={['developmentTitle']} value={game.developmentTitle}/></h2>
      {(game.developmentIntro || editing) && <p><Field path={['developmentIntro']} value={game.developmentIntro} multiline/></p>}
    </header>
    {game.stages.map(({phase, title, decision, work, evidence}, index) => {
      const path = ['stages',index];
      return <section key={index} className="bunker-step">
        <div className="bunker-phase"><Field path={[...path,'phase']} value={phase}/></div>
        <div>
          <h3><Field path={[...path,'title']} value={title}/></h3>
          <dl><dt>기획과 판단</dt><dd><Field path={[...path,'decision']} value={decision} multiline/></dd>
            <dt>AI 협업과 결과</dt><dd><Field path={[...path,'work']} value={work} multiline/></dd></dl>
          {(evidence.length > 0) && <div className="bunker-evidence">
            {evidence.map(({image,label}, position) => (imageUrl(image) || editing) && <figure key={position}>
              <Image path={['aiGame',...path,'evidence',position,'image']} src={imageUrl(image)} alt={label}/>
              {(label || editing) && <figcaption><Field path={[...path,'evidence',position,'label']} value={label}/></figcaption>}
              {editing && <button type="button" className="inline-add-item" onClick={() =>
                update(['aiGame',...path,'evidence'],evidence.filter((_,i)=>i!==position))}>이미지 삭제</button>}
            </figure>)}
          </div>}
          {editing && <button type="button" className="inline-add-item" disabled={evidence.length>=100} onClick={() =>
            update(['aiGame',...path,'evidence'],[...evidence,{image:'',label:''}])}>{phase} 이미지 추가</button>}
        </div>
      </section>;
    })}
    {game.buildTitle && <details className="bunker-controls">
      <summary>{game.buildTitle}</summary>
      <p><Field path={['buildDescription']} value={game.buildDescription} multiline/></p>
    </details>}
  </div>;
}

export default function AiGameScreen({content, Image}) {
  const [tab, setTab] = useState(0);
  const panel = useRef(null);
  const game = content ?? defaultAiGame;

  function activate(index) {
    if (index === tab) return;
    setTab(index);
    if (panel.current) panel.current.scrollTop = 0;
  }

  return <article className="screen ai-game-screen bunker-screen">
    <div className="bunker-tabs" role="tablist" aria-label={game.title + ' 상세'}>
      {[game.introTab,game.developmentTab].map((label,index) => <button key={index} type="button" id={'bunker-tab-' + index}
        role="tab" aria-selected={index === tab} aria-controls="bunker-tab-content" tabIndex={index === tab ? 0 : -1}
        onPointerEnter={event => {if (event.pointerType === 'mouse') activate(index)}}
        onClick={() => activate(index)} onKeyDown={event => {
          const next = event.key === 'Home' ? 0 : event.key === 'End' ? 1 :
            ['ArrowLeft', 'ArrowRight'].includes(event.key) ? 1 - index : null;
          if (next === null) return;
          event.preventDefault();
          activate(next);
          event.currentTarget.parentElement.children[next]?.focus();
        }}>{label}</button>)}
    </div>
    <div className="bunker-tab-content" ref={panel} role="tabpanel" id="bunker-tab-content" aria-labelledby={'bunker-tab-' + tab} tabIndex={0}>
      {tab === 0 ? <Overview game={game} Image={Image}/> : <Development game={game} Image={Image}/>}
    </div>
  </article>;
}
