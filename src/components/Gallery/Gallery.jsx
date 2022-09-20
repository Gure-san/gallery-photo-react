import React, { useRef } from "react";
import { useState, useEffect } from "react";
import { Skeleton } from "../Skeleton/";
import { generateUrl, GET_ACCESS, URL, SMALL_DESKTOP, NORMAL_DEKSTOP } from "../Provider";

const initImages = 12;

// Function Area ======

const keyIteration = (() => {
  let numb = 0;
  return () => (numb += 1);
})();

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

  lastImgs.forEach(img => img.classList.add('lastImg'));
  return lastImgs;
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

function lastImgObserver({dispatch = null, state}) {
  const lastImgs = getLastImg();
  const stateRendering = state();

  const getRootMargin = (currentState) => {

  }

  console.log('state : ' + stateRendering)
  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((img) => {
        if (img.isIntersecting) {
          if (img.target.classList.contains("lastImg")) {
            console.log(img.target)
            fetch('src/dataDummy.json').
            then(src => src.json()).
            then(src => checkData(src, dispatch));
            observer.unobserve(img.target);
          }
        }
      });
    },
    { rootMargin: "0px 0px" }
  );

  if(!lastImgs) return false;
  lastImgs.forEach((img) => observer.observe(img))
}

function windowSizeObserver({element = null, dispatch = null, state}) {
  const observer = new ResizeObserver(entries => {
    entries.forEach(screen => {
      if(screen.contentRect.width >= NORMAL_DEKSTOP) dispatch(screen.contentRect.width);
      
      if(screen.contentRect.width < NORMAL_DEKSTOP && screen.contentRect.width >= SMALL_DESKTOP ) dispatch(screen.contentRect.width);
      
      if(screen.contentRect.width < SMALL_DESKTOP) dispatch(screen.contentRect.width);
    })
  });
  
  observer.observe(element);
}


// Component Area ======

function GenerateImgElement({ url }) {
  return (
    <a
      href={url}
      download
      className={`flex relative before:absolute before:w-full before:h-full before:bg-slate-500 before:opacity-0 hover:before:opacity-30 before:duration-300`}
    >
      <img src={url} alt="" className="object-cover rounded-md" />
    </a>
  );
}

function ImageElements({ dataUrl }) {
  if(!Array.isArray(dataUrl)) return null;
  return (
    <React.Fragment>
      {dataUrl.map(({ Url }) => (
        <GenerateImgElement
          url={Url}
          key={keyIteration()}
        />
      ))}
    </React.Fragment>
  );
}

export function Gallery({ data, state }) {
  const [dataImgs, setDataImgs] = useState('');
  const [sizeDevice, setSizeDevice] = useState(0);

  useEffect(() => {
    console.log(dataImgs)
    if(!dataImgs) setDataImgs(data);

    const getState = () => {
      let currentState = state;
      let timer = setTimeout(() => {
        return currentState = 'initial';
      }, 2000);

      clearTimeout(timer);
      return currentState;
    };
    const timer = setTimeout(() => {
      console.log('timer on...');
      lastImgObserver({dispatch : setDataImgs, state : getState });
      windowSizeObserver({element : window.document.body, dispatch : setSizeDevice})
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [dataImgs, sizeDevice]);

  return (
    <React.Fragment>
      { dataImgs ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] xl:max-w-[1024px] lg:max-w-[768px] max-w-[425px] gap-4 mx-auto mb-8">
          {/* Col 1 */}
          <div className="flex flex-wrap gap-4 w-full colContainer">
            <ImageElements dataUrl={dataImgs.col_one} />
          </div>

          {/* Col 2 */}
          <div className="flex flex-wrap gap-4 w-full colContainer">
            { (sizeDevice > SMALL_DESKTOP) && <ImageElements dataUrl={dataImgs.col_two} /> }
          </div>

          {/* Col 3 */}
          <div className="xl:flex lg:hidden flex flex-wrap gap-4 w-full colContainer">
            { (sizeDevice > NORMAL_DEKSTOP) && <ImageElements dataUrl={dataImgs.col_three} /> }
          </div>
        </div>
      ) : (
        <Skeleton />
      )}
    </React.Fragment>
  );
}
