# 원당교회 웹사이트

Next.js 16과 OpenNext를 사용하는 Cloudflare Workers 애플리케이션입니다. SSR, 인증,
Server Actions를 사용하므로 Cloudflare Pages의 정적 출력으로 배포하지 않습니다.

회원 계정, 비밀번호 해시, 관리자 역할과 게시글은 Cloudflare D1을 최종 원본으로
사용합니다. `AUTH_KV`는 Better Auth 세션과 반복 조회 캐시를 저장합니다. KV는 최종
일관성 방식이므로 관리자 권한 판정에는 사용하지 않습니다.

## 필수 환경 변수

- `BETTER_AUTH_SECRET`: 최소 32자의 무작위 비밀값
- `BETTER_AUTH_URL`: 실제 서비스 원본 URL(예: `https://church.example.com`)

`wrangler.toml`의 `AUTH_KV` 바인딩은 첫 배포 시 Wrangler가 자동 생성합니다. Git 연동
배포에서는 Cloudflare 대시보드에서 생성된 KV가 Worker의 `AUTH_KV`에 연결됐는지
확인하세요.

비밀값은 저장소나 일반 텍스트 변수로 커밋하지 말고 Cloudflare Workers의
Secrets에서 관리합니다. 미리보기 환경과 프로덕션 환경에 각각 설정해야 합니다.

## D1 데이터베이스 준비

```bash
npm run db:migrate
```

최초 배포 후 첫 관리자는 가입한 계정의 `user.role`을 데이터베이스에서 `admin`으로
변경해야 합니다. 일반 가입자가 역할을 직접 지정할 수는 없습니다.

## 검증 및 배포

```bash
npm ci
npm run lint
npx tsc --noEmit
npm run cf-build
npm run cf-preview
npm run cf-deploy
```

Git 연동 배포를 구성할 때도 Pages 프로젝트가 아닌 Workers 프로젝트를 사용합니다.
OpenNext 산출물의 Worker 진입점은 `.open-next/worker.js`, 정적 자산 디렉터리는
`.open-next/assets`이며 자세한 값은 `wrangler.toml`에 정의되어 있습니다.


---



## To - do

1. /Users/chltmddn5843/Documents/GitHub/church/public 이미지 바꾸기
2.
