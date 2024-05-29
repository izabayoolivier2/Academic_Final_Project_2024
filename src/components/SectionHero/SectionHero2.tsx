"use client";
import iconPoints from "@/images/svgs/icon-points.svg";
import Adventure from "@/images/hero.jpg";
import { StarIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { FC, useEffect, useState } from "react";
import anime from "animejs";
import PrimaryButton from "@/shared/Button/PrimaryButton";
import IconDiscount from "../../components/IconDiscount";
import BagIcon from "@/components/BagIcon";

export interface SectionHero2Props {
  className?: string;
}

export default function SectionHero2() {
  return (
    <div
      className={`nc-SectionHero2Item nc-SectionHero2Item--animation flex flex-col-reverse lg:flex-col justify-center items-center relative overflow-hidden h-[100vh] max-h-[100vh] lg:h-[100vh] lg:max-h-[100vh]`}
    >
      {/* BG */}
      <div className="inset-0">
        <Image
          unoptimized
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="absolute object-cover hidden md:block"
          style={{
            objectPosition: "75% 35%",
          }}
          src={Adventure}
          alt="hero"
        />
      </div>
      <div className="absolute w-full h-full backdrop-brightness-50 bg-white/2"></div>
      <div className="container relative pb-0 pt-14 sm:pt-20 lg:py-56">
        <div
          className={`relative z-[1] w-full max-w-3xl space-y-8 nc-SectionHero2Item__left flex flex-col md:mt-[10rem] lg:mt-[2rem] mb-12 md:mb-0 justify-center items-center md:items-start`}
        >
          <div className="heroHeading space-y-5">
            <h1 className="nc-SectionHero2Item__heading font-bold text-4xl sm:text-3xl md:text-4xl xl:text-5xl 2xl:text-6xl !leading-[114%] text-[#f8e3fa]">
              Create unforgettable moments with Us.
            </h1>
            <p className="text-lg text-slate-300">
              Welcome to Eventive, your one-centralized system for professional
              Event planning, streamlining and Centralized Coordination!
            </p>
          </div>
            <PrimaryButton
              className="text-onPrimaryBtnColor"
              sizeClass="py-3 px-6 sm:py-5 sm:px-9 flex items-center gap-3"
              href={"/"}
            >
              <span className="font-bold text-xl">Get Started</span>
            </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
