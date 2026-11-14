# 송문열 게임 기획 포트폴리오

공개 주소: **https://songmunyeol.github.io/PR_Portfolio/**

Next.js로 만든 포트폴리오를 정적 HTML/CSS/JavaScript로 내보내 GitHub Pages에서 제공합니다. 방문자는 Node.js, 로컬 서버, 제작자의 PC 없이 접속할 수 있습니다. Profile / Game Experience / Portfolio 탭, 하위 메뉴, 캐러셀을 지원합니다.

사용자의 전체 공개 이식 승인에 따라 이전에 저장한 소개, 개인정보, 사진, 경력 및 증빙 첨부 자료를 공개본에 반영했습니다. 제작 컴퓨터의 원본도 그대로 보존됩니다.

## 개인 초안 편집

편집 주소: **https://songmunyeol.github.io/PR_Portfolio/?edit=1**

일반 공개 페이지 오른쪽 아래 **내용 · 이미지 편집**에서 바로 텍스트와 이미지를 수정할 수 있습니다. 저장 후에는 개인 편집본으로 표시되며 새로고침해도 이어서 볼 수 있습니다. **공개본 보기**로 일반 공개 화면에 돌아갑니다. **개인 초안 저장**은 현재 브라우저의 IndexedDB에만 보관하며 공개본에 영향을 주지 않습니다. 편집기의 **공개 반영 방법**을 펼쳐 **공개 반영용 content.json 받기**를 누르고 연결된 GitHub 업로드 화면의 `next-source/`에 올린 뒤 커밋하면 자동으로 사이트를 다시 빌드하고 배포합니다. 저장소 소유자 계정으로 로그인해야 합니다. **내용 백업 내보내기**로 이미지·파일을 포함한 JSON을 보관하고 이 채팅에 공개 반영을 요청해도 됩니다. 일반 주소는 항상 공개본을 표시합니다.

## 재빌드

Next.js 원본은 `next-source/`에 있습니다. Node.js 20.9 이상에서 해당 폴더로 이동해 의존성을 설치하고 `npm run build:pages`로 빌드합니다. `data/content.json`이 없으면 `content.json`을 사용합니다. 새 백업 파일을 반영할 때는 `node scripts/build-static.cjs /path/to/backup.json`을 실행합니다. GitHub Actions가 main 변경 시 `next-source/content.json`으로 Next.js 정적 빌드를 실행하고 배포합니다. 기존 `site/assets/media/`는 콘텐츠가 참조하는 이미지·파일 원본이므로 보존하세요.

GitHub Pages 배포본은 서버 API를 사용하지 않습니다. 로컬 API 편집 기능은 원본에 남아 있습니다. PC를 끄거나 로컬 서버를 종료해도 공개 주소는 유지됩니다. 기존 공개 버전은 Git 커밋 기록에 보존됩니다.


