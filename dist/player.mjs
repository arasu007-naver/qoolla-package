export const STEP_ORDER = ["prologue", "main", "epilogue"];
export function defaultSleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms > 9600 ? 9600 : ms));
}
/**
 * 컷 객체로부터 리더 오브젝트 ID(leaderId)를 추출합니다.
 */
export function getLeaderIdForCut(cut) {
    if (!cut || typeof cut !== "object")
        return null;
    const c = cut;
    if (c.obj?.id != null)
        return String(c.obj.id);
    if (c.content) {
        try {
            const parsed = typeof c.content === "string" ? JSON.parse(c.content) : c.content;
            return parsed && parsed.id != null ? String(parsed.id) : null;
        }
        catch {
            return null;
        }
    }
    return null;
}
/**
 * targetIdx 직전의 가장 최근 CLEAN, CLEAN_SCENE 또는 BACKGROUND 액션 인덱스를 찾습니다.
 */
export function findNearestCleanBefore(cuts, targetIdx) {
    if (!cuts || !Array.isArray(cuts) || cuts.length === 0)
        return 0;
    const maxIdx = Math.min(targetIdx - 1, cuts.length - 1);
    for (let i = maxIdx; i >= 0; i--) {
        const cut = cuts[i];
        const at = String(cut?.actionType ?? "").toUpperCase();
        if (at === "CLEAN" || at === "CLEAN_SCENE" || at === "BACKGROUND") {
            return i;
        }
    }
    return 0;
}
/**
 * 최근/이전의 actionType='BACKGROUND' 또는 'CLEAN'/'CLEAN_SCENE'부터 목표 targetGuide의 studyIdx, step까지 빠르게 실행합니다.
 * 돋보기(MAGNIFY) 효과 플레이 시 각 진입 지점에서 await sleep(600)을 적용합니다.
 * (기준: topic-portrait-live/PageClient.tsx)
 */
export async function fastforward(cutContents, targetGuide, callbacks) {
    const sleep = callbacks.sleepFn ?? defaultSleep;
    if (!cutContents || cutContents.length === 0) {
        const defaultState = {
            currentIdx: targetGuide.studyIdx ?? 0,
            cutSequence: (targetGuide.step || targetGuide.mode || "main"),
            lastGuide: targetGuide,
        };
        callbacks.onStateChange?.(defaultState);
        return defaultState;
    }
    const endIdx = targetGuide.studyIdx ?? 0;
    const targetStep = (targetGuide.step || targetGuide.mode || "main");
    const startIdx = findNearestCleanBefore(cutContents, endIdx);
    if (callbacks.runCurtains) {
        await callbacks.runCurtains(startIdx);
    }
    for (let idx = startIdx; idx <= endIdx; idx++) {
        const cut = cutContents[idx];
        if (!cut)
            continue;
        const actionType = String(cut.actionType ?? "").toUpperCase();
        if (actionType === "CLEAN" || actionType === "CLEAN_SCENE" || actionType === "BACKGROUND") {
            await callbacks.runCut(cut, { idx, step: "main" });
            continue;
        }
        if (actionType === "MAGNIFY") {
            await callbacks.runCut(cut, { idx, step: "main" });
            await sleep(600);
            continue;
        }
        if (idx === endIdx && targetStep === "refresh")
            break;
        const leaderId = getLeaderIdForCut(cut);
        const hasP = leaderId && callbacks.hasPrologue ? callbacks.hasPrologue(leaderId, cut) : false;
        const hasE = leaderId && callbacks.hasEpilogue ? callbacks.hasEpilogue(leaderId, cut) : false;
        const targetStepIdx = STEP_ORDER.indexOf(targetStep);
        const limit = idx === endIdx && targetStepIdx !== -1 ? targetStepIdx : STEP_ORDER.indexOf("epilogue");
        for (let s = 0; s <= limit; s++) {
            const step = STEP_ORDER[s];
            if (step === "prologue") {
                if (hasP && callbacks.runPrologue) {
                    await callbacks.runPrologue(cut, leaderId, { idx });
                    await sleep(480);
                }
            }
            else if (step === "main") {
                await callbacks.runCut(cut, { idx, step: "main" });
                await sleep(420);
            }
            else if (step === "epilogue") {
                if (hasE && callbacks.runEpilogue) {
                    await callbacks.runEpilogue(cut, leaderId, { idx });
                    await sleep(480);
                }
            }
        }
        if (callbacks.runMagnifier) {
            const stepsToRun = STEP_ORDER.slice(0, limit + 1);
            await callbacks.runMagnifier({ idx, steps: stepsToRun });
            await sleep(600);
        }
    }
    if (targetGuide.objects && Array.isArray(targetGuide.objects) && callbacks.syncCanvasObjects) {
        await callbacks.syncCanvasObjects(targetGuide.objects);
    }
    const finalState = {
        currentIdx: endIdx,
        cutSequence: targetStep,
        lastGuide: targetGuide,
    };
    callbacks.onStateChange?.(finalState);
    return finalState;
}
/** 하위 호환용 forwardToPoint 별칭 */
export const forwardToPoint = fastforward;
/**
 * 이전에 플레이되었던 지점(lastGuide)부터 지정 지점(targetGuide)까지 순차 재생하고,
 * 역방향/새로고침/동기화 시 fastforward 로 분기합니다.
 * (기준: student-ai-support/TopicLiveClassView.tsx)
 */
export async function playToPoint(cutContents, targetGuide, lastGuide, callbacks) {
    const sleep = callbacks.sleepFn ?? defaultSleep;
    if (!cutContents || cutContents.length === 0) {
        const state = {
            currentIdx: targetGuide.studyIdx ?? 0,
            cutSequence: (targetGuide.step || targetGuide.mode || "main"),
            lastGuide: targetGuide,
        };
        callbacks.onStateChange?.(state);
        return state;
    }
    const lastPointIdx = lastGuide ? (lastGuide.studyIdx ?? 0) : 0;
    const endIdx = targetGuide.studyIdx ?? 0;
    const targetStep = (targetGuide.step || targetGuide.mode || "main");
    if (targetGuide.action === "synch") {
        if (targetGuide.objects && Array.isArray(targetGuide.objects) && callbacks.syncCanvasObjects) {
            await callbacks.syncCanvasObjects(targetGuide.objects);
        }
        const synchState = {
            currentIdx: targetGuide.studyIdx ?? endIdx,
            cutSequence: targetStep,
            lastGuide: targetGuide,
        };
        callbacks.onStateChange?.(synchState);
        return synchState;
    }
    if (endIdx < lastPointIdx ||
        targetGuide.action === "refresh" ||
        targetGuide.sync === true) {
        return fastforward(cutContents, targetGuide, callbacks);
    }
    for (let idx = lastPointIdx; idx <= endIdx; idx++) {
        const cut = cutContents[idx];
        if (!cut)
            continue;
        const actionType = String(cut.actionType ?? "").toUpperCase();
        if (actionType === "CLEAN" || actionType === "CLEAN_SCENE" || actionType === "BACKGROUND") {
            await callbacks.runCut(cut, { idx, step: "main" });
            continue;
        }
        if (actionType === "MAGNIFY") {
            await callbacks.runCut(cut, { idx, step: "main" });
            await sleep(600);
            continue;
        }
        const leaderId = getLeaderIdForCut(cut);
        const hasP = leaderId && callbacks.hasPrologue ? callbacks.hasPrologue(leaderId, cut) : false;
        const hasE = leaderId && callbacks.hasEpilogue ? callbacks.hasEpilogue(leaderId, cut) : false;
        const lastStep = idx === lastPointIdx && lastGuide
            ? (lastGuide.step || lastGuide.mode || "main")
            : "prologue";
        const startStepIdx = idx === lastPointIdx ? STEP_ORDER.indexOf(lastStep) : 0;
        const targetStepIdx = STEP_ORDER.indexOf(targetStep);
        const limit = idx === endIdx && targetStepIdx !== -1 ? targetStepIdx : STEP_ORDER.indexOf("epilogue");
        for (let s = startStepIdx; s <= limit; s++) {
            if (idx === lastPointIdx && s === startStepIdx && idx !== endIdx) {
                continue;
            }
            const step = STEP_ORDER[s];
            if (step === "prologue") {
                if (hasP && callbacks.runPrologue) {
                    await callbacks.runPrologue(cut, leaderId, { idx });
                    await sleep(480);
                }
            }
            else if (step === "main") {
                await callbacks.runCut(cut, { idx, step: "main" });
                await sleep(420);
            }
            else if (step === "epilogue") {
                if (hasE && callbacks.runEpilogue) {
                    await callbacks.runEpilogue(cut, leaderId, { idx });
                    await sleep(480);
                }
            }
        }
        if (callbacks.runMagnifier) {
            const startIdxSlice = idx === lastPointIdx ? startStepIdx : 0;
            const stepsToRun = STEP_ORDER.slice(startIdxSlice, limit + 1);
            await callbacks.runMagnifier({ idx, steps: stepsToRun });
            await sleep(600);
        }
    }
    const finalState = {
        currentIdx: endIdx,
        cutSequence: targetStep,
        lastGuide: targetGuide,
    };
    callbacks.onStateChange?.(finalState);
    return finalState;
}
/**
 * 다음 스텝 또는 다음 컷으로 진행합니다 (prologue -> main -> epilogue -> next cut prologue/main).
 * (기준: topic-portrait-live/PageClient.tsx)
 */
export async function runNext(cutContents, currentIdx, currentStep, callbacks) {
    const sleep = callbacks.sleepFn ?? defaultSleep;
    if (!cutContents || cutContents.length === 0) {
        return { currentIdx, cutSequence: currentStep, done: true };
    }
    const idx = currentIdx;
    const cut = cutContents[idx];
    const leaderId = getLeaderIdForCut(cut);
    if (currentStep === "prologue") {
        if (cut) {
            await callbacks.runCut(cut, { idx, step: "main" });
        }
        if (callbacks.runMagnifier) {
            await callbacks.runMagnifier({ idx, steps: ["main"] });
            await sleep(600);
        }
        const state = { currentIdx: idx, cutSequence: "main" };
        callbacks.onStateChange?.(state);
        return state;
    }
    if (currentStep === "main") {
        if (leaderId && callbacks.hasEpilogue && callbacks.hasEpilogue(leaderId, cut)) {
            if (callbacks.runEpilogue) {
                await callbacks.runEpilogue(cut, leaderId, { idx });
            }
            if (callbacks.runMagnifier) {
                await callbacks.runMagnifier({ idx, steps: ["epilogue"] });
                await sleep(600);
            }
            const state = { currentIdx: idx, cutSequence: "epilogue" };
            callbacks.onStateChange?.(state);
            return state;
        }
    }
    const nextIdx = idx + 1;
    if (nextIdx >= cutContents.length) {
        return { currentIdx: idx, cutSequence: currentStep, done: true };
    }
    const nextCut = cutContents[nextIdx];
    const nextLeaderId = getLeaderIdForCut(nextCut);
    if (nextLeaderId && callbacks.hasPrologue && callbacks.hasPrologue(nextLeaderId, nextCut)) {
        if (callbacks.runPrologue) {
            await callbacks.runPrologue(nextCut, nextLeaderId, { idx: nextIdx });
        }
        if (callbacks.runMagnifier) {
            await callbacks.runMagnifier({ idx: nextIdx, steps: ["prologue"] });
            await sleep(600);
        }
        const state = { currentIdx: nextIdx, cutSequence: "prologue" };
        callbacks.onStateChange?.(state);
        return state;
    }
    else {
        if (nextCut) {
            await callbacks.runCut(nextCut, { idx: nextIdx, step: "main" });
        }
        if (callbacks.runMagnifier) {
            await callbacks.runMagnifier({ idx: nextIdx, steps: ["main"] });
            await sleep(600);
        }
        const state = { currentIdx: nextIdx, cutSequence: "main" };
        callbacks.onStateChange?.(state);
        return state;
    }
}
/**
 * 특정 컷 인덱스와 지정 스텝(prologue/main/epilogue)을 단독 실행합니다.
 * (기준: topic-portrait-live/PageClient.tsx)
 */
export async function runAt(cutContents, targetIdx, targetStep, callbacks) {
    const sleep = callbacks.sleepFn ?? defaultSleep;
    if (!cutContents || cutContents.length === 0 || targetIdx < 0 || targetIdx >= cutContents.length) {
        const fallback = { currentIdx: targetIdx, cutSequence: targetStep };
        callbacks.onStateChange?.(fallback);
        return fallback;
    }
    const cut = cutContents[targetIdx];
    const leaderId = getLeaderIdForCut(cut);
    if (targetStep === "prologue") {
        if (callbacks.runPrologue) {
            await callbacks.runPrologue(cut, leaderId, { idx: targetIdx });
        }
    }
    else if (targetStep === "main") {
        await callbacks.runCut(cut, { idx: targetIdx, step: "main" });
    }
    else if (targetStep === "epilogue") {
        if (callbacks.runEpilogue) {
            await callbacks.runEpilogue(cut, leaderId, { idx: targetIdx });
        }
    }
    if (callbacks.runMagnifier) {
        await callbacks.runMagnifier({ idx: targetIdx, steps: [targetStep] });
        await sleep(600);
    }
    const state = { currentIdx: targetIdx, cutSequence: targetStep };
    callbacks.onStateChange?.(state);
    return state;
}
