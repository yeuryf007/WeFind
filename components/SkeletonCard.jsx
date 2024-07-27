const SkeletonCard = () => {
    return (
      <div className="cursor-pointer bg-white rounded-lg w-80 h-48 flex flex-row p-4 animate-pulse">
        <div className="w-1/2 bg-gray-300 rounded"></div>
        <div className="w-1/2 flex-col ml-4">
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
          <div className="h-6 bg-gray-300 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-full"></div>
        </div>
      </div>
    );
  };
  
  export default SkeletonCard;