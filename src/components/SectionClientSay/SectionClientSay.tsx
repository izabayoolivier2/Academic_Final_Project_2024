"use client";

// @ts-ignore
import Glide from "@glidejs/glide/dist/glide.esm";
import Heading from "@/components/Heading/Heading";
import React, { FC, useId, useRef, useState } from "react";
import { useEffect } from "react";
import clientSayMain from "@/images/clientSayMain.png";
import clientSay1 from "@/images/clientSay1.png";
import clientSay2 from "@/images/clientSay2.png";
import clientSay3 from "@/images/clientSay3.png";
import clientSay4 from "@/images/clientSay4.png";
import clientSay5 from "@/images/clientSay5.png";
import clientSay6 from "@/images/clientSay6.png";
import quotationImg from "@/images/quotation.png";
import quotationImg2 from "@/images/quotation2.png";
import quote1 from "@/images/svgs/quote.svg";
import quote2 from "@/images/svgs/quote2.svg";
import { StarIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { DEMO_DATA } from "./data";
import { Reveal } from "../Reveal";

export interface SectionClientSayProps {
  className?: string;
}

const SectionClientSay: FC<SectionClientSayProps> = ({ className = "" }) => {
  const sliderRef = useRef(null);

  const [isShow, setIsShow] = useState(false);

  useEffect(() => {
    const OPTIONS: Partial<Glide.Options> = {
      perView: 1,
      direction: "ltr",
    };

    if (!sliderRef.current) return;

    let slider = new Glide(sliderRef.current, OPTIONS);
    slider.mount();
    setIsShow(true);
    return () => {
      slider.destroy();
    };
  }, [sliderRef]);

  const renderBg = () => {
    return (
      <div className="hidden md:block">
        <Image
          sizes="100px"
          className="absolute top-9 -left-20"
          src={clientSay1}
          alt=""
        />
        <Image
          sizes="100px"
          className="absolute bottom-[100px] right-full mr-40"
          src={"images/clientSay2.png"}
          alt=""
        />
        <Image
          sizes="100px"
          className="absolute top-full left-[140px]"
          src={clientSay3}
          alt=""
        />
        <Image
          sizes="100px"
          className="absolute -bottom-10 right-[140px]"
          src={clientSay4}
          alt=""
        />
        <Image
          sizes="100px"
          className="absolute left-full ml-32 bottom-[80px]"
          src={clientSay5}
          alt=""
        />
        <Image
          sizes="100px"
          className="absolute -right-10 top-10 "
          src={clientSay6}
          alt=""
        />
      </div>
    );
  };

  return (
    <div
      className={`nc-SectionClientSay relative flow-root ${className} `}
      data-nc-id="SectionClientSay"
    >
      <Heading desc="You would love to work with us" isCenter>
        <Reveal>
          <>
            What People Say <br /> About Us
          </>
        </Reveal>
      </Heading>
      <div className="relative md:mb-16 max-w-2xl mx-auto">
        <div
          ref={sliderRef}
          className={`mt-12 lg:mt-16 relative ${isShow ? "" : "invisible"}`}
        >
          <Image
            className="opacity-50 md:opacity-100 absolute -mr-16 lg:mr-3 right-full top-1"
            src={quote1}
            alt=""
          />
          <Image
            className="opacity-50 w-15 h-15 md:opacity-100 absolute -ml-16 lg:ml-3 left-full top-1"
            src={quote2}
            alt=""
          />
          <div className="glide__track " data-glide-el="track">
            <ul className="glide__slides ">
              {DEMO_DATA.map((item) => (
                <li
                  key={item.id}
                  className="glide__slide flex flex-col items-center text-center"
                >
                  <Reveal>
                    <span
                      className="block md:text-[1.4rem] text-sm dark:text-typoPrimaryColor"
                      style={{ lineHeight: "2.5rem" }}
                    >
                      {item.content}
                    </span>
                  </Reveal>
                  <Reveal>
                    <span className="block mt-10 md:text-lg text-sm dark:text-typoSecondaryColor font-bold">
                      {item.clientName}
                    </span>
                  </Reveal>
                  <Reveal>
                    <div className="flex items-center space-x-0.5 mt-3.5 text-yellow-500">
                      <StarIcon className="w-6 h-6" />
                      <StarIcon className="w-6 h-6" />
                      <StarIcon className="w-6 h-6" />
                      <StarIcon className="w-6 h-6" />
                      <StarIcon className="w-6 h-6" />
                    </div>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
          <div
            className="mt-10 glide__bullets flex items-center justify-center"
            data-glide-el="controls[nav]"
          >
            {DEMO_DATA.map((item, index) => (
              <button
                key={item.id}
                className=" w-2 h-2 rounded-full bg-white mx-1 focus:outline-none"
                data-glide-dir={`=${index}`}
              ></button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionClientSay;
