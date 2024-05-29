"use client";
import React from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useRouter, usePathname } from "next/navigation";
import { PhoneIcon } from "lucide-react";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Separator } from "@/components/ui/separator";
import { contactInfo } from "../../lib/data";

interface NavLink {
  path: string;
  text: string;
}

const NavBar: React.FC = () => {
  const router = useRouter();
  const currentUrl = usePathname();

  const navLinks: NavLink[] = [
    { path: "/", text: "Home" },
    // { path: "/services", text: "Services" },
    // { path: "/projects", text: "Projects" },
    // { path: "/blog", text: "Blog" },
    { path: "/contact", text: "Contact" },
  ];

  return (
    <header className=" sticky top-0 left-0 right-0 flex h-20 items-center gap-4 border-b border-primaryColor border-opacity-10 bg-bgLightColor dark:bg-bgDarkColor px-4  md:px-20 z-50">
      <nav className="  text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link href="/" className="w-[7rem]">
          {/* <Logo /> */}
        </Link>
      </nav>

      <div className="flex w-full items-center justify-end gap-2 md:gap-3">
        <div className="flex items-center text-sm font-semibold justify-center gap-2 md:mr-6 text-gray-700 dark:text-onPrimary">
          <PhoneIcon className="h-3 w-3 md:h-5 md:w-5 text-gray-700 dark:text-primaryColor" />
          + 250 785 242 034
        </div>
        {/* <ThemeSwitcher /> */}

        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              className="shrink-0  bg-primaryColor hover:bg-primaryColor hover:bg-opacity-30 bg-opacity-15 text-primaryColor rounded-full"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="dark:bg-bgDarkColor border-none rounded-tl-2xl rounded-bl-2xl flex flex-col justify-between"
          >
            <nav className="grid gap-6 text-lg font-medium ">
              <Link href="/" className="w-[7rem]">
                {/* <Logo /> */}
              </Link>
              {navLinks.map(({ path, text }) => (
                <Link
                  href={path as any}
                  key={path}
                  onClick={() => redirect(path)}
                  className={`${
                    currentUrl === path
                      ? "text-foreground"
                      : "text-muted-foreground"
                  } transition-colors text-onPrimary font-semibold hover:dark:text-onPrimary hover:bg-primaryColor hover:bg-opacity-10 p-3 rounded-md`}
                >
                  {text}
                </Link>
              ))}
            </nav>
            <div>
              <Separator className="mb-6" />
              <div className="grid grid-cols-1 gap-6">
                {contactInfo.map((service: any, index: number) => (
                  <p key={index} className="text-onPrimary">
                    <span className="text-primaryColor">{service.icon}</span>
                    {service.text}
                  </p>
                ))}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default NavBar;
