import Button, { ButtonProps } from "@/shared/Button/Button";
import React from "react";

export interface ButtonTransparentProps extends ButtonProps { }

const ButtonTransparent: React.FC<ButtonTransparentProps> = ({
  className = " border border-slate-300 dark:border-slate-700 ",
  ...args
}) => {
  return (
    <Button
      className={`ttnc-ButtonTransparent bg-white text-slate-700 dark:bg-transparent dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 ${className}`}
      {...args}
    />
  );
};

export default ButtonTransparent;
