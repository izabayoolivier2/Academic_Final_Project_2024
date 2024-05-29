"use client";
import React, { FC, useState } from "react";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import LikeButton from "@/components/LikeButton";
import { StarIcon } from "@heroicons/react/24/solid";
import BagIcon from "@/components/BagIcon";
import NcInputNumber from "@/components/NcInputNumber";
import PrimaryButton from "@/shared/Button/PrimaryButton";
import { PRODUCTS } from "@/data/data";
import {
  NoSymbolIcon,
  ClockIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import IconDiscount from "@/components/IconDiscount";
import Prices from "@/components/Prices";
import toast from "react-hot-toast";
import NotifyAddTocart from "./NotifyAddTocart";
import AccordionInfo from "@/components/AccordionInfo";
import Image from "next/image";
import Link from "next/link";
import { addToCartFirestore } from "@/app/redux/features/cart/cartThunk";
import { useAppDispatch } from "@/app/redux/hooks";

export interface ProductQuickViewProps {
  className?: string;
  data: any;
}

const ProductQuickView: any = (
  { className = "", data }: { className: any, data: any }) => {
  const {
    sizes, variants, status,
    allOfSizes, main_image_url,
    product_id, name, ratings, price,
    owner, points, images, description } = data;

  const [variantActive, setVariantActive] = useState(0);
  const [qualitySelected, setQualitySelected] = useState(1);
  const [sizeSelected, setSizeSelected] = useState(sizes ? sizes[0] : "");

  const dispatch = useAppDispatch();

  const handleAddToCart = async () => {
    const quantity = 1
    if (owner) {
      const cartItem: any = {
        owner: owner,
        updatedDate: new Date().toISOString(),
        products: [
          {
            productId: product_id,
            main_image_url: main_image_url,
            quantity: quantity,
            name: name,
            points: points,
            price: price
          }
        ]
      }
      await dispatch(addToCartFirestore(cartItem));
      // router.push(`/cart`)
    } else {
      const cartItem: any = {
        owner: owner,
        updatedDate: new Date().toISOString(),
        products: [
          {
            productId: product_id,
            main_image_url: main_image_url,
            quantity: 1,
            name: name,
            points: points,
            price: price
          }
        ]
      }
      await dispatch(addToCartFirestore(cartItem));
      // router.push(`/cart`);
    }
  };

  const notifyAddTocart = async () => {
    await handleAddToCart();
    toast.custom(
      (t) => (
        <NotifyAddTocart
          productImage={main_image_url}
          qualitySelected={qualitySelected}
          show={t.visible}
          sizeSelected={sizeSelected}
          variantActive={variantActive}
          productId={product_id}
          name={name}
          price={price}
          main_image_url={main_image_url}
          owner={owner}
          points={points}
          variants={variants}
        />
      ),
      { position: "top-left", id: "nc-product-notify", duration: 3000 }
    );
  };

  const renderVariants = () => {
    if (!variants || !variants.length) {
      return null;
    }

    return (
      <div>
        <label className="rtl:text-right block" htmlFor="">
          <span className="text-sm font-medium">
            Color:
            <span className="ms-1 font-semibold">
              {variants[variantActive].name}
            </span>
          </span>
        </label>
        <div className="flex mt-2.5">
          {variants.map((variant: any, index: number) => (
            <div
              key={index}
              onClick={() => setVariantActive(index)}
              className={`relative flex-1 max-w-[75px] h-10 rounded-full border-2 cursor-pointer ${variantActive === index
                ? "border-primary-6000 dark:border-primary-500"
                : "border-transparent"
                }`}
            >
              <div
                className="absolute inset-0.5 rounded-full overflow-hidden z-0 bg-cover"
                style={{
                  backgroundImage: `url(${
                    // @ts-ignore
                    typeof variant.thumbnail?.src === "string"
                      ? // @ts-ignore
                      variant.thumbnail?.src
                      : typeof variant.thumbnail === "string"
                        ? variant.thumbnail
                        : ""
                    })`,
                }}
              ></div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSizeList = () => {
    if (!allOfSizes || !sizes || !sizes.length) {
      return null;
    }
    return (
      <div>
        <div className="flex justify-between font-medium text-sm">
          <label htmlFor="">
            <span className="">
              Size:
              <span className="ms-1 font-semibold">{sizeSelected}</span>
            </span>
          </label>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="##"
            className="text-primary-6000 hover:text-primary-500"
          >
            See sizing chart
          </a>
        </div>
        <div className="grid grid-cols-5 sm:grid-cols-7 gap-2 mt-2.5">
          {allOfSizes.map((size: string, index: number) => {
            const isActive = size === sizeSelected;
            const sizeOutStock = !sizes.includes(size);
            return (
              <div
                key={index}
                className={`relative h-10 sm:h-11 rounded-lg border-2 flex items-center justify-center 
                text-sm sm:text-base uppercase font-semibold select-none overflow-hidden z-0 ${sizeOutStock
                    ? "text-opacity-20 dark:text-opacity-20 cursor-not-allowed line-through"
                    : "cursor-pointer"
                  } ${isActive
                    ? "bg-black border-primary-6000 text-white hover:bg-black"
                    : "border-slate-300 dark:border-buttonColor text-slate-900 dark:text-slate-200 hover:bg-neutral-50 dark:hover:bg-typoSecondaryColor"
                  }`}
                onClick={() => {
                  if (sizeOutStock) {
                    return;
                  }
                  setSizeSelected(size);
                }}
              >
                {size}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderStatus = () => {
    if (!status) {
      return null;
    }
    const CLASSES =
      "absolute top-3 start-3 px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 nc-shadow-lg rounded-full flex items-center justify-center text-slate-700 text-slate-900 dark:text-slate-300";
    if (status === "جديد") {
      return (
        <div className={CLASSES}>
          <SparklesIcon className="w-3.5 h-3.5" />
          <span className="ms-1 leading-none">{status}</span>
        </div>
      );
    }
    if (status === "50%") {
      return (
        <div className={CLASSES}>
          <IconDiscount className="w-3.5 h-3.5" />
          <span className="ms-1 leading-none">{status}</span>
        </div>
      );
    }
    if (status === "نفذت الكمية") {
      return (
        <div className={CLASSES}>
          <NoSymbolIcon className="w-3.5 h-3.5" />
          <span className="ms-1 leading-none">{status}</span>
        </div>
      );
    }
    if (status === "عرض محدود") {
      return (
        <div className={CLASSES}>
          <ClockIcon className="w-3.5 h-3.5" />
          <span className="ms-1 leading-none">{status}</span>
        </div>
      );
    }
    return null;
  };

  const renderSectionContent = () => {
    return (
      <div className="space-y-8">
        {/* ---------- 1 HEADING ----------  */}
        <div>
          <h2 className="text-start text-2xl font-semibold transition-colors">
            <Link href="#">{name}</Link>
          </h2>

          <div className="flex justify-start rtl:justify-start items-center mt-5 space-x-4 sm:space-x-5 rtl:space-x-reverse">
            {/* <div className="flex text-xl font-semibold">$112.00</div> */}
            <Prices
              contentClass="py-1 px-2 md:py-1.5 md:px-3 text-lg font-semibold"
              price={price}
            />

            <div className="h-6 border-s border-slate-300 dark:border-slate-700"></div>

            <div className="flex items-center">
              <Link
                href="#"
                className="flex items-center text-sm font-medium"
              >
                <StarIcon className="w-5 h-5 pb-[1px] text-yellow-400" />
                <div className="ms-1.5 flex">
                  <span>{ratings}</span>
                  <span className="block mx-2">·</span>
                  <span className="text-slate-600 dark:text-darkGray4 underline">
                    142 reviews
                  </span>
                </div>
              </Link>
              <span className="hidden sm:block mx-2.5">·</span>
              <div className="hidden sm:flex items-center text-sm">
                <SparklesIcon className="w-3.5 h-3.5" />
                <span className="ms-1 leading-none">{status}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ---------- 3 VARIANTS AND SIZE LIST ----------  */}
        <div className="">{renderVariants()}</div>
        <div className="">{renderSizeList()}</div>

        {/*  ---------- 4  QTY AND ADD TO CART BUTTON */}
        <div className="flex space-x-3.5 rtl:space-x-reverse">
          <div className="flex items-center justify-center bg-[rgb(49, 49, 52,)] dark:bg-buttonColor px-2 py-3 sm:p-3.5 rounded-full">
            <NcInputNumber
              defaultValue={qualitySelected}
              onChange={setQualitySelected}
            />
          </div>
          <PrimaryButton
            className="flex-1 dark:bg-red dark:hover:bg-red/60 flex-shrink-0 mr-2"
            onClick={notifyAddTocart}
          >
            <BagIcon className="inline-block w-5 h-5 mb-0.5 dark:text-typoPrimaryColor" />
            <span className="mr-3 dark:text-typoPrimaryColor">Add to cart</span>
          </PrimaryButton>
        </div>

        {/*  */}
        <hr className=" border-slate-200 dark:border-slate-700"></hr>
        {/*  */}

        {/* ---------- 5 ----------  */}
        <AccordionInfo
          data={[
            {
              name: "Description",
              content:
                `${description}`,
            },
            {
              name: "Features",
              content: `<ul class="list-disc list-inside leading-7">
            <li>Material: 43% Sorona Yarn + 57% Stretch Polyester</li>
            <li>
             Casual pants waist with elastic elastic inside
            </li>
            <li>
              The pants are a bit tight so you always feel comfortable
            </li>
            <li>
              Excool technology application 4-way stretch
            </li>
          </ul>`,
            },
          ]}
        />
      </div>
    );
  };

  return (
    <div className={`nc-ProductQuickView ${className}`}>
      {/* MAIn */}
      <div className="lg:flex">
        {/* CONTENT */}
        <div className="w-full lg:w-[50%] ">
          {/* HEADING */}
          <div className="relative">
            <div className="aspect-w-16 aspect-h-16">
              <Image
                src={main_image_url}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="w-full rounded-xl object-cover"
                alt="product"
              />
            </div>

            {/* STATUS */}
            {renderStatus()}
            {/* META FAVORITES */}
            <LikeButton className="absolute end-3 top-3 " liked={false} productId={""} />
          </div>
          <div className="hidden lg:grid grid-cols-2 gap-3 mt-3 sm:gap-6 sm:mt-6 xl:gap-5 xl:mt-5">
            {images.map((image: string, index: number) => {
              return (
                <div key={index} className="aspect-w-3 aspect-h-4">
                  <Image
                    fill
                    src={image}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="w-full rounded-xl object-cover"
                    alt="product"
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="w-full lg:w-[50%] pt-6 lg:pt-0 lg:ps-7 xl:ps-8">
          {renderSectionContent()}
        </div>
      </div>
    </div>
  );
};

export default ProductQuickView;
