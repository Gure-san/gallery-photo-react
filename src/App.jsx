import React, { useEffect, useState } from "react";
import { Title } from "./components/Title";
import { Search } from "./components/Search";
import { Gallery } from "./components/Gallery";
import { GET_ACCESS, URL } from "./components/Provider";

const initImages = 12;

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
  const [data, setData] = useState('');c
  const [querySearch, setQuerySearch] = useState(false);

  useEffect(() => {
    const url = !querySearch ? 'src/dataTest.json' : querySearch;
    // fetch(`${URL.INITIAL}${URL.RANDOM}?${URL.PARAMS.COUNT}${initCountRandom}&${URL.CLIENT_ID}${GET_ACCESS('VITE_UNSPLASH_API_KEY')}`).
    // then(data => data.json()).
    // then(data => setData(data))
    fetch(url).
    then(src => src.json()).
    then(src => sliceData(src, setData)); 
  }, [querySearch]);

  return (
    <React.Fragment>
      <Title />
      <Search querySearch={setQuerySearch} dispatchPrevData={setData}/>
      <Gallery data={data} search={querySearch} />
    </React.Fragment>
  );
}

export default App;
