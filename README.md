# CHAN PR — GitHub 연결 준비본

현재 제작한 PR 사이트 원본에서 새로 준비했습니다. 기존 GitHub용 패키지와 독립된 프로젝트입니다. HTML·CSS와 편집·탭 동작을 유지하며, 이미지와 원본 문서만 프로젝트 내부 상대경로로 연결합니다.

## 구성

- `site/index.html`: 페이지 골격
- `site/style.css`: 기존 디자인, 반응형 스타일
- `site/app.js`: 기존 콘텐츠·호버 탭·모바일 터치·키보드·편집·저장 기능
- `site/assets/`: 이미지 18개
- `site/portfolio_documents/`: PDF·엑셀 원본 문서 5개
- `.github/workflows/pages.yml`: main 푸시 또는 수동 실행 시 `site/` 배포

별도 설치나 빌드가 필요하지 않습니다. Google Fonts는 외부에서 불러오며, 그 외 제공 이미지·문서는 포함합니다. 콘텐츠·이미지·문서 출처: https://clownchan.github.io/PR_Chan/

## 연결에 필요한 사용자 작업

1. Codex의 GitHub 연결에서 본인 계정으로 로그인합니다.
2. 사용할 저장소 접근을 승인합니다. 조직 저장소라면 조직 승인 또는 SSO 승인이 추가로 필요할 수 있습니다.
3. 사용할 저장소 URL 또는 새로 만들 저장소 이름과 공개 여부를 알려 주세요.
4. 소스 업로드에는 저장소 쓰기 권한이, 워크플로 파일 업로드에는 해당 파일을 쓸 수 있는 권한이 필요합니다. Pages 설정은 저장소 관리 권한이 필요할 수 있습니다. 실제 연결이 요구하는 승인 화면에서 확인합니다.

토큰이나 비밀번호를 채팅에 보내지 마세요. GitHub 연결만으로 로컬 Git 인증까지 설정됐다고 간주하지 않습니다. 실제 쓰기 기능이 지원되는지 확인한 뒤 업로드를 진행합니다.

## Git으로 직접 연결하는 경우

README 등을 자동 생성하지 않은 빈 GitHub 저장소를 준비하고, 이 폴더에서 실행합니다.

```powershell
git remote add origin https://github.com/사용자명/저장소명.git
git push -u origin main
```

이 준비본에는 로컬 Git 저장소와 초기 커밋이 포함되어 있습니다. origin은 연결 계정에서 확인한 https://github.com/SongMunYeol/PR_Portfolio.git 로 설정했습니다. 이미 설정되어 있으므로 위 remote add 명령은 생략하세요. 사용자가 업로드 대상으로 선택한 공개 저장소입니다. 인증창이 나오면 GitHub 로그인을 진행합니다. 기존 내용이 있는 저장소는 먼저 확인해야 하며 강제 푸시는 하지 않습니다.

## GitHub Pages 활성화

저장소에서 **Settings → Pages → Build and deployment → Source → GitHub Actions**를 선택합니다. 이후 **Actions → Deploy PR to GitHub Pages → Run workflow**를 실행합니다. 다음 main 변경부터 자동 배포됩니다. 배포 URL은 GitHub가 표시하는 주소를 사용합니다.

원격 저장소는 https://github.com/SongMunYeol/PR_Portfolio 입니다. GitHub Pages 배포 결과는 저장소 Actions와 Settings → Pages에서 확인합니다. 일반적인 Pages 배포는 콘텐츠가 공개되므로 기존 Sites의 비공개 로그인 제한은 이전되지 않습니다.

## 편집 기능의 기존 동작

- 편집 버튼으로 글·이미지를 수정하고 현재 브라우저에 저장합니다.
- 저장 내용은 사이트 주소별로 분리됩니다. 기존 사이트에서 내보낸 수정본을 새 주소에서 불러오면 이전할 수 있습니다.
- 수정본 불러오기는 해당 브라우저에만 적용됩니다. GitHub 소스에는 자동 반영되지 않습니다.
- 모든 방문자에게 반영하려면 소스에 수정 내용을 반영하고 다시 커밋·배포해야 합니다.
- 이번 준비에서는 이전 패키지의 `content.json` 방식 등을 추가하지 않고 기존 동작을 유지했습니다.

## 공식 안내

https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages


