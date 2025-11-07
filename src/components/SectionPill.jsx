// export default function SectionPill({
//   title,
//   subtitle,
//   className = "",
//   titleClass = "text-wasis-pr80", 
//   subtitleClass = "text-wasis-pr80",
//   children,
// }) {
//   return (
//     <div
//       className={[
//         "relative overflow-hidden w-full rounded-[100px] p-8",
//         "bg-white/10 backdrop-blur-md border border-white/40",
//         "shadow-[0_8px_32px_0_rgba(31,38,135,0.07)]",
//         className,
//       ].join(" ")}
//     >
//       <div className="pointer-events-none absolute inset-x-0 top-0 h-[40%] bg-gradient-to-b from-white/35 to-transparent rounded-[inherit]" />
//       <h2
//         className={`font-rem font-bold text-[36px] leading-[46px] ${titleClass}`}
//       >
//         {title}
//       </h2>
//       {subtitle ? (
//         <p
//           className={`font-rem font-bold text-[20px] leading-[26px] mt-2 ${subtitleClass}`}
//         >
//           {subtitle}
//         </p>
//       ) : null}
//       {children}
//     </div>
//   );
// }

export default function SectionPill({
  title,
  subtitle,
  className = "",
  titleClass = "text-wasis-pr80",
  subtitleClass = "text-wasis-pr80",
  children,
}) {
  return (
    <div
      className={[
        "relative overflow-hidden w-full rounded-[100px] p-8", // <-- p-8 (padding 32px) sudah ada
        "bg-white/10 backdrop-blur-md border border-white/40",
        "shadow-[0_8px_32px_0_rgba(31,38,135,0.07)]",
        className,
      ].join(" ")}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[40%] bg-gradient-to-b from-white/35 to-transparent rounded-[inherit]" />

      <div className="px-8">
        <h2
          className={`font-rem font-bold text-[36px] leading-[46px] ${titleClass}`}
        >
          {title}
        </h2>
        {subtitle ? (
          <p
            className={`font-rem font-bold text-[20px] leading-[26px] mt-2 ${subtitleClass}`}
          >
            {subtitle}
          </p>
        ) : null}
        {children}
      </div>
    </div>
  );
}