import "./globals.css";
import "@/fonts/line-awesome-1.3.0/css/line-awesome.css";
import "@/styles/index.scss";
import "rc-slider/assets/index.css";
import Footer from "@/shared/Footer/Footer";
import SiteHeader from "@/app/SiteHeader";
import CommonClient from "./CommonClient";
import { Providers } from "./context/redux.provider";
import { Roboto } from "next/font/google";
import { Metadata } from "next";

const almarai = Roboto({ subsets: ["latin"], weight: ["400", "500", "700"] });

export const metadata: Metadata = {
  icons: {
    icon: "@/images/svgs/logo.png",
  },
};

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: any;
}) {
  return (
    <html lang="en" className={almarai.className}>
      <head>
        <link rel="icon" href="@/images/svgs/logo.png" sizes="any" />
      </head>
      <Providers>
        <body className="bg-white text-base dark:bg-neutral-900 text-neutral-900 dark:text-neutral-200">
          <div className="z-0 relative bg-white text-base dark:bg-bodyBg text-neutral-900 dark:text-neutral-200">
            <SiteHeader />
            {children}
            <CommonClient />
            <Footer />
          </div>
        </body>
      </Providers>
    </html>
  );
}
