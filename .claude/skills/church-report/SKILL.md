---
name: church-report
description: 원당교회 사이트(Cloudflare Worker "church")의 직전 주말(토·일) 운영 리포트. 사용자가 "교회 리포트 확인해줘" 또는 비슷하게 말하면 실행한다. 사용자가 열어둔 Chrome의 Cloudflare 대시보드에서 CPU·요청·오류·로그를 읽어 에러와 개선 사항을 보고한다.
---

# 교회 주말 리포트

## 대상
- 계정 ID: `15a009679529acd3a13921f9031d574e`
- Worker: `church` (www.wdchurch.com), D1 `church-db`, KV `AUTH_KV`, R2 `church`
- Observability 켜져 있음 (head_sampling_rate = 1, 로그 전수 수집)
- 요금제: Workers Paid (2026-10-07 확인). 무료 한도 기준으로 판단하거나 유료 전환을 권하지 않는다. CPU는 비용·응답 속도 관점으로 본다 (아래 일회성 항목은 예외)

## 기간
가장 최근의 지난 토요일 00:00 ~ 일요일 23:59 (KST). `date`로 오늘 날짜를 확인해 계산하고, 리포트 첫 줄에 날짜를 명시한다. 월요일이 아니어도 "직전 토·일"을 쓴다.

## 절차
1. `anthropic-skills:chrome-browser` 스킬을 먼저 읽고 Chrome 도구를 한 번에 로드한다. `tabs_context_mcp`로 열린 Cloudflare 탭을 찾는다(로그인 세션 재사용). 로그인 안 돼 있으면 멈추고 사용자에게 로그인을 요청한다 — 비밀번호를 직접 입력하지 않는다.
2. 새 탭에서 아래 페이지를 차례로 열고 기간을 위 토·일로 지정(커스텀 범위)한 뒤 `get_page_text`/스크린샷으로 수치를 읽는다.
   - Metrics: `https://dash.cloudflare.com/15a009679529acd3a13921f9031d574e/workers/services/view/church/production/metrics`
     → 요청 수, 오류 수/비율, CPU 시간(P50/P99), Wall time, 하위 요청
   - Observability(이벤트·로그): `https://dash.cloudflare.com/15a009679529acd3a13921f9031d574e/workers-and-pages/observability`
     → `$workers.scriptName = church` 필터, outcome ≠ ok, level = error/warn, status ≥ 500 / 4xx 상위 경로, exception 메시지 그룹
   - D1: `https://dash.cloudflare.com/15a009679529acd3a13921f9031d574e/workers/d1` → church-db 쿼리 수·느린 쿼리
   - 계정 홈 알림/사용량: Paid 포함량(월 요청 1천만, CPU 3천만 ms) 대비
3. URL이 바뀌어 404면 대시보드 메뉴(Workers & Pages → church)로 직접 이동한다. 같은 동작이 2~3번 실패하면 멈추고 사용자에게 묻는다.
4. 오류 메시지가 코드 문제로 보이면 이 저장소에서 해당 경로/함수를 grep해 원인 후보 파일:줄을 짚는다. 코드는 수정하지 않는다(보고만).

## 수치 조회 팁
화면 차트보다 API가 정확하다. 대시보드 탭에서 `javascript_tool`로 `fetch('/api/v4/graphql', {headers: {'x-atok': window.bootstrap.atok}})`(`workersInvocationsAdaptive`, `d1AnalyticsAdaptiveGroups`)와 `/api/v4/accounts/<계정>/workers/observability/telemetry/query`(`view: calculations`, groupBy `$metadata.trigger`·`$metadata.message`)를 호출한다. 500은 Next가 페이지를 그려서 GraphQL `errors`에 안 잡히므로 `$workers.event.response.status`로 찾는다. 응답에 쿼리스트링이 섞이면 출력이 막히니 `?…`로 지워서 반환한다.

## 일회성: 2026-10-10~11 주말 리포트에 "무료 플랜 전환 판단" 추가
사용자 요청(2026-10-08). 리포트에 `## 무료 플랜 전환 판단` 섹션을 넣고 결론(전환 가능 / 유지 권장)과 근거 표를 쓴다. 판단 후 이 섹션은 지운다.
- 무료 한도: 요청 10만/일, 요청당 CPU 10ms, D1 읽은 행 500만/일, Workers Logs 보존 기간 짧음
- 확인할 것: 토·일 각 요청 수, CPU 10ms 초과 요청 비율(observability `$workers.cpuTimeMs`), D1 일별 rowsRead, 홈(`/`) CPU
- 비교 기준 (이전 리포트, 이 PC에 `reports/`가 없을 수 있어 여기 적어 둠):
  - 10/3~4 주말: 호출 41,699 (토 24,253 / 일 17,446), 10/3 토 21~22시 카톡 공유 몰림 때 10ms 한도로 503 137건, CPU P50 6.4 / P99 554.8ms, D1 읽은 행 2일 118만
  - 10/7 배포(`5596349`) 후 평일: 하루 4~5천 건, CPU P50 10.1 / P90 393.8 / P99 853.7ms, 홈 `/` avg 250ms (엣지 캐시 TTL 60초, `worker.ts:11`), D1 읽은 행 하루 41만~61만
- 이 시점 예상: CPU 10ms 한도 때문에 유지 쪽. 주말 수치로 확정한다.

## 보고 형식 (한국어, md 파일)
`reports/church-report-<토요일 YYYY-MM-DD>.md`로 저장한다(`reports/`는 gitignore됨). 같은 파일이 있으면 덮어쓴다. 터미널에는 요약 두세 줄과 파일 경로만 출력한다.
```
# 교회 주말 리포트 (YYYY-MM-DD 토 ~ YYYY-MM-DD 일)

## 한눈에 보기
전체 상태: 정상 / 살펴볼 것 있음 / 바로 고쳐야 함

| 번호 | 무슨 일이 있었나 | 얼마나 | 방문자에게 미친 영향 | 해야 할 일 |
|---|---|---|---|---|
| 1 | 예: 로그인 페이지가 가끔 열리지 않았음 | 주말 동안 12번 | 로그인 시도한 일부가 오류 화면을 봄 | 코드 확인 필요 (아래 1번) |

이슈가 없으면 표 대신 "이번 주말은 문제 없이 잘 돌아갔습니다." 한 줄.

## 주말 방문 현황
- 방문(요청) 수, 오류 비율, 가장 바빴던 시간대 — 쉬운 말로, 지난주 md가 있으면 "지난주보다 n% 많음"처럼 비교

---
아래는 개발 확인용 상세

## 에러 상세        — 번호는 위 표와 맞춘다. 메시지 · 건수 · 경로 · 원인 후보(파일:줄)
## 기술 수치        — CPU P50/P99, Wall time, D1 쿼리 수·느린 쿼리, Paid 포함량 대비
## 개선 사항        — 우선순위 순, 근거 수치와 함께
## 확인 못 한 항목  — 읽지 못한 페이지와 이유
```
"한눈에 보기"와 "주말 방문 현황"은 개발을 모르는 사람도 읽을 수 있게 쓴다: CPU·5xx·D1·Worker 같은 용어 대신 "서버가 응답하지 못함", "페이지가 느리게 열림", "게시판 데이터 불러오기" 같은 말로 풀고, 이슈는 방문자 영향이 큰 순서로 정렬한다. 용어와 원본 수치는 상세 섹션에만 둔다.
수치는 화면에서 읽은 값만 쓴다. 못 읽었으면 추정하지 말고 "확인 못 함"으로 둔다. 일요일 예배 시간대(오전) 트래픽 급증 같은 패턴이 보이면 언급한다.
