export function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center space-x-2 text-white">
      {icon}
      <span className="font-semibold">{label}:</span>
      <span>{value}</span>
    </div>
  );
}
