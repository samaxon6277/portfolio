import React from 'react';
import { Check } from 'lucide-react';

export interface StepItem {
  id: string | number;
  label: string;
  description?: string;
}

export interface CustomStepperProps {
  steps: StepItem[];
  currentStep: number;
  onStepClick?: (stepIndex: number) => void;
  allowStepClick?: boolean;
  className?: string;
}

export default function CustomStepper({
  steps,
  currentStep,
  onStepClick,
  allowStepClick = false,
  className = ''
}: CustomStepperProps) {
  return (
    <div className={`w-full ${className}`}>
      {/* Desktop & Tablet View */}
      <div className="hidden md:flex items-center justify-between relative">
        {/* Background track line */}
        <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5 bg-neutral-200 -z-0" />
        {/* Active progress fill */}
        <div 
          className="absolute left-6 top-1/2 -translate-y-1/2 h-0.5 bg-[#D6B46A] transition-all duration-300 -z-0"
          style={{
            width: `${Math.max(0, Math.min(100, (currentStep / (steps.length - 1)) * 100))}%`
          }}
        />

        {steps.map((step, idx) => {
          const isCompleted = idx < currentStep;
          const isCurrent = idx === currentStep;
          const isPending = idx > currentStep;
          const canClick = allowStepClick && (isCompleted || isCurrent);

          return (
            <button
              key={step.id}
              type="button"
              disabled={!canClick}
              onClick={() => canClick && onStepClick?.(idx)}
              className={`flex flex-col items-center group relative z-10 transition-transform ${
                canClick ? 'cursor-pointer hover:scale-105' : 'cursor-default'
              }`}
            >
              <div 
                className={`w-9 h-9 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all duration-200 shadow-sm ${
                  isCompleted
                    ? 'bg-[#D6B46A] text-[#111111] ring-4 ring-[#FFFDF8]'
                    : isCurrent
                    ? 'bg-[#111111] text-[#D6B46A] border-2 border-[#D6B46A] ring-4 ring-[#D6B46A]/20'
                    : 'bg-white border-2 border-neutral-300 text-neutral-400 ring-4 ring-[#FFFDF8]'
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : idx + 1}
              </div>
              <div className="text-center mt-2 max-w-[110px]">
                <span className={`block text-xs font-bold truncate ${
                  isCurrent ? 'text-[#111111]' : isCompleted ? 'text-[#8F722E]' : 'text-neutral-400'
                }`}>
                  {step.label}
                </span>
                {step.description && (
                  <span className="block text-[10px] text-neutral-400 truncate mt-0.5">
                    {step.description}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Mobile Compact View */}
      <div className="flex md:hidden items-center justify-between bg-white border border-neutral-200 rounded-xl p-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#111111] text-[#D6B46A] font-mono text-xs font-bold flex items-center justify-center border border-[#D6B46A]/40">
            {currentStep + 1}
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase text-[#8A8178]">
              Step {currentStep + 1} of {steps.length}
            </div>
            <div className="text-xs font-bold text-[#111111]">
              {steps[currentStep]?.label}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {steps.map((_, idx) => (
            <div 
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentStep
                  ? 'w-6 bg-[#D6B46A]'
                  : idx < currentStep
                  ? 'w-2.5 bg-neutral-800'
                  : 'w-2 bg-neutral-200'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
