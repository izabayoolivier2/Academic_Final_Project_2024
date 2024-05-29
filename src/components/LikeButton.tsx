"use client";

import React, { useEffect, useState } from "react";
import { Reveal } from "./Reveal";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { getProductsFromDB, likeProduct } from "@/app/redux/features/product/productThunk";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/app/firebase/config";
import { getUserByUserId, subscribeToUserProfile } from "@/app/redux/features/auth/authThunk";
import { Product } from "@/app/models/Product";

export interface LikeButtonProps {
  className?: string;
  liked: boolean;
  productId: string;
}

const LikeButton: React.FC<LikeButtonProps> = ({
  className = "",
  liked,
  productId
}) => {
  const [owner, setOwner] = useState<string>("");
  const product = useAppSelector((state) => state.product.products.filter((item) => item.id === productId)[0]);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getProductsFromDB());
  }, [dispatch]);

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        await dispatch(subscribeToUserProfile(user.uid));
        await dispatch(getUserByUserId(user.uid));
        setOwner(user.uid)
      }
    });
  }, [dispatch])
  
  const likeProductData = () => { 
    if (product) {
      const likedByUser = product.likes?.includes(owner);

      if (likedByUser) {
        return {
          ...product,
          likes: product.likes.filter((id) => id !== owner),
        };
      } else {
        return {
          ...product,
          likes: [...product.likes, owner],
        };
      }
    }
    return product;
  };


  const handleLikeProduct = async () => {
    const updatedProduct = likeProductData();
    if (updatedProduct) {
      await dispatch(likeProduct(updatedProduct));
    }
  }


  return (
    <button
      className={`w-9 h-9 flex items-center justify-center rounded-full bg-white dark:bg-neutral-800 text-neutral-700 dark:text-slate-200 nc-shadow-lg ${className}`}
      onClick={() => handleLikeProduct()}
    >
      <Reveal>
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
          <path
            d="M12.62 20.81C12.28 20.93 11.72 20.93 11.38 20.81C8.48 19.82 2 15.69 2 8.68998C2 5.59998 4.49 3.09998 7.56 3.09998C9.38 3.09998 10.99 3.97998 12 5.33998C13.01 3.97998 14.63 3.09998 16.44 3.09998C19.51 3.09998 22 5.59998 22 8.68998C22 15.69 15.52 19.82 12.62 20.81Z"
            stroke={liked ? "#CE181E" : "currentColor"}
            fill={liked ? "#CE181E" : "none"}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Reveal>
    </button>
  );
};

export default LikeButton;
