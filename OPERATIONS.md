# 운영 절차

## 최초 관리자

Cloudflare Worker Secrets에 `BOOTSTRAP_ADMIN_EMAIL`과 충분히 긴 무작위
`BOOTSTRAP_ADMIN_KEY`를 설정한다. 해당 이메일로 회원가입·로그인한 뒤
`/setup/admin`에서 키를 한 번 입력한다. 관리자가 한 명 생기면 이 경로는 더 이상
승격할 수 없다. 설정 후 두 bootstrap Secret은 삭제한다. 이후 관리자는
`/admin/members`에서 승인하거나 지정한다.

`BETTER_AUTH_SECRET`은 모든 배포에서 필수다. 운영 도메인을 연결할 때
`wrangler.toml`의 `BETTER_AUTH_URL`도 같은 주소로 변경한다.

이메일 인증과 비밀번호 재설정은 Resend의 `RESEND_API_KEY` Secret과 인증된
`EMAIL_FROM` 발신 주소가 모두 있을 때만 활성화된다. 발신 도메인 인증 전에는 이
기능만 꺼지고 회원가입 후 관리자 승인 방식은 그대로 동작한다.

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

## 백업 — 매월 1회 이상

D1 Time Travel은 7일만 보관하고, R2(업로드 파일)는 지우면 복구할 수 없다. 매월 1회,
그리고 대량 삭제·가져오기·마이그레이션 전에 전체 백업을 받는다.

```bash
npm run backup                 # 기본 저장 위치: ~/church-backups
npm run backup -- --out=/Volumes/백업디스크/church
```

- `db/church-db-<시각>.sql`: D1 전체 SQL 덤프
- `r2/<key>`: DB가 가리키는 모든 업로드 파일(이미 받은 파일은 건너뜀), `manifest-<시각>.txt`
- DB가 가리키는데 R2에 없는 파일이 있으면 목록을 출력하고 종료 코드 1로 끝난다.

백업에는 회원 정보가 들어 있으므로 저장소 안에 두거나 커밋하지 않는다. 외장 디스크나
암호화된 저장소에 한 부 더 보관한다.

DB 덤프 복원(전체 덮어쓰기, 신중히):

```bash
npx wrangler d1 execute church-db --remote --file ~/church-backups/db/church-db-<시각>.sql
```

R2 파일 복원:

```bash
npx wrangler r2 object put church/<key> --file ~/church-backups/r2/<key> --remote
```

## D1 복구 — 7일

D1 Time Travel이 자동으로 유지하는 7일 복구 지점을 사용한다. 그보다 오래된 시점은
위의 월간 백업으로 복원한다.

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
