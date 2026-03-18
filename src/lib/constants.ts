export const dayOrder = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
] as const;

export const sessionTypeOptions = ["LECTURE", "TUTORIAL", "LAB", "WORKSHOP", "OTHER"] as const;
export const taskStatusOptions = ["TODO", "IN_PROGRESS", "DONE"] as const;
export const taskPriorityOptions = ["LOW", "MEDIUM", "HIGH"] as const;
export const taskCategoryOptions = ["GENERAL", "HOMEWORK", "REVISION", "ADMIN", "PROJECT"] as const;
export const assessmentTypeOptions = [
  "HOMEWORK",
  "ASSIGNMENT",
  "QUIZ",
  "TEST",
  "EXAM",
  "PRESENTATION",
] as const;
export const assessmentStatusOptions = ["PENDING", "SUBMITTED", "COMPLETED"] as const;
export const fileCategoryOptions = ["LECTURE_NOTE", "TUTORIAL", "ASSIGNMENT", "PAST_YEAR", "OTHER"] as const;
export const resultStatusOptions = ["EXPECTED", "RELEASED"] as const;
export const letterGradeOptions = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "F"] as const;
export const studentCoreStorageKey = "studentcore-browser-state";
