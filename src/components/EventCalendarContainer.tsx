import React from "react";
import EventCalendar from "./EventCalendar";
import Image from "next/image";
import EventList from "./EventList";

export default function EventCalendarContainer({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const { date } = searchParams;

  return (
    <div className="bg-white rounded-md p-4">
      <EventCalendar />
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold my-4">Events</h1>
        <Image src="/moreDark.png" alt="more" width={20} height={20} />
      </div>
      <div className="flex flex-col gap-4">
        <EventList dateParam={date} />
      </div>
    </div>
  );
}
