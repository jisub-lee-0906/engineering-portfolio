# 이지섭 | IT 운영 · 서비스 배포·검증 포트폴리오

IT 운영 실무 **10개월**: 공공기관 보안 운영·PC 유지보수 7개월, 학교 네트워크 개선사업 3개월의 경험이 있습니다. 시스템 운영·네트워크 유지보수를 중심으로 지원하며, 클라우드 인프라와 서비스 배포·자동화로 역량을 넓히고 있습니다.

이 저장소는 **프로젝트 개요와 공개 가능한 소형 코드 샘플**을 모은 포트폴리오입니다. 아래 프로젝트 경험은 IT 직무 경력 10개월과 구분합니다.

## 채용 검토 가이드

| 확인할 역량 | 관련 경험·자료 | 공개 범위 |
| --- | --- | --- |
| IT 운영·네트워크 유지보수 | 아래 실무 경험 및 DDNS 접속 구성 경험 | 업무 범위 설명, 운영 주소·포트 비공개 |
| 서비스 배포·복구·검증 구성 | our-ledger의 CI, Docker 빌드, 백업·복원 구성 | 설계·구현 개요, 원본 비공개 |
| 저장 데이터 검증 | [meal-workspace 코드·합성 테스트](samples/meal-workspace/) | 원본 일부를 분리·변형한 공개 샘플 |
| 반복 작업 자동화·오류 처리 | [Python·FFmpeg 오디오 후처리](https://github.com/jisub-lee-0906/comfyui-game-asset-workflows/blob/main/audio_bgm_with_sfx/scripts/finalize_audio.py) | 공개 구현, 모든 입력의 처리 성공을 보증하지 않음 |

실무 경험 → 프로젝트 구조 → 공개 코드·검증 기록 순서로 확인할 수 있습니다. 구현·테스트 구성과 실제 실행 결과를 구분하며, 측정하지 않은 성능이나 대규모 운영 성과는 기재하지 않습니다.

---

# Engineering Portfolio

운영 실무 경험을 바탕으로 서비스 개발·배포·검증을 연결합니다.
이 저장소는 **프로젝트 개요와 공개 가능한 소형 코드 샘플**을 모은 포트폴리오입니다. 아래 개인 개발 사례는 직무 경력과 구분해 소개합니다.

## 공개 코드 바로 보기

- [저장 데이터 검증 코드·테스트](samples/meal-workspace/): auto-menu의 일부 검증 로직을 2026-09-15에 추출·변형하고 합성 테스트를 추가한 샘플입니다.
- [ComfyUI Game Asset Workflows](https://github.com/jisub-lee-0906/comfyui-game-asset-workflows) · [오디오 후처리 구현](https://github.com/jisub-lee-0906/comfyui-game-asset-workflows/blob/main/audio_bgm_with_sfx/scripts/finalize_audio.py)

검증 샘플은 ES2023+ REPL에서 31개 테스트를 통과했습니다. Node 모듈 로딩·CI·원본 앱 실행은 검증하지 않았으며, 과거 운영 성과를 증명하는 자료는 아닙니다. 자세한 범위는 [검증 기록](samples/meal-workspace/TEST-RESULTS.txt)을 참고해 주세요.

our-ledger와 auto-menu의 원본 및 커밋 이력은 운영 정보와 데이터셋 보호를 위해 비공개로 유지합니다.

## 실무 경험

- **JB Systems | 2026.01–2026.07:** 직원으로 근무하며 공공기관 유지보수 업무에서 보안 운영 및 PC 유지보수를 담당했습니다.
- **DOJ | 2025.09–2025.11:** 프리랜서로 학교 네트워크 개선 단기 프로젝트에 참여해 네트워크 점검, 장비 설정, 장애 대응 및 문서화를 수행했습니다.

### 네트워크 구성 경험

서버와 PC가 서로 다른 공유기에 연결된 환경에서 필요한 포트만 개방하고, 숫자 IP 대신 도메인으로 접속하도록 TP-Link DDNS를 설정했습니다. 접속 주소, IP, 포트 번호 등 운영 정보는 공개하지 않습니다.

## 1. our-ledger | 오프라인 우선 가계부

- **문제:** 한 가구의 두 사용자가 원화(KRW) 가계부를 사용하며, 네트워크 연결이 불안정해도 기록을 이어가는 흐름을 다룹니다.
- **구조:** 서버는 Kotlin, Spring Boot, Spring Security, JPA, PostgreSQL, Flyway로 구성합니다. Android는 Jetpack Compose, Room, WorkManager를 활용한 오프라인 우선 구조입니다.
- **검증 구성:** CI 구성에는 서버 테스트, bootJar, Docker 빌드, 암호화 백업·복원 테스트와 Android 단위 테스트·lint·빌드, 에뮬레이터 UI 및 Room 마이그레이션 검증이 포함됩니다. 배포 시 서버와 Android 양쪽 구성을 함께 고려합니다.
- **범위:** 한 가구·두 사용자·KRW를 대상으로 하며, 대규모 운영이나 측정된 성능 개선을 주장하지 않습니다.

## 2. auto-menu | 브라우저 기반 식단 아이디어 편집기

- **문제:** 주간 식단 아이디어를 편집하고, 결과를 내보내거나 백업해 다시 활용하는 과정을 다룹니다.
- **구조:** Next.js, React, TypeScript 기반의 로컬 브라우저 앱입니다. 주간 CSV·PNG 내보내기와 JSON 백업을 제공하며, 서버 데이터베이스는 사용하지 않습니다.
- **입력 검증:** parseWorkspace는 백업의 버전, 객체 구조, boolean 필드, 이름 및 메뉴 배열의 제한을 검사해 입력 범위를 통제합니다.
- **공개 근거:** [저장 데이터 검증 샘플](samples/meal-workspace/)에서 구조·필드·길이 제한과 잘못된 입력에 대한 처리 로직 및 합성 테스트를 확인할 수 있습니다. 원본에서 분리·변형한 샘플입니다.
- **범위:** 브라우저 로컬 사용 범위의 편집 도구이며, 영양 적합성이나 알레르기 안전성을 인증하는 서비스가 아닙니다.

## 3. ComfyUI Game Asset Workflows | 오디오 후처리

- **문제:** 생성한 게임용 오디오를 후속 작업에 활용할 수 있도록 후처리하고, 출력 파일과 메타데이터를 관리하는 흐름을 다룹니다.
- **구조:** 공개 저장소의 [finalize_audio.py](https://github.com/jisub-lee-0906/comfyui-game-asset-workflows/blob/main/audio_bgm_with_sfx/scripts/finalize_audio.py)는 FFmpeg 기반 무음 트리밍, 크로스페이드, 2-pass 라우드니스 정규화와 true peak 제어를 구현합니다.
- **오류 처리:** true peak 재시도, 파일 충돌 처리, 실패 시 롤백과 메타데이터 기록을 포함합니다.
- **범위:** 공개된 구현을 소개하며, 모든 입력의 음질이나 처리 성공을 보증하지 않습니다.
