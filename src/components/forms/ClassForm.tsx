import React, { useEffect } from "react";
import InputField from "../InputField";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { classSchema, ClassSchema } from "@/lib/formValidationSchema";
import { useFormState } from "react-dom";
import { createClass, updateClass } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function ClassForm({
  type,
  data,
  setIsOpenModal,
  relatedData,
}: {
  type: "create" | "update";
  setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  data?: any;
  relatedData?: any;
}) {
  const isCreateForm = type === "create";
  const formTitle = isCreateForm ? "Create a new class" : "Update the class";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClassSchema>({
    resolver: zodResolver(classSchema),
  });

  // React 19: useFormState => useActionState
  const [formState, formAction] = useFormState(
    isCreateForm ? createClass : updateClass,
    {
      success: false,
      error: false,
    }
  );

  const onSubmit = handleSubmit((data: ClassSchema) => {
    console.log(data);
    formAction(data);
  });

  const router = useRouter();

  useEffect(() => {
    if (formState.success) {
      toast(`Class has been ${isCreateForm ? "created" : "updated"}!`);
      setIsOpenModal(false);
      router.refresh();
    }
  }, [formState]);

  const { teachers, grades } = relatedData;

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">{formTitle}</h1>

      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Class name"
          name="name"
          defaultValue={data?.name}
          register={register}
          error={errors?.name}
        />
        <InputField
          label="Capacity"
          name="capacity"
          defaultValue={data?.capacity}
          register={register}
          error={errors?.capacity}
        />
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
        <div className="flex flex-col md:w-1/4 w-full gap-2">
          <label className="text-xs text-gray-500">Supervisor</label>
          <select
            className="w-full ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm"
            {...register("supervisorId")}
            defaultValue={data?.teachers}
          >
            {teachers.map(
              (teacher: { id: string; name: string; surname: string }) => (
                <option
                  value={teacher.id}
                  key={teacher.id}
                  selected={!!(data && data.supervisorId === teacher.id)}
                >
                  {teacher.name + " " + teacher.surname}
                </option>
              )
            )}
          </select>
          {errors.supervisorId?.message && (
            <p className="text-xs text-red-400">
              {errors.supervisorId?.message}
            </p>
          )}
        </div>

        <div className="flex flex-col md:w-1/4 w-full gap-2">
          <label className="text-xs text-gray-500">Grade</label>
          <select
            className="w-full ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm"
            {...register("gradeId")}
            defaultValue={data?.grades}
          >
            {grades.map((grade: { id: number; level: number }) => (
              <option
                value={grade.id}
                key={grade.id}
                selected={!!(data && data.gradeId === grade.id)}
              >
                {grade.level}
              </option>
            ))}
          </select>
          {errors.gradeId?.message && (
            <p className="text-xs text-red-400">{errors.gradeId?.message}</p>
          )}
        </div>
      </div>

      {formState.error && (
        <span className="text-red-500">Something went wrong!</span>
      )}

      <button className="text-white rounded-md p-2 bg-blue-400">
        {isCreateForm ? "Create" : "Update"}
      </button>
    </form>
  );
}
