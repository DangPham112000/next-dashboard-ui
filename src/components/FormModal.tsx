"use client";
import { deleteSubject } from "@/lib/actions";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { toast } from "react-toastify";
import { FormContainerProps } from "./FormContainer";

const deleteActionMap = {
  subject: deleteSubject,
  class: deleteSubject,
  teacher: deleteSubject,
  parent: deleteSubject,
  student: deleteSubject,
  lesson: deleteSubject,
  exam: deleteSubject,
  assignment: deleteSubject,
  result: deleteSubject,
  attendance: deleteSubject,
  event: deleteSubject,
  announcement: deleteSubject,
};

// Lazy loading
const TeacherForm = dynamic(() => import("./forms/TeacherForm"), {
  loading: () => <h1>Loading...</h1>,
});
const StudentForm = dynamic(() => import("./forms/StudentForm"), {
  loading: () => <h1>Loading...</h1>,
});
const SubjectForm = dynamic(() => import("./forms/SubjectForm"), {
  loading: () => <h1>Loading...</h1>,
});

const forms: {
  [key: string]: (
    type: "create" | "update",
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
    data?: any,
    relatedData?: any
  ) => JSX.Element;
} = {
  teacher: (type, data, setIsOpen, relatedData) => (
    <TeacherForm type={type} data={data} setIsOpen={setIsOpen} relatedData={relatedData} />
  ),
  student: (type, data, setIsOpen, relatedData) => (
    <StudentForm type={type} data={data} setIsOpen={setIsOpen} relatedData={relatedData} />
  ),
  subject: (type, data, setIsOpen, relatedData) => (
    <SubjectForm type={type} data={data} setIsOpen={setIsOpen} relatedData={relatedData} />
  ),
};

export default function FormModal({
  table,
  type,
  data,
  id,
  relatedData,
}: FormContainerProps & { relatedData?: any }) {
  const size = type === "create" ? "w-8 h-8" : "w-7 h-7";
  const bgColor =
    type === "create"
      ? "bg-stYellow"
      : type === "update"
      ? "bg-stSky"
      : "bg-stPurple";

  const [isOpen, setIsOpen] = useState(false);

  const Form = () => {
    const [state, formAction] = useFormState(deleteActionMap[table], {
      success: false,
      error: false,
    });

    const router = useRouter();

    useEffect(() => {
      if (state.success) {
        toast(`Subject has been deleted!`);
        setIsOpen(false);
        router.refresh();
      }
    }, [state]);

    return type === "delete" && id ? (
      <form action={formAction} className="flex flex-col gap-4 p-4">
        <input type="text | number" name="id" value={id} hidden />
        <span className="font-medium text-center">
          All data will be lost. Are you sure to delete this {table}?
        </span>
        <button className="w-max self-center rounded-md border-none py-2 px-4 text-white bg-red-700">
          Delete
        </button>
      </form>
    ) : (
      (type === "update" || type === "create") &&
        forms[table](type, data, setIsOpen, relatedData)
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
            <Form />
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
