"use client"

import { Montserrat } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { UserButton, useAuth } from "@clerk/nextjs";

import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

const font = Montserrat({ subsets: ["latin"], weight: "600" });

const LandingNavbar = () => {
    const {isSignedIn} = useAuth();
    return ( 
        <nav className="p-4 bg-transparent flex items-center justify-between">
           <Link href="/" className="flex items-center">
           <div className="relative w-14 h-14 mr-1">
            <Image
            alt="logo"
            fill
            src="/logo.png"
            className="object-contain"
            />
           </div>
           <h1 className={cn("text-2xl font-bold text-white", font.className)}>Lot-AI</h1>
           </Link>
           <div className="flex items-center gap-x-2">
           {isSignedIn && <UserButton afterSignOutUrl="/" /> }
            <Link href={isSignedIn ? "/dashboard" : "/sign-up"}>
            <Button variant="outline" className="rounded-full">
                {isSignedIn ? "Dashboard" : "Get Started"}
            </Button>
            </Link>

           </div>
        </nav>
     );
}
 
export default LandingNavbar;