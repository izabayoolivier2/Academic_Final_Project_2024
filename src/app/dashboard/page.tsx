"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  CircleUser,
  Menu,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import DashboardLayout from "./dashboardLayout";
import ProductsLayout from "./products/productsLayout";
import withAuth from  "../withAuth";
import { auth } from "../firebase/config";
import NavBar from "../ui/navBar";
const Dashboard = () => {
  const [currentUrl, setCurrentUrl] = React.useState("/dashboard");

  // Define an array of navigation links
  const navLinks = [
    { path: "/dashboard", text: "Dashboard" },
    { path: "/orders", text: "Orders" },
    { path: "/products", text: "Products" },
    { path: "/customers", text: "Customers" },
    { path: "/analytics", text: "Analytics" },
  ];

  return (
    <div className="flex min-h-screen w-full flex-col">
      {currentUrl === "/dashboard" ? (
        <DashboardLayout />
      ) : currentUrl === "/products" ? (
        <ProductsLayout />
      ) : (
        "404"
      )}
    </div>
  );
};

export default withAuth(Dashboard);
