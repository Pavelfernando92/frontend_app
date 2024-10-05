// LegendItem.tsx
export interface LegendItemProps {
  color: string;
  label: string;
}

const LegendItem: React.FC<LegendItemProps> = ({ color, label }) => {
  return (
    <div className="flex items-center space-x-2">
      <div className={`w-5 sm:w-6 h-5 sm:h-6 rounded ${color}`}></div>
      <span className="text-yellow-100 text-sm sm:text-base">{label}</span>
    </div>
  );
};

export default LegendItem;
