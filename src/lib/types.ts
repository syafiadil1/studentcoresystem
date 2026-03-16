import type {
  AssessmentStatus as PrismaAssessmentStatus,
  AssessmentType as PrismaAssessmentType,
  FileCategory as PrismaFileCategory,
  TaskStatus as PrismaTaskStatus,
} from "@prisma/client";

export type AssessmentType = Lowercase<PrismaAssessmentType>;
export type TaskStatus = Lowercase<PrismaTaskStatus>;
export type AssessmentStatus = Lowercase<PrismaAssessmentStatus>;
export type FileCategory = Lowercase<PrismaFileCategory>;

export type TodayClassCard = {
  id: string;
  courseCode: string;
  courseName: string;
  startTime: string;
  endTime: string;
  location: string;
  sessionType: string;
  color: string;
};

export type UpcomingDeadlineItem = {
  id: string;
  kind: "task" | "assessment";
  title: string;
  courseName: string;
  dueAt: string;
  status: string;
};
