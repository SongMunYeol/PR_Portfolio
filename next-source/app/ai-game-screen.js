'use client';

import {useRef, useState} from 'react';
import {staticMode} from './static-storage';

const assetBase = (staticMode ? '/PR_Portfolio' : '') + '/ai-game/';
const game = {
  title: 'Bunker Protecter',
  tagline: '함정을 배치하고 직접 싸워 벙커의 기밀 데이터 센터를 지키는 3D 액션 디펜스',
  banner: 'bunker-title.png',
  // Set video to { src: 'gameplay.mp4' } or { youtubeId: '…' } once provided.
  video: null,
  screenshots: [
    {file: 'wave-defense.png', label: '철조망과 방벽으로 웨이브 방어'},
    {file: 'defense-preparation.png', label: '웨이브 시작 전 HQ 방어 준비'},
  ],
};

const tools = [
  ['ChatGPT', 'chatgpt.webp', '기획 초안·시각 자료'],
  ['Codex', 'chatgpt.webp', '기획 문서 구조화'],
  ['Claude', 'claude.svg', '게임 구현·오류 수정'],
  ['Notion', 'notion.webp', '버전별 요구사항'],
  ['Unity', 'unity.svg', '3D 게임 엔진'],
];

const stages = [
  {
    phase: '기획',
    title: '함정 배치와 직접 전투를 한 판으로 설계',
    decision: '장비 선택 → 방어 준비 → 웨이브 전투 → 보급과 강화로 이어지는 구조를 정했습니다. 공통 8웨이브에서 4·6·8웨이브로 나누고, 침입 경로도 1·2·3개로 늘렸습니다.',
    work: 'Codex로 초안을 정리하고 GAME_DESIGN.md를 Claude에 전달했습니다. 변경 요구는 Notion에 버전별로 기록했습니다.',
  },
  {
    phase: '구현',
    title: '전투 중에도 방어선을 다시 짤 수 있게',
    decision: '별도 건설 모드를 가젯으로 통합하고, 투척은 키를 누르는 동안 궤적을 확인한 뒤 놓을 때 실행하도록 요청했습니다.',
    work: 'Claude로 Unity/C#의 웨이브·전투·장비 시스템을 구현했습니다. v0.5에서는 가젯 설치 횟수와 회수, 메달 상점, 장비 등급, 파괴 가능한 엄폐물이 추가됐습니다.',
    evidence: game.screenshots,
  },
  {
    phase: '문제 해결',
    title: '재출격 후 남는 캐릭터와 사라지는 가젯',
    decision: '맵을 새로 구성할 때 이전 화면 상태가 남는 두 증상을 개발 기록에서 확인했습니다. 캐릭터 객체가 중복 생성됐고, 같은 ID의 새 가젯은 이미 표시된 장치로 처리됐습니다.',
    work: '캐릭터 재생성 전 이전 객체와 애니메이터를 정리했습니다. 맵을 만들 때 표시 기록을 초기화하고, 기록에 대응하는 화면 객체가 없으면 다시 생성하도록 수정했습니다.',
  },
  {
    phase: '검증',
    title: '자동 검사와 실제 플레이에서 볼 항목을 구분',
    decision: '해금 절차를 반복하지 않고 장비를 확인할 수 있도록, 메달과 전체 1성 장비를 미리 지급한 별도 테스트 버전을 요청했습니다.',
    work: 'Claude의 v0.5 보고에는 규칙 검사 627개 통과, 세 스테이지의 자동 플레이 결과 단계 도달, 코드 컴파일 성공이 기록됐습니다. 당시 Unity 실화면과 음향은 별도 확인 항목으로 남았습니다.',
  },
];

function ToolList() {
  return <ul className="bunker-tools" aria-label="사용한 도구">
    {tools.map(([name, icon, role]) => <li key={name} title={role}>
      <img src={assetBase + icon} alt="" className={'bunker-tool-icon bunker-tool-' + name.toLowerCase()}/>
      <span>{name}</span>
    </li>)}
  </ul>;
}

function MediaGallery() {
  const items = game.video ? [{video: game.video, label: '게임 플레이 영상'}, ...game.screenshots] : game.screenshots;
  const [index, setIndex] = useState(0);
  const rail = useRef(null);
  const item = items[index];

  function select(next) {
    const selected = (next + items.length) % items.length;
    setIndex(selected);
    const target = rail.current?.children[selected];
    if (target && rail.current.scrollWidth > rail.current.clientWidth) {
      rail.current.scrollLeft = target.offsetLeft - rail.current.offsetLeft;
    }
  }

  return <section className="bunker-gallery" aria-label="플레이 영상과 게임 캡처">
    <figure className="bunker-stage">
      {item.video?.youtubeId ? (
        <iframe src={'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(item.video.youtubeId)}
          title={item.label} allow="encrypted-media; picture-in-picture; fullscreen" allowFullScreen/>
      ) : item.video ? (
        <video controls playsInline preload="metadata" aria-label={item.label} poster={assetBase + game.banner}
          src={item.video.src.startsWith('https://') ? item.video.src : assetBase + item.video.src}/>
      ) : (
        <img src={assetBase + item.file} alt={item.label}/>
      )}
    </figure>
    <div className="bunker-carousel" role="group" aria-label="게임 캡처 캐러셀"
      onKeyDown={event => {
        if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
        event.preventDefault();
        select(index + (event.key === 'ArrowRight' ? 1 : -1));
      }}>
      <button className="bunker-arrow" type="button" aria-label="이전 미디어" onClick={() => select(index - 1)}>‹</button>
      <div className="bunker-thumbnails" ref={rail}>
        {items.map((entry, position) => <button key={entry.file || 'video'} type="button" aria-pressed={index === position}
          aria-label={entry.label} onClick={() => select(position)}>
          <img src={assetBase + (entry.file || game.banner)} alt=""/>
          {entry.video && <span aria-hidden="true">▶</span>}
        </button>)}
      </div>
      <button className="bunker-arrow" type="button" aria-label="다음 미디어" onClick={() => select(index + 1)}>›</button>
    </div>
    <p className="bunker-caption" aria-live="polite">{item.label}{!game.video && ' · 플레이 영상 추가 예정'}</p>
  </section>;
}

function Overview() {
  return <div className="bunker-overview">
    <div className="bunker-media-column">
      <MediaGallery/>
      <section className="bunker-tool-strip">
        <h3>사용한 도구</h3>
        <ToolList/>
      </section>
    </div>
    <section className="bunker-summary" aria-label="게임 설명">
      <header className="bunker-title">
        <img src={assetBase + game.banner} alt=""/>
        <div><h2>{game.title}</h2><p>{game.tagline}</p></div>
      </header>
      <p className="bunker-meta">PC · Unity 6 · C#</p>
      <h3>게임 목표와 규칙</h3>
      <p>플레이어와 HQ를 지키며 마지막 웨이브까지 버팁니다. 적을 막아 얻은 전략 물자로 장비를 강화하고 재보급합니다. 플레이어가 쓰러지거나 HQ가 파괴되면 패배합니다.</p>
      <dl className="bunker-facts">
        <div><dt>스테이지</dt><dd>침입로 1·2·3개 / 웨이브 4·6·8개</dd></div>
        <div><dt>가젯</dt><dd>설치 시 횟수 소모, 회수하면 1회 반환</dd></div>
        <div><dt>성장</dt><dd>메달로 장비 획득, 중복 장비는 등급 상승</dd></div>
      </dl>
      <details className="bunker-controls">
        <summary>기본 조작</summary>
        <p>WASD 이동 · 마우스 공격/조준 · Space 회피 · E/Q 설치 · X 회수 · G 투척 · V 스팀팩</p>
      </details>
    </section>
  </div>;
}

function Development() {
  return <div className="bunker-development">
    <header><h2>개발 과정</h2><p>기획을 넘기고, 버전별로 요구사항을 구체화하며, 재현 가능한 문제를 수정한 흐름입니다.</p></header>
    <ToolList/>
    {stages.map(({phase, title, decision, work, evidence}) => <section key={phase} className="bunker-step">
      <div className="bunker-phase">{phase}</div>
      <div>
        <h3>{title}</h3>
        <dl><dt>기획과 판단</dt><dd>{decision}</dd><dt>AI 협업과 결과</dt><dd>{work}</dd></dl>
        {evidence && <div className="bunker-evidence">{evidence.map(({file, label}) =>
          <figure key={file}><img src={assetBase + file} alt={label} loading="lazy"/><figcaption>{label}</figcaption></figure>
        )}</div>}
      </div>
    </section>)}
    <details className="bunker-controls">
      <summary>Unity 빌드 오류 대응</summary>
      <p>Play 모드에서 빌드를 시작하면 오류가 발생했습니다. Play·컴파일 중 메뉴를 비활성화하고, 빌드 진입 시에도 상태를 검사해 Play 종료를 안내하도록 수정했습니다.</p>
    </details>
    <a className="ai-game-link" href="https://app.notion.com/p/41fe64aabe67805ea3a4fdc36aeabb74" target="_blank" rel="noopener noreferrer">Notion 기획 기록 열기 ↗</a>
  </div>;
}

export default function AiGameScreen() {
  const [tab, setTab] = useState(0);
  const labels = ['게임 소개', '개발 과정'];

  return <article className="screen ai-game-screen bunker-screen">
    <div className="bunker-tabs" role="tablist" aria-label="Bunker Protecter 상세">
      {labels.map((label, index) => <button key={label} type="button" id={'bunker-tab-' + index}
        role="tab" aria-selected={index === tab} aria-controls="bunker-tab-content" tabIndex={index === tab ? 0 : -1}
        onClick={() => setTab(index)} onKeyDown={event => {
          const next = event.key === 'Home' ? 0 : event.key === 'End' ? 1 :
            ['ArrowLeft', 'ArrowRight'].includes(event.key) ? 1 - index : null;
          if (next === null) return;
          event.preventDefault();
          setTab(next);
          event.currentTarget.parentElement.children[next]?.focus();
        }}>{label}</button>)}
    </div>
    <div role="tabpanel" id="bunker-tab-content" aria-labelledby={'bunker-tab-' + tab} tabIndex={0}>
      {tab === 0 ? <Overview/> : <Development/>}
    </div>
  </article>;
}
