import React from "react";
import { useState } from "react";
import { GET_ACCESS, URL } from "../Provider";

function Search({querySearch, dispatchPrevData}) {
  const [search, setSearch] = useState('');

  const handleChange = (event) => setSearch(event.target.value);
  const postSearchData = (event) => {
    event.preventDefault();
    dispatchPrevData(false);
    querySearch('src/dataCoba.json');
  } 

  return (
    <div className="w-max mx-auto mb-8">
      <form>
        <input
          className="px-4 py-1 border-extra border-2 rounded-md text-sm selection:bg-extra selection:text-white"
          type="text"
          name="search"
          value={search}
          onChange={handleChange}
          role={"search"}
        />
        <button
        onClick={postSearchData}
        type={"submit"} 
        className="mx-2 text sm px-6 py-1 rounded-md text-white bg-dark">
          Search
        </button>
      </form>
    </div>
  );
}

export { Search }