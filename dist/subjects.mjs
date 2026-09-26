/**
 * Go3 Math Service (Qoolla) 수학 과목 및 챕터/커리큘럼 정의
 */
/**
 * Go3 Math Service (Qoolla) 전체 과목 및 하위 챕터 목록
 */
export const MATH_SUBJECTS = [
    {
        label: "기초 수학",
        value: "BASIC_MATH",
        id: 11,
        chapters: [
            { id: 31, title: "도형 기본", subjectId: 11, subject: "BASIC_MATH", subjectTitle: "기초 수학" },
            { id: 32, title: "정수 기본", subjectId: 11, subject: "BASIC_MATH", subjectTitle: "기초 수학" },
            { id: 33, title: "문자와 식 기본", subjectId: 11, subject: "BASIC_MATH", subjectTitle: "기초 수학" },
            { id: 34, title: "경우의 수 기본", subjectId: 11, subject: "BASIC_MATH", subjectTitle: "기초 수학" },
        ],
    },
    {
        label: "고등 수학(상)",
        value: "HIGHSCHOOL_MATH_BASE_A",
        id: 1,
        chapters: [
            { id: 1, title: "고등 다항식", subjectId: 1, subject: "HIGHSCHOOL_MATH_BASE_A", subjectTitle: "고등 수학(상)" },
            { id: 2, title: "방정식과 부등식", subjectId: 1, subject: "HIGHSCHOOL_MATH_BASE_A", subjectTitle: "고등 수학(상)" },
            { id: 3, title: "도형의 방정식", subjectId: 1, subject: "HIGHSCHOOL_MATH_BASE_A", subjectTitle: "고등 수학(상)" },
            { id: 4, title: "집합과 명제", subjectId: 1, subject: "HIGHSCHOOL_MATH_BASE_A", subjectTitle: "고등 수학(상)" },
            { id: 5, title: "함수와 그래프", subjectId: 1, subject: "HIGHSCHOOL_MATH_BASE_A", subjectTitle: "고등 수학(상)" },
            { id: 6, title: "경우의 수", subjectId: 1, subject: "HIGHSCHOOL_MATH_BASE_A", subjectTitle: "고등 수학(상)" },
            { id: 13, title: "순열과 조합", subjectId: 1, subject: "HIGHSCHOOL_MATH_BASE_A", subjectTitle: "고등 수학(상)" },
        ],
    },
    {
        label: "고등 수학(하)",
        value: "HIGHSCHOOL_MATH_BASE_B",
        id: 10,
        chapters: [
            { id: 4, title: "집합과 명제", subjectId: 10, subject: "HIGHSCHOOL_MATH_BASE_B", subjectTitle: "고등 수학(하)" },
            { id: 5, title: "함수와 그래프", subjectId: 10, subject: "HIGHSCHOOL_MATH_BASE_B", subjectTitle: "고등 수학(하)" },
            { id: 6, title: "경우의 수", subjectId: 10, subject: "HIGHSCHOOL_MATH_BASE_B", subjectTitle: "고등 수학(하)" },
            { id: 13, title: "순열과 조합", subjectId: 10, subject: "HIGHSCHOOL_MATH_BASE_B", subjectTitle: "고등 수학(하)" },
        ],
    },
    {
        label: "수학 1",
        value: "HIGHSCHOOL_MATH1",
        id: 2,
        chapters: [
            { id: 7, title: "지수함수와 로그함수", subjectId: 2, subject: "HIGHSCHOOL_MATH1", subjectTitle: "수학 1" },
            { id: 8, title: "삼각함수", subjectId: 2, subject: "HIGHSCHOOL_MATH1", subjectTitle: "수학 1" },
            { id: 9, title: "수열", subjectId: 2, subject: "HIGHSCHOOL_MATH1", subjectTitle: "수학 1" },
        ],
    },
    {
        label: "수학 2",
        value: "HIGHSCHOOL_MATH2",
        id: 3,
        chapters: [
            { id: 10, title: "함수의 극한과 연속", subjectId: 3, subject: "HIGHSCHOOL_MATH2", subjectTitle: "수학 2" },
            { id: 11, title: "다항함수의 미분법", subjectId: 3, subject: "HIGHSCHOOL_MATH2", subjectTitle: "수학 2" },
            { id: 12, title: "다항함수의 적분법", subjectId: 3, subject: "HIGHSCHOOL_MATH2", subjectTitle: "수학 2" },
        ],
    },
    {
        label: "과목 공통",
        value: "COMMON_MATH",
        id: 12,
        chapters: [],
    },
    {
        label: "확률과 통계",
        value: "STATISTICS",
        id: 6,
        chapters: [
            { id: 21, title: "순열과 조합(II)", subjectId: 6, subject: "STATISTICS", subjectTitle: "확률과 통계" },
            { id: 14, title: "확률", subjectId: 6, subject: "STATISTICS", subjectTitle: "확률과 통계" },
            { id: 15, title: "통계", subjectId: 6, subject: "STATISTICS", subjectTitle: "확률과 통계" },
        ],
    },
    {
        label: "미적분",
        value: "CALCULUS",
        id: 4,
        chapters: [
            { id: 27, title: "수열의 극한", subjectId: 4, subject: "CALCULUS", subjectTitle: "미적분" },
            { id: 22, title: "미분법", subjectId: 4, subject: "CALCULUS", subjectTitle: "미적분" },
            { id: 23, title: "적분법", subjectId: 4, subject: "CALCULUS", subjectTitle: "미적분" },
        ],
    },
    {
        label: "기하",
        value: "GEOMETRY",
        id: 5,
        chapters: [
            { id: 16, title: "이차곡선", subjectId: 5, subject: "GEOMETRY", subjectTitle: "기하" },
            { id: 17, title: "벡터", subjectId: 5, subject: "GEOMETRY", subjectTitle: "기하" },
            { id: 18, title: "공간도형", subjectId: 5, subject: "GEOMETRY", subjectTitle: "기하" },
        ],
    },
];
/**
 * MATH_AGENDA alias for MATH_SUBJECTS (하위 호환성 유지)
 */
export const MATH_AGENDA = MATH_SUBJECTS;
/**
 * 전체 챕터 플랫 목록
 */
export const MATH_CHAPTERS = [
    { title: "도형 기본", id: 31, subjectId: 11, subject: "BASIC_MATH", subjectTitle: "기초 수학" },
    { title: "정수 기본", id: 32, subjectId: 11, subject: "BASIC_MATH", subjectTitle: "기초 수학" },
    { title: "문자와 식 기본", id: 33, subjectId: 11, subject: "BASIC_MATH", subjectTitle: "기초 수학" },
    { title: "경우의 수 기본", id: 34, subjectId: 11, subject: "BASIC_MATH", subjectTitle: "기초 수학" },
    { title: "고등 다항식", id: 1, subjectId: 1, subject: "HIGHSCHOOL_MATH_BASE_A", subjectTitle: "고등 수학(상)" },
    { title: "방정식과 부등식", id: 2, subjectId: 1, subject: "HIGHSCHOOL_MATH_BASE_A", subjectTitle: "고등 수학(상)" },
    { title: "도형의 방정식", id: 3, subjectId: 1, subject: "HIGHSCHOOL_MATH_BASE_A", subjectTitle: "고등 수학(상)" },
    { title: "집합과 명제", id: 4, subjectId: 10, subject: "HIGHSCHOOL_MATH_BASE_B", subjectTitle: "고등 수학(하)" },
    { title: "함수와 그래프", id: 5, subjectId: 10, subject: "HIGHSCHOOL_MATH_BASE_B", subjectTitle: "고등 수학(하)" },
    { title: "경우의 수", id: 6, subjectId: 10, subject: "HIGHSCHOOL_MATH_BASE_B", subjectTitle: "고등 수학(하)" },
    { title: "순열과 조합", id: 13, subjectId: 10, subject: "HIGHSCHOOL_MATH_BASE_B", subjectTitle: "고등 수학(하)" },
    { title: "지수함수와 로그함수", id: 7, subjectId: 2, subject: "HIGHSCHOOL_MATH1", subjectTitle: "수학 1" },
    { title: "삼각함수", id: 8, subjectId: 2, subject: "HIGHSCHOOL_MATH1", subjectTitle: "수학 1" },
    { title: "수열", id: 9, subjectId: 2, subject: "HIGHSCHOOL_MATH1", subjectTitle: "수학 1" },
    { title: "함수의 극한과 연속", id: 10, subjectId: 3, subject: "HIGHSCHOOL_MATH2", subjectTitle: "수학 2" },
    { title: "다항함수의 미분법", id: 11, subjectId: 3, subject: "HIGHSCHOOL_MATH2", subjectTitle: "수학 2" },
    { title: "다항함수의 적분법", id: 12, subjectId: 3, subject: "HIGHSCHOOL_MATH2", subjectTitle: "수학 2" },
    { title: "수열의 극한", id: 27, subjectId: 4, subject: "CALCULUS", subjectTitle: "미적분" },
    { title: "미분법", id: 22, subjectId: 4, subject: "CALCULUS", subjectTitle: "미적분" },
    { title: "적분법", id: 23, subjectId: 4, subject: "CALCULUS", subjectTitle: "미적분" },
    { title: "이차곡선", id: 16, subjectId: 5, subject: "GEOMETRY", subjectTitle: "기하" },
    { title: "벡터", id: 17, subjectId: 5, subject: "GEOMETRY", subjectTitle: "기하" },
    { title: "공간도형", id: 18, subjectId: 5, subject: "GEOMETRY", subjectTitle: "기하" },
    { title: "순열과 조합(II)", id: 21, subjectId: 6, subject: "STATISTICS", subjectTitle: "확률과 통계" },
    { title: "확률", id: 14, subjectId: 6, subject: "STATISTICS", subjectTitle: "확률과 통계" },
    { title: "통계", id: 15, subjectId: 6, subject: "STATISTICS", subjectTitle: "확률과 통계" },
];
/**
 * 수능/고등 수학 계열 및 선택 과목
 */
export const MATH_MAJORS = [
    { value: "A", label: "문과" },
    { value: "B", label: "이과" },
    { value: "CALCULUS", label: "미적분" },
    { value: "STATISTICS", label: "확률과 통계" },
    { value: "GEOMETRY", label: "기하" },
];
/**
 * 과목 목록 전체를 반환합니다.
 */
export function getMathSubjects() {
    return MATH_SUBJECTS;
}
/**
 * ID(숫자 또는 문자열)로 과목을 검색합니다.
 */
export function getMathSubjectById(id) {
    const numericId = typeof id === "string" ? parseInt(id, 10) : id;
    return MATH_SUBJECTS.find((s) => s.id === numericId);
}
/**
 * 과목 코드(value, 예: 'BASIC_MATH', 'HIGHSCHOOL_MATH1' 등)로 과목을 검색합니다.
 */
export function getMathSubjectByValue(value) {
    if (!value)
        return undefined;
    const upperValue = value.trim().toUpperCase();
    return MATH_SUBJECTS.find((s) => s.value.toUpperCase() === upperValue);
}
/**
 * ID 또는 Value 값으로 과목을 검색합니다.
 */
export function getMathSubject(identifier) {
    if (identifier == null)
        return undefined;
    if (typeof identifier === "number") {
        return getMathSubjectById(identifier);
    }
    const numeric = parseInt(identifier, 10);
    if (!isNaN(numeric) && String(numeric) === identifier.trim()) {
        const foundById = getMathSubjectById(numeric);
        if (foundById)
            return foundById;
    }
    return getMathSubjectByValue(identifier);
}
/**
 * ID 또는 Value 값으로부터 과목의 표시 레이블(한글명)을 반환합니다.
 */
export function getMathSubjectLabel(identifier, fallback = "") {
    const subject = getMathSubject(identifier);
    return subject ? subject.label : fallback;
}
/**
 * 특정 과목(ID 또는 Value)에 속한 챕터 목록을 반환하거나, 파라미터가 없으면 전체 챕터 목록을 반환합니다.
 */
export function getMathChapters(subjectIdentifier) {
    if (subjectIdentifier == null) {
        return MATH_CHAPTERS;
    }
    const subject = getMathSubject(subjectIdentifier);
    if (subject) {
        return subject.chapters;
    }
    return [];
}
/**
 * 챕터 ID로 특정 챕터 정보를 검색합니다.
 */
export function getMathChapterById(chapterId) {
    const numericId = typeof chapterId === "string" ? parseInt(chapterId, 10) : chapterId;
    return MATH_CHAPTERS.find((c) => c.id === numericId);
}
/**
 * 수능 계열/선택 과목 목록을 반환합니다.
 */
export function getMathMajors() {
    return MATH_MAJORS;
}
