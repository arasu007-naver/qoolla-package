import type { RawCut, RawGuideScript, GuideScript } from "./types";
export type * from "./types";
export * from "./player";
export * from "./message-handler";
export * from "./subjects";
/**
 * 안전한 JSON 파서. 문자열이면 JSON.parse 시도, 이미 객체이면 그대로 반환, 실패 시 fallback 반환.
 */
export declare function safeJsonParse<T = any>(value: unknown, fallback: T): T;
/**
 * 스크립트 메타 블록 actionType 과 비어 있을 때의 기본값.
 * 순서는 tutor-web 이 release 스크립트를 저장할 때의 순서를 따른다.
 */
export declare const SCRIPT_META_DEFAULTS: ReadonlyArray<readonly [string, () => unknown]>;
export interface FallbackScriptUnit {
    /** 배경으로 깔 유닛(문제/개념 등) 이미지 URL */
    image: string;
    /** 메타 블록 timestamp (기본값: Date.now()) */
    timestamp?: number;
}
/**
 * 스크립트가 준비되지 않은 유닛용 기본 raw 스크립트를 만든다.
 * - actionType=BACKGROUND 컷 1개 (content: {"image": url}, timestamp 0)
 * - 모든 메타 블록(PREPS, SYNCS, GROUPS ...)은 빈 값 ([] / {}) — null 은 캔버스에서
 *   `.filter` 등을 호출하다 터지므로 쓰지 않는다.
 * 그대로 releaseScriptUrl 로 업로드할 수 있는 형태다.
 */
export declare function createFallbackRawScript(unit: FallbackScriptUnit): RawCut[];
/**
 * 스크립트가 준비되지 않은 유닛을 바로 실황수업에 쓸 수 있도록 파싱된 GuideScript 로 만든다.
 * (createFallbackRawScript → parseDocument)
 */
export declare function createFallbackGuideScript(unit: FallbackScriptUnit): GuideScript;
export interface ReleaseScriptFallbackOptions {
    /**
     * URL 이 비었거나 요청/파싱이 실패하면 이 이미지를 배경으로 한 기본 스크립트를 반환한다.
     * 지정하지 않으면 기존처럼 에러를 던진다.
     */
    fallbackImage?: string | null;
}
/**
 * Cut 유효성 검사 규칙 (topic-portrait-live 표준):
 * - actionType 이 "ADD" 인 경우 obj.id 또는 content 내의 id 가 존재하고 빈 문자열이나 "undefined" 가 아니어야 유효함.
 * - 그 외 actionType 은 유효한 컷으로 간주.
 */
export declare function isValidCut(cutOrAction: RawCut | unknown): boolean;
/**
 * raw JSON 배열로부터 메타데이터 및 스토리 시퀀스를 추출하는 저수준 파서 (topic-portrait-live 표준).
 */
export declare function parseRawDocument(jsonDoc: RawCut[] | unknown[]): RawGuideScript;
/**
 * 런타임/플레이어용 고수준 파서 (GuideScript 반환).
 * ADD / MODIFY / CLEAN_SCENE / CLEAN / POPUP / MEMO / BACKGROUND / MAGNIFY 를 정제하여 contents 로 구성.
 */
export declare function parseDocument(rawList: RawCut[] | unknown[]): GuideScript;
/**
 * 원격 releaseScriptUrl 또는 scriptUrl 을 가져와 표준 GuideScript 로 파싱하는 공용 함수.
 * 캐시 방지를 위해 `ts` 타임스탬프 쿼리를 자동 부착합니다.
 * options.fallbackImage 를 주면 URL 누락/요청 실패/빈 스크립트일 때 기본 스크립트를 반환합니다.
 */
export declare function fetchAndParseReleaseScript(releaseScriptUrl: string | null | undefined, fetchFn?: (url: string) => Promise<unknown>, options?: ReleaseScriptFallbackOptions): Promise<GuideScript>;
/**
 * 하위 호환용 scriptMaker (axios/fetch 기반)
 * options.fallbackImage 를 주면 URL 누락/요청 실패/빈 스크립트일 때 기본 스크립트를 반환합니다.
 */
export declare function scriptMaker(scriptUrl: string | null | undefined, customGetter?: (url: string) => Promise<{
    data: RawCut[];
}>, options?: ReleaseScriptFallbackOptions): Promise<GuideScript>;
/**
 * 하위 호환용 liveClassScriptMaker
 */
export declare function liveClassScriptMaker(releaseScriptUrl: string | null | undefined, customGetter?: (url: string) => Promise<{
    data: RawCut[];
}>, options?: ReleaseScriptFallbackOptions): Promise<GuideScript | null>;
