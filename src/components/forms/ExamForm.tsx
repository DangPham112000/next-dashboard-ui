import { createExam, updateExam } from "@/lib/actions";
import { examSchema, ExamSchema } from "@/lib/formValidationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import InputField from "../InputField";

export default function ExamForm({
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
  const formTitle = isCreateForm ? "Create a new exam" : "Update the exam";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ExamSchema>({
    resolver: zodResolver(examSchema),
  });

  // React 19: useFormState => useActionState
  const [formState, formAction] = useFormState(
    isCreateForm ? createExam : updateExam,
    {
      success: false,
      error: false,
    }
  );

  const onSubmit = handleSubmit((data: ExamSchema) => {
    console.log(data);
    formAction(data);
  });

  const router = useRouter();

  useEffect(() => {
    if (formState.success) {
      toast(`Exam has been ${isCreateForm ? "created" : "updated"}!`);
      setIsOpenModal(false);
      router.refresh();
    }
  }, [formState, isCreateForm, router, setIsOpenModal]);

  const { lessons } = relatedData;

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">{formTitle}</h1>

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
          label="Title"
          name="title"
          defaultValue={data?.title}
          register={register}
          error={errors?.title}
        />
        <InputField
          label="Start time"
          name="startTime"
          type="datetime-local"
          defaultValue={
            data && new Date(data.startTime).toISOString().slice(0,16)
          }
          register={register}
          error={errors?.startTime}
        />
        <InputField
          label="End time"
          name="endTime"
          type="datetime-local"
          defaultValue={
            data && new Date(data.endTime).toISOString().slice(0,16)
          }
          register={register}
          error={errors?.endTime}
        />
        <div className="flex flex-col md:w-1/4 w-full gap-2">
          <label className="text-xs text-gray-500">Lessons</label>
          <select
            className="w-full ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm"
            {...register("lessonId")}
            defaultValue={data?.lessonId}
          >
            {lessons.map((lesson: { id: number; name: string }) => (
              <option value={lesson.id} key={lesson.id}>
                {lesson.name}
              </option>
            ))}
          </select>
          {errors.lessonId?.message && (
            <p className="text-xs text-red-400">{errors.lessonId?.message}</p>
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
