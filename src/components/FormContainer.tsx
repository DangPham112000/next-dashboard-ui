import React from "react";
import FormModal from "./FormModal";
import { prisma } from "@/lib/prisma";

export type FormContainerProps = {
  table:
    | "teacher"
    | "student"
    | "parent"
    | "subject"
    | "class"
    | "lesson"
    | "exam"
    | "assignment"
    | "result"
    | "attendance"
    | "event"
    | "announcement";
  type: "create" | "update" | "delete";
  data?: any;
  id?: number | string;
};

export default async function FormContainer({
  table,
  type,
  data,
  id,
}: FormContainerProps) {
  let relatedData = {};

  if (type !== "delete") {
    switch (table) {
      case "subject": {
        const subjectTeachers = await prisma.teacher.findMany({
          select: { id: true, name: true, surname: true },
        });
        relatedData = { teachers: subjectTeachers };
        break;
      }
      case "class": {
        const teachers = await prisma.teacher.findMany({
          select: { id: true, name: true, surname: true },
        });
        const grades = await prisma.grade.findMany({
          select: { id: true, level: true },
        });
        relatedData = { teachers, grades };
        break;
      }
      case "teacher": {
        const subjects = await prisma.subject.findMany({
          select: { id: true, name: true },
        });
        const classes = await prisma.class.findMany({
          select: { id: true, name: true },
        });
        relatedData = { subjects, classes };
        break;
      }
      case "student": {
        const classes = await prisma.class.findMany({
          select: {
            id: true,
            name: true,
            grade: { select: { id: true, level: true } },
          },
        });
        const parents = await prisma.parent.findMany({
          select: {
            id: true,
            name: true,
            surname: true,
          },
        });
        relatedData = { classes, parents };
        break;
      }
    }
  }

  return (
    <div>
      <FormModal
        table={table}
        type={type}
        data={data}
        id={id}
        relatedData={relatedData}
      />
    </div>
  );
}
