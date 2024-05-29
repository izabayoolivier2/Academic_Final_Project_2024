"use client";

import { getProductsFromDB } from "@/app/redux/features/product/productThunk";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import Heading from "@/components/Heading/Heading";
import { FC, useEffect, useRef, useState } from "react";
// @ts-ignore
import Glide from "@glidejs/glide/dist/glide.esm";
import ProductCard from "./ProductCard";


export interface SectionSliderProductCardProps {
  className?: string;
  itemClassName?: string;
  heading?: string;
  headingFontClassName?: string;
  headingClassName?: string;
  subHeading?: string;
}

const SectionSliderProductCard: FC<SectionSliderProductCardProps> = ({
  className = "",
  itemClassName = "",
  headingFontClassName,
  headingClassName,
  heading,
  subHeading = "",
}) => {
  const sliderRef = useRef(null);
  const [isShow, setIsShow] = useState(false);
  const products = useAppSelector((state) => state.product.products);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getProductsFromDB());
    
  }, [dispatch]);
  console.log(products)

  useEffect(() => {
    const OPTIONS: Partial<Glide.Options> = {
      perView: 4,
      gap: 32,
      bound: true,
      direction: 'ltr',
      breakpoints: {
        1280: {
          perView: 4 - 1,
        },
        1024: {
          gap: 20,
          perView: 4 - 1,
        },
        768: {
          gap: 20,
          perView: 4 - 2,
        },
        640: {
          gap: 20,
          perView: 1.5,
        },
        500: {
          gap: 20,
          perView: 1.3,
        },
      },
    };
    if (!sliderRef.current) return;
    let slider = new Glide(sliderRef.current, OPTIONS);
    slider.mount();
    setIsShow(true);
    return () => {
      slider.destroy();
    };
  }, [sliderRef, products]);

  if (!products || products.length < 0) {
    return
  }
  return (
    <div className={`nc-SectionSliderProductCard ${className}`}>
      <div ref={sliderRef} className={`flow-root ${isShow ? "" : ""}`}>
        <Heading
          className={headingClassName}
          fontClass={headingFontClassName}
          rightDescText={subHeading}
          hasNextPrev
        >
          {heading || `Sevices`}
        </Heading>

        <div className="glide__track" data-glide-el="track">
          <ul className="glide__slides">
            {products.length > 0 && products.map((item, index) => (
              <ul key={index} className="h-full glide__slides">
                <li key={index} className={`glide__slide  ${itemClassName}`}>
                  <ProductCard data={item} />
                </li>
              </ul>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SectionSliderProductCard;
