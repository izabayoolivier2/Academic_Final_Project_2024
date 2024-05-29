import Image, { StaticImageData } from "next/image";
import { Route } from "@/routers/types";
import imageRightPng from "@/images/hero-right.png";
import imageRightPng2 from "@/images/hero-right-2.png";
import imageRightPng3 from "@/images/hero-right-3.png";

interface Hero2DataType {
  heading: string;
  subHeading: string;
  btnText: string;
  btnLink: Route;
}

export const HERO2_DEMO_DATA: Hero2DataType = 
  {
    heading: "",
    subHeading: "In this season, find the best 🔥",
    btnText: "Get started",
    btnLink: "/",
  }
