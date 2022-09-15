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
  const lastImgsContainer = Array.from(document.querySelectorAll('.colContainer'));
  const rawParts = [...lastImgsContainer];
  const lastImgs = [];
  rawParts.forEach(container => {
    const childrenContainer = Array.from(container.children);
    lastImgs.push(childrenContainer.reverse()[0])
  });

  return lastImgs;
}

function removeClassLastImg() {
  const lastImg = getLastImg();
  console.log(lastImg);
}

function lastImgObserver(dispatch) {
  const lastImgs = getLastImg();
  const lastImgObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((img) => {
        if (img.isIntersecting) {
          if (img.target.classList.contains("lastImg")) {
            fetch("src/dataDummy.json")
            .then((src) => src.json())
            .then((src) => {
              const { Url } = src;
              return dispatch(Url);
            });
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

function GenerateImgElement({ url, lastElement = null, newImg = false }) {
  return (
    <a
      href={url}
      download
      className={`flex relative before:absolute before:w-full before:h-full before:bg-slate-500 before:opacity-0 hover:before:opacity-30 before:duration-300 ${
        url == lastElement || newImg ? "lastImg" : ""
      }`}
    >
      <img src={url} alt="" className="object-cover rounded-md" />
    </a>
  );
}

function ImageElements({ dataUrl, newImg = false }) {
  const lastElement = !newImg ? [...dataUrl].reverse()[0]["Url"] : null;
  return (
    <React.Fragment>
      {!newImg &&
        dataUrl.map(({ Url }) => (
          <GenerateImgElement
            url={Url}
            lastElement={lastElement}
            key={keyIteration()}
          />
        ))}

      {newImg && <GenerateImgElement url={newImg} newImg={true} />}
    </React.Fragment>
  );
}

export function Gallery({ data }) {
  const [newImg, setNewImg] = useState("");

  useEffect(() => {
    // const checkIndicator = newImgIndicator.length;
    // if( checkIndicator ) {
    //   lastImgObserver()
    // }
    lastImgObserver(setNewImg);
    console.log(newImg)

    let timer = null;
    if(!newImg) {
      timer = setTimeout(() => {
        lastImgObserver(setNewImg);
      }, 1000);
    }

    return () => {
      if(!newImg) clearTimeout(timer);
    }
  }, [newImg]);

  return (
    <React.Fragment>
      {data ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] xl:max-w-[1024px] lg:max-w-[768px] max-w-[425px] gap-4 mx-auto mb-8">
          {/* Col 1 */}
          <div className="flex flex-wrap gap-4 w-full colContainer">
            <ImageElements dataUrl={data.col_one} />
            {newImg && <ImageElements newImg={newImg} />}
          </div>

          {/* Col 2 */}
          <div className="flex flex-wrap gap-4 w-full colContainer">
            <ImageElements dataUrl={data.col_two} />
            {newImg && <ImageElements newImg={newImg} />}
          </div>

          {/* Col 3 */}
          <div className="xl:flex lg:hidden flex flex-wrap gap-4 w-full colContainer">
            <ImageElements dataUrl={data.col_three} />
            {newImg && <ImageElements newImg={newImg} />}
          </div>
        </div>
      ) : (
        <Skeleton />
      )}
    </React.Fragment>
  );
}
