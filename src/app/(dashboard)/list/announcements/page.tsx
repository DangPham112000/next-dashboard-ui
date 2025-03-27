import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { getUserId, getUserRole } from "@/lib/helpers";
import { prisma } from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/setting";
import { Announcement, Class, Prisma } from "@prisma/client";
import Image from "next/image";
import React from "react";

type AnnouncementList = Announcement & { class: Class };

export default async function AnnoucementListPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const role = await getUserRole();

  const columns = [
    {
      header: "Title",
      accessor: "title",
    },
    {
      header: "Class",
      accessor: "class",
    },
    {
      header: "Date",
      accessor: "date",
      className: "hidden md:table-cell",
    },
    ...(role === "admin"
      ? [
          {
            header: "Actions",
            accessor: "actions",
          },
        ]
      : []),
  ];

  const renderRow = (item: AnnouncementList) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-stPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.title}</h3>
        </div>
      </td>
      <td>{item.class?.name || "-"}</td>
      <td className="md:table-cell hidden">
        {new Intl.DateTimeFormat("en-US").format(item.date)}
      </td>
      <td>
        <div className="flex items-center gap-2">
          {role === "admin" && (
            <>
              <FormModal table="announcement" type="update" data={item} />
              <FormModal table="announcement" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );

  const { page = 1, ...queryParams } = searchParams;
  const pageNum = +page;
  const queryDb: Prisma.AnnouncementWhereInput = {};
  for (const [key, value] of Object.entries(queryParams)) {
    if (!value) continue;
    switch (key) {
      case "search": {
        queryDb.title = { contains: value, mode: "insensitive" };
        break;
      }
    }
  }

  // Role condition
  const currentUserId = await getUserId();
  const roleCondition = {
    admin: {},
    teacher: { lessons: { some: { teacherId: currentUserId } } },
    student: { students: { some: { id: currentUserId } } },
    parent: { students: { some: { parentId: currentUserId } } },
  };
  queryDb.OR = [
    { classId: null },
    { class: roleCondition[role as keyof typeof roleCondition] },
  ];

  const [announcementsData, length] = await prisma.$transaction([
    prisma.announcement.findMany({
      where: queryDb,
      include: {
        class: { select: { name: true } },
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (pageNum - 1),
    }),
    prisma.announcement.count({ where: queryDb }),
  ]);

  return (
    <div className="flex-1 rounded-md bg-white mt-0 m-4 p-4">
      {/* Top */}
      <div className="flex items-center justify-between">
        <h1 className="md:block hidden text-lg font-semibold">
          All annoucement
        </h1>
        <div className="flex md:flex-row flex-col items-center gap-4 md:w-auto w-full">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-stYellow">
              <Image src="/filter.png" alt="filter" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-stYellow">
              <Image src="/sort.png" alt="filter" width={14} height={14} />
            </button>
            {role === "admin" && (
              <FormModal table="announcement" type="create" />
            )}
          </div>
        </div>
      </div>
      {/* List */}
      <Table columns={columns} renderRow={renderRow} data={announcementsData} />
      {/* Pagination */}
      <Pagination page={pageNum} count={length} />
    </div>
  );
}
