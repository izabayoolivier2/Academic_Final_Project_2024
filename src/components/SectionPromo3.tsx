import React, { FC } from "react";
import NcImage from "@/shared/NcImage/NcImage";
import rightImgDemo from "@/images/promo3.png";
import backgroundLineSvg from "@/images/BackgroundLine.svg";
import Badge from "@/shared/Badge/Badge";
import Input from "@/shared/Input/Input";
import ButtonCircle from "@/shared/Button/ButtonCircle";
import { ArrowSmallRightIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Logo from "@/shared/Logo/Logo";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";

export interface SectionPromo3Props {
  className?: string;
}

const SectionPromo3: FC<SectionPromo3Props> = ({ className = "lg:pt-10" }) => {
  return (
    <div className={`nc-SectionPromo3 ${className}`}>
      <div className="relative flex flex-col lg:flex-row bg-slate-50 dark:bg-slate-800 rounded-2xl sm:rounded-[40px] p-4 pb-0 sm:p-5 sm:pb-0 lg:p-14">
        <div className="absolute inset-0">
          <Image
            fill
            className="absolute w-full h-full object-contain object-bottom dark:opacity-5"
            src={backgroundLineSvg}
            alt="backgroundLineSvg"
          />
        </div>

        <div className="relative">
          <Logo className="w-28" />
          <h2 className="font-semibold text-3xl sm:text-4xl xl:text-5xl 2xl:text-6xl mt-6 sm:mt-10 !leading-[1.13] tracking-tight">
            Special offer <br />
            in Mens products
          </h2>
          <span className="block mt-5 text-neutral-500 dark:text-neutral-400">
            Register to receive news about the latest, savings combos, discount
            codes...
          </span>
          <div className="flex space-x-2 sm:space-x-5 mt-6 md:mb-0 mb-4 sm:mt-12">
            <ButtonPrimary
              href="#"
              className="dark:bg-slate-200 dark:text-slate-900"
            >
              Discover more
            </ButtonPrimary>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionPromo3;
