import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { role } from "@/lib/data";
import { prisma } from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/setting";
import { Prisma } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type ResultList = {
  id: number;
  title: string;
  studenName: string;
  studentSurname: string;
  teacherName: string;
  teacherSurname: string;
  score: number;
  className: string;
  startTime: Date;
};

const columns = [
  {
    header: "Subject Name",
    accessor: "name",
  },
  {
    header: "Student",
    accessor: "student",
  },
  {
    header: "Score",
    accessor: "score",
    className: "hidden md:table-cell",
  },
  {
    header: "Teacher",
    accessor: "teacher",
    className: "hidden md:table-cell",
  },
  {
    header: "Class",
    accessor: "class",
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

const renderRow = (item: ResultList) => (
  <tr
    key={item.id}
    className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-stPurpleLight"
  >
    <td className="flex items-center gap-4 p-4">
      <div className="flex flex-col">
        <h3 className="font-semibold">{item.title}</h3>
      </div>
    </td>
    <td>{item.studenName + " " + item.studentSurname}</td>
    <td className="md:table-cell hidden">{item.score}</td>
    <td className="md:table-cell hidden">
      {item.teacherName + " " + item.teacherSurname}
    </td>
    <td className="md:table-cell hidden">{item.className}</td>
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
          <FormModal table="result" type="delete" id={item.id} />
        )}
      </div>
    </td>
  </tr>
);

export default async function ResultListPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const { page = 1, ...queryParams } = searchParams;
  const pageNum = +page;

  const queryDb: Prisma.ResultWhereInput = {};
  for (const [key, value] of Object.entries(queryParams)) {
    if (!value) continue;
    switch (key) {
      case "studentId": {
        queryDb.studentId = value;
        break;
      }
      case "search": {
        queryDb.OR = [
          { exam: { title: { contains: value, mode: "insensitive" } } },
          { assignment: { title: { contains: value, mode: "insensitive" } } },
          { student: { name: { contains: value, mode: "insensitive" } } },
        ];
        break;
      }
    }
  }

  const [resultsRawData, length] = await prisma.$transaction([
    prisma.result.findMany({
      where: queryDb,
      include: {
        assignment: {
          include: {
            lesson: {
              select: {
                class: { select: { name: true } },
                teacher: { select: { name: true, surname: true } },
              },
            },
          },
        },
        exam: {
          include: {
            lesson: {
              select: {
                class: { select: { name: true } },
                teacher: { select: { name: true, surname: true } },
              },
            },
          },
        },
        student: { select: { name: true, surname: true } },
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (pageNum - 1),
    }),
    prisma.result.count({ where: queryDb }),
  ]);

  const resultsData = resultsRawData.map((rawResult) => {
    const assessment = rawResult.assignment || rawResult.exam;
    if (!assessment) return;

    const isExam = "startTime" in assessment;

    return {
      id: rawResult.id,
      title: assessment.title,
      studenName: rawResult.student.name,
      studentSurname: rawResult.student.surname,
      teacherName: assessment.lesson.teacher.name,
      teacherSurname: assessment.lesson.teacher.surname,
      score: rawResult.score,
      className: assessment.lesson.class.name,
      startTime: isExam ? assessment.startTime : assessment.startDate,
    };
  });

  return (
    <div className="flex-1 rounded-md bg-white mt-0 m-4 p-4">
      {/* Top */}
      <div className="flex items-center justify-between">
        <h1 className="md:block hidden text-lg font-semibold">All results</h1>
        <div className="flex md:flex-row flex-col items-center gap-4 md:w-auto w-full">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-stYellow">
              <Image src="/filter.png" alt="filter" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-stYellow">
              <Image src="/sort.png" alt="filter" width={14} height={14} />
            </button>
            {role === "admin" && <FormModal table="result" type="create" />}
          </div>
        </div>
      </div>
      {/* List */}
      <Table columns={columns} renderRow={renderRow} data={resultsData} />
      {/* Pagination */}
      <Pagination page={pageNum} count={length} />
    </div>
  );
}
