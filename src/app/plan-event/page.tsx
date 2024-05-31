"use client";

import Image from "next/image";
import toast from "react-hot-toast";
import { auth } from "@/app/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import React, { FC, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import {
  getUserByUserId,
  subscribeToUserProfile,
  updateUserProfileInDatabase,
} from "@/app/redux/features/auth/authThunk";
import PrimaryButton from "@/shared/Button/PrimaryButton";
import {
  createCategory,
  getCategoriesFromDB,
  getFood,
  getCars,
  getVenues,
  getPhotos,
  getCakes,
} from "../redux/features/categoryThunk";
import { Category } from "../models/Category";
import { Cake } from "../types/models";
import { storeOrder } from "../redux/features/order/orderThunk";
import * as Yup from "yup";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import Input from "@/shared/Input/Input";
import Select from "@/shared/Select/Select";
import Label from "@/components/Label/Label";

interface customerInfo {
  email: string;
  names: string;
  phone: string;
  address: string;
  gender: string;
}

const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

const signinSchema = Yup.object().shape({
  email: Yup.string()
    .email("Incorrect email format")
    .min(5, "Email should contain at least 5 characters")
    .max(50, "Email should not contain more than 50 characters")
    .required("Email is required")
    .matches(emailRegex, "Incorrect email format"),
  names: Yup.string()
    .min(3, " Name should contain at least 8 characters")
    .max(50, "Name should not contain more than 50 characters")
    .required("Your name is required"),
  address: Yup.string()
    .min(3, " Address should contain at least 8 characters")
    .max(50, "Address should not contain more than 50 characters")
    .required("Your Address is required"),
  gender: Yup.string()
    .min(3, " Gender should contain at least 8 characters")
    .max(50, "Gender should not contain more than 50 characters")
    .required("Your Gender is required"),
  phone: Yup.string()
    .min(8, " Phone should contain at least 8 characters")
    .max(50, "Phone should not contain more than 50 characters")
    .required("Your Phone is required"),
});

const AccountPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category>();
  const [selectedVenue, setSelectedVenue] = useState<Cake>();
  const [selectedCar, setSelectedCar] = useState<Cake>();
  const [selectedFood, setSelectedFood] = useState<Cake>();
  const [selectedCake, setSelectedCake] = useState<Cake>();
  const [selectedPhoto, setSelectedPhoto] = useState<Cake>();
  const [selectedPayment, setSelectedPayment] = useState<string>("");
  const [next, setNext] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("What are we planning today?");
  const [names, setNames] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');

  const dispatch = useAppDispatch();
  const { categories, cakes, cars, venues, food, photos } = useAppSelector(
    (state) => state.category
  );
  const user: customerInfo | null = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        await dispatch(getUserByUserId(user.uid));
        await dispatch(subscribeToUserProfile(user.uid));
      }
    });
    dispatch(getCategoriesFromDB());
    dispatch(getCakes());
    dispatch(getCars());
    dispatch(getFood());
    dispatch(getPhotos());
    dispatch(getVenues());
  }, [dispatch]);


  let totalPrice = 0;
  if (selectedVenue) {
    totalPrice += selectedVenue.price;
  }
  if (selectedCake) {
    totalPrice += selectedCake.price;
  }
  if (selectedCar) {
    totalPrice += selectedCar.price;
  }
  if (selectedPhoto) {
    totalPrice += selectedPhoto.price;
  }
  if (selectedFood) {
    totalPrice += selectedFood.price;
  }

  const handleSelect = (category: Category) => {
    setSelectedCategory(category);
    setNext("venues");
    setMessage("Choose your venue");
  };
  const handleVenueSelect = (venue: Cake) => {
    setSelectedVenue(venue);
    setNext("cars");
    setMessage("You may also need a car");
  };
  const handleCarSelect = (car: Cake) => {
    setSelectedCar(car);
    setNext("photos");
    setMessage("You may also need a photographer or videographer");
  };
  const handlePhotoSelect = (photo: Cake) => {
    setSelectedPhoto(photo);
    setNext("cakes");
    setMessage("Will you use a cake?");
  };
  const handleCakeSelect = (cake: Cake) => {
    setSelectedCake(cake);
    setNext("food");
    setMessage(
      "You may also need to share some food or drinks with your guests"
    );
  };
  const handleFoodSelect = (food: Cake) => {
    setSelectedFood(food);
    setNext("payment");
    setMessage("Select payment method");
  };
  const handlePaymentSelect = (method: string) => {
    setSelectedPayment(method);
    setNext("personalInfo");
    setMessage("Let us know more about you");
  };

  const handleSkip = (item: string) => {
    if (item === "cakes") {
      setNext("food");
      setMessage(
        "You may also need to share some food or drinks with your guests"
      );
    }
    if (item === "food") {
      setNext("photos");
      setMessage("You may also need a photographer or videographer");
    }
    if (item === "photos") {
      setNext("cars");
      setMessage("You may also need a car");
    }
    if (item === "cars") {
      setNext("venues");
      setMessage("Choose your venue");
    }
    if (item === "venues") {
      setNext("cakes");
      setMessage("Will you use a cake?");
    }
    if (item === "payment") {
      setNext("personalInfo");
      setMessage("Let us know more about you");
    }
  };

  
  const handleSubmit = async (
  ) => {
    try {
    
    setLoading(true);
    
      // Dispatch an action to update the user data in Redux
    const response = await dispatch(
        storeOrder({
          eventType: selectedCategory?.names,
          total: totalPrice,
          services: [
            selectedCake ? selectedCake : "",
            selectedCar ? selectedCar : "",
            selectedFood ? selectedFood : "",
            selectedPhoto ? selectedPhoto : "",
            selectedVenue ? selectedVenue : "",
          ],
          customerInfo:{
                address: user?.address || address,
                email: user?.email || email,
                gender: user?.gender || gender,
                names: user?.names || names,
                phone: user?.phone || phone,
              },
          payment: selectedPayment,
        })
      );
      setLoading(false);
      toast.success("Order placed successfully");
      // Redirect to a success page
      window.location.href = "/";
    } catch (error) {
      setLoading(false);
      toast.error("Error placing order");
    }
  };

  return (
    <div className="max-w-screen-xl mx-auto my-32">
      {/* <CategoriCreator /> */}
      <div className="flex gap-10 items-center">
        <h1 className="text-xl">{message}</h1>
        {selectedCategory && (
          <button
            className="text-lg text-neutral-500 border px-4 py-1 rounded-lg"
            onClick={() => handleSkip(next)}
          >
            Skip
          </button>
        )}
      </div>
      <div className="grid grid-cols-12 gap-4">
        <div
          className={`col-span-12 md:col-span-8 w-full h-fit p-4 flex gap-4 md:grid  ${
            next === "personalInfo" || next === "payment" && !user
              ? "md:grid-cols-1"
              : "md:grid-cols-4"
          }`}
        >
          {selectedCategory && next === "venues" ? (
            <>
              {venues &&
                venues.map((venue, index) => (
                  <div
                    key={index}
                    onClick={() => handleVenueSelect(venue)}
                    className="p-2 rounded-lg bg-grey  bg-opacity-50 cursor-pointer h-[100%]"
                  >
                    <div className="relative w-full h-48 ">
                      <Image
                        className="rounded-lg image-zoom object-cover"
                        src={venue.image}
                        alt={venue.title}
                        fill
                      />
                    </div>
                    <h2 className="font-semibold text-md text-neutral-700 dark:text-typo-light">
                      {venue.title}
                    </h2>
                    <h2 className="font-semibold text-md text-neutral-700 dark:text-typo-light">
                      {venue.price}Rwf
                    </h2>
                    <div className="text-sm text-neutral-500 dark:text-typo-light">
                      {venue.desc}
                    </div>
                  </div>
                ))}
            </>
          ) : selectedCategory && next === "cars" ? (
            <>
              {cars &&
                cars.map((car, index) => (
                  <div
                    key={index}
                    onClick={() => handleCarSelect(car)}
                    className="p-2 rounded-lg bg-grey  bg-opacity-50 cursor-pointer h-[100%]"
                  >
                    <div className="relative w-full h-48 ">
                      <Image
                        className="rounded-lg image-zoom object-cover"
                        src={car.image}
                        alt={car.title}
                        fill
                      />
                    </div>
                    <h2 className="font-semibold text-md text-neutral-700 dark:text-typo-light">
                      {car.title}
                    </h2>
                    <h2 className="font-semibold text-md text-neutral-700 dark:text-typo-light">
                      {car.price}Rwf
                    </h2>
                    <div className="text-sm text-neutral-500 dark:text-typo-light">
                      {car.desc}
                    </div>
                  </div>
                ))}
            </>
          ) : selectedCategory && next === "photos" ? (
            <>
              {photos &&
                photos.map((photo, index) => (
                  <div
                    key={index}
                    onClick={() => handlePhotoSelect(photo)}
                    className="p-2 rounded-lg bg-grey  bg-opacity-50 cursor-pointer h-[100%]"
                  >
                    <div className="relative w-full h-48 ">
                      <Image
                        className="rounded-lg image-zoom object-cover"
                        src={photo.image}
                        alt={photo.title}
                        fill
                      />
                    </div>
                    <h2 className="font-semibold text-md text-neutral-700 dark:text-typo-light">
                      {photo.title}
                    </h2>
                    <h2 className="font-semibold text-md text-neutral-700 dark:text-typo-light">
                      {photo.price}Rwf
                    </h2>
                    <div className="text-sm text-neutral-500 dark:text-typo-light">
                      {photo.desc}
                    </div>
                  </div>
                ))}
            </>
          ) : selectedCategory && next === "cakes" ? (
            <>
              {cakes &&
                cakes.map((cake, index) => (
                  <div
                    key={index}
                    onClick={() => handleCakeSelect(cake)}
                    className="p-2 rounded-lg bg-grey  bg-opacity-50 cursor-pointer h-[100%]"
                  >
                    <div className="relative w-full h-48 ">
                      <Image
                        className="rounded-lg image-zoom object-cover"
                        src={cake.image}
                        alt={cake.title}
                        fill
                      />
                    </div>
                    <h2 className="font-semibold text-md text-neutral-700 dark:text-typo-light">
                      {cake.title}
                    </h2>
                    <h2 className="font-semibold text-md text-neutral-700 dark:text-typo-light">
                      {cake.price}Rwf
                    </h2>
                    <div className="text-sm text-neutral-500 dark:text-typo-light">
                      {cake.desc}
                    </div>
                  </div>
                ))}
            </>
          ) : selectedCategory && next === "food" ? (
            <>
              {food &&
                food.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => handleFoodSelect(item)}
                    className="p-2 rounded-lg bg-grey  bg-opacity-50 cursor-pointer h-[100%]"
                  >
                    <div className="relative w-full h-48 ">
                      <Image
                        className="rounded-lg image-zoom object-cover"
                        src={item.image}
                        alt={item.title}
                        fill
                      />
                    </div>
                    <h2 className="font-semibold text-md text-neutral-700 dark:text-typo-light">
                      {item.title}
                    </h2>
                    <h2 className="font-semibold text-md text-neutral-700 dark:text-typo-light">
                      {item.price}Rwf
                    </h2>
                    <div className="text-sm text-neutral-500 dark:text-typo-light">
                      {item.desc}
                    </div>
                  </div>
                ))}
            </>
          ) : selectedCategory && next === "payment" ? (
            <div className="h-fit p-4 flex gap-4 md:grid md:grid-cols-1">
              {["MTN MOMO", "Paypal", "Bank Transfer", "Card", "CASH"].map((item, index) => (
              <div
              key={index}
                onClick={() => handlePaymentSelect(item)}
                className="p-4 rounded-lg bg-grey  bg-opacity-50 cursor-pointer h-[100%]"
              >
                <h2 className="font-semibold text-md text-neutral-400 dark:text-typo-light">
                  {item}
                </h2>
              </div>
              ))}
            </div>
          ) : selectedCategory && next === "personalInfo" && !user ? (
            <div className="w-[70%] mx-auto">
         <div className="flex-grow mt-10 md:mt-0 md:pl-16 max-w-3xl space-y-6">
            <div>
              <Label>Names</Label>
              <Input 
              className="mt-1.5 rounded-lg"
              value={names} onChange={(e) => setNames(e.target.value)}
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input 
              className="mt-1.5 rounded-lg"
              type="email"
              value={email} onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <Label>Phone</Label>
              <Input 
              className="mt-1.5 rounded-lg"
              type="text"
              value={phone} onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div>
              <Label>Address</Label>
              <Input 
              className="mt-1.5 rounded-lg"
              type="text"
              value={address} onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div>
              <Label>Gender</Label>
              <Input 
              className="mt-1.5 rounded-lg"
              type="text"
              value={gender} onChange={(e) => setGender(e.target.value)}
              />
            </div>
            </div>
            <div className="pt-2">
                <PrimaryButton 
                loading={loading}
                disabled={loading}
                fontSize="text-lg"
                className="rounded-lg bg-primaryBtnColor w-full md:w-fit text-typoPrimaryColor font-semibold"
                onClick={() => handleSubmit()}
                >
                {loading ? (
                "Submiting...") : ("Submit Order" )}</PrimaryButton>
            </div>
          </div>
          ) : 
           user && next === "personalInfo" && selectedCategory ? <div className="pt-2">
                <PrimaryButton 
                loading={loading}
                disabled={loading}
                fontSize="text-lg"
                className="rounded-lg bg-primaryBtnColor w-full md:w-fit text-typoPrimaryColor font-semibold"
                onClick={() => handleSubmit()}
                >
                {loading ? (
                "Submiting...") : ("Submit Order" )}</PrimaryButton>
            </div>:
  
            
          
          !selectedCategory ? (
            <>
              {categories &&
                categories.map((category, index) => (
                  <div
                    key={index}
                    onClick={() => handleSelect(category)}
                    className="p-2 rounded-lg bg-grey  bg-opacity-50 cursor-pointer h-[100%]"
                  >
                    <div className="relative w-full h-48 ">
                      <Image
                        className="rounded-lg image-zoom object-cover"
                        src={category.image}
                        alt={category.names}
                        fill
                      />
                    </div>
                    <h2 className="font-semibold text-md text-neutral-700 dark:text-typo-light">
                      {category.names}
                    </h2>
                    <div className="text-sm text-neutral-500 dark:text-typo-light">
                      {category.about}
                    </div>
                  </div>
                ))}
            </>
        ) : null}
        </div>

        <div className="col-span-12 md:col-span-4 h-fit rounded-lg shadow-lg flex flex-col gap-2">
          {selectedCategory && (
            <div className="col-span-12 md:col-span-4 w-full h-fit mt-4">
              <div className="p-2 rounded-lg bg-grey bg-opacity-30 pb-10">
                <div className="relative w-30 h-32 ">
                  <Image
                    className="rounded-lg image-zoom object-cover"
                    src={selectedCategory.image}
                    alt={selectedCategory.names}
                    fill
                  />
                </div>
                <h1 className="text-2xl p-4 pb-2">
                  Now planning for{" "}
                  <span className="font-bold text-primaryBtnColor">
                    {selectedCategory.names}
                  </span>
                </h1>
                <p className="pl-4 pb-3">{selectedCategory.about}</p>
                <p className="ml-4 border border-dashed  border-blue-500 border-opacity-20 bg-blue-700 bg-opacity-10 p-2 text-blue-600">
                  Keep choosing what you want for your event
                </p>
                {selectedVenue && (
                  <div className="flex ml-4 my-2 gap-4 bg-grey bg-opacity-50 rounded-lg p-2">
                    <Image
                      src={selectedVenue.image}
                      alt={selectedVenue.title}
                      className="rounded-lg image-zoom object-cover"
                      width={50}
                      height={50}
                    />
                    <div className="">
                      <h1 className="mb-2">{selectedVenue.title}</h1>
                      <p>{selectedVenue.price} Rwf</p>
                    </div>
                  </div>
                )}
                {selectedCar && (
                  <div className="flex ml-4 my-2 gap-4 bg-grey bg-opacity-50 rounded-lg p-2">
                    <Image
                      src={selectedCar.image}
                      alt={selectedCar.title}
                      className="rounded-lg image-zoom object-cover"
                      width={50}
                      height={50}
                    />
                    <div className="">
                      <h1 className="mb-2">{selectedCar.title}</h1>
                      <p>{selectedCar.price} Rwf</p>
                    </div>
                  </div>
                )}
                {selectedCake && (
                  <div className="flex ml-4 my-2 gap-4 bg-grey bg-opacity-50 rounded-lg p-2">
                    <Image
                      src={selectedCake.image}
                      alt={selectedCake.title}
                      className="rounded-lg image-zoom object-cover"
                      width={50}
                      height={50}
                    />
                    <div className="">
                      <h1 className="mb-2">{selectedCake.title}</h1>
                      <p>{selectedCake.price} Rwf</p>
                    </div>
                  </div>
                )}
                {selectedFood && (
                  <div className="flex ml-4 my-2 gap-4 bg-grey bg-opacity-50 rounded-lg p-2">
                    <Image
                      src={selectedFood.image}
                      alt={selectedFood.title}
                      className="rounded-lg image-zoom object-cover"
                      width={50}
                      height={50}
                    />
                    <div className="">
                      <h1 className="mb-2">{selectedFood.title}</h1>
                      <p>{selectedFood.price} Rwf</p>
                    </div>
                  </div>
                )}
                {selectedPhoto && (
                  <div className="flex ml-4 my-2 gap-4 bg-grey bg-opacity-50 rounded-lg p-2">
                    <Image
                      src={selectedPhoto.image}
                      alt={selectedPhoto.title}
                      className="rounded-lg image-zoom object-cover"
                      width={50}
                      height={50}
                    />
                    <div className="">
                      <h1 className="mb-2">{selectedPhoto.title}</h1>
                      <p>{selectedPhoto.price} Rwf</p>
                    </div>
                  </div>
                )}

                {selectedPayment ? (
                  <div className="flex justify-between items-center m-10">
                    <h2 className="font-semibold text-md text-neutral-700 dark:text-typo-light">
                      Payment Method :{selectedPayment}
                    </h2>
                  </div>
                ) : null}
                <h1 className="text-2xl p-4 ml-4 border-dashed mt-20 border-t-2 border-grey ">
                  Total: {totalPrice}
                </h1>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
