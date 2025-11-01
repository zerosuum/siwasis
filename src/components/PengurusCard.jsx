export default function PengurusCard({ role, name, icon }) {
  return (
    <div className="rounded-[20px] bg-wasis-pr40/90 border border-white/20 shadow-card p-4 sm:p-5 md:p-6 flex items-center gap-4">
      <img
        src={icon}
        alt={role}
        width={80}
        height={80}
        className="shrink-0 w-16 h-16 md:w-20 md:h-20"
      />
      <div className="min-w-0">
        <p className="text-wasis-nt80/80 font-rem text-base md:text-lg leading-6">
          {role}
        </p>
        <p className="text-wasis-nt80 font-rem font-bold text-xl md:text-2xl leading-7 truncate">
          {name}
        </p>
      </div>
    </div>
  );
}
