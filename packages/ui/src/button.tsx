import * as React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function Button({ children, className = "", ...props }: ButtonProps) {
  return (
    <button
      className={`bg-accent hover:bg-accent-hover text-white font-bold py-2 px-6 rounded-lg transition-colors duration-200 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
