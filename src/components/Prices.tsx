import { FC } from "react";
import { Reveal } from "./Reveal";

export interface PricesProps {
  className?: string;
  price?: number;
  discount?: number;
  contentClass?: string;
}

const Prices: FC<PricesProps> = ({
  className = "",
  price = 33,
  contentClass = "py-1 px-2 md:py-0 md:px-2.5 text-lg font-medium",
  discount = 0
}) => {
  return (
    <div className={`${className}`}>
      <div
        className={`flex items-center border-2 border-none rounded-lg ${contentClass}`}
      >

        {
          discount > 0 ?
            <div className="flex">

              <div className="ml-3">
                <span className="font-semibold"> {String(price * 50 / 100)}</span>
                <span className="text-sm ">ر.س</span>
              </div>

              <div className="line-through flex justify-center items-center text-typoSecondaryColor">
                <span className="font-semibold">{String(price)} </span>
                <span className="text-sm ">ر.س</span>
              </div>
            </div>
            :
            <div>
              <span className="font-semibold">{String(price)} </span>
              <span className="text-sm">ر.س</span>
            </div>
        }
      </div>
    </div >
  );
};

export default Prices;
