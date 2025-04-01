import { getUserId, getUserRole } from "@/lib/helpers";
import { prisma } from "@/lib/prisma";
import React from "react";

export default async function Announcement() {
  const userId = await getUserId();
  const role = await getUserRole();

  const roleCondition: { [key: string]: any } = {
    teacher: { lessons: { some: { teacherId: userId } } },
    student: { students: { some: { id: userId } } },
    parent: { students: { some: { parentId: userId } } },
  };

  const announcements = await prisma.announcement.findMany({
    take: 3,
    orderBy: { date: "desc" },
    where: {
      ...(role !== "admin"
        ? { OR: [{ classId: null }, { class: roleCondition[role] || {} }] }
        : {}),
    },
  });

  return (
    <div className="bg-white rounded-md p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Annoucements</h1>
        <span className="text-xs text-gray-400">View All</span>
      </div>
      <div className="flex flex-col gap-4 mt-4">
        <AnnouncementCard data={announcements[0]} color="stYellowLight" />
        <AnnouncementCard data={announcements[1]} color="stSkyLight" />
        <AnnouncementCard data={announcements[2]} color="stPurpleLight" />
      </div>
    </div>
  );
}

function AnnouncementCard({
  data,
  color,
}: {
  data: { title: string; description: string; date: Date } | undefined;
  color: string;
}) {
  return (
    <>
      {data && (
        <div className={`bg-${color} rounded-md p-4`}>
          <div className="flex items-center justify-between">
            <h2 className="font-medium">{data.title}</h2>
            <span className="text-xs text-gray-400 bg-white rounded-md p-1">
              {new Intl.DateTimeFormat("en-US").format(data.date)}
            </span>
          </div>
          <p className="text-sm text-gray-400 mt-1">{data.description}</p>
        </div>
      )}
    </>
  );
}
