import Button, { ButtonProps } from "@/shared/Button/Button";
import React from "react";

export interface PrimaryButtonProps extends ButtonProps { }

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
    className,
    ...args
}) => {
    return (
        <Button
            className={`ttnc-PrimaryButton bg-primaryBtnColor shadow-md rounded-md 

             ${className}`}
            {...args}
        />
    );
};

export default PrimaryButton;
