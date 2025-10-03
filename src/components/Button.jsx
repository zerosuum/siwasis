export default function Button({
 as = "button",
 variant = "solid",
 size = "sm",
 className = "",
 ...props
}) {
 const Comp = as;
const base =
 "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand";
 const sizes = { sm: "px-3 py-2 text-sm", md: "px-4 py-2", lg: "px-5 py-3" };
 const variants = {
 solid: "bg-brand text-white hover:bg-brand-600",
 outline: "border border-neutral-300 text-neutral-700 hover:bg-neutral-50",
 ghost: "text-neutral-700 hover:bg-neutral-100",
 danger: "bg-rose-500 text-white hover:bg-rose-600",
 };
 return (
 <Comp
 className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
 {...props}
 />
 );
}
