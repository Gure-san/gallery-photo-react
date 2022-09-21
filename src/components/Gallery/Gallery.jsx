import React, { useRef } from "react";
import { useState, useEffect } from "react";
import { Skeleton } from "../Skeleton/";
import { generateUrl, GET_ACCESS, URL, SMALL_DESKTOP, NORMAL_DEKSTOP, selectionProperties } from "../Provider";

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

function statusChecker(initialStatus) {
  let status = null;
  const lengthStatus = initialStatus.length;
  
  for(let x = 0; x < lengthStatus; x++) {
    if(initialStatus[0]) return status = true;
    
  }

  return status;
}

function checkData(incomingData, dispatch) {
  function acceptData(arrData) {
    let pushDataIndicator = false;

    const data = selectionProperties(incomingData);
    const prevData = arrData; //col_one, col_two, col_three
    
    const statusColOne = prevData[0]['skip'];
    const statusColTwo = prevData[1]['skip'];
    const statusColThree = prevData[2]['skip'];
    const allStatus = statusChecker([statusColOne, statusColTwo, statusColThree]); // if true, all statuses are true. || if false one of the statuses is false

    

    return prevData;
  } 

  dispatch(prevData => {
    const {col_one, col_two, col_three} = prevData;
    const [newData_one, newData_two, newData_three] = acceptData([col_one, col_two, col_three]); // containe prop data and skip
    return { col_one : newData_one, col_two : newData_two, col_three: newData_three };
  })
}

function lastImgObserver({dispatch = null, state}) {
  const { stateRendering, querySearch } = state;
  const lastImgs = getLastImg();
  const url = (stateRendering == 'search') ? generateUrl({type : 'RANDOM_SEARCH', customValue : querySearch}) : generateUrl({type : 'RANDOM'}); 
  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((img) => {
        if (img.isIntersecting) {
          if (img.target.classList.contains("lastImg")) {
            fetch(url).
            then(src => src.json()).
            then(src => checkData(src, dispatch));
            observer.unobserve(img.target);
          }
        }
      });
    },
    { rootMargin: "100px 0px" }
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

function GenerateImgElement({ url, width, height, alt }) {
  return (
    <a
      href={url}
      target={"_blank"}
      download
      className={`flex relative before:absolute before:w-full before:h-full before:bg-slate-500 before:opacity-0 hover:before:opacity-30 before:duration-300`}
    >
      <img src={url} width={width} height={height} alt={alt} className="object-cover rounded-md" />
    </a>
  );
}

function ImageElements({ dataUrl }) {
  if(!Array.isArray(dataUrl)) return null;
  return (
    <React.Fragment>
      {dataUrl.map((obj) => (
        <GenerateImgElement
          url={obj.url}
          width={obj.width}
          height={obj.height}
          alt={obj.alt}
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
    if(!dataImgs) setDataImgs(data);

    const timer = setTimeout(() => {
      lastImgObserver({dispatch : setDataImgs, state : state });
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
            <ImageElements dataUrl={dataImgs.col_one.data} />
          </div>

          {/* Col 2 */}
          <div className="flex flex-wrap gap-4 w-full colContainer">
            { (sizeDevice > SMALL_DESKTOP) && <ImageElements dataUrl={dataImgs.col_two.data} /> }
          </div>

          {/* Col 3 */}
          <div className="xl:flex lg:hidden flex flex-wrap gap-4 w-full colContainer">
            { (sizeDevice > NORMAL_DEKSTOP) && <ImageElements dataUrl={dataImgs.col_three.data} /> }
          </div>
        </div>
      ) : (
        <Skeleton />
      )}
    </React.Fragment>
  );
}
