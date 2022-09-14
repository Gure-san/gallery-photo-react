import React from "react";

export function Search() {
  return (
    <div className="w-max mx-auto mb-8">
      <input
      className="px-4 py-1 border-extra border-2 rounded-md text-sm selection:bg-extra selection:text-white" 
      type="text" role={"search"} />
      <button
      className="mx-2 text sm px-6 py-1 rounded-md text-white bg-dark">
        Search
      </button>
    </div>
  )
}