"use client";

import Label from "@/components/Label/Label";
import NcInputNumber from "@/components/NcInputNumber";
import Prices from "@/components/Prices";
import { Product, PRODUCTS } from "@/data/data";
import { useEffect, useState } from "react";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import Input from "@/shared/Input/Input";
import ContactInfo from "./ContactInfo";
import PaymentMethod from "./PaymentMethod";
import ShippingAddress from "./ShippingAddress";
import Image from "next/image";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { onAuthStateChanged } from "firebase/auth";
import { getUserByUserId } from "../redux/features/auth/authThunk";
import {
  listenToCartUpdates,
  removeFromCartFirestore,
} from "../redux/features/cart/cartThunk";
import { auth } from "../firebase/config";
import { updateCartItemQuantity } from "../redux/features/cart/cartSlice";
import PrimaryButton from "@/shared/Button/PrimaryButton";
import NcInputNumberCart from "@/components/NcInputNumberCart";
import Card from "@/components/card/Card";
import IconDiscount from "../../components/IconDiscount";

const CheckoutPage = () => {
  const [tabActive, setTabActive] = useState<
    "ContactInfo" | "ShippingAddress" | "PaymentMethod"
  >("ShippingAddress");

  const [cartItemsTotal, setcartItemsTotal] = useState();
  const dispatch = useAppDispatch();
  const cartItems: any = useAppSelector((state: any) => state.cart.items);
  const products = cartItems?.products;
  const [cartTotal, setCartTotal] = useState<number>(0);
  const [owner, setOwner] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  function calculateTotal(products: any): number {
    const itemTotal = products?.reduce(
      (subTotal: number, product: { price: number; quantity: number }) => {
        return subTotal + product.price * product.quantity;
      },
      0
    );
    return itemTotal;
  }

  const total = calculateTotal(products);
  useEffect(() => {
    setCartTotal(total);
    if (products) {
      setcartItemsTotal(products.length);
    }
  }, [products, total]);

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        await dispatch(getUserByUserId(user.uid));
        setOwner(user.uid);
      }
    });
  }, [dispatch]);

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

  const handleCheckout = async () => {
    // Simulate a loading state
    setIsLoading(true);

    setTimeout(async () => {
      try {
        setCheckoutSuccess(true);
      } catch (error) {
        console.error("Checkout failed:", error);
      } finally {
        // Reset the loading state after the delay
        setIsLoading(false);
      }
    }, 3000);
  };

  const deliveryFee = 12;
  const tax = 20;

  const handleScrollToEl = (id: string) => {
    const element = document.getElementById(id);
    setTimeout(() => {
      element?.scrollIntoView({ behavior: "smooth" });
    }, 80);
  };

  const renderProduct = (item: any, index: number) => {
    const { main_image_url, price, name, productId } = item;

    return (
      <div key={index} className="relative flex py-7 first:pt-0 last:pb-0">
        <div className="relative h-36 w-24 sm:w-28 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100">
          <Image
            src={main_image_url}
            fill
            alt={name}
            className="h-full w-full object-cover object-center"
            sizes="150px"
          />
          <Link href="#" className="absolute inset-0"></Link>
        </div>

        <div className="mr-3 flex flex-1 flex-col">
          <div>
            <div className="flex justify-between ">
              <div className="flex-[1.5]">
                <h3 className="text-base font-semibold">
                  <Link href="#">{name}</Link>
                </h3>
                <div className="mt-1.5 sm:mt-2.5 flex text-sm text-slate-600 dark:text-darkGray4">
                  <div className="flex items-center space-x-1.5">
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

                    <span>{`Black`}</span>
                  </div>
                  <span className="mx-4 border-l border-slate-200 dark:border-primary-buttonPrimary"></span>
                  <div className="flex items-center space-x-1.5">
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

                    <span>{`2XL`}</span>
                  </div>
                </div>

                <div className="mt-3 flex justify-between w-full sm:hidden relative">
                  <select
                    name="qty"
                    id="qty"
                    className="form-select text-sm rounded-md py-1 border-slate-200 dark:border-slate-700 relative z-10 dark:bg-slate-800 "
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                  </select>
                  <Prices
                    contentClass="py-1 px-2 md:py-1.5 md:px-2.5 text-sm font-medium h-full"
                    price={price}
                  />
                </div>
              </div>

              <div className="hidden flex-1 sm:flex justify-end">
                <Prices price={price} className="mt-0.5" />
              </div>
            </div>
          </div>

          <div className="flex mt-auto pt-4 items-end justify-between text-sm">
            <div className="hidden sm:block text-center relative">
              <NcInputNumberCart
                className="relative z-10 dark:text-typo"
                productId={productId}
                owner={owner}
              />
            </div>

            <button
              type="button"
              className="font-medium text-primary-6000 dark:text-primary-500 "
              onClick={() =>
                handleRemoveFromCart(productId, owner ? owner : "")
              }
            >
              حذف
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderLeft = () => {
    return (
      <div className="space-y-8">
        <div id="ShippingAddress" className="scroll-mt-24">
          <ShippingAddress
            isActive={tabActive === "ShippingAddress"}
            onOpenActive={() => {
              setTabActive("ShippingAddress");
              handleScrollToEl("ShippingAddress");
            }}
            onCloseActive={() => {
              setTabActive("PaymentMethod");
              handleScrollToEl("PaymentMethod");
            }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="nc-CheckoutPage">
      <main className="container py-16 lg:pb-28 lg:pt-20 ">
        <div className="mb-16 mt-10">
          <h2 className="block text-2xl sm:text-3xl lg:text-4xl font-semibold ">
            Checkout
          </h2>
          <div className="block mt-3 sm:mt-5 text-xs sm:text-sm font-medium text-slate-700 dark:text-darkGray4">
            <Link href={"/"} className="">
              Homepage
            </Link>
            <span className="text-xs mx-1 sm:mx-1.5">/</span>
            <Link href={"#-2"} className="">
              Clothing Categories
            </Link>
            <span className="text-xs mx-1 sm:mx-1.5">/</span>
            <span className="underline">Checkout</span>
          </div>
        </div>

        {products?.length !== 0 ? (
          <div className="flex flex-col lg:flex-row w-full justify-between">
            <div className="md:w-[67%] w-full">{renderLeft()}</div>
            <div className="md:w-[30%] w-full">
              <div className="sticky top-28 ">
                <div className="mb-6">
                  <Card>
                    <div className="py-2">
                      <h3 className="text-lg font-semibold dark:text-typoPrimaryColor inline-flex justify-center items-center">
                        <IconDiscount className="w-[1.2rem] h-[1.2rem] ml-1" />
                        هل لديك كود خصم؟
                      </h3>
                      <div className="flex mt-5">
                        <Input
                          sizeClass="h-10 w-[45%] px-4 py-3 border-none rounded-sm text-white placeholder-typoSecondaryColor"
                          className="flex-1"
                          placeholder="ادخل كود الخصم"
                        />
                        <button className="text-typoPrimaryColor  w-[25%] border border-none dark:border-primary-buttonPrimary hover:bg-primary-buttonHoverPrimary rounded-sm px-4 font-medium text-sm bg-neutral-200/70 bg-red dark:hover:bg-primary-buttonHoverPrimary flex justify-center items-center transition-colors">
                          Apply
                        </button>
                      </div>
                    </div>
                  </Card>
                </div>
                <Card>
                  <div className="text-sm text-white mt-10 md:mt-0 dark:text-typoSecondaryColor divide-y divide-slate-200/70 dark:divide-primary-buttonPrimary/80">
                    <div className="flex justify-between pb-4">
                      <span className="text-slate-900 dark:text-slate-200">
                        المجموع الفرعي
                      </span>
                      <span className="font-semibold text-slate-900 dark:text-slate-200">
                        {cartTotal}
                      </span>
                    </div>
                    <div className="flex justify-between py-4">
                      <span className="text-slate-900 dark:text-slate-200">
                        Shipping estimate
                      </span>
                      <span className="font-semibold text-slate-900 dark:text-slate-200">
                        {deliveryFee}
                      </span>
                    </div>
                    <div className="flex py-4 justify-end cursor-pointer dark:hover:text-red">
                      <span className="text-red dark:text-typoSecondaryColor">
                        لديك كوبون تخفيض ؟
                      </span>
                    </div>
                  </div>
                  <PrimaryButton
                    onClick={handleCheckout}
                    disabled={isLoading}
                    href={`${
                      owner !== "" && owner !== null && owner !== undefined
                        ? "/checkout"
                        : "/login"
                    } ` as any}
                    className="w-full text-white dark:bg-red rounded-sm dark:hover:bg-red/60"
                  >
                    {isLoading ? "Loading..." : "Confirm order"}
                  </PrimaryButton>
                </Card>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-10 items-center justify-center ">
            <h1 className="text-2xl dark:text-white font-bold">
              Nothing to checkout
            </h1>
            <div className="flex items-center justify-between gap-5">
              <ButtonPrimary href="/" className="rounded-sm">
                Continue Booking
              </ButtonPrimary>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CheckoutPage;
