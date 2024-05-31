"use client";
import React, { useState, useEffect } from "react";
import * as Yup from "yup";
import Link from "next/link";
import Image from "next/image";
import { auth } from "../firebase/config";
import { useRouter } from "next/navigation";
import googleSvg from "@/images/Google.svg";
import twitterSvg from "@/images/Twitter.svg";
import facebookSvg from "@/images/Facebook.svg";
import { onAuthStateChanged } from "@firebase/auth";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { Formik, Form, Field, FormikHelpers, ErrorMessage } from "formik";
import {
  emailPasswordLogin,
  emailPasswordRegistration,
  getUserByUserId,
} from "../redux/features/auth/authThunk";
import PrimaryButton from "@/shared/Button/PrimaryButton";

interface LoginFormValues {
  names: string;
  email: string;
  password: string;
}
const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

const signinSchema = Yup.object().shape({
  email: Yup.string()
    .email("Incorrect email format")
    .min(5, "Email should contain at least 5 characters")
    .max(50, "Email should not contain more than 50 characters")
    .required("Email is required")
    .matches(emailRegex, "Incorrect email format"),
  password: Yup.string()
    .min(8, " Password should contain at least 8 characters")
    .max(50, "Password should not contain more than 50 characters")
    .required("Password is required"),
  names: Yup.string()
    .min(3, " Name should contain at least 8 characters")
    .max(50, "Name should not contain more than 50 characters")
    .required("Your name is required"),
});

export default function PageRegister() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const initialValues: LoginFormValues = {
    names: "",
    email: "",
    password: "",
  };

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        dispatch(getUserByUserId(user.uid));
        return;
      }
    });
  }, [dispatch]);

  const handleSubmit = async (
    values: LoginFormValues,
    { setSubmitting }: FormikHelpers<LoginFormValues>
  ) => {
    try {
      setLoading(true);
      const res = await dispatch(emailPasswordRegistration(values));
      if (!res) {
        setLoading(false);
        return;
      }
      if (res.payload == undefined) {
        setLoading(false);
        router.push("/login");
        return;
      }
      router.push("/login");
      setLoading(false);
    } catch (error: any) {
      console.error("Login error:", error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`nc-PageLogin`} data-nc-id="PageLogin">
      <div className="container mb-24 lg:mb-32">
        <h2 className="mt-40 mb-6 flex items-center text-lg leading-[115%] md:text-5xl md:leading-[115%] font-semibold text-neutral-900 dark:text-neutral-100 justify-center">
          Sign Up
        </h2>
        <div className="max-w-md mx-auto space-y-6">
          {/* OR */}
          {/* FORM */}
          <Formik
            initialValues={initialValues}
            validationSchema={signinSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched }) => (
              <Form>
                <div className="mb-4">
                  <label
                    htmlFor="email"
                    className="block text-darkGray4 font-regular text-xs md:text-lg mb-2"
                  >
                    Full name
                  </label>
                  <Field
                    type="text"
                    id="names"
                    name="names"
                    placeholder="Enter your full name"
                    className={`w-full px-4 py-2 md:py-3 rounded-lg border ${
                      errors.names && touched.names
                        ? " border-red-500"
                        : "dark:border-slate-600 border-slate-300"
                    }   text-neutral-800 dark:text-neutral-200  placeholder-placeholder bg-transparent focus:ring-blue-500 focus:border-blue-500`}
                  />
                  <ErrorMessage
                    name="names"
                    component="div"
                    className="text-red text-xs md:text-lg"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="email"
                    className="block text-darkGray4 font-regular text-xs md:text-lg mb-2"
                  >
                    Email
                  </label>
                  <Field
                    type="email"
                    id="email"
                    name="email"
                    placeholder="exemple@email.com"
                    className={`w-full px-4 py-2 md:py-3 rounded-lg border ${
                      errors.email && touched.email
                        ? " border-red-500"
                        : "dark:border-slate-600 border-slate-300"
                    }   text-neutral-800 dark:text-neutral-200  placeholder-placeholder bg-transparent focus:ring-blue-500 focus:border-blue-500`}
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red text-xs md:text-lg"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="password"
                    className="block text-darkGray4 font-regular text-xs md:text-lg mb-2"
                  >
                    Password
                  </label>
                  <Field
                    type="password"
                    id="password"
                    name="password"
                    placeholder="********"
                    className={`w-full px-4 py-2 md:py-4 rounded-lg border ${
                      errors.password && touched.password
                        ? "border-red-500"
                        : "dark:border-slate-600 border-slate-300"
                    } text-neutral-800 dark:text-neutral-200  placeholder-placeholder bg-transparent focus:ring-blue-500 focus:border-blue-500`}
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red text-xs md:text-lg"
                  />
                </div>
                <PrimaryButton
                  className="w-full rounded-lg bg-primaryBtnColor"
                  type="submit"
                >
                  {loading ? "Loading..." : "Continue"}
                </PrimaryButton>
              </Form>
            )}
          </Formik>

          {/* ==== */}
          <span className="block text-center text-neutral-700 dark:text-neutral-300">
            New user? {` `}
            <Link className="text-green-600" href="/login">
              Sign In
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}
