import Button, { ButtonProps } from "@/shared/Button/Button";
import React from "react";

export interface ButtonPrimaryProps extends ButtonProps { }

const PrimaryButton: React.FC<ButtonPrimaryProps> = ({
  className = "",
  ...args
}) => {
  return (
    <Button
      className={`ttnc-ButtonPrimary dark:text-white disabled:bg-opacity-90 bg-slate-900 dark:bg-ringColor hover:bg-neutral-800 text-slate-50 shadow-xl ${className}`}
      {...args}
    />
  );
};

export default PrimaryButton;
