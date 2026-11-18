import type {
  RawCut,
  RawAction,
  StoryEntry,
  PersistenceEntry,
  RawGuideScript,
  CurtainEntry,
  GuideScript,
} from "./types";

import { isResetCut } from "./player";
export type * from "./types";
export * from "./player";
export * from "./message-handler";
export * from "./subjects";

/**
 * 안전한 JSON 파서. 문자열이면 JSON.parse 시도, 이미 객체이면 그대로 반환, 실패 시 fallback 반환.
 */
export function safeJsonParse<T = any>(value: unknown, fallback: T): T {
  if (value == null) return fallback;
  if (typeof value === "object") return value as unknown as T;
  if (typeof value !== "string") return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

/** 배열이 아니면(null, "null" 파싱 결과 등) 빈 배열로, null/undefined 항목은 제거. */
function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value.filter((it) => it !== null && it !== undefined) : [];
}

/** 일반 객체가 아니면(null, 배열 등) 빈 객체로. */
function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

/**
 * 스크립트 메타 블록 actionType 과 비어 있을 때의 기본값.
 * 순서는 tutor-web 이 release 스크립트를 저장할 때의 순서를 따른다.
 */
export const SCRIPT_META_DEFAULTS: ReadonlyArray<readonly [string, () => unknown]> = [
  ["ACT_SUBS", () => ({})],
  ["BACKGROUND_SUBS", () => []],
  ["ANIMATIONS", () => ({})],
  ["APPENDIX", () => ({})],
  ["PREPS", () => []],
  ["GROUPS", () => []],
  ["SYNCS", () => []],
  ["FADEOUTS", () => ({})],
  ["MEMO_SUBS", () => []],
];

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
export function createFallbackRawScript(unit: FallbackScriptUnit): RawCut[] {
  if (!unit || typeof unit.image !== "string" || unit.image.trim() === "") {
    throw new Error("createFallbackRawScript: unit.image 가 필요합니다.");
  }
  const ts = unit.timestamp ?? Date.now();
  const cuts: RawCut[] = [
    {
      timestamp: 0,
      actionType: "BACKGROUND",
      content: JSON.stringify({ image: unit.image }),
    },
  ];
  for (const [actionType, empty] of SCRIPT_META_DEFAULTS) {
    cuts.push({ timestamp: ts, actionType, content: JSON.stringify(empty()) });
  }
  return cuts;
}

/**
 * 스크립트가 준비되지 않은 유닛을 바로 실황수업에 쓸 수 있도록 파싱된 GuideScript 로 만든다.
 * (createFallbackRawScript → parseDocument)
 */
export function createFallbackGuideScript(unit: FallbackScriptUnit): GuideScript {
  return parseDocument(createFallbackRawScript(unit));
}

export interface ReleaseScriptFallbackOptions {
  /**
   * URL 이 비었거나 요청/파싱이 실패하면 이 이미지를 배경으로 한 기본 스크립트를 반환한다.
   * 지정하지 않으면 기존처럼 에러를 던진다.
   */
  fallbackImage?: string | null;
}

function fallbackOrThrow(error: unknown, options?: ReleaseScriptFallbackOptions): GuideScript {
  const image = options?.fallbackImage;
  if (typeof image === "string" && image.trim() !== "") {
    console.warn("스크립트를 불러오지 못해 기본(BACKGROUND) 스크립트로 대체합니다:", error);
    return createFallbackGuideScript({ image });
  }
  throw error;
}

/**
 * Cut 유효성 검사 규칙 (topic-portrait-live 표준):
 * - actionType 이 "ADD" 인 경우 obj.id 또는 content 내의 id 가 존재하고 빈 문자열이나 "undefined" 가 아니어야 유효함.
 * - 그 외 actionType 은 유효한 컷으로 간주.
 */
export function isValidCut(cutOrAction: RawCut | unknown): boolean {
  if (!cutOrAction || typeof cutOrAction !== "object") return false;
  const action = cutOrAction as RawCut;
  const actionType = String(action.actionType ?? "").toUpperCase();
  if (actionType === "ADD") {
    let objId: string | null = null;
    if (action.obj && typeof action.obj === "object" && action.obj.id != null) {
      objId = String(action.obj.id);
    } else if (action.content) {
      try {
        const parsed = typeof action.content === "string" ? JSON.parse(action.content) : action.content;
        if (parsed && typeof parsed === "object" && parsed.id != null) {
          objId = String(parsed.id);
        }
      } catch {
        objId = null;
      }
    }
    if (!objId || objId.trim() === "" || objId === "undefined" || objId === "null") {
      return false;
    }
  }
  return true;
}

/**
 * raw JSON 배열로부터 메타데이터 및 스토리 시퀀스를 추출하는 저수준 파서 (topic-portrait-live 표준).
 */
export function parseRawDocument(jsonDoc: RawCut[] | unknown[]): RawGuideScript {
  const guideScript: RawGuideScript = {
    contents: [],
    actSubs: {},
    backgroundSubs: {},
    animations: {},
    fadeOuts: {},
    appendix: {},
    epilogueMembers: [],
    backgroundCut: {},
    refreshPoints: [0],
    followMembers: [],
    prologueMembers: [],
    objectsPool: {},
    rawStory: [],
    scenes: [0],
    popups: [],
    story: [],
    memos: [],
    memoSubs: [],
    hiddenStory: [],
    commontList: {},
    persitence: [],
  };

  if (!Array.isArray(jsonDoc)) {
    return guideScript;
  }

  for (let i = 0; i < jsonDoc.length; i++) {
    const cut = jsonDoc[i] as RawCut;
    if (!cut || typeof cut !== "object") continue;

    const actionType = String(cut.actionType ?? "").toUpperCase();

    if (actionType === "BACKGROUND") {
      guideScript.rawStory.push({
        actionType: cut.actionType,
        seq: i,
        ts: cut.timestamp,
        objId: cut.timestamp,
      });
    } else if (actionType === "REMOVE") {
      const rObj = safeJsonParse<{ id?: string | number }>(cut.content, {});
      guideScript.rawStory.push({
        actionType: cut.actionType,
        seq: i,
        ts: cut.timestamp,
        objId: rObj?.id ?? cut.timestamp,
      });
    } else if (actionType === "MEMO") {
      guideScript.memos.push(cut);
      guideScript.rawStory.push({
        actionType: cut.actionType,
        seq: i,
        ts: cut.timestamp,
        objId: cut.timestamp,
      });
    } else if (actionType === "POPUP") {
      guideScript.popups.push(cut);
      guideScript.rawStory.push({
        actionType: cut.actionType,
        seq: i,
        ts: cut.timestamp,
        objId: cut.timestamp,
      });
    } else if (actionType === "MAGNIFY") {
      guideScript.rawStory.push({
        actionType: cut.actionType,
        seq: i,
        ts: cut.timestamp,
        objId: cut.timestamp,
      });
    } else if (actionType === "SCENE_SUBS" || actionType === "ACT_SUBS") {
      guideScript.actSubs = safeJsonParse<Record<string, unknown>>(cut.content, {});
      continue;
    } else if (actionType === "MEMO_SUBS") {
      const parsed = safeJsonParse<unknown[]>(cut.content, []);
      guideScript.memoSubs = Array.isArray(parsed)
        ? (parsed.filter((item) => item !== null && item !== undefined) as string[])
        : [];
      continue;
    } else if (actionType === "BACKGROUND_SUBS") {
      const tmp = safeJsonParse<unknown[]>(cut.content, []);
      guideScript.backgroundSubs = Array.isArray(tmp)
        ? (tmp.filter((item) => item !== null && item !== undefined) as string[])
        : [];
      continue;
    } else if (actionType === "FADEOUTS") {
      guideScript.fadeOuts = safeJsonParse<Record<string, unknown>>(cut.content, {});
      continue;
    } else if (actionType === "ANIMATIONS") {
      guideScript.animations = safeJsonParse<Record<string, unknown>>(cut.content, {});
      continue;
    } else if (actionType === "APPENDIX") {
      guideScript.appendix = safeJsonParse<Record<string, unknown>>(cut.content, {});
      continue;
    } else if (actionType === "GROUPS") {
      const groupMembers = safeJsonParse<unknown[]>(cut.content, []);
      guideScript.epilogueMembers = Array.isArray(groupMembers)
        ? (groupMembers.filter((item) => item !== null && item !== undefined) as string[])
        : [];
      continue;
    } else if (actionType === "PREPS") {
      const prevs = safeJsonParse<unknown[]>(cut.content, []);
      guideScript.prologueMembers = Array.isArray(prevs)
        ? (prevs.filter((item) => item !== null && item !== undefined) as string[])
        : [];
      continue;
    } else if (actionType === "SYNCS") {
      const follows = safeJsonParse<unknown[]>(cut.content, []);
      guideScript.followMembers = Array.isArray(follows)
        ? (follows.filter((item) => item !== null && item !== undefined) as string[])
        : [];
      continue;
    } else if (actionType === "ADD" || actionType === "MODIFY") {
      const obj = safeJsonParse<Record<string, unknown>>(cut.content, cut.obj ?? {});
      const k = obj?.id as string | number | undefined;

      if (
        actionType === "ADD" &&
        (!k || String(k).trim() === "" || String(k) === "undefined" || String(k) === "null")
      ) {
        continue;
      }

      if (typeof k === "string" && k.startsWith("comment")) {
        if (cut.text && cut.text.length > 0) {
          guideScript.commontList[k] = cut.text;
        }
      }

      if (k != null) {
        guideScript.objectsPool[String(k)] = obj;
      }

      guideScript.rawStory.push({
        actionType: cut.actionType,
        objId: k ?? cut.timestamp,
        seq: i,
        ts: cut.timestamp,
      });
    } else if (actionType === "CLEAN" || actionType === "CLEAN_SCENE" || actionType === "CLEAR") {
      guideScript.scenes.push(i);
      guideScript.rawStory.push({
        actionType: cut.actionType,
        seq: i,
        ts: cut.timestamp,
        objId: cut.timestamp,
      });
    }
  }

  // 그룹화: objId 별로 묶기
  const groups: Record<string, StoryEntry[]> = {};
  for (const item of guideScript.rawStory) {
    const key = String(item.objId);
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
  }

  const storyEntries: StoryEntry[] = [];
  const hiddenEntries: StoryEntry[] = [];

  for (const key of Object.keys(groups)) {
    const group = groups[key];
    const hasRemove = group.some((g) => String(g.actionType).toUpperCase() === "REMOVE");
    let maxSeq = group[0].seq;
    let minTs = group[0].ts;
    for (const g of group) {
      if (g.seq > maxSeq) maxSeq = g.seq;
      if (g.ts < minTs) minTs = g.ts;
    }
    const entry: StoryEntry = {
      objId: group[0].objId,
      seq: maxSeq,
      ts: minTs,
      actionType: group[0].actionType,
    };
    if (hasRemove) {
      hiddenEntries.push(entry);
    } else {
      storyEntries.push(entry);
    }
  }

  storyEntries.sort((a, b) => a.seq - b.seq);
  hiddenEntries.sort((a, b) => a.seq - b.seq);

  guideScript.story = storyEntries;
  guideScript.hiddenStory = hiddenEntries;

  const bgSubsList = Array.isArray(guideScript.backgroundSubs)
    ? (guideScript.backgroundSubs as string[])
    : [];

  const stackedBack: (string | number)[] = [];
  for (let j = 0; j < guideScript.story.length; j++) {
    const cut = guideScript.story[j];
    if (bgSubsList.includes(String(cut.objId))) {
      stackedBack.push(cut.objId);
    }
    const actType = String(cut.actionType ?? "").toUpperCase();
    if (actType === "CLEAN" || actType === "CLEAN_SCENE" || actType === "CLEAR") {
      guideScript.persitence.push({ seq: cut.seq, objs: [...stackedBack] });
    }
  }

  return guideScript;
}

/**
 * 런타임/플레이어용 고수준 파서 (GuideScript 반환).
 * ADD / MODIFY / CLEAN_SCENE / CLEAN / CLEAR / POPUP / MEMO / BACKGROUND / MAGNIFY 를 정제하여 contents 로 구성.
 */
export function parseDocument(rawList: RawCut[] | unknown[]): GuideScript {
  const guideScript: GuideScript = {
    contents: [],
    actSubs: {},
    backgroundSubs: [],
    animations: {},
    fadeOuts: {},
    appendix: {},
    groups: [],
    backgroundCut: {},
    refreshPoints: [0],
    syncMembers: [],
    prepMembers: [],
    canvasBackStuffs: {},
    curtains: [],
  };

  if (!Array.isArray(rawList)) return guideScript;

  let rawBksSubs: string[] = [];

  for (let i = 0; i < rawList.length; i++) {
    const item = rawList[i] as RawCut;
    if (!item || typeof item !== "object") continue;

    const actionType = String(item.actionType ?? "").toUpperCase();

    if (
      actionType === "ADD" ||
      actionType === "MODIFY" ||
      actionType === "CLEAN_SCENE" ||
      actionType === "CLEAN" ||
      actionType === "CLEAR" ||
      actionType === "POPUP" ||
      actionType === "MEMO" ||
      actionType === "BACKGROUND" ||
      actionType === "MAGNIFY"
    ) {
      if (!isValidCut(item)) {
        continue;
      }
      const msg: RawCut = { ...item };
      if (msg.obj == null && msg.content) {
        msg.obj = safeJsonParse(msg.content, null);
      }
      guideScript.contents.push(msg);
      if (actionType === "BACKGROUND") {
        guideScript.backgroundCut = msg;
      }
    } else if (actionType === "ACT_SUBS" || actionType === "SCENE_SUBS") {
      guideScript.actSubs = asRecord(safeJsonParse(item.content, {}));
    } else if (actionType === "BACKGROUND_SUBS") {
      const parsed = safeJsonParse<unknown[]>(item.content, []);
      rawBksSubs = Array.isArray(parsed)
        ? (parsed.filter((it) => it !== null && it !== undefined) as string[])
        : [];
      guideScript.backgroundSubs = rawBksSubs;
    } else if (actionType === "ANIMATIONS") {
      guideScript.animations = asRecord(safeJsonParse(item.content, {}));
    } else if (actionType === "FADEOUTS") {
      guideScript.fadeOuts = asRecord(safeJsonParse(item.content, {}));
    } else if (actionType === "APPENDIX") {
      guideScript.appendix = asRecord(safeJsonParse(item.content, {}));
    } else if (actionType === "GROUPS") {
      guideScript.groups = asArray(safeJsonParse(item.content, []));
    } else if (actionType === "SYNCS") {
      guideScript.syncMembers = asArray(safeJsonParse(item.content, []));
    } else if (actionType === "PREPS") {
      guideScript.prepMembers = asArray(safeJsonParse(item.content, []));
    }
  }

  const stackedBack: string[] = [];
  const persistenceStufs: CurtainEntry[] = [];
  let backObjs: Record<string, unknown> = {};

  for (let i = 0; i < guideScript.contents.length; i++) {
    const item = guideScript.contents[i];
    const cutObj = item.obj ?? safeJsonParse(item.content, {});
    const objId = cutObj?.id ? String(cutObj.id) : null;

    if (objId && rawBksSubs.includes(objId)) {
      backObjs[objId] = cutObj;
      stackedBack.push(objId);
    }

    const actType = String(item.actionType ?? "").toUpperCase();
    if (isResetCut(item)) {
      persistenceStufs.push({ seq: i, objs: [...stackedBack] });
      guideScript.refreshPoints.push(i);
    }
  }

  guideScript.canvasBackStuffs = backObjs;
  guideScript.curtains = persistenceStufs;

  return guideScript;
}

/** URL 이 비었거나 템플릿 문자열로 "undefined"/"null" 이 들어간 경우. */
function isMissingUrl(url: unknown): boolean {
  if (typeof url !== "string" || url.trim() === "") return true;
  return /^(undefined|null)(\?|$)/.test(url.trim());
}

/** 파싱은 됐지만 실행할 컷이 하나도 없는 스크립트 (빈 배열 등). */
function isEmptyScript(script: GuideScript): boolean {
  return script.contents.length === 0;
}

/**
 * 원격 releaseScriptUrl 또는 scriptUrl 을 가져와 표준 GuideScript 로 파싱하는 공용 함수.
 * 캐시 방지를 위해 `ts` 타임스탬프 쿼리를 자동 부착합니다.
 * options.fallbackImage 를 주면 URL 누락/요청 실패/빈 스크립트일 때 기본 스크립트를 반환합니다.
 */
export async function fetchAndParseReleaseScript(
  releaseScriptUrl: string | null | undefined,
  fetchFn?: (url: string) => Promise<unknown>,
  options?: ReleaseScriptFallbackOptions,
): Promise<GuideScript> {
  try {
    if (isMissingUrl(releaseScriptUrl)) {
      throw new Error("유효하지 않은 releaseScriptUrl 입니다.");
    }
    const url = releaseScriptUrl as string;
    const separator = url.includes("?") ? "&" : "?";
    const urlWithTs = `${url}${separator}ts=${Date.now()}`;

    let data: unknown;
    if (fetchFn) {
      data = await fetchFn(urlWithTs);
    } else if (typeof fetch === "function") {
      const res = await fetch(urlWithTs);
      if (!res.ok) {
        throw new Error(`HTTP Error ${res.status}: ${res.statusText}`);
      }
      data = await res.json();
    } else {
      throw new Error("fetch 함수가 제공되지 않았습니다.");
    }

    const parsed = parseDocument(data as RawCut[]);
    if (options?.fallbackImage && isEmptyScript(parsed)) {
      return fallbackOrThrow(new Error("스크립트에 컷이 없습니다."), options);
    }
    return parsed;
  } catch (error) {
    return fallbackOrThrow(error, options);
  }
}

/**
 * 하위 호환용 scriptMaker (axios/fetch 기반)
 * options.fallbackImage 를 주면 URL 누락/요청 실패/빈 스크립트일 때 기본 스크립트를 반환합니다.
 */
export async function scriptMaker(
  scriptUrl: string | null | undefined,
  customGetter?: (url: string) => Promise<{ data: RawCut[] }>,
  options?: ReleaseScriptFallbackOptions,
): Promise<GuideScript> {
  try {
    if (isMissingUrl(scriptUrl)) {
      throw new Error("유효하지 않은 scriptUrl 입니다.");
    }
    const url = scriptUrl as string;
    let parsed: GuideScript;
    if (customGetter) {
      const response = await customGetter(url);
      parsed = parseDocument(response.data);
    } else if (typeof fetch === "function") {
      const separator = url.includes("?") ? "&" : "?";
      const res = await fetch(`${url}${separator}ts=${Date.now()}`);
      if (!res.ok) {
        throw new Error(`HTTP Error ${res.status}: ${res.statusText}`);
      }
      parsed = parseDocument(await res.json());
    } else {
      throw new Error("스크립트 요청 환경이 지원되지 않습니다.");
    }
    if (options?.fallbackImage && isEmptyScript(parsed)) {
      return fallbackOrThrow(new Error("스크립트에 컷이 없습니다."), options);
    }
    return parsed;
  } catch (error) {
    if (!options?.fallbackImage) {
      console.error("JSON 스크립트 파일을 가져오거나 파싱하는 중 오류가 발생했습니다:", error);
    }
    return fallbackOrThrow(error, options);
  }
}

/**
 * 하위 호환용 liveClassScriptMaker
 */
export async function liveClassScriptMaker(
  releaseScriptUrl: string | null | undefined,
  customGetter?: (url: string) => Promise<{ data: RawCut[] }>,
  options?: ReleaseScriptFallbackOptions,
): Promise<GuideScript | null> {
  return scriptMaker(releaseScriptUrl, customGetter, options);
}
