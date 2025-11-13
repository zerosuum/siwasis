import { SuccessIcon, ErrorIcon, WarningIcon } from "./AlertIcons";

const base =
  "inline-flex w-full max-w-xl sm:min-w-[480px] px-6 py-5 justify-center items-center gap-4 rounded-[20px] border shadow-[0_2px_4px_-2px_rgba(24,39,75,0.12),0_4px_4px_-2px_rgba(24,39,75,0.08)] bg-white";

const variantClasses = {
  success: "border-[#81A242] bg-[#FBFEF5]",
  error: "border-[#DD1122] bg-[#FFF5F6]",
  warning: "border-[#A1993B] bg-[#FFFEF4]",
};

const titleClasses = "font-rem font-bold text-lg text-wasis-pr80";
const descClasses = "font-rem text-sm sm:text-base text-wasis-pr80/90";

export default function AlertBanner({
  variant = "success",
  title,
  description,
}) {
  const Icon =
    variant === "success"
      ? SuccessIcon
      : variant === "warning"
      ? WarningIcon
      : ErrorIcon;

  return (
    <div className={`${base} ${variantClasses[variant]}`}>
      <Icon />
      <div className="flex flex-col gap-1 text-left">
        {title && <p className={titleClasses}>{title}</p>}
        {description && <p className={descClasses}>{description}</p>}
      </div>
    </div>
  );
}
