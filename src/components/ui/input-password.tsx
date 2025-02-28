import { Eye, EyeOff } from "lucide-react";
import * as React from "react";
import { cn } from "@/libs/clsx";
import { Input } from "./input";

type InputPasswordProps = React.InputHTMLAttributes<HTMLInputElement>;

export function InputPassword({ className, ...props }: InputPasswordProps) {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className="relative">
      <Input
        className={cn("pr-10", className)}
        type={showPassword ? "text" : "password"}
        {...props}
      />
      <button
        aria-label={showPassword ? "Hide password" : "Show password"}
        className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700 focus:outline-none"
        onClick={() => setShowPassword(!showPassword)}
        type="button"
      >
        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}
