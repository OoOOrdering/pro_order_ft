import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  color?: 'primary' | 'danger' | 'default';
}

export default function Button({ children, color = 'primary', className = '', ...props }: ButtonProps) {
  let colorClass = 'bg-blue-500 hover:bg-blue-600';
  if (color === 'danger') colorClass = 'bg-red-500 hover:bg-red-600';
  if (color === 'default') colorClass = 'bg-gray-500 hover:bg-gray-600';
  return (
    <button
      className={`text-white p-2 rounded ${colorClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
