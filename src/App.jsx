import React, { useEffect, useRef, useState } from "react";
import { Title } from "./components/Title";
import { Search } from "./components/Search";
import { Gallery } from "./components/Gallery";
import { Skeleton } from "./components/Skeleton";
import { generateUrl, selectionProperties } from "./components/Provider";

function sliceData(data, dispatch) {
  const obj = {
    col_one: selectionProperties(data.slice(0, 4), true),
    col_two: selectionProperties(data.slice(4, 8), true),
    col_three: selectionProperties(data.slice(8, 12), true),
  };

  dispatch(obj);
}

function App() {
  const [data, setData] = useState(false);
  const [stateRendering, setStateRendering] = useState({ state : 'initial', querySearch : false }) ;

  useEffect(() => {
    if(stateRendering.state == 'search') setData(false);

    const url = !stateRendering.querySearch
      ? generateUrl({ type: "EDITORIAL", count: 12 })
      : generateUrl({type : 'SEARCH', customValue : stateRendering.querySearch}); 
    fetch(url)
    .then(data => data.json())
    .then(src => {
      if(stateRendering.state == 'search') return sliceData(src['results'], setData)
      return sliceData(src, setData)
    });
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
