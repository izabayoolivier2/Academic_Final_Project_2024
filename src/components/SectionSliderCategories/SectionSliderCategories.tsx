"use client";

import { getCategoriesFromDB } from '@/app/redux/features/categoryThunk';
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';
import CardCategory2 from "@/components/CardCategories/CardCategory2";
import Heading from "@/components/Heading/Heading";
import cart1jpg from "@/images/collections/cat1.jpg";
import cart2jpg from "@/images/collections/cat2.jpg";
import cart3jpg from "@/images/collections/cat3.jpg";
import cart4jpg from "@/images/collections/cat4.jpg";
import cart5jpg from "@/images/collections/cat5.jpg";
import { FC, useEffect, useRef, useState } from "react";
// @ts-ignore
import Glide from "@glidejs/glide/dist/glide.esm";
import { StaticImageData } from "next/image";
import { Reveal } from "../Reveal";

export interface CardCategoryData {
  name: string;
  desc: string;
  img: string | StaticImageData;
  color?: string;
}
const CATS: any = [
  {
    name: "Wedding",
    desc: "Plan your wedding with us",
    img: cart1jpg,
    color: "bg-indigo-100",
  },
  {
    name: "Graduation",
    desc: "",
    img: cart2jpg,
    color: "bg-indigo-100",
  },
  {
    name: "Birthday",
    desc: "",
    img: cart3jpg,
    color: "bg-slate-100",
  },
  {
    name: "Funeral",
    desc: "",
    img: cart4jpg,
    color: "bg-sky-100",
  },
  {
    name: "Concert",
    desc: "",
    img: cart5jpg,
    color: "bg-orange-100",
  },
  ,
  {
    name: "Others",
    desc: "",
    img: cart3jpg,
    color: "bg-slate-100",
  }
];
export interface SectionSliderCategoriesProps {
  className?: string;
  itemClassName?: string;
  heading?: string;
  subHeading?: string;
  data?: CardCategoryData[];
}

const SectionSliderCategories: FC<SectionSliderCategoriesProps> = ({
  heading = "Categories",
  subHeading = "",
  className = "",
  itemClassName = "",
  data = CATS,
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
            {data.map((item: any, index: any) => (
              <li key={index} className={`glide__slide ${itemClassName}`}>
                <CardCategory2
                  featuredImage={item.image}
                  name={item.name}
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
