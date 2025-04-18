import Announcement from "@/components/Announcement";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import FormContainer from "@/components/FormContainer";
import Performance from "@/components/Performance";
import { getUserRole } from "@/lib/helpers";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";

type Params = Promise<{ id: string }>;

export default async function SingleTeacherPage(props: { params: Params }) {
  const params = await props.params;
  const role = await getUserRole();
  const teacherId = params.id;

  const teacher = await prisma.teacher.findUnique({
    where: { id: teacherId },
    include: {
      subjects: true,
      classes: true,
      _count: {
        select: {
          subjects: true,
          lessons: true,
          classes: true,
        },
      },
    },
  });

  if (!teacher) {
    return notFound();
  }

  return (
    <div className="flex xl:flex-row flex-col flex-1 gap-4 p-4">
      {/* Left */}
      <div className="xl:w-2/3 w-full">
        {/* Top */}
        <div className="flex lg:flex-row flex-col gap-4">
          {/* User Info Card */}
          <div className="flex flex-1 gap-4 px-4 py-6 rounded-md bg-stSky">
            <div className="w-1/3">
              <Image
                src={teacher.img || "/noAvatar.png"}
                alt=""
                width={144}
                height={144}
                className="w-36 h-36 rounded-full object-cover"
              />
            </div>
            <div className="w-2/3 flex flex-col justify-between gap-4">
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-semibold">
                  {teacher.name + " " + teacher.surname}
                </h1>
                {role === "admin" && (
                  <FormContainer table="teacher" type="update" data={teacher} />
                )}
              </div>
              <p className="text-sm text-gray-500">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit.
              </p>
              <div className="flex flex-wrap justify-between items-center gap-2 text-xs font-medium">
                <div className="flex items-center 2xl:w-1/3 lg:w-full md:w-1/3 w-full gap-2">
                  <Image src="/blood.png" alt="" width={14} height={14} />
                  <span>{teacher.bloodType}</span>
                </div>
                <div className="flex items-center 2xl:w-1/3 lg:w-full md:w-1/3 w-full gap-2">
                  <Image src="/date.png" alt="" width={14} height={14} />
                  <span>
                    {new Intl.DateTimeFormat("en-US").format(teacher.birthday)}
                  </span>
                </div>
                <div className="flex items-center 2xl:w-1/3 lg:w-full md:w-1/3 w-full gap-2">
                  <Image src="/mail.png" alt="" width={14} height={14} />
                  <span>{teacher.email || "-"}</span>
                </div>
                <div className="flex items-center 2xl:w-1/3 lg:w-full md:w-1/3 w-full gap-2">
                  <Image src="/phone.png" alt="" width={14} height={14} />
                  <span>{teacher.phone || "-"}</span>
                </div>
              </div>
            </div>
          </div>
          {/* Small Cards */}
          <div className="flex flex-wrap flex-1 justify-between gap-4">
            {/* Card */}
            <div className="flex 2xl:w-[48%] xl:w-[45%] md:w-[48%] w-full gap-4 p-4 rounded-md bg-white">
              <Image
                src="/singleAttendance.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div className="">
                <h1 className="text-xl font-semibold">90%</h1>
                <div className="text-sm text-gray-400">Attendance</div>
              </div>
            </div>
            {/* Card */}
            <div className="flex 2xl:w-[48%] xl:w-[45%] md:w-[48%] w-full gap-4 p-4 rounded-md bg-white">
              <Image
                src="/singleBranch.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div className="">
                <h1 className="text-xl font-semibold">
                  {teacher._count.subjects}
                </h1>
                <div className="text-sm text-gray-400">Subjects</div>
              </div>
            </div>
            {/* Card */}
            <div className="flex 2xl:w-[48%] xl:w-[45%] md:w-[48%] w-full gap-4 p-4 rounded-md bg-white">
              <Image
                src="/singleLesson.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div className="">
                <h1 className="text-xl font-semibold">
                  {teacher._count.lessons}
                </h1>
                <div className="text-sm text-gray-400">Lessons</div>
              </div>
            </div>
            {/* Card */}
            <div className="flex 2xl:w-[48%] xl:w-[45%] md:w-[48%] w-full gap-4 p-4 rounded-md bg-white">
              <Image
                src="/singleClass.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div className="">
                <h1 className="text-xl font-semibold">
                  {teacher._count.classes}
                </h1>
                <div className="text-sm text-gray-400">Classes</div>
              </div>
            </div>
          </div>
        </div>
        {/* Bottom */}
        <div className="h-[800px] p-4 mt-4 rounded-md bg-white">
          <h1>Teacher&apos;s Schedule</h1>
          <BigCalendarContainer type="teacherId" id={teacher.id} />
        </div>
      </div>
      {/* Right */}
      <div className="flex flex-col gap-4 xl:w-1/3 w-full">
        <div className="p-4 rounded-md bg-white">
          <h1 className="text-xl font-semibold">Shortcuts</h1>
          <div className="flex flex-wrap text-xs text-gray-500 mt-4 gap-4">
            <Link
              className="p-3 rounded-md bg-stSkyLight"
              href={`/list/classes?teacherId=${teacherId}`}
            >
              Teacher&apos;s Classes
            </Link>
            <Link
              className="p-3 rounded-md bg-stPurpleLight"
              href={`/list/students?teacherId=${teacher.id}`}
            >
              Teacher&apos;s Students
            </Link>
            <Link
              className="p-3 rounded-md bg-stYellowLight"
              href={`/list/lessons?teacherId=${teacherId}`}
            >
              Teacher&apos;s Lessons
            </Link>
            <Link
              className="p-3 rounded-md bg-pink-50"
              href={`/list/exams?teacherId=${teacherId}`}
            >
              Teacher&apos;s Exams
            </Link>
            <Link
              className="p-3 rounded-md bg-stSkyLight"
              href={`/list/assignments?teacherId=${teacherId}`}
            >
              Teacher&apos;s Assignments
            </Link>
          </div>
        </div>
        <Performance />
        <Announcement />
      </div>
    </div>
  );
}
