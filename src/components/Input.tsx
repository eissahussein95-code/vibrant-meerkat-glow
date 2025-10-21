import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>((
  { label, error, icon, className = '', ...props },
  ref
) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-secondary mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-tertiary">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          className={`
            w-full h-12 px-4 ${icon ? 'pl-12' : ''}
            bg-input border-2 border-neutral-700 rounded-md
            text-primary text-base
            focus:outline-none focus:border-purple-500 focus:shadow-glow-purple
            disabled:opacity-60 disabled:cursor-not-allowed
            transition-all duration-normal
            ${error ? 'border-error' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-2 text-xs text-error">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;