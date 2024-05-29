"use client";

import React, { FC } from "react";

type PageContainerProps = {
  children: React.ReactNode;
};
export const Card: React.FC<PageContainerProps> = ({ children, ...customMeta }) => {

  return (
    <div className="dark:bg-primary-cardPrimary p-7 rounded-md mt-6 md:mt-0 border border-slate-200 dark:border-none">
      {children}
    </div>
  );
}

export default Card;