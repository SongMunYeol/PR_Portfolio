const controls = [
  ['W · A · S · D', '이동'],
  ['마우스 왼쪽 / 오른쪽', '공격 / 조준'],
  ['Space', '회피'],
  ['1 / 2 / 3', '주무기 / 보조무기 / 근접무기'],
  ['E / Q · X', '가젯 설치 · 가까운 가젯 회수'],
  ['G 누르기 / 떼기', '투척 궤적 확인 / 투척'],
  ['V', '스팀팩 사용'],
];

const process = [
  ['v0.1 · 핵심 규칙 정의', '벙커 방어라는 목표에서 출발해 장비 선택, 방어 준비, 웨이브 전투, 강화와 재보급으로 한 판의 흐름을 설계했습니다. Codex로 정리한 기획 초안을 GAME_DESIGN.md로 전달했습니다.'],
  ['v0.2–0.3 · 방어 방식과 난이도 조정', '별도 건설 모드를 가젯 설치로 통합하도록 요청했습니다. 모든 스테이지가 8웨이브를 공유하던 기획을 침입로 1·2·3개와 웨이브 4·6·8개로 나눴습니다.'],
  ['v0.4 · 전투 중 정보와 조작 개선', 'HQ 체력을 시설 바로 위에 표시하고, 가젯과 투척물 정보를 체력바 가까이 배치하도록 요청했습니다. G 키를 누르는 동안에는 궤적을 미리 보고, 놓는 순간 투척하도록 입력 단계를 나눴습니다.'],
  ['v0.5 · 장비 성장과 전투 환경 확장', 'Claude는 메달 상점, 인벤토리, 장비 등급, 파괴 가능한 엄폐물을 추가했습니다. 가젯은 쿨타임 대신 설치 횟수를 쓰도록 변경했고, 상점 가격은 스테이지 3 보상 규모를 근거로 산정했습니다.'],
];

const fixes = [
  ['맵을 다시 만들면 캐릭터가 한 명 더 남음', '스테이지 선택이나 출격 시 기존 캐릭터가 남은 상태에서 새 모델을 생성했습니다.', '새 모델을 만들기 전에 이전 캐릭터 객체와 애니메이터를 정리하도록 변경했습니다.'],
  ['설치한 가젯이 간헐적으로 보이지 않음', '맵을 재생성해도 이전 장치의 표시 기록이 남아 있어, 같은 ID가 부여된 새 장치를 이미 그린 것으로 처리했습니다.', '맵을 만들 때 기존 표시 기록을 초기화하고, 기록은 남아 있지만 화면 객체가 사라진 경우 다시 생성하도록 변경했습니다.'],
  ['Play 모드에서 Windows 빌드 메뉴 실행 시 오류', 'Unity에서 실행 중에 빌드를 시도할 수 있었습니다.', 'Play·컴파일 중 메뉴를 비활성화하고, 실행 진입점에서도 상태를 검사해 Play 종료를 안내하도록 했습니다.'],
];

export default function AiGameScreen({section}) {
  if (section === 1) {
    return (
      <article className="screen ai-game-screen">
        <header>
          <h2>기획과 제작</h2>
          <p>저는 게임의 목표와 규칙을 정하고 버전별 수정 요구사항을 작성했습니다. 기획 초안은 Codex로 정리했고, 게임 코드 구현과 수정에는 Claude를 사용했습니다.</p>
        </header>
        <ol className="ai-game-process">
          {process.map(([title, description]) => (
            <li key={title}><h3>{title}</h3><p>{description}</p></li>
          ))}
        </ol>
        <p>후속 버전에서는 해금 후 장비를 바로 점검할 수 있도록, 메달과 전 장비 1성을 미리 지급한 별도 테스트 버전을 요청했습니다.</p>
        <a className="ai-game-link" href="https://app.notion.com/p/41fe64aabe67805ea3a4fdc36aeabb74" target="_blank" rel="noopener noreferrer">Notion 기획 기록 열기 ↗</a>
      </article>
    );
  }

  if (section === 2) {
    return (
      <article className="screen ai-game-screen">
        <header>
          <h2>문제 해결과 검증</h2>
          <p>Claude 개발 기록의 오류 원인과 Unity v0.5 소스에서 확인한 수정 내용을 정리했습니다.</p>
        </header>
        <div className="ai-game-fixes">
          {fixes.map(([title, cause, change]) => (
            <section className="ai-game-card" key={title}>
              <h3>{title}</h3>
              <dl><dt>원인</dt><dd>{cause}</dd><dt>수정</dt><dd>{change}</dd></dl>
            </section>
          ))}
        </div>
        <section className="ai-game-card">
          <h3>검증 범위</h3>
          <p>Claude의 v0.5 완료 보고에는 게임 규칙 검사 627개 통과, 스테이지 1~3 자동 플레이에서 결과 단계 도달, 런타임·에디터 코드 컴파일 성공이 기록되어 있습니다. 당시 Unity 화면과 실제 음향은 별도 플레이 검증이 필요한 항목으로 남았습니다.</p>
        </section>
      </article>
    );
  }

  return (
    <article className="screen ai-game-screen">
      <header className="ai-game-hero">
        <p className="ai-game-meta">3D 탑다운 액션 디펜스 · Unity 6 / C# · PC</p>
        <h2>벙커 프로텍터</h2>
        <p>벙커의 기밀 데이터 센터를 지키기 위해 침입로에 함정을 설치하고 직접 전투하는 3D 액션 디펜스 게임입니다.</p>
      </header>
      <div className="ai-game-overview">
        <section className="ai-game-card">
          <h3>게임 목표와 규칙</h3>
          <p>장비를 선택하고 방어를 준비한 뒤 웨이브를 맞습니다. 적을 물리쳐 얻은 전략 물자로 장비를 강화하고 재보급합니다. 최종 웨이브까지 플레이어와 데이터 센터(HQ)가 살아남으면 승리합니다. 플레이어가 쓰러지거나 HQ가 파괴되면 패배합니다.</p>
          <p>v0.5는 4·6·8웨이브의 스테이지 3종으로 구성됩니다. 가젯을 설치하면 사용 횟수가 줄고, 회수하면 한 번을 돌려받습니다. 로비에서는 획득한 메달로 장비를 뽑고 중복 장비의 등급을 올릴 수 있습니다.</p>
        </section>
        <section className="ai-game-card">
          <h3>기본 조작</h3>
          <dl className="ai-game-controls">
            {controls.map(([input, action]) => (
              <div key={input}><dt>{input}</dt><dd>{action}</dd></div>
            ))}
          </dl>
        </section>
      </div>
    </article>
  );
}
