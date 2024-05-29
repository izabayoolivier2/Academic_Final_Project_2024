"use client";

import { Fragment, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/20/solid'
import productVariantImg2 from "@/images/products/v2.jpg";
import productVariantImg3 from "@/images/products/v3.jpg";
import productVariantImg4 from "@/images/products/v4.jpg";
import productVariantImg5 from "@/images/products/v5.jpg";
import productVariantImg6 from "@/images/products/v6.jpg";
import Image from "next/image";

const variant = [
  {
    id: 1,
    name: 'XS',
  },
  {
    id: 2,
    name: 'S',
  },
  {
    id: 3,
    name: 'M',
  },
  {
    id: 4,
    name: 'L',
  },
  {
    id: 5,
    name: 'XL',
  },
  {
    id: 6,
    name: '2XL',
  },
  {
    id: 7,
    name: '3XL',
  }
]

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ')
}

export default function Example() {
  const [selected, setSelected] = useState(variant[3])

  return (
    <Listbox value={selected} onChange={setSelected}>
      {({ open }) => (
        <>
          <div className="relative mt-3 w-[6rem]">
            <Listbox.Button className="relative w-full flex justify-between items-center h-12 cursor-default rounded-md bg-transparent border border-buttonColor py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-none sm:text-sm sm:leading-6">
              <div>
                <span className="flex items-center right-0 inset-y-0 absolute mr-2">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M21 9V3H15"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M3 15V21H9"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M21 3L13.5 10.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M10.5 13.5L3 21"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="mr-3 block truncate text-typoPrimaryColor">{selected.name}</span>
                </span>
              </div>
              <div>
                <span className="pointer-events-none absolute inset-y-0 left-0 ml-3 flex items-center pr-2">
                  <ChevronDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </span>
              </div>

            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-20 mt-1 max-h-56 w-full overflow-auto border border-buttonColor rounded-md bg-neutral-900 py-1 text-base shadow-lg ring-1 focus:ring-none ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {variant.map((variant) => (
                  <Listbox.Option
                    key={variant.id}
                    className={({ active }) =>
                      classNames(
                        active ? 'bg-red text-white' : 'text-gray-900',
                        'relative cursor-default select-none py-2 pl-3 font-sans pr-3'
                      )
                    }
                    value={variant}
                  >
                    {({ selected, active }) => (
                      <>
                        <div className="flex items-center">

                          <span
                            className={classNames(selected ? 'font-semibold' : 'font-normal', 'mr-3 block truncate')}
                          >
                            {variant.name}
                          </span>
                        </div>
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  )
}