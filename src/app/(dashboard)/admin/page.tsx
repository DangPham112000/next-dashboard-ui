import Announcement from "@/components/Announcement";
import AttendanceChartContainer from "@/components/AttendanceChartContainer";
import CountChartContainer from "@/components/CountChartContainer";
import EventCalendarContainer from "@/components/EventCalendarContainer";
import FinanceChart from "@/components/FinanceChart";
import UserCard from "@/components/UserCard";
import React from "react";

export default function AdminPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  return (
    <div className="flex flex-col md:flex-row p-4 gap-4">
      {/* Left */}
      <div className="flex flex-col lg:w-2/3 w-full gap-8">
        {/* User card */}
        <div className="flex flex-wrap justify-between gap-4">
          <UserCard type="student" />
          <UserCard type="teacher" />
          <UserCard type="parent" />
          <UserCard type="admin" />
        </div>
        {/* Middle charts */}
        <div className="flex md:flex-row flex-col gap-4">
          {/* Count chart */}
          <div className="lg:w-1/3 w-full h-[450px]">
            <CountChartContainer />
          </div>
          {/* Attendance chart */}
          <div className="lg:w-2/3 w-full h-[450px]">
            <AttendanceChartContainer />
          </div>
        </div>
        {/* Bottom chart */}
        <div className="w-full h-[500px]">
          <FinanceChart />
        </div>
      </div>
      {/* Right */}
      <div className="flex flex-col lg:w-1/3 w-full gap-8">
        <EventCalendarContainer searchParams={searchParams} />
        <Announcement />
      </div>
    </div>
  );
}
