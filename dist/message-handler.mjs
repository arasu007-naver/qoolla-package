import { defaultSleep } from "./player.mjs";
export function isMobileDevice() {
    if (typeof navigator === "undefined")
        return false;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent || "");
}
/**
 * 수신된 다양한 형식의 라이브 메시지(GraphQL Subscription, WebSocket, JSON 문자열, 객체)로부터 guide 객체를 추출합니다.
 */
export function extractGuideFromMessage(data) {
    if (!data)
        return null;
    let raw = data;
    if (typeof raw === "string") {
        try {
            raw = JSON.parse(raw);
        }
        catch {
            return null;
        }
    }
    if (typeof raw !== "object" || raw === null)
        return null;
    const obj = raw;
    // GraphQL subscription wrapper: data.data.liveTopicClassMessage.content or data.data.liveHotlineClassMessage.content
    if (obj.data && typeof obj.data === "object") {
        const d = obj.data;
        const msg = d.liveTopicClassMessage || d.liveHotlineClassMessage || d.liveClassMessage;
        if (msg) {
            if (msg.content) {
                try {
                    return typeof msg.content === "string" ? JSON.parse(msg.content) : msg.content;
                }
                catch {
                    return null;
                }
            }
            return msg;
        }
    }
    if (obj.liveTopicClassMessage || obj.liveHotlineClassMessage) {
        const msg = obj.liveTopicClassMessage || obj.liveHotlineClassMessage;
        if (msg.content) {
            try {
                return typeof msg.content === "string" ? JSON.parse(msg.content) : msg.content;
            }
            catch {
                return null;
            }
        }
        return msg;
    }
    if (obj.content && typeof obj.content === "string") {
        try {
            return JSON.parse(obj.content);
        }
        catch {
            return obj;
        }
    }
    return obj;
}
/**
 * 라이브 강의 실시간 수신 메시지(TopicLiveClass, HotlineClass 등)를 분기하여 실행하는 공용 디스패처.
 * 데스크탑과 모바일 환경을 구별하여 좌표/모달/타이밍 처리를 수행합니다.
 * (기준: TopicLiveClassView.tsx)
 */
export async function handleLiveClassMessage(data, context, options) {
    const isMobile = (options?.platform ?? context.platform ?? (isMobileDevice() ? "mobile" : "desktop")) ===
        "mobile";
    const sleep = context.sleepFn ?? defaultSleep;
    context.closeBoardMemo?.();
    context.closeModalHandler?.();
    const guide = extractGuideFromMessage(data);
    if (!guide) {
        return { handled: false, isMobile };
    }
    // 1. 단계(step/mode) 설정
    if (guide.step || guide.mode) {
        context.setCutSequence?.((guide.step || guide.mode));
    }
    // 2. Snapshot 요청 처리
    if (guide.action === "snapshot") {
        context.addToast?.(isMobile ? "모바일 스냅샷 요청." : "Snapshot 요청.", "warning");
        if (context.takeSnapShotOfCanvas) {
            await context.takeSnapShotOfCanvas();
        }
        else if (context.canvas?.takeSnapShotOfCanvas) {
            await context.canvas.takeSnapShotOfCanvas();
        }
        return { handled: true, action: "snapshot", guide, isMobile };
    }
    // 3. 스크립트 전환 감지
    if (guide.scriptId != null &&
        (context.currentScript == null || Number(context.currentScript.id) !== Number(guide.scriptId))) {
        context.setLastGuide?.(guide);
        if (context.scriptList && Array.isArray(context.scriptList)) {
            for (const unit of context.scriptList) {
                if (unit.scripts && Array.isArray(unit.scripts)) {
                    for (const script of unit.scripts) {
                        if (Number(script.id) === Number(guide.scriptId)) {
                            context.setCurrentScript?.(script);
                            context.setCurrentUnit?.(unit);
                            break;
                        }
                    }
                }
            }
        }
        return { handled: true, action: "switchScript", guide, isMobile };
    }
    // 4. 단일 객체 돋보기 / 확대 (magnify, magnifyObj)
    if (guide.action === "magnify" || guide.action === "magnifyObj") {
        const targetId = guide.objId ||
            guide.obj?.id ||
            (typeof guide.content === "string" ? guide.content : undefined);
        if (targetId) {
            context.canvas?.magnifyObj?.(targetId);
            await sleep(600);
        }
        return { handled: true, action: "magnifyObj", guide, isMobile };
    }
    // 5. 영역 돋보기 (magnifyArea, magnifier, MAGNIFY)
    if (guide.action === "magnifyArea" ||
        guide.action === "magnifier" ||
        (guide.actionType === "MAGNIFY" && guide.action !== "magnify")) {
        let target = guide.obj;
        if (!target && guide.content) {
            try {
                target = typeof guide.content === "string" ? JSON.parse(guide.content) : guide.content;
            }
            catch { }
        }
        if (target && typeof target === "object" && (target.left != null || target.width != null)) {
            await context.canvas?.magnifyArea?.(target, { isMobile });
            await sleep(600);
        }
        else if (guide.objId || target?.id || guide.content) {
            context.canvas?.magnifyObj?.(guide.objId || target?.id || guide.content);
            await sleep(600);
        }
        return { handled: true, action: "magnifyArea", guide, isMobile };
    }
    // 6. 기타 액션 분기
    switch (guide.action) {
        case "property": {
            if (guide.lines) {
                if (guide.lines.PREPS)
                    context.setPrepMembers?.(guide.lines.PREPS);
                if (guide.lines.SYNCS)
                    context.setSyncMembers?.(guide.lines.SYNCS);
                if (guide.lines.GROUPS)
                    context.setGroupMembers?.(guide.lines.GROUPS);
            }
            break;
        }
        case "renewScript":
        case "reload": {
            await context.downloadScript?.();
            break;
        }
        case "adhoc": {
            if (guide.fly && context.canvas) {
                const flies = Array.isArray(guide.fly) ? guide.fly : [guide.fly];
                for (const fly of flies) {
                    if (fly.actionType === "MAGNIFY" ||
                        (typeof fly.id === "string" && fly.id.startsWith("magnifier:"))) {
                        let target = fly.obj;
                        if (!target && fly.content) {
                            try {
                                target = typeof fly.content === "string" ? JSON.parse(fly.content) : fly.content;
                            }
                            catch { }
                        }
                        if (target &&
                            typeof target === "object" &&
                            (target.left != null || target.width != null)) {
                            await context.canvas.magnifyArea?.(target, { isMobile });
                            await sleep(600);
                        }
                        else if (fly.objId || fly.id) {
                            context.canvas.magnifyObj?.(fly.objId || fly.id);
                            await sleep(600);
                        }
                    }
                    else {
                        context.canvas.removeObjectWithId?.(fly.id);
                    }
                }
                for (const fly of flies) {
                    if (fly.actionType !== "MAGNIFY" &&
                        !(typeof fly.id === "string" && fly.id.startsWith("magnifier:"))) {
                        context.canvas.importObjectFromClipboard?.({
                            ...fly,
                            support: isMobile ? "qoolla-mobile" : "qoolla",
                        });
                        await sleep(isMobile ? 800 : 720);
                    }
                }
            }
            break;
        }
        case "remove_all_adhoc": {
            context.canvas?.removeFlyingObjs?.();
            break;
        }
        case "remove": {
            if (guide.objId) {
                context.canvas?.removeObjectWithId?.(guide.objId);
            }
            break;
        }
        case "select": {
            if (guide.objId) {
                if (context.canvas?.selectObjectWithId) {
                    context.canvas.selectObjectWithId(guide.objId);
                }
                else if (context.canvas?.selectObject) {
                    context.canvas.selectObject({ id: guide.objId });
                }
            }
            break;
        }
        case "animation": {
            if (guide.animation) {
                context.canvas?.onAnimationCommand?.(guide.animation);
            }
            break;
        }
        case "clean": {
            context.canvas?.clearCanvas?.();
            break;
        }
        case "cleanMessy": {
            context.canvas?.withoutFurtherAdo?.();
            break;
        }
        case "popup": {
            if (guide.url) {
                context.closeModalHandler?.();
                context.setPopupUrl?.(guide.url);
                const modalDelay = isMobile ? 32 : 20;
                setTimeout(() => context.setShowPopupModal?.(true), modalDelay);
            }
            break;
        }
        case "synch": {
            if (guide.objects && context.canvas?.syncCanvasObjects) {
                context.canvas.syncCanvasObjects(guide.objects);
            }
            if (guide.step || guide.mode) {
                context.setCutSequence?.((guide.step || guide.mode));
            }
            context.setLastGuide?.(guide);
            if (context.playToPoint) {
                await context.playToPoint(guide);
            }
            break;
        }
        case "step":
        case "refresh":
        default: {
            if (context.playToPoint) {
                await context.playToPoint(guide);
            }
            break;
        }
    }
    return { handled: true, action: guide.action, guide, isMobile };
}
/** 하위 호환용 dispatchLiveClassMessage 별칭 */
export const dispatchLiveClassMessage = handleLiveClassMessage;
