import React, { forwardRef } from 'react';

export interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  hasError?: boolean;
  dark?: boolean;
}

export const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(({
  startIcon,
  endIcon,
  hasError,
  dark = false,
  className = '',
  disabled,
  ...props
}, ref) => {
  return (
    <div className="relative w-full flex items-center">
      {startIcon && (
        <div className={`absolute left-3.5 flex items-center pointer-events-none ${
          dark ? 'text-neutral-400' : 'text-[#8A8178]'
        }`}>
          {startIcon}
        </div>
      )}

      <input
        ref={ref}
        disabled={disabled}
        className={`w-full text-xs font-semibold rounded-xl transition-all duration-200 ${
          startIcon ? 'pl-10' : 'pl-3.5'
        } ${endIcon ? 'pr-10' : 'pr-3.5'} py-2.5 outline-none ${
          dark
            ? `bg-[#181818] text-white border ${
                hasError
                  ? 'border-rose-500/80 focus:border-rose-500 shadow-[0_0_0_3px_rgba(244,63,94,0.2)]'
                  : 'border-white/15 hover:border-[#D6B46A]/50 focus:border-[#D6B46A] focus:shadow-[0_0_0_3px_rgba(214,180,106,0.2)]'
              } placeholder:text-neutral-500`
            : `bg-[#FFFDF8] text-[#111111] border ${
                hasError
                  ? 'border-rose-400 focus:border-rose-500 shadow-[0_0_0_3px_rgba(244,63,94,0.15)]'
                  : 'border-[#D6B46A]/25 hover:border-[#D6B46A]/50 focus:border-[#D6B46A] focus:shadow-[0_0_0_3.5px_rgba(214,180,106,0.18)]'
              } placeholder:text-[#8A8178]/60 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]`
        } ${disabled ? 'opacity-50 cursor-not-allowed bg-neutral-100' : 'cursor-text'} ${className}`}
        {...props}
      />

      {endIcon && (
        <div className={`absolute right-3.5 flex items-center ${
          dark ? 'text-neutral-400' : 'text-[#8A8178]'
        }`}>
          {endIcon}
        </div>
      )}
    </div>
  );
});

CustomInput.displayName = 'CustomInput';

export default CustomInput;
