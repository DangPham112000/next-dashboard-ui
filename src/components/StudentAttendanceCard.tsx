import { prisma } from "@/lib/prisma";
import React from "react";

export default async function StudentAttendanceCard({ id }: { id: string }) {
  const attendances = await prisma.attendance.findMany({
    where: {
      studentId: id,
      date: { gte: new Date(new Date().getFullYear(), 0, 1) },
    },
  });

  const totalDays = attendances.length;
  const totalPresentDays = attendances.filter((att) => att.present).length;
  const percent = (totalPresentDays / totalDays) * 100;

  return (
    <div className="">
      <h1 className="text-xl font-semibold">{percent || "-"}%</h1>
      <div className="text-sm text-gray-400">Attendance</div>
    </div>
  );
}
