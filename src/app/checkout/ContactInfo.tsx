import Label from "@/components/Label/Label";
import React, { FC, useEffect, useState } from "react";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import ButtonSecondary from "@/shared/Button/ButtonSecondary";
import Checkbox from "@/shared/Checkbox/Checkbox";
import Input from "@/shared/Input/Input";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { getUserByUserId, subscribeToUserProfile, updateUserProfileInDatabase } from "../redux/features/auth/authThunk";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/config";
import { useRouter } from "next/navigation";

interface Props {
  isActive: boolean;
  onOpenActive: () => void;
  onCloseActive: () => void;
}

const ContactInfo: FC<Props> = ({ isActive, onCloseActive, onOpenActive }) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user)
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [userData, setUserData] = useState({
    phone: '',
    email: '',
    names: '',
    receiveNews: true,
  });

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        await dispatch(subscribeToUserProfile(user.uid));
        await dispatch(getUserByUserId(user.uid));
      }
    });
  }, [dispatch])

  useEffect(() => {
    // Populate the form fields with user data from Redux
    if (user) {
      setUserData({
        phone: user.phone || '',
        email: user.email || '',
        names: user.names || '',
        receiveNews: user.receiveNews || true,
      });
    }
  }, [user]);

  const handleSave = () => {
    setLoading(true);
    // Update the Firestore user document with the new data
    if (user) {
      try {
        // Dispatch an action to update the user data in Redux
        dispatch(updateUserProfileInDatabase(userData))
          .then(() => {
            onCloseActive()
            setLoading(false);
            router.push('/checkout');
          })
          .catch((error) => {
            setLoading(false);
            console.error('Error updating profile:', error);
          });

      } catch (error) {
        setLoading(false);
        console.error('Error updating user data:', error);
      }
    }
  };
  const handleInputChange = (name: string, value: boolean | string) => {
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const renderAccount = () => {
    return (
      <div className="border border-slate-200 dark:border-primary-buttonPrimary rounded-xl overflow-hidden z-0">
        <div className="flex flex-col sm:flex-row items-start p-6 ">
          <span className="hidden sm:block">
            <svg
              className="w-6 h-6 text-slate-700 dark:text-neutral-200 mt-0.5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.12 12.78C12.05 12.77 11.96 12.77 11.88 12.78C10.12 12.72 8.71997 11.28 8.71997 9.50998C8.71997 7.69998 10.18 6.22998 12 6.22998C13.81 6.22998 15.28 7.69998 15.28 9.50998C15.27 11.28 13.88 12.72 12.12 12.78Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M18.74 19.3801C16.96 21.0101 14.6 22.0001 12 22.0001C9.40001 22.0001 7.04001 21.0101 5.26001 19.3801C5.36001 18.4401 5.96001 17.5201 7.03001 16.8001C9.77001 14.9801 14.25 14.9801 16.97 16.8001C18.04 17.5201 18.64 18.4401 18.74 19.3801Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <div className="sm:mr-8">
            <h3 className=" text-slate-700 dark:text-typoPrimaryColor flex ">
              <span className="uppercase tracking-tight">CONTACT INFO</span>
              <svg
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2.5"
                stroke="currentColor"
                className="w-5 h-5 mr-3 text-slate-900 dark:text-slate-100 "
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12.75l6 6 9-13.5"
                />
              </svg>
            </h3>
            {user &&
              user.names !== undefined && (
                <div className="font-semibold mt-1 text-sm">
                  <span className="">{user.names}</span>
                  <span className="ml-3 tracking-tighter">{user.email}</span>
                  <span className="ml-3 tracking-tighter">{user.phone}</span>
                </div>
              )}
          </div>
          <button
            className="py-2 px-4 bg-slate-50 hover:bg-slate-100 dark:bg-primary-buttonPrimary dark:hover:bg-primary-buttonHoverPrimary dark:text-typoPrimaryColor mt-5 sm:mt-0 sm:mr-auto text-sm font-medium rounded-lg"
            onClick={() => onOpenActive()}
          >
            Change
          </button>
        </div>
        <div
          className={`border-t border-slate-200 dark:border-primary-buttonPrimary px-6 py-7 space-y-4 sm:space-y-6 ${isActive ? "block" : "hidden"
            }`}
        >
          <div className="flex justify-between flex-wrap items-baseline">
            <h3 className="text-lg font-semibold">Contact infomation</h3>
            <span className="block text-sm my-1 md:my-0">
              Do not have an account?{` `}
              <a href="/login" className="text-primary-500 font-medium">
                Log in
              </a>
            </span>
          </div>
          <div className="max-w-lg">
            <Label className="text-sm">Your phone number</Label>
            <Input
              className="mt-1.5"
              type={"tel"}
              name="phone"
              value={userData?.phone || '+00000000'}
              onChange={(e) => handleInputChange("phone", e.target.value)}
            />
          </div>
          <div className="max-w-lg">
            <Label className="text-sm">Email address</Label>
            <Input
              className="mt-1.5"
              type={"email"}
              name="email"
              value={userData?.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
            />
          </div>
          <div className="max-w-lg">
            <Label className="text-sm">Email address</Label>
            <Input
              className="mt-1.5"
              type={"text"}
              name="names"
              value={userData?.names}
              onChange={(e) => handleInputChange("names", e.target.value)}
            />
          </div>
          <div>
            <Checkbox
              className="!text-sm"
              name="receiveNews"
              label="Email me news and offers"
              defaultChecked={userData?.receiveNews}
              onChange={(checked) => handleInputChange("receiveNews", checked)}
            />
          </div>

          {/* ============ */}
          <div className="flex flex-col sm:flex-row pt-6">
            <ButtonPrimary
              className="sm:!px-7 shadow-none"
              onClick={() => handleSave()}
            >
              {loading ? "Saving..." : 'Save and next to Shipping'}
            </ButtonPrimary>
            <ButtonSecondary
              className="mt-3 sm:mt-0 sm:ml-3"
              onClick={() => onCloseActive()}
            >
              Cancel
            </ButtonSecondary>
          </div>
        </div>
      </div>
    );
  };

  return renderAccount();
};

export default ContactInfo;
