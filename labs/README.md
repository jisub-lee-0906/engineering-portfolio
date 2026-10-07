# IT 운영 미니 실습

이 디렉터리는 **프로덕션 경력 사례가 아닌 로컬 교육용 데모** 두 개를 담습니다. 코드와 문서는 AI 에이전트가 작성하고 지정된 로컬 Node.js 런타임으로 실행했습니다. 결과는 사용자의 기술 검증, 실무 수행, 재직 또는 고용 경력을 증명하지 않습니다.

## 구성

- [루프백 네트워크 실습](loopback-network/README.md): 루프백 HTTP 서비스의 정상, 중지, 재시작 복구 확인
- [합성 자산·계정 검증](asset-account-validation/README.md): 합성 CSV/JSON의 자산 및 계정 생명주기 규칙 검증
- [실행 기록](evidence/execution.log): 실행 시각, 런타임 버전, 명령, 실제 출력, 종료 코드

## 로컬 흐름도

```text
[지정 Node.js 런타임]
          |
          +--> [127.0.0.1:<ephemeral> HTTP] --> 정상/중지/재시작 단언
          |
          +--> [합성 CSV + JSON 임시 파일] --> 규칙 검증 --> 임시 파일 삭제
```

## 재현 명령

Node.js 22 이상을 설치한 환경을 사용합니다. 이번 실행은 Windows / Node.js 26.5.0에서 확인했습니다.

`labs` 디렉터리에서 실행합니다.

```powershell
node .\loopback-network\run.cjs
node .\asset-account-validation\run.cjs
```

두 스크립트는 예상과 다른 결과가 나오면 0이 아닌 종료 코드를 설정합니다. 외부 패키지, 자격 증명, 외부 네트워크, 외부 대상 IP, 실제 SaaS 관리 API를 사용하지 않습니다.
