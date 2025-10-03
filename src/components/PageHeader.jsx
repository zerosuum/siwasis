export default function PageHeader({ title, subtitle, actions, breadcrumb }) {
 return (
 <div className="mb-4 space-y-2">
 {breadcrumb}
 <div className="flex flex-wrap items-end justify-between gap-3">
 <div>
 <h1 className="text-xl font-semibold">{title}</h1>
 {subtitle && <p className="text-sm text-neutral-500">{subtitle}</p>}
 </div>
 {actions}
 </div>
 </div>
 );
}
