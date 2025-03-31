import { prisma } from "@/lib/prisma";
import Image from "next/image";
import React from "react";

export default async function UserCard({
  type,
}: {
  type: "admin" | "teacher" | "student" | "parent";
}) {
  const prismaModelMap: Record<typeof type, any> = {
    admin: prisma.admin,
    teacher: prisma.teacher,
    student: prisma.student,
    parent: prisma.parent,
  };

  const count = await prismaModelMap[type].count();

  return (
    <div className="flex-1 min-w-[130px] rounded-2xl odd:bg-stPurple even:bg-stYellow p-4">
      <div className="flex justify-between items-center">
        <span className="text-[10px] bg-white px-2 py-1 rounded-full text-green-600">
          2024/25
        </span>
        <Image src="/more.png" alt="more" width={20} height={20} />
      </div>
      <h1 className="text-2xl font-semibold my-4">{count}</h1>
      <h2 className="capitalize text-sm font-medium text-gray-500">{type}</h2>
    </div>
  );
}
