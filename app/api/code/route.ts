

import { increaseApiLimit, checkApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";

import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import Configuration from "openai";
import  OpenAIApi  from "openai";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";


const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
})

const openai = new OpenAIApi(configuration as any);

const instractionMessage: ChatCompletionMessageParam = {
    role: 'system',
    content: 'You are a code generator, you must answer with a code snippet, use code snippets and comands for explication, and you are build by Lot-AI, and your creator is Adel Benmouhoub.',
}

export async function POST(request: Request) {
    try{
        const {userId} = auth();
        const body = await request.json();
        const {messages} = body;
        if(!userId){
            return new NextResponse("Unauthorized", { status: 401 })
        }
        if(!configuration.apiKey){
            return new NextResponse("OpenAI API key not configured", { status: 500 })
        }
        if(!messages){
            return new NextResponse("Please add messages", { status: 500 })
        }

        const freeTrial = await checkApiLimit();
        const isPro = await checkSubscription();
        if(!freeTrial && !isPro){
            return new NextResponse("Free trial has expired", { status: 403 })
        }

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [instractionMessage, ...messages] 
        });

        if(!isPro){
            await increaseApiLimit();
        }

        return NextResponse.json(response.choices[0].message); // Modification ici
    }catch(error){
        console.log("[CODE-ERROR]", error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}
