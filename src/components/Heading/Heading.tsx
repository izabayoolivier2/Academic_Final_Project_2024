import React, { HTMLAttributes, ReactNode } from "react";
import NextPrev from "@/shared/NextPrev/NextPrev";
import { Reveal } from "../Reveal";

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  fontClass?: string;
  rightDescText?: ReactNode;
  rightPopoverOptions?: typeof solutions;
  desc?: ReactNode;
  hasNextPrev?: boolean;
  isCenter?: boolean;
}

const solutions = [
  {
    name: "last 24 hours",
    href: "##",
  },
  {
    name: "last 7 days",
    href: "##",
  },
  {
    name: "last 30 days",
    href: "##",
  },
];

const Heading: React.FC<HeadingProps> = ({
  children,
  desc = "",
  className = "mb-12 lg:mb-14 text-neutral-900 dark:text-typoPrimaryColor",
  isCenter = false,
  hasNextPrev = false,
  fontClass = "text-xl md:text-3xl font-semibold",
  rightDescText,
  rightPopoverOptions = solutions,
  ...args
}) => {
  return (
    <div
      className={` relative flex items-center justify-between ${className}`}
    >
      {isCenter ? (
        <div
          className={
            isCenter
              ? "flex flex-col items-center text-center w-full mx-auto"
              : ""
          }
        >
          <h2
            className={`${isCenter ? "justify-center" : ""} ${fontClass}`}
            {...args}
          >
            {children || `Section Heading`}
            {rightDescText && (
              <>
                <span className="">{`. `}</span>
                <span className="text-neutral-500 dark:text-neutral-400">
                  {rightDescText}
                </span>
              </>
            )}
          </h2>
          {!!desc && (
            <span className="mt-2 md:mt-3 font-normal block text-[1.1rem] text-neutral-500 dark:text-neutral-400">
              {desc}
            </span>
          )}
        </div>
      ) : (
        <Reveal>
          <div
            className={
              isCenter
                ? "flex flex-col items-center text-center w-full mx-auto"
                : ""
            }
          >
            <h2
              className={`${isCenter ? "justify-center" : ""} ${fontClass}`}
              {...args}
            >
              {children || `Section Heading`}
              {rightDescText && (
                <>
                  <span className="">{`. `}</span>
                  <span className="text-neutral-500 dark:text-typoSecondaryColor">
                    {rightDescText}
                  </span>
                </>
              )}
            </h2>
            {!!desc && (
              <span className="mt-2 md:mt-3 font-normal block text-base sm:text-xl text-neutral-500 dark:text-neutral-400">
                {desc}
              </span>
            )}
          </div>
        </Reveal>
      )}
      {hasNextPrev && !isCenter && (
        <div className="flex justify-end sm:ms-2 sm:mt-0 flex-shrink-0">
          <NextPrev onClickNext={() => { }} onClickPrev={() => { }} />
        </div>
      )}
    </div>
  );
};

export default Heading;
