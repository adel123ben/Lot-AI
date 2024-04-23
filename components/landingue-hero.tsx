"use client";

import TypeWriterComponent from "typewriter-effect";

import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "./ui/button";

const LandingHero = () => {
    const {isSignedIn} = useAuth();
    return ( 
        <div className="text-white font-bold py-36 text-center space-y-5">
           <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl space-y-5 font-extrabold">
            <h1>The Best AI Tool for</h1>
            <div className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                <TypeWriterComponent 
                options={{
                    strings: [
                        "chatBot.",
                        "Music Generator.",
                        "Image Generator.",
                        "Video Generator.",
                        "Code Generator.",
                    ],
                    autoStart: true,
                    loop: true
                }}
                />
            </div>
           </div>
           <div className="text-sm md:text-xl font-light text-zinc-400">
            Create your own content withe the power of AI 10x faster
           </div>
           <div>
            <Link href={isSignedIn ? "/dashboard" : "/sign-up"}>
            <Button variant="premium" className="md:text-lg p-4 md:p-6 rounded-full font-semibold">
                Start Generating Content For Free
            </Button>
            </Link>
           </div>
           <div className="text-xs text-zinc-400 md:text-sm font-normal">
            No credit card required !
           </div>
        </div>
     );
}
 
export default LandingHero;