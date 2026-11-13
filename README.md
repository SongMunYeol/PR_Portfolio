# 송문열 게임 기획 포트폴리오

공개 주소: **https://songmunyeol.github.io/PR_Portfolio/**

Next.js로 만든 포트폴리오를 정적 HTML/CSS/JavaScript로 내보내 GitHub Pages에서 제공합니다. 방문자는 Node.js, 로컬 서버, 제작자의 PC 없이 접속할 수 있습니다. Profile / Game Experience / Portfolio 탭, 하위 메뉴, 캐러셀을 지원합니다.

현재 공개본에는 연락처·생년월일·이메일·학교·개인 사진·증빙 파일을 포함하지 않았습니다. 해당 정보와 파일은 제작 컴퓨터에 보존됩니다.

## 개인 초안 편집

편집 주소: **https://songmunyeol.github.io/PR_Portfolio/?edit=1**

오른쪽 아래 **내용 · 이미지 편집**에서 텍스트와 이미지를 수정할 수 있습니다. **개인 초안 저장**은 현재 브라우저의 IndexedDB에만 보관하며 공개본에 영향을 주지 않습니다. **내용 백업 내보내기**로 이미지·파일을 포함한 JSON을 보관하고 공개 반영이 필요한 경우 제작 채팅에 전달하세요. 일반 주소는 항상 공개본을 표시합니다.

## 재빌드

Next.js 원본은 `next-source/`에 있습니다. Node.js 20.9 이상에서 해당 폴더로 이동해 의존성을 설치하고 `npm run build:pages`로 빌드합니다. `data/content.json`이 없으면 `content.json`을 사용합니다. 새 백업 파일을 반영할 때는 `node scripts/build-static.cjs /path/to/backup.json`을 실행합니다. 빌드된 `.static-build/out/`의 내용을 저장소 루트 `site/`에 복사해 main에 커밋하면 GitHub Actions가 자동 배포합니다.

GitHub Pages 배포본은 서버 API를 사용하지 않습니다. 로컬 API 편집 기능은 원본에 남아 있습니다. PC를 끄거나 로컬 서버를 종료해도 공개 주소는 유지됩니다. 기존 공개 버전은 Git 커밋 기록에 보존됩니다.
