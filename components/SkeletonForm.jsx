const SkeletonForm = () => {
    return (
      <section className="w-full max-w-full flex-col px-6">
        <div className="head_text text-left h-10 bg-gray-300 rounded w-1/3 mb-10"></div>
  
        <div className="mt-10 w-full flex flex-col gap-7 border-t-2">
          <div className="flex flex-wrap border-b-2">
            <div className="flex flex-col w-full lg:w-1/2 flex-grow h-64 bg-gray-300 rounded"></div>
            <div className="flex flex-col w-full lg:w-1/2 mt-4 lg:mt-0">
              <div className="desc text-left max-w-md h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
              <div className="desc text-left max-w-md h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
              <div className="font-inter font-semibold text-base text-gray-700 h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
              <div className="form_textarea h-20 bg-gray-300 rounded w-full mb-4"></div>
              <div className="flex flex-row pt-2 w-full mb-4">
                <div className="w-1/2 mr-1">
                  <div className="font-inter font-semibold text-base text-gray-700 h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
                  <div className="form_textarea_sm h-10 bg-gray-300 rounded w-full"></div>
                </div>
                <div className="w-1/2 ml-1">
                  <div className="font-inter font-semibold text-base text-gray-700 h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
                  <div className="form_textarea_sm h-10 bg-gray-300 rounded w-full"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="text-sm text-gray-600 sm:text-xl max-w-2xl text-left ml-4 h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
          <div className="flex flex-wrap w-full">
            <div className="file-select-img mb-4 ml-4 mr-4 w-24 h-24 bg-gray-300 rounded"></div>
            <div className="w-full lg:w-1/2">
              <div className="font-inter font-semibold text-base text-gray-700 h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
              <div className="form_textarea h-20 bg-gray-300 rounded w-full mb-4"></div>
              <div className="flex flex-row pt-2 w-full">
                <div className="w-1/2 mr-1">
                  <div className="font-inter font-semibold text-base text-gray-700 h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
                  <div className="form_textarea_sm h-10 bg-gray-300 rounded w-full"></div>
                </div>
                <div className="w-1/2 ml-1">
                  <div className="font-inter font-semibold text-base text-gray-700 h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
                  <div className="form_textarea_sm h-10 bg-gray-300 rounded w-full"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="form_textarea_desc h-32 bg-gray-300 rounded w-full mb-4"></div>
          <div className="flex-end mx-3 mb-5 gap-4">
            <div className="h-8 bg-gray-300 rounded w-20"></div>
            <div className="px-5 py-1.5 text-sm bg-gray-300 rounded-full w-24 h-8"></div>
          </div>
        </div>
      </section>
    );
  };
  
  export default SkeletonForm;