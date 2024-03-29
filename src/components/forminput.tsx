import React from "react";
import { FormFieldProps } from "./form";
import { Warning } from "./svg/warning";

interface FormInputProps {
  placeholder?: string;
  type?: string;
  label?: string;
  p?: FormFieldProps;
  error?: string;
  isLast?: boolean;
  multiline?: boolean;
  inline?: boolean;
}

export function FormInput({
  placeholder,
  type,
  label,
  p,
  error,
  multiline,
  inline,
}: FormInputProps) {
  return (
    <div className="relative w-full">
      {label && (
        <label className="block text-sm font-semibold text-gray-700">
          {label}
        </label>
      )}
      {multiline ? (
        <textarea
          placeholder={placeholder ?? ""}
          {...p}
          rows={4}
          className={`${
            !error && !inline && "mb-8"
          } resize-none appearance-none block w-full px-3 py-2 border border-gray-100 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
        />
      ) : (
        <input
          type={type ?? ""}
          placeholder={placeholder ?? ""}
          {...p}
          className={`${
            !error && !inline && "mb-8"
          } appearance-none block w-full px-3 py-2 border border-gray-100 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
        />
      )}

      {error && (
        <div className="flex flex-row items-center gap-1 mt-1 mb-4">
          <Warning className="h-6 w-6 text-red-600" />
          <p className="text-sm text-red-600 font-medium">{error}</p>
        </div>
      )}
    </div>
  );
}
