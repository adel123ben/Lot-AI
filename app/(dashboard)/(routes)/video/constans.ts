import * as z from "zod";

export const formSchema = z.object({
    prompt: z.string().min(1, { message: "description for your video is required." }).max(500),
  })