"use client"

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const testimonials = [
    {
        name: "Antonio",
        avatar: "A",
        title: "Software Engineer",
        description: "the best Ai tool", 
    },
    {
        name: "Adem",
        avatar: "A",
        title: "Ui Designer",
        description: "this made my life easy", 
    },
    {
        name: "Adel",
        avatar: "A",
        title: "Mobile Developer",
        description: "best tool for my job", 
    },
    {
        name: "Mark",
        avatar: "A",
        title: "DevOps Engineer",
        description: "make me so faster and easier",  
    }
]

const LandingContent = () => {
    return ( 
        <div className="px-10 pb-20">
            <h2 className="text-center text-4xl text-white font-extrabold mb-10">
                Testimonials
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {testimonials.map((item) => (
                    <Card key={item.description} className="bg-[#192339] border-none text-white">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-x-2">
                                <div>
                                    <p className="text-lg">
                                        {item.name}
                                    </p>
                                    <p className="text-sm  text-zinc-400">
                                        {item.title}
                                    </p>
                                </div>
                            </CardTitle>
                            <CardContent className="pt-4 px-0">
                                {item.description}
                            </CardContent>
                        </CardHeader>
                    </Card>
                ))}
            </div>
        </div>
     );
}
 
export default LandingContent;