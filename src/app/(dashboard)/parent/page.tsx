import Announcement from "@/components/Announcement";
import BigCalendar from "@/components/BigCalendar";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import { getUserId } from "@/lib/helpers";
import { prisma } from "@/lib/prisma";
import React from "react";

export default async function ParentPage() {
  const userId = await getUserId();

  const students = await prisma.student.findMany({
    where: { parentId: userId },
    select: { id: true, name: true, surname: true, classId: true },
  });

  return (
    <div className="flex flex-col xl:flex-row flex-1 p-4 gap-4">
      {/* Left */}
      <div className="xl:w-2/3 w-full">
        {students.map((student) => (
          <div key={student.id} className="h-full bg-white p-4 rounded-md">
            <h1 className="text-xl font-semibold">
              Schedule ({student.name + " " + student.surname})
            </h1>
            <BigCalendarContainer type="classId" id={student.classId} />
          </div>
        ))}
      </div>
      {/* Right */}
      <div className="flex flex-col xl:w-1/3 w-full gap-8">
        <Announcement />
      </div>
    </div>
  );
}
