# 운영 절차

## 최초 관리자

Cloudflare Worker Secrets에 `BOOTSTRAP_ADMIN_EMAIL`과 충분히 긴 무작위
`BOOTSTRAP_ADMIN_KEY`를 설정한다. 해당 이메일로 회원가입·로그인한 뒤
`/setup/admin`에서 키를 한 번 입력한다. 관리자가 한 명 생기면 이 경로는 더 이상
승격할 수 없다. 설정 후 두 bootstrap Secret은 삭제한다. 이후 관리자는
`/admin/members`에서 승인하거나 지정한다.

`BETTER_AUTH_SECRET`은 모든 배포에서 필수다. 운영 도메인을 연결할 때
`wrangler.toml`의 `BETTER_AUTH_URL`도 같은 주소로 변경한다.

## 배포

운영 배포는 `main` 브랜치만 사용한다.

```bash
npm ci
npm run cf-deploy
```

`cf-deploy`는 lint, TypeScript, Cloudflare 빌드가 모두 성공한 후에만 원격 D1
마이그레이션과 Worker 배포를 실행한다. 마이그레이션 파일은 수정·삭제하지 않고 새
파일을 추가하며, 기존 Worker와도 호환되는 변경을 우선한다.

배포 직후 홈, 로그인, `/admin`, 게시글 조회, 팝업 이미지를 확인한다.

## D1 복구 — 7일

D1 Time Travel이 자동으로 유지하는 복구 지점을 사용한다. 별도 장기 백업은 만들지
않는다.

```bash
npx wrangler d1 time-travel info church-db
npx wrangler d1 time-travel info church-db --timestamp="2026-01-01T00:00:00+09:00"
```

복구는 운영 데이터를 덮어쓰므로 현재 bookmark를 기록하고 Cloudflare 대시보드와
서비스 상태를 확인한 뒤에만 실행한다.

```bash
npx wrangler d1 time-travel restore church-db --bookmark="확인한-bookmark"
```

## Worker 롤백

DB 복구 없이 코드만 되돌릴 수 있을 때 Cloudflare Workers의 Deployments에서 직전
정상 버전으로 Rollback한다. 스키마가 바뀐 배포는 이전 코드가 현재 DB와 호환되는지
먼저 확인한다. 호환되지 않으면 코드 롤백만 하지 말고 D1 Time Travel 복구 시점까지
함께 결정한다.
