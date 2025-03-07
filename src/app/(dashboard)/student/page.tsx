"use client";

import Announcement from "@/components/Announcement";
import BigCalendar from "@/components/BigCalendar";
import EventCalendar from "@/components/EventCalendar";
import React from "react";

export default function StudentPage() {
  return (
    <div className="flex flex-col xl:flex-row p-4 gap-4">
      {/* Left */}
      <div className="xl:w-2/3 w-full">
        <div className="h-full bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Schedule (4A)</h1>
          <BigCalendar />
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
