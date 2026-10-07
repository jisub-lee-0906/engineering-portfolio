# 검증 기록과 공개 범위

문서 개편 기준일: **2026-10-07**. 과거 기록, 이번 실행, 미검증 항목을 구분합니다. 이번 로컬 실행은 AI 에이전트가 수행했으며 지원자 본인의 직접 재현·숙련 검증과 동일하지 않습니다.

## 2026-10-07 실제 재실행

| 대상 | 소스 기준 | 환경·명령 | 확인 결과 |
| --- | --- | --- | --- |
| 자동화 툴킷 | `68be44ed8ff9b7e3c4c1be3d5207f44f2fe52ca7` | Windows / Python 3.13.12, python -m pytest | 전체 132개 통과, 종료 0 |
| 자동화 툴킷 안전성 부분집합 | 동일 | 경로·중복 ID·백업·파일 보존 5개 테스트 | 5개 통과, 종료 0. 전체 132개에 포함 |
| 툴킷 CLI | 동일 | vn-auto --help / --version | 종료 0 / 버전 0.1.0 |
| meal-workspace 공개 샘플 | `9693a77c3c78ea48f435e997006dffb5bd6ea300`의 샘플 소스 | Windows / Node.js 26.5.0, node --test --test-reporter=tap samples/meal-workspace/validation.test.mjs | 테스트 파일 1개 통과, 내부 assertion 31개 통과, 종료 0 |

- [툴킷 실행 절차·원본 출력](https://github.com/jisub-lee-0906/vn-automation-toolkit/blob/main/docs/verification/2026-10-07/README.md)
- [공개 샘플 TAP 출력](evidence/2026-10-07/meal-workspace.tap)

툴킷의 초기 설치에는 상속된 pip 설치 경로로 인한 환경 문제가 있었으며, 수정 후 전용 venv에서 재실행했습니다. 세부 경과는 툴킷 기록에 남겼습니다. 이번 로컬 실행을 원격 CI 성공이라고 표시하지 않습니다.

## 새로 추가한 학습 실습

2026-10-07 AI 에이전트가 작성·실행했습니다. Windows / Node.js 26.5.0, 외부 패키지·자격증명 없이 실행했습니다.

| 실행 | 관찰 결과 | 종료 코드 |
| --- | --- | --- |
| node labs/loopback-network/run.cjs | 정상 HTTP 200, 중지 후 ECONNREFUSED, 같은 루프백 포트 재시작 후 200: 3개 시나리오 통과 | 0 |
| node labs/asset-account-validation/run.cjs | 중복 자산 ID·퇴직자 활성 계정·정상 입력: 합성 사례 3개 통과 | 0 |

[실습 문서](../labs/README.md) · [출력 로그](../labs/evidence/execution.log)

작업 프로세스의 루프백 리스너와 임시 합성 파일만 사용합니다. 실제 DNS·VLAN·라우팅·SaaS 관리자 기능 또는 지원자의 독립 수행을 검증하지 않습니다.

## 보존하는 과거 기록

| 시점 | 대상 | 기존 공개 문서에 남은 기록 | 한계 |
| --- | --- | --- | --- |
| 2026-07-28 | 비공개 우리 가계부 | CI #73 / 3c753c9, 합성 데이터 DB 암호화 백업·복원 단계 포함 서버 작업 성공 | 이번에 원본 CI를 재검증하지 않음. 현재 가용성·실사용 데이터 복구·RTO/RPO 아님 |
| 2026-09-23 | auto-menu 원본 앱 | 로직 테스트 38개, production build 통과 기록 | 이번 작업에서 원본 앱을 재실행하지 않음 |
| 2026-09-23 | meal-workspace 샘플 | Node 24.21.0 기록: 파일 1개, 내부 assertion 31개 | 원본 앱 전체·브라우저 E2E 검증 아님 |
| 2026-09-23 | 자동화 툴킷 | pytest 132개 통과 기록 | 이번 재실행과 별도 시점의 기록 |
| 2026-09-23 | EvidenceDesk | 테스트 11개 통과 기록 | 보조 프로젝트. 이번 재실행 없음, 실제 OpenAI·Docker 미검증 |

[과거 샘플 REPL 기록](../samples/meal-workspace/TEST-RESULTS.txt) · [과거 Node 24 기록](../samples/meal-workspace/NODE24-TEST-RESULTS.txt)

## 해석 기준

- 실무 사례는 이력서에 기재한 경험을 문서화한 것이며, 공개 운영 로그로 독립 검증한 성과가 아닙니다.
- 소스에 구현된 처리와 테스트로 확인한 처리를 구분합니다.
- 테스트 파일 수, assertion 수, pytest 테스트 수를 합산해 성과처럼 표시하지 않습니다.
- 배포 큐 등록은 서비스 정상 응답 확인과 다릅니다.
- AI가 작성·실행한 신규 실습을 지원자 본인의 직접 수행 경력으로 바꾸어 쓰지 않습니다.
- 실제 운영 주소·IP·키·계정·금융 데이터·고객 정보는 공개하지 않습니다.

[포트폴리오로 돌아가기](../README.md)
