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
      className={`bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow ${className}`}
    >
      <div className="px-6 py-4 border-b border-gray-100 flex items-center space-x-3">
        <span className="text-2xl">{icon}</span>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

