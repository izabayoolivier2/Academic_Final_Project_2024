'use client';

import Image from "next/image";
import toast from "react-hot-toast";
import Input from "@/shared/Input/Input";
import Select from "@/shared/Select/Select";
import { auth } from "@/app/firebase/config";
import Label from "@/components/Label/Label";
import Avatar from "@/images/avatars/avatar.svg";
import Textarea from "@/shared/Textarea/Textarea";
import { onAuthStateChanged } from "firebase/auth";
import React, { FC, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { getUserByUserId, subscribeToUserProfile, updateUserProfileInDatabase } from "@/app/redux/features/auth/authThunk";
import PrimaryButton from "@/shared/Button/PrimaryButton";
import { createCategory } from "../redux/features/categoryThunk";

const AccountPage = () => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [desc, setDesc] = useState('');
  const [loading, setLoading] = useState(false);
  const [profilePicture, setProfilePicture] = useState('');

  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user)
  
  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        await dispatch(getUserByUserId(user.uid));
        await dispatch(subscribeToUserProfile(user.uid));
      }
    });
  }, [dispatch])

  const handleFormSubmit = () => {
    try {
      setLoading(true);
      
      // Dispatch an action to update the user data in Redux
      dispatch(createCategory({
        title,
        price: Number(price),
        desc,
        image: profilePicture !== '' ? profilePicture : ''
      }))
      .then(() => {
        setLoading(false);
        toast.success('Category created successfully');
      })
      .catch(() => {
        setLoading(false);
        toast.error('Error updating');
      });
      
    } catch (error) {
      toast.error('Error updating');
    }
  };
  
  const handleImageUpload = async (event: any) => {
    setLoading(true);
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', `${process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}`);

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setLoading(false);
        toast.success('Image uploaded successfully');
        const data = await response.json();
        setProfilePicture(data.secure_url);
      } else {
        toast.error('Error uploading picture');
      }
    } catch (error) {
      toast.error('Error uploading picture');
    }
  };

  return (
    <div className={`nc-AccountPage `}>
      <div className="space-y-10 sm:space-y-12">
        {/* HEADING */}
        <h2 className="text-2xl sm:text-3xl font-semibold">
          Register a service
        </h2>
        <div className="flex flex-col md:flex-row">
          <div className="flex-shrink-0 flex items-start">
            {/* AVATAR */}
            <div className="relative rounded-lg overflow-hidden flex">
              <Image
                src={profilePicture  || user?.profile_url || Avatar}
                alt="avatar"
                width={128}
                height={128}
                className="w-32 h-32 rounded-full object-cover z-0"
              />
              <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center text-neutral-50 cursor-pointer">
                <svg
                  width="30"
                  height="30"
                  viewBox="0 0 30 30"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17.5 5H7.5C6.83696 5 6.20107 5.26339 5.73223 5.73223C5.26339 6.20107 5 6.83696 5 7.5V20M5 20V22.5C5 23.163 5.26339 23.7989 5.73223 24.2678C6.20107 24.7366 6.83696 25 7.5 25H22.5C23.163 25 23.7989 24.7366 24.2678 24.2678C24.7366 23.7989 25 23.163 25 22.5V17.5M5 20L10.7325 14.2675C11.2013 13.7988 11.8371 13.5355 12.5 13.5355C13.1629 13.5355 13.7987 13.7988 14.2675 14.2675L17.5 17.5M25 12.5V17.5M25 17.5L23.0175 15.5175C22.5487 15.0488 21.9129 14.7855 21.25 14.7855C20.5871 14.7855 19.9513 15.0488 19.4825 15.5175L17.5 17.5M17.5 17.5L20 20M22.5 5H27.5M25 2.5V7.5M17.5 10H17.5125"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                <span className="mt-1 text-xs">{loading ? 'Uploading...' : 'Change Image'}</span>
              </div>
              <input
                type="file"
                onChange={handleImageUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
          </div>
          <div className="flex-grow mt-10 md:mt-0 md:pl-16 max-w-3xl space-y-6">
            <div>
              <Label>Title</Label>
              <Input 
              className="mt-1.5 rounded-lg"
              value={title} onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>
              <Label>Price</Label>
              <Input 
              className="mt-1.5 rounded-lg"
              type="number"
              value={price} onChange={(e) => setPrice(Number(e.target.value))}
              />
            </div>

            {/* ---- */}

            {/* ---- */}
            <div>
              <Label>Description</Label>
              <Textarea className="mt-1.5 rounded-lg"
              value={desc} onChange={(e) => setDesc(e.target.value)}
              />
            </div>
            <div className="pt-2">
                <PrimaryButton 
                loading={loading}
                disabled={loading}
                fontSize="text-lg"
                className="rounded-lg bg-primaryBtnColor w-full md:w-fit text-typoPrimaryColor font-semibold"
                onClick={() => handleFormSubmit()}
                >
                {loading ? (
                "Uploading...") : ("Upload" )}</PrimaryButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;

