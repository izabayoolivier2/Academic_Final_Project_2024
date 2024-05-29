"use client";

import { Transition } from "@/app/headlessui";
import { Product } from "@/app/models/Product";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import ButtonSecondary from "@/shared/Button/ButtonSecondary";
import NcImage from "@/shared/NcImage/NcImage";
import { ArrowsPointingOutIcon } from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";
import toast from "react-hot-toast";
import BagIcon from "./BagIcon";
import LikeButton from "./LikeButton";
import ModalQuickView from "./ModalQuickView";
import Prices from "./Prices";
import ProductStatus from "./ProductStatus";
import NotifyAddTocart from "@/components/NotifyAddTocart";
import PrimaryButton from "@/shared/Button/PrimaryButton";
import { Reveal } from "./Reveal";
import { UrlObject } from "url";
import { auth } from "@/app/firebase/config";
import { getUserByUserId, subscribeToUserProfile } from "@/app/redux/features/auth/authThunk";
import { useAppDispatch } from "@/app/redux/hooks";
import { onAuthStateChanged } from "@firebase/auth";
import { addToCartFirestore } from "@/app/redux/features/cart/cartThunk";
import iconPoints from "@/images/svgs/icon-points.svg";
import { XMarkIcon } from "@heroicons/react/24/outline";

export interface ProductCardProps {
  className?: string;
  data: Product;
}

const ProductCard: FC<ProductCardProps> = ({
  className = "",
  data
}) => {

  const [variantActive, setVariantActive] = useState(0);
  const [showModalQuickView, setShowModalQuickView] = useState(false);
  const [owner, setOwner] = useState<string>("");
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        await dispatch(subscribeToUserProfile(user.uid));
        await dispatch(getUserByUserId(user.uid));
        setOwner(user.uid)
      }
    });
  }, [dispatch])

  const handleAddToCart = async () => {
    const quantity = 1
    if (owner && data) {
      const cartItem: any = {
        owner: owner,
        updatedDate: new Date().toISOString(),

        products: [
          {
            productId: data.id,
            main_image_url: data.main_image_url,
            quantity: 1,
            name: data.name,
            points: data.points,
            price: data.price
          }
        ]
      }
      await dispatch(addToCartFirestore(cartItem));
      // router.push(`/cart`)
    } else {
      if (data) {
        const cartItem: any = {
          owner: owner,
          updatedDate: new Date().toISOString(),
          products: [
            {
              productId: data.id,
              main_image_url: data.main_image_url,
              quantity: 1,
              name: data.name,
              points: data.points,
              price: data.price
            }
          ]
        }
        await dispatch(addToCartFirestore(cartItem));
        // router.push(`/cart`);
      }
    }
  };

  const notifyAddTocart = async () => {
    await handleAddToCart();
    toast.custom(
      (t) => (
        <div style={{
          opacity: t.visible ? 1 : 0,
          transition: "opacity 100ms ease-in-out"
        }}>
          <div className="relative">
            <NotifyAddTocart
              productImage={data.main_image_url}
              qualitySelected={1}
              show={t.visible}
              sizeSelected={''}
              variantActive={variantActive}
              productId={data.id}
              name={data.name}
              price={data.price}
              main_image_url={data.main_image_url}
              owner={owner}
              points={data.points}
              variants={data.variants}
            />
          </div>
        </div>

      ),
      {
        position: "top-right",
        id: "nc-product-notify",
        duration: 3000,
      }
    );
  };

  const renderProductCartOnNotify = ({ size }: { size?: string }) => {
    return (
      <div className="flex">
        <div className="flex-shrink-0 w-full h-24 overflow-hidden  flex">
          <Image
            width={80}
            height={96}
            src={data.main_image_url}
            alt={data.name}
            className="w-[20%] object-cover object-center rounded-xl"
          />
          <div className="flex w-[78%] flex-col ms-4">
            <div>
              <div className="flex justify-between ">
                <div>
                  <h3 className="text-base font-medium ">{data.name}</h3>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    <span>
                      {data.variants ? data.variants[variantActive].name : `Natural`}
                    </span>
                    <span className="h-4 mx-2 border-s border-slate-200 dark:border-typoSecondaryColor"></span>
                    <span>{size || "XL"}</span>
                  </p>
                </div>
                <Prices price={data.price} className="mt-0.5" />
              </div>
            </div>
            <div className="flex items-end justify-between flex-1 text-sm">
              <p className="text-gray-500 dark:text-typoPrimaryColor">Qty 1</p>
              <div className="flex">
                <button
                  type="button"
                  className="font-medium text-primary-6000 dark:text-red"
                  onClick={(e) => {
                    e.preventDefault();
                    router.push("/cart");
                  }}
                >
                  View cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const getBorderClass = (Bgclass = "") => {
    if (Bgclass.includes("red")) {
      return "border-red-500";
    }
    if (Bgclass.includes("violet")) {
      return "border-violet-500";
    }
    if (Bgclass.includes("orange")) {
      return "border-orange-500";
    }
    if (Bgclass.includes("green")) {
      return "border-green-500";
    }
    if (Bgclass.includes("blue")) {
      return "border-blue-500";
    }
    if (Bgclass.includes("sky")) {
      return "border-sky-500";
    }
    if (Bgclass.includes("yellow")) {
      return "border-yellow-500";
    }
    return "border-transparent";
  };

  const renderVariants = () => {
    if (!data?.variants || !data?.variants.length || !data?.variantType) {
      return null;
    }

    if (data.variantType === "color") {
      return (
        <div className="flex space-x-1">
          {data.variants.map((variant, index) => (
            <div
              key={index}
              onClick={() => setVariantActive(index)}
              className={`relative w-6 h-6 rounded-full overflow-hidden z-10 border cursor-pointer ${variantActive === index
                ? getBorderClass(variant.color)
                : "border-transparent"
                }`}
              title={variant.name}
            >
              <div
                className={`absolute inset-0.5 rounded-full z-0 ${variant.color}`}
              ></div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="flex ">
        {data.variants.map((variant: any, index) => (
          <div
            key={index}
            onClick={() => setVariantActive(index)}
            className={`relative w-11 h-6 rounded-full overflow-hidden z-10 border cursor-pointer ${variantActive === index
              ? "border-black dark:border-slate-300"
              : "border-transparent"
              }`}
            title={variant.name}
          >
            <div
              className="absolute inset-0.5 rounded-full overflow-hidden z-0 bg-cover"
              style={{
                backgroundImage: `url(${
                  // @ts-ignore
                  typeof variant.thumbnail === "string"
                    ? // @ts-ignore
                    variant.thumbnail
                    : typeof variant.thumbnail === "string"
                      ? variant.thumbnail
                      : ""
                  })`,
              }}
            ></div>
          </div>
        ))}
      </div>
    );
  };

  const renderGroupButtons = () => {
    return (
      <div className="absolute bottom-0 flex justify-center invisible transition-all z-30 opacity-0 group-hover:bottom-4 inset-x-1 group-hover:opacity-100 group-hover:visible">
        <ButtonPrimary
          className="shadow-lg dark:hover:bg-typoSecondaryColor"
          fontSize="text-xs"
          sizeClass="py-2 px-4"
          onClick={() => notifyAddTocart()}
        >
          <BagIcon className="w-3.5 h-3.5 mb-0.5" />
          <span className="ms-1">Add to bag</span>
        </ButtonPrimary>
        <ButtonPrimary
          className="ms-1.5 dark:hover:bg-typoSecondaryColor cursor-pointer transition-colors shadow-lg"
          fontSize="text-xs"
          sizeClass="py-2 px-4"
          onClick={() => setShowModalQuickView(true)}
        >
          <ArrowsPointingOutIcon className="w-3.5 h-3.5" />
          <span className="ms-1 cursor-pointer">Quick view</span>
        </ButtonPrimary>
      </div>
    );
  };

  const renderSizeList = () => {
    if (!data.sizes || !data.sizes.length) {
      return null;
    }

    return (
      <div className="absolute bottom-0 inset-x-1 space-x-1.5 rtl:space-x-reverse flex justify-center opacity-0 invisible group-hover:bottom-4 group-hover:opacity-100 group-hover:visible transition-all">
        {data.sizes.map((size, index) => {
          return (
            <div
              key={index}
              className="flex font-sans items-center justify-center w-10 h-10 text-sm font-semibold tracking-tight uppercase transition-colors bg-white cursor-pointer nc-shadow-lg rounded-xl hover:bg-slate-900 hover:text-white text-slate-900"
              onClick={() => notifyAddTocart()}
            >
              {size}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <div
        className={`nc-ProductCard relative flex flex-col  ${className}`}
      >
        <Link href={`/product-detail/${data.id}` as unknown as UrlObject} className="absolute inset-0"></Link>
        <div className="relative flex-shrink-0 overflow-hidden bg-slate-50 dark:bg-slate-300 rounded-lg z-1 group">
          <Link href={`/product-detail/${data.id}` as unknown as UrlObject} className="block">
            {
              data.status === "نفذت الكمية" && <div className="absolute z-10 inset-0 backdrop-brightness-50 bg-[#02020FFA]/50 h-full w-full "></div>
            }

            <NcImage
              containerClassName="relative flex aspect-w-11 aspect-h-14 w-full h-0"
              src={data.main_image_url}
              className="object-cover w-full h-full drop-shadow-xl"
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 40vw"
              alt="product"
            />
          </Link>
          <div className="absolute z-10 top-[1px]">
            <ProductStatus status={data.status} />
          </div>
          <LikeButton liked={data.likes?.includes(owner)} productId= {data.id} className="absolute z-30 top-3 end-3" />
          {data?.sizes?.length > 0 ? renderSizeList() : renderGroupButtons()}
        </div>
        <div className="space-y-4 px-2.5 pt-5 pb-2.5">
          {renderVariants()}
          <div>
            <h2 className="text-base transition-colors nc-ProductCard__title">
              {data.name}
            </h2>
          </div>
          <div className="flex items-end justify-between ">
            {
              data.status === "50%" ? <Prices price={data.price} discount={50} /> : <Prices price={data.price} discount={0} />
            }
            <div className="flex items-center mb-0.5">
              <StarIcon className="w-5 h-5 pb-[1px] text-amber-400" />
              <span className="text-sm ms-1 text-slate-500 dark:text-typoSecondaryColor">
                {data.ratings || ""}
              </span>
              <Image
                width={12}
                height={12}
                src={iconPoints}
                alt="menu"
                className="w-4 h-4 md:w-5 md:h-5 mr-2"
              />
              <span className="text-sm ms-1 text-slate-500 dark:text-typoSecondaryColor">
                ({""})
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* QUICKVIEW */}
      <ModalQuickView
        data={data}
        show={showModalQuickView}
        onCloseModalQuickView={() => setShowModalQuickView(false)}
      />
    </>
  );
};

export default ProductCard;
