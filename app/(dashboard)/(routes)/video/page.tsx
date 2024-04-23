"use client";


import * as z from 'zod'
import { formSchema } from './constans';
import axios from "axios";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";


import { Heading } from '@/components/heading'
import { Music, Video, VideoIcon } from 'lucide-react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Empty } from '@/components/empty';
import { Loader } from '@/components/loader';
import { cn } from '@/lib/utils';
import { UserAvatar } from '@/components/user-avatar';
import { BotAvatar } from '@/components/bot-avatar';
import { useProModal } from '@/hooks/use-pro-modal';
import toast from 'react-hot-toast';


const  VideoPage = () => {
  const router = useRouter();
  const proModal = useProModal();
  const [video, setVideo] = useState<string>();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: '',
        },
    });

    const loading = form.formState.isSubmitting;
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try{
          setVideo(undefined);
          const response = await axios.post('/api/video', values);

          setVideo(response.data[0]);
          form.reset();
        }catch(error: any){
          if(error?.response?.status === 403){
            proModal.onOpen();
        }else{
            console.log("[VIDEO-ERROR]", error)
            toast.error("Something went wrong. Please try again later.");
        }
        }finally{
            router.refresh();
        }
    }






    function renderMessageContent(content: ChatCompletionMessageParam['content']) {
      if (typeof content === 'string') {
        return <span>{content}</span>;
      } else if (Array.isArray(content)) {
        // Ici, tu dois déterminer comment tu veux traiter les différentes parties du contenu
        return content.map((part, index) => {
          if ('text' in part) {
            return <span key={index}>{part.text}</span>;
          }
          // Ajoute d'autres cas au besoin, en fonction de la structure de ChatCompletionContentPart
        });
      } else {
        return <span>Content unavailable</span>;
      }
    }
  return (
    <div>
      <Heading
      title='Video Generator'
      description='Generate a powerful video using Lot-AI.'
      icon={VideoIcon}
      iconColor='text-orange-700'
      bgColor='bg-orange-700/10'
      />
      <div className='px-4 lg:px-8'>
        <div>
          <Form {...form}>
            <form className='rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2' onSubmit={form.handleSubmit(onSubmit)}>
                <FormField  name='prompt' render={({field}) => (
                    <FormItem className='col-span-12 lg:col-span-10'>
                        <FormControl className='m-0 p-0'>
                            <Input {...field} disabled={loading} className='border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent' placeholder='Enter a prompt to generate a video...' />
                        </FormControl>
                        <FormMessage className='m-0 p-0' />
                    </FormItem>
                )} />
                <Button  className='col-span-12 lg:col-span-2 w-full' disabled={loading}>Send</Button>
            </form>
          </Form>
        </div>
        <div className='mt-4 space-y-4'>
          {loading && (
            <div className='p-8 rounded-lg w-full flex items-center justify-center bg-muted'>
              <Loader />
            </div>
          )}
          {!video && !loading && (
            <Empty label='No video generated yet.' />
          )}
          {video &&  (
            <video className='w-full aspect-video mt-8 rounded-lg border bg-black' controls>
              <source src={video} />
            </video>
          )}
        </div>
      </div>
    </div>
  )
}

export default VideoPage
