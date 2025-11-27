interface DashboardCardProps {
  title: string;
  icon: string;
  children: React.ReactNode;
  className?: string;
}

export default function DashboardCard({
  title,
  icon,
  children,
  className = "",
}: DashboardCardProps) {
  return (
    <div
      className={`bg-white rounded-3xl border border-brand-gold/20 shadow-[0_2px_20px_-4px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_40px_-8px_rgba(0,0,0,0.1)] transition-all duration-500 ${className}`}
    >
      <div className="px-6 py-5 border-b border-brand-gold/10 flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-brand-sage flex items-center justify-center border border-brand-gold/20">
          <span className="text-xl">{icon}</span>
        </div>
        <h3 className="text-lg font-bold">{title}</h3>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}
