import React from "react";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  children: React.ReactNode;
}

const inputClassName =
  "w-full bg-slate-900 border border-slate-600 p-2 rounded text-white focus:border-indigo-500 outline-none";

export const FormInput: React.FC<FormInputProps> = ({ label, className = "", ...props }) => {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-slate-300 mb-1">
          {label}
        </label>
      )}
      <input className={`${inputClassName} ${className}`} {...props} />
    </div>
  );
};

export const FormSelect: React.FC<FormSelectProps> = ({
  label,
  className = "",
  children,
  ...props
}) => {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-slate-300 mb-1">
          {label}
        </label>
      )}
      <select className={`${inputClassName} ${className}`} {...props}>
        {children}
      </select>
    </div>
  );
};
