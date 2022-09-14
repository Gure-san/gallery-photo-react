import React from "react";
import { useRef } from "react";
import { createContext } from "react";
import { useState, useEffect } from "react";
import { Skeleton } from "../Skeleton/";

const keyIteration = (() => {
  let numb = 0;
  return () => (numb += 1);
})();

function ImageElement({ dataUrl }) {
  if (!dataUrl) return null;
  const lastElement = [...dataUrl].reverse()[0]["Url"];
  return (
    <React.Fragment>
      {dataUrl.map(({ Url }) => (
        <a
          href={Url}
          download
          key={keyIteration()}
          className={`flex relative before:absolute before:w-full before:h-full before:bg-slate-500 before:opacity-0 hover:before:opacity-30 before:duration-300 ${
            Url == lastElement ? "lastImg" : ""
          }`}
        >
          <img src={Url} alt="" className="object-cover rounded-md" />
        </a>
      ))}
    </React.Fragment>
  );
}

function Coba() {
  useEffect(() => {
    setTimeout(() => {
      const lastImgs = document.querySelectorAll(".lastImg");
      const lastImgObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((img) => {
          console.log(img)
        });
      });
      lastImgs.forEach((img) => lastImgObserver.observe(img));
    }, 1000);
  }, []);

  return <React.Fragment></React.Fragment>;
}

export function Gallery({ data }) {
  return (
    <React.Fragment>
      {data ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] xl:max-w-[1024px] lg:max-w-[768px] max-w-[425px] gap-4 mx-auto mb-8">
          {/* Col 1 */}
          <div className="flex flex-wrap gap-4 w-full">
            <ImageElement dataUrl={data.col_one} />
            <Coba />
          </div>

          {/* Col 2 */}
          <div className="flex flex-wrap gap-4 w-full">
            <ImageElement dataUrl={data.col_two} />
          </div>

          {/* Col 3 */}
          <div className="xl:flex flex flex-wrap gap-4 w-full lg:hidden">
            <ImageElement dataUrl={data.col_three} />
          </div>
        </div>
      ) : (
        <Skeleton />
      )}
    </React.Fragment>
  );
}
