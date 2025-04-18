import React, { useEffect } from "react";
import InputField from "../InputField";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubjectSchema, subjectSchema } from "@/lib/formValidationSchema";
import { createSubject, updateSubject } from "@/lib/actions";
import { useFormState } from "react-dom";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function SubjectForm({
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
    ? "Create a new subject"
    : "Update the subject";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SubjectSchema>({
    resolver: zodResolver(subjectSchema),
  });

  // React 19: useFormState => useActionState
  const [formState, formAction] = useFormState(
    isCreateForm ? createSubject : updateSubject,
    {
      success: false,
      error: false,
    }
  );

  const onSubmit = handleSubmit((data: SubjectSchema) => {
    console.log(data);
    formAction(data);
  });

  const router = useRouter();

  useEffect(() => {
    if (formState.success) {
      toast(`Subject has been ${isCreateForm ? "created" : "updated"}!`);
      setIsOpenModal(false);
      router.refresh();
    }
  }, [formState, isCreateForm, router, setIsOpenModal]);

  const { teachers } = relatedData;

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">{formTitle}</h1>

      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Subject name"
          name="name"
          defaultValue={data?.name}
          register={register}
          error={errors?.name}
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
          <label className="text-xs text-gray-500">Teachers</label>
          <select
            multiple
            className="w-full ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm"
            {...register("teachers")}
            defaultValue={data?.teachers}
          >
            {teachers.map(
              (teacher: { id: string; name: string; surname: string }) => (
                <option value={teacher.id} key={teacher.id}>
                  {teacher.name + " " + teacher.surname}
                </option>
              )
            )}
          </select>
          {errors.teachers?.message && (
            <p className="text-xs text-red-400">{errors.teachers?.message}</p>
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
