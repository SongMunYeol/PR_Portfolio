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

export function createAiGame(title = '새 AI 게임') {
  return {
    ...defaultAiGame,
    sidebarTitle:title, title, tagline:'', image:'', meta:'', description:'',
    facts:[], controls:'', tools:[], screenshots:[], stages:[],
    downloadUrl:'', videoUrl:'', developmentIntro:'', buildTitle:'', buildDescription:'',
  };
}

const duckVsDuck = {
  ...createAiGame('Duck vs Duck'),
  tagline: '상대를 쓰러뜨리고 오리알을 모으는 3대3 탑뷰 아레나',
  meta: 'Windows · Unity 6 · C# · v0.4',
  description: '오리 한 마리를 조종해 AI 팀원 두 마리와 함께 상대 팀에 맞섭니다. 쓰러진 상대가 떨어뜨린 오리알을 직접 주워 팀 점수를 쌓습니다. 20알을 먼저 모으면 승리합니다. 2분 안에 어느 팀도 20알을 모으지 못하면 점수가 높은 팀이 이기며, 동점이면 무승부입니다.',
  facts: [
    {label:'대전', description:'3대3 · 플레이어 1명과 AI 오리 5마리'},
    {label:'장비', description:'장비는 공격 방식을 바꾸고, 쁘띠덕은 능력치에 영향을 줍니다.'},
    {label:'아레나', description:'장애물과 건초로 교전 위치를 바꿀 수 있습니다. 물에 빠지면 즉시 쓰러지며 오리알을 떨어뜨리지 않습니다.'},
  ],
  controls: 'WASD 이동 · 마우스 왼쪽 공격 · 마우스 오른쪽 스킬 · Space 회피 · E 궁극기',
  tools: defaultAiGame.tools.filter(({name}) => ['Codex','Claude','Notion','Unity'].includes(name)),
  stages: [
    {
      phase: '기획',
      title: '처치 이후 오리알을 회수해야 점수가 되는 팀전',
      decision: '플레이어 1명과 AI 오리 5마리로 3대3 경기를 설계했습니다. 처치한 곳까지 이동해 오리알을 회수해야 점수가 쌓이므로, 교전 위치와 회수 경로를 함께 판단하게 했습니다.',
      work: 'Notion에 승패 조건, 장비와 쁘띠덕의 역할, 지형 규칙을 정리해 Claude에 초기 구현을 요청했습니다. 장비는 공격 방식을, 쁘띠덕은 능력치를 바꾸도록 설계했습니다.',
      evidence: [],
    },
    {
      phase: '구현',
      title: '장비 선택에서 경기 결과까지 연결',
      decision: '경기 전 장비와 쁘띠덕을 고르게 하고, 상점에서는 1회·5회 버튼 어느 쪽을 눌러도 매 추첨마다 두 종류 중 하나가 나오도록 요청했습니다. 태양 광선은 충전해서 쏘고 화약통은 지면을 따라 굴러가도록 동작을 구체화했습니다.',
      work: 'Claude로 Unity/C#에서 로비, 장비 선택, 3대3 경기와 결과 화면을 구현했습니다. v0.3에서 장비 선택에 30초를 부여하고 ESC 일시정지를 추가했습니다. v0.4에서는 차지 중 이동이 느려지는 태양 광선, 벽이나 적에 닿으면 폭발하고 물에 빠지면 불발되는 화약통을 구현했습니다.',
      evidence: [],
    },
    {
      phase: '문제 해결',
      title: '너무 짧은 경기와 봇의 과도한 압박 조정',
      decision: 'Claude의 v0.2 자동 플레이에서 목표가 10알일 때 경기가 16~28초 만에 끝났습니다. 이후에는 높은 봇 조준 정확도와 연사 공격의 압박, 제자리에서 계속 회전하는 동작을 수정 과제로 기록했습니다.',
      work: 'v0.2에서 승리 목표를 20알, 부활 대기 시간을 5초로 조정했습니다. 조정 후 Claude가 보고한 자동 플레이 기록은 약 85초였습니다. v0.3~v0.4에서 연사 탄 수와 탄속을 줄이고, 봇의 조준에 오차와 추적 지연을 넣었습니다. 제자리 회전은 짧게 옆으로 움직인 뒤 멈추는 동작으로 바꿨습니다.',
      evidence: [],
    },
    {
      phase: '문제 해결',
      title: '일부 글자만 다른 글꼴로 보이는 원인 수정',
      decision: 'UI에서 일부 기호와 봇 이름의 글자만 다른 글꼴로 표시됐습니다. Claude는 사용 중인 Jua 글꼴에 해당 글자가 없어 대체 글꼴이 적용되는 것을 확인했습니다.',
      work: 'v0.3에서 누락된 기호와 글자를 Jua 스타일에 맞춰 보완했습니다. 타이머와 부제처럼 서로 붙어 보이던 UI 요소의 간격도 조정했습니다.',
      evidence: [],
    },
    {
      phase: '검증',
      title: 'PC 빌드와 자동 플레이로 수정 결과 확인',
      decision: 'v0.4의 1차 빌드에서 자동 플레이 화면을 검토해 추가로 다듬을 부분을 찾고, 수정 후 다시 빌드했습니다.',
      work: 'Claude 작업 기록에 따르면 v0.4 PC 빌드가 성공했고, 재빌드 후 자동 플레이 스크린샷 29장을 확인했습니다. 해당 실행 로그에는 오류가 보고되지 않았습니다.',
      evidence: [],
    },
  ],
};

export const defaultAiGames = [defaultAiGame, duckVsDuck];

// Older snapshots stored only Bunker Protecter. Keep their exact edited entry.
export function getAiGames(content) {
  return content.aiGames ?? (content.aiGame ? [content.aiGame, duckVsDuck] : defaultAiGames);
}
