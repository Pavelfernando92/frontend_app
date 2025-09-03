interface CreditDisplayProps {
  user: User;
  minimumCredits: number;
}

const CreditDisplay: React.FC<CreditDisplayProps> = ({ user, minimumCredits }) => {
  const isLowCredits = user.creditos < minimumCredits;
  
  return (
    <div className="fixed top-4 left-4 z-50 bg-black/80 backdrop-blur-sm rounded-lg p-4 border border-yellow-400/30">
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
          <span className="text-yellow-400 font-bold text-sm">CRÉDITOS</span>
        </div>
        
        <div className="text-center">
          <div className={`text-2xl font-bold ${isLowCredits ? 'text-red-400' : 'text-yellow-400'}`}>
            {user.creditos.toLocaleString()}
          </div>
          
          {isLowCredits && (
            <div className="text-xs text-red-300 mt-1">
              Mínimo: {minimumCredits.toLocaleString()}
            </div>
          )}
        </div>
        
        {/* Barra de progreso visual */}
        <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              isLowCredits 
                ? 'bg-red-500' 
                : user.creditos < minimumCredits * 2 
                  ? 'bg-yellow-500' 
                  : 'bg-green-500'
            }`}
            style={{ 
              width: `${Math.min(100, (user.creditos / (minimumCredits * 3)) * 100)}%` 
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default CreditDisplay;
