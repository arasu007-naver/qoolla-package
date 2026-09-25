import type { RawCut, RawGuideScript, GuideScript } from "./types";
export type * from "./types";
export * from "./player";
export * from "./message-handler";
/**
 * 안전한 JSON 파서. 문자열이면 JSON.parse 시도, 이미 객체이면 그대로 반환, 실패 시 fallback 반환.
 */
export declare function safeJsonParse<T = any>(value: unknown, fallback: T): T;
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
 */
export declare function fetchAndParseReleaseScript(releaseScriptUrl: string, fetchFn?: (url: string) => Promise<unknown>): Promise<GuideScript>;
/**
 * 하위 호환용 scriptMaker (axios/fetch 기반)
 */
export declare function scriptMaker(scriptUrl: string, customGetter?: (url: string) => Promise<{
    data: RawCut[];
}>): Promise<GuideScript>;
/**
 * 하위 호환용 liveClassScriptMaker
 */
export declare function liveClassScriptMaker(releaseScriptUrl: string, customGetter?: (url: string) => Promise<{
    data: RawCut[];
}>): Promise<GuideScript | null>;
