export function Skeleton() {
  return (
    <div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(300px,1fr))] xl:max-w-[1024px] lg:max-w-[768px] max-w-[425px] w-full  mx-auto mb-8 gap-4">
        {/* Col 1 */}
        <div className="w-full flex justify-center flex-wrap gap-4">
          <span className="w-[300px] h-[200px] bg-tertiary rounded-md animate-pulse" />
          <span className="w-[300px] h-[200px] bg-tertiary rounded-md animate-pulse" />
          <span className="w-[300px] h-[200px] bg-tertiary rounded-md animate-pulse" />
        </div>

        {/* Col 2 */}
        <div className="w-full flex justify-center flex-wrap gap-4">
          <span className="w-[300px] h-[200px] bg-tertiary rounded-md animate-pulse" />
          <span className="w-[300px] h-[200px] bg-tertiary rounded-md animate-pulse" />
          <span className="w-[300px] h-[200px] bg-tertiary rounded-md animate-pulse" />
        </div>

        {/* Col 3 */}
        <div className="xl:flex lg:hidden w-full flex justify-center flex-wrap gap-4">
          <span className="w-[300px] h-[200px] bg-tertiary rounded-md animate-pulse" />
          <span className="w-[300px] h-[200px] bg-tertiary rounded-md animate-pulse" />
          <span className="w-[300px] h-[200px] bg-tertiary rounded-md animate-pulse" />
        </div>
      </div>
    </div>
  );
}
