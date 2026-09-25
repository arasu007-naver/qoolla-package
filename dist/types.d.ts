export interface RawCut {
    actionType: string;
    content: string;
    timestamp: number;
    obj?: any;
    text?: string;
    [key: string]: any;
}
export type RawAction = RawCut;
export interface StoryEntry {
    actionType: string;
    objId: string | number;
    seq: number;
    ts: number;
}
export interface PersistenceEntry {
    seq: number;
    objs: (string | number)[];
}
export interface RawGuideScript {
    contents: unknown[];
    actSubs: Record<string, unknown>;
    backgroundSubs: string[] | Record<string, unknown>;
    animations: Record<string, unknown>;
    fadeOuts: Record<string, unknown>;
    appendix: Record<string, unknown>;
    epilogueMembers: string[];
    backgroundCut: Record<string, unknown>;
    refreshPoints: number[];
    followMembers: string[];
    prologueMembers: string[];
    objectsPool: Record<string, unknown>;
    rawStory: StoryEntry[];
    scenes: number[];
    popups: RawCut[];
    story: StoryEntry[];
    memos: RawCut[];
    memoSubs: string[];
    hiddenStory: StoryEntry[];
    commontList: Record<string, string>;
    persitence: PersistenceEntry[];
}
export interface CurtainEntry {
    seq: number;
    objs: string[];
}
export interface GuideScript {
    contents: RawCut[];
    actSubs: Record<string, unknown>;
    backgroundSubs: string[];
    animations: Record<string, unknown>;
    fadeOuts: Record<string, unknown>;
    appendix: Record<string, unknown>;
    groups: unknown[];
    backgroundCut: RawCut | Record<string, never>;
    refreshPoints: number[];
    syncMembers: unknown[];
    prepMembers: unknown[];
    canvasBackStuffs: Record<string, unknown>;
    curtains: CurtainEntry[];
}
