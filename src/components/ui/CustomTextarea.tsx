import React, { forwardRef } from 'react';

export interface CustomTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean;
  dark?: boolean;
}

export const CustomTextarea = forwardRef<HTMLTextAreaElement, CustomTextareaProps>(({
  hasError,
  dark = false,
  className = '',
  disabled,
  rows = 4,
  ...props
}, ref) => {
  return (
    <textarea
      ref={ref}
      rows={rows}
      disabled={disabled}
      className={`w-full text-xs font-semibold rounded-xl p-3.5 transition-all duration-200 outline-none resize-y ${
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
  );
});

CustomTextarea.displayName = 'CustomTextarea';

export default CustomTextarea;
