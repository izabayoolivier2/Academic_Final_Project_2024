"use client";

import SectionClientSay from "@/components/SectionClientSay/SectionClientSay";
import SectionHero2 from "@/components/SectionHero/SectionHero2";
import SectionSliderCategories from "@/components/SectionSliderCategories/SectionSliderCategories";
import SectionSliderProductCard from "@/components/SectionSliderProductCard";
import { useThemeMode } from "@/hooks/useThemeMode";
import { FC, useEffect } from "react";
import { getGroupsFromDB } from "./redux/features/groupThunk";
import { useAppDispatch } from "./redux/hooks";
import SectionHowItWork from "@/components/SectionHowItWork/SectionHowItWork";
import SectionPromo1 from "@/components/SectionPromo1";
import { Reveal } from "@/components/Reveal";

export interface PageContainer { }

const PageHome: FC<PageContainer> = () => {
  const { _toogleDarkMode, isDarkMode, toDark, toLight } = useThemeMode();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getGroupsFromDB());
  }, [dispatch]);

  const scroll = () => {
    const element = document.getElementById('product')
    element?.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" })
  }
  return (
    <div className="relative overflow-hidden nc-PageHome">
      <SectionHero2/>
      <div className="container mx-auto mt-14 lg:mt-32" >
        <SectionSliderCategories />
      </div>
      {/* <div className="mt-14 lg:mt-32">
        <DiscoverMoreSlider />
      </div> */}

      <div className="container relative my-24 space-y-24 lg:space-y-32 lg:my-32">
        <div className="mx-auto mt-14 lg:mt-32" >
          <SectionSliderProductCard
          />
        </div>
{/* 
        <div className="py-24 border-t border-b lg:py-32 border-slate-200 dark:border-slate-700">
          <SectionHowItWork />
        </div> 
        <Reveal>
          <SectionPromo1 />
        </Reveal> */}

        {/* <div className="relative py-24 lg:py-32">
          {!isDarkMode && <BackgroundSection />}
          <SectionGridMoreExplore />
        </div>


        {/* <SectionSliderProductCard
          heading="الأكثر مبيعًا"
          subHeading="الأكثر مبيعا لهذا الشهر"
          data={products}
        /> */}
        {/*
        <div className="flex flex-col">
          <div className="flex flex-col justify-between md:flex-row">
            <div className="w-full md:w-[49%]">
              <Reveal>
                <Image
                  width={500}
                  height={500}
                  className="object-cover w-full rounded-md"
                  src='https://cdn.salla.sa/form-builder/nycAwGJ5WMSNdF5tv5z8KhgUmQ6kcRWBgwMGhCmv.jpg'
                  alt="backgroundLineSvg"
                />
              </Reveal>
            </div>
            <div className="w-full md:w-[49%] mt-10 md:mt-0">
              <Reveal>
                <Image
                  width={500}
                  height={500}
                  className="object-cover w-full rounded-md"
                  src='https://cdn.salla.sa/form-builder/xH8ipMz7qAFPO9fCogKD3Ocm8DlU0TMxkzhYHaNx.jpg'
                  alt="backgroundLineSvg"
                />
              </Reveal>
            </div>
          </div>
        </div>


        <SectionSliderProductCard
          heading="الأكثر مبيعًا"
          subHeading="الأكثر مبيعا لهذا الشهر"
        />



        {/* <SectionSliderLargeProduct cardStyle="style2" /> */}

        {/* <SectionGridFeatureItems /> */}

        {/* <div className="relative py-24 lg:py-32">
          <BackgroundSection />
          <div>
            <Reveal>
              <Heading rightDescText="From the Powr blog">
                The latest news
              </Heading>
            </Reveal>
            <SectionMagazine5 />
            <div className="flex justify-center mt-16">
              <ButtonSecondary>Show all blog articles</ButtonSecondary>
            </div>
          </div>
        </div> */}
        <SectionClientSay />
      </div>
    </div>
  );
}

export default PageHome;
