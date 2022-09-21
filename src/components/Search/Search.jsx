import React from "react";
import { useState } from "react";

function Search({stateRendering}) {
  const [search, setSearch] = useState('');

  const handleChange = (event) => setSearch(event.target.value);
  const postSearchData = (event) => {
    event.preventDefault();
    const state = {
      state : 'search',
      querySearch : search
    }

    return stateRendering(state);
  } 

  return (
    <div className="w-max mx-auto mb-8">
      <form onSubmit={postSearchData}>
        <input
          className="px-4 py-1 border-extra border-2 rounded-md text-sm selection:bg-extra selection:text-white"
          type="text"
          name="search"
          value={search}
          onChange={handleChange}
          role={"search"}
          autoComplete="off"
        />
        <button
        type={"submit"} 
        className="mx-2 text sm px-6 py-1 rounded-md text-white bg-dark">
          Search
        </button>
      </form>
    </div>
  );
}

export { Search }