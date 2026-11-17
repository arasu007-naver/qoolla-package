# COMPONENTS

이 문서는 컴포넌트 이름 → 소스 파일 용어집입니다. 프롬프트에서 이름만 말하면 아래 경로의 파일을 바로 찾아 작업합니다. 항목 형식은 `- **이름**: `경로``이며, 경로는 소스 파일입니다.

## 진입점
- **main**: `src/index.ts` — package.json의 main/module/types가 가리키는 빌드 결과의 소스
- **index**: `src/index.ts` — 모든 공개 API를 재export하는 패키지 진입점

## 공개 API (export)
### 진입점 직접 정의 (src/index.ts)
- **safeJsonParse**: `src/index.ts` — `safeJsonParse<T>(value, fallback): T` — 문자열이면 JSON.parse, 객체면 그대로, 실패 시 fallback
- **SCRIPT_META_DEFAULTS**: `src/index.ts` — 메타 블록 actionType별 빈 기본값 목록
- **FallbackScriptUnit**: `src/index.ts` — 기본 스크립트용 유닛 입력 인터페이스 (image, timestamp?)
- **createFallbackRawScript**: `src/index.ts` — `createFallbackRawScript(unit): RawCut[]` — BACKGROUND 컷 + 빈 메타 블록 raw 스크립트 생성
- **createFallbackGuideScript**: `src/index.ts` — `createFallbackGuideScript(unit): GuideScript` — 기본 raw 스크립트를 파싱한 GuideScript
- **ReleaseScriptFallbackOptions**: `src/index.ts` — fallbackImage 옵션 인터페이스
- **isValidCut**: `src/index.ts` — `isValidCut(cut): boolean` — ADD 컷의 id 유효성 검사
- **parseRawDocument**: `src/index.ts` — `parseRawDocument(json): RawGuideScript` — raw JSON 배열을 메타/스토리로 추출하는 저수준 파서
- **parseDocument**: `src/index.ts` — `parseDocument(rawList): GuideScript` — 런타임/플레이어용 고수준 script JSON 파서
- **fetchAndParseReleaseScript**: `src/index.ts` — `fetchAndParseReleaseScript(url, fetchFn?, options?): Promise<GuideScript>` — releaseScriptUrl을 가져와 파싱
- **scriptMaker**: `src/index.ts` — `scriptMaker(url, customGetter?, options?): Promise<GuideScript>` — 하위 호환 스크립트 로더
- **liveClassScriptMaker**: `src/index.ts` — `liveClassScriptMaker(url, customGetter?, options?)` — scriptMaker 래퍼

### 타입 (`export type *` from types)
- **RawCut**: `src/types.ts` — 원본 컷
- **RawAction**: `src/types.ts` — RawCut 별칭
- **StoryEntry**: `src/types.ts` — 스토리 항목
- **PersistenceEntry**: `src/types.ts` — persistence 항목
- **RawGuideScript**: `src/types.ts` — parseRawDocument 결과 타입
- **CurtainEntry**: `src/types.ts` — curtain 항목
- **GuideScript**: `src/types.ts` — parseDocument 결과 타입

### 플레이어 (`export *` from player)
- **CutStep**: `src/player.ts` — 타입 `"prologue"|"main"|"epilogue"|"refresh"`
- **STEP_ORDER**: `src/player.ts` — 단계 순서 상수
- **GuideTarget**: `src/player.ts` — 인터페이스
- **PlayerState**: `src/player.ts` — 인터페이스
- **ScriptPlayerCallbacks**: `src/player.ts` — 플레이어 콜백 인터페이스
- **defaultSleep**: `src/player.ts` — `defaultSleep(ms): Promise<void>`
- **getLeaderIdForCut**: `src/player.ts` — `getLeaderIdForCut(cut): string|null`
- **findNearestCleanBefore**: `src/player.ts` — `findNearestCleanBefore(cuts, targetIdx): number`
- **fastforward**: `src/player.ts` — 컷을 빠르게 앞으로 감기
- **forwardToPoint**: `src/player.ts` — fastforward 별칭
- **playToPoint**: `src/player.ts` — 지정 지점까지 재생
- **runNext**: `src/player.ts` — 다음 컷 실행
- **runAt**: `src/player.ts` — 지정 인덱스 컷 실행

### 메시지 핸들러 (`export *` from message-handler)
- **PlatformType**: `src/message-handler.ts` — 타입 `"desktop"|"mobile"`
- **isMobileDevice**: `src/message-handler.ts` — `isMobileDevice(): boolean`
- **extractGuideFromMessage**: `src/message-handler.ts` — `extractGuideFromMessage(data): Record|null`
- **LiveClassCanvasRef**: `src/message-handler.ts` — 인터페이스
- **LiveClassMessageContext**: `src/message-handler.ts` — 인터페이스
- **LiveMessageResult**: `src/message-handler.ts` — 인터페이스
- **handleLiveClassMessage**: `src/message-handler.ts` — 실황수업 메시지 처리 (async)
- **dispatchLiveClassMessage**: `src/message-handler.ts` — handleLiveClassMessage 별칭

### 과목/단원 (`export *` from subjects)
- **MathSubjectKey**: `src/subjects.ts` — 타입
- **ChapterInfo**: `src/subjects.ts` — 인터페이스
- **MathSubject**: `src/subjects.ts` — 인터페이스
- **MathMajor**: `src/subjects.ts` — 인터페이스
- **ChapterTreeItem**: `src/subjects.ts` — 인터페이스
- **ChapterTree**: `src/subjects.ts` — 인터페이스
- **MATH_SUBJECTS**: `src/subjects.ts` — 수학 과목 상수 목록
- **MATH_AGENDA**: `src/subjects.ts` — MATH_SUBJECTS 별칭
- **MATH_CHAPTERS**: `src/subjects.ts` — 단원 상수 목록
- **MATH_MAJORS**: `src/subjects.ts` — 계열 상수 목록
- **getMathSubjects**: `src/subjects.ts` — `getMathSubjects(): MathSubject[]`
- **getMathSubjectById**: `src/subjects.ts` — `getMathSubjectById(id): MathSubject|undefined`
- **getMathSubjectByValue**: `src/subjects.ts` — `getMathSubjectByValue(value): MathSubject|undefined`
- **getMathSubject**: `src/subjects.ts` — `getMathSubject(identifier): MathSubject|undefined`
- **getMathSubjectLabel**: `src/subjects.ts` — `getMathSubjectLabel(identifier, fallback?): string`
- **getMathChapters**: `src/subjects.ts` — `getMathChapters(subjectIdentifier?): ChapterInfo[]`
- **getMathChapterById**: `src/subjects.ts` — `getMathChapterById(chapterId): ChapterInfo|undefined`
- **getMathMajors**: `src/subjects.ts` — `getMathMajors(): MathMajor[]`
- **HIGHSCHOOL_MATH_SUBJECTS_URL**: `src/subjects.ts` — 고등 수학 과목 조회 URL 상수
- **HighSchoolMathSubject**: `src/subjects.ts` — 인터페이스
- **GetMathSubjectsByCurriculumOptions**: `src/subjects.ts` — 인터페이스
- **isUnsetCurriculumType**: `src/subjects.ts` — `isUnsetCurriculumType(type?): boolean`
- **resolveSubjectCurriculumType**: `src/subjects.ts` — `resolveSubjectCurriculumType(subj): string|null`
- **getMathSubjectsByCurriculum**: `src/subjects.ts` — 교육과정별 과목 조회 (async)
- **CHAPTERS_OF_SUBJECT_URL_PREFIX**: `src/subjects.ts` — URL 접두어 상수
- **CONCEPTS_IN_CHAPTER_URL_PREFIX**: `src/subjects.ts` — URL 접두어 상수
- **MathSubjectChapter**: `src/subjects.ts` — 인터페이스
- **MathConcept**: `src/subjects.ts` — 인터페이스
- **GetChaptersOfSubjectOptions**: `src/subjects.ts` — 인터페이스
- **GetConceptsInChapterOptions**: `src/subjects.ts` — 인터페이스
- **getChaptersOfSubject**: `src/subjects.ts` — 과목의 단원 조회 (async)
- **getConceptsInChapter**: `src/subjects.ts` — 단원의 개념 조회 (async)

## 내부 모듈
- **script JSON 파서**: `src/index.ts` — parseDocument / parseRawDocument / isValidCut
- **asArray**: `src/index.ts` — 내부 헬퍼(비배열 → 빈 배열, null 제거)
- **asRecord**: `src/index.ts` — 내부 헬퍼(비객체 → 빈 객체)
- **fallbackOrThrow**: `src/index.ts` — 내부 헬퍼(fallbackImage 있으면 기본 스크립트, 없으면 throw)
- **isMissingUrl**: `src/index.ts` — 내부 헬퍼(URL 누락 판정)
- **isEmptyScript**: `src/index.ts` — 내부 헬퍼(컷 없는 스크립트 판정)

## 빌드·테스트
- **build**: `build.js` — `npm run build`, tsc로 CJS(.js/.d.ts) 및 ESM(.mjs) 생성
- **tsconfig**: `tsconfig.json` — 컴파일 설정(src/**/* → dist)
- **package.json**: `package.json` — 패키지 메타, scripts

테스트: 이 저장소에는 테스트 파일/테스트 스크립트가 없습니다.
