import {
  NoSymbolIcon,
  ClockIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { Product } from "@/data/data";
import React, { FC } from "react";
import IconDiscount from "./IconDiscount";

interface Props {
  status: Product["status"];
  className?: string;
}

const ProductStatus: FC<Props> = ({
  status,
  className = "absolute top-3 start-3 px-2.5 py-1.5 text-xs bg-white dark:bg-neutral-800 text-slate-700 dark:text-slate-300",
}) => {
  const renderStatus = () => {
    if (!status) {
      return null;
    }
    const CLASSES = `nc-shadow-lg rounded-full flex items-center justify-center ${className}`;
    if (status === "جديد") {
      return (
        <div className={CLASSES} style={{ width: "max-content" }}>
          <SparklesIcon className="w-3.5 h-3.5" />
          <span className="ms-1 leading-none">{status}</span>
        </div>
      );
    }
    if (status === "50%") {
      return (
        <div className={`${CLASSES} dark:bg-red`} style={{ width: "max-content" }}>
          <IconDiscount className="w-3.5 h-3.5" />
          <span className="ms-1 leading-none">{status}-</span>
        </div>
      );
    }
    if (status === "نفذت الكمية") {
      return (
        <div className={CLASSES} style={{ width: "max-content" }}>
          <NoSymbolIcon className="w-3.5 h-3.5" />
          <span className="ms-1 leading-none">{status}</span>
        </div>
      );
    }
    if (status === "عرض محدود") {
      return (
        <div className={CLASSES} style={{ width: "max-content" }}>
          <ClockIcon className="w-3.5 h-3.5" />
          <span className="ms-1 leading-none">{status}</span>
        </div>
      );
    }
    return null;
  };

  return renderStatus();
};

export default ProductStatus;
