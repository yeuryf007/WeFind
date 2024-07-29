const SkeletonNav = () => {
    return (
      <nav className="flex justify-between w-full pt-3 pb-3 animate-pulse" id="navbars">
        <div className="w-[246px] h-[70px] bg-gray-200 rounded"></div>
        <div className="sm:flex hidden w-7/12 justify-between items-center">
          <div className="flex gap-5 align-center">
            <div className="w-16 h-6 bg-gray-200 rounded"></div>
            <div className="w-24 h-6 bg-gray-200 rounded"></div>
            <div className="w-36 h-6 bg-gray-200 rounded"></div>
          </div>
          <div className="w-40 h-10 bg-gray-200 rounded"></div>
        </div>
        <div className="sm:hidden flex relative">
          <div className="w-[65px] h-[37px] bg-gray-200 rounded"></div>
        </div>
      </nav>
    );
  };
  
  export default SkeletonNav;