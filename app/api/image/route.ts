
import { increaseApiLimit, checkApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";

import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import Configuration from "openai";
import  OpenAIApi  from "openai";


const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
})

const openai = new OpenAIApi(configuration as any);

export async function POST(request: Request) {
    try{
        const {userId} = auth();
        const body = await request.json();
        const {prompt, amount = 1, resolution = "512x512"} = body;
        if(!userId){
            return new NextResponse("Unauthorized", { status: 401 })
        }
        if(!configuration.apiKey){
            return new NextResponse("OpenAI API key not configured", { status: 500 })
        }
        if(!prompt){
            return new NextResponse("Please add prompt", { status: 500 })
        }
        if(!amount){
            return new NextResponse("Please add amount", { status: 500 })
        }
        if(!resolution){
            return new NextResponse("Please add resolution", { status: 500 })
        }

        const freeTrial = await checkApiLimit();
        const isPro = await checkSubscription();
        if(!freeTrial && !isPro){
            return new NextResponse("Free trial has expired", { status: 403 })
        }

        const response = await openai.images.generate({
            prompt: prompt,
            n: parseInt(amount, 10),
            size: resolution
        });

        if(!isPro){
        await increaseApiLimit();
        }

        return NextResponse.json(response.data); // Modification ici
    }catch(error){
        console.log("[IMAGE-ERROR]", error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}
