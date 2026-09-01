import * as React from "react"
import { cn } from "@/lib/cn"


export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, id, ...props }, ref) => {
    const generatedId = React.useId()
    const inputId = id || generatedId
    
    return (
      <div className="relative group w-full">
        <input
          type={type}
          id={inputId}
          className={cn(
            "peer flex h-14 w-full rounded-2xl border border-line bg-panel-sunken px-4 py-2 text-sm text-fg file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 focus-visible:ring-offset-bg-app disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 hover:border-line-strong pt-6",
            className
          )}
          ref={ref}
          placeholder={label}
          {...props}
        />
        {label && (
          <label
            htmlFor={inputId}
            className="absolute left-4 top-4 z-10 origin-[0] -translate-y-2.5 scale-75 transform text-muted transition-all duration-200 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-2.5 peer-focus:scale-75 peer-focus:text-teal font-medium cursor-text"
          >
            {label}
          </label>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
