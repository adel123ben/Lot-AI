import * as z from "zod";

export const formSchema = z.object({
    prompt: z.string().min(1, { message: "Please enter a description for your image." }).max(500),
    amount: z.string().min(1, { message: "Please enter a description for your image." }),
    resolution: z.string().min(1, { message: "Please select a resolution." }),
  })

  export const amouthOption = [
    {
      value: "1",
      label: "1 photo",
    },
    {
      value: "2",
      label: "2 photos",
    },
    {
      value: "3",
      label: "3 photos",
    },
    {
      value: "4",
      label: "4 photos",
    },
    {
      value: "5",
      label: "5 photos",
    },
  ]

  export const resolutionOption = [
    {
      value: "256x256",
      label: "256x256",
    },
    {
      value: "512x512",
      label: "512x512",
    },
    {
      value: "1024x1024",
      label: "1024x1024",
    }
  ]