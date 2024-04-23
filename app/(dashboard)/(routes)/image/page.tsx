"use client";


import * as z from 'zod'
import { formSchema, amouthOption, resolutionOption } from './constans';
import axios from "axios";



import { Heading } from '@/components/heading'
import { Download, ImageIcon } from 'lucide-react'
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardFooter } from '@/components/ui/card';
import Image from 'next/image';
import { useProModal } from '@/hooks/use-pro-modal';
import toast from 'react-hot-toast';


const  ImagePage = () => {
  const router = useRouter();
  const proModal = useProModal();
  const [images, setImages] = useState<string[]>([]);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: '',
            amount: "1",
            resolution: '512x512',
        },
    });

    const loading = form.formState.isSubmitting;
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try{
          setImages([]);
          const response = await axios.post('/api/image', values)

          const urls = response.data.map((image: { url: string }) => image.url);

          setImages(urls);
          form.reset();
        }catch(error: any){
          if(error?.response?.status === 403){
            proModal.onOpen();
        }else{
            console.log("[IMAGE-ERROR]", error)
            toast.error("Something went wrong. Please try again later.");
        }
        }finally{
            router.refresh();
        }
    }






    // function renderMessageContent(content: ChatCompletionMessageParam['content']) {
    //   if (typeof content === 'string') {
    //     return <span>{content}</span>;
    //   } else if (Array.isArray(content)) {
    //     // Ici, tu dois déterminer comment tu veux traiter les différentes parties du contenu
    //     return content.map((part, index) => {
    //       if ('text' in part) {
    //         return <span key={index}>{part.text}</span>;
    //       }
    //       // Ajoute d'autres cas au besoin, en fonction de la structure de ChatCompletionContentPart
    //     });
    //   } else {
    //     return <span>Content unavailable</span>;
    //   }
    // }
  return (
    <div>
      <Heading
      title='Image Generation'
      description='Generate an image based on your prompt and style using Lot-AI.'
      icon={ImageIcon}
      iconColor='text-pink-700'
      bgColor='bg-pink-700/10'
      />
      <div className='px-4 lg:px-8'>
        <div>
          <Form {...form}>
            <form className='rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2' onSubmit={form.handleSubmit(onSubmit)}>
                <FormField   name='prompt' render={({field}) => (
                    <FormItem className='col-span-12 lg:col-span-6'>
                        <FormControl className='m-0 p-0'>
                            <Input {...field} disabled={loading} className='border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent' placeholder='a image of a dog sleeping...' />
                        </FormControl>
                        <FormMessage className='m-0 p-0' />
                    </FormItem>

                    
                )} />
                <FormField  control={form.control} name='amount' render={({field}) => (
                  <FormItem className='col-span-12 lg:col-span-2'>
                    <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value} >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue defaultValue={field.value} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {amouthOption.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )} />
                 <FormField  control={form.control} name='resolution' render={({field}) => (
                  <FormItem className='col-span-12 lg:col-span-2'>
                    <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value} >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue defaultValue={field.value} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {resolutionOption.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )} />
                <Button  className='col-span-12 lg:col-span-2 w-full' disabled={loading}>Send</Button>
            </form>
          </Form>
        </div>
        <div className='mt-4 space-y-4'>
          {loading && (
            <div className='p-20'>
              <Loader />
            </div>
          )}
          {images.length === 0 && !loading && (
            <Empty label='No images generated.' />
          )}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8'>
            {images.map((src) => (
              <Card key={src} className='rounded-lg overflow-hidden'>
                <div className='relative aspect-square'>
                  <Image
                  alt='image'
                  fill
                  src={src}
                  />
                </div>
                <CardFooter className='p-2'>
                  <Button onClick={() => window.open(src)} variant="secondary" className='w-full'>
                    <Download className='w-4 h-4 mr-2' />
                    Download
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImagePage
