import React from "react";
import { useState, useEffect } from "react";
import { Skeleton } from "../Skeleton/";
import {
  generateUrl,
  SMALL_DESKTOP,
  NORMAL_DEKSTOP,
  selectionProperties,
} from "../Provider";

// Function Area ======

const pushColIndicator = (() => {
  let col = -1;
  return () => {
    if (col == 2) return (col = -1 + 1);
    return (col += 1);
  };
})();

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
  if (!lastImgs.length) return false;

  lastImgs.forEach((img) => img.classList.add("lastImg"));
  return lastImgs;
}

function pusher(prevData, selectionData) {
  const colIndicator = pushColIndicator();

  switch (colIndicator) {
    case 0:
      prevData[0].push(selectionData[0]);
      break;

    case 1:
      prevData[1].push(selectionData[0]);
      break;

    case 2:
      prevData[2].push(selectionData[0]);
      break;
  }

  return prevData;
}

function checkData(incomingData, dispatch, debug = false) {
  function acceptData(arrData) {
    const selectionData = selectionProperties(incomingData, debug);
    const result = pusher(arrData, selectionData);
    return result;
  }

  dispatch((prevData) => {
    const { col_one, col_two, col_three } = prevData;
    const [newData_one, newData_two, newData_three] = acceptData([
      col_one,
      col_two,
      col_three,
    ]);
    return {
      col_one: newData_one,
      col_two: newData_two,
      col_three: newData_three,
    };
  });
}

function lastImgObserver({ dispatch = null, state }) {
  const lastImgs = getLastImg();
  const url =
    state.state == "search"
      ? generateUrl({ type: "RANDOM_SEARCH", customValue: state.querySearch })
      : generateUrl({ type: "RANDOM" });
  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((img) => {
        if (img.isIntersecting) {
          if (img.target.classList.contains("lastImg")) {
            fetch(url)
              .then((src) => src.json())
              .then((src) => checkData(src, dispatch));
            observer.unobserve(img.target);
          }
        }
      });
    },
    { rootMargin: "300px 0px" }
  );

  if (!lastImgs) return false;
  lastImgs.forEach((img) => observer.observe(img));
}

function windowSizeObserver({ element = null, dispatch = null, state }) {
  const observer = new ResizeObserver((entries) => {
    entries.forEach((screen) => {
      if (screen.contentRect.width >= NORMAL_DEKSTOP)
        dispatch(screen.contentRect.width);

      if (
        screen.contentRect.width < NORMAL_DEKSTOP &&
        screen.contentRect.width >= SMALL_DESKTOP
      )
        dispatch(screen.contentRect.width);

      if (screen.contentRect.width < SMALL_DESKTOP)
        dispatch(screen.contentRect.width);
    });
  });

  observer.observe(element);
}

// Component Area ======

function GenerateImgElement({ url, width, height, alt, info }) {
  return (
    <div
      className={`flex relative before:absolute before:w-full before:h-full before:rounded-md before:bg-slate-500 before:opacity-0 hover:before:opacity-30 before:duration-300 group`}>

      <div className="absolute bottom-2 rounded-b-sm flex justify-between w-full items-center px-2 duration-300 opacity-0 invisible group-hover:opacity-100 group-hover:visible">
        <div 
        className="text-sm text-white">
          Photo By <a href={info.profil} className="underline">{info.name}</a> on <a href="https://unsplash.com/" className="underline">Unsplash</a>
        </div>
        <a
          href={url}
          target={"_blank"}
          download
          className="text-sm w-max h-max bg-dark text-white px-4 py-1.5 rounded-md">
          Download
        </a>
      </div>

      <img
        src={url}
        width={width}
        height={height}
        alt={alt}
        className="object-cover sm:rounded-md"
      />
    </div>
  );
}

function ImageElements({ dataUrl }) {
  if (!Array.isArray(dataUrl)) return null;
  return (
    <React.Fragment>
      {dataUrl.map((obj) => (
        <GenerateImgElement
          url={obj.url}
          width={obj.width}
          height={obj.height}
          alt={obj.alt}
          info={obj.photographer}
          key={keyIteration()}
        />
      ))}
    </React.Fragment>
  );
}

export function Gallery({ data, state }) {
  const [dataImgs, setDataImgs] = useState("");
  const [sizeDevice, setSizeDevice] = useState(0);

  useEffect(() => {
    if (!dataImgs) setDataImgs(data);

    const timer = setTimeout(() => {
      lastImgObserver({ dispatch: setDataImgs, state: state });
      windowSizeObserver({
        element: window.document.body,
        dispatch: setSizeDevice,
      });
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [dataImgs, sizeDevice]);

  return (
    <React.Fragment>
      {dataImgs ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] xl:max-w-[1024px] lg:max-w-[768px] max-w-[425px] gap-4 mx-auto mb-8">
          {/* Col 1 */}
          <div className="flex flex-wrap gap-4 w-full colContainer">
            <ImageElements dataUrl={dataImgs.col_one} />
          </div>

          {/* Col 2 */}
          <div className="flex flex-wrap gap-4 w-full colContainer">
            {sizeDevice > SMALL_DESKTOP && (
              <ImageElements dataUrl={dataImgs.col_two} />
            )}
          </div>

          {/* Col 3 */}
          <div className="xl:flex lg:hidden flex flex-wrap gap-4 w-full colContainer">
            {sizeDevice > NORMAL_DEKSTOP && (
              <ImageElements dataUrl={dataImgs.col_three} />
            )}
          </div>
        </div>
      ) : (
        <Skeleton />
      )}
    </React.Fragment>
  );
}
