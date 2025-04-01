import { auth } from "@clerk/nextjs/server";
import { getCurrentWorkWeek } from "./utils";

export const getUserRole: () => Promise<string> = async () => {
  const { sessionClaims } = await auth();
  return (sessionClaims?.metadata as { role: string })?.role;
};

export const getUserId: () => Promise<string> = async () => {
  const { userId } = await auth();
  return userId!;
};

export const adjustScheduleToCurrentWeek = (
  lessons: { title: string; start: Date; end: Date }[]
): { title: string; start: Date; end: Date }[] => {
  const startOfWeek = getCurrentWorkWeek();

  return lessons.map((lesson) => {
    const { title, start, end } = lesson;
    const lessonDayOfWeek = start.getDay();

    const dayFromMonday = lessonDayOfWeek === 0 ? 6 : lessonDayOfWeek - 1;

    const adjustedStartDate = new Date(startOfWeek);
    adjustedStartDate.setDate(startOfWeek.getDate() + dayFromMonday);
    adjustedStartDate.setHours(
      start.getHours(),
      start.getMinutes(),
      start.getSeconds()
    );

    const adjustedEndtDate = new Date(adjustedStartDate);
    adjustedEndtDate.setHours(
      end.getHours(),
      end.getMinutes(),
      end.getSeconds()
    );

    return {
      title,
      start: adjustedStartDate,
      end: adjustedEndtDate,
    };
  });
};
