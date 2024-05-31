"use client";

import { getCategoriesFromDB } from '@/app/redux/features/categoryThunk';
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';
import CardCategory2 from "@/components/CardCategories/CardCategory2";
import Heading from "@/components/Heading/Heading";
import { FC, useEffect, useRef, useState } from "react";
// @ts-ignore
import Glide from "@glidejs/glide/dist/glide.esm";
import { Reveal } from "../Reveal";

export interface SectionSliderCategoriesProps {
  className?: string;
  itemClassName?: string;
  heading?: string;
  subHeading?: string;
}

const SectionSliderCategories: FC<SectionSliderCategoriesProps> = ({
  heading = "Categories",
  subHeading = "",
  className = "",
  itemClassName = "",
}) => {
  const sliderRef = useRef(null);
  const [isShow, setIsShow] = useState(false);
  const categories = useAppSelector((state) => state.category.categories);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getCategoriesFromDB());
  }, [dispatch]);

  useEffect(() => {
    const OPTIONS: Partial<Glide.Options> = {
      perView: 4,
      gap: 22,
      direction: 'rtl',
      bound: true,
      breakpoints: {
        1280: {
          perView: 4,
        },
        1024: {
          gap: 20,
          perView: 3.4,
        },
        768: {
          gap: 20,
          perView: 3,
        },
        640: {
          gap: 20,
          perView: 2.3,
        },
        500: {
          gap: 20,
          perView: 1.4,
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
  }, [sliderRef, categories]);

  if (!categories || categories.length < 0) {
    return
  }
  return (
    <div className={`nc-SectionSliderCategories ${className}`}>
      <div ref={sliderRef} className={`flow-root ${isShow ? "" : "invisible"}`}>
        <Heading desc={subHeading} hasNextPrev>
          <Reveal>
            <>
              {heading}
            </>
          </Reveal>
        </Heading>
        <div className="glide__track" data-glide-el="track">
          <ul className="glide__slides">
            {categories.map((item: any, index: any) => (
              <li key={index} className={`glide__slide ${itemClassName}`}>
                <CardCategory2
                  featuredImage={item.image}
                  name={item.names}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SectionSliderCategories;
