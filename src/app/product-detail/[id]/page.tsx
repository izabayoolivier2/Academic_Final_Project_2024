"use client";

import React, { useState, useRef, useEffect } from "react";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import LikeButton from "@/components/LikeButton";
import { StarIcon } from "@heroicons/react/24/solid";
import BagIcon from "@/components/BagIcon";
import NcInputNumber from "@/components/NcInputNumber";
import {
  NoSymbolIcon,
  ClockIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import IconDiscount from "@/components/IconDiscount";
import Prices from "@/components/Prices";
import toast from "react-hot-toast";
import Policy from "./Policy";
import ReviewItem from "@/components/ReviewItem";
import PrimaryButton from "@/shared/Button/PrimaryButton";
import SectionPromo1 from "@/components/SectionPromo1";
import ModalViewAllReviews from "./ModalViewAllReviews";
import NotifyAddTocart from "@/components/NotifyAddTocart";
import Image from "next/image";
import AccordionInfo from "@/components/AccordionInfo";
import { getNewParam } from "../../../components/listing-image-gallery/ListingImageGallery";
import { Route } from "next";
import { usePathname, useRouter, useParams, useSearchParams } from "next/navigation";
import ListingImageGallery from "@/components/listing-image-gallery/ListingImageGallery";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase/config";
import { getUserByUserId, subscribeToUserProfile } from "../../redux/features/auth/authThunk";
import { addToCartFirestore } from "../../redux/features/cart/cartThunk";
import { getProductsFromDB } from "../../redux/features/product/productThunk";

const ProductDetailPage = () => {
  //
  const [variantActive, setVariantActive] = useState(0);
  const [qualitySelected, setQualitySelected] = useState(1);
  const [owner, setOwner] = useState<string>("");
  let overlayRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const modal = searchParams?.get("modal");
  const photoId = searchParams?.get("photoId");
  const [direction, setDirection] = useState(0);
  const thisPathname = usePathname();
  let index = Number(photoId);
  const products = useAppSelector((state) => state.product.products);
  const [curIndex, setCurIndex] = useState(index);
  const dispatch = useAppDispatch();
  const { id } = useParams();

  // Access product data from Redux store
  const selectedProduct = useAppSelector((state) => {
    return state.product.products.find((p) => p?.id === id);
  });
  const [sizeSelected, setSizeSelected] = useState(selectedProduct?.sizes ? selectedProduct.sizes[0] : "");

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        await dispatch(subscribeToUserProfile(user.uid));
        await dispatch(getUserByUserId(user.uid));
        setOwner(user.uid)
      }
    });
  }, [dispatch])

  useEffect(() => {
    dispatch(getProductsFromDB());
  }, [dispatch]);

  useEffect(() => {
    getProductdetails()
  });

  const getProductdetails = () => {
    if (!products || products.length < 0) {
      return
    }
  }


  function changePhotoId(newVal: number) {
    if (newVal > index) {
      setDirection(1);
    } else {
      setDirection(-1);
    }
    setCurIndex(newVal);
    router.push(`${thisPathname}/?${getNewParam({ value: newVal })}` as Route);
  }

  const handleOpenModalImageGallery = () => {
    router.push(`${thisPathname}/?modal=PHOTO_TOUR_SCROLLABLE` as Route);
  };
  const handleCloseModalImageGallery = () => {
    let params = new URLSearchParams(document.location.search);
    params.delete("modal");
    router.push(`${thisPathname}/?${params.toString()}` as Route);
  };
  const [isOpenModalViewAllReviews, setIsOpenModalViewAllReviews] =
    useState(false);

  const handleAddToCart = async () => {
    const quantity = 1
    if (owner && selectedProduct) {
      const cartItem: any = {
        owner: owner,
        updatedDate: new Date().toISOString(),

        products: [
          {
            productId: selectedProduct.id,
            main_image_url: selectedProduct.main_image_url,
            quantity: qualitySelected,
            name: selectedProduct.name,
            points: selectedProduct.points,
            price: selectedProduct.price
          }
        ]
      }
      await dispatch(addToCartFirestore(cartItem));
      // router.push(`/cart`)
    } else {
      if (selectedProduct) {
        const cartItem: any = {
          owner: owner,
          updatedDate: new Date().toISOString(),
          products: [
            {
              productId: selectedProduct.id,
              main_image_url: selectedProduct.main_image_url,
              quantity: qualitySelected,
              name: selectedProduct.name,
              points: selectedProduct.points,
              price: selectedProduct.price
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
        selectedProduct ?
          <NotifyAddTocart
            productImage={selectedProduct.main_image_url}
            qualitySelected={qualitySelected}
            show={t.visible}
            sizeSelected={sizeSelected}
            variantActive={variantActive}
            productId={selectedProduct.id}
            name={selectedProduct.name}
            price={selectedProduct.price}
            main_image_url={selectedProduct.main_image_url}
            owner={owner}
            points={selectedProduct.points}
            variants={selectedProduct.variants}
          /> : null
      ),
      { position: "top-right", id: "nc-product-notify" }
    );
  };

  const renderVariants = () => {
    if (!selectedProduct?.variants || !selectedProduct?.variants.length) {
      return null;
    }

    return (
      <div>
        <label htmlFor="">
          <span className="text-sm font-medium dark:text-typoPrimaryColor">
            Color:
            <span className="ml-1 font-semibold">
              {selectedProduct.variants[variantActive].name}
            </span>
          </span>
        </label>
        <div className="flex mt-3">
          {selectedProduct.variants.map((variant, index) => (
            <div
              key={index}
              onClick={() => setVariantActive(index)}
              className={`relative flex-1 max-w-[75px] h-10 sm:h-11 rounded-full border-2 cursor-pointer ${variantActive === index
                ? "border-primary-6000 dark:border-primary-500"
                : "border-transparent"
                }`}
            >
              <div
                className="absolute inset-0.5 rounded-full overflow-hidden z-0 object-cover bg-cover"
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
    if (!selectedProduct?.allOfSizes || !selectedProduct?.sizes || !selectedProduct?.sizes.length) {
      return null;
    }
    return (
      <div>
        <div className="flex justify-between font-medium text-sm">
          <label htmlFor="">
            <span className="dark:text-typoPrimaryColor">
              Size:
              <span className="ml-1 font-semibold">{sizeSelected}</span>
            </span>
          </label>
        </div>
        <div className="grid grid-cols-5 sm:grid-cols-7 gap-2 mt-3 font-sans">
          {selectedProduct?.allOfSizes.map((size, index) => {
            const isActive = size === sizeSelected;
            const sizeOutStock = !selectedProduct.sizes.includes(size);
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
      </div >
    );
  };

  const renderStatus = () => {
    if (!selectedProduct?.status) {
      return null;
    }
    const CLASSES =
      "absolute top-3 left-3 px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 nc-shadow-lg rounded-full flex items-center justify-center text-slate-700 text-slate-900 dark:text-typoPrimaryColor";
    if (selectedProduct.status === "جديد") {
      return (
        <div className={CLASSES}>
          <SparklesIcon className="w-3.5 h-3.5" />
          <span className="ml-1 leading-none">{selectedProduct.status}</span>
        </div>
      );
    }
    if (selectedProduct.status === "50%") {
      return (
        <div className={CLASSES}>
          <IconDiscount className="w-3.5 h-3.5" />
          <span className="ml-1 leading-none">{selectedProduct.status}</span>
        </div>
      );
    }
    if (selectedProduct.status === "نفذت الكمية") {
      return (
        <div className={CLASSES}>
          <NoSymbolIcon className="w-3.5 h-3.5" />
          <span className="ml-1 leading-none">{selectedProduct.status}</span>
        </div>
      );
    }
    if (selectedProduct.status === "عرض محدود") {
      return (
        <div className={CLASSES}>
          <ClockIcon className="w-3.5 h-3.5" />
          <span className="ml-1 leading-none">{selectedProduct.status}</span>
        </div>
      );
    }
    return null;
  };

  const renderSectionContent = () => {
    return (
      <div className="space-y-7 2xl:space-y-8">
        {/* ---------- 1 HEADING ----------  */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-semibold dark:text-typoPrimaryColor">
            {selectedProduct?.name}
          </h2>

          <div className="flex items-center mt-5 space-x-4 sm:space-x-5">
            {/* <div className="flex text-xl font-semibold">$112.00</div> */}
            <Prices
              contentClass="py-1 px-2 md:py-1.5 md:px-3 text-lg font-semibold"
              price={selectedProduct?.price}
            />

            <div className="h-7 border-l border-slate-300 dark:border-typoSecondaryColor"></div>

            <div className="flex items-center">
              <a
                href="#reviews"
                className="flex items-center text-sm font-medium"
              >
                <StarIcon className="w-5 h-5 pb-[1px] text-yellow-400" />
                <div className="mr-1.5 flex">
                  <span className="dark:text-typoPrimaryColor">{selectedProduct?.ratings}</span>
                  <span className="block mx-2">·</span>
                  <span className="text-slate-600 dark:text-typoSecondaryColor underline">
                    142 reviews
                  </span>
                </div >
              </a >
              <span className="hidden sm:block mx-2.5">·</span>
              <div className="hidden sm:flex items-center text-sm">
                <SparklesIcon className="w-3.5 h-3.5" />
                <span className="ml-1 leading-none">{selectedProduct?.status}</span>
              </div>
            </div >
          </div >
        </div >

        {/* ---------- 3 VARIANTS AND SIZE LIST ----------  */}
        <div className="" > {renderVariants()}</div >
        <div className="">{renderSizeList()}</div>

        {/*  ---------- 4  QTY AND ADD TO CART BUTTON */}
        <div className="flex ">
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
        <hr className=" 2xl:!my-10 border-slate-200 dark:border-typoSecondaryColor "></hr>
        {/*  */}

        {/* ---------- 5 ----------  */}
        <AccordionInfo />

        {/* ---------- 6 ----------  */}
        <div className="hidden xl:block">
          <Policy />
        </div>
      </div >
    );
  };

  const renderDetailSection = () => {
    return (
      <div className="">
        <h2 className="text-2xl font-semibold dark:text-typoPrimaryColor">Product Details</h2>
        <div className="prose prose-sm sm:prose dark:prose-invert sm:max-w-4xl mt-7 dark:text-typoSecondaryColor">
          <p>{selectedProduct?.description}</p>
          <p>
            The St. Louis Meramec Canoe Company was founded by Alfred Wickett in
            1922. Wickett had previously worked for the Old Town Canoe Co from
            1900 to 1914. Manufacturing of the classic wooden canoes in Valley
            Park, Missouri ceased in 1978.
          </p>
          <ul>
            <li>Regular fit, mid-weight t-shirt</li>
            <li>Natural color, 100% premium combed organic cotton</li>
            <li>
              Quality cotton grown without the use of herbicides or pesticides -
              GOTS certified
            </li>
            <li>Soft touch water based printed in the USA</li>
          </ul>
        </div>
      </div>
    );
  };

  const renderReviews = () => {
    return (
      <div className="">
        {/* HEADING */}
        <h2 className="text-2xl font-semibold flex items-center dark:text-typoPrimaryColor">
          <StarIcon className="w-7 h-7 mb-0.5" />
          <span className="mr-1.5"> 4,87 · 142 Reviews</span>
        </h2>

        {/* comment */}
        <div className="mt-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-11 gap-x-28">
            <ReviewItem />
            <ReviewItem
              data={{
                comment: `I love the charcoal heavyweight hoodie. Still looks new after prenty of washes. 
                  If you’re unsure which hoodie to pick.`,
                date: "December 22, 2021",
                name: "Stiven Hokinhs",
                starPoint: 5,
              }}
            />
            <ReviewItem
              data={{
                comment: `The quality and sizing mentioned were accurate and really happy with the purchase. Such a cozy and comfortable hoodie. 
                Now that it’s colder, my husband wears his all the time. I wear hoodies all the time. `,
                date: "August 15, 2022",
                name: "Gropishta keo",
                starPoint: 5,
              }}
            />
            <ReviewItem
              data={{
                comment: `Before buying this, I didn't really know how I would tell a "high quality" sweatshirt, but after opening, I was very impressed. 
                The material is super soft and comfortable and the sweatshirt also has a good weight to it.`,
                date: "December 12, 2022",
                name: "Dahon Stiven",
                starPoint: 5,
              }}
            />
          </div>

          <PrimaryButton
            onClick={() => setIsOpenModalViewAllReviews(true)}
            className="mt-10 dark:text-typoSecondaryColor"
          >
            Show me all 142 reviews
          </PrimaryButton>
        </div>
      </div>
    );
  };

  return (
    <div className={`nc-ProductDetailPage overflow-hidden relative mb-[10rem]`}>
      {/* MAIn */}
      <div className="container">
        <div className="lg:flex">
          {/* CONTENT */}
          <div className="w-full lg:w-[55%] mt-[7rem]">
            {/* HEADING */}
            <div className="relative">
              <div className="aspect-w-16 aspect-h-16 relative">
                <Image
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  src={selectedProduct?.main_image_url as Route}
                  className="w-full cursor-pointer rounded-2xl object-cover"
                  alt="product detail 1"
                  onClick={handleOpenModalImageGallery}
                />
              </div>
              {renderStatus()}
              {/* META FAVORITES */}
              <LikeButton liked={selectedProduct && selectedProduct.likes?.includes(owner) || false} productId= {selectedProduct?.id !== undefined ? selectedProduct?.id : ""} className="absolute right-3 top-3 " />
            </div>
            <div className="grid grid-cols-2 gap-3 mt-3 sm:gap-6 sm:mt-6 xl:gap-8 xl:mt-8 relative">
              <div
                key={index}
                className="aspect-w-11 xl:aspect-w-10 2xl:aspect-w-11 aspect-h-16 "
              >
                <Image
                  sizes="(max-width: 640px) 100vw, 33vw"
                  fill
                  src={selectedProduct?.images[0] as Route}
                  className="w-full cursor-pointer rounded-2xl object-cover"
                  alt="product detail 1"
                />
              </div>
              <div
                className="absolute flex items-center md:justify-center md:right-3 md:bottom-3 bottom-2 right-1 px-4 py-2 rounded-xl bg-white ml-2 text-slate-500 dark:text-white cursor-pointer hover:bg-buttonColor dark:bg-primary-buttonPrimary dark:hover:bg-primary-buttonHoverPrimary dark:hover:text-white z-10"
                onClick={handleOpenModalImageGallery}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
                <span className="mr-2 md:text-sm text-xs font-medium">
                  Show all photos
                </span>
              </div>
              <div
                className="aspect-w-11 xl:aspect-w-10 2xl:aspect-w-11 aspect-h-16 relative"
              >
                <Image
                  sizes="(max-width: 640px) 100vw, 33vw"
                  fill
                  src={selectedProduct?.images[1] as Route}
                  className="w-full relative cursor-pointer rounded-2xl object-cover"
                  alt="product detail 1"
                />
              </div>
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="w-full lg:w-[45%] pt-10 lg:pt-0 lg:pr-7 xl:pr-9 2xl:pr-10 md:mt-[7rem] mt-[3rem]">
            {renderSectionContent()}
          </div>
        </div>

        {/* DETAIL AND REVIEW */}
        <div className="mt-12 sm:mt-16 space-y-10 sm:space-y-16">
          <div className="block xl:hidden">
            <Policy />
          </div>

          {renderDetailSection()}

          <hr className="border-slate-200 dark:border-typoSecondaryColor " />

          {renderReviews()}

          <hr className="border-slate-200 dark:border-typoSecondaryColor " />

          {/* OTHER SECTION */}
          {/* <SectionSliderProductCard
            heading="Customers also purchased"
            subHeading=""
            headingFontClassName="text-2xl font-semibold"
            headingClassName="mb-10 text-neuShow all photostral-900 dark:text-neutral-50"
          /> */}

          {/* SECTION */}
          {/* <div className="pb-20 xl:pb-28 lg:pt-14">
          <SectionPromo1 />
        </div> */}
        </div>
      </div>
      {/* MODAL VIEW ALL REVIEW */}
      <ModalViewAllReviews
        show={isOpenModalViewAllReviews}
        onCloseModalViewAllReviews={() => setIsOpenModalViewAllReviews(false)}
      />
      <ListingImageGallery
        isShowModal={modal === "PHOTO_TOUR_SCROLLABLE"}
        onClose={handleCloseModalImageGallery}
        images={selectedProduct?.images?.map((item, index: number) => {
          return {
            id: index,
            url: item,
          };
        }) ?? []}
      />
    </div>
  );
};

export default ProductDetailPage;
