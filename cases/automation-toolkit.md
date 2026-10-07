# 자동화 툴킷 | 산출물 반영의 오류·무결성 관리

## 프로젝트 요약
- **원본 프로젝트:** vn-automation-toolkit
- **개발 방식:** 이지섭과 AI 도구의 협업 개발.
- **용도:** 게임 제작용 후보 산출물을 검수하고 프로젝트에 반영하는 반복 작업의 자동화.
- **채용 관점:** 게임 장르보다 경로 제한, 파일 교체, 실패 처리, 상태 추적과 회귀 검증을 중심으로 소개합니다.
- **검토 기준일:** 2026-09-23. [원본 저장소](https://github.com/jisub-lee-0906/vn-automation-toolkit)는 공개되어 있습니다. 아래 내용은 소스 검토와 해당 날짜의 테스트 실행 기록을 구분해 적었습니다.

## 이번 재현 점검 | 2026-10-07

AI 에이전트가 공개 소스 커밋 `68be44ed8ff9b7e3c4c1be3d5207f44f2fe52ca7`을 별도 복제해 Windows / Python 3.13.12 전용 venv에서 실행했습니다.

- 전체 테스트: **132 passed**, 종료 0
- 경로·중복·백업·파일 보존 선택 테스트: **5 passed**, 종료 0. 전체 모음에 포함되며 합산하지 않습니다.
- CLI 도움말과 버전 확인: 종료 0, 버전 0.1.0

[재현 명령](https://github.com/jisub-lee-0906/vn-automation-toolkit/blob/main/docs/operations-walkthrough.md) · [실행 환경·stdout·제한](https://github.com/jisub-lee-0906/vn-automation-toolkit/blob/main/docs/verification/2026-10-07/README.md)

이번 결과는 도구 로직의 로컬 검증입니다. 지원자의 독립적 구현·직접 재현을 증명하지 않습니다. 원자적 교체 호출은 소스에서 확인하며, 전원 차단·디스크 장애를 주입해 검증하지는 않았습니다.

## 어떤 문제를 다루나
자동 생성된 파일을 바로 최종 폴더에 복사하면 잘못된 경로에 쓰기, 중복 ID, 의도치 않은 덮어쓰기, 파일과 관리 상태의 불일치가 생길 수 있습니다. 구현은 후보와 반영 단계를 나누고, 반영 전 조건을 검사합니다.

```text
후보 산출물
  → 승인 플래그 / QA 기록 / 경로 / ID / 덮어쓰기 조건 검사
  → 임시 복사 → 원자적 파일 교체
  → manifest·provenance·lifecycle 상태 갱신
```

## 실제 구현과 테스트
| 확인한 항목 | 근거 파일 | 확인 수준 |
| --- | --- | --- |
| 승인 플래그·통과 QA·경로 포함 여부·중복 ID·덮어쓰기 조건 검사 | tools/promote_asset_candidate.py | 구현 확인 |
| 임시 복사 후 os.replace, 선택적 백업과 상태 기록 | tools/promote_asset_candidate.py | 구현 확인 |
| 승인 없음·QA 없음/실패·반영 상태 동기화 검사 | tests/test_promote_asset_candidate.py | 테스트 포함 |
| 프로젝트 선택 실패 시 중단, 프로젝트별 이름공간, 경로 이탈 거부 검사 | tests/test_cross_game_portability_hardening.py | 테스트 포함 |

2026-09-23 격리 pytest 환경에서 `python -m pytest -q`를 실행한 기록은 **132 passed**입니다. 이 결과는 당시 테스트 모음의 통과이며 Ren'Py, ComfyUI 서버, Telegram, GPU 또는 실제 asset generation을 실행했다는 뜻은 아닙니다.

## 공개 코드로 함께 볼 수 있는 관련 사례
[ComfyUI workflow execution tooling](https://github.com/jisub-lee-0906/comfyui-game-asset-workflows/blob/main/scripts/workflow_pack.py)은 별도 프로젝트의 공개 코드입니다. canonical SHA-256, 허용된 필드 수정, 출력 파일 검증과 QA 기록을 이용한 반영 과정을 볼 수 있습니다.

## 면접에서 확인할 핵심
- 프로젝트 밖 경로와 의도치 않은 덮어쓰기를 막는 검사
- 임시 파일과 원자적 교체를 사용하는 이유
- 파일 반영과 manifest 상태를 일치시키는 방식
- 승인 플래그·QA 상태와 실제 사람의 승인·산출물 품질을 구분하는 이유

## 검증 범위
2026-09-23 기록과 2026-10-07 재실행은 각각 Python 테스트 132개 통과를 확인한 별도 시점의 결과입니다. 모든 실패 상황의 복구, 실제 사람의 승인, 산출물의 시각적 품질, Ren'Py·ComfyUI·Telegram·GPU 환경 동작은 확인하지 않았습니다. 승인 플래그만으로 독립적인 사람의 승인을 입증하지 않습니다. 운영 기록·로컬 경로·원본 에셋은 공개하지 않습니다.

[전체 포트폴리오로 돌아가기](../README.md)
