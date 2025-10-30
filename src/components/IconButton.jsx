export default function IconButton({ children, title, onClick }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="flex h-8 w-8 items-center justify-center rounded-full bg-[#6E8649] text-white hover:opacity-90"
    >
      {children}
    </button>
  );
}
