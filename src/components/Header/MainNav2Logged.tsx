"use client";

import React, { createRef, FC, useEffect, useState } from "react";
import { useThemeMode } from "@/hooks/useThemeMode";
import Logo from "@/shared/Logo/Logo";
import MenuBar from "@/shared/MenuBar/MenuBar";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/app/firebase/config";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { getUserByUserId } from "@/app/redux/features/auth/authThunk";
import { usePathname, useRouter } from "next/navigation";
import AvatarDropdown from "./AvatarDropdown";
import CartDropdown from "./CartDropdown";
import { Fragment } from "react";
import { Popover, Transition } from "@/app/headlessui";
import Link from "next/link";
import { UrlObject } from "url";
import Image from "next/image";
import Prices from "../Prices";

export interface MainNav2LoggedProps { }

const MainNav2Logged: FC<MainNav2LoggedProps> = () => {
  const inputRef = createRef<HTMLInputElement>();
  const [showSearchForm, setShowSearchForm] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [textColor, setTextColor] = useState('text-white');
  const [scrollOpacity, setScrollOpacity] = useState<number>(0);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>('');


  const products = useAppSelector((state) => state.product.products);

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        dispatch(getUserByUserId(user.uid));
        return setIsLoggedIn(true)
      }
    });
  }, [dispatch])

  const filteredProducts = products.filter((product) =>{
    if (searchTerm !== undefined && searchTerm !== "") {
      return product.name.toLowerCase().includes(searchTerm?.toLowerCase())

  }}
);

  const handleChange = (e: any) => {
    setSearchTerm(e.target.value);
  }



  const thisPathname = usePathname();
  const { _toogleDarkMode, isDarkMode, toDark, toLight } = useThemeMode();

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const maxOpacity = 1;
      const minOpacity = 0;
      const scrollRange = 300; // Adjust this value based on when you want the transition to complete
      const opacity = Math.min(maxOpacity, Math.max(minOpacity, scrollY / scrollRange));
      setScrollOpacity(opacity);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call to set the initial opacity

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleScroll = () => {
    // for text
    if (window.scrollY > 100) {
      setTextColor('text-black');
    } else {
      setTextColor("text-white");
    }
    if (window.scrollY > 0) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const renderMagnifyingGlassIcon = () => {
    return (
      <svg
        width={22}
        height={22}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M22 22L20 20"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  };

  const renderSearchForm = () => {
    return (
      <Popover className="relative">
        {({ open, close }) => (
          <>
            <Popover.Button
              className={`
                ${open ? "" : "text-opacity-90"}
                 group w-10 h-10 sm:w-12 sm:h-12 hover:bg-slate-100 hover:text-white dark:hover:bg-primary-buttonHoverPrimary rounded-full inline-flex items-center justify-center focus:outline-none relative`}
            >
              {renderMagnifyingGlassIcon()}
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
              <Popover.Panel className="hidden right-0 md:block absolute z-10 w-screen max-w-xs sm:max-w-md px-4  sm:px-0">
                <form
                  className="flex-1 pt-2 mb-0 text-slate-900 dark:text-slate-100 hover:bg-transparent"
                  onSubmit={(e) => {
                    e.preventDefault();
                    router.push("#");
                    inputRef.current?.blur();
                  }}
                >
                  <div className="bg-slate-50 mb-0 dark:bg-neutral-800 flex justify-between items-center px-10 h-full rounded">
                    <div>
                      {renderMagnifyingGlassIcon()}
                    </div>
                    <div>
                      <input
                        ref={inputRef}
                        type="text"
                        value={searchTerm}
                        onChange={handleChange}
                        placeholder="Start searching..."
                        className="w-full placeholder-typoSecondaryColor placeholder-text-sm text-base bg-transparent border-none focus:outline-none focus:ring-0"
                        autoFocus
                      />
                    </div>
                    <div>
                      <button type="button" onClick={close}>
                        <XMarkIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </form>
                {filteredProducts.length > 0 ? (
                <div className="overflow-hidden rounded-md shadow-lg border border-ringColor mt-0">
                  <div className="relative grid grid-cols-1 gap-6 text-black text-ringColor dark:text-white  bg-white dark:bg-primary-cardPrimary py-7 px-6">
                   {filteredProducts.map((product: any, index: number) => (
                    <Link
                      href={`/product-detail/${product.id}` as unknown as UrlObject}
                      key={index}
                      onClick={close}
                      className="flex items-center p-2 -m-3 transition duration-150 ease-in-out rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                    >
                    <div key={index} className="flex w-full my-3 last:pb-0 ">
                    <div className="relative h-14 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100">
                      <Image
                        fill
                        src={product.main_image_url}
                        alt={product.name}
                        className="relative flex-shrink-0 overflow-hidden rounded-lg bg-slate-100"
                      />
                    </div>

                    <div className="mr-4 flex flex-1 flex-col">
                      <div>
                        <div className="flex justify-between w-full">
                          <div>
                            <h3 className="text-[1rem] font-semibold dark:text-typoPrimaryColor leading-3 pb-[2px]" style={{ lineHeight: 1 }}>
                                {product.name}
                            </h3>
                            <p className="mt-1 text-sm text-slate-500 dark:text-typoSecondaryColor">
                              
                              <div className="mt-1.5 sm:mt-2.5 flex text-sm text-slate-600 dark:text-typoSecondaryColor">
                                <span>{product.stock > 0 ? `Stock: ${product.stock}` : "Out of Stock"}</span>
                              </div>
                            </p>
                          </div>
                          <Prices price={product.price} discount = {product.discountPrice} className="dark:text-typoPrimaryColor" />
                        </div>
                      </div>

                    </div>
                  </div>
                    </Link>
                   ))}
                  </div>
                </div>

                ) : filteredProducts.length === 0 && searchTerm !== undefined && searchTerm !== "" ? (
                  <div className="overflow-hidden rounded-md shadow-lg border border-ringColor">
                  <div className="flex justify-center relative items-center  text-black text-ringColor dark:text-white  bg-white dark:bg-primary-cardPrimary py-7 px-6">
                    Nothing was found
                    </div>
                    </div>
                  
                ): <></>}
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    );
  };

  const renderContent = () => {
    return (
      <div className="flex items-center justify-between md:h-20 h-14">
        <div className=" lg:block">
          <Logo className="flex-shrink-0" />
        </div>
        <div className={`flex items-center justify-end dark:text-slate-100 ${thisPathname !== '/' ? 'text-black' : textColor}`}>
          {/* {isLoggedIn ? <AvatarDropdown /> : 
            <ButtonPrimary className="mx-4" type="button" onClick={() => router.push("/login")}>Sign In</ButtonPrimary>
          } */}
          <div className="md:block hidden">
            {renderSearchForm()}
          </div>
          <AvatarDropdown />
          {/* <CartDropdown /> */}
          <div className="flex items-center ">
            <MenuBar />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="nc-HeaderLogged fixed top-0 w-full z-40 ">
      <div
        className="nc-MainNav2Logged md:py-0 py-[-2rem] absolute w-full z-10 dark:bg-[#1A031D] bg-fuchsia-200  bg-gradient-to-t from-transparent to-bgColor"
        style={{
          backgroundColor: isDarkMode
            ? `rgba(26,3,29, ${scrollOpacity})`
            : `rgba(255, 255, 255, ${scrollOpacity})`,
        }}
      >
        <div className=" block md:hidden">
          <div className="">{renderContent()}</div>
        </div>
        <div className=" md:block hidden mx-20">
          <div className="">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default MainNav2Logged;
