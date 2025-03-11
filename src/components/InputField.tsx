import React from "react";
import { FieldError } from "react-hook-form";

type InputFieldProps = {
  label: string;
  type?: string;
  register: any;
  name: string;
  defaultValue?: string;
  error?: FieldError;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
};

export default function InputField({
  label,
  type = "text",
  register,
  name,
  defaultValue,
  error,
  inputProps
}: InputFieldProps) {
  return (
    <div className="flex flex-col md:w-1/4 w-full gap-2">
      <label className="text-xs text-gray-500">{label}</label>
      <input
        className="w-full ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm"
        type={type}
        defaultValue={defaultValue}
        {...register(name)}
        {...inputProps}
      />
      {error?.message && (
        <p className="text-xs text-red-400">{error?.message}</p>
      )}
    </div>
  );
}
