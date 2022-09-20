import React, { useEffect, useState } from "react";
import { Title } from "./components/Title";
import { Search } from "./components/Search";
import { Gallery } from "./components/Gallery";
import { Skeleton } from "./components/Skeleton";
import { GET_ACCESS, URL, generateUrl, selectionProperties } from "./components/Provider";

const initImages = 12;
console.log(GET_ACCESS('VITE_UNSPLASH_API_KEY'))

function sliceData(data, dispatch) {
  const obj = {
    col_one: selectionProperties(data.slice(0, 4)),
    col_two: selectionProperties(data.slice(4, 8)),
    col_three: selectionProperties(data.slice(8, 12)),
  };

  console.log(obj)
  dispatch(obj);
}

function App() {
  const [data, setData] = useState(false);
  const [stateRendering, setStateRendering] = useState({ state : 'initial', querySearch : false }) 

  useEffect(() => {
    if(stateRendering.state == 'search') setData(false);

    const url = !stateRendering.querySearch
      ? generateUrl({ type: "EDITORIAL", count: initImages })
      : stateRendering.querySearch; 
    fetch(url)
    .then(data => data.json())
    .then(src => sliceData(src, setData));
  }, [stateRendering]);

  return (
    <React.Fragment>
      <Title />
      <Search stateRendering={setStateRendering} />
      {!data ? <Skeleton/> : <Gallery data={data} state={stateRendering} />}
    </React.Fragment>
  );
}

export default App;
