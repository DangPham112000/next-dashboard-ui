import Announcement from "@/components/Announcement";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import EventCalendar from "@/components/EventCalendar";
import { getUserId } from "@/lib/helpers";
import { prisma } from "@/lib/prisma";
import React from "react";

export default async function StudentPage() {
  const userId = await getUserId();

  const student = await prisma.student.findUnique({
    where: { id: userId },
    select: { classId: true },
  });

  return (
    <div className="flex flex-col xl:flex-row p-4 gap-4">
      {/* Left */}
      <div className="xl:w-2/3 w-full">
        <div className="h-full bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Schedule (4A)</h1>
          <BigCalendarContainer type="classId" id={student?.classId!} />
        </div>
      </div>
      {/* Right */}
      <div className="flex flex-col xl:w-1/3 w-full gap-8">
        <EventCalendar />
        <Announcement />
      </div>
    </div>
  );
}
