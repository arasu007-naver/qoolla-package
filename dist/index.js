"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.safeJsonParse = safeJsonParse;
exports.isValidCut = isValidCut;
exports.parseRawDocument = parseRawDocument;
exports.parseDocument = parseDocument;
exports.fetchAndParseReleaseScript = fetchAndParseReleaseScript;
exports.scriptMaker = scriptMaker;
exports.liveClassScriptMaker = liveClassScriptMaker;
__exportStar(require("./player"), exports);
__exportStar(require("./message-handler"), exports);
/**
 * 안전한 JSON 파서. 문자열이면 JSON.parse 시도, 이미 객체이면 그대로 반환, 실패 시 fallback 반환.
 */
function safeJsonParse(value, fallback) {
    if (value == null)
        return fallback;
    if (typeof value === "object")
        return value;
    if (typeof value !== "string")
        return fallback;
    try {
        return JSON.parse(value);
    }
    catch {
        return fallback;
    }
}
/**
 * Cut 유효성 검사 규칙 (topic-portrait-live 표준):
 * - actionType 이 "ADD" 인 경우 obj.id 또는 content 내의 id 가 존재하고 빈 문자열이나 "undefined" 가 아니어야 유효함.
 * - 그 외 actionType 은 유효한 컷으로 간주.
 */
function isValidCut(cutOrAction) {
    if (!cutOrAction || typeof cutOrAction !== "object")
        return false;
    const action = cutOrAction;
    const actionType = String(action.actionType ?? "").toUpperCase();
    if (actionType === "ADD") {
        let objId = null;
        if (action.obj && typeof action.obj === "object" && action.obj.id != null) {
            objId = String(action.obj.id);
        }
        else if (action.content) {
            try {
                const parsed = typeof action.content === "string" ? JSON.parse(action.content) : action.content;
                if (parsed && typeof parsed === "object" && parsed.id != null) {
                    objId = String(parsed.id);
                }
            }
            catch {
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
function parseRawDocument(jsonDoc) {
    const guideScript = {
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
        const cut = jsonDoc[i];
        if (!cut || typeof cut !== "object")
            continue;
        const actionType = String(cut.actionType ?? "").toUpperCase();
        if (actionType === "BACKGROUND") {
            guideScript.rawStory.push({
                actionType: cut.actionType,
                seq: i,
                ts: cut.timestamp,
                objId: cut.timestamp,
            });
        }
        else if (actionType === "REMOVE") {
            const rObj = safeJsonParse(cut.content, {});
            guideScript.rawStory.push({
                actionType: cut.actionType,
                seq: i,
                ts: cut.timestamp,
                objId: rObj?.id ?? cut.timestamp,
            });
        }
        else if (actionType === "MEMO") {
            guideScript.memos.push(cut);
            guideScript.rawStory.push({
                actionType: cut.actionType,
                seq: i,
                ts: cut.timestamp,
                objId: cut.timestamp,
            });
        }
        else if (actionType === "POPUP") {
            guideScript.popups.push(cut);
            guideScript.rawStory.push({
                actionType: cut.actionType,
                seq: i,
                ts: cut.timestamp,
                objId: cut.timestamp,
            });
        }
        else if (actionType === "MAGNIFY") {
            guideScript.rawStory.push({
                actionType: cut.actionType,
                seq: i,
                ts: cut.timestamp,
                objId: cut.timestamp,
            });
        }
        else if (actionType === "SCENE_SUBS" || actionType === "ACT_SUBS") {
            guideScript.actSubs = safeJsonParse(cut.content, {});
            continue;
        }
        else if (actionType === "MEMO_SUBS") {
            const parsed = safeJsonParse(cut.content, []);
            guideScript.memoSubs = Array.isArray(parsed)
                ? parsed.filter((item) => item !== null && item !== undefined)
                : [];
            continue;
        }
        else if (actionType === "BACKGROUND_SUBS") {
            const tmp = safeJsonParse(cut.content, []);
            guideScript.backgroundSubs = Array.isArray(tmp)
                ? tmp.filter((item) => item !== null && item !== undefined)
                : [];
            continue;
        }
        else if (actionType === "FADEOUTS") {
            guideScript.fadeOuts = safeJsonParse(cut.content, {});
            continue;
        }
        else if (actionType === "ANIMATIONS") {
            guideScript.animations = safeJsonParse(cut.content, {});
            continue;
        }
        else if (actionType === "APPENDIX") {
            guideScript.appendix = safeJsonParse(cut.content, {});
            continue;
        }
        else if (actionType === "GROUPS") {
            const groupMembers = safeJsonParse(cut.content, []);
            guideScript.epilogueMembers = Array.isArray(groupMembers)
                ? groupMembers.filter((item) => item !== null && item !== undefined)
                : [];
            continue;
        }
        else if (actionType === "PREPS") {
            const prevs = safeJsonParse(cut.content, []);
            guideScript.prologueMembers = Array.isArray(prevs)
                ? prevs.filter((item) => item !== null && item !== undefined)
                : [];
            continue;
        }
        else if (actionType === "SYNCS") {
            const follows = safeJsonParse(cut.content, []);
            guideScript.followMembers = Array.isArray(follows)
                ? follows.filter((item) => item !== null && item !== undefined)
                : [];
            continue;
        }
        else if (actionType === "ADD" || actionType === "MODIFY") {
            const obj = safeJsonParse(cut.content, cut.obj ?? {});
            const k = obj?.id;
            if (actionType === "ADD" &&
                (!k || String(k).trim() === "" || String(k) === "undefined" || String(k) === "null")) {
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
        }
        else if (actionType === "CLEAN" || actionType === "CLEAN_SCENE") {
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
    const groups = {};
    for (const item of guideScript.rawStory) {
        const key = String(item.objId);
        if (!groups[key])
            groups[key] = [];
        groups[key].push(item);
    }
    const storyEntries = [];
    const hiddenEntries = [];
    for (const key of Object.keys(groups)) {
        const group = groups[key];
        const hasRemove = group.some((g) => String(g.actionType).toUpperCase() === "REMOVE");
        let maxSeq = group[0].seq;
        let minTs = group[0].ts;
        for (const g of group) {
            if (g.seq > maxSeq)
                maxSeq = g.seq;
            if (g.ts < minTs)
                minTs = g.ts;
        }
        const entry = {
            objId: group[0].objId,
            seq: maxSeq,
            ts: minTs,
            actionType: group[0].actionType,
        };
        if (hasRemove) {
            hiddenEntries.push(entry);
        }
        else {
            storyEntries.push(entry);
        }
    }
    storyEntries.sort((a, b) => a.seq - b.seq);
    hiddenEntries.sort((a, b) => a.seq - b.seq);
    guideScript.story = storyEntries;
    guideScript.hiddenStory = hiddenEntries;
    const bgSubsList = Array.isArray(guideScript.backgroundSubs)
        ? guideScript.backgroundSubs
        : [];
    const stackedBack = [];
    for (let j = 0; j < guideScript.story.length; j++) {
        const cut = guideScript.story[j];
        if (bgSubsList.includes(String(cut.objId))) {
            stackedBack.push(cut.objId);
        }
        const actType = String(cut.actionType ?? "").toUpperCase();
        if (actType === "CLEAN" || actType === "CLEAN_SCENE") {
            guideScript.persitence.push({ seq: cut.seq, objs: [...stackedBack] });
        }
    }
    return guideScript;
}
/**
 * 런타임/플레이어용 고수준 파서 (GuideScript 반환).
 * ADD / MODIFY / CLEAN_SCENE / CLEAN / POPUP / MEMO / BACKGROUND / MAGNIFY 를 정제하여 contents 로 구성.
 */
function parseDocument(rawList) {
    const guideScript = {
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
    if (!Array.isArray(rawList))
        return guideScript;
    let rawBksSubs = [];
    for (let i = 0; i < rawList.length; i++) {
        const item = rawList[i];
        if (!item || typeof item !== "object")
            continue;
        const actionType = String(item.actionType ?? "").toUpperCase();
        if (actionType === "ADD" ||
            actionType === "MODIFY" ||
            actionType === "CLEAN_SCENE" ||
            actionType === "CLEAN" ||
            actionType === "POPUP" ||
            actionType === "MEMO" ||
            actionType === "BACKGROUND" ||
            actionType === "MAGNIFY") {
            if (!isValidCut(item)) {
                continue;
            }
            const msg = { ...item };
            if (msg.obj == null && msg.content) {
                msg.obj = safeJsonParse(msg.content, null);
            }
            guideScript.contents.push(msg);
            if (actionType === "BACKGROUND") {
                guideScript.backgroundCut = msg;
            }
        }
        else if (actionType === "ACT_SUBS" || actionType === "SCENE_SUBS") {
            guideScript.actSubs = safeJsonParse(item.content, {});
        }
        else if (actionType === "BACKGROUND_SUBS") {
            const parsed = safeJsonParse(item.content, []);
            rawBksSubs = Array.isArray(parsed)
                ? parsed.filter((it) => it !== null && it !== undefined)
                : [];
            guideScript.backgroundSubs = rawBksSubs;
        }
        else if (actionType === "ANIMATIONS") {
            guideScript.animations = safeJsonParse(item.content, {});
        }
        else if (actionType === "FADEOUTS") {
            guideScript.fadeOuts = safeJsonParse(item.content, {});
        }
        else if (actionType === "APPENDIX") {
            guideScript.appendix = safeJsonParse(item.content, {});
        }
        else if (actionType === "GROUPS") {
            guideScript.groups = safeJsonParse(item.content, []);
        }
        else if (actionType === "SYNCS") {
            guideScript.syncMembers = safeJsonParse(item.content, []);
        }
        else if (actionType === "PREPS") {
            guideScript.prepMembers = safeJsonParse(item.content, []);
        }
    }
    const stackedBack = [];
    const persistenceStufs = [];
    let backObjs = {};
    for (let i = 0; i < guideScript.contents.length; i++) {
        const item = guideScript.contents[i];
        const cutObj = item.obj ?? safeJsonParse(item.content, {});
        const objId = cutObj?.id ? String(cutObj.id) : null;
        if (objId && rawBksSubs.includes(objId)) {
            backObjs[objId] = cutObj;
            stackedBack.push(objId);
        }
        const actType = String(item.actionType ?? "").toUpperCase();
        if (actType === "CLEAN" || actType === "CLEAN_SCENE") {
            persistenceStufs.push({ seq: i, objs: [...stackedBack] });
            guideScript.refreshPoints.push(i);
        }
    }
    guideScript.canvasBackStuffs = backObjs;
    guideScript.curtains = persistenceStufs;
    return guideScript;
}
/**
 * 원격 releaseScriptUrl 또는 scriptUrl 을 가져와 표준 GuideScript 로 파싱하는 공용 함수.
 * 캐시 방지를 위해 `ts` 타임스탬프 쿼리를 자동 부착합니다.
 */
async function fetchAndParseReleaseScript(releaseScriptUrl, fetchFn) {
    if (!releaseScriptUrl || typeof releaseScriptUrl !== "string") {
        throw new Error("유효하지 않은 releaseScriptUrl 입니다.");
    }
    const separator = releaseScriptUrl.includes("?") ? "&" : "?";
    const urlWithTs = `${releaseScriptUrl}${separator}ts=${Date.now()}`;
    let data;
    if (fetchFn) {
        data = await fetchFn(urlWithTs);
    }
    else if (typeof fetch === "function") {
        const res = await fetch(urlWithTs);
        if (!res.ok) {
            throw new Error(`HTTP Error ${res.status}: ${res.statusText}`);
        }
        data = await res.json();
    }
    else {
        throw new Error("fetch 함수가 제공되지 않았습니다.");
    }
    return parseDocument(data);
}
/**
 * 하위 호환용 scriptMaker (axios/fetch 기반)
 */
async function scriptMaker(scriptUrl, customGetter) {
    try {
        if (customGetter) {
            const response = await customGetter(scriptUrl);
            return parseDocument(response.data);
        }
        const separator = scriptUrl.includes("?") ? "&" : "?";
        const urlWithTs = `${scriptUrl}${separator}ts=${Date.now()}`;
        if (typeof fetch === "function") {
            const res = await fetch(urlWithTs);
            const data = await res.json();
            return parseDocument(data);
        }
        throw new Error("스크립트 요청 환경이 지원되지 않습니다.");
    }
    catch (error) {
        console.error("JSON 스크립트 파일을 가져오거나 파싱하는 중 오류가 발생했습니다:", error);
        throw error;
    }
}
/**
 * 하위 호환용 liveClassScriptMaker
 */
async function liveClassScriptMaker(releaseScriptUrl, customGetter) {
    return scriptMaker(releaseScriptUrl, customGetter);
}
