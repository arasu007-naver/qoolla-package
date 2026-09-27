/**
 * Go3 Math Service (Qoolla) 수학 과목 및 챕터/커리큘럼 정의
 */

export type MathSubjectKey =
  | "BASIC_MATH"
  | "HIGHSCHOOL_MATH_BASE_A"
  | "HIGHSCHOOL_MATH_BASE_B"
  | "HIGHSCHOOL_MATH1"
  | "HIGHSCHOOL_MATH2"
  | "COMMON_MATH"
  | "STATISTICS"
  | "CALCULUS"
  | "GEOMETRY";

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
export const MATH_SUBJECTS: MathSubject[] = [
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
export const MATH_CHAPTERS: ChapterInfo[] = [
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
export const MATH_MAJORS: MathMajor[] = [
  { value: "A", label: "문과" },
  { value: "B", label: "이과" },
  { value: "CALCULUS", label: "미적분" },
  { value: "STATISTICS", label: "확률과 통계" },
  { value: "GEOMETRY", label: "기하" },
];

/**
 * 과목 목록 전체를 반환합니다.
 */
export function getMathSubjects(): MathSubject[] {
  return MATH_SUBJECTS;
}

/**
 * ID(숫자 또는 문자열)로 과목을 검색합니다.
 */
export function getMathSubjectById(id: number | string): MathSubject | undefined {
  const numericId = typeof id === "string" ? parseInt(id, 10) : id;
  return MATH_SUBJECTS.find((s) => s.id === numericId);
}

/**
 * 과목 코드(value, 예: 'BASIC_MATH', 'HIGHSCHOOL_MATH1' 등)로 과목을 검색합니다.
 */
export function getMathSubjectByValue(value: string): MathSubject | undefined {
  if (!value) return undefined;
  const upperValue = value.trim().toUpperCase();
  return MATH_SUBJECTS.find((s) => s.value.toUpperCase() === upperValue);
}

/**
 * ID 또는 Value 값으로 과목을 검색합니다.
 */
export function getMathSubject(identifier: string | number): MathSubject | undefined {
  if (identifier == null) return undefined;
  if (typeof identifier === "number") {
    return getMathSubjectById(identifier);
  }
  const numeric = parseInt(identifier, 10);
  if (!isNaN(numeric) && String(numeric) === identifier.trim()) {
    const foundById = getMathSubjectById(numeric);
    if (foundById) return foundById;
  }
  return getMathSubjectByValue(identifier);
}

/**
 * ID 또는 Value 값으로부터 과목의 표시 레이블(한글명)을 반환합니다.
 */
export function getMathSubjectLabel(identifier: string | number, fallback = ""): string {
  const subject = getMathSubject(identifier);
  return subject ? subject.label : fallback;
}

/**
 * 특정 과목(ID 또는 Value)에 속한 챕터 목록을 반환하거나, 파라미터가 없으면 전체 챕터 목록을 반환합니다.
 */
export function getMathChapters(subjectIdentifier?: string | number): ChapterInfo[] {
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
export function getMathChapterById(chapterId: number | string): ChapterInfo | undefined {
  const numericId = typeof chapterId === "string" ? parseInt(chapterId, 10) : chapterId;
  return MATH_CHAPTERS.find((c) => c.id === numericId);
}

/**
 * 수능 계열/선택 과목 목록을 반환합니다.
 */
export function getMathMajors(): MathMajor[] {
  return MATH_MAJORS;
}

/* ─────────────────────────────────────────────
 * 교육과정별 고등 수학 과목 조회 (서버 조회)
 *
 * 위의 MATH_SUBJECTS 는 정적 정의이고, 아래는 서버가 관리하는
 * 고등 수학 과목 목록을 curriculumType 으로 걸러 가져옵니다.
 * ───────────────────────────────────────────── */

/**
 * 고등 수학 과목 목록 기본 엔드포인트.
 */
export const HIGHSCHOOL_MATH_SUBJECTS_URL =
  "https://api-v2.qoolla.com/public/getAllHighSchoolMathSubjects";

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
 * curriculumType 미지정을 뜻하는 값. 레거시 데이터에 null, 문자열 "null", 빈 문자열이 섞여 있습니다.
 */
function isUnsetCurriculumType(curriculumType?: string | null): boolean {
  return curriculumType == null || curriculumType === "null" || curriculumType === "";
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
export async function getMathSubjectsByCurriculum(
  curriculumType?: string | null,
  options?: GetMathSubjectsByCurriculumOptions,
): Promise<HighSchoolMathSubject[]> {
  const url = options?.url ?? HIGHSCHOOL_MATH_SUBJECTS_URL;

  let data: unknown;
  if (options?.fetchFn) {
    data = await options.fetchFn(url);
  } else if (typeof fetch === "function") {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`HTTP Error ${res.status}: ${res.statusText}`);
    }
    data = await res.json();
  } else {
    throw new Error("fetch 함수가 제공되지 않았습니다.");
  }

  const result = (data as { result?: HighSchoolMathSubject[] } | null)?.result;
  const list: HighSchoolMathSubject[] = Array.isArray(result) ? result : [];

  if (isUnsetCurriculumType(curriculumType)) {
    return list.filter((subj) => isUnsetCurriculumType(subj.curriculumType));
  }
  return list.filter((subj) => subj.curriculumType === curriculumType);
}
