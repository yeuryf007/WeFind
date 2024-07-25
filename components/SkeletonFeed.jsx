const FeedSkeleton = () => {
    return (
      <section className="feed">
        <div className="relative w-full flex-center search_input animate-pulse">
          <div className="absolute left-2 w-[42px] h-[42px] bg-gray-300 rounded-full"></div>
          <div className="w-full h-[50px] bg-gray-200 rounded-full"></div>
        </div>
      </section>
    )
  }
  
  export default FeedSkeleton;