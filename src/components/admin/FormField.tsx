import { cn } from "@/lib/utils";

type BaseProps = {
  label: string;
  id: string;
  error?: string;
  hint?: string;
  required?: boolean;
  className?: string;
};

type InputProps = BaseProps &
  React.InputHTMLAttributes<HTMLInputElement> & { as?: "input" };

type TextareaProps = BaseProps &
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & { as: "textarea" };

type SelectProps = BaseProps &
  React.SelectHTMLAttributes<HTMLSelectElement> & {
    as: "select";
    options: { value: string; label: string }[];
  };

type Props = InputProps | TextareaProps | SelectProps;

export function FormField(props: Props) {
  const { label, id, error, hint, required, className, as = "input", ...rest } = props;

  const inputClass = cn(
    "input-base w-full",
    error && "border-red-500/60 focus:border-red-500 focus:shadow-none"
  );

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-sm font-medium text-white/90">
        {label}
        {required && (
          <span className="ml-1 text-conexus-cyan" aria-hidden="true">*</span>
        )}
      </label>

      {as === "textarea" ? (
        <textarea
          id={id}
          className={cn(inputClass, "resize-y min-h-[100px]")}
          aria-required={required}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          {...(rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : as === "select" ? (
        <select
          id={id}
          className={cn(inputClass, "cursor-pointer")}
          aria-required={required}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%238892A4' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 12px center",
            paddingRight: "2.5rem",
            appearance: "none",
          }}
          {...(rest as React.SelectHTMLAttributes<HTMLSelectElement>)}
        >
          <option value="">Selecionar...</option>
          {(props as SelectProps).options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={id}
          className={inputClass}
          aria-required={required}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          {...(rest as React.InputHTMLAttributes<HTMLInputElement>)}
        />
      )}

      {error && (
        <p id={`${id}-error`} className="text-xs text-red-400" role="alert">
          {error}
        </p>
      )}
      {hint && !error && (
        <p id={`${id}-hint`} className="text-xs text-conexus-text-muted">
          {hint}
        </p>
      )}
    </div>
  );
}
