import Announcement from "@/components/Announcement";
import BigCalendar from "@/components/BigCalendar";
import React from "react";

export default function ParentPage() {
  return (
    <div className="flex flex-col xl:flex-row flex-1 p-4 gap-4">
      {/* Left */}
      <div className="xl:w-2/3 w-full">
        <div className="h-full bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Schedule (Thinh Tran)</h1>
          <BigCalendar />
        </div>
      </div>
      {/* Right */}
      <div className="flex flex-col xl:w-1/3 w-full gap-8">
        <Announcement />
      </div>
    </div>
  );
}
