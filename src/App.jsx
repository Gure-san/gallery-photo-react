import React, { useEffect, useState } from "react";
import { Title } from "./components/Title";
import { Search } from "./components/Search";
import { Gallery } from "./components/Gallery";
import { Skeleton } from "./components/Skeleton";
import { GET_ACCESS, URL, generateUrl, selectionProperties, getDummyUrl } from "./components/Provider";

// const temp = generateUrl({ type: "EDITORIAL", count: initImages });
const tempUrl = 'src/test/dataTest.json';
const initImages = 12;

function sliceData(data, dispatch) {
  const obj = {
    col_one: {
      data : selectionProperties(data.slice(0, 4), true),
      skip : false
    },
    col_two: {
      data : selectionProperties(data.slice(4, 8), true),
      skip : true
    },
    col_three: {
      data : selectionProperties(data.slice(8, 12), true),
      skip : true
    },
  };

  dispatch(obj);
}

function App() {
  const [data, setData] = useState(false);
  const [stateRendering, setStateRendering] = useState({ state : 'initial', querySearch : false }) 

  useEffect(() => {
    if(stateRendering.state == 'search') setData(false);

    const url = !stateRendering.querySearch
      ? tempUrl
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
