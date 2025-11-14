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
        "relative overflow-hidden w-full rounded-[100px]",
        "p-6 md:p-8",
        "bg-white/10 backdrop-blur-md border border-white/40",
        "shadow-[0_8px_32px_0_rgba(31,38,135,0.07)]",
        className,
      ].join(" ")}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 
                   h-[40%] bg-gradient-to-b from-white/35 to-transparent 
                   rounded-[inherit]"
      />
      <div className="px-4 md:px-8">
        {" "}
        <h2
          className={[
            "font-rem font-bold",
            "text-[28px] leading-[36px]",
            "md:text-[36px] md:leading-[46px]",
            titleClass,
          ].join(" ")}
        >
          {title}
        </h2>
        {subtitle ? (
          <p
            className={[
              "mt-2 font-rem font-bold",
              "text-[16px] leading-[22px]",
              "md:text-[20px] md:leading-[26px]",
              subtitleClass,
            ].join(" ")}
          >
            {subtitle}
          </p>
        ) : null}
        {children}
      </div>
    </div>
  );
}
