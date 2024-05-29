import Logo from "@/shared/Logo/Logo";
import FooterLogo from "@/shared/Logo/FooterLogo";
import SocialsList1 from "@/shared/SocialsList1/SocialsList1";
import { CustomLink } from "@/data/types";
import React from "react";
import Image from "next/image";
import Link from "next/link";

export interface WidgetFooterMenu {
  id: string;
  title: string;
  menus: CustomLink[];
}

const menus = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About us" },
  { href: "/explore", label: "Explore" },
  { href: "/blog", label: "Blog" },
];
const forRent = [
  { href: "/vendors", label: "Vendors" },
  { href: "/Cars", label: "Cars" },
  { href: "/Venues ", label: "Venues & Halls" },
  { href: "/cakes", label: "Cakes" },
];

const Footer: React.FC = () => {
  const renderWidgetMenuItem = () => {
    return (
      <div className="">
        <h2 className="font-semibold text-xl text-neutral-700 dark:text-typoPrimaryColor">
          Links
        </h2>
      </div>
    );
  };

  return (
    <div className="nc-Footer container  relative pb-[1.5rem] lg:pb-[1.5rem] flex flex-col border-neutral-200 dark:border-neutral-700">
      <div className="pt-11 flex md:flex-row flex-col  w-full justify-between">
        <div className="flex flex-col md:w-[30%] w-full">
          <div className=" mb-4">
            <FooterLogo />
          </div>
          <div
            className=" text-lg text-onPrimaryBtnColor"
            style={{ lineHeight: "1.7rem" }}
          >
            Welcome to Eventive, your one-centralized system for professional
            Event planning, streamlining and Centralized Coordination!
          </div>
        </div>
        <div className=" md:w-fit w-full justify-center">
          <h2 className="font-bold md:text-lg border-b py-3 text-base text-neutral-700 dark:text-onPrimaryBtnColor mb-8">
            Useful links
          </h2>
          <ul className="text-lg">
            {menus.map((item, index) => (
              <li className="mb-4" key={index}>
                <Link
                  href={item.href as any}
                  className="text-neutral-600 dark:text-slate-400 hover:text-black dark:hover:text-primaryBtnColor"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className=" md:w-fit w-full justify-center">
          <h2 className="font-bold md:text-lg border-b py-3 text-base text-neutral-700 dark:text-onPrimaryBtnColor mb-8">
            Explore Items for rent
          </h2>
          <ul className="text-lg">
            {forRent.map((item, index) => (
              <li className="mb-4" key={index}>
                <Link
                  href={item.href as any}
                  className="text-neutral-600  dark:text-slate-400 hover:text-black dark:hover:text-primaryBtnColor"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="text-onPrimary text-center pt-5 mt-10 border-t border-primaryBtnColor border-opacity-30">
        &copy; {new Date().getFullYear()} Eventive. All rights reserved.
      </p>
    </div>
  );
};

export default Footer;
