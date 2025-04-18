"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import Image from "next/image";
import { studentSchema, StudentSchema } from "@/lib/formValidationSchema";
import { useFormState } from "react-dom";
import { createStudent, updateStudent } from "@/lib/actions";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { CldUploadWidget } from "next-cloudinary";

export default function StudentForm({
  type,
  setIsOpenModal,
  data,
  relatedData,
}: {
  type: "create" | "update";
  setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  data?: any;
  relatedData?: any;
}) {
  const isCreateForm = type === "create";
  const formTitle = isCreateForm
    ? "Create a new student"
    : "Update the student";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StudentSchema>({
    resolver: zodResolver(studentSchema),
  });

  // React 19: useFormState => useActionState
  const [formState, formAction] = useFormState(
    isCreateForm ? createStudent : updateStudent,
    {
      success: false,
      error: false,
    }
  );

  const [img, setImg] = useState<any>();

  const onSubmit = handleSubmit((data: StudentSchema) => {
    console.log(data.img);
    const refinedData = {
      ...data,
      img: img?.secure_url,
    };
    console.log(refinedData);
    formAction(refinedData);
  });

  const router = useRouter();

  useEffect(() => {
    if (formState.success) {
      toast(`Student has been ${isCreateForm ? "created" : "updated"}!`);
      setIsOpenModal(false);
      router.refresh();
    }
  }, [formState, isCreateForm, router, setIsOpenModal]);

  const { classes, parents } = relatedData;

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">{formTitle}</h1>
      <span className="text-xs text-gray-400 font-medium">
        Authentication Information
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        {data && (
          <InputField
            label="Id"
            name="id"
            defaultValue={data?.id}
            register={register}
            error={errors?.id}
            hidden={true}
          />
        )}
        <InputField
          label="Username"
          name="username"
          defaultValue={data?.username}
          register={register}
          error={errors?.username}
        />
        <InputField
          label="Email"
          name="email"
          type="email"
          defaultValue={data?.email}
          register={register}
          error={errors?.email}
        />
        <InputField
          label="Password"
          name="password"
          type="password"
          defaultValue={data?.password}
          register={register}
          error={errors?.password}
        />
      </div>
      <span className="text-xs text-gray-400 font-medium">
        Personal Information
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="First Name"
          name="firstName"
          defaultValue={data?.name}
          register={register}
          error={errors?.firstName}
        />
        <InputField
          label="Last Name"
          name="lastName"
          defaultValue={data?.surname}
          register={register}
          error={errors?.lastName}
        />
        <InputField
          label="Phone"
          name="phone"
          defaultValue={data?.phone}
          register={register}
          error={errors?.phone}
        />
        <InputField
          label="Address"
          name="address"
          defaultValue={data?.address}
          register={register}
          error={errors?.address}
        />
        <InputField
          label="Blood Type"
          name="bloodType"
          defaultValue={data?.bloodType}
          register={register}
          error={errors?.bloodType}
        />
        <InputField
          label="Birthday"
          name="birthday"
          type="date"
          defaultValue={
            data && new Date(data.birthday).toISOString().split("T")[0]
          }
          register={register}
          error={errors?.birthday}
        />
        <div className="flex flex-col md:w-1/4 w-full gap-2">
          <label className="text-xs text-gray-500">Sex</label>
          <select
            className="w-full ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm"
            {...register("sex")}
            defaultValue={data?.sex}
          >
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>
          {errors.sex?.message && (
            <p className="text-xs text-red-400">{errors.sex?.message}</p>
          )}
        </div>
        <div className="flex flex-col md:w-1/4 w-full gap-2">
          <label className="text-xs text-gray-500">Class</label>
          <select
            className="w-full ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm"
            {...register("classId")}
            defaultValue={data?.classId}
          >
            {classes.map((cla: { id: number; name: string }) => (
              <option value={cla.id} key={cla.id}>
                {cla.name}
              </option>
            ))}
          </select>
          {errors.classId?.message && (
            <p className="text-xs text-red-400">{errors.classId?.message}</p>
          )}
        </div>
        <div className="flex flex-col md:w-1/4 w-full gap-2">
          <label className="text-xs text-gray-500">Parent</label>
          <select
            className="w-full ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm"
            {...register("parentId")}
            defaultValue={data?.parentId}
          >
            {parents.map(
              (parent: { id: string; name: string; surname: string }) => (
                <option value={parent.id} key={parent.id}>
                  {parent.name + " " + parent.surname}
                </option>
              )
            )}
          </select>
          {errors.parentId?.message && (
            <p className="text-xs text-red-400">{errors.parentId?.message}</p>
          )}
        </div>
        <CldUploadWidget
          uploadPreset="school"
          onSuccess={(result, { widget }) => {
            setImg(result.info);
            widget.close();
          }}
        >
          {({ open }) => {
            return (
              <div
                className="text-xs text-gray-500 flex items-center cursor-pointer gap-2"
                onClick={() => open()}
              >
                {data && data.img ? (
                  <Image src={data.img} alt="" width={28} height={28} />
                ) : (
                  <>
                    <Image src="/upload.png" alt="" width={28} height={28} />
                    <span>Upload a photo</span>
                  </>
                )}
              </div>
            );
          }}
        </CldUploadWidget>
      </div>

      {formState.error && (
        <span className="text-red-500">Something went wrong!</span>
      )}

      <button className="text-white rounded-md p-2 bg-blue-400">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
}
