"use client";


import * as z from 'zod'
import { formSchema } from './constans';
import axios from "axios";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";


import { Heading } from '@/components/heading'
import { MessageSquare } from 'lucide-react'
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


const  ConversationsPage = () => {
  const proModal = useProModal();
  const router = useRouter();
  const [messages, setMessages] = useState<ChatCompletionMessageParam[]>([]);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: '',
        },
    });

    const loading = form.formState.isSubmitting;
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try{
          const usrMessage: ChatCompletionMessageParam = {
            role: 'user',
            content: values.prompt,
          }
          const newMessages = [...messages, usrMessage];
          const response = await axios.post('/api/conversations', {
            messages: newMessages,
          });
          setMessages((current) => [...current, usrMessage, response.data]);
          form.reset();
        }catch(error: any){
            if(error?.response?.status === 403){
                proModal.onOpen();
            }else{
                console.log("[CONVERSATION-ERROR]", error)
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
      title='Conversations'
      description='Chat with the smartest AI - Explore the power of AI.'
      icon={MessageSquare}
      iconColor='text-violet-500'
      bgColor='bg-violet-500/10'
      />
      <div className='px-4 lg:px-8'>
        <div>
          <Form {...form}>
            <form className='rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2' onSubmit={form.handleSubmit(onSubmit)}>
                <FormField  name='prompt' render={({field}) => (
                    <FormItem className='col-span-12 lg:col-span-10'>
                        <FormControl className='m-0 p-0'>
                            <Input {...field} disabled={loading} className='border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent' placeholder='Enter your message here...' />
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
          {messages.length === 0 && !loading && (
            <Empty label='Start a conversation 🙋‍♂️' />
          )}
          <div className='flex flex-col-reverse gap-y-4'>
          {messages.map((message, index) => (
        <div className={cn("p-8 flex w-full items-start gap-x-8 rounded-lg", message.role === 'user' ? "bg-white border border-black/10" : "bg-muted")} key={index}>
          {message.role === "user" ? <UserAvatar /> : <BotAvatar />}
      <p className='text-sm'>
      {renderMessageContent(message.content)}
      </p>
    </div>
  ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConversationsPage
