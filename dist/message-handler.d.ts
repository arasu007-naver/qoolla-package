import type { CutStep, GuideTarget } from "./player";
export type PlatformType = "desktop" | "mobile";
export declare function isMobileDevice(): boolean;
/**
 * 수신된 다양한 형식의 라이브 메시지(GraphQL Subscription, WebSocket, JSON 문자열, 객체)로부터 guide 객체를 추출합니다.
 */
export declare function extractGuideFromMessage(data: unknown): Record<string, any> | null;
export interface LiveClassCanvasRef {
    magnifyObj?: (targetId: string | number) => Promise<void> | void;
    magnifyArea?: (area: Record<string, unknown>, options?: {
        isMobile?: boolean;
    }) => Promise<void> | void;
    zoomObject?: (targetId: string | number) => Promise<void> | void;
    removeObjectWithId?: (id: string | number) => void;
    selectObject?: (target: {
        id: string | number;
    }) => void;
    selectObjectWithId?: (id: string | number) => void;
    onAnimationCommand?: (animation: unknown) => void;
    clearCanvas?: () => void;
    withoutFurtherAdo?: () => void;
    removeFlyingObjs?: () => void;
    importObjectFromClipboard?: (obj: unknown) => void;
    syncCanvasObjects?: (objects: unknown[], removeExtra?: boolean) => void;
    takeSnapShotOfCanvas?: () => Promise<string | void> | string | void;
    [key: string]: unknown;
}
export interface LiveClassMessageContext {
    /** 플랫폼 지정 ("desktop" | "mobile", 기본값: 자동 감지) */
    platform?: PlatformType;
    /** 현재 활성화된 스크립트 */
    currentScript?: {
        id: number | string;
        [key: string]: unknown;
    } | null;
    /** 스크립트 목록 (단위/유닛 목록) */
    scriptList?: Array<{
        scripts: Array<{
            id: number | string;
            [key: string]: unknown;
        }>;
        [key: string]: unknown;
    }>;
    /** 캔버스 제어 핸들러 또는 ref */
    canvas?: LiveClassCanvasRef | null;
    /** 상태 및 모달 제어 콜백 */
    closeBoardMemo?: () => void;
    closeModalHandler?: () => void;
    setCutSequence?: (step: CutStep) => void;
    setLastGuide?: (guide: unknown) => void;
    setCurrentScript?: (script: any) => void;
    setCurrentUnit?: (unit: any) => void;
    setPopupUrl?: (url: string) => void;
    setShowPopupModal?: (show: boolean) => void;
    setPrepMembers?: (members: unknown) => void;
    setSyncMembers?: (members: unknown) => void;
    setGroupMembers?: (members: unknown) => void;
    addToast?: (message: string, type?: "info" | "warning" | "error" | "success") => void;
    downloadScript?: () => Promise<void> | void;
    playToPoint?: (guide: GuideTarget) => Promise<void> | void;
    takeSnapShotOfCanvas?: () => Promise<string | void> | string | void;
    sleepFn?: (ms: number) => Promise<void>;
}
export interface LiveMessageResult {
    handled: boolean;
    action?: string;
    guide?: Record<string, any> | null;
    isMobile?: boolean;
}
/**
 * 라이브 강의 실시간 수신 메시지(TopicLiveClass, HotlineClass 등)를 분기하여 실행하는 공용 디스패처.
 * 데스크탑과 모바일 환경을 구별하여 좌표/모달/타이밍 처리를 수행합니다.
 * (기준: TopicLiveClassView.tsx)
 */
export declare function handleLiveClassMessage(data: unknown, context: LiveClassMessageContext, options?: {
    platform?: PlatformType;
}): Promise<LiveMessageResult>;
/** 하위 호환용 dispatchLiveClassMessage 별칭 */
export declare const dispatchLiveClassMessage: typeof handleLiveClassMessage;
