import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { role } from "@/lib/data";
import { prisma } from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/setting";
import { Class, Exam, Prisma, Subject, Teacher } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type ExamList = Exam & {
  lesson: {
    subject: Subject;
    class: Class;
    teacher: Teacher;
  };
};

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
    header: "Date",
    accessor: "date",
    className: "hidden md:table-cell",
  },
  {
    header: "Actions",
    accessor: "actions",
  },
];

const renderRow = (item: ExamList) => (
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
      {new Intl.DateTimeFormat("en-US").format(item.startTime)}
    </td>
    <td>
      <div className="flex items-center gap-2">
        <Link href={`/list/teachers/${item.id}`}>
          <button className="flex items-center justify-center rounded-full bg-stSky w-7 h-7">
            <Image src="/view.png" alt="view" width={16} height={16} />
          </button>
        </Link>
        {role === "admin" && (
          <FormModal table="exam" type="delete" id={item.id} />
        )}
      </div>
    </td>
  </tr>
);

export default async function ExamListPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const { page = 1, ...queryParams } = searchParams;
  const pageNum = +page;

  const queryDb: Prisma.ExamWhereInput = {};
  queryDb.lesson = {};
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

  const [examsData, length] = await prisma.$transaction([
    prisma.exam.findMany({
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
    prisma.exam.count({ where: queryDb }),
  ]);

  return (
    <div className="flex-1 rounded-md bg-white mt-0 m-4 p-4">
      {/* Top */}
      <div className="flex items-center justify-between">
        <h1 className="md:block hidden text-lg font-semibold">All exams</h1>
        <div className="flex md:flex-row flex-col items-center gap-4 md:w-auto w-full">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-stYellow">
              <Image src="/filter.png" alt="filter" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-stYellow">
              <Image src="/sort.png" alt="filter" width={14} height={14} />
            </button>
            {role === "admin" && <FormModal table="exam" type="create" />}
          </div>
        </div>
      </div>
      {/* List */}
      <Table columns={columns} renderRow={renderRow} data={examsData} />
      {/* Pagination */}
      <Pagination page={pageNum} count={length} />
    </div>
  );
}
