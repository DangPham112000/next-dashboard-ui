import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { getUserId, getUserRole } from "@/lib/helpers";
import { prisma } from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/setting";
import { Assignment, Class, Prisma, Subject, Teacher } from "@prisma/client";
import Image from "next/image";
import React from "react";

type AssignmentList = Assignment & {
  lesson: {
    teacher: Teacher;
    class: Class;
    subject: Subject;
  };
};

export default async function AssignmentListPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const role = await getUserRole();

  const columns = [
    {
      header: "Subject Name",
      accessor: "name",
    },
    {
      header: "Class",
      accessor: "class",
    },
    {
      header: "Teacher",
      accessor: "teacher",
      className: "hidden md:table-cell",
    },
    {
      header: "Due Date",
      accessor: "dueDate",
      className: "hidden md:table-cell",
    },
    ...(role === "admin" || role === "teacher"
      ? [
          {
            header: "Actions",
            accessor: "actions",
          },
        ]
      : []),
  ];

  const renderRow = (item: AssignmentList) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-stPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.lesson.subject.name}</h3>
        </div>
      </td>
      <td>{item.lesson.class.name}</td>
      <td className="md:table-cell hidden">
        {item.lesson.teacher.name + " " + item.lesson.teacher.surname}
      </td>
      <td className="md:table-cell hidden">
        {new Intl.DateTimeFormat("en-US").format(item.dueDate)}
      </td>
      <td>
        <div className="flex items-center gap-2">
          {(role === "admin" || role === "teacher") && (
            <>
              <FormModal table="assignment" type="update" data={item} />
              <FormModal table="assignment" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );

  const { page = 1, ...queryParams } = searchParams;
  const pageNum = +page;
  const queryDb: Prisma.AssignmentWhereInput = {};
  queryDb.lesson = {};
  // URL params condition
  for (const [key, value] of Object.entries(queryParams)) {
    if (!value) continue;
    switch (key) {
      case "teacherId": {
        queryDb.lesson.teacherId = value;
        break;
      }
      case "classId": {
        queryDb.lesson.classId = parseInt(value);
        break;
      }
      case "search": {
        queryDb.lesson.subject = {
          name: {
            contains: value,
            mode: "insensitive",
          },
        };
        break;
      }
    }
  }

  const currentUserId = await getUserId();
  // role condition
  switch (role) {
    case "admin":
      break;
    case "teacher":
      queryDb.lesson.teacherId = currentUserId;
      break;
    case "student":
      {
        queryDb.lesson.class = {
          students: { some: { id: currentUserId } },
        };
      }
      break;
    case "parent":
      {
        queryDb.lesson.class = {
          students: { some: { parentId: currentUserId } },
        };
      }
      break;
    default:
      break;
  }

  const [assignmentsData, length] = await prisma.$transaction([
    prisma.assignment.findMany({
      where: queryDb,
      include: {
        lesson: {
          select: {
            subject: { select: { name: true } },
            teacher: { select: { name: true, surname: true } },
            class: { select: { name: true } },
          },
        },
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (pageNum - 1),
    }),
    prisma.assignment.count({ where: queryDb }),
  ]);

  return (
    <div className="flex-1 rounded-md bg-white mt-0 m-4 p-4">
      {/* Top */}
      <div className="flex items-center justify-between">
        <h1 className="md:block hidden text-lg font-semibold">
          All assignments
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
            {role === "admin" && <FormModal table="assignment" type="create" />}
          </div>
        </div>
      </div>
      {/* List */}
      <Table columns={columns} renderRow={renderRow} data={assignmentsData} />
      {/* Pagination */}
      <Pagination page={pageNum} count={length} />
    </div>
  );
}
