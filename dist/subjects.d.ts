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
/**
 * 고등 수학 과목 목록 기본 엔드포인트.
 */
export declare const HIGHSCHOOL_MATH_SUBJECTS_URL = "https://api-v2.qoolla.com/public/getAllHighSchoolMathSubjects";
/**
 * 서버가 내려주는 고등 수학 과목 한 건.
 * (정적 정의인 MathSubject 와 필드 구성이 다릅니다.)
 *
 * curriculumType 은 교육과정 개정 연도 문자열입니다 (subjects.curriculum_type):
 * - "2022" : 2022 개정 (공통수학1/2, 대수, 미적분I/II 등)
 * - "2015" : 2015 개정 (수학, 수학I/II, 미적분 등)
 * - ""     : 개정 구분 이전의 레거시 과목
 *
 * 주의: 2026-09-27 기준 배포된 서버 응답에는 curriculumType 키가 빠져
 * 있습니다. DB 컬럼과 RowMapper 에는 존재하므로 서버를 최신으로 재배포하면
 * 별도 수정 없이 getMathSubjectsByCurriculum 의 필터가 동작합니다.
 */
export interface HighSchoolMathSubject {
    id: number;
    title: string;
    subject: string;
    category?: string;
    schoolGrade?: string;
    writer?: string | null;
    curriculumType?: string | null;
}
export interface GetMathSubjectsByCurriculumOptions {
    /** 기본 엔드포인트를 다른 주소로 바꿉니다. */
    url?: string;
    /** fetch 를 쓸 수 없는 환경에서 주입하는 조회 함수. */
    fetchFn?: (url: string) => Promise<unknown>;
}
/**
 * 지정한 curriculumType(교육과정)에 속한 고등 수학 과목 목록을 반환합니다.
 *
 * 엔드포인트에서 전체 목록을 받아 로컬에서 걸러냅니다 (서버에 필터를 요청하지 않습니다).
 * curriculumType 은 개정 연도 문자열이며 "2022" 또는 "2015" 를 넘깁니다.
 * 생략하거나 미지정 값(null, "null", "")을 넘기면 교육과정이 지정되지 않은
 * 레거시 과목들을 반환합니다.
 *
 * @example
 * const y2022 = await getMathSubjectsByCurriculum("2022");
 * const legacy = await getMathSubjectsByCurriculum();
 */
export declare function getMathSubjectsByCurriculum(curriculumType?: string | null, options?: GetMathSubjectsByCurriculumOptions): Promise<HighSchoolMathSubject[]>;
