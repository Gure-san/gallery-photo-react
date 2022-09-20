import React, { useEffect, useState } from "react";
import { Title } from "./components/Title";
import { Search } from "./components/Search";
import { Gallery } from "./components/Gallery";
import { Skeleton } from "./components/Skeleton";
import { GET_ACCESS, URL, generateUrl } from "./components/Provider";

const initImages = 12;
function nameConnector(firstName, lastName) {
  const first_name = (firstName != null) ? firstName : '';
  const last_name = (lastName != null) ? lastName : "";
  return `${first_name} ${last_name}`;
}

function selectionProperties(arrData) {
  const tempData = [];
  arrData.forEach(obj => {
    console.log(obj)
    tempData.push({
      width: obj.width,
      height: obj.height,
      url: obj.urls.regular,
      photographer: {
        name: nameConnector(obj.user.first_name, obj.user.last_name),
        profil: obj.user.links.html
      },
      download: obj.links.download_location
    });
  })
  return tempData;
}

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
      {!data ? <Skeleton/> : <Gallery data={data} state={stateRendering.state} />}
    </React.Fragment>
  );
}

export default App;
