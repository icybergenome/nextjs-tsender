import { useState } from "react";

interface InputFieldProps {
  label: string;
  placeholder?: string;
  value: string;
  type?: "text" | "password" | "email" | "tel";
  large?: boolean;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder,
  value,
  type = "text",
  large = false,
  onChange,
}) => {
  return (
    <div className="mb-4">
      <label
        htmlFor={label}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      <div className="relative">
        {large ? (
          <textarea
            id={label}
            value={value}
            onChange={onChange}
            placeholder={placeholder || "Enter value"}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              large ? "h-auto text-sm" : "h-10"
            } ${large ? "text-base" : "text-sm"} transition-all duration-300`}
          />
        ) : (
          <input
            id={label}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder || "Enter value"}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              large
                ? "h-auto text-sm" // For smaller input fields
                : "h-10"
            } ${large ? "text-base" : "text-sm"} transition-all duration-300`}
          />
        )}
      </div>
    </div>
  );
};

export default InputField;
