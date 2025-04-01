import Announcement from "@/components/Announcement";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import { getUserId } from "@/lib/helpers";
import React from "react";

export default async function TeacherPage() {
  const userId = await getUserId();
  
  return (
    <div className="flex flex-col xl:flex-row flex-1 p-4 gap-4">
      {/* Left */}
      <div className="xl:w-2/3 w-full">
        <div className="h-full bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Schedule (4A)</h1>
          <BigCalendarContainer type="teacherId" id={userId} />
        </div>
      </div>
      {/* Right */}
      <div className="flex flex-col xl:w-1/3 w-full gap-8">
        <Announcement />
      </div>
    </div>
  );
}
