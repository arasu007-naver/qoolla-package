import type { RawCut } from "./types";
export type CutStep = "prologue" | "main" | "epilogue" | "refresh";
export declare const STEP_ORDER: readonly CutStep[];
export interface GuideTarget {
    studyIdx?: number;
    step?: CutStep | string;
    mode?: string;
    action?: string;
    sync?: boolean;
    [key: string]: unknown;
}
export interface PlayerState {
    currentIdx: number;
    cutSequence: CutStep;
    lastGuide?: GuideTarget | null;
}
export interface ScriptPlayerCallbacks<T = RawCut> {
    /** 메인 컷 실행 핸들러 */
    runCut: (cut: T, ctx?: {
        idx: number;
        step: CutStep;
    }) => Promise<void> | void;
    /** 프롤로그(preps/pro) 실행 핸들러 */
    runPrologue?: (cut: T, leaderId: string | null, ctx?: {
        idx: number;
    }) => Promise<void> | void;
    /** 에필로그(groups/epi) 실행 핸들러 */
    runEpilogue?: (cut: T, leaderId: string | null, ctx?: {
        idx: number;
    }) => Promise<void> | void;
    /** 돋보기(MAGNIFY) 또는 pending magnifier 실행 핸들러 */
    runMagnifier?: (ctx: {
        idx: number;
        steps: CutStep[];
    }) => Promise<void> | void;
    /** 프롤로그 존재 여부 확인 */
    hasPrologue?: (leaderId: string | null, cut?: T) => boolean;
    /** 에필로그 존재 여부 확인 */
    hasEpilogue?: (leaderId: string | null, cut?: T) => boolean;
    /** 커튼/배경 지속성 객체 복원 핸들러 */
    runCurtains?: (cutIdx: number) => Promise<void> | void;
    /** 동기화 객체 수신 시 비파괴적 추가 핸들러 */
    syncCanvasObjects?: (objects: unknown[]) => Promise<void> | void;
    /** 커서 및 단계 상태 변경 리스너 */
    onStateChange?: (state: PlayerState) => void;
    /** 슬립 함수 (기본값: defaultSleep) */
    sleepFn?: (ms: number) => Promise<void>;
}
export declare function defaultSleep(ms: number): Promise<void>;
/**
 * 컷 객체로부터 리더 오브젝트 ID(leaderId)를 추출합니다.
 */
export declare function getLeaderIdForCut(cut: unknown): string | null;
/**
 * targetIdx 직전의 가장 최근 CLEAN, CLEAN_SCENE 또는 BACKGROUND 액션 인덱스를 찾습니다.
 */
export declare function findNearestCleanBefore(cuts: unknown[], targetIdx: number): number;
/**
 * 최근/이전의 actionType='BACKGROUND' 또는 'CLEAN'/'CLEAN_SCENE'부터 목표 targetGuide의 studyIdx, step까지 빠르게 실행합니다.
 * 돋보기(MAGNIFY) 효과 플레이 시 각 진입 지점에서 await sleep(600)을 적용합니다.
 * (기준: topic-portrait-live/PageClient.tsx)
 */
export declare function fastforward<T = RawCut>(cutContents: T[], targetGuide: GuideTarget, callbacks: ScriptPlayerCallbacks<T>): Promise<PlayerState>;
/** 하위 호환용 forwardToPoint 별칭 */
export declare const forwardToPoint: typeof fastforward;
/**
 * 이전에 플레이되었던 지점(lastGuide)부터 지정 지점(targetGuide)까지 순차 재생하고,
 * 역방향/새로고침/동기화 시 fastforward 로 분기합니다.
 * (기준: student-ai-support/TopicLiveClassView.tsx)
 */
export declare function playToPoint<T = RawCut>(cutContents: T[], targetGuide: GuideTarget, lastGuide: GuideTarget | null | undefined, callbacks: ScriptPlayerCallbacks<T>): Promise<PlayerState>;
/**
 * 다음 스텝 또는 다음 컷으로 진행합니다 (prologue -> main -> epilogue -> next cut prologue/main).
 * (기준: topic-portrait-live/PageClient.tsx)
 */
export declare function runNext<T = RawCut>(cutContents: T[], currentIdx: number, currentStep: CutStep, callbacks: ScriptPlayerCallbacks<T>): Promise<PlayerState & {
    done?: boolean;
}>;
/**
 * 특정 컷 인덱스와 지정 스텝(prologue/main/epilogue)을 단독 실행합니다.
 * (기준: topic-portrait-live/PageClient.tsx)
 */
export declare function runAt<T = RawCut>(cutContents: T[], targetIdx: number, targetStep: CutStep, callbacks: ScriptPlayerCallbacks<T>): Promise<PlayerState>;
