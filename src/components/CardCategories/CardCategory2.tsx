import React, { FC, useEffect } from "react";
import NcImage from "@/shared/NcImage/NcImage";
import Link from "next/link";
import { StaticImageData } from "next/image";
import { Reveal } from "../Reveal";
export interface CardCategory2Props {
  className?: string;
  ratioClass?: string;
  bgClass?: string;
  featuredImage?: string;
  name: string;
  desc?: string;
}

const CardCategory2: FC<CardCategory2Props> = ({
  className = "",
  ratioClass = "aspect-w-1 aspect-h-1",
  bgClass = "bg-orange-50",
  featuredImage = ".",
  name,
  desc = "",
}) => {
  return (
    <div
      className={`nc-CardCategory2 ${className}`}
      data-nc-id="CardCategory2"
    >
      <div
        className={`flex-1 relative w-full h-0 rounded-lg overflow-hidden group ${ratioClass} ${bgClass}`}
      >
        <div className="">
          <NcImage
            fill
            alt=""
            src={featuredImage}
            className="object-cover rounded-sm"
            sizes="400px"
          />
        </div>
        <span className="opacity-0 group-hover:opacity-100 absolute inset-0 bg-black bg-opacity-10 transition-opacity rounded-2xl"></span>
      </div>
      <div className="mt-5 flex flex-col justify-center items-center ">
        <Reveal>
          <>
            <h2 className="text-base sm:text-lg text-neutral-900 dark:text-typoSecondaryColor font-semibold text-center">
              {name}
            </h2>
          </>
        </Reveal>
      </div>
    </div>
  );
};

export default CardCategory2;
