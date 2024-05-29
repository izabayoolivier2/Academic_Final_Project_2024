import React from "react";
import logoImg from "@/images/logo.png";
import logoLightImg from "@/images/logo.png";
import Link from "next/link";
import Image from "next/image";

export interface LogoProps {
  img?: string;
  imgLight?: string;
  className?: string;
}

const FooterLogo: React.FC<LogoProps> = ({
  img = logoImg,
  imgLight = logoLightImg,
  className = "flex-shrink-0",
}) => {
  return (
    <Link
      href="/"
      className={`ttnc-logo inline-block text-slate-600 ${className}`}
    >
      {/* THIS USE FOR MY CLIENT */}
      {/* PLEASE UN COMMENT BELLOW CODE AND USE IT */}
      {img ? (
        <Image
          className={`block h-6 w-auto ${
            imgLight ? "dark:hidden" : ""
          }`}
          src={img}
          alt="Logo"
          sizes="400px"
          priority
        />
      ) : (
        "Logo Here"
      )}
      {imgLight && (
        <Image
          className="hidden h-6 w-auto dark:block"
          src={imgLight}
          alt="Logo-Light"
          sizes="600px"
          priority
        />
      )}
    </Link>
  );
};

export default FooterLogo;
