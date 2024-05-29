"use client";

import Link from "next/link";
import Image from "next/image";
import Prices from "@/components/Prices";
import { useRouter } from "next/navigation";
import { auth } from "@/app/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { Fragment, useEffect, useState } from "react";
import { Popover, Transition } from "@/app/headlessui";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { getUserByUserId } from "@/app/redux/features/auth/authThunk";
import { listenToCartUpdates, removeFromCartFirestore } from "@/app/redux/features/cart/cartThunk";
import PrimaryButton from "@/shared/Button/PrimaryButton";
import NcInputNumber from "@/components/NcInputNumber";

export default function CartDropdown() {
  const router = useRouter();
  const [owner, setOwner] = useState<string>("");
  const [cartItemsTotal, setcartItemsTotal] = useState();
  const dispatch = useAppDispatch();
  const cartItems: any = useAppSelector((state: any) => state.cart.items);
  const products = cartItems?.products
  const [cartTotal, setCartTotal] = useState<number>(0)

  function calculateTotal(products: any): number {
    const itemTotal = products?.reduce((subTotal: number, product: { price: number; quantity: number; }) => {
      return subTotal + product.price * product.quantity;
    }, 0);
    return itemTotal;
  }

  const total = calculateTotal(products)
  useEffect(() => {
    setCartTotal(total);
    if (products) {
      setcartItemsTotal(products.length)
    }
  }, [products, total]);

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        await dispatch(getUserByUserId(user.uid));
        setOwner(user.uid)
      }
    });
  }, [dispatch])

  useEffect(() => {
    dispatch(listenToCartUpdates());
  }, [dispatch]);

  // Start remove item from cart
  const handleRemoveFromCart = (productId: string, owner: string) => {
    if (productId) {
      dispatch(removeFromCartFirestore({ productId, owner }));
      // router.push("/cart");
    }
  };

  // End remove item from cart
  const renderProduct = (item: any, index: number, close: () => void) => {
    return (
      <>
        {item ? (
          <div key={index} className="flex py-7 last:pb-0">
            <div className="relative h-24 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100">
              <Image
                fill
                src={item.main_image_url}
                alt={item.name}
                className="relative h-24 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100"
              />
              <Link
                onClick={close}
                className="absolute inset-0"
                href={"#"}
              />
            </div>

            <div className="ml-4 flex flex-1 flex-col">
              <div>
                <div className="flex justify-between ">
                  <div>
                    <h3 className="text-[0.8rem] font-medium dark:text-typoPrimaryColor leading-3 pb-[2px]" style={{ lineHeight: 1 }}>
                      <Link onClick={close} href={"#"}>
                        {item.name}
                      </Link>
                    </h3>
                    <p className="mt-1 text-sm text-slate-500 dark:text-typoSecondaryColor">
                      <div className="mt-1.5 sm:mt-2.5 flex text-sm text-slate-600 dark:text-typoSecondaryColor">
                        <div className="flex items-center">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                            <path
                              d="M7.01 18.0001L3 13.9901C1.66 12.6501 1.66 11.32 3 9.98004L9.68 3.30005L17.03 10.6501C17.4 11.0201 17.4 11.6201 17.03 11.9901L11.01 18.0101C9.69 19.3301 8.35 19.3301 7.01 18.0001Z"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeMiterlimit="10"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M8.35 1.94995L9.69 3.28992"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeMiterlimit="10"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M2.07 11.92L17.19 11.26"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeMiterlimit="10"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M3 22H16"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeMiterlimit="10"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M18.85 15C18.85 15 17 17.01 17 18.24C17 19.26 17.83 20.09 18.85 20.09C19.87 20.09 20.7 19.26 20.7 18.24C20.7 17.01 18.85 15 18.85 15Z"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>

                          <span className="ml-2">{`Black`}</span>
                        </div>
                        <span className="mx-4 border-l border-slate-200 dark:border-typoSecondaryColor "></span>
                        <div className="flex items-center">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                            <path
                              d="M21 9V3H15"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M3 15V21H9"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M21 3L13.5 10.5"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M10.5 13.5L3 21"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>

                          <span className="mr-2">{`2XL`}</span>
                        </div>
                      </div>
                    </p>
                  </div>
                  <Prices price={item.price} className="dark:text-typoPrimaryColor" />
                </div>
              </div>

              <div className="flex flex-1 items-end justify-between text-sm mt-3">
                <NcInputNumber className="relative z-10" />
                <div className="flex">
                  <button
                    type="button"
                    className="font-medium text-primary-6000 dark:text-primary-500 "
                    onClick={() => handleRemoveFromCart(item.productId, owner)}
                  >
                    <svg className="w-6 h-6" viewBox="0 0 24 24"
                      fill="#CE181E" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7 4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2h4a1 1 0 1 1 0 2h-1.069l-.867 12.142A2 2 0 0 1 17.069
                   22H6.93a2 2 0 0 1-1.995-1.858L4.07 8H3a1 1 0 0 1 0-2h4V4zm2 2h6V4H9v2zM6.074 8l.857 12H17.07l.857-12H6.074zM10
                  10a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0v-6a1 1 0 0 1 1-1zm4 0a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0v-6a1 1 0 0 1 1-1z" fill="#878787" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : <></>}
      </>
    );
  };

  return (
    <Popover className="relative">
      {({ open, close }) => (
        <>
          <Popover.Button
            className={`
                ${open ? "" : "text-opacity-90"}
                 group w-10 h-10 sm:w-12 sm:h-12 hover:bg-slate-100 dark:hover:bg-primary-buttonHoverPrimary rounded-full inline-flex items-center justify-center focus:outline-none relative`}
          >
            {cartItemsTotal !== undefined && cartItemsTotal !== null && cartItemsTotal !== 0 ? (
              <div className="w-[0.95rem] h-[0.95rem] flex items-center justify-center bg-primary-500 absolute top-1.5 right-1 rounded-full text-[12px] leading-none text-white font-medium">
                <span className="mt-[1px]">{cartItemsTotal}</span>
              </div>

            ) : <></>}
            <svg
              className="w-6 h-6"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 2H3.74001C4.82001 2 5.67 2.93 5.58 4L4.75 13.96C4.61 15.59 5.89999 16.99 7.53999 16.99H18.19C19.63 16.99 20.89 15.81 21 14.38L21.54 6.88C21.66 5.22 20.4 3.87 18.73 3.87H5.82001"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16.25 22C16.9404 22 17.5 21.4404 17.5 20.75C17.5 20.0596 16.9404 19.5 16.25 19.5C15.5596 19.5 15 20.0596 15 20.75C15 21.4404 15.5596 22 16.25 22Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8.25 22C8.94036 22 9.5 21.4404 9.5 20.75C9.5 20.0596 8.94036 19.5 8.25 19.5C7.55964 19.5 7 20.0596 7 20.75C7 21.4404 7.55964 22 8.25 22Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 8H21"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <Link className="block md:hidden absolute inset-0" href={"#"} />
          </Popover.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="hidden right-0 md:block absolute z-10 w-screen max-w-xs sm:max-w-md px-4 mt-3.5  sm:px-0">
              <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black/5 dark:ring-ringColor">
                <div className="relative bg-white dark:bg-secondaryBackground">
                  <div className="max-h-[60vh] pb-5 px-5 overflow-y-auto hiddenScrollbar">
                    <div className="divide-y divide-slate-100 dark:divide-ringColor">
                      {cartItems?.products?.length > 0 && cartItems.products.map(
                        (item: any, index: number) => renderProduct(item, index, close)
                      )}
                    </div>
                  </div>
                  <div className="bg-neutral-50 p-5  dark:bg-primary-cardPrimary">
                    {products?.length > 0 ? (
                      <>
                        <p className="flex justify-between  text-slate-900 dark:text-typoPrimaryColor">
                          <span className="font-semibold">
                            <span className="text-[0.9rem]" > Subtotal</span>
                            <span className="pt-2 block text-sm text-slate-500 dark:text-typoSecondaryColor font-normal">
                              Tax is calculated at checkout
                            </span>
                          </span>
                          <div className="">
                            <span className="font-semibold text-lg">{cartTotal}</span>
                            <span className="text-sm text-white mr-1">Rwf</span>
                          </div>
                        </p>
                        <div className="flex justify-between mt-[1.5rem]">
                          <PrimaryButton
                            href="/cart"
                            className="w-[48%] dark:hover:bg-ringColor rounded-sm"
                            onClick={close}
                          >
                            View cart
                          </PrimaryButton>
                          <PrimaryButton
                            href={`${owner !== "" && owner !== null && owner !== undefined ? "/checkout" : "/login"}`}
                            onClick={close}
                            className="w-[48%] dark:bg-red rounded-sm dark:hover:bg-red/60 "
                          >
                            Checkout
                          </PrimaryButton>
                        </div>
                      </>

                    ) : (
                      <>
                        <p className="flex justify-between  text-slate-900 dark:text-typoPrimaryColor">
                          <span className="font-semibold">
                            <h1 className="text-2xl dark:text-white font-bold">
                              Your Cart is empty. No service booked yet.
                            </h1>
                          </span>
                          <div className="">
                            <span className="font-semibold text-lg">{cartTotal}</span>
                            <span className="text-sm text-white mr-1">Rwf</span>
                          </div>
                        </p>
                        <div className="flex justify-between mt-[1.5rem]">
                          <PrimaryButton
                            href="/"
                            onClick={close}
                            className="w-full dark:bg-red rounded-sm dark:hover:bg-red/60 "
                          >
                            Continue Booking
                          </PrimaryButton>
                        </div>
                      </>
                    )}

                  </div>
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
}
