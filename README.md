구축된 공용 모듈(@qoolla/script-parser 및 각 프로젝트의 유틸리티)의 사용법과 프로젝트별 적용 가이드입니다.

1. 프로젝트별 Import 경로
모든 프로젝트는 기존 유틸리티 경로 또는 **공용 패키지(@qoolla/script-parser)**를 통해 동일한 함수와 타입을 즉시 사용할 수 있습니다.

프로젝트	권장 Import 경로
student-ai-support	import { ... } from "@/services/utils";
qoolla/tutor-web	import { ... } from "@/services/utils";
go3math-class-nextjs-trpc-web	import { ... } from "@/services/utils";
viewer	import { ... } from "@/services/utils";
qoolla-student-app (RN)	import { ... } from "@/utils/script-maker";
qoolla-student2-app (RN)	import { ... } from "@/utils/script-maker";
패키지 직접 참조 시	import { ... } from "@qoolla/script-parser";
2. 주요 기능별 사용 예제
① 스크립트 URL 다운로드 및 파싱 (fetchAndParseReleaseScript / scriptMaker)
releaseScriptUrl로부터 JSON을 안전하게 받아 캔버스 재생 규격에 맞게 파싱합니다.

typescript
import { fetchAndParseReleaseScript } from "@/services/utils";
// 1. releaseScriptUrl 파싱
const scriptData = await fetchAndParseReleaseScript(currentScript.releaseScriptUrl);
// 2. 파싱된 데이터 적용
setStudySequences(scriptData.contents);
setPrepMembers(scriptData.prepMembers);
setSyncMembers(scriptData.syncMembers);
setBackgroundCut(scriptData.backgroundCut);
setCurtains(scriptData.curtains);
② 실시간 라이브 메시지 수신 및 자동 분기 처리 (handleLiveClassMessage)
TopicLiveClassView나 hotlineClassViewerView의 GraphQL Subscription onData에서 수신된 메시지를 데스크탑/모바일 환경에 맞춰 한 줄로 디스패치합니다.

typescript
import { useSubscription } from "@apollo/client/react";
import { handleLiveClassMessage, isMobileDevice } from "@/services/utils";
useSubscription(ONLINE_TOPIC_CLASS_MESSAGE_ADDED, {
  variables: { topicId },
  onData: async ({ data }) => {
    await handleLiveClassMessage(
      data, // 수신된 raw message
      {
        // 1. 상태 및 컨텍스트
        currentScript,
        scriptList,
        canvas: scriptDrivenClassCanvasRef.current,
        // 2. UI 제어 콜백
        closeBoardMemo: () => closeBoardMemo(),
        closeModalHandler: () => closeModalHandler(),
        setCutSequence: (step) => setCutSequence(step),
        setLastGuide: (guide) => setLastGuide(guide),
        setCurrentScript: (script) => setCurrentScript(script),
        setCurrentUnit: (unit) => setCurrentUnit(unit),
        setPopupUrl: (url) => setPopupUrl(url),
        setShowPopupModal: (show) => setShowPopupModal(show),
        addToast: (msg, type) => addToast(msg, type),
        downloadScript: () => downloadScript(),
        // 3. 지점 재생 콜백 (동보기 지연 포함)
        playToPoint: async (guide) => {
          await playToPoint(studySequences, guide, lastGuide, {
            runCut: async (cut) => runCut(cut),
            runPrologue: async (cut, leaderId) => runPrologue(cut),
            runEpilogue: async (cut, leaderId) => runEpilogue(cut),
            hasPrologue: (leaderId) => hasPrologue(leaderId),
            hasEpilogue: (leaderId) => hasEpilogue(leaderId),
          });
        },
      },
      {
        // 데스크탑 / 모바일 지정 (생략 시 User-Agent 자동 감지)
        platform: isMobileDevice() ? "mobile" : "desktop",
      }
    );
  },
  onError: (err) => console.error("Subscription Error:", err),
});
③ 스크립트 재생 및 이전 지점 복원 (playToPoint / fastforward)
이전 재생 지점부터 지정된 지점까지 이어 재생하거나, 가장 최근의 CLEAN / BACKGROUND부터 고속 재생합니다 (돋보기 효과 진입점 await sleep(600) 자동 적용).

typescript
import { playToPoint, fastforward } from "@/services/utils";
// 1. 이전 진행 지점(lastGuide)부터 목표 지점(targetGuide)까지 순차 재생
await playToPoint(
  studySequences, // 컷 목록
  targetGuide,    // 목표 위치 { studyIdx, step, ... }
  lastGuide,      // 마지막 진행 위치
  {
    runCut: async (cut, info) => await runCut(cut),
    runPrologue: async (cut, leaderId, info) => await runPrologue(cut),
    runEpilogue: async (cut, leaderId, info) => await runEpilogue(cut),
    hasPrologue: (leaderId, cut) => hasPrologue(leaderId),
    hasEpilogue: (leaderId, cut) => hasEpilogue(leaderId),
    runMagnifier: async ({ idx, steps }) => {
      // 돋보기 재생 시 600ms 지연 자동 처리
    },
    onStateChange: (state) => {
      setCurrentIdx(state.currentIdx);
      setCutSequence(state.cutSequence);
    }
  }
);
// 2. 특정 시점부터의 고속 되감기/재생 (fastforward)
await fastforward(studySequences, targetGuide, callbacks);
④ 스텝 단위 진행 및 특정 위치 실행 (runNext / runAt)
강사 화면 또는 학생 뷰어에서 prologue → main → epilogue 상태 머신에 따라 다음 스텝을 진행합니다.

typescript
import { runNext, runAt } from "@/services/utils";
// 다음 단계 진행 (prologue -> main -> epilogue -> next cut)
const nextState = await runNext(
  studySequences,
  currentIdx,
  cutSequence,
  callbacks
);
// 특정 인덱스 및 특정 단계 직접 실행
const targetState = await runAt(
  studySequences,
  targetCutIdx,
  "main", // 'prologue' | 'main' | 'epilogue'
  callbacks
);
3. 패키지 의존성 추가 방법 (GitHub 직접 참조)

로컬 상대경로(`file:../...`) 대신 GitHub 리포지토리를 직접 참조합니다.
패키지 이름(key)이 동일하므로 **기존 import 문은 변경할 필요가 없습니다.**

각 프로젝트의 `package.json`:

```json
{
  "dependencies": {
    "@qoolla/script-parser": "github:arasu007-naver/qoolla-package#v1.0.0"
  }
}
```

설치:

```bash
npm install
```

주의사항

- **반드시 태그(`#v1.0.0`)로 고정하세요.** `#main`으로 두면 소비 프로젝트가 언제
  업데이트될지 예측할 수 없고, 갱신하려면 `npm update @qoolla/script-parser`를
  별도로 실행해야 합니다.
- `dist/`가 리포지토리에 커밋되어 있으므로 설치 시 별도 빌드가 필요 없습니다.
  따라서 `package.json`에 `prepare` 스크립트를 추가하면 안 됩니다
  (`build.js`는 외부 경로의 `tsc`에 의존하므로 소비자 환경에서 실패합니다).
- 리포지토리가 public이라 SSH 키 없이도 설치됩니다. `package-lock.json`에
  `git+ssh://`로 기록되지만 npm이 HTTPS 타르볼로 폴백하므로 CI에서도 동작합니다.
- 버전 갱신 절차: `src` 수정 → `npm run build` → `dist` 포함 커밋 →
  `package.json`의 `version` 올림 → 새 태그 푸시 → 소비 프로젝트의 `#vX.Y.Z` 수정.
