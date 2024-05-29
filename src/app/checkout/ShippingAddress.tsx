"use client";

import * as Yup from "yup";
import { auth } from "../firebase/config";
import Label from "@/components/Label/Label";
import React, { FC, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import ButtonSecondary from "@/shared/Button/ButtonSecondary";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { getUserByUserId } from "../redux/features/auth/authThunk";
import {
  createUserAddress,
  subscribeToUserAddress,
} from "../redux/features/address/shippingAddressThunk";
import { Formik, Form, Field, FormikHelpers, ErrorMessage } from "formik";
import ShippingAddressModel from "../models/Address";
import PrimaryButton from "@/shared/Button/PrimaryButton";
import logoImg from "@/images/logo.png";
import Image from "next/image";
import { Switch } from "@/app/headlessui";
import { useThemeMode } from "@/hooks/useThemeMode";
interface Props {
  isActive: boolean;
  onOpenActive: () => void;
  onCloseActive: () => void;
}

const ShippingAddress: FC<Props> = ({
  isActive,
  onOpenActive,
  onCloseActive,
}) => {
  const [addressData, setAddressData] = React.useState({});
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const address = useAppSelector((state) => state.shippingAddress.address);
  const [enabled, setEnabled] = useState(false);
  // Create a Yup validation schema
  const validationSchema = Yup.object().shape({
    city: Yup.string()
      .min(3, "Minimum 3 characters")
      .required("City is required"),
    address: Yup.string()
      .required("Address is required")
      .min(3, "Minimum 3 characters"),
    country: Yup.string(),
    apartment: Yup.string()
      .min(3, "Minimum 3 characters")
      .required("Apartment is required")
      .max(50, "Maximum 50 characters"),
    province: Yup.string()
      .min(3, "Minimum 3 characters")
      .required("Province is required")
      .max(50, "Maximum 50 characters"),
    postalCode: Yup.string()
      .min(3, "Minimum 3 characters")
      .required("Postal code is required")
      .max(50, "Maximum 50 characters"),
    district: Yup.string()
      .min(3, "Minimum 3 characters")
      .required("District is required")
      .max(50, "Maximum 50 characters"),
    street: Yup.string()
      .min(3, "Minimum 3 characters")
      .required("Street is required")
      .max(50, "Maximum 50 characters"),
    house: Yup.string()
      .min(3, "Minimum 3 characters")
      .required("Description of the house is required")
      .max(50, "Maximum 50 characters"),
    addressType: Yup.string(),
  });

  // Initialize Formik with initial values and validation schema
  const initialValues: ShippingAddressModel = {
    address: "",
    apartment: "",
    owner: "",
    city: "",
    country: "",
    province: "",
    postalCode: "",
    addressType: "home",
    district: "",
    street: "",
    house: "",
  };

  useEffect(() => {
    if (address) {
      setAddressData(address);
    }
  }, [address]);

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        await dispatch(subscribeToUserAddress(user.uid));
        await dispatch(getUserByUserId(user.uid));
      }
    });
  }, [dispatch]);

  const handleSave = async (
    values: ShippingAddressModel,
    { setSubmitting }: FormikHelpers<ShippingAddressModel>
  ) => {
    if (user) {
      await dispatch(createUserAddress({ ...values, owner: user.uid }))
        .then((address) => {
          onCloseActive();
        })
        .catch((error) => {
          console.error("Error saving address:", error);
        });
    }
  };
  const renderShippingAddress = () => {
    return (
      <div className="border border-slate-200 dark:border-primary-buttonPrimary rounded-xl ">
        <div className="md:p-6 px-2 py-6 flex  items-center ">
          <Image
            className="h-5 sm:h-6 w-auto"
            src={logoImg}
            alt="Logo-Light"
            sizes="200px"
            priority
          />
          <div className="bg-buttonColor px-[1px] py-6 mr-2"></div>
          <div className="mr-3">
            <h3 className=" text-white dark:text-typoPrimaryColor flex ">
              <span className="uppercase ">Contact Information</span>
            </h3>
            {address ? (
              <div className="font-semibold mt-1 text-lg  dark:text-typoPrimaryColor">
                <span className="">
                  {`${address?.address}, ${address?.apartment}, ${address?.city}, ${address?.country}, ${address?.province}, ${address?.postalCode}`}
                </span>
              </div>
            ) : (
              <></>
            )}
            <span className="font-medium text-typoSecondaryColor flex items-center">
              <span className="md:text-lg text-xs dark:text-buttonColor dark:hover:text-red hover:text-red cursor-pointer">
                POWR eSports
              </span>
              <span className="md:mx-3 mx-1 dark:text-buttonColor md:text-lg text-xs">
                {">"}
              </span>
              <span className="md:text-lg text-xs dark:text-buttonColor dark:hover:text-red hover:text-red cursor-pointer">
                سلة المشتريات
              </span>
              <span className="md:mx-3 mx-1 text-buttonColor">{">"}</span>
              <span className="cursor-pointer md:text-lg text-xs">
                إنهاء الطلب
              </span>
            </span>
          </div>
        </div>
        <div
          className={`border-t border-slate-200 dark:border-primary-buttonPrimary px-6 py-7 space-y-4 sm:space-y-6 ${
            isActive ? "block" : "hidden"
          }`}
        >
          {/* ============ */}
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSave}
          >
            {({ errors, touched }) => (
              <Form>
                {/* ============divider ===================== */}
                <div className="mb-8 flex w-full justify-between items-center">
                  <div className="flex md:w-[30%] w-[80%]">
                    <div className="bg-red w-6 h-6 rounded-full flex justify-center items-center">
                      <p className="text-gray-700">1</p>
                    </div>
                    <div>
                      <Image
                        unoptimized={false}
                        width={60}
                        height={60}
                        className=" h-5 sm:h-6  text-red"
                        src="https://cdn.assets.salla.network/stores/vendor/checkout/images/icons/step-shipping.svg"
                        alt="Logo-Light"
                        sizes="20px"
                        priority
                      />
                    </div>
                    <div className="md:text-lg text-xs ">الشحن والتوصيل</div>
                  </div>
                  <div className="md:w-[80%] w-[25%]">
                    <div className="bg-buttonColor px-6 py-[1px] mr-2"></div>
                  </div>
                </div>
                <Label className="md:text-lg text-sm  dark:text-typoPrimaryColor ">
                  عنوان التوصيل
                </Label>

                {/* ============ City and country ==========  */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-3 mb-6 mt-8">
                  <div>
                    <Label className="md:text-lg text-sm  dark:text-typoPrimaryColor">
                      اختر الدولة
                    </Label>
                    <Field
                      as="select"
                      className="mt-1.5 nc-Select block w-full md:text-lg text-sm  dark:text-typoPrimaryColor rounded-sm border-neutral-200 focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 bg-white dark:border-primary-buttonPrimary dark:focus:ring-buttonColor dark:focus:ring-opacity-25 dark:bg-neutral-900"
                      name="country"
                      id="country"
                    >
                      <option value="United States">United States</option>
                      <option value="Rwanda">Rwanda</option>
                      <option value="Mexico">Mexico</option>
                      <option value="Israel">Israel</option>
                      <option value="France">France</option>
                      <option value="England">England</option>
                      <option value="Laos">Laos</option>
                      <option value="China">China</option>
                    </Field>
                  </div>
                  <div>
                    <Label className="md:text-lg text-sm  dark:text-typoPrimaryColor">
                      اختر المدينة
                    </Label>
                    <Field
                      as="select"
                      className="mt-1.5 nc-Select block w-full md:text-lg text-sm   dark:text-typoPrimaryColor rounded-sm border-neutral-200 focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 bg-white dark:border-primary-buttonPrimary dark:focus:ring-buttonColor dark:focus:ring-opacity-25 dark:bg-neutral-900"
                      name="city"
                      id="city"
                    >
                      <option value="United States">United States</option>
                      <option value="Rwanda">Rwanda</option>
                      <option value="Mexico">Mexico</option>
                      <option value="Israel">Israel</option>
                      <option value="France">France</option>
                      <option value="England">England</option>
                      <option value="Laos">Laos</option>
                      <option value="China">China</option>
                    </Field>
                  </div>
                </div>

                {/* ============ District and street ==========  */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-3">
                  <div className="mb-4">
                    <Label className="md:text-lg text-sm dark:text-typoPrimaryColor">
                      الحي
                    </Label>
                    <Field
                      className={`mt-1.5 block placeholder-typoSecondaryColor w-full border rounded-sm bg-white   dark:focus:ring-buttonColor dark:bg-neutral-900 disabled:bg-neutral-200 dark:disabled:bg-neutral-800 ${
                        errors.province && touched.province
                          ? "border-red-500"
                          : "dark:border-primary-buttonPrimary border-neutral-200"
                      }`}
                      name="district"
                      type="text"
                      id="district"
                      placeholder="district"
                    />
                    <ErrorMessage
                      name="district"
                      component="div"
                      className="text-red text-xs md:text-lg"
                    />
                  </div>
                  <div>
                    <Label className="md:text-lg text-sm dark:text-typoPrimaryColor">
                      الشارع
                    </Label>
                    <Field
                      className={`mt-1.5 block placeholder-typoSecondaryColor w-full border rounded-sm bg-white   dark:focus:ring-buttonColor dark:bg-neutral-900 disabled:bg-neutral-200 dark:disabled:bg-neutral-800 ${
                        errors.postalCode && touched.postalCode
                          ? "border-red-500"
                          : "dark:border-primary-buttonPrimary border-neutral-200"
                      }`}
                      name="street"
                      id="street"
                      placeholder="district"
                    />
                    <ErrorMessage
                      name="street"
                      component="div"
                      className="text-red text-xs md:text-lg"
                    />
                  </div>
                </div>

                {/* ============ Postal code and description of the house ==========  */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-3 mb-6">
                  <div className="mb-4">
                    <Label className="md:text-lg text-sm dark:text-typoPrimaryColor">
                      وصف البيت
                    </Label>
                    <Field
                      className={`mt-1.5 block w-full placeholder-typoSecondaryColor border rounded-sm bg-white dark:focus:ring-buttonColor dark:bg-neutral-900 disabled:bg-neutral-200 dark:disabled:bg-neutral-800 ${
                        errors.province && touched.province
                          ? "border-red-500"
                          : "dark:border-primary-buttonPrimary border-neutral-200"
                      }`}
                      name="house"
                      type="text"
                      id="house"
                      placeholder="house"
                    />
                    <ErrorMessage
                      name="house"
                      component="div"
                      className="text-red text-xs md:text-lg"
                    />
                  </div>
                  <div>
                    <Label className="md:text-lg text-sm dark:text-typoPrimaryColor">
                      الرمز البريدي
                    </Label>
                    <Field
                      className={`mt-1.5 block w-full placeholder-typoSecondaryColor border rounded-sm bg-white   dark:focus:ring-buttonColor dark:bg-neutral-900 disabled:bg-neutral-200 dark:disabled:bg-neutral-800 ${
                        errors.postalCode && touched.postalCode
                          ? "border-red-500"
                          : "dark:border-primary-buttonPrimary border-neutral-200"
                      }`}
                      name="postalCode"
                      placeholder="postalCode"
                    />
                    <ErrorMessage
                      name="postalCode"
                      component="div"
                      className="text-red text-xs md:text-lg"
                    />
                  </div>
                </div>

                {/* ============switch payment ========== */}
                <div className="flex" onClick={() => setEnabled}>
                  <Switch
                    dir="ltr"
                    checked={enabled}
                    onChange={setEnabled}
                    className={`${enabled ? "bg-red" : "bg-teal-600"}
                  relative inline-flex h-[22px] w-[42px] shrink-0 cursor-pointer rounded-full border-4 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                  >
                    <span
                      aria-hidden="true"
                      className={`${enabled ? "translate-x-5" : "translate-x-0"}
                    pointer-events-none inline-block h-[14px] w-[14px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                    />
                  </Switch>
                  <div>
                    <span className="dark:text-typoPrimaryColor mr-2">
                      استلام الطلب عبر شخص آخر ؟
                    </span>
                  </div>
                </div>

                {/* ============= card payment ============  */}
                <div
                  className={`p-4 dark:bg-buttonColor bg-[#f9f9f9] mt-2 rounded-sm ${
                    enabled ? "block" : "hidden"
                  }`}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-1 gap-4 sm:gap-3 mb-6">
                    <div>
                      <Label className="md:text-lg text-sm dark:text-typoPrimaryColor">
                        اسم المستلم
                      </Label>
                      <Field
                        className={`mt-1.5 block w-full placeholder-typoSecondaryColor border rounded-sm bg-white   dark:focus:ring-buttonColor dark:bg-neutral-900 disabled:bg-neutral-200 dark:disabled:bg-neutral-800 ${
                          errors.postalCode && touched.postalCode
                            ? "border-red-500"
                            : "dark:border-primary-buttonPrimary border-neutral-200"
                        }`}
                        name="postalCode"
                        placeholder="postalCode"
                      />
                      <ErrorMessage
                        name="postalCode"
                        component="div"
                        className="text-red text-xs md:text-lg"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-3 mb-6">
                    <div className="mb-4">
                      <Label className="md:text-lg text-sm  dark:text-typoPrimaryColor">
                        وصف البيت
                      </Label>
                      <Field
                        className={`mt-1.5 block w-full border placeholder-typoSecondaryColor rounded-sm bg-white dark:focus:ring-buttonColor dark:bg-neutral-900 disabled:bg-neutral-200 dark:disabled:bg-neutral-800 ${
                          errors.province && touched.province
                            ? "border-red-500"
                            : "dark:border-primary-buttonPrimary border-neutral-200"
                        }`}
                        name="house"
                        type="text"
                        id="house"
                        placeholder="house"
                      />
                      <ErrorMessage
                        name="house"
                        component="div"
                        className="text-red text-xs md:text-lg"
                      />
                    </div>
                    <div>
                      <Label className="md:text-lg text-sm dark:text-typoPrimaryColor">
                        الرمز البريدي
                      </Label>
                      <Field
                        className={`mt-1.5 block w-full placeholder-typoSecondaryColor border rounded-sm bg-white   dark:focus:ring-buttonColor dark:bg-neutral-900 disabled:bg-neutral-200 dark:disabled:bg-neutral-800 ${
                          errors.postalCode && touched.postalCode
                            ? "border-red-500"
                            : "dark:border-primary-buttonPrimary border-neutral-200"
                        }`}
                        name="postalCode"
                      />
                      <ErrorMessage
                        name="postalCode"
                        component="div"
                        className="text-red text-xs md:text-lg"
                      />
                    </div>
                  </div>
                  <div className="flex" onClick={() => setEnabled}>
                    <Switch
                      dir="ltr"
                      checked={enabled}
                      onChange={setEnabled}
                      className={`${enabled ? "bg-red" : "bg-teal-600"}
                  relative inline-flex h-[22px] w-[42px] shrink-0 cursor-pointer rounded-full border-4 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                    >
                      <span
                        aria-hidden="true"
                        className={`${
                          enabled ? "translate-x-5" : "translate-x-0"
                        }
                    pointer-events-none inline-block h-[14px] md:text-lg text-sm w-[14px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                      />
                    </Switch>
                    <div>
                      <span className="dark:text-typoPrimaryColor mr-2 md:text-lg text-sm">
                        استلام الطلب عبر شخص آخر ؟
                      </span>
                    </div>
                  </div>
                </div>

                {/* ============= choose company ============ */}
                <div className="mt-3">
                  <span className="dark:text-typoPrimaryColor md:text-lg text-sm">
                    اختر شركة الشحن
                  </span>
                  <div className="flex justify-center items-center py-2 dark:bg-buttonColor mt-3 px-2 bg-[#d1ecf1]">
                    <span className="dark:text-typoPrimaryColor md:text-lg text-sm flex text-center text-[#0c5460]">
                      الرجاء تحديد العنوان لعرض خيارات الشحن والتوصيل المتوفرة
                      لك.
                    </span>
                  </div>
                </div>

                {/* =============divider ========= */}
                <div className="my-8 flex w-full justify-between items-center">
                  <div className="flex md:w-[30%] w-[80%]">
                    <div className="bg-red w-6 h-6 rounded-full flex justify-center items-center">
                      <p className="text-gray-700">2</p>
                    </div>
                    <div>
                      <Image
                        unoptimized={false}
                        width={60}
                        height={60}
                        className=" h-5 sm:h-6 "
                        src="https://cdn.assets.salla.network/stores/vendor/checkout/images/icons/step-shipping.svg"
                        alt="Logo-Light"
                        sizes="20px"
                        priority
                      />
                    </div>
                    <div className="md:text-lg text-xs">طريقة الدفع</div>
                  </div>
                  <div className="md:w-[76%] w-[24%]">
                    <div className="bg-buttonColor px-6 py-[1px] mr-2"></div>
                  </div>
                </div>

                {/* ===============Payment Method =============== */}
                <div className="border-buttonColor border-r-2 border-dashed mr-2 pt-4">
                  <div className="mr-6">
                    <div className="grid md:grid-cols-4 grid-cols-2 gap-4 justify-center items-center">
                      <div className="bg-white px-10 py-4 flex justify-center items-center">
                        <Image
                          unoptimized={false}
                          width={60}
                          height={60}
                          className="hidden h-5 sm:h-6 dark:block text-white"
                          src="https://cdn.assets.salla.network/stores/vendor/checkout/images/icons/tamara/ar-tamara-label.svg"
                          alt="Logo-Light"
                          sizes="20px"
                          priority
                        />
                      </div>
                      <div className="bg-white px-10 py-4 flex justify-center items-center">
                        <Image
                          unoptimized={false}
                          width={60}
                          height={60}
                          className="hidden h-5 sm:h-6 dark:block text-white"
                          src="https://cdn.assets.salla.network/stores/vendor/checkout/images/icons/pay-option-stcpay.svg"
                          alt="Logo-Light"
                          sizes="20px"
                          priority
                        />
                      </div>
                      <div className="bg-white px-10 py-4 flex justify-center items-center">
                        <Image
                          unoptimized={false}
                          width={60}
                          height={60}
                          className="hidden h-5 sm:h-6 dark:block text-white"
                          src="https://cdn.assets.salla.network/stores/vendor/checkout/images/icons/pay-option-credit-2.svg"
                          alt="Logo-Light"
                          sizes="20px"
                          priority
                        />
                      </div>
                      <div className="bg-white px-10 py-4 flex justify-center items-center">
                        <Image
                          unoptimized={false}
                          width={60}
                          height={60}
                          className="hidden h-5 sm:h-6 dark:block text-white"
                          src="https://cdn.assets.salla.network/stores/vendor/checkout/images/icons/pay-option-mada.svg"
                          alt="Logo-Light"
                          sizes="20px"
                          priority
                        />
                      </div>
                    </div>
                    <div>
                      <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSave}
                      >
                        {({ errors, touched }) => (
                          <Form>
                            <div className="grid mt-4 grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-3 justify-center items-center">
                              <div className="w-full">
                                <Field
                                  className={`block w-full border placeholder-typoSecondaryColor rounded-sm bg-white   dark:focus:ring-buttonColor dark:bg-neutral-900 disabled:bg-neutral-200 dark:disabled:bg-neutral-800 ${
                                    errors.postalCode && touched.postalCode
                                      ? "border-red-500"
                                      : "dark:border-primary-buttonPrimary border-neutral-200"
                                  }`}
                                  name="street"
                                  id="street"
                                  placeholder="street"
                                />
                                <ErrorMessage
                                  name="street"
                                  component="div"
                                  className="text-red text-xs md:text-lg"
                                />
                              </div>
                              <div className="grid md:grid-cols-2 grid-cols-2 gap-4 justify-center items-center">
                                <div>
                                  <Field
                                    className={`block w-full border placeholder-typoSecondaryColor rounded-sm bg-white   dark:focus:ring-buttonColor dark:bg-neutral-900 disabled:bg-neutral-200 dark:disabled:bg-neutral-800 ${
                                      errors.postalCode && touched.postalCode
                                        ? "border-red-500"
                                        : "dark:border-primary-buttonPrimary border-neutral-200"
                                    }`}
                                    name="street"
                                    id="street"
                                    placeholder="street"
                                  />
                                  <ErrorMessage
                                    name="street"
                                    component="div"
                                    className="text-red text-xs md:text-lg"
                                  />
                                </div>
                                <div>
                                  <Field
                                    className={`block w-full border placeholder-typoSecondaryColor rounded-sm bg-white   dark:focus:ring-buttonColor dark:bg-neutral-900 disabled:bg-neutral-200 dark:disabled:bg-neutral-800 ${
                                      errors.postalCode && touched.postalCode
                                        ? "border-red-500"
                                        : "dark:border-primary-buttonPrimary border-neutral-200"
                                    }`}
                                    name="street"
                                    id="street"
                                    placeholder="street"
                                  />
                                  <ErrorMessage
                                    name="street"
                                    component="div"
                                    className="text-red text-xs md:text-lg"
                                  />
                                </div>
                              </div>
                            </div>
                          </Form>
                        )}
                      </Formik>
                      <div></div>
                      <div></div>
                    </div>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    );
  };
  return renderShippingAddress();
};

export default ShippingAddress;
