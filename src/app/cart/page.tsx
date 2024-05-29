'use client';
import { NoSymbolIcon, CheckIcon } from "@heroicons/react/24/outline";
import NcInputNumber from "@/components/NcInputNumber";
import Prices from "@/components/Prices";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import Image from "next/image";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { listenToCartUpdates, removeFromCartFirestore } from "../redux/features/cart/cartThunk";
// import { updateCartItemQuantity } from "../redux/features/cart/cartSlice";
import { Route } from "next";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/config";
import { getUserByUserId } from "../redux/features/auth/authThunk";
import { updateCartItemQuantity } from "../redux/features/cart/cartSlice";
import PrimaryButton from "@/shared/Button/PrimaryButton";
import { Reveal } from "@/components/Reveal";
import Select from "@/components/selectComponent/Select";
import SelectSize from "@/components/selectComponent/SelectSize";
import Label from "@/components/Label/Label";
import Input from "@/shared/Input/Input";
import ProductStatus from "@/components/ProductStatus";
import NcInputNumberCart from "@/components/NcInputNumberCart";
import ButtonSecondary from "@/shared/Button/ButtonSecondary";
import Card from "@/components/card/Card"
import IconDiscount from "../../components/IconDiscount";

const CartPage = () => {
  const [owner, setOwner] = useState<string>("");
  const [cartTotal, setCartTotal] = useState<number>(0)

  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const products = cartItems?.products

  function calculateTotal(products: any): number {
    const itemTotal = products?.reduce((subTotal: number, product: { price: number; quantity: number; }) => {
      return subTotal + product.price * product.quantity;
    }, 0);
    return itemTotal;
  }

  useEffect(() => {
    let total = calculateTotal(products)
    if (products) {
      setCartTotal(total);
    }
  }, [products]);

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

  // Start handle subtotal
  const deliveryFee = 12;
  const tax = 20
  // End handle subTotal

  // Start remove item from cart
  const handleRemoveFromCart = async (productId: string, owner: string) => {
    if (productId) {
      await dispatch(removeFromCartFirestore({ productId, owner }));
    }
  };
  // End remove item from cart

  const renderStatusSoldout = () => {
    return (
      <div className="rounded-full flex items-center justify-center px-2.5 py-1.5 text-xs text-slate-700 dark:text-typoSecondaryColor border border-slate-200 dark:border-primary-buttonPrimary">
        <NoSymbolIcon className="w-3.5 h-3.5" />
        <Reveal>
          <span className="ml-1 leading-none">نفذت الكمية</span>
        </Reveal>
      </div>
    );
  };

  const renderStatusInstock = () => {
    return (
      <div className="rounded-full flex items-center justify-center px-2.5 py-1.5 text-xs text-slate-700 dark:text-typoSecondaryColor border border-slate-200 dark:border-primary-buttonPrimary">
        <CheckIcon className="w-3.5 h-3.5" />
        <Reveal>
          <span className="ml-1 leading-none">In Stock</span>
        </Reveal>
      </div>
    );
  };

  const renderProduct = (product: any, productIndex: number) => {

    return (
      <>
        {product && (
          <div
            key={productIndex}
            className="relative flex py-8 sm:py-10 xl:py-12 first:pt-0 last:pb-0"
          >
            <div className="relative h-36 w-24 sm:w-32 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100">
              {
                product.status === "نفذت الكمية" && <div className="absolute z-10 inset-0 backdrop-brightness-50 bg-[#02020FFA]/50 h-full w-full "></div>
              }
              <Image
                fill
                src={product.main_image_url}
                alt={product.name}
                sizes="300px"
                className="h-full w-full object-cover object-center"
              />
              <div className="absolute z-10 top-0">
                <ProductStatus status={product.status} />
              </div>
              <Link href="#" className="absolute inset-0"></Link>
            </div>

            <div className="mr-3 sm:mr-6 flex flex-1 flex-col">
              <div>
                <div className="flex justify-between ">
                  <div className="flex-[1.5] relative">
                    <Reveal>
                      <h3 className="text-base font-semibold dark:text-typoPrimaryColor">
                        <Link href="#">{product.name}</Link>
                      </h3>
                    </Reveal>
                    <div className="mt-3 flex justify-between w-full sm:hidden relative">
                      <select
                        name="qty"
                        id="qty"
                        className="form-select text-sm flex justify-center items-center rounded-md py-1 border-slate-200 dark:border-primary-buttonPrimary relative z-10 dark:bg-primary-cardSecondary dark:text-white "
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
                        contentClass="py-1 px-2 md:py-1.5 md:px-2.5 text-sm font-medium h-full text-typoPrimaryColor"
                        price={product.price}
                      />
                    </div>
                  </div>
                  <div className="hidden sm:block text-center relative">
                    <NcInputNumberCart className="relative z-10 dark:text-typoPrimaryColor" productId={product.productId} owner={owner} />
                  </div>

                  <div className="hidden flex-1 sm:flex justify-end">
                    <Prices price={product.price} className="dark:text-typoPrimaryColor" />
                  </div>
                </div>

              </div>
              <div className="mt-4 flex-wrap md:mt-12 flex text-sm text-slate-600 dark:text-typoSecondaryColor">
                <div className="ml-8">
                  <Select />
                </div>
                <div>
                  <SelectSize />
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    )
  }



  return (
    <div className="nc-CartPage">
      <main className="container py-16 lg:pb-28 text-slate-700 lg:pt-20">
        <div className="mb-12 sm:mb-16">
          <h2 className="block text-2xl text-slate-700 dark:text-typoPrimaryColor sm:text-3xl lg:text-4xl font-semibold ">
            سلة المشتريات
          </h2>
          <div className="block mt-3 sm:mt-5 text-xs sm:text-sm font-medium text-slate-700 dark:text-typoSecondaryColor">
            <Link href={"/"} className="">
              Homepage
            </Link>
            <span className="text-xs mx-1 sm:mx-1.5">/</span>
            <Link href={"#"} className="">
              Clothing Categories
            </Link>
            <span className="text-xs mx-1 sm:mx-1.5">/</span>
            <span className="underline">سلة المشتريات</span>
          </div>
        </div>
        {products?.length > 0 ? (
          <>
            <div className="flex flex-col lg:flex-row justify-between w-full">
              <div className="md:w-[67%] divide-y divide-slate-200 dark:divide-primary-buttonPrimary">
                {products?.map(renderProduct)}
              </div>
              <div className="flex md:w-[30%] w-full">
                <div className="sticky top-28 w-full">
                  <div className="mb-6">
                    <Card>
                      <div className="py-2">
                        <h3 className="text-lg font-semibold dark:text-typoPrimaryColor inline-flex justify-center items-center"><IconDiscount className="w-[1.2rem] h-[1.2rem] ml-1" />
                          هل لديك كود خصم؟
                        </h3>
                        <div className="flex mt-5">
                          <Input sizeClass="h-10 w-[45%] px-4 py-3 border-none rounded-sm text-white placeholder-typoSecondaryColor " className="flex-1" placeholder="ادخل كود الخصم" />
                          <button className="text-typoPrimaryColor  w-[25%] border border-none dark:border-primary-buttonPrimary hover:bg-primary-buttonHoverPrimary rounded-sm px-4 font-medium text-sm bg-neutral-200/70 bg-red dark:hover:bg-primary-buttonHoverPrimary flex justify-center items-center transition-colors">
                            Apply
                          </button>
                        </div>
                      </div>
                    </Card>
                  </div>
                  <Card>
                    <h3 className="text-lg font-semibold dark:text-typoPrimaryColor">ملخص الطلب</h3>
                    <div className="mt-7  text-sm text-white dark:text-typoSecondaryColor">
                      <div className="flex justify-between mb-3">
                        <span className="text-typoPrimaryColor">مجموع المنتجات</span>
                        <span className="font-semibold text-slate-900 dark:text-slate-200">
                          {cartTotal} SAR
                        </span>
                      </div>
                      <div className="flex justify-between mb-5">
                        <span className="text-typoPrimaryColor font-bold text-lg">الإجمالي</span>
                        <span className="font-bold text-slate-900 dark:text-slate-200 text-lg">
                          {cartTotal + deliveryFee + tax} SAR
                        </span>
                      </div>
                      <div className="flex justify-between font-semibold text-slate-900 dark:text-slate-200 text-base pt-4">
                        <span className="text-typoSecondaryColor text-xs">* الأسعار شاملة الضريبة</span>
                      </div>
                    </div>
                    <PrimaryButton href={`${owner !== "" && owner !== null && owner !== undefined ? "/checkout" : "/login"}`} className="mt-8 w-full text-white dark:bg-red rounded-sm dark:hover:bg-red/60">
                      اتمام الطلب
                    </PrimaryButton>
                  </Card>
                </div>
              </div>
            </div>
          </>
        ) : (

          <div className="flex flex-col gap-10 items-center justify-center ">
            <h1 className="text-2xl dark:text-white font-bold">
              Your Cart is empty
            </h1>
            <div className="flex items-center justify-between gap-5">
              <ButtonPrimary href="/" className="rounded-sm">
                Continue Shopping
              </ButtonPrimary>
            </div>
          </div>
        )}


      </main >
    </div >
  );
};


export default CartPage;
