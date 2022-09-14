import React, { useEffect, useState } from "react";
import { Title } from "./components/Title";
import { Search } from "./components/Search";
import { Gallery } from "./components/Gallery";
import { Skeleton } from "./components/Skeleton";

const initImages = 12;
const GET_ACCESS = (variable) => import.meta.env[variable];
const URL = {
  INITIAL: "https://api.unsplash.com",
  RANDOM: "/photos/random",
  SEARCH: "/search/photos",
  CLIENT_ID: "client_id=",
  PARAMS: {
    PER_PAGE: "per_page=",
    COUNT: "count=",
  },
};


// Function and Component Area =====
function sliceData(data, dispatch) {
  const obj = {
    col_one: data.slice(0, 4),
    col_two: data.slice(4, 8),
    col_three: data.slice(8, 12),
  };

  dispatch(obj);
}



function App() {
  const [data, setData] = useState('');
  useEffect(() => {
    // Get Random Photo
    // fetch(`${URL.INITIAL}${URL.RANDOM}?${URL.PARAMS.COUNT}${initCountRandom}&${URL.CLIENT_ID}${GET_ACCESS('VITE_UNSPLASH_API_KEY')}`).
    // then(data => data.json()).
    // then(data => setData(data))
    fetch('src/dataTest.json').
    then(src => src.json()).
    then(src => sliceData(src, setData)); 
  }, []);

  return (
    <React.Fragment>
      <Title />
      <Search />
      <Gallery data={data} />
    </React.Fragment>
  );
}

export default App;
