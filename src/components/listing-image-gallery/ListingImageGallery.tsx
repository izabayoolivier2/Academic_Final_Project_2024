"use client";

import "./styles/index.css";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FC, Fragment, useEffect, useRef, useState } from "react";
import Modal from "./components/Modal";
import type { ListingGalleryImage } from "./utils/types";
import { useLastViewedPhoto } from "./utils/useLastViewedPhoto";
import { ArrowSmallLeftIcon } from "@heroicons/react/24/outline";
import { Dialog, Transition } from "@headlessui/react";
import LikeSaveBtns from "@/components/LikeSaveBtns";
import { Route } from "next";
import { useThemeMode } from "@/hooks/useThemeMode";
import { XMarkIcon } from "@heroicons/react/24/outline";

export const getNewParam = ({
  paramName = "photoId",
  value,
}: {
  paramName?: string;
  value: string | number;
}) => {
  let params = new URLSearchParams(document.location.search);
  params.set(paramName, String(value));
  return params.toString();
};

interface Props {
  images: ListingGalleryImage[];
  onClose?: () => void;
  isShowModal: boolean;
}

const ListingImageGallery: FC<Props> = ({ images, onClose, isShowModal }) => {
  const searchParams = useSearchParams();
  const photoId = searchParams?.get("photoId");
  const router = useRouter();
  const [lastViewedPhoto, setLastViewedPhoto] = useLastViewedPhoto();
  const [scrolled, setScrolled] = useState(false);
  const [textColor, setTextColor] = useState('text-white');
  const [scrollOpacity, setScrollOpacity] = useState<number>(0);

  const lastViewedPhotoRef = useRef<HTMLDivElement>(null);
  const thisPathname = usePathname();
  const { _toogleDarkMode, isDarkMode, toDark, toLight } = useThemeMode();

  useEffect(() => {
    // This effect keeps track of the last viewed photo in the modal to keep the index page in sync when the user navigates back
    if (lastViewedPhoto && !photoId) {
      lastViewedPhotoRef.current?.scrollIntoView({ block: "center" });
      setLastViewedPhoto(null);
    }
  }, [photoId, lastViewedPhoto, setLastViewedPhoto]);

  const handleClose = (action: string) => {
    if (action === "close") {
      onClose && onClose();
    }
  }
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

  const renderContent = () => {
    return (
      <div className=" ">
        {photoId && (
          <Modal
            images={images}
            onClose={() => {
              handleClose('close')
            }}
          />
        )}

        <div className="columns-1 gap-4 sm:columns-2 xl:columns-3">
          {images.map(({ id, url }) => (
            <div
              key={id}
              onClick={() => {
                const newPathname = getNewParam({ value: id });
                router.push(`${thisPathname}/?${newPathname}` as Route);
              }}
              ref={id === Number(lastViewedPhoto) ? lastViewedPhotoRef : null}
              className="after:content group relative mb-5 block w-full cursor-zoom-in after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight focus:outline-none"
            >
              <Image
                alt="chisfis listing gallery "
                className="transform rounded-lg brightness-90 transition will-change-auto group-hover:brightness-110 focus:outline-none"
                style={{
                  transform: "translate3d(0, 0, 0)",
                }}
                src={url}
                width={720}
                height={480}
                sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 350px"
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <Transition appear show={isShowModal} as={Fragment}>
        <Dialog as="div" className="relative z-40" onClose={() => handleClose('')}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-white dark:bg-neutral-900" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="sticky w-full z-10 top-0 p-4 xl:px-10 flex items-center justify-between"
              style={{
                backgroundColor:
                  'rgba(32,32,32'
              }}
            >
              <button
                className="focus:outline-none focus:ring-0 w-10 h-10 rounded-full flex items-center justify-center hover:bg-primary-cardSecondary"
                onClick={() => handleClose('close')}
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
              <LikeSaveBtns />
            </div>

            <div className="flex min-h-full items-center justify-center sm:p-4 pt-0 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-5"
                enterTo="opacity-100 translate-y-0"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-5"
              >
                <Dialog.Panel className="w-full max-w-screen-lg mx-auto transform p-4 pt-0 text-left transition-all ">
                  {renderContent()}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default ListingImageGallery;