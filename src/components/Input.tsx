import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export default function Input({ label, className = '', ...props }: InputProps) {
  return (
    <div className="mb-2">
      {label && <label className="block mb-1 font-medium">{label}</label>}
      <input
        className={`border p-2 w-full rounded ${className}`}
        {...props}
      />
    </div>
  );
}
