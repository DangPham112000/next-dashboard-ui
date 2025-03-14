"use client";
import dynamic from "next/dynamic";
import Image from "next/image";
import React, { useState } from "react";
// import TeacherForm from "./forms/TeacherForm";
// import StudentForm from "./forms/StudentForm";

// Lazy loading
const TeacherForm = dynamic(() => import("./forms/TeacherForm"), {
  loading: () => <h1>Loading...</h1>,
});

const StudentForm = dynamic(() => import("./forms/StudentForm"), {
  loading: () => <h1>Loading...</h1>,
});

const forms: {
  [key: string]: (type: "create" | "update", data?: any) => JSX.Element;
} = {
  teacher: (type, data) => <TeacherForm type={type} data={data} />,
  student: (type, data) => <StudentForm type={type} data={data} />,
};

export default function FormModal({
  table,
  type,
  data,
  id,
}: {
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
}) {
  const size = type === "create" ? "w-8 h-8" : "w-7 h-7";
  const bgColor =
    type === "create"
      ? "bg-stYellow"
      : type === "update"
      ? "bg-stSky"
      : "bg-stPurple";

  const [isOpen, setIsOpen] = useState(false);

  const Form = () => {
    return type === "delete" && id ? (
      <form action="" className="flex flex-col gap-4 p-4">
        <span className="font-medium text-center">
          All data will be lost. Are you sure to delete this {table}?
        </span>
        <button className="w-max self-center rounded-md border-none py-2 px-4 text-white bg-red-700">
          Delete
        </button>
      </form>
    ) : (
      (type === "update" || type === "create") && forms[table](type, data)
    );
  };

  return (
    <>
      <button
        className={`${size} flex items-center justify-center rounded-full ${bgColor}`}
        onClick={() => {
          setIsOpen(true);
        }}
      >
        <Image src={`/${type}.png`} alt="" width={16} height={16} />
      </button>
      {isOpen && (
        <div className="absolute w-screen h-screen left-0 top-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div className="relative 2xl:w-[40%] xl:w-[50%] lg:w-[60%] md:w-[70%] w-[90%] bg-white rounded-md p-4">
            {Form()}
            <div
              className="absolute top-4 right-4 cursor-pointer"
              onClick={() => {
                setIsOpen(false);
              }}
            >
              <Image src="/close.png" alt="close" width={14} height={14} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
