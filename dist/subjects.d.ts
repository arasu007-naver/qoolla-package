/**
 * Go3 Math Service (Qoolla) 수학 과목 및 챕터/커리큘럼 정의
 */
export type MathSubjectKey = "BASIC_MATH" | "HIGHSCHOOL_MATH_BASE_A" | "HIGHSCHOOL_MATH_BASE_B" | "HIGHSCHOOL_MATH1" | "HIGHSCHOOL_MATH2" | "COMMON_MATH" | "STATISTICS" | "CALCULUS" | "GEOMETRY";
export interface ChapterInfo {
    id: number;
    title: string;
    subjectId?: number;
    subject?: MathSubjectKey | string;
    subjectTitle?: string;
}
export interface MathSubject {
    id: number;
    value: MathSubjectKey | string;
    label: string;
    chapters: ChapterInfo[];
}
export interface MathMajor {
    value: string;
    label: string;
}
export interface ChapterTreeItem {
    chapterId: number;
    chapterTitle: string;
}
export interface ChapterTree {
    subjectId: string | number;
    subjectTitle: string;
    course: string;
    chapters: ChapterTreeItem[];
}
/**
 * Go3 Math Service (Qoolla) 전체 과목 및 하위 챕터 목록
 */
export declare const MATH_SUBJECTS: MathSubject[];
/**
 * MATH_AGENDA alias for MATH_SUBJECTS (하위 호환성 유지)
 */
export declare const MATH_AGENDA: MathSubject[];
/**
 * 전체 챕터 플랫 목록
 */
export declare const MATH_CHAPTERS: ChapterInfo[];
/**
 * 수능/고등 수학 계열 및 선택 과목
 */
export declare const MATH_MAJORS: MathMajor[];
/**
 * 과목 목록 전체를 반환합니다.
 */
export declare function getMathSubjects(): MathSubject[];
/**
 * ID(숫자 또는 문자열)로 과목을 검색합니다.
 */
export declare function getMathSubjectById(id: number | string): MathSubject | undefined;
/**
 * 과목 코드(value, 예: 'BASIC_MATH', 'HIGHSCHOOL_MATH1' 등)로 과목을 검색합니다.
 */
export declare function getMathSubjectByValue(value: string): MathSubject | undefined;
/**
 * ID 또는 Value 값으로 과목을 검색합니다.
 */
export declare function getMathSubject(identifier: string | number): MathSubject | undefined;
/**
 * ID 또는 Value 값으로부터 과목의 표시 레이블(한글명)을 반환합니다.
 */
export declare function getMathSubjectLabel(identifier: string | number, fallback?: string): string;
/**
 * 특정 과목(ID 또는 Value)에 속한 챕터 목록을 반환하거나, 파라미터가 없으면 전체 챕터 목록을 반환합니다.
 */
export declare function getMathChapters(subjectIdentifier?: string | number): ChapterInfo[];
/**
 * 챕터 ID로 특정 챕터 정보를 검색합니다.
 */
export declare function getMathChapterById(chapterId: number | string): ChapterInfo | undefined;
/**
 * 수능 계열/선택 과목 목록을 반환합니다.
 */
export declare function getMathMajors(): MathMajor[];
