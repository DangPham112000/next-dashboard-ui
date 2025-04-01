"use client";

import React, { useState } from "react";
import { Calendar, momentLocalizer, View, Views } from "react-big-calendar";
import moment from "moment";

const localizer = momentLocalizer(moment);

export default function BigCalendar({
  data,
}: {
  data: { title: string; start: Date; end: Date }[];
}) {
  const [view, setView] = useState<View>(Views.WORK_WEEK);
  const changeViewHandling = (selectedView: View) => {
    setView(selectedView);
  };

  return (
    <Calendar
      localizer={localizer}
      events={data}
      startAccessor="start"
      endAccessor="end"
      views={["work_week", "day"]}
      view={view}
      style={{ height: "98%" }}
      onView={changeViewHandling}
      min={new Date(2025, 1, 1, 8, 0, 0, 0)}
      max={new Date(2025, 1, 1, 17, 0, 0, 0)}
    />
  );
}
