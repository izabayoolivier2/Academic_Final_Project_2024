"use client";

import { Fragment, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/20/solid'
import Image from 'next/image';
import productVariantImg2 from "@/images/products/v2.jpg";
import productVariantImg3 from "@/images/products/v3.jpg";
import productVariantImg4 from "@/images/products/v4.jpg";
import productVariantImg5 from "@/images/products/v5.jpg";
import productVariantImg6 from "@/images/products/v6.jpg";

const variant = [
  {
    id: 1,
    name: 'Wade Cooper',
    avatar: productVariantImg2,
  },
  {
    id: 2,
    name: 'Arlene Mccoy',
    avatar: productVariantImg3,
  },
  {
    id: 3,
    name: 'Devon Webb',
    avatar: productVariantImg4,
  },
  {
    id: 4,
    name: 'Tom Cook',
    avatar: productVariantImg5,
  },
  {
    id: 5,
    name: 'Tanya Fox',
    avatar: productVariantImg6,
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
          <div className="relative mt-3 md:w-[15rem] w-[10rem]">
            <Listbox.Button className="relative w-full flex justify-between items-center h-12 cursor-default rounded-md bg-transparent border border-buttonColor py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-none sm:text-sm sm:leading-6">
              <div>
                <span className="flex items-center right-0 inset-y-0 absolute mr-2">
                  <Image
                    width={80}
                    height={96}
                    src={selected.avatar}
                    alt=''
                    className="h-8 w-8 rounded-sm"
                  />
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
              <Listbox.Options className="absolute z-20 mt-1 max-h-56 w-full overflow-auto border border-buttonColor rounded-md bg-neutral-900 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {variant.map((variant) => (
                  <Listbox.Option
                    key={variant.id}
                    className={({ active }) =>
                      classNames(
                        active ? 'bg-red text-white' : 'text-gray-900',
                        'relative cursor-default select-none py-2 pl-3 pr-3'
                      )
                    }
                    value={variant}
                  >
                    {({ selected, active }) => (
                      <>
                        <div className="flex items-center">
                          <Image
                            width={80}
                            height={96}
                            src={variant.avatar}
                            alt=''
                            className="h-10 w-10 flex-shrink-0 rounded-sm"
                          />
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