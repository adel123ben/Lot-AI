
import { increaseApiLimit, checkApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";

import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import Replicate from "replicate";



const replicate = new Replicate({
    auth: process.env.REPLICATE_API_KEY
})

export async function POST(request: Request) {
    try{
        const {userId} = auth();
        const body = await request.json();
        const {prompt} = body;
        if(!userId){
            return new NextResponse("Unauthorized", { status: 401 })
        }
        if(!prompt){
            return new NextResponse("Please add prompt", { status: 500 })
        }

        const freeTrial = await checkApiLimit();
        const isPro = await checkSubscription();
        if(!freeTrial && !isPro){
            return new NextResponse("Free trial has expired", { status: 403 })
        }

        const response = await replicate.run("anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351", { input: {
            prompt: prompt
        } });
        console.log(response)

        

        if(!isPro){
            await increaseApiLimit();
        }

        return NextResponse.json(response); // Modification ici
    }catch(error){
        console.log("[VIDEO-ERROR]", error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}
