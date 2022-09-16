import React from "react";
import { useRef } from "react";
import { createContext } from "react";
import { useState, useEffect } from "react";
import { Skeleton } from "../Skeleton/";
import { GET_ACCESS, URL } from "../Provider";
import { useReducer } from "react";

// Function Area ======

const keyIteration = (() => {
  let numb = 0;
  return () => (numb += 1);
})();

function generateUrl({ type, count = 1, customValue = false }) {
  switch (type) {
    case "RANDOM":
      const url = `${URL.INITIAL}${URL.RANDOM}?${URL.PARAMS.COUNT}${count}&${
        URL.CLIENT_ID
      }${GET_ACCESS("VITE_UNSPLASH_API_KEY")}`;
      return url;

    default:
      break;
  }
}

function getLastImg() {
  const lastImgsContainer = Array.from(
    document.querySelectorAll(".colContainer")
  );
  const rawParts = [...lastImgsContainer];
  const lastImgs = [];
  rawParts.forEach((container) => {
    const childrenContainer = Array.from(container.children);
    childrenContainer.length && lastImgs.push(childrenContainer.reverse()[0]);
  });

  if(!lastImgs.length) return false;
  return lastImgs;
}

async function processData(incomingData, dispatch) {
  const data = await incomingData;
  dispatch(data);
}

function checkData(incomingData, dispatch) {
  function acceptData(arrData) {
    const prevData = arrData;
    prevData.forEach(col => col.push(incomingData));
    return prevData;
  } 

  dispatch(prevData => {
    const {col_one, col_two, col_three} = prevData;
    const [newData_one, newData_two, newData_three] = acceptData([col_one, col_two, col_three]);
    return { col_one : newData_one, col_two : newData_two, col_three: newData_three };
  })
}

function lastImgObserver(dispatch, prevData) {
  const lastImgs = getLastImg();
  const lastImgObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((img) => {
        if (img.isIntersecting) {
          if (img.target.classList.contains("lastImg")) {
            fetch('src/dataDummy.json').
            then(src => src.json()).
            then(src => checkData(src, dispatch));
            observer.unobserve(img.target);
          }
        }
      });
    },
    { rootMargin: "200px 0px" }
  );

  lastImgs.forEach((img) => lastImgObserver.observe(img));
}

// Component Area ======

function GenerateImgElement({ url, lastElement = null}) {
  return (
    <a
      href={url}
      download
      className={`flex relative before:absolute before:w-full before:h-full before:bg-slate-500 before:opacity-0 hover:before:opacity-30 before:duration-300 ${
        url == lastElement ? "lastImg" : ""
      }`}
    >
      <img src={url} alt="" className="object-cover rounded-md" />
    </a>
  );
}

function ImageElements({ dataUrl }) {
  if(!Array.isArray(dataUrl)) return null;
  const lastElement = [...dataUrl].reverse()[0]["Url"];
  return (
    <React.Fragment>
      {dataUrl.map(({ Url }) => (
        <GenerateImgElement
          url={Url}
          lastElement={lastElement}
          key={keyIteration()}
        />
      ))}
    </React.Fragment>
  );
}

export function Gallery({ data }) {
  const [dataImgs, setDataImgs] = useState('');
  const currentDataImgs = useRef();
  !dataImgs && processData(data, setDataImgs);
  
  useEffect(() => {
    currentDataImgs.current =  dataImgs;
    console.log(currentDataImgs.current);

    const timer = setTimeout(() => {
      lastImgObserver(setDataImgs);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [dataImgs]);

  return (
    <React.Fragment>
      { dataImgs ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] xl:max-w-[1024px] lg:max-w-[768px] max-w-[425px] gap-4 mx-auto mb-8">
          {/* Col 1 */}
          <div className="flex flex-wrap gap-4 w-full colContainer">
            { dataImgs && <ImageElements dataUrl={dataImgs.col_one} /> }
          </div>

          {/* Col 2 */}
          <div className="flex flex-wrap gap-4 w-full colContainer">
            { dataImgs && <ImageElements dataUrl={dataImgs.col_two} /> }
          </div>

          {/* Col 3 */}
          <div className="xl:flex lg:hidden flex flex-wrap gap-4 w-full colContainer">
            { dataImgs && <ImageElements dataUrl={dataImgs.col_three} /> }
          </div>
        </div>
      ) : (
        <Skeleton />
      )}
    </React.Fragment>
  );
}
