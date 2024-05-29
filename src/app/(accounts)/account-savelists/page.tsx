'use client';

import { auth } from "@/app/firebase/config";
import { getUserByUserId, subscribeToUserProfile } from "@/app/redux/features/auth/authThunk";
import { getProductsFromDB } from "@/app/redux/features/product/productThunk";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import ProductCard from "@/components/ProductCard";
import { PRODUCTS } from "@/data/data";
import ButtonSecondary from "@/shared/Button/ButtonSecondary";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

const AccountSavelists = () => {
  const [owner, setOwner] = useState<string>("");

  const products = useAppSelector((state) => state.product.products.filter((item) => item.likes.includes(owner)));
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
  const renderSection1 = () => {
    return (
      <div className="space-y-10 sm:space-y-12">
        <div>
          <h2 className="text-2xl sm:text-3xl font-semibold">
            List of saved products
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3 ">
          {products.length > 0 ? products.map((product, index) => (
            <ProductCard data={product} key={index} />
          )) : (
            <div className="text-center">
              <h2 className="text-xl sm:text-2xl">No saved products</h2>
            </div>
          )}
        </div>
      </div>
    );
  };

  return renderSection1();
};

export default AccountSavelists;
