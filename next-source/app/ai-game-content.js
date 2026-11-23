const screenshots = [
  {image: '/ai-game/wave-defense.png', label: '철조망과 방벽으로 웨이브 방어'},
  {image: '/ai-game/defense-preparation.png', label: '웨이브 시작 전 HQ 방어 준비'},
];

const stages = [
  {
    phase: '기획',
    evidence: [],
    title: '함정 배치와 직접 전투를 한 판으로 설계',
    decision: '장비 선택 → 방어 준비 → 웨이브 전투 → 보급과 강화로 이어지는 구조를 정했습니다. 공통 8웨이브에서 4·6·8웨이브로 나누고, 침입 경로도 1·2·3개로 늘렸습니다.',
    work: 'Codex로 초안을 정리하고 GAME_DESIGN.md를 Claude에 전달했습니다. 변경 요구는 Notion에 버전별로 기록했습니다.',
  },
  {
    phase: '구현',
    title: '전투 중에도 방어선을 다시 짤 수 있게',
    decision: '별도 건설 모드를 가젯으로 통합하고, 투척은 키를 누르는 동안 궤적을 확인한 뒤 놓을 때 실행하도록 요청했습니다.',
    work: 'Claude로 Unity/C#의 웨이브·전투·장비 시스템을 구현했습니다. v0.5에서는 가젯 설치 횟수와 회수, 메달 상점, 장비 등급, 파괴 가능한 엄폐물이 추가됐습니다.',
    evidence: screenshots,
  },
  {
    phase: '문제 해결',
    evidence: [],
    title: '재출격 후 남는 캐릭터와 사라지는 가젯',
    decision: '맵을 새로 구성할 때 이전 화면 상태가 남는 두 증상을 개발 기록에서 확인했습니다. 캐릭터 객체가 중복 생성됐고, 같은 ID의 새 가젯은 이미 표시된 장치로 처리됐습니다.',
    work: '캐릭터 재생성 전 이전 객체와 애니메이터를 정리했습니다. 맵을 만들 때 표시 기록을 초기화하고, 기록에 대응하는 화면 객체가 없으면 다시 생성하도록 수정했습니다.',
  },
  {
    phase: 'v0.6',
    evidence: [],
    title: '재시작하면 적과 가젯이 함께 사라지는 문제 추적',
    decision: '스테이지 1을 마치고 다시 시작하면 적과 가젯이 보이지 않는다는 재현 조건을 Notion에 기록했습니다.',
    work: 'Claude는 맵을 다시 만들 때 이미 삭제된 입구 표시등 참조가 남아 화면 갱신을 중단시키는 원인을 찾았습니다. 맵 재구성 시 표시등 목록을 비우고, 삭제된 객체를 건너뛰며, 표시 항목별로 오류를 처리하도록 수정했습니다.',
  },
  {
    phase: 'v0.7–0.8',
    evidence: [],
    title: '출격 준비 흐름과 전투 HUD 개선',
    decision: '장비 선택 화면의 시간 제한을 없애고, 전투 준비 단계에서 타이머를 보여주도록 요청했습니다. 다음 버전에서는 시작 화면을 로비로 바꾸고 전투 HUD와 작은 글씨의 크기를 키우도록 요청했습니다.',
    work: 'Claude의 변경 기록에는 장비 선택을 확정하면 전투 준비 타이머를 시작하는 흐름과 상점 분류를 선택했을 때 글자가 잘 보이도록 대비를 조정한 내용이 남아 있습니다.',
  },
  {
    phase: 'v0.9–0.10',
    evidence: [],
    title: '애니메이션 롤백 범위와 무기 표시 규칙 재정의',
    decision: '롤백 범위를 좌우·후방 이동 모션으로 한정하고 v0.9 근접 공격 모션은 유지하도록 Claude에 명시했습니다. 무기 슬롯은 주·보조무기의 재장전과 근접무기의 공격 대기시간만 표시하도록 다시 요청했습니다.',
    work: 'Claude는 근접 베기 모션과 궤적을 유지한 채 이동 모션을 조정했습니다. 총기 재장전 시간에 0.8배를 적용하고, 재장전 중에는 노란 숫자, 근접 공격 대기 중에는 흰 숫자를 표시하도록 변경했습니다.',
  },
  {
    phase: '검증',
    evidence: [],
    title: '자동 검사와 실제 플레이에서 볼 항목을 구분',
    decision: '해금 절차를 반복하지 않고 장비를 확인할 수 있도록, 메달과 전체 1성 장비를 미리 지급한 별도 테스트 버전을 요청했습니다.',
    work: 'Claude의 보고 기준으로 v0.5에서는 규칙 검사 627개가 통과했고 세 스테이지 자동 플레이가 결과 단계에 도달했습니다. v0.10에서는 규칙 검사 843개 통과와 컴파일 오류 0건을 보고했습니다. v0.10의 Unity 실화면과 음향은 해당 보고에서 별도 확인 항목으로 남았습니다.',
  },
];

export const defaultAiGame = {
  sidebarTitle: 'Bunker Protecter',
  title: 'Bunker Protecter',
  introTab: '게임 소개',
  developmentTab: '개발 과정',
  tagline: '함정을 배치하고 직접 싸워 벙커의 기밀 데이터 센터를 지키는 3D 액션 디펜스',
  image: '/ai-game/bunker-title.png',
  meta: 'PC · Unity 6 · C#',
  rulesTitle: '게임 목표와 규칙',
  description: '플레이어와 HQ를 지키며 마지막 웨이브까지 버팁니다. 적을 막아 얻은 전략 물자로 장비를 강화하고 재보급합니다. 플레이어가 쓰러지거나 HQ가 파괴되면 패배합니다.',
  facts: [
    {label: '스테이지', description: '침입로 1·2·3개 / 웨이브 4·6·8개'},
    {label: '가젯', description: '설치 시 횟수 소모, 회수하면 1회 반환'},
    {label: '성장', description: '메달로 장비 획득, 중복 장비는 등급 상승'},
  ],
  controlsTitle: '기본 조작',
  controls: 'WASD 이동 · 마우스 공격/조준 · Space 회피 · E/Q 설치 · X 회수 · G 투척 · V 스팀팩',
  toolsTitle: '사용한 도구',
  tools: [
    {name: 'ChatGPT', logo: '/ai-game/chatgpt.webp', purpose: '기획 초안·시각 자료'},
    {name: 'Codex', logo: '/ai-game/chatgpt.webp', purpose: '기획 문서 구조화'},
    {name: 'Claude', logo: '/ai-game/claude.svg', purpose: '게임 구현·오류 수정'},
    {name: 'Notion', logo: '/ai-game/notion.webp', purpose: '버전별 요구사항'},
    {name: 'Unity', logo: '/ai-game/unity.svg', purpose: '3D 게임 엔진'},
  ],
  downloadLabel: '게임 다운로드',
  downloadUrl: '',
  videoUrl: '',
  screenshots,
  developmentTitle: '개발 과정',
  developmentIntro: '',
  stages,
  buildTitle: 'Unity 빌드 오류 대응',
  buildDescription: 'Play 모드에서 빌드를 시작하면 오류가 발생했습니다. Play·컴파일 중 메뉴를 비활성화하고, 빌드 진입 시에도 상태를 검사해 Play 종료를 안내하도록 수정했습니다.',
};

export const aiGameModel = {
  ...defaultAiGame,
  stages: [{...stages[0], evidence: [screenshots[0]]}],
};
