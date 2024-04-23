import Image from "next/image";

export const Loader = () => {
    return ( 
        <div className="h-full flex flex-col items-center justify-center gap-y-4">
            <div className="w-16 h-16 relative animate-spin">
                <Image 
                alt="logo"
                fill
                src="/logo.png"
                />
            </div>
            <p className="text-sm text-muted-foreground">
                Lot-AI is thinking... 🤔🤔
            </p>
        </div>
     );
}
 
