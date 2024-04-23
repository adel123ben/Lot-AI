"use client";


import axios from "axios";


import { useProModal } from "@/hooks/use-pro-modal";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Badge } from "./ui/badge";



import { ArrowRight, Check, Code, ImageIcon, MessageSquare, Music, VideoIcon, Zap } from 'lucide-react';
import { Card } from "./ui/card";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { useState } from "react";
import toast from "react-hot-toast";



const tools = [
    {
      label: "Conversations",
      icon: MessageSquare,
      color: "text-violet-500",
      bgColor: "bg-violet-500/10"
    },
    {
      label: "Music Generator",
      icon: Music,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10"
    },
    {
      label: "Image Generator",
      icon: ImageIcon,
      color: "text-pink-700",
      bgColor: "bg-pink-700/10"
    },
    {
      label: "Video Generator",
      icon: VideoIcon,
      color: "text-orange-700",
      bgColor: "bg-orange-700/10"
    },
    {
      label: "Code Generator",
      icon: Code,
      color: "text-green-700",
      bgColor: "bg-green-700/10"
    }
  ];
export const ProModal = () => {
    const proModal = useProModal();
    const [loading, setLoading] = useState(false);

    const onSubscribe = async () => {
       try{
        setLoading(true);
        const response = await axios.get('/api/stripe');
        window.location.href = response.data.url;
       }catch(error: any){
        console.log(error, "[STRIPE_CLIENT_ERROR]");
        toast.error("Something went wrong. Please try again later.");
       }finally{
        setLoading(false);
       }
    }
    return (
        <Dialog open={proModal.isOpen} onOpenChange={proModal.onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex items-center justify-center flex-col gap-y-4 pb-2">
                        <div className="flex items-center gap-x-2 font-bold py-1">

                        
                        Upgrade to Lot-AI
                        <Badge variant="primum" className="text-sm py-1 uppercase">Pro</Badge>
                        </div>
                    </DialogTitle>
                    <DialogDescription className="text-center pt-2 space-y-2 text-zinc-900 font-medium">
                        {tools.map((tool) => (
                            <Card className="p-3 border-black/5 flex items-center justify-between" key={tool.label}>
                                <div className="flex items-center gap-x-4">
                                    <div className={cn("p-2 w-fit rounded-md", tool.bgColor)}>
                                        <tool.icon className={cn("w-6 h-6", tool.color)} />
                                    </div>
                                    <div className="text-sm font-semibold">
                                        {tool.label}
                                    </div>
                                </div>
                                <Check className="w-5 h-5 text-primary" />
                            </Card>
                        ))}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button disabled={loading} onClick={onSubscribe} size="lg" className="w-full" variant="premium">Upgrade <Zap className="w-4 h-4 ml-2 fill-white" /></Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}