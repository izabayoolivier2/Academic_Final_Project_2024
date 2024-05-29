import React, { FC, useEffect, useState } from "react";
import { Transition } from "@/app/headlessui";
import Prices from "@/components/Prices";
import Image, { StaticImageData } from "next/image";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { listenToCartUpdates, removeFromCartFirestore } from "@/app/redux/features/cart/cartThunk";
import { auth } from "@/app/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { getUserByUserId } from "@/app/redux/features/auth/authThunk";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import toast from "react-hot-toast";

interface Props {
  show: boolean;
  productImage: string | StaticImageData;
  variantActive: number;
  sizeSelected: string;
  qualitySelected: number;
  productId: string;
  name: string;
  price: number;
  main_image_url: string
  owner: string
  points: number
  variants: any
}

const NotifyAddTocart: FC<Props> = ({
  show,
  productImage,
  variantActive,
  qualitySelected,
  sizeSelected,
  name,
  price,
  variants,

}) => {

  const router = useRouter();
  const [cartProducts, setCartProducts] = useState<any>([])
  const [owner, setOwner] = useState<string>("");
  const [cartTotal, setCartTotal] = useState<any>([])

  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const closeToast = () => {
    toast.dismiss("nc-product-notify"); // Dismiss the toast by its ID
  };
  useEffect(() => {
    if (cartItems.length > 0) {
      setCartProducts(cartItems)
    }
  }, [cartItems]);

  useEffect(() => {
    dispatch(listenToCartUpdates());
  }, [dispatch]);

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        await dispatch(getUserByUserId(user.uid));
        setOwner(user.uid)
      }
    });
  }, [dispatch])

  // Start handle subtotal

  function calculateTotal(cartItems: any[]): number {
    const itemTotal = cartItems.reduce((subTotal: number, product: { price: number; quantity: number; }) => {
      return subTotal + product.price * product.quantity;
    }, 0);
    return itemTotal;
  }

  useEffect(() => {
    setCartTotal(calculateTotal(cartProducts));
  }, [cartProducts]);


  const deliveryFee = 12;
  const tax = 20

  // End handle subTotal

  // Start remove item from cart
  const handleRemoveFromCart = async (productId: string, owner: string) => {
    if (productId && owner) {
      await dispatch(removeFromCartFirestore({ productId, owner }));
    }
  };


  const renderProductCartOnNotify = () => {
    return (
      <div className="flex ">
        <div className="h-24 w-20 relative flex-shrink-0 overflow-hidden rounded-xl bg-slate-100">
          <Image
            src={productImage}
            alt={name}
            fill
            sizes="100px"
            className="h-full w-full object-cover object-center"
          />
        </div>

        <div className="mr-4 flex flex-1 flex-col">
          <div>
            <div className="flex justify-between ">
              <div>
                <h3 className="text-base font-medium ">{name}</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-typoSecondaryColor">
                  <span>
                    {variants ? variants[variantActive].name : `Natural`}
                  </span>
                  <span className="h-4 mx-2 border-s border-slate-200 dark:border-typoSecondaryColor"></span>
                  <span>{sizeSelected || "XL"}</span>
                </p>
              </div>
              <Prices price={price} className="mt-0.5" />
            </div>
          </div>
          <div className="flex flex-1 items-end justify-between text-sm">
            <p className="text-gray-500 dark:text-darkGray4">{`Qty ${qualitySelected}`}</p>

            <div className="flex">
              <button
                type="button"
                className="font-medium text-primary-6000 dark:text-primary-500 "
                onClick={() => router.push(`/cart`)}
              >
                <Link
                  href={'/cart'}
                >
                </Link>
                View cart
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Transition
      appear
      show={show}
      className="p-4 max-w-md w-full bg-white dark:bg-primary-cardPrimary shadow-lg rounded-2xl pointer-events-auto ring-1 ring-black/5 dark:ring-white/10 text-slate-900 dark:text-typoPrimaryColor"
      enter="transition-all duration-150"
      enterFrom="opacity-0 translate-x-20"
      enterTo="opacity-100 translate-x-0"
      leave="transition-all duration-150"
      leaveFrom="opacity-100 translate-x-0"
      leaveTo="opacity-0 translate-x-20"
    >
      <div className="flex justify-between">
        <p className="block text-base font-semibold leading-none">
          Added to cart!
        </p>
        <div onClick={closeToast}>
          <XMarkIcon className="w-5 h-5 cursor-pointer" />
        </div>
      </div>

      <hr className=" border-slate-200 dark:border-typoSecondaryColor my-4" />
      {renderProductCartOnNotify()}
    </Transition>
  );
};

export default NotifyAddTocart;